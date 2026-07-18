import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client (service role — never import from client code).
 * Returns null when env vars are absent so every live-data module can degrade
 * gracefully instead of crashing the site.
 */
let cached: SupabaseClient | null | undefined;

export function getServiceClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  cached =
    url && key
      ? createClient(url, key, { auth: { persistSession: false } })
      : null;
  return cached;
}

export function isTelemetryConfigured(): boolean {
  return getServiceClient() !== null;
}
