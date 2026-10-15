/**
 * Curriculum types for the Bhavya AI Institute application.
 *
 * This file exports the public type surface for curriculum-related types.
 * The data layer types (@/data/curriculum/types) are authoritative;
 * this file re-exports compatible types for consumption by the app.
 */

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

export type BloomVerb =
  "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create";

export type VisualType =
  | "concept-diagram"
  | "process-diagram"
  | "data-viz"
  | "metaphor"
  | "spatial-model";

export type VisualFormat = "3d" | "2d" | "animation" | "infographic";

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
  readonly learningObjective: string;
  readonly bloomVerb: BloomVerb;
  visualType: VisualType;
  visualFormat: VisualFormat;
  readonly recommendedAssetUrl?: string;
}

export interface QuizQuestion {
  readonly id: string;
  readonly prompt: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly feedback: {
    readonly correct: string;
    readonly incorrect: string;
  };
}

export type WidgetSpec =
  | {
      readonly id: "tap-match";
      readonly config: {
        readonly pairs: readonly { readonly a: string; readonly b: string }[];
      };
    }
  | {
      readonly id: "sort-basket";
      readonly config: {
        readonly prompt: string;
        readonly categories: readonly string[];
        readonly items: readonly {
          readonly text: string;
          readonly category: string;
        }[];
      };
    }
  | {
      readonly id: "predict-reveal";
      readonly config: {
        readonly prompt: string;
        readonly options?: readonly string[];
        readonly answer: string;
        readonly reveal: string;
      };
    }
  | {
      readonly id: "story-scene";
      readonly config: {
        readonly scenes: readonly {
          readonly narration: string;
          readonly highlight?: string;
        }[];
        readonly speak?: boolean;
        readonly autoPlay?: boolean;
      };
    }
  | {
      readonly id: "sim-controls";
      readonly config: {
        readonly preset:
          "perceptron-step" | "knn-1d" | "overfit-poly" | "bar-perception";
        readonly prompt: string;
      };
    }
  | {
      readonly id: "investigate";
      readonly config: {
        readonly prompt: string;
        readonly mode: "flag" | "answer";
        readonly dataset: readonly string[];
        readonly items: readonly {
          readonly text: string;
          readonly correct: boolean | string;
        }[];
      };
    }
  | {
      readonly id: "bar-chart";
      readonly config: {
        readonly title: string;
        readonly bars: readonly {
          readonly label: string;
          readonly value: number;
        }[];
      };
    }
  | {
      readonly id: "tokenize-explorer";
      readonly config: {
        readonly initialText?: string;
      };
    }
  | {
      readonly id: "attention-play";
      readonly config: {
        readonly query?: string;
        readonly context?: string;
      };
    };

import type { DiagramSpec } from "@/data/curriculum";

export type LessonBlock =
  | { kind: "visual"; diagram: DiagramSpec }
  | { kind: "prose"; text: string }
  | { kind: "quiz"; questions: QuizQuestion[] }
  | { kind: "interactive"; widget: WidgetSpec }
  | {
      kind: "experiment";
      title: string;
      materials: string[];
      steps: string[];
      safety?: string;
    }
  | {
      kind: "project";
      brief: string;
      steps: string[];
      deliverable: string;
    };

export interface Lesson {
  id: string;
  moduleId: string;
  band: AIBand;
  title: string;
  durationMin: number;
  blocks: LessonBlock[];
}

export interface CurriculumModule {
  id: string;
  level: string;
  title: string;
  mission: string;
  objectives: string[];
  ageBand: string;
  duration: string;
  handsOnPercent: number;
  projects: string[];
  labs: string[];
  prerequisites: string[];
  difficulty: string;
  mentorLed?: boolean;
}
