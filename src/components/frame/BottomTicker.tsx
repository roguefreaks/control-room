import type { HealthReading } from "@/lib/health";
import type { DeployEvent } from "@/lib/github";
import { timeAgo } from "@/lib/format";
import { profile } from "@/content/profile";

/** Bezel ticker tape: availability + live wire items on a marquee loop. */
export function BottomTicker({
  health,
  feed,
}: {
  health: HealthReading[];
  feed: DeployEvent[];
}) {
  const liveCount = health.filter((h) => h.status === "LIVE").length;
  const items = [
    `${profile.availability.toUpperCase()} · ${profile.location.toUpperCase()}`,
    `${liveCount}/${health.length} SYSTEMS LIVE`,
    ...feed
      .slice(0, 6)
      .map((e) => `DEPLOY ▸ ${e.repo}: ${e.message} (${timeAgo(e.at)})`),
    "100+ ORDERS/DAY IN PRODUCTION",
    "PRESS CTRL+K FOR THE COMMAND PALETTE",
  ];

  const tape = items.join("   ·   ");

  return (
    <div
      className="marquee hidden h-8 flex-none items-center border-t border-line bg-bezel sm:flex"
      aria-hidden="true"
    >
      <div className="marquee-track">
        <span className="readout text-ink-soft">{tape}</span>
        <span className="readout text-ink-soft">{tape}</span>
      </div>
    </div>
  );
}
