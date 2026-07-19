import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

/** Shared request guards for the POST/DELETE API surface. */

const MAX_BODY_BYTES = 4096;

/**
 * Rejects cross-site posts (browser sends Origin/Sec-Fetch-Site on CORS and
 * form posts), wrong content types, and oversized bodies before any parsing.
 * Returns a response to short-circuit with, or null to proceed.
 */
export function guardMutation(req: NextRequest): NextResponse | null {
  const secFetchSite = req.headers.get("sec-fetch-site");
  if (secFetchSite && secFetchSite !== "same-origin" && secFetchSite !== "none") {
    return NextResponse.json({ error: "cross-site request refused" }, { status: 403 });
  }

  const origin = req.headers.get("origin");
  if (origin) {
    const host = req.headers.get("host");
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ error: "cross-origin request refused" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "bad origin" }, { status: 400 });
    }
  }

  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "expected application/json" }, { status: 415 });
  }

  const length = Number(req.headers.get("content-length") ?? "0");
  if (!Number.isFinite(length) || length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "body too large" }, { status: 413 });
  }

  return null;
}

/** Client IP for rate limiting: prefer platform-set headers over spoofable ones. */
export function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "local"
  );
}

/** Constant-time comparison so the admin token can't be probed byte by byte. */
export function tokenMatches(provided: string | null, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Standard headers for every API response: never cached, never indexed. */
export function apiHeaders(): Record<string, string> {
  return { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
}
