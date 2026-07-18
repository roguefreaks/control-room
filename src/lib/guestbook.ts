import { getServiceClient } from "./supabase";

export type Signal = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

export async function listSignals(limit = 24): Promise<Signal[] | null> {
  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db
    .from("cr_signals")
    .select("id, name, message, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return null;
  return data as Signal[];
}

export async function insertSignal(
  name: string,
  message: string,
  ipHash: string,
): Promise<Signal | null> {
  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db
    .from("cr_signals")
    .insert({ name, message, ip_hash: ipHash })
    .select("id, name, message, created_at")
    .single();
  if (error) return null;
  return data as Signal;
}

export async function deleteSignal(id: string): Promise<boolean> {
  const db = getServiceClient();
  if (!db) return false;
  const { error } = await db.from("cr_signals").delete().eq("id", id);
  return !error;
}
