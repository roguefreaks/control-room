"use client";

import { useEffect, useState } from "react";
import { VISITOR_STATES, rank } from "@/lib/state-machine";
import { useConsole } from "@/components/console/ConsoleProvider";
import { ThemeToggle } from "@/components/console/ThemeToggle";

function istClock(): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

/** Bezel top bar: wordmark, the visitor's order tracker, IST clock, controls. */
export function TopBar() {
  const { state, booted, visitorNumber } = useConsole();
  const [clock, setClock] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setClock(istClock());
    const first = window.setTimeout(update, 0);
    const t = window.setInterval(update, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(t);
    };
  }, []);

  const currentRank = rank(state);

  return (
    <header
      className={`z-30 flex h-12 flex-none items-center gap-3 border-b border-line bg-bezel px-3 sm:px-4 ${
        booted ? "" : "opacity-0"
      }`}
    >
      <a href="#top" className="flex items-center gap-2 no-underline">
        <span className="led" data-ok="true" aria-hidden />
        <span className="stamp text-[13px] tracking-tight text-ink">
          ACHYUT&nbsp;//&nbsp;CONTROL&nbsp;ROOM
        </span>
      </a>

      <nav
        aria-label="Visitor session state"
        className="mx-auto hidden items-center gap-1 md:flex"
      >
        {VISITOR_STATES.map((s, i) => {
          const done = i < currentRank;
          const active = i === currentRank;
          return (
            <span key={s} className="flex items-center gap-1">
              {i > 0 && (
                <span className="text-line-strong" aria-hidden>
                  ▸
                </span>
              )}
              <span
                className={`readout px-1 py-0.5 transition-colors duration-200 ${
                  active
                    ? "bg-signal text-white"
                    : done
                      ? "text-signal-text"
                      : "text-muted"
                }`}
              >
                {done ? "✓ " : ""}
                {s}
              </span>
            </span>
          );
        })}
      </nav>

      <span className="readout mx-auto bg-signal px-1.5 py-0.5 text-white md:hidden">
        {state}
      </span>

      <div className="flex items-center gap-2">
        <span className="readout hidden text-ink-soft lg:inline" suppressHydrationWarning>
          {visitorNumber !== null && `VIS #${visitorNumber} · `}
          IST {clock ?? "--:--:--"}
        </span>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("cr:palette"))}
          className="chip hidden cursor-pointer transition-colors duration-200 hover:border-line-strong hover:text-signal-text md:inline-flex"
          aria-label="Open command palette"
        >
          ⌘K
        </button>
        <ThemeToggle />
      </div>

      <p aria-live="polite" role="status" className="sr-only">
        Visitor session state: {state}
      </p>
    </header>
  );
}
