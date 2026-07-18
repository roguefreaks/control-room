/**
 * INCIDENT REPORT module — honest "what broke and how I fixed it" entries.
 * ⚠ DRAFTS: Achyut, edit these before sharing the site. They are based on real
 * events from the freelance work but you should verify wording and details.
 */
export type Incident = {
  id: string;
  date: string;
  system: string;
  severity: "SEV-2" | "SEV-3";
  title: string;
  what: string;
  fix: string;
  learned: string;
};

export const incidents: Incident[] = [
  {
    id: "INC-001",
    date: "2026-06",
    system: "Cascade & Coal",
    severity: "SEV-2",
    title: "Build cache corruption took every route to 404",
    what: "After a dev-server restart, a corrupted Turbopack build cache made the whole app return 404s — locally it looked like the entire site was gone.",
    fix: "Isolated it to the .next cache, cleared it, and added a /api/health probe plus an external uptime monitor so a real outage would page me instead of a customer telling me.",
    learned: "A health endpoint costs 20 lines. Not knowing you're down costs trust.",
  },
  {
    id: "INC-002",
    date: "2026-06",
    system: "Cascade & Coal",
    severity: "SEV-3",
    title: "Deploys silently blocked by commit author mismatch",
    what: "Vercel refused to build pushes because commits were authored by the wrong GitHub identity for the connected account — deploys just never showed up.",
    fix: "Pinned the git author for the repo, switched push auth to the GitHub CLI credential helper, and documented the setup in the repo's runbook.",
    learned: "The deploy pipeline is part of the product. It gets a runbook too.",
  },
  {
    id: "INC-003",
    date: "2026-05",
    system: "Prabhu Dana Pani",
    severity: "SEV-3",
    title: "Order states could be skipped by double-submitting",
    what: "Fast double-taps on the staff portal could advance an order two states at once, breaking the kitchen queue's assumptions.",
    fix: "Made the state machine transition-gated on the server — every advance validates that the target is exactly the next legal state, and illegal jumps are rejected and logged.",
    learned: "Client-side disabling is a courtesy. The server is the referee.",
  },
];
