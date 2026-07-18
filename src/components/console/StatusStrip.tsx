"use client";

import { useEffect, useState } from "react";
import { VISITOR_STATES, rank } from "@/lib/state-machine";
import { useConsole } from "./ConsoleProvider";
import { ThemeToggle } from "./ThemeToggle";

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function formatElapsed(startedAt: number, now: number): string {
  const s = Math.max(0, Math.floor((now - startedAt) / 1000));
  const m = Math.floor(s / 60);
  return m >= 60
    ? `${pad(Math.floor(m / 60))}:${pad(m % 60)}:${pad(s % 60)}`
    : `${pad(m)}:${pad(s % 60)}`;
}

/**
 * Persistent order tracker for the visitor's own session. Prints in as a
 * ticket after boot; announces state changes via aria-live.
 */
export function StatusStrip() {
  const { state, startedAt, booted, visitorNumber } = useConsole();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setNow(Date.now());
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
      className={`sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur-sm ${
        booted ? "anim-print" : "opacity-0"
      }`}
      style={{ height: "var(--strip-h)" }}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        <a
          href="#top"
          className="readout flex items-center gap-2 font-semibold text-ink no-underline"
        >
          <span className="status-dot" data-live="true" aria-hidden />
          <span className="hidden sm:inline">ACHYUT&nbsp;//&nbsp;CONTROL&nbsp;ROOM</span>
          <span className="sm:hidden">A&nbsp;//&nbsp;CR</span>
        </a>

        <nav
          aria-label="Visitor session state"
          className="mx-auto hidden items-center gap-1.5 md:flex"
        >
          {VISITOR_STATES.map((s, i) => {
            const done = i < currentRank;
            const active = i === currentRank;
            return (
              <span key={s} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-line-strong" aria-hidden>▸</span>}
                <span
                  className={`readout px-1 py-0.5 transition-colors ${
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

        <div className="ml-auto flex items-center gap-2">
          <span className="readout hidden text-ink-soft sm:inline" suppressHydrationWarning>
            {visitorNumber !== null ? `VISITOR #${visitorNumber}` : "VISITOR"}
            {" · "}
            {now ? formatElapsed(startedAt, now) : "00:00"}
          </span>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("cr:palette"))}
            className="chip hidden cursor-pointer transition-colors hover:border-line-strong hover:text-signal-text md:inline-flex"
            aria-label="Open command palette"
          >
            ⌘K
          </button>
          <ThemeToggle />
        </div>
      </div>

      <p aria-live="polite" role="status" className="sr-only">
        Visitor session state: {state}
      </p>
    </header>
  );
}
