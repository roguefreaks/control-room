import { NextRequest, NextResponse } from "next/server";
import { signalSchema, deleteSignalSchema } from "@/lib/schemas";
import { createRateLimiter } from "@/lib/rate-limit";
import { containsProfanity } from "@/lib/profanity";
import { hashIp } from "@/lib/visitors";
import { insertSignal, listSignals, deleteSignal } from "@/lib/guestbook";
import { notifySignal } from "@/lib/notify";
import { apiHeaders, clientIp, guardMutation, tokenMatches } from "@/lib/api-guard";

export const runtime = "nodejs";

// 3 signals per IP per 10 minutes: a guestbook, not a chat room.
const postLimiter = createRateLimiter({ max: 3, windowMs: 10 * 60_000 });
const readLimiter = createRateLimiter({ max: 60, windowMs: 60_000 });

export async function GET(req: NextRequest) {
  const rl = readLimiter.check(hashIp(clientIp(req)));
  if (!rl.ok) {
    return NextResponse.json({ error: "rate limited" }, { status: 429, headers: apiHeaders() });
  }
  const signals = await listSignals();
  return NextResponse.json(
    { configured: signals !== null, signals: signals ?? [] },
    { headers: apiHeaders() },
  );
}

export async function POST(req: NextRequest) {
  const guarded = guardMutation(req);
  if (guarded) return guarded;

  const ipHash = hashIp(clientIp(req));
  const rl = postLimiter.check(ipHash);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate limited: the board accepts 3 signals per 10 minutes" },
      {
        status: 429,
        headers: { ...apiHeaders(), "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) },
      },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = signalSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0]?.message ?? "invalid signal";
    return NextResponse.json({ error: issue }, { status: 400, headers: apiHeaders() });
  }

  const { name, message } = parsed.data;
  if (containsProfanity(name) || containsProfanity(message)) {
    return NextResponse.json(
      { error: "signal rejected by the content filter" },
      { status: 422, headers: apiHeaders() },
    );
  }

  const signal = await insertSignal(name, message, ipHash);
  if (!signal) {
    return NextResponse.json({ error: "signal board offline" }, { status: 503, headers: apiHeaders() });
  }
  await notifySignal(name, message);
  return NextResponse.json({ signal }, { status: 201, headers: apiHeaders() });
}

/** Admin moderation: DELETE with x-admin-token header + { id } body. */
export async function DELETE(req: NextRequest) {
  const guarded = guardMutation(req);
  if (guarded) return guarded;

  if (!tokenMatches(req.headers.get("x-admin-token"), process.env.ADMIN_TOKEN)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: apiHeaders() });
  }
  const body = await req.json().catch(() => null);
  const parsed = deleteSignalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid id" }, { status: 400, headers: apiHeaders() });
  }
  const ok = await deleteSignal(parsed.data.id);
  return NextResponse.json({ ok }, { status: ok ? 200 : 500, headers: apiHeaders() });
}
