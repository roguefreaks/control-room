"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { useConsole } from "@/components/console/ConsoleProvider";

/** Cash-drawer style day summary: closes out the visitor's session. */
export function DaySummary() {
  const { state, visitorNumber } = useConsole();
  const [printedAt, setPrintedAt] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPrintedAt(
        new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date()),
      );
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="ticket mx-auto max-w-md p-5 font-mono text-[13px]">
          <p className="readout text-center font-semibold text-ink">
            — DAY SUMMARY —
          </p>
          <p className="readout mt-1 text-center text-muted" suppressHydrationWarning>
            printed {printedAt ?? "…"} IST
          </p>
          <dl className="mt-4 space-y-1.5 text-ink-soft">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">session</dt>
              <dd suppressHydrationWarning>
                {visitorNumber !== null ? `visitor #${visitorNumber}` : "anonymous"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">final state</dt>
              <dd className={state === "SHORTLISTED" ? "text-ok font-semibold" : ""}>
                {state}
                {state === "SHORTLISTED" ? " ✓" : ""}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">systems in production</dt>
              <dd>2</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">operator</dt>
              <dd>{profile.name}</dd>
            </div>
          </dl>
          <p className="mt-4 border-t border-dashed border-line pt-3 text-center text-muted">
            drawer balanced · no variance
          </p>
        </div>

        <p className="readout mt-8 text-center text-muted">
          © {new Date().getFullYear()} {profile.name} · built with Next.js — no
          trackers, no third-party scripts
        </p>
      </div>
    </footer>
  );
}
