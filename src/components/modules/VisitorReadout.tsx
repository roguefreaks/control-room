"use client";

import { useConsole } from "@/components/console/ConsoleProvider";
import { Ticker } from "@/components/ui/Ticker";

/** Live visitor telemetry strip. Hides itself when Supabase isn't configured. */
export function VisitorReadout() {
  const { visitorNumber, todayCount, totalCount, telemetryConfigured } = useConsole();

  if (!telemetryConfigured || visitorNumber === null) return null;

  const cells: { label: string; value: number | null }[] = [
    { label: "you are visitor # (today)", value: visitorNumber },
    { label: "visitors today", value: todayCount },
    { label: "visitors all-time", value: totalCount },
  ];

  return (
    <div className="module reveal mt-6 p-5">
      <span className="tick" aria-hidden />
      <p className="readout text-muted">VISITOR TELEMETRY — ANONYMOUS COUNTERS ONLY</p>
      <dl className="mt-3 grid grid-cols-3 gap-px border border-line bg-line">
        {cells.map((c) => (
          <div key={c.label} className="bg-surface p-3 sm:p-4">
            <dt className="readout text-muted">{c.label}</dt>
            <dd className="mt-1 font-mono text-2xl font-semibold text-ink sm:text-3xl">
              {c.value === null ? "—" : <Ticker value={c.value} />}
            </dd>
          </div>
        ))}
      </dl>
      <p className="readout mt-2 text-muted">
        no cookies beyond an anonymous session id. no personal data.
      </p>
    </div>
  );
}
