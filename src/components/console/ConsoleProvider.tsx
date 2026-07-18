"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  advance,
  SECTION_STATE,
  stateForSections,
  type SectionId,
  type VisitorState,
} from "@/lib/state-machine";

type ConsoleContextValue = {
  state: VisitorState;
  startedAt: number;
  booted: boolean;
  activeSection: SectionId | null;
  setActiveSection: (id: SectionId | null) => void;
  visitorNumber: number | null;
  todayCount: number | null;
  totalCount: number | null;
  telemetryConfigured: boolean;
  finishBoot: () => void;
  reachSection: (id: SectionId) => void;
  markContacted: () => void;
};

const ConsoleContext = createContext<ConsoleContextValue | null>(null);

export function useConsole(): ConsoleContextValue {
  const ctx = useContext(ConsoleContext);
  if (!ctx) throw new Error("useConsole must be used inside ConsoleProvider");
  return ctx;
}

const KEYS = {
  start: "cr-start",
  visited: "cr-visited",
  contacted: "cr-contacted",
  booted: "cr-booted",
  beacons: "cr-beacons",
} as const;

function readSession(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSession(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* private mode — telemetry is best-effort */
  }
}

export function ConsoleProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VisitorState>("RECEIVED");
  const [booted, setBooted] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());
  const [visitorNumber, setVisitorNumber] = useState<number | null>(null);
  const [todayCount, setTodayCount] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [telemetryConfigured, setTelemetryConfigured] = useState(true);
  const visitedRef = useRef<Set<string>>(new Set());

  // Restore session (reloads keep the same "order") + register the visit.
  // Deferred a tick so hydration commits before any state restoration
  // (setTimeout, not rAF: rAF never fires in backgrounded tabs).
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = readSession(KEYS.start);
      if (stored) setStartedAt(Number(stored));
      else writeSession(KEYS.start, String(Date.now()));

      try {
        visitedRef.current = new Set(JSON.parse(readSession(KEYS.visited) ?? "[]"));
      } catch {
        visitedRef.current = new Set();
      }
      const contacted = readSession(KEYS.contacted) === "1";
      setState(stateForSections(visitedRef.current, contacted));
      if (readSession(KEYS.booted) === "1") setBooted(true);
    }, 0);

    fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "visit" }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        setTelemetryConfigured(Boolean(data.configured));
        // 0 means "returning session before any counted visit today" — no number
        setVisitorNumber(data.visitorNumber || null);
        setTodayCount(data.today ?? null);
        setTotalCount(data.total || null);
      })
      .catch(() => setTelemetryConfigured(false));

    return () => window.clearTimeout(timer);
  }, []);

  const finishBoot = useCallback(() => {
    setBooted(true);
    writeSession(KEYS.booted, "1");
  }, []);

  const reachSection = useCallback((id: SectionId) => {
    if (visitedRef.current.has(id)) return;
    visitedRef.current.add(id);
    writeSession(KEYS.visited, JSON.stringify([...visitedRef.current]));
    setState((s) => advance(s, SECTION_STATE[id]));

    // aggregate, once per section per session
    const sent = readSession(KEYS.beacons) ?? "";
    if (!sent.includes(id)) {
      writeSession(KEYS.beacons, `${sent},${id}`);
      fetch("/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "section", section: id }),
        keepalive: true,
      }).catch(() => {});
    }
  }, []);

  const markContacted = useCallback(() => {
    writeSession(KEYS.contacted, "1");
    setState((s) => advance(s, "SHORTLISTED"));
  }, []);

  return (
    <ConsoleContext.Provider
      value={{
        state,
        startedAt,
        booted,
        activeSection,
        setActiveSection,
        visitorNumber,
        todayCount,
        totalCount,
        telemetryConfigured,
        finishBoot,
        reachSection,
        markContacted,
      }}
    >
      {children}
    </ConsoleContext.Provider>
  );
}
