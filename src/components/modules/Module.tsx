import type { ReactNode } from "react";
import type { SectionId } from "@/lib/state-machine";

/** Shared shell for console modules: hairline header + numbered readout. */
export function Module({
  id,
  code,
  title,
  note,
  children,
}: {
  id: SectionId;
  code: string;
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} data-module className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <header className="hairline-label reveal">
        <span className="readout text-signal-text">{code}</span>
        <h2 className="stamp text-[clamp(1.7rem,4.5vw,2.6rem)] text-ink">{title}</h2>
        {note && <span className="readout hidden text-muted lg:inline">{note}</span>}
      </header>
      <div className="mt-8">{children}</div>
    </section>
  );
}
