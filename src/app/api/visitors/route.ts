import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { beaconSchema } from "@/lib/schemas";
import { createRateLimiter } from "@/lib/rate-limit";
import { hashIp, recordSection, recordVisit } from "@/lib/visitors";
import { isTelemetryConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

const limiter = createRateLimiter({ max: 30, windowMs: 60_000 });

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "local"
  );
}

export async function POST(req: NextRequest) {
  const ipHash = hashIp(clientIp(req));
  const rl = limiter.check(ipHash);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate limited" },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = beaconSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid beacon" }, { status: 400 });
  }

  if (parsed.data.type === "section") {
    await recordSection(parsed.data.section);
    return NextResponse.json({ ok: true });
  }

  // type === "visit": count once per session via an opaque, httpOnly cookie.
  const existing = req.cookies.get("cr_sid")?.value;
  const isNewSession = !existing;
  const stats = await recordVisit(isNewSession);

  const res = NextResponse.json({
    configured: isTelemetryConfigured(),
    visitorNumber: stats.visitorNumber,
    today: stats.today,
    total: stats.total,
  });
  if (isNewSession) {
    res.cookies.set("cr_sid", randomUUID(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 12,
      path: "/",
    });
  }
  return res;
}
