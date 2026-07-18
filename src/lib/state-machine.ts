/**
 * The visitor-session state machine. A visit is treated as an order moving
 * through the same shape of pipeline as the real systems: forward-only,
 * transition-gated, never regressing. Pure module — unit tested.
 */
export const VISITOR_STATES = ["RECEIVED", "REVIEWING", "EVALUATING", "SHORTLISTED"] as const;
export type VisitorState = (typeof VISITOR_STATES)[number];

export const SECTION_IDS = [
  "operations",
  "deployments",
  "telemetry",
  "audit",
  "incidents",
  "comms",
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

/** Reaching a section grants at most this state. SHORTLISTED is action-only. */
export const SECTION_STATE: Record<SectionId, Exclude<VisitorState, "SHORTLISTED">> = {
  operations: "REVIEWING",
  deployments: "REVIEWING",
  telemetry: "EVALUATING",
  audit: "EVALUATING",
  incidents: "EVALUATING",
  comms: "EVALUATING",
};

export function rank(state: VisitorState): number {
  return VISITOR_STATES.indexOf(state);
}

/** Forward-only merge: the machine never moves backwards. */
export function advance(current: VisitorState, candidate: VisitorState): VisitorState {
  return rank(candidate) > rank(current) ? candidate : current;
}

export function isSectionId(value: string): value is SectionId {
  return (SECTION_IDS as readonly string[]).includes(value);
}

/**
 * Resolve the state for a set of visited sections. `contacted` (copied the
 * email, opened mailto, downloaded the resume, left a signal) is the only
 * way to reach SHORTLISTED.
 */
export function stateForSections(
  visited: Iterable<string>,
  contacted = false,
): VisitorState {
  if (contacted) return "SHORTLISTED";
  let state: VisitorState = "RECEIVED";
  for (const section of visited) {
    if (isSectionId(section)) state = advance(state, SECTION_STATE[section]);
  }
  return state;
}

export function nextState(state: VisitorState): VisitorState | null {
  const i = rank(state);
  return i >= 0 && i < VISITOR_STATES.length - 1 ? VISITOR_STATES[i + 1] : null;
}

export function isTerminal(state: VisitorState): boolean {
  return state === "SHORTLISTED";
}
