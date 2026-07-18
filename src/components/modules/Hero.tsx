import { profile } from "@/content/profile";
import { StateRail } from "@/components/console/StateRail";
import type { HealthReading } from "@/lib/health";

/** Landing screen: the console front panel. */
export function Hero({ health }: { health: HealthReading[] }) {
  const liveCount = health.filter((h) => h.status === "LIVE").length;

  return (
    <section id="top" className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-16">
      <div className="readout flex flex-wrap items-center gap-x-4 gap-y-2 text-muted anim-tick-in">
        <span className="flex items-center gap-2">
          <span className="status-dot" data-live={liveCount > 0} aria-hidden />
          {liveCount}/{health.length} SYSTEMS LIVE
        </span>
        <span>OPERATOR: {profile.name.toUpperCase()}</span>
        <span className="hidden sm:inline">MODE: HIRING WINDOW OPEN</span>
      </div>

      <h1 className="stamp mt-6 text-[clamp(2.6rem,9vw,6.5rem)] text-ink anim-tick-in" style={{ animationDelay: "80ms" }}>
        Two systems
        <br />
        in production<span className="text-signal">.</span>
      </h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
        <div className="anim-tick-in" style={{ animationDelay: "160ms" }}>
          <p className="max-w-xl text-lg leading-relaxed text-ink-soft">
            I&rsquo;m {profile.name}, the sole developer behind a hospital&rsquo;s
            canteen and laundry platforms — together handling 100+ orders a day.
            {" "}{profile.tagline}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="chip border-ok/40 text-ok">
              <span className="status-dot" data-live="true" aria-hidden />
              {profile.availability}
            </span>
            <span className="chip">{profile.location}</span>
            <span className="chip hidden sm:inline-flex">B.Tech CSE &rsquo;26</span>
            <span className="chip text-muted hidden md:inline-flex">
              ctrl+K opens the console
            </span>
          </div>
        </div>

        <div className="anim-tick-in" style={{ animationDelay: "240ms" }}>
          <StateRail />
          <p className="readout mt-2 text-right text-muted">
            your visit is an order. scroll to advance it.
          </p>
        </div>
      </div>
    </section>
  );
}
