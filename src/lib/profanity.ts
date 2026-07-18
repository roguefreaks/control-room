/**
 * Minimal profanity screen for the public signal board. Normalizes common
 * leetspeak substitutions and checks word boundaries so "class" or
 * "assessment" pass. Deliberately small — the admin delete route is the
 * real moderation tool. Unit tested.
 */
const BLOCKED = [
  "fuck", "shit", "bitch", "asshole", "bastard", "cunt", "dick", "pussy",
  "slut", "whore", "nigger", "nigga", "faggot", "retard",
  // Hindi / Hinglish
  "chutiya", "chutiye", "bhosdi", "bhosdike", "madarchod", "behenchod",
  "bhenchod", "gandu", "gaand", "lund", "randi", "harami", "kamina",
];

const SUBS: Record<string, string> = {
  "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "8": "b",
  "@": "a", "$": "s", "!": "i", "*": "", ".": "", "-": "", "_": "",
};

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((c) => SUBS[c] ?? c)
    .join("");
}

export function containsProfanity(text: string): boolean {
  const normalized = normalize(text);
  const collapsed = normalized.replace(/(.)\1+/g, "$1"); // fuuuuck → fuck
  return BLOCKED.some((word) => {
    const re = new RegExp(`(^|[^a-z])${word}`, "i");
    const collapsedWord = word.replace(/(.)\1+/g, "$1");
    const reCollapsed = new RegExp(`(^|[^a-z])${collapsedWord}`, "i");
    return re.test(normalized) || reCollapsed.test(collapsed);
  });
}
