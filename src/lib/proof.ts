import { readdirSync } from "node:fs";
import path from "node:path";

/**
 * Evidence shots for the DEPLOYMENTS tickets. Convention over config:
 * drop images into public/proof/<systemId>/ named like
 * "01-admin-dashboard.png" and they appear, sorted, with the filename
 * (minus the number prefix) as the caption. No files, no section.
 */
export type ProofShot = { src: string; caption: string };

export function getProofShots(systemId: string): ProofShot[] {
  try {
    const dir = path.join(process.cwd(), "public", "proof", systemId);
    return readdirSync(dir)
      .filter((f) => /\.(png|webp|jpe?g)$/i.test(f))
      .sort()
      .map((f) => ({
        src: `/proof/${systemId}/${f}`,
        caption: f
          .replace(/^\d+[-_]?/, "")
          .replace(/\.(png|webp|jpe?g)$/i, "")
          .replace(/[-_]/g, " "),
      }));
  } catch {
    return [];
  }
}
