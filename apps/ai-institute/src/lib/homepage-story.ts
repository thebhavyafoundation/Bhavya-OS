import { getTotalModules } from "@/data/curriculum-levels";

/**
 * Homepage story data — single source for the ten-beat narrative.
 *
 * Content truth (bhavya-content-truth):
 * - Every proof point carries an explicit source and verification state.
 * - States: "verified" (computed from repo data), "reported" (constitutional
 *   claim, traceable to a document), "pending" (not yet substantiated).
 * - Never invent metrics; values come from Brand Constitution Art. 10 and
 *   curriculum data only.
 */

export type VerificationState = "verified" | "reported" | "pending";

export interface StoryProofPoint {
  value: string;
  label: string;
  source: string;
  state: VerificationState;
}

export const STORY_PROOF: StoryProofPoint[] = [
  {
    value: "8+",
    label: "Hectares restored",
    source: "Brand Constitution · Art. 10",
    state: "reported",
  },
  {
    value: "10K+",
    label: "Students empowered",
    source: "Brand Constitution · Art. 10",
    state: "reported",
  },
  {
    value: "50+",
    label: "Communities engaged",
    source: "Brand Constitution · Art. 10",
    state: "reported",
  },
  {
    value: String(getTotalModules()),
    label: "Curriculum modules",
    source: "Bhavya Academy · curriculum data",
    state: "verified",
  },
];

export interface StoryChapter {
  key: "forest" | "knowledge" | "heritage" | "community";
  index: string;
  label: string;
  line: string;
  href: string;
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    key: "forest",
    index: "01",
    label: "Forest",
    line: "Restore living systems. Protect watersheds. Hold the ground for generations.",
    href: "/forest",
  },
  {
    key: "knowledge",
    index: "02",
    label: "Knowledge",
    line: "Open learning for rural India — structured, free, built to endure.",
    href: "/knowledge",
  },
  {
    key: "heritage",
    index: "03",
    label: "Heritage",
    line: "Keep living memory. Document craft, place, and story before they fade.",
    href: "/heritage",
  },
  {
    key: "community",
    index: "04",
    label: "Community",
    line: "Local leadership at the center. Resilience grown from within.",
    href: "/community",
  },
];

export type HeroBeat =
  | "promise"
  | "thesis"
  | "forest"
  | "knowledge"
  | "heritage"
  | "community"
  | "learning"
  | "structure"
  | "system"
  | "invitation";

export const HERO_BEATS: HeroBeat[] = [
  "promise",
  "thesis",
  "forest",
  "knowledge",
  "heritage",
  "community",
  "learning",
  "structure",
  "system",
  "invitation",
];
