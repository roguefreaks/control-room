/** AUDIT LOG module — education, certifications, achievements as log rows. */
export type AuditRow = {
  ts: string; // display timestamp (monospace)
  kind: "EDU" | "CERT" | "ACHV";
  entry: string;
  detail?: string;
};

export const auditRows: AuditRow[] = [
  {
    ts: "2026-06",
    kind: "EDU",
    entry: "B.Tech, Computer Science & Engineering — Graphic Era Deemed to be University, Dehradun",
    detail: "CGPA 8.3 · 2022–2026",
  },
  {
    ts: "2022-06",
    kind: "EDU",
    entry: "Class XII (CBSE), Dehradun",
    detail: "80.2%",
  },
  {
    ts: "CERT",
    kind: "CERT",
    entry: "AWS Certified Cloud Practitioner",
  },
  {
    ts: "CERT",
    kind: "CERT",
    entry: "Salesforce Agentforce Specialist",
    detail: "agentic AI workflows",
  },
  {
    ts: "2025-07",
    kind: "ACHV",
    entry: "2nd Runner-Up, International Hackathon — 500+ teams",
    detail: "IoT / C++ on ESP32",
  },
  {
    ts: "ACHV",
    kind: "ACHV",
    entry: "Amazon HackOn — National Finalist",
    detail: "logistics software solution",
  },
  {
    ts: "ACHV",
    kind: "ACHV",
    entry: "500+ DSA problems solved",
    detail: "LeetCode · Coding Ninjas · TUF",
  },
];
