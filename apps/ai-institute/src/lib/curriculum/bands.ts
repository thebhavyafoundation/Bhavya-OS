import type { AIBand, AILevel } from "@/types/curriculum";

export interface BandMeta {
  id: AIBand;
  name: string;
  ages: string;
  levels: readonly AILevel[];
}

export const BAND_AGES: Record<AIBand, string> = {
  "junior-a": "Ages 6–8",
  "junior-b": "Ages 9–10",
  core: "Ages 11–16",
  advanced: "Ages 16–18",
};

export const BAND_META: readonly BandMeta[] = [
  {
    id: "junior-a",
    name: "Junior A",
    ages: BAND_AGES["junior-a"],
    levels: ["JA"],
  },
  {
    id: "junior-b",
    name: "Junior B",
    ages: BAND_AGES["junior-b"],
    levels: ["JB"],
  },
  {
    id: "core",
    name: "Core",
    ages: BAND_AGES.core,
    levels: ["L0", "L1", "L2", "L3", "L4", "L5", "L6"],
  },
  {
    id: "advanced",
    name: "Advanced",
    ages: BAND_AGES.advanced,
    levels: ["ADV"],
  },
];

export const BAND_LABELS: Record<AIBand, string> = {
  "junior-a": "Junior A",
  "junior-b": "Junior B",
  core: "Core",
  advanced: "Advanced",
};
