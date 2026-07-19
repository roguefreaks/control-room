/**
 * Email notification for new signals, via Resend's REST API. No-op unless
 * RESEND_API_KEY is set; failures never block the guestbook write.
 */
import { profile, SITE_URL } from "@/content/profile";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function emailHtml(name: string, message: string, when: string): string {
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message);
  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f2efe7;font-family:Consolas,'Courier New',monospace;">
    <div style="max-width:520px;margin:0 auto;background:#131311;border:1px solid #3d423b;">
      <div style="padding:14px 20px;border-bottom:1px solid #272b26;">
        <span style="color:#46d67c;font-size:11px;">&#9679;</span>
        <span style="color:#e9e7db;font-size:12px;letter-spacing:2px;font-weight:bold;">&nbsp;ACHYUT // CONTROL ROOM</span>
      </div>
      <div style="padding:24px 20px;">
        <p style="margin:0;color:#83816f;font-size:11px;letter-spacing:2px;">INCOMING SIGNAL</p>
        <p style="margin:14px 0 4px;color:#ff9257;font-size:15px;font-weight:bold;">${safeName}</p>
        <p style="margin:0 0 18px;color:#83816f;font-size:11px;">${when} IST · signal board</p>
        <div style="border-left:3px solid #ff6a28;padding:10px 14px;background:#1a1a17;">
          <p style="margin:0;color:#e9e7db;font-size:14px;line-height:1.6;">${safeMessage}</p>
        </div>
        <p style="margin:22px 0 0;">
          <a href="${SITE_URL}#comms" style="color:#46d67c;font-size:12px;">view the board &#8599;</a>
        </p>
      </div>
      <div style="padding:12px 20px;border-top:1px solid #272b26;">
        <p style="margin:0;color:#5c6158;font-size:10px;letter-spacing:1px;">AUTOMATED DISPATCH · CONTROL-ROOM SIGNAL BOARD</p>
      </div>
    </div>
  </body>
</html>`;
}

export async function notifySignal(name: string, message: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const when = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());
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
        subject: `Incoming signal from ${name}`,
        html: emailHtml(name, message, when),
        text: `${name} left a signal on your portfolio (${when} IST):\n\n"${message}"\n\n${SITE_URL}#comms`,
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // notification is best-effort; the signal itself is already stored
  }
}
