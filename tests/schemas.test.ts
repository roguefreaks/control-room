import { describe, expect, it } from "vitest";
import { beaconSchema, deleteSignalSchema, signalSchema } from "@/lib/schemas";

describe("signal schema", () => {
  it("accepts a normal signal", () => {
    const r = signalSchema.safeParse({ name: "Priya", message: "Clean console. Hired?" });
    expect(r.success).toBe(true);
  });

  it("trims and enforces length bounds", () => {
    expect(signalSchema.safeParse({ name: " A ", message: "hey" }).success).toBe(false);
    expect(signalSchema.safeParse({ name: "A".repeat(41), message: "hey" }).success).toBe(false);
    expect(
      signalSchema.safeParse({ name: "Priya", message: "x".repeat(141) }).success,
    ).toBe(false);
  });

  it("rejects markup-ish names", () => {
    expect(
      signalSchema.safeParse({ name: "<script>", message: "hello there" }).success,
    ).toBe(false);
  });

  it("rejects a filled honeypot", () => {
    expect(
      signalSchema.safeParse({ name: "Bot", message: "hello there", station: "x" }).success,
    ).toBe(false);
  });

  it("rejects unknown extra keys (strict object)", () => {
    expect(
      signalSchema.safeParse({ name: "Priya", message: "hello there", admin: true }).success,
    ).toBe(false);
  });

  it("strips control and zero-width characters", () => {
    const r = signalSchema.parse({
      name: "Priya",
      message: "hi​there friend",
    });
    expect(r.name).toBe("Priya");
    expect(r.message).toBe("hithere friend");
  });

  it("cannot smuggle length past the cleaner", () => {
    // zero-width padding is stripped before the length check
    expect(
      signalSchema.safeParse({
        name: "Priya",
        message: "x".repeat(139) + "​​",
      }).success,
    ).toBe(true);
    expect(
      signalSchema.safeParse({ name: "Priya", message: "x".repeat(141) }).success,
    ).toBe(false);
  });
});

describe("beacon schema", () => {
  it("accepts visit and known-section beacons", () => {
    expect(beaconSchema.safeParse({ type: "visit" }).success).toBe(true);
    expect(beaconSchema.safeParse({ type: "section", section: "telemetry" }).success).toBe(true);
  });

  it("rejects unknown sections, extra keys and shapes", () => {
    expect(beaconSchema.safeParse({ type: "section", section: "admin" }).success).toBe(false);
    expect(beaconSchema.safeParse({ type: "visit", extra: 1 }).success).toBe(false);
    expect(beaconSchema.safeParse({ type: "boom" }).success).toBe(false);
    expect(beaconSchema.safeParse(null).success).toBe(false);
  });
});

describe("delete schema", () => {
  it("requires a uuid", () => {
    expect(deleteSignalSchema.safeParse({ id: "not-a-uuid" }).success).toBe(false);
    expect(
      deleteSignalSchema.safeParse({ id: "9b2b3a1e-8c4d-4f6a-9d2e-1a2b3c4d5e6f" }).success,
    ).toBe(true);
  });
});
