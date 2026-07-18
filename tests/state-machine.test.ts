import { describe, expect, it } from "vitest";
import {
  advance,
  isSectionId,
  isTerminal,
  nextState,
  rank,
  SECTION_IDS,
  SECTION_STATE,
  stateForSections,
  VISITOR_STATES,
} from "@/lib/state-machine";

describe("visitor state machine", () => {
  it("orders states RECEIVED → REVIEWING → EVALUATING → SHORTLISTED", () => {
    expect(VISITOR_STATES).toEqual(["RECEIVED", "REVIEWING", "EVALUATING", "SHORTLISTED"]);
    expect(rank("RECEIVED")).toBeLessThan(rank("REVIEWING"));
    expect(rank("REVIEWING")).toBeLessThan(rank("EVALUATING"));
    expect(rank("EVALUATING")).toBeLessThan(rank("SHORTLISTED"));
  });

  it("advance is forward-only — never regresses", () => {
    expect(advance("EVALUATING", "REVIEWING")).toBe("EVALUATING");
    expect(advance("SHORTLISTED", "RECEIVED")).toBe("SHORTLISTED");
    expect(advance("RECEIVED", "EVALUATING")).toBe("EVALUATING");
    expect(advance("REVIEWING", "REVIEWING")).toBe("REVIEWING");
  });

  it("every section grants a legal, non-terminal state", () => {
    for (const id of SECTION_IDS) {
      expect(rank(SECTION_STATE[id])).toBeGreaterThan(rank("RECEIVED"));
      expect(SECTION_STATE[id]).not.toBe("SHORTLISTED");
    }
  });

  it("resolves the highest state across visited sections", () => {
    expect(stateForSections([])).toBe("RECEIVED");
    expect(stateForSections(["operations"])).toBe("REVIEWING");
    expect(stateForSections(["operations", "telemetry"])).toBe("EVALUATING");
    expect(stateForSections(["telemetry", "operations"])).toBe("EVALUATING");
  });

  it("ignores unknown sections instead of crashing", () => {
    expect(stateForSections(["hacked", "nonsense"])).toBe("RECEIVED");
    expect(isSectionId("operations")).toBe(true);
    expect(isSectionId("hacked")).toBe(false);
  });

  it("SHORTLISTED is reachable only through contact", () => {
    expect(stateForSections(SECTION_IDS)).toBe("EVALUATING");
    expect(stateForSections(SECTION_IDS, true)).toBe("SHORTLISTED");
    expect(stateForSections([], true)).toBe("SHORTLISTED");
  });

  it("nextState walks the pipeline and stops at the end", () => {
    expect(nextState("RECEIVED")).toBe("REVIEWING");
    expect(nextState("EVALUATING")).toBe("SHORTLISTED");
    expect(nextState("SHORTLISTED")).toBeNull();
    expect(isTerminal("SHORTLISTED")).toBe(true);
    expect(isTerminal("RECEIVED")).toBe(false);
  });
});
