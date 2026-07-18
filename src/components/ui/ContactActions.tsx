"use client";

import { useState } from "react";
import { profile } from "@/content/profile";
import { useConsole } from "@/components/console/ConsoleProvider";
import { Magnetic } from "./Magnetic";

/** Primary contact CTAs. Any of these completes the order: SHORTLISTED ✓ */
export function ContactActions() {
  const { markContacted } = useConsole();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — mailto below still works */
    }
    markContacted();
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Magnetic>
        <button
          type="button"
          onClick={copyEmail}
          className="cursor-pointer border border-ink bg-ink px-5 py-3 font-mono text-sm font-semibold tracking-wide text-paper transition-colors hover:bg-signal hover:border-signal hover:text-white"
        >
          {copied ? "COPIED ✓" : "COPY EMAIL"}
        </button>
      </Magnetic>
      <Magnetic>
        <a
          href={profile.resumePath}
          download={profile.resumeFileName}
          onClick={markContacted}
          className="inline-block border border-ink px-5 py-3 font-mono text-sm font-semibold tracking-wide text-ink no-underline transition-colors hover:border-signal hover:text-signal-text"
        >
          RESUME.PDF ↓
        </a>
      </Magnetic>
      <a
        href={`mailto:${profile.email}`}
        onClick={markContacted}
        className="readout text-ink-soft underline decoration-line-strong underline-offset-4 hover:text-signal-text"
      >
        or open mailto
      </a>
      <span aria-live="polite" className="sr-only">
        {copied ? "Email copied to clipboard" : ""}
      </span>
    </div>
  );
}
