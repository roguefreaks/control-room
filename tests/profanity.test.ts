import { describe, expect, it } from "vitest";
import { containsProfanity } from "@/lib/profanity";

describe("profanity filter", () => {
  it("flags plain and leetspeak profanity", () => {
    expect(containsProfanity("this is shit")).toBe(true);
    expect(containsProfanity("sh1t happens")).toBe(true);
    expect(containsProfanity("what the fuuuuck")).toBe(true);
  });

  it("flags Hinglish profanity", () => {
    expect(containsProfanity("kya chutiya site hai")).toBe(true);
  });

  it("does not flag innocent words containing substrings", () => {
    expect(containsProfanity("great class on assessment")).toBe(false);
    expect(containsProfanity("I passed my exams")).toBe(false);
    expect(containsProfanity("Nice work, hire this person")).toBe(false);
  });
});
