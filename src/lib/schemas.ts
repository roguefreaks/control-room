import { z } from "zod";
import { SECTION_IDS } from "./state-machine";

/** POST /api/guestbook — "leave a signal". `station` is a honeypot field. */
export const signalSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name needs at least 2 characters")
    .max(40, "Name is capped at 40 characters")
    .regex(/^[\p{L}\p{N} .'&@_-]+$/u, "Name contains unsupported characters"),
  message: z
    .string()
    .trim()
    .min(3, "Signal needs at least 3 characters")
    .max(140, "Signals are capped at 140 characters"),
  station: z.string().max(0, "Rejected").optional().default(""),
});
export type SignalInput = z.infer<typeof signalSchema>;

/** POST /api/visitors — telemetry beacons. */
export const beaconSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("visit") }),
  z.object({ type: z.literal("section"), section: z.enum(SECTION_IDS) }),
]);
export type BeaconInput = z.infer<typeof beaconSchema>;

/** DELETE /api/guestbook — admin moderation. */
export const deleteSignalSchema = z.object({ id: z.uuid() });
