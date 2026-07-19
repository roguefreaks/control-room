import { client, systems } from "@/content/systems";
import { Module } from "./Module";
import { Ticker } from "@/components/ui/Ticker";

const STATS = [
  { value: 100, suffix: "+", label: "orders/day combined" },
  { value: 2, suffix: "", label: "systems in production" },
  { value: 41, suffix: "", label: "versioned migrations" },
  { value: 30, suffix: "", label: "screens shipped" },
] as const;

/** OPERATIONS — the freelance role as an operations record. */
export function Operations() {
  return (
    <Module id="operations" code="MOD-01" title="Operations" note="experience record">
      <div className="module reveal p-5 sm:p-7">
        <span className="tick" aria-hidden />
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-4">
          <div>
            <p className="readout text-muted">ACTIVE ENGAGEMENT</p>
            <h3 className="mt-1 font-display text-xl font-bold text-ink sm:text-2xl">
              {client.role}, {client.name}
            </h3>
          </div>
          <p className="readout text-ink-soft">
            {client.period} · {client.place} · {client.mode}
          </p>
        </div>

        <p className="mt-5 max-w-3xl leading-relaxed text-ink-soft">
          The hospital needed its canteen and laundry running on software instead
          of paper. I designed, built and now operate both platforms end to end:
          schema, auth, payments, staff tooling, deploys and incident response.
          Orders placed by real customers move through state machines I wrote,
          every day.
        </p>

        <dl className="mt-7 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-surface p-4">
              <dt className="readout text-muted">{s.label}</dt>
              <dd className="mt-1 font-mono text-3xl font-semibold text-ink">
                <Ticker value={s.value} />
                {s.suffix}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {systems.map((s) => (
            <a
              key={s.id}
              href={`#deployments`}
              className="group border border-line bg-paper p-4 no-underline transition-colors hover:border-signal"
            >
              <p className="readout text-signal-text">{s.ticket}</p>
              <p className="mt-1 font-semibold text-ink group-hover:text-signal-text">
                {s.name}
              </p>
              <p className="mt-1 text-sm text-muted">{s.what}</p>
              <p className="readout mt-3 text-muted">inspect in DEPLOYMENTS ↓</p>
            </a>
          ))}
        </div>
      </div>
    </Module>
  );
}
