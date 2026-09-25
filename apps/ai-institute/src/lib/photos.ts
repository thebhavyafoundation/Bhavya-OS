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
  hero: "/photography/hero/hero-himalayan-sunset.jpg",
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
