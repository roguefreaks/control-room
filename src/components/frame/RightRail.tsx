"use client";

import { useEffect, useRef, useState } from "react";
import type { HealthReading } from "@/lib/health";
import type { DeployEvent } from "@/lib/github";
import { timeAgo } from "@/lib/format";
import { useConsole } from "@/components/console/ConsoleProvider";

const SYSTEM_LABEL: Record<string, string> = {
  "prabhu-dana-pani": "SYS-01 PDP",
  "cascade-coal": "SYS-02 C&C",
};

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** Bezel meter rail: live session + systems readouts, deploy feed, scroll gauge. */
export function RightRail({
  health,
  feed,
}: {
  health: HealthReading[];
  feed: DeployEvent[];
}) {
  const { state, startedAt, visitorNumber } = useConsole();
  const [now, setNow] = useState<number | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);

  useEffect(() => {
    const update = () => setNow(Date.now());
    const first = window.setTimeout(update, 0);
    const t = window.setInterval(update, 1000);

    // scroll gauge writes straight to the DOM — no React work per frame
    const screen = document.getElementById("console-screen");
    const paint = () => {
      if (!screen) return;
      const max = screen.scrollHeight - screen.clientHeight;
      const pct = max > 0 ? Math.round((screen.scrollTop / max) * 100) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${pct / 100})`;
      if (pctRef.current) pctRef.current.textContent = `${pct}%`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(paint);
    };
    screen?.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.clearTimeout(first);
      window.clearInterval(t);
      cancelAnimationFrame(raf.current);
      screen?.removeEventListener("scroll", onScroll);
    };
  }, []);

  const elapsed = now === null ? 0 : Math.max(0, Math.floor((now - startedAt) / 1000));

  return (
    <aside
      aria-label="Live readouts"
      className="hidden w-56 flex-none flex-col gap-4 overflow-y-auto border-l border-line bg-bezel p-3 xl:flex"
    >
      <section aria-label="Session">
        <p className="hairline-label readout text-muted">SESSION</p>
        <p
          className="mt-2 font-mono text-3xl font-semibold tabular-nums text-ink"
          suppressHydrationWarning
        >
          {pad(Math.floor(elapsed / 60))}:{pad(elapsed % 60)}
        </p>
        <dl className="mt-2 space-y-1 font-mono text-[11px] text-ink-soft">
          <div className="flex justify-between">
            <dt className="text-muted">visitor</dt>
            <dd suppressHydrationWarning>{visitorNumber !== null ? `#${visitorNumber}` : "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">state</dt>
            <dd className={state === "SHORTLISTED" ? "text-ok" : "text-signal-text"}>
              {state}
            </dd>
          </div>
        </dl>
      </section>

      <section aria-label="Production systems">
        <p className="hairline-label readout text-muted">SYSTEMS</p>
        <ul className="mt-2 space-y-1.5">
          {health.map((h) => (
            <li
              key={h.id}
              className="flex items-center justify-between font-mono text-[11px] text-ink-soft"
            >
              <span className="flex items-center gap-1.5">
                <span className="status-dot" data-live={h.status === "LIVE"} aria-hidden />
                {SYSTEM_LABEL[h.id] ?? h.id}
              </span>
              <span className={h.status === "LIVE" ? "text-ok" : "text-warn"}>
                {h.status === "LIVE" && h.ms !== null ? `${h.ms}ms` : h.status}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Recent deploys" className="min-h-0 flex-1">
        <p className="hairline-label readout text-muted">FEED</p>
        {feed.length === 0 ? (
          <p className="readout mt-2 text-muted">quiet window</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {feed.slice(0, 5).map((e) => (
              <li key={e.id} className="font-mono text-[10.5px] leading-snug">
                <span className="text-muted">{timeAgo(e.at)} · </span>
                <span className="text-signal-text">{e.repo}</span>
                <span className="block truncate text-ink-soft">{e.message}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-label="Scroll position">
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 border border-line bg-surface">
            <div
              ref={barRef}
              className="h-full origin-left bg-signal"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <span ref={pctRef} className="readout w-9 text-right tabular-nums text-muted">
            0%
          </span>
        </div>
      </section>
    </aside>
  );
}
