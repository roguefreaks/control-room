import { profile } from "@/content/profile";
import { SystemSchematic } from "@/components/console/SystemSchematic";
import type { HealthReading } from "@/lib/health";

/** Landing screen: headline + the live system schematic. */
export function Hero({ health }: { health: HealthReading[] }) {
  const liveCount = health.filter((h) => h.status === "LIVE").length;

  return (
    <section id="top" className="mx-auto w-full max-w-6xl px-4 pb-14 pt-8 sm:px-6 sm:pt-12">
      <div className="readout flex flex-wrap items-center gap-x-4 gap-y-2 text-muted anim-tick-in">
        <span className="flex items-center gap-2">
          <span className="status-dot" data-live={liveCount > 0} aria-hidden />
          {liveCount}/{health.length} SYSTEMS LIVE
        </span>
        <span>OPERATOR: {profile.name.toUpperCase()}</span>
        <span className="hidden sm:inline">MODE: HIRING WINDOW OPEN</span>
      </div>

      <h1
        className="stamp mt-5 text-[clamp(2.4rem,7.5vw,5.4rem)] text-ink anim-tick-in"
        style={{ animationDelay: "80ms" }}
      >
        Two systems
        <br />
        in production<span className="text-signal">.</span>
      </h1>

      <div
        className="mt-5 flex flex-wrap items-end justify-between gap-4 anim-tick-in"
        style={{ animationDelay: "160ms" }}
      >
        <p className="max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
          I&rsquo;m {profile.name}, the sole developer behind a hospital&rsquo;s
          canteen and laundry platforms — together handling 100+ orders a day.
          {" "}{profile.tagline}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip border-ok/40 text-ok">
            <span className="status-dot" data-live="true" aria-hidden />
            {profile.availability}
          </span>
          <span className="chip">{profile.location}</span>
        </div>
      </div>

      <div className="mt-8 anim-tick-in" style={{ animationDelay: "240ms" }}>
        <SystemSchematic health={health} />
      </div>
    </section>
  );
}
