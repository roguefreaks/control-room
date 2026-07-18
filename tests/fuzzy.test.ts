import { describe, expect, it } from "vitest";
import { fuzzyMatch, fuzzyRank } from "@/lib/fuzzy";

describe("fuzzy matcher", () => {
  it("matches subsequences and rejects non-matches", () => {
    expect(fuzzyMatch("tel", "TELEMETRY — skills")).not.toBeNull();
    expect(fuzzyMatch("dply", "DEPLOYMENTS")).not.toBeNull();
    expect(fuzzyMatch("zzz", "DEPLOYMENTS")).toBeNull();
  });

  it("prefers prefix and word-boundary matches", () => {
    const prefix = fuzzyMatch("dep", "deployments")!;
    const scattered = fuzzyMatch("dep", "amended prose")!;
    expect(prefix.score).toBeGreaterThan(scattered.score);
  });

  it("empty query matches everything with zero score", () => {
    expect(fuzzyMatch("", "anything")).toEqual({ score: 0, positions: [] });
  });

  it("ranks a corpus by score", () => {
    const items = ["Download resume", "DEPLOYMENTS", "Toggle theme"];
    const ranked = fuzzyRank("de", items, (s) => s);
    expect(ranked[0].item).toBe("DEPLOYMENTS");
    expect(ranked.some((r) => r.item === "Toggle theme")).toBe(false);
  });
});
