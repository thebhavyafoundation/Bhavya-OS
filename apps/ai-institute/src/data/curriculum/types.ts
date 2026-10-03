export type AgeBand = "6-8" | "9-11" | "12-15" | "advanced";
export type LevelParam = "jr-a" | "jr-b" | `${number}`;

export interface CatalogModule {
  id: string;
  level: number;
  moduleNumber: number;
  title: string;
  mission: string;
  objectives: string[];
  prerequisites: string[];
  difficulty: string;
  duration: string;
  handsOnPercent: number;
  projects: string[];
  labs: string[];
}

export interface Standards {
  bigIdeas: Array<"BI1" | "BI2" | "BI3" | "BI4" | "BI5">;
  csta?: string[];
  cnDim: "认知" | "技能" | "思维" | "价值观";
  cnStage: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  feedback: { correct: string; incorrect: string };
}

export type DiagramSpec =
  | { kind: "flow" | "pipeline"; title: string; steps: string[] }
  | { kind: "cycle"; title: string; steps: string[] }
  | {
      kind: "timeline";
      title: string;
      points: Array<{ label: string; note?: string }>;
    }
  | {
      kind: "compare";
      title: string;
      left: { label: string; items: string[] };
      right: { label: string; items: string[] };
    }
  | {
      kind: "network";
      title: string;
      nodes: string[];
      edges: Array<[string, string]>;
    }
  | {
      kind: "labeled-photo";
      title: string;
      src: string;
      labels: Array<{ x: number; y: number; text: string }>;
    }
  | {
      kind: "bar-chart";
      title: string;
      bars: Array<{ label: string; value: number }>;
    };

export type WidgetSpec =
  | { id: "tap-match"; config: { pairs: Array<{ a: string; b: string }> } }
  | {
      id: "sort-basket";
      config: {
        prompt: string;
        categories: string[];
        items: Array<{ text: string; category: string }>;
      };
    }
  | {
      id: "predict-reveal";
      config: {
        prompt: string;
        options?: string[];
        answer: string;
        reveal: string;
      };
    }
  | {
      id: "story-scene";
      config: {
        scenes: Array<{ narration: string; highlight?: string }>;
        speak?: boolean;
        autoPlay?: boolean;
      };
    }
  | {
      id: "sim-controls";
      config: {
        preset:
          "perceptron-step" | "knn-1d" | "overfit-poly" | "bar-perception";
        prompt: string;
      };
    }
  | {
      id: "investigate";
      config: {
        prompt: string;
        mode: "flag" | "answer";
        dataset: string[];
        items: Array<{ text: string; correct: boolean | string }>;
      };
    }
  | { id: "tokenize-explorer"; config: { initialText?: string } }
  | { id: "attention-play"; config: { query?: string; context?: string } };

export interface ExperimentBlock {
  kind: "experiment";
  title: string;
  materials: string[];
  steps: string[];
  safety?: string;
}
export interface ProjectBlock {
  kind: "project";
  brief: string;
  steps: string[];
  deliverable: string;
}

export type LessonBlock =
  | { kind: "visual"; diagram: DiagramSpec }
  | { kind: "prose"; text: string }
  | { kind: "interactive"; widget: WidgetSpec }
  | { kind: "quiz"; questions: QuizQuestion[] }
  | ExperimentBlock
  | ProjectBlock;

export interface Lesson {
  id: string;
  moduleId: string;
  band: AgeBand;
  title: string;
  durationMin: number;
  blocks: LessonBlock[];
}

export interface CurriculumModule {
  id: string;
  level: LevelParam;
  title: string;
  mission: string;
  objectives: string[];
  ageBand: AgeBand;
  duration: string;
  handsOnPercent: number;
  projects: string[];
  labs: string[];
  prerequisites: string[];
  difficulty: string;
  mentorLed?: boolean;
}
