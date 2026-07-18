import { incidents } from "@/content/incidents";
import { Module } from "./Module";

/** INCIDENT REPORT — what actually broke, and what it taught. */
export function Incidents() {
  return (
    <Module id="incidents" code="MOD-05" title="Incident report" note="what broke, honestly">
      <p className="reveal max-w-2xl text-sm leading-relaxed text-muted">
        Every running system fails eventually. These are real ones from my
        production work — kept here because how you handle failure says more
        than a feature list.
      </p>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {incidents.map((inc, i) => (
          <article
            key={inc.id}
            className="module reveal flex flex-col p-5"
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <span className="tick" aria-hidden />
            <div className="flex items-center justify-between gap-2">
              <p className="readout text-muted">
                {inc.id} · {inc.date} · {inc.system}
              </p>
              <span
                className={`chip ${
                  inc.severity === "SEV-2"
                    ? "border-bad/40 text-bad"
                    : "border-warn/40 text-warn"
                }`}
              >
                {inc.severity}
              </span>
            </div>
            <h3 className="mt-3 font-semibold leading-snug text-ink">{inc.title}</h3>
            <dl className="mt-3 space-y-3 text-sm leading-relaxed">
              <div>
                <dt className="readout text-bad">what happened</dt>
                <dd className="mt-1 text-ink-soft">{inc.what}</dd>
              </div>
              <div>
                <dt className="readout text-ok">the fix</dt>
                <dd className="mt-1 text-ink-soft">{inc.fix}</dd>
              </div>
            </dl>
            <p className="mt-auto border-t border-dashed border-line pt-3 text-sm italic text-muted">
              {inc.learned}
            </p>
          </article>
        ))}
      </div>
    </Module>
  );
}
