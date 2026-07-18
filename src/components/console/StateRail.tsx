"use client";

import { VISITOR_STATES, rank, type VisitorState } from "@/lib/state-machine";
import { useConsole } from "./ConsoleProvider";

const STATE_TARGET: Record<VisitorState, string> = {
  RECEIVED: "#top",
  REVIEWING: "#operations",
  EVALUATING: "#telemetry",
  SHORTLISTED: "#comms",
};

const STATE_HINT: Record<VisitorState, string> = {
  RECEIVED: "you arrived",
  REVIEWING: "read the operations record",
  EVALUATING: "inspect telemetry + audit log",
  SHORTLISTED: "make contact",
};

/**
 * The hero's interactive rail: the same order pipeline the real systems use,
 * applied to the visitor's session. The marker travels as they scroll;
 * each state is a working link into the console.
 */
export function StateRail() {
  const { state } = useConsole();
  const currentRank = rank(state);

  return (
    <div className="module p-4 sm:p-5" role="group" aria-label="Your session, as an order">
      <span className="tick" aria-hidden />
      <div className="flex items-baseline justify-between gap-3">
        <p className="readout text-muted">ORDER PIPELINE — THIS VISIT</p>
        <p className="readout hidden text-ink-soft sm:block">forward-only · server-refereed</p>
      </div>

      <ol className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
        {VISITOR_STATES.map((s, i) => {
          const done = i < currentRank;
          const active = i === currentRank;
          return (
            <li key={s} className="relative">
              {i > 0 && (
                <span
                  aria-hidden
                  className={`absolute -left-4 top-[7px] hidden h-px w-4 sm:block ${
                    i <= currentRank ? "bg-signal" : "bg-line"
                  }`}
                />
              )}
              <a
                href={STATE_TARGET[s]}
                className="group block no-underline"
                aria-current={active ? "step" : undefined}
              >
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={`inline-block h-[9px] w-[9px] rounded-full border transition-colors ${
                      active
                        ? "border-signal bg-signal"
                        : done
                          ? "border-signal bg-signal/40"
                          : "border-line-strong bg-transparent group-hover:border-signal"
                    }`}
                  />
                  <span
                    className={`readout font-semibold transition-colors ${
                      active ? "text-signal-text" : done ? "text-ink" : "text-muted"
                    } group-hover:text-signal-text`}
                  >
                    {s}
                    {done ? " ✓" : ""}
                  </span>
                </span>
                <span className="mt-1 block pl-[17px] text-xs text-muted">
                  {STATE_HINT[s]}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
