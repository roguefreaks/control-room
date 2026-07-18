/**
 * Sliding-window in-memory rate limiter, keyed by caller-supplied string
 * (hashed IP). Suits a single-region serverless deployment: each warm lambda
 * keeps its own window, which bounds burst abuse without external state.
 * Pure logic with injectable clock — unit tested.
 */
export type RateLimitResult = { ok: boolean; remaining: number; retryAfterMs: number };

export type RateLimiter = {
  check: (key: string) => RateLimitResult;
  size: () => number;
};

export function createRateLimiter(
  { max, windowMs }: { max: number; windowMs: number },
  now: () => number = Date.now,
): RateLimiter {
  const hits = new Map<string, number[]>();

  function check(key: string): RateLimitResult {
    const t = now();
    const windowStart = t - windowMs;
    const kept = (hits.get(key) ?? []).filter((ts) => ts > windowStart);

    if (kept.length >= max) {
      hits.set(key, kept);
      return { ok: false, remaining: 0, retryAfterMs: kept[0] + windowMs - t };
    }
    kept.push(t);
    hits.set(key, kept);

    // Opportunistic GC so the map can't grow unbounded on a long-lived process.
    if (hits.size > 5000) {
      for (const [k, v] of hits) {
        if (v.every((ts) => ts <= windowStart)) hits.delete(k);
      }
    }
    return { ok: true, remaining: max - kept.length, retryAfterMs: 0 };
  }

  return { check, size: () => hits.size };
}
