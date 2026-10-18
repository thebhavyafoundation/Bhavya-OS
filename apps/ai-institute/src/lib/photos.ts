/*
 * Photo asset paths — single source for editorial photography references.
 *
 * ASSET BOUNDARY: Only paths with a real rights-cleared JPEG on disk belong
 * in PHOTO. Consumers must never pass PHOTO_PENDING keys to photo props.
 *
 * Provenance: assets/manifest.json + public/photography/metadata/photo_manifest.json
 */

/** Present on disk — safe to wire */
export const PHOTO = {
  hero: "/photography/hero/hero-sunrise-mountain.jpg",
  why: "/photography/why/why-terrace-garhwal.jpg",
  heritageStone: "/photography/heritage/heritage-stone-temple.jpg",
  knowledgeBooks: "/photography/knowledge/knowledge-books-notepad.jpg",
  communityLandscape: "/photography/community/community-village-landscape.jpg",
  forest: "/photography/forest/forest-cedar-sunlight.jpg",
} as const;

export type PhotoKey = keyof typeof PHOTO;

/**
 * Homepage StoryChapter → photo (all ACQUIRED — real JPEGs on disk).
 */
export const CHAPTER_PHOTO = {
  forest: PHOTO.forest,
  knowledge: PHOTO.knowledgeBooks,
  heritage: PHOTO.heritageStone,
  community: PHOTO.communityLandscape,
} as const;

/**
 * Reserved target basenames with no JPEG yet.
 * Do not wire; leave PhotoPlate in reserved mode / omit photo props.
 */
export const PHOTO_PENDING = {
  knowledgeSchool: "/photography/knowledge/knowledge-school-children.jpg",
  heritageWooden: "/photography/heritage/heritage-wooden-temple.jpg",
  communityGathering: "/photography/community/community-village-gathering.jpg",
} as const;

export type PhotoPendingKey = keyof typeof PHOTO_PENDING;

/**
 * Credit lines for shipped photographs.
 *
 * Why this exists: CC BY 4.0 attribution is a licence obligation, not a
 * courtesy. Routing credits through the same module as the paths keeps the
 * obligation attached to the asset, so a component cannot render a
 * rights-encumbered photograph without also being handed its credit line.
 *
 * Provenance: apps/ai-institute/public/photography/metadata/photo_manifest.json
 */
export const PHOTO_CREDIT: Record<PhotoKey, string> = {
  // CC BY 4.0 — attribution REQUIRED by the licence.
  hero: "Hero: Pexels License",
  forest:
    "Himalayan cedar forest, Shimla — Kavittaa, CC0, via Wikimedia Commons",
  heritageStone:
    "Shirgul Maharaj Temple, Churdhar, Himachal Pradesh — UnpetitproleX, CC BY 4.0, via Wikimedia Commons",
  why: "Terrace farming near Ransi village, Garhwal — Varun Shiv Kapur, CC BY 2.0, via Wikimedia Commons",
  knowledgeBooks:
    "Open book and notebook — Glenn Carstens-Peters, CC0, via Wikimedia Commons",
  communityLandscape:
    "Mountain landscape, Himachal Pradesh — Aashish Chindaliya, CC0, via Wikimedia Commons",
};
