"use client";

import type { HealthReading } from "@/lib/health";
import { rank } from "@/lib/state-machine";
import { useConsole } from "./ConsoleProvider";

/**
 * The hero signature: a live schematic of the real order pipelines. Order
 * particles flow through both production systems (SMIL — zero JS per frame,
 * hidden under prefers-reduced-motion); the bottom lane is the visitor's own
 * session, its marker advancing through the state machine as they scroll.
 */

const NODE_X = [230, 400, 570, 740];
const LANES = [
  {
    id: "prabhu-dana-pani",
    y: 64,
    tag: "LANE 01 · CANTEEN",
    stages: ["PLACED", "KITCHEN", "READY", "SERVED"],
    dur: "7s",
  },
  {
    id: "cascade-coal",
    y: 156,
    tag: "LANE 02 · LAUNDRY",
    stages: ["BOOKED", "WEIGHED", "IN CARE", "DELIVERED"],
    dur: "8.5s",
  },
] as const;

const VISITOR_Y = 262;
const VISITOR_NODES = [
  { state: "RECEIVED", href: "#top" },
  { state: "REVIEWING", href: "#operations" },
  { state: "EVALUATING", href: "#telemetry" },
  { state: "SHORTLISTED", href: "#comms" },
] as const;

function lanePath(y: number): string {
  return `M96,196 C140,196 150,${y} 196,${y} L860,${y}`;
}

export function SystemSchematic({ health }: { health: HealthReading[] }) {
  const { state, visitorNumber } = useConsole();
  const currentRank = rank(state);

  return (
    <div className="module transform-gpu overflow-x-auto p-3 sm:p-4">
      <span className="tick" aria-hidden />
      <div className="flex items-baseline justify-between gap-3 px-1">
        <p className="readout text-muted">SYSTEM SCHEMATIC · LIVE ORDER FLOW</p>
        <p className="readout hidden text-muted sm:block">
          probes refresh every 10 min · your lane is orange
        </p>
      </div>

      <svg
        viewBox="0 0 960 320"
        role="img"
        aria-label="Schematic of both production order pipelines with your visit as a third lane"
        className="mt-2 h-auto w-full min-w-175 font-mono"
      >
        {/* intake node */}
        <g className="text-muted">
          <rect
            x="28"
            y="172"
            width="68"
            height="48"
            fill="var(--surface)"
            stroke="var(--line-strong)"
          />
          <text x="62" y="192" textAnchor="middle" fontSize="10" fill="var(--ink-soft)">
            ORDERS
          </text>
          <text x="62" y="206" textAnchor="middle" fontSize="10" fill="var(--ink-soft)">
            IN
          </text>
        </g>

        {LANES.map((lane) => {
          const reading = health.find((h) => h.id === lane.id);
          const live = reading?.status === "LIVE";
          const path = lanePath(lane.y);
          return (
            <g key={lane.id}>
              <path d={path} fill="none" stroke="var(--line-strong)" strokeWidth="1.2" />
              {/* lane tag */}
              <text x="196" y={lane.y - 26} fontSize="9.5" fill="var(--muted)" letterSpacing="1">
                {lane.tag}
              </text>
              {/* stage nodes */}
              {lane.stages.map((stage, i) => (
                <g key={stage}>
                  <circle
                    cx={NODE_X[i]}
                    cy={lane.y}
                    r="5"
                    fill="var(--surface)"
                    stroke="var(--line-strong)"
                    strokeWidth="1.2"
                  />
                  <text
                    x={NODE_X[i]}
                    y={lane.y - 12}
                    textAnchor="middle"
                    fontSize="9.5"
                    fill="var(--ink-soft)"
                  >
                    {stage}
                  </text>
                </g>
              ))}
              {/* health badge */}
              <g>
                <circle
                  cx="872"
                  cy={lane.y}
                  r="4.5"
                  fill={live ? "var(--ok)" : "var(--warn)"}
                />
                <text x="884" y={lane.y + 3.5} fontSize="10" fill={live ? "var(--ok)" : "var(--warn)"}>
                  {live && reading?.ms != null ? `${reading.ms}ms` : "DEGRADED"}
                </text>
              </g>
              {/* flowing order particles */}
              <g className="schematic-particles">
                {[0, 1, 2].map((i) => (
                  <circle key={i} r="2.6" fill="var(--ok)">
                    <animateMotion
                      dur={lane.dur}
                      begin={`${-i * (parseFloat(lane.dur) / 3)}s`}
                      repeatCount="indefinite"
                      path={path}
                    />
                  </circle>
                ))}
              </g>
            </g>
          );
        })}

        {/* visitor lane */}
        <g>
          <path
            d={`M96,220 C140,220 150,${VISITOR_Y} 196,${VISITOR_Y} L860,${VISITOR_Y}`}
            fill="none"
            stroke="var(--signal)"
            strokeWidth="1.2"
            strokeDasharray="5 4"
            opacity="0.7"
          />
          <text x="196" y={VISITOR_Y + 32} fontSize="9.5" fill="var(--signal-text)" letterSpacing="1">
            {`LANE 03 · THIS VISIT${visitorNumber !== null ? ` · #${visitorNumber}` : ""}`}
          </text>
          {VISITOR_NODES.map((node, i) => {
            const done = i < currentRank;
            const active = i === currentRank;
            return (
              <a key={node.state} href={node.href} aria-label={`${node.state}: jump to section`}>
                <circle
                  cx={NODE_X[i]}
                  cy={VISITOR_Y}
                  r={active ? 7 : 5}
                  fill={active ? "var(--signal)" : done ? "var(--signal-soft)" : "var(--surface)"}
                  stroke="var(--signal)"
                  strokeWidth="1.2"
                  className="cursor-pointer"
                />
                <text
                  x={NODE_X[i]}
                  y={VISITOR_Y - 13}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill={active ? "var(--signal-text)" : done ? "var(--ink-soft)" : "var(--muted)"}
                  className="cursor-pointer"
                >
                  {done ? `${node.state} ✓` : node.state}
                </text>
              </a>
            );
          })}
          {/* "you are here" marker halo (static ring + motion-gated pulse) */}
          <circle
            cx={NODE_X[Math.min(currentRank, 3)]}
            cy={VISITOR_Y}
            r="11"
            fill="none"
            stroke="var(--signal)"
            strokeWidth="1"
            opacity="0.45"
            style={{ transition: "cx 0.4s cubic-bezier(0.2,0.7,0.2,1)" }}
          />
          <g className="schematic-particles">
            <circle
              cx={NODE_X[Math.min(currentRank, 3)]}
              cy={VISITOR_Y}
              r="11"
              fill="none"
              stroke="var(--signal)"
              strokeWidth="1"
              opacity="0.35"
              style={{ transition: "cx 0.4s cubic-bezier(0.2,0.7,0.2,1)" }}
            >
              <animate attributeName="r" values="10;15;10" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.35;0.1;0.35" dur="2.4s" repeatCount="indefinite" />
            </circle>
          </g>
        </g>
      </svg>

      <p className="readout px-1 text-muted sm:hidden">swipe to pan the schematic →</p>
    </div>
  );
}
