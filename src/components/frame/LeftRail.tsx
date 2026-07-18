"use client";

import { useConsole } from "@/components/console/ConsoleProvider";
import type { SectionId } from "@/lib/state-machine";

export const MODULES: { id: SectionId; index: string; label: string }[] = [
  { id: "operations", index: "01", label: "Operations" },
  { id: "deployments", index: "02", label: "Deployments" },
  { id: "telemetry", index: "03", label: "Telemetry" },
  { id: "audit", index: "04", label: "Audit log" },
  { id: "incidents", index: "05", label: "Incidents" },
  { id: "comms", index: "06", label: "Comms" },
];

/** Bezel switch rail: one lit switch per module. */
export function LeftRail() {
  const { activeSection } = useConsole();

  return (
    <nav
      aria-label="Console modules"
      className="hidden w-14 flex-none flex-col items-center border-r border-line bg-bezel py-3 lg:flex"
    >
      <a
        href="#top"
        aria-label="Back to top"
        className="flex h-9 w-9 items-center justify-center border border-line font-mono text-[11px] font-semibold text-signal-text no-underline transition-colors duration-200 hover:border-signal"
      >
        A//
      </a>

      <div className="mt-5 flex flex-col gap-1.5">
        {MODULES.map((m) => {
          const active = activeSection === m.id;
          return (
            <a
              key={m.id}
              href={`#${m.id}`}
              title={m.label}
              aria-label={`${m.label} module`}
              aria-current={active ? "true" : undefined}
              className={`group flex h-11 w-11 flex-col items-center justify-center gap-1 border no-underline transition-colors duration-200 ${
                active
                  ? "border-signal bg-surface"
                  : "border-transparent hover:border-line-strong"
              }`}
            >
              <span className="led" data-on={active} aria-hidden />
              <span
                className={`font-mono text-[10px] tracking-wide transition-colors duration-200 ${
                  active ? "text-signal-text" : "text-muted group-hover:text-ink-soft"
                }`}
              >
                {m.index}
              </span>
            </a>
          );
        })}
      </div>

      <span className="vert readout mt-auto py-2 text-muted" aria-hidden>
        ACHYUT.OPS · SHIFT-2026
      </span>
    </nav>
  );
}
