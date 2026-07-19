import Image from "next/image";
import { systems, experiments } from "@/content/systems";
import type { HealthReading } from "@/lib/health";
import type { DeployEvent } from "@/lib/github";
import { timeAgo } from "@/lib/format";
import { getProofShots } from "@/lib/proof";
import { Module } from "./Module";

function HealthBadge({ reading }: { reading: HealthReading | undefined }) {
  if (!reading) {
    return <span className="chip text-muted">STATUS UNKNOWN</span>;
  }
  const live = reading.status === "LIVE";
  return (
    <span
      className={`chip ${live ? "border-ok/40 text-ok" : "border-warn/40 text-warn"}`}
      title={`checked ${timeAgo(reading.checkedAt)}`}
    >
      <span className="status-dot" data-live={live} aria-hidden />
      {reading.status}
      {reading.ms !== null && ` · ${reading.ms}ms`}
    </span>
  );
}

/** DEPLOYMENTS — the two production systems as KOT tickets + live deploy feed. */
export function Deployments({
  health,
  feed,
}: {
  health: HealthReading[];
  feed: DeployEvent[];
}) {
  return (
    <Module id="deployments" code="MOD-02" title="Deployments" note="live systems + activity">
      <div className="grid gap-6 lg:grid-cols-2">
        {systems.map((s, i) => (
          <article key={s.id} className="ticket reveal p-5 sm:p-6" style={{ transitionDelay: `${i * 80}ms` }}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-line pb-3">
              <p className="readout font-semibold text-signal-text">
                TICKET {s.ticket}
              </p>
              <HealthBadge reading={health.find((h) => h.id === s.id)} />
            </div>

            <h3 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink">
              {s.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.what}</p>

            <ul className="mt-4 space-y-2.5">
              {s.highlights.map((h) => (
                <li key={h} className="flex gap-2 text-sm leading-snug text-ink-soft">
                  <span className="readout mt-0.5 flex-none text-signal-text">▪</span>
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {s.stack.map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>

            {getProofShots(s.id).length > 0 && (
              <div className="mt-5 border-t border-dashed border-line pt-4">
                <p className="readout text-muted">
                  EVIDENCE · REAL SCREENS, DEMO DATA
                </p>
                <div className="mt-3 flex snap-x gap-3 overflow-x-auto pb-2">
                  {getProofShots(s.id).map((shot) => (
                    <a
                      key={shot.src}
                      href={shot.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group w-56 flex-none snap-start"
                      aria-label={`${s.name}: ${shot.caption}, full size`}
                    >
                      <span className="relative block aspect-video overflow-hidden border border-line bg-paper transition-colors group-hover:border-signal">
                        <Image
                          src={shot.src}
                          alt={`${s.name}: ${shot.caption}`}
                          fill
                          sizes="224px"
                          className="object-cover object-top"
                        />
                      </span>
                      <span className="readout mt-1.5 block truncate text-muted group-hover:text-signal-text">
                        {shot.caption} ↗
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 border-t border-dashed border-line pt-4">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="readout font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:text-signal-text"
              >
                open live system ↗
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* deploy feed */}
      <div className="module reveal mt-6 p-5">
        <span className="tick" aria-hidden />
        <div className="flex items-baseline justify-between gap-3">
          <p className="readout text-muted">DEPLOY FEED · LIVE FROM GITHUB</p>
          <p className="readout text-muted">refreshes every 10 min</p>
        </div>
        {feed.length === 0 ? (
          <p className="readout mt-4 text-muted">
            feed quiet. no events in the last window, but the systems above
            are still running.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-line font-mono text-[13px]">
            {feed.map((e) => (
              <li key={e.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 py-2">
                <span className="readout w-16 flex-none text-muted">{timeAgo(e.at)}</span>
                <span className="flex-none font-semibold text-signal-text">{e.repo}</span>
                <span className="min-w-0 flex-1 truncate text-ink-soft">{e.message}</span>
                <span className="readout hidden flex-none text-muted sm:inline">@{e.account}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* lab experiments — deliberately secondary */}
      <div className="reveal mt-10">
        <p className="hairline-label readout text-muted">
          LAB · SMALLER EXPERIMENTS, NOT ON THE PAGER
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {experiments.map((e) => (
            <article key={e.id} className="border border-line bg-surface p-4">
              <p className="readout text-muted">{e.date ?? "LAB"}</p>
              <h3 className="mt-1 text-sm font-semibold text-ink">{e.name}</h3>
              <p className="mt-1.5 text-[13px] leading-snug text-muted">{e.what}</p>
              <p className="readout mt-3 text-ink-soft">{e.stack.join(" · ")}</p>
            </article>
          ))}
        </div>
      </div>
    </Module>
  );
}
