import { unstable_cache } from "next/cache";

/**
 * Production health: server-side probe of the two live systems, cached for
 * 10 minutes so visitors never trigger request storms against client sites.
 */
export type HealthReading = {
  id: string;
  status: "LIVE" | "DEGRADED";
  ms: number | null;
  checkedAt: string;
};

const TARGETS = [
  { id: "prabhu-dana-pani", url: "https://prabhu-dana-pani.vercel.app" },
  { id: "cascade-coal", url: "https://cascade-coal-delta.vercel.app" },
] as const;

async function probe(id: string, url: string): Promise<HealthReading> {
  const started = Date.now();
  try {
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "control-room-health/1.0" },
    });
    const ms = Date.now() - started;
    return {
      id,
      status: res.ok ? "LIVE" : "DEGRADED",
      ms,
      checkedAt: new Date().toISOString(),
    };
  } catch {
    return { id, status: "DEGRADED", ms: null, checkedAt: new Date().toISOString() };
  }
}

export const getHealth = unstable_cache(
  async (): Promise<HealthReading[]> =>
    Promise.all(TARGETS.map((t) => probe(t.id, t.url))),
  ["system-health"],
  { revalidate: 600 },
);
