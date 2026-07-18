import { createHash } from "node:crypto";
import { getServiceClient } from "./supabase";
import type { SectionId } from "./state-machine";

/**
 * Privacy-safe telemetry. No cookies beyond an opaque session id, no personal
 * data, IPs only ever stored as a salted hash for rate limiting signals.
 */
export type VisitorStats = {
  configured: boolean;
  visitorNumber: number | null;
  today: number | null;
  total: number | null;
};

export function hashIp(ip: string): string {
  const salt = process.env.TELEMETRY_SALT ?? "control-room";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 24);
}

/** IST day key so "visitors today" matches Achyut's timezone. */
export function dayKey(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export async function recordVisit(isNewSession: boolean): Promise<VisitorStats> {
  const db = getServiceClient();
  if (!db) return { configured: false, visitorNumber: null, today: null, total: null };

  const { data, error } = await db.rpc("cr_record_visit", {
    p_day: dayKey(),
    p_new_session: isNewSession,
  });
  if (error || !data) {
    return { configured: true, visitorNumber: null, today: null, total: null };
  }
  const row = Array.isArray(data) ? data[0] : data;
  return {
    configured: true,
    visitorNumber: row?.visitor_number ?? null,
    today: row?.today_count ?? null,
    total: row?.total_count ?? null,
  };
}

export async function recordSection(section: SectionId): Promise<void> {
  const db = getServiceClient();
  if (!db) return;
  await db.rpc("cr_bump_section", { p_section: section });
}

export type SectionReach = { section: string; reached: number };

export async function getSectionReach(): Promise<SectionReach[]> {
  const db = getServiceClient();
  if (!db) return [];
  const { data } = await db
    .from("cr_sections")
    .select("section, reached")
    .order("reached", { ascending: false });
  return data ?? [];
}
