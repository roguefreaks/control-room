"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fuzzyRank } from "@/lib/fuzzy";
import { profile } from "@/content/profile";
import { systems, experiments } from "@/content/systems";
import { skillGroups } from "@/content/skills";
import { useConsole } from "@/components/console/ConsoleProvider";

type Command = {
  id: string;
  group: "Modules" | "Systems" | "Actions" | "Telemetry";
  label: string;
  hint?: string;
  run: () => void;
};

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ block: "start" });
}

export function CommandPalette() {
  const { markContacted } = useConsole();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const commands = useMemo<Command[]>(() => {
    const modules: [string, string][] = [
      ["operations", "OPERATIONS — freelance experience"],
      ["deployments", "DEPLOYMENTS — projects & lab"],
      ["telemetry", "TELEMETRY — skills"],
      ["audit", "AUDIT LOG — education, certs, achievements"],
      ["incidents", "INCIDENT REPORT — what broke in production"],
      ["comms", "COMMS — contact"],
    ];
    return [
      ...modules.map(
        ([id, label]): Command => ({
          id: `mod-${id}`,
          group: "Modules",
          label,
          hint: "jump",
          run: () => scrollToId(id),
        }),
      ),
      ...systems.map(
        (s): Command => ({
          id: `sys-${s.id}`,
          group: "Systems",
          label: `${s.ticket} ${s.name}`,
          hint: "open live",
          run: () => window.open(s.url, "_blank", "noopener"),
        }),
      ),
      ...experiments.map(
        (e): Command => ({
          id: `lab-${e.id}`,
          group: "Systems",
          label: `LAB ${e.name}`,
          hint: "jump",
          run: () => scrollToId("deployments"),
        }),
      ),
      {
        id: "act-resume",
        group: "Actions",
        label: "Download resume (PDF)",
        hint: "↓",
        run: () => {
          markContacted();
          const a = document.createElement("a");
          a.href = profile.resumePath;
          a.download = profile.resumeFileName;
          a.click();
        },
      },
      {
        id: "act-email",
        group: "Actions",
        label: `Copy email — ${profile.email}`,
        hint: "copy",
        run: () => {
          navigator.clipboard?.writeText(profile.email).catch(() => {});
          markContacted();
        },
      },
      {
        id: "act-theme",
        group: "Actions",
        label: "Toggle theme",
        hint: "light/dark",
        run: () => {
          const next =
            document.documentElement.getAttribute("data-theme") === "dark"
              ? "light"
              : "dark";
          document.documentElement.setAttribute("data-theme", next);
          try {
            localStorage.setItem("cr-theme", next);
          } catch {}
        },
      },
      {
        id: "act-github",
        group: "Actions",
        label: "Open GitHub — roguefreaks",
        hint: "↗",
        run: () => window.open(profile.links.githubPrimary, "_blank", "noopener"),
      },
      {
        id: "act-github2",
        group: "Actions",
        label: "Open GitHub — SKY830-sudo (freelance)",
        hint: "↗",
        run: () => window.open(profile.links.githubFreelance, "_blank", "noopener"),
      },
      {
        id: "act-linkedin",
        group: "Actions",
        label: "Open LinkedIn",
        hint: "↗",
        run: () => window.open(profile.links.linkedin, "_blank", "noopener"),
      },
      ...skillGroups.map(
        (g): Command => ({
          id: `tel-${g.id}`,
          group: "Telemetry",
          label: `${g.label}: ${g.items.join(", ")}`,
          hint: "jump",
          run: () => scrollToId("telemetry"),
        }),
      ),
    ];
  }, [markContacted]);

  const results = useMemo(() => {
    if (!query.trim()) return commands.map((item) => ({ item }));
    return fuzzyRank(query, commands, (c) => `${c.group} ${c.label}`).map(
      ({ item }) => ({ item }),
    );
  }, [query, commands]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setIndex(0);
  }, []);

  // Global shortcut + custom event from hint chips
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        close();
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("cr:palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("cr:palette", onOpen);
    };
  }, [close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${index}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [index]);

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[index]) {
      e.preventDefault();
      results[index].item.run();
      close();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-90 bg-ink/30"
      onClick={close}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className="module fixed inset-x-0 bottom-0 mx-auto flex max-h-[70vh] w-full flex-col sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-24 sm:max-h-[60vh] sm:w-[36rem] sm:-translate-x-1/2 anim-tick-in"
      >
        <span className="tick" aria-hidden />
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="readout text-signal-text">▸</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder="search modules, systems, actions…"
            aria-label="Search commands"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={results[index] ? `cmd-${results[index].item.id}` : undefined}
            className="w-full bg-transparent font-mono text-sm text-ink outline-none placeholder:text-muted"
          />
          <kbd className="chip text-muted">esc</kbd>
        </div>
        <ul
          id="palette-results"
          ref={listRef}
          role="listbox"
          aria-label="Commands"
          className="overflow-y-auto p-2"
        >
          {results.length === 0 && (
            <li className="readout px-3 py-4 text-muted">
              no matches. state unchanged.
            </li>
          )}
          {results.map(({ item }, i) => {
            const showGroup = i === 0 || results[i - 1].item.group !== item.group;
            return (
              <li key={item.id}>
                {showGroup && (
                  <p className="readout px-3 pb-1 pt-3 text-muted">{item.group}</p>
                )}
                <button
                  type="button"
                  id={`cmd-${item.id}`}
                  data-index={i}
                  role="option"
                  aria-selected={i === index}
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => {
                    item.run();
                    close();
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2 text-left text-sm ${
                    i === index ? "bg-signal text-white" : "text-ink"
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {item.hint && (
                    <span
                      className={`readout flex-none ${i === index ? "text-white/80" : "text-muted"}`}
                    >
                      {item.hint}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="readout border-t border-line px-4 py-2 text-muted">
          ↑↓ navigate · ↵ run · esc close
        </p>
      </div>
    </div>
  );
}
