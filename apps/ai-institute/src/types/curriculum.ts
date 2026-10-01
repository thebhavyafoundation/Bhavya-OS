export type AISourceId =
  "USA.CA.AI" | "China.MOE.IT.AI" | "UNESCO.AI" | "OECD.AI";

export type AIGradeBand = "K-2" | "3-5" | "6-8" | "9-12" | "all";

export interface AIStandard {
  readonly id: string;
  readonly source: AISourceId;
  readonly gradeBand: AIGradeBand;
  readonly concept: string;
  readonly description: string;
  readonly prerequisites?: readonly string[];
}

export type AIBand = "junior-a" | "junior-b" | "core" | "advanced";

export type AILevel =
  "JA" | "JB" | "L0" | "L1" | "L2" | "L3" | "L4" | "L5" | "L6" | "ADV";

export interface AIModule {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly band: AIBand;
  readonly level: AILevel;
  readonly description: string;
  readonly topics: readonly string[];
  readonly standards: readonly string[];
  readonly prerequisites?: readonly string[];
  readonly estimatedHours: number;
}
