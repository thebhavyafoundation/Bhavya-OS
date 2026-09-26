/**
 * Photo credits — single source for rights attribution.
 *
 * D4 (spec 2026-09-26-foundation-v2-design.md): credits carry author and
 * license ONLY — no place names, ever. Provenance source:
 * assets/manifest.json + public/photography/metadata/photo_manifest.json.
 *
 * @module photo-credits
 */

import type { PhotoKey } from "./photos";

export interface PhotoCredit {
  author: string;
  license: string;
}

export const PHOTO_CREDITS: Record<PhotoKey, PhotoCredit> = {
  hero: { author: "SND Nature", license: "CC BY 4.0" },
  why: { author: "Varun Shiv Kapur", license: "CC BY 2.0" },
  heritageStone: { author: "UnpetitproleX", license: "CC BY 4.0" },
  knowledgeBooks: { author: "Glenn Carstens-Peters", license: "CC0" },
  communityLandscape: { author: "Aashish Chindaliya", license: "CC0" },
  forest: { author: "Kavittaa", license: "CC0 1.0" },
};

const REPRESENTATIVE = "Representative photograph — not a Bhavya site";

/** "Photo · Author, License · Representative photograph — not a Bhavya site" */
export function photoCredit(key: PhotoKey): string {
  const c = PHOTO_CREDITS[key];
  if (!c) return REPRESENTATIVE;
  return `Photo · ${c.author}, ${c.license} · ${REPRESENTATIVE}`;
}
