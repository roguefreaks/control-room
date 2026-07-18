import { describe, expect, it } from "vitest";
import { createRateLimiter } from "@/lib/rate-limit";

function fixedClock(start = 0) {
  let t = start;
  return { now: () => t, tick: (ms: number) => (t += ms) };
}

describe("sliding-window rate limiter", () => {
  it("allows up to max requests inside the window", () => {
    const clock = fixedClock();
    const rl = createRateLimiter({ max: 3, windowMs: 1000 }, clock.now);
    expect(rl.check("a").ok).toBe(true);
    expect(rl.check("a").ok).toBe(true);
    expect(rl.check("a").ok).toBe(true);
    expect(rl.check("a").ok).toBe(false);
  });

  it("reports remaining quota and retry-after", () => {
    const clock = fixedClock(10_000);
    const rl = createRateLimiter({ max: 2, windowMs: 1000 }, clock.now);
    expect(rl.check("a").remaining).toBe(1);
    expect(rl.check("a").remaining).toBe(0);
    const denied = rl.check("a");
    expect(denied.ok).toBe(false);
    expect(denied.retryAfterMs).toBeGreaterThan(0);
    expect(denied.retryAfterMs).toBeLessThanOrEqual(1000);
  });

  it("frees quota as the window slides", () => {
    const clock = fixedClock();
    const rl = createRateLimiter({ max: 2, windowMs: 1000 }, clock.now);
    rl.check("a");
    clock.tick(600);
    rl.check("a");
    expect(rl.check("a").ok).toBe(false);
    clock.tick(500); // first hit now outside window
    expect(rl.check("a").ok).toBe(true);
    expect(rl.check("a").ok).toBe(false);
  });

  it("isolates keys", () => {
    const clock = fixedClock();
    const rl = createRateLimiter({ max: 1, windowMs: 1000 }, clock.now);
    expect(rl.check("a").ok).toBe(true);
    expect(rl.check("b").ok).toBe(true);
    expect(rl.check("a").ok).toBe(false);
  });
});
