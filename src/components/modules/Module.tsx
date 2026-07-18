import type { ReactNode } from "react";
import type { SectionId } from "@/lib/state-machine";

/** Console module shell: ghost index numeral + stamped header. */
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
  const numeral = code.replace(/\D/g, "");

  return (
    <section
      id={id}
      data-module
      className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-18"
    >
      <span
        aria-hidden
        className="index-numeral pointer-events-none absolute -top-2 right-2 text-[clamp(5rem,14vw,10rem)] opacity-60 sm:right-4"
      >
        {numeral}
      </span>
      <header className="hairline-label reveal relative">
        <span className="readout text-signal-text">{code}</span>
        <h2 className="stamp text-[clamp(1.7rem,4.5vw,2.6rem)] text-ink">{title}</h2>
        {note && <span className="readout hidden text-muted lg:inline">{note}</span>}
      </header>
      <div className="relative mt-7">{children}</div>
    </section>
  );
}
