import { z } from "zod";
import { SECTION_IDS } from "./state-machine";

/** Strip control characters and zero-width/invisible unicode. */
function clean(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u001F\u007F\u200B-\u200F\u2028\u2029\uFEFF]/g, "");
}

/**
 * POST /api/guestbook: "leave a signal". Strict objects reject unknown keys;
 * `station` is a honeypot field that must stay empty.
 */
export const signalSchema = z.strictObject({
  name: z
    .string()
    .transform(clean)
    .pipe(
      z
        .string()
        .trim()
        .min(2, "Name needs at least 2 characters")
        .max(40, "Name is capped at 40 characters")
        .regex(/^[\p{L}\p{N} .'&@_-]+$/u, "Name contains unsupported characters"),
    ),
  message: z
    .string()
    .transform(clean)
    .pipe(
      z
        .string()
        .trim()
        .min(3, "Signal needs at least 3 characters")
        .max(140, "Signals are capped at 140 characters"),
    ),
  station: z.string().max(0, "Rejected").optional().default(""),
});
export type SignalInput = z.infer<typeof signalSchema>;

/** POST /api/visitors: telemetry beacons. */
export const beaconSchema = z.discriminatedUnion("type", [
  z.strictObject({ type: z.literal("visit") }),
  z.strictObject({ type: z.literal("section"), section: z.enum(SECTION_IDS) }),
]);
export type BeaconInput = z.infer<typeof beaconSchema>;

/** DELETE /api/guestbook: admin moderation. */
export const deleteSignalSchema = z.strictObject({ id: z.uuid() });
