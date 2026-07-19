/** INCIDENT REPORT module. Real failures from production work, written plainly. */
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
    title: "Every route started returning 404 after a restart",
    what: "Restarted the dev server one evening and the whole app went 404. No error, no stack trace, just nothing. Took me a while to work out the build cache itself had gone bad.",
    fix: "Deleted the cache and the app came back. Then I added a health endpoint and pointed an uptime monitor at it, so next time I hear about downtime from a ping instead of a customer.",
    learned: "Now I suspect the cache before I suspect my code.",
  },
  {
    id: "INC-002",
    date: "2026-06",
    system: "Cascade & Coal",
    severity: "SEV-3",
    title: "Pushes stopped deploying and nothing complained",
    what: "Vercel quietly refused my builds because commits were authored from the wrong GitHub account. There was no failure email. The site just stayed on an old version while I kept shipping.",
    fix: "Pinned the git author for the repo, moved push auth to the GitHub CLI helper, and wrote the whole setup into the runbook so it cannot fail silently again.",
    learned: "A deploy that does nothing is worse than one that fails loudly.",
  },
  {
    id: "INC-003",
    date: "2026-05",
    system: "Prabhu Dana Pani",
    severity: "SEV-3",
    title: "Fast double taps could skip an order state",
    what: "A staff member tapping the advance button twice in a row could push an order two states forward, which confused the kitchen queue's assumptions about what was cooking.",
    fix: "Moved the check to the server. Every advance now has to match exactly the next legal state, or it gets rejected and logged in the audit trail.",
    learned: "Disabling a button in the UI is a courtesy. The server has to be the one saying no.",
  },
];
