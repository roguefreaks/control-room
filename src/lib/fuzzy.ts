/**
 * Tiny fuzzy matcher for the command palette. Subsequence match with a score
 * that rewards prefix hits, word-boundary hits and run continuity.
 * Pure — unit tested.
 */
export type FuzzyResult = { score: number; positions: number[] };

export function fuzzyMatch(query: string, target: string): FuzzyResult | null {
  const q = query.trim().toLowerCase();
  const t = target.toLowerCase();
  if (q.length === 0) return { score: 0, positions: [] };

  const positions: number[] = [];
  let score = 0;
  let ti = 0;
  let lastHit = -2;

  for (let qi = 0; qi < q.length; qi++) {
    const ch = q[qi];
    if (ch === " ") continue;
    const found = t.indexOf(ch, ti);
    if (found === -1) return null;

    let points = 1;
    if (found === 0) points += 8; // string prefix
    else if (/[\s/·&_-]/.test(t[found - 1])) points += 6; // word boundary
    if (found === lastHit + 1) points += 4; // continuity run
    points -= Math.min(found - ti, 3) * 0.25; // small gap penalty

    score += points;
    positions.push(found);
    lastHit = found;
    ti = found + 1;
  }
  return { score, positions };
}

export function fuzzyRank<T>(
  query: string,
  items: T[],
  text: (item: T) => string,
): { item: T; result: FuzzyResult }[] {
  const out: { item: T; result: FuzzyResult }[] = [];
  for (const item of items) {
    const result = fuzzyMatch(query, text(item));
    if (result) out.push({ item, result });
  }
  return out.sort((a, b) => b.result.score - a.result.score);
}
