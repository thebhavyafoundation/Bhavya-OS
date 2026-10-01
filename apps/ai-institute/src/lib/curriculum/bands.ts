import type { AIBand, AILevel } from "@/types/curriculum";

export interface BandMeta {
  id: AIBand;
  name: string;
  grades: string;
  levels: readonly AILevel[];
}

export const BAND_META: readonly BandMeta[] = [
  { id: "junior-a", name: "Junior A", grades: "Grades 1–3", levels: ["JA"] },
  { id: "junior-b", name: "Junior B", grades: "Grades 4–5", levels: ["JB"] },
  {
    id: "core",
    name: "Core",
    grades: "Grades 6–12",
    levels: ["L0", "L1", "L2", "L3", "L4", "L5", "L6"],
  },
  { id: "advanced", name: "Advanced", grades: "Grades 11–12", levels: ["ADV"] },
];

export const BAND_LABELS: Record<AIBand, string> = {
  "junior-a": "Junior A",
  "junior-b": "Junior B",
  core: "Core",
  advanced: "Advanced",
};
