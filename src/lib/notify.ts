/**
 * Email notification for new signals, via Resend's REST API. No-op unless
 * RESEND_API_KEY is set; failures never block the guestbook write.
 */
import { profile } from "@/content/profile";

export async function notifySignal(name: string, message: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Control Room <onboarding@resend.dev>",
        to: [profile.email],
        subject: `Signal board: new message from ${name}`,
        text: `${name} left a signal on your portfolio:\n\n"${message}"\n\nModerate: DELETE /api/guestbook with your admin token if needed.`,
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // notification is best-effort; the signal itself is already stored
  }
}
