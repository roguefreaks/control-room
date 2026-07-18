import { skillGroups } from "@/content/skills";
import { Module } from "./Module";
import { VisitorReadout } from "./VisitorReadout";

/** TELEMETRY — grouped skill readouts (never percentage bars) + live visitor counters. */
export function Telemetry() {
  return (
    <Module id="telemetry" code="MOD-03" title="Telemetry" note="instrument readouts">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g, i) => (
          <section
            key={g.id}
            aria-label={g.label}
            className="module reveal p-4"
            style={{ transitionDelay: `${(i % 3) * 60}ms` }}
          >
            <span className="tick" aria-hidden />
            <div className="flex items-baseline justify-between border-b border-line pb-2">
              <h3 className="readout font-semibold text-ink">{g.label}</h3>
              <span className="readout text-signal-text">{g.unit}</span>
            </div>
            <ul className="mt-3 space-y-1.5">
              {g.items.map((item) => (
                <li key={item} className="flex items-baseline gap-2 font-mono text-[13px] text-ink-soft">
                  <span aria-hidden className="text-line-strong">─</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <VisitorReadout />
    </Module>
  );
}
