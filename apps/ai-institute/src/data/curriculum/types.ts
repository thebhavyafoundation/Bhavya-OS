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

/**
 * A diagram specification.
 *
 * Every variant carries the same optional `textAlternative`: the plain-language
 * equivalent of what the graphic shows. It is required in practice by the
 * authoring standard (a concept visual must be understandable without seeing
 * it) and is rendered as a `<desc>` plus a visible "Read this diagram as
 * text" disclosure.
 */
export type DiagramSpec = (
  | { kind: "flow" | "pipeline" | "nested"; title: string; steps: string[] }
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
    }
) & {
  /** Plain-language equivalent of the graphic. Shown as text beside it. */
  textAlternative?: string;
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
  | {
      kind: "guided-example";
      title: string;
      language: string;
      code: string;
      walkthrough: string[];
    }
  | ExperimentBlock
  | ProjectBlock;

export interface Lesson {
  id: string;
  moduleId: string;
  band: AgeBand;
  title: string;
  durationMin: number;
  blocks: LessonBlock[];
  /**
   * The lesson's reading frame: what the learner will be able to do, the
   * worked example, where the material came from, how far it has been
   * reviewed, and what to do next.
   *
   * Kept separate from `blocks` because these are the parts of a lesson that
   * are *about the lesson*, not the lesson body: they frame the body rather
   * than being one more paragraph in it.
   */
  detail?: LessonDetail;
}

/** A source the lesson is built on, with the attribution preserved. */
export interface LessonSource {
  /** Full citation as printed in the lesson's reference list. */
  citation: string;
  /** Short attribution line shown beside the citation. */
  attribution: string;
}

/**
 * Per-lesson review state.
 *
 * "pending" is the honest default for anything a human subject-matter
 * reviewer has not yet signed off. It is not a failure state — it is the
 * accurate description of the lesson's maturity.
 */
export interface LessonReview {
  content: "pending" | "reviewed";
  subject: "pending" | "reviewed";
  accessibility: "pending" | "reviewed";
  /** ISO date, set when the review was actually performed. */
  reviewedOn?: string;
}

export interface LessonDetail {
  /** One sentence: what the learner will be able to do afterwards. */
  outcome: string;
  /** Worked example: the code, with a line-by-line walkthrough. */
  guidedExample?: { title: string; language: string; walkthrough: string[] };
  /** Sources the lesson is built on, with attribution. */
  sources: LessonSource[];
  /** How far this lesson has been reviewed. */
  review: LessonReview;
  /** What the learner should do next, stated as an instruction. */
  nextStep: string;
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
