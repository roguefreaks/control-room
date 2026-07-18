import { profile } from "@/content/profile";
import { Module } from "./Module";
import { ContactActions } from "@/components/ui/ContactActions";
import { Guestbook } from "./Guestbook";
import type { Signal } from "@/lib/guestbook";

/** COMMS — contact channel + the public signal board. */
export function Comms({ initialSignals }: { initialSignals: Signal[] | null }) {
  return (
    <Module id="comms" code="MOD-06" title="Comms" note="final state: SHORTLISTED ✓">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="reveal">
          <p className="max-w-xl text-lg leading-relaxed text-ink-soft">
            The pipeline ends here. If you run a team that ships real software,
            I&rsquo;d like to hear from you — I&rsquo;m in {profile.location} and can
            start immediately.
          </p>
          <div className="mt-6">
            <ContactActions />
          </div>
          <ul className="readout mt-8 space-y-2 text-ink-soft">
            <li>
              <span className="text-muted">email · </span>
              {profile.email}
            </li>
            <li>
              <span className="text-muted">phone · </span>
              {profile.phone}
            </li>
            <li>
              <span className="text-muted">linkedin · </span>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line-strong underline-offset-4 hover:text-signal-text"
              >
                /in/achyut-pandey ↗
              </a>
            </li>
            <li>
              <span className="text-muted">github · </span>
              <a
                href={profile.links.githubPrimary}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line-strong underline-offset-4 hover:text-signal-text"
              >
                roguefreaks ↗
              </a>
              {"  ·  "}
              <a
                href={profile.links.githubFreelance}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line-strong underline-offset-4 hover:text-signal-text"
              >
                SKY830-sudo (freelance) ↗
              </a>
            </li>
          </ul>
        </div>

        <div className="reveal" style={{ transitionDelay: "80ms" }}>
          <Guestbook initialSignals={initialSignals} />
        </div>
      </div>
    </Module>
  );
}
