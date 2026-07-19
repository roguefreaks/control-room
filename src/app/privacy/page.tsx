import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What this site stores and what it never collects.",
};

/** Plain-language privacy note. There is genuinely almost nothing to disclose. */
export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="readout text-signal-text">CONTROL ROOM · PRIVACY</p>
      <h1 className="stamp mt-3 text-3xl text-ink sm:text-4xl">
        What this site knows about you
      </h1>

      <div className="mt-8 space-y-6 leading-relaxed text-ink-soft">
        <p>
          Almost nothing, on purpose. There are no analytics scripts, no ad
          trackers, no fingerprinting and no third-party requests of any kind.
        </p>
        <p>
          <strong className="text-ink">One cookie.</strong> A random session id
          with no personal information in it, used to count you as one visitor
          instead of five. It expires after 12 hours.
        </p>
        <p>
          <strong className="text-ink">Anonymous counters.</strong> The site
          stores totals like &ldquo;how many visitors today&rdquo; and
          &ldquo;which sections get read&rdquo;. None of it can be traced back
          to a person.
        </p>
        <p>
          <strong className="text-ink">Your IP address is never stored.</strong>{" "}
          For spam protection it is run through a one-way hash and forgotten.
        </p>
        <p>
          <strong className="text-ink">The signal board.</strong> If you leave a
          message there, the name and message you typed are public by design.
          Want one removed? Email{" "}
          <a
            href={`mailto:${profile.email}`}
            className="text-signal-text underline decoration-line-strong underline-offset-4"
          >
            {profile.email}
          </a>{" "}
          and it will be deleted.
        </p>
      </div>

      <Link
        href="/"
        className="readout mt-10 inline-block text-ink underline decoration-line-strong underline-offset-4 hover:text-signal-text"
      >
        ← back to the console
      </Link>
    </main>
  );
}
