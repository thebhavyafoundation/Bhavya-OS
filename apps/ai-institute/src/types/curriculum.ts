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

export type BloomVerb = "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create";

export type VisualType = "concept-diagram" | "process-diagram" | "data-viz" | "metaphor" | "spatial-model";

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
  readonly visualType: VisualType;
  readonly visualFormat: VisualFormat;
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
      readonly id: "investigate";
      readonly config: {
        readonly prompt: string;
        readonly items: readonly {
          readonly text: string;
          readonly correct: boolean;
        }[];
      };
    };

export type LessonBlock =
  | { readonly kind: "prose"; readonly text: string }
  | { readonly kind: "quiz"; readonly questions: readonly QuizQuestion[] }
  | { readonly kind: "interactive"; readonly widget: WidgetSpec }
  | {
      readonly kind: "experiment";
      readonly title: string;
      readonly materials: readonly string[];
      readonly steps: readonly string[];
      readonly safety?: string;
    }
  | {
      readonly kind: "project";
      readonly brief: string;
      readonly steps: readonly string[];
      readonly deliverable: string;
    };

export interface Lesson {
  readonly id: string;
  readonly moduleId: string;
  readonly title: string;
  readonly blocks: readonly LessonBlock[];
}
