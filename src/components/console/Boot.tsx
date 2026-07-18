"use client";

import { useEffect, useRef, useState } from "react";
import { useConsole } from "./ConsoleProvider";
import { profile } from "@/content/profile";

const LINES = [
  "control-room v1.0 — cold start",
  "mounting modules … operations deployments telemetry audit comms",
  "probing production systems … 2 targets",
  "registering visitor session …",
  "ready.",
];

/**
 * The signature moment: a ~1.1s system boot that assembles the console, then
 * hands off to the status strip which "prints" the visitor's ticket.
 * Skipped entirely on reduced motion, repeat visits (same session), or any
 * key/click.
 */
export function Boot() {
  const { booted, finishBoot } = useConsole();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    if (booted || done.current) return;
    let alreadyBooted = false;
    try {
      alreadyBooted = sessionStorage.getItem("cr-booted") === "1";
    } catch {}
    if (alreadyBooted || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishBoot();
      return;
    }
    const show = window.setTimeout(() => setVisible(true), 0);

    const finish = () => {
      if (done.current) return;
      done.current = true;
      setLeaving(true);
      window.setTimeout(() => {
        setVisible(false);
        finishBoot();
      }, 240);
    };

    const timer = window.setTimeout(finish, 1150);
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(timer);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [booted, finishBoot]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-100 flex items-center justify-center bg-paper transition-opacity duration-200 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-xl px-6">
        <p
          className="stamp anim-flicker text-[clamp(1.6rem,6vw,2.6rem)] text-ink"
          style={{ animationDelay: "60ms" }}
        >
          {profile.console}
        </p>
        <div className="mt-5 space-y-1.5">
          {LINES.map((line, i) => (
            <p
              key={line}
              className="readout anim-tick-in text-ink-soft"
              style={{ animationDelay: `${120 + i * 130}ms` }}
            >
              <span className="text-signal-text">▸</span> {line}
            </p>
          ))}
        </div>
        <div className="mt-6 h-px w-full overflow-hidden bg-line">
          <div
            className="h-full bg-signal"
            style={{ animation: "boot-bar 1.05s cubic-bezier(0.3,0.1,0.2,1) both" }}
          />
        </div>
        <style>{`@keyframes boot-bar { from { width: 0 } to { width: 100% } }`}</style>
        <p className="readout mt-3 text-muted">press any key to skip</p>
      </div>
    </div>
  );
}
