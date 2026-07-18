import { describe, expect, it } from "vitest";
import { timeAgo } from "@/lib/format";

describe("timeAgo", () => {
  const now = new Date("2026-07-18T12:00:00Z");

  it("formats each magnitude", () => {
    expect(timeAgo("2026-07-18T11:59:40Z", now)).toBe("just now");
    expect(timeAgo("2026-07-18T11:45:00Z", now)).toBe("15m ago");
    expect(timeAgo("2026-07-18T07:00:00Z", now)).toBe("5h ago");
    expect(timeAgo("2026-07-15T12:00:00Z", now)).toBe("3d ago");
    expect(timeAgo("2026-05-01T12:00:00Z", now)).toBe("2mo ago");
  });

  it("handles bad input gracefully", () => {
    expect(timeAgo("garbage", now)).toBe("—");
  });
});
