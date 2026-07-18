"use client";

import { useConsole } from "@/components/console/ConsoleProvider";
import { MODULES } from "./LeftRail";

/** Phone bezel: bottom dock of module switches + palette key. */
export function MobileDock() {
  const { activeSection } = useConsole();

  return (
    <nav
      aria-label="Console modules"
      className="flex h-14 flex-none items-stretch gap-1 overflow-x-auto border-t border-line bg-bezel px-2 py-1.5 lg:hidden"
    >
      {MODULES.map((m) => {
        const active = activeSection === m.id;
        return (
          <a
            key={m.id}
            href={`#${m.id}`}
            aria-label={`${m.label} module`}
            aria-current={active ? "true" : undefined}
            className={`flex min-w-16 flex-1 flex-col items-center justify-center gap-0.5 border no-underline transition-colors duration-200 ${
              active ? "border-signal bg-surface" : "border-transparent"
            }`}
          >
            <span className="led" data-on={active} aria-hidden />
            <span
              className={`font-mono text-[9px] uppercase tracking-wide ${
                active ? "text-signal-text" : "text-muted"
              }`}
            >
              {m.label.split(" ")[0]}
            </span>
          </a>
        );
      })}
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("cr:palette"))}
        aria-label="Open command palette"
        className="flex min-w-14 cursor-pointer flex-col items-center justify-center gap-0.5 border border-line text-muted transition-colors duration-200 active:border-signal"
      >
        <span className="font-mono text-[13px] font-semibold text-signal-text">⌘</span>
        <span className="font-mono text-[9px] uppercase tracking-wide">search</span>
      </button>
    </nav>
  );
}
