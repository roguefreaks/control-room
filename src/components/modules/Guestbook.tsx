"use client";

import { useEffect, useState } from "react";
import type { Signal } from "@/lib/guestbook";
import { timeAgo } from "@/lib/format";
import { useConsole } from "@/components/console/ConsoleProvider";

/**
 * The signal board: transmissions go straight to Achyut (email + store).
 * Privacy by design: a visitor sees only the signals they sent in this
 * session; nothing anyone else wrote is ever shown.
 */
export function Guestbook() {
  const { markContacted } = useConsole();
  const [sent, setSent] = useState<Signal[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; text: string }>({
    kind: "idle",
    text: "goes straight to my inbox. no login.",
  });

  // restore this session's own transmissions
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setSent(JSON.parse(sessionStorage.getItem("cr-signals") ?? "[]"));
      } catch {}
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, station: "" }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setStatus({ kind: "error", text: data?.error ?? "signal rejected. try again." });
        return;
      }
      setSent((prev) => {
        const next = [data.signal, ...prev];
        try {
          sessionStorage.setItem("cr-signals", JSON.stringify(next));
        } catch {}
        return next;
      });
      setName("");
      setMessage("");
      setStatus({ kind: "ok", text: "signal transmitted. it is in my inbox." });
      markContacted();
    } catch {
      setStatus({ kind: "error", text: "transmission failed. try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="module flex h-full flex-col p-5">
      <span className="tick" aria-hidden />
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="readout font-semibold text-ink">SIGNAL BOARD</h3>
        <p className="readout text-muted">private · 140 chars</p>
      </div>

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
        {/* honeypot: real visitors never see or fill this */}
        <input
          type="text"
          name="station"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <div className="flex items-center justify-between gap-2">
          <p className="readout" aria-live="polite">
            <span
              className={
                status.kind === "error"
                  ? "text-bad"
                  : status.kind === "ok"
                    ? "text-ok"
                    : "text-muted"
              }
            >
              {status.text}
            </span>
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

      {sent.length > 0 && (
        <div className="mt-4 border-t border-line pt-1">
          <p className="readout pt-2 text-muted">YOUR TRANSMISSIONS · THIS SESSION ONLY</p>
          <ul className="max-h-56 space-y-0 divide-y divide-line overflow-y-auto">
            {sent.map((s) => (
              <li key={s.id} className="py-2.5 font-mono text-[13px]">
                <span className="readout text-muted">{timeAgo(s.created_at)} · </span>
                <span className="font-semibold text-signal-text">{s.name}</span>
                <span className="text-ink-soft">: {s.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="readout mt-auto pt-3 text-muted">
        only you can see what you sent. messages are not published.
      </p>
    </div>
  );
}
