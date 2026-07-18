import { auditRows } from "@/content/audit";
import { Module } from "./Module";

const KIND_STYLE: Record<string, string> = {
  EDU: "text-signal-text",
  CERT: "text-ok",
  ACHV: "text-warn",
};

/** AUDIT LOG — education, certifications, achievements as immutable log rows. */
export function AuditLog() {
  return (
    <Module id="audit" code="MOD-04" title="Audit log" note="verified record">
      <div className="module reveal overflow-x-auto">
        <span className="tick" aria-hidden />
        <table className="w-full border-collapse font-mono text-[13px]">
          <caption className="sr-only">
            Education, certifications and achievements
          </caption>
          <thead>
            <tr className="border-b border-line text-left">
              <th scope="col" className="readout px-4 py-3 font-medium text-muted">ts</th>
              <th scope="col" className="readout px-4 py-3 font-medium text-muted">kind</th>
              <th scope="col" className="readout px-4 py-3 font-medium text-muted">entry</th>
            </tr>
          </thead>
          <tbody>
            {auditRows.map((row, i) => (
              <tr
                key={`${row.kind}-${i}`}
                className="border-b border-line last:border-b-0 hover:bg-paper"
              >
                <td className="whitespace-nowrap px-4 py-3 align-top text-muted">
                  {row.ts}
                </td>
                <td className="px-4 py-3 align-top">
                  <span className={`readout font-semibold ${KIND_STYLE[row.kind]}`}>
                    [{row.kind}]
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-soft">
                  <span className="text-ink">{row.entry}</span>
                  {row.detail && <span className="text-muted"> — {row.detail}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Module>
  );
}
