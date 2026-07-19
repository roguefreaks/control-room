/**
 * Deploy feed: recent public activity from both GitHub accounts, plus private
 * freelance activity when GITHUB_TOKEN (a token for the freelance account) is
 * set. Fetches are cached by Next for 10 minutes.
 */
export type DeployEvent = {
  id: string;
  account: string;
  repo: string;
  message: string;
  kind: "push" | "create" | "release" | "pr";
  at: string; // ISO timestamp
};

const ACCOUNTS = {
  primary: "roguefreaks",
  freelance: "SKY830-sudo",
} as const;

type GitHubEvent = {
  id: string;
  type: string;
  created_at: string;
  repo?: { name: string };
  payload?: {
    commits?: { message: string }[];
    ref_type?: string;
    ref?: string | null;
    action?: string;
    release?: { name?: string; tag_name?: string };
    pull_request?: { title?: string };
  };
};

async function fetchEvents(account: string, token?: string): Promise<GitHubEvent[]> {
  const res = await fetch(
    `https://api.github.com/users/${account}/events?per_page=30`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: 600 },
    },
  );
  if (!res.ok) return [];
  return (await res.json()) as GitHubEvent[];
}

function toDeployEvent(account: string, e: GitHubEvent): DeployEvent | null {
  const repo = e.repo?.name?.split("/")[1] ?? "unknown";
  const base = { id: e.id, account, repo, at: e.created_at };
  switch (e.type) {
    case "PushEvent": {
      const commits = e.payload?.commits ?? [];
      if (commits.length > 0) {
        const first = commits[0].message.split("\n")[0];
        const extra = commits.length > 1 ? ` (+${commits.length - 1} more)` : "";
        return { ...base, kind: "push", message: `${first}${extra}` };
      }
      // private-repo events omit commit details; show the branch instead
      const branch = e.payload?.ref?.replace("refs/heads/", "");
      return { ...base, kind: "push", message: branch ? `pushed to ${branch}` : "pushed" };
    }
    case "CreateEvent":
      return {
        ...base,
        kind: "create",
        message: `created ${e.payload?.ref_type ?? "ref"}${e.payload?.ref ? ` ${e.payload.ref}` : ""}`,
      };
    case "ReleaseEvent":
      return {
        ...base,
        kind: "release",
        message: `released ${e.payload?.release?.tag_name ?? ""}`.trim(),
      };
    case "PullRequestEvent":
      if (e.payload?.action !== "opened" && e.payload?.action !== "closed") return null;
      return {
        ...base,
        kind: "pr",
        message: `${e.payload.action} PR: ${e.payload?.pull_request?.title ?? ""}`.trim(),
      };
    default:
      return null;
  }
}

export async function getDeployFeed(limit = 10): Promise<DeployEvent[]> {
  const token = process.env.GITHUB_TOKEN;
  const [primary, freelance] = await Promise.all([
    fetchEvents(ACCOUNTS.primary).catch(() => []),
    fetchEvents(ACCOUNTS.freelance, token).catch(() => []),
  ]);
  const events = [
    ...primary.map((e) => toDeployEvent(ACCOUNTS.primary, e)),
    ...freelance.map((e) => toDeployEvent(ACCOUNTS.freelance, e)),
  ].filter((e): e is DeployEvent => e !== null);

  // De-dupe (an event can appear in both feeds if accounts collaborate)
  const seen = new Set<string>();
  return events
    .filter((e) => (seen.has(e.id) ? false : (seen.add(e.id), true)))
    .sort((a, b) => +new Date(b.at) - +new Date(a.at))
    .slice(0, limit);
}
