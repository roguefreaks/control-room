import type { ReactNode } from "react";
import type { HealthReading } from "@/lib/health";
import type { DeployEvent } from "@/lib/github";
import { TopBar } from "./TopBar";
import { LeftRail } from "./LeftRail";
import { RightRail } from "./RightRail";
import { BottomTicker } from "./BottomTicker";
import { MobileDock } from "./MobileDock";

/**
 * The instrument chrome: the whole viewport is the machine. A fixed bezel
 * (top bar, switch rail, meter rail, ticker tape) frames the one scrollable
 * screen that holds the modules. Server component — the rails are the
 * client islands.
 */
export function ConsoleFrame({
  health,
  feed,
  children,
}: {
  health: HealthReading[];
  feed: DeployEvent[];
  children: ReactNode;
}) {
  return (
    <div className="console-root flex flex-col bg-bezel">
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <LeftRail />
        <div className="relative min-w-0 flex-1">
          {/* static grid underlay: painted once, never repaints on scroll */}
          <div className="screen-grid absolute inset-0" aria-hidden />
          <main id="console-screen" className="console-screen absolute inset-0">
            {children}
          </main>
        </div>
        <RightRail health={health} feed={feed} />
      </div>
      <BottomTicker health={health} feed={feed} />
      <MobileDock />
    </div>
  );
}
