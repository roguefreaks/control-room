"use client";

import { useState } from "react";
import type { Signal } from "@/lib/guestbook";
import { timeAgo } from "@/lib/format";
import { useConsole } from "@/components/console/ConsoleProvider";

/**
 * The signal board: a tiny public guestbook rendered as audit-log entries.
 * Server-validated (zod), rate-limited, profanity-filtered. Leaving a signal
 * counts as contact → SHORTLISTED.
 */
export function Guestbook({ initialSignals }: { initialSignals: Signal[] | null }) {
  const { markContacted } = useConsole();
  const [signals, setSignals] = useState<Signal[] | null>(initialSignals);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const offline = signals === null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, station: "" }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "signal rejected. try again.");
        return;
      }
      setSignals((prev) => [data.signal, ...(prev ?? [])]);
      setName("");
      setMessage("");
      setSent(true);
      markContacted();
    } catch {
      setError("transmission failed. try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="module flex h-full flex-col p-5">
      <span className="tick" aria-hidden />
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="readout font-semibold text-ink">SIGNAL BOARD</h3>
        <p className="readout text-muted">public · 140 chars</p>
      </div>

      {offline ? (
        <p className="readout mt-4 text-muted">
          signal board offline — storage not configured on this deployment.
        </p>
      ) : (
        <>
          <form onSubmit={submit} className="mt-4 space-y-2">
            <div className="flex gap-2">
              <label className="sr-only" htmlFor="sig-name">Your name</label>
              <input
                id="sig-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                maxLength={40}
                placeholder="name"
                className="w-2/5 border border-line bg-paper px-3 py-2 font-mono text-[13px] text-ink outline-none placeholder:text-muted focus:border-signal"
              />
              <label className="sr-only" htmlFor="sig-msg">Your signal</label>
              <input
                id="sig-msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={3}
                maxLength={140}
                placeholder="leave a one-line signal"
                className="w-full border border-line bg-paper px-3 py-2 font-mono text-[13px] text-ink outline-none placeholder:text-muted focus:border-signal"
              />
            </div>
            {/* honeypot — real visitors never see or fill this */}
            <input
              type="text"
              name="station"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />
            <div className="flex items-center justify-between gap-2">
              <p className="readout text-muted" aria-live="polite">
                {error ? (
                  <span className="text-bad">{error}</span>
                ) : sent ? (
                  <span className="text-ok">signal logged ✓</span>
                ) : (
                  "no login. be decent."
                )}
              </p>
              <button
                type="submit"
                disabled={busy}
                className="cursor-pointer border border-ink bg-ink px-4 py-1.5 font-mono text-xs font-semibold tracking-wide text-paper transition-colors hover:border-signal hover:bg-signal hover:text-white disabled:opacity-50"
              >
                {busy ? "SENDING…" : "TRANSMIT"}
              </button>
            </div>
          </form>

          <ul className="mt-4 max-h-72 space-y-0 divide-y divide-line overflow-y-auto border-t border-line">
            {signals.length === 0 && (
              <li className="readout py-4 text-muted">
                board is clear. first signal is yours.
              </li>
            )}
            {signals.map((s) => (
              <li key={s.id} className="py-2.5 font-mono text-[13px]">
                <span className="readout text-muted">{timeAgo(s.created_at)} · </span>
                <span className="font-semibold text-signal-text">{s.name}</span>
                <span className="text-ink-soft"> — {s.message}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
