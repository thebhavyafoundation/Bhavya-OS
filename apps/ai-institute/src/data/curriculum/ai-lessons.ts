import type { AIModule, BloomVerb, VisualType, VisualFormat } from "@/types/curriculum";

export interface AILesson {
  readonly id: string;
  readonly moduleId: string;
  readonly title: string;
  readonly learningObjective: string;
  readonly bloomVerb: BloomVerb;
  readonly gradeBand: "junior-a" | "junior-b" | "core" | "advanced";
  readonly stages: {
    readonly visualHook: {
      readonly assetUrl: string;
      readonly duration: number;
      readonly description: string;
    };
    readonly guidedExploration: {
      readonly assetUrl: string;
      readonly teacherActions: readonly string[];
      readonly duration: number;
    };
    readonly collaborativeInquiry: {
      readonly assetUrl: string;
      readonly studentActions: readonly string[];
      readonly duration: number;
    };
    readonly boardExamAlignment: {
      readonly assetUrl: string;
      readonly examQuestions: readonly string[];
      readonly duration: number;
    };
  };
  readonly visuals: readonly {
    readonly visualType: VisualType;
    readonly visualFormat: VisualFormat;
    readonly assetUrl: string;
    readonly cognitiveLoadType: "intrinsic" | "extraneous" | "germane";
    readonly multimediaPrinciples: {
      readonly spatialContiguity: boolean;
      readonly temporalContiguity: boolean;
      readonly coherence: boolean;
      readonly modality: boolean;
      readonly redundancy: boolean;
    };
  }[];
}

function getGradeBand(module: AIModule): "junior-a" | "junior-b" | "core" | "advanced" {
  if (module.band === "junior-a") return "junior-a";
  if (module.band === "junior-b") return "junior-b";
  if (module.level === "ADV") return "advanced";
  return "core";
}

function getHookDescription(visualType: VisualType): string {
  switch (visualType) {
    case "spatial-model":
      return "3D model rotates on screen, showing spatial structure and relationships";
    case "process-diagram":
      return "Animated diagram shows the process flow step by step";
    case "data-viz":
      return "Interactive data visualization reveals patterns and insights";
    case "metaphor":
      return "3D metaphor makes abstract concept concrete and memorable";
    case "concept-diagram":
      return "Animated concept diagram shows relationships between ideas";
  }
}

function getTeacherActions(visualType: VisualType, topics: readonly string[]): string[] {
  const actions: string[] = [];
  if (visualType === "spatial-model") {
    actions.push("Highlight key structural components");
    actions.push("Show how parts connect and interact");
    actions.push("Rotate model to show different perspectives");
  } else if (visualType === "process-diagram") {
    actions.push("Walk through each step of the process");
    actions.push("Highlight decision points and branches");
    actions.push("Show how output feeds back to input");
  } else if (visualType === "data-viz") {
    actions.push("Point out patterns in the data");
    actions.push("Ask students to predict what happens next");
    actions.push("Connect data patterns to real-world examples");
  } else if (visualType === "metaphor") {
    actions.push("Introduce the metaphor and its meaning");
    actions.push("Map metaphor elements to concept components");
    actions.push("Ask students to create their own metaphors");
  } else {
    actions.push("Introduce key concepts and their relationships");
    actions.push("Highlight connections between ideas");
    actions.push("Ask students to explain relationships in their own words");
  }
  actions.push(`Connect to topic: ${topics[0] || "core concept"}`);
  return actions;
}

function getStudentActions(visualType: VisualType): string[] {
  switch (visualType) {
    case "spatial-model":
      return [
        "Manipulate the 3D model (rotate, zoom, pan)",
        "Identify and label key components",
        "Predict how changing one part affects others",
      ];
    case "process-diagram":
      return [
        "Trace the process flow with their finger",
        "Identify decision points and predict outcomes",
        "Modify inputs and observe output changes",
      ];
    case "data-viz":
      return [
        "Explore the data visualization interactively",
        "Identify patterns and outliers",
        "Form and test hypotheses about the data",
      ];
    case "metaphor":
      return [
        "Map metaphor elements to concept components",
        "Create their own metaphor for the concept",
        "Explain the concept using their metaphor",
      ];
    case "concept-diagram":
      return [
        "Trace relationships between concepts",
        "Add new connections they discover",
        "Explain the concept map to a peer",
      ];
  }
}

function getExamQuestions(title: string, topics: readonly string[]): string[] {
  return [
    `Define ${title.toLowerCase()} in your own words.`,
    `Explain how ${topics[0] || "the core concept"} relates to ${topics[1] || "the topic"}.`,
    `Give a real-world example of ${title.toLowerCase()}.`,
  ];
}

function createLessonFromModule(module: AIModule): AILesson {
  const gradeBand = getGradeBand(module);
  const hookDuration = gradeBand === "junior-a" || gradeBand === "junior-b" ? 3 : 5;
  const explorationDuration = gradeBand === "junior-a" || gradeBand === "junior-b" ? 10 : 15;
  const inquiryDuration = gradeBand === "junior-a" || gradeBand === "junior-b" ? 8 : 12;
  const examDuration = gradeBand === "junior-a" || gradeBand === "junior-b" ? 4 : 8;

  const primaryAssetUrl = module.recommendedAssetUrl || "github:models/[to-be-downloaded].glb";
  const examAssetUrl = module.visualFormat === "3d"
    ? "github:icons/reshot/[to-be-downloaded].svg"
    : "github:icons/reshot/[to-be-downloaded].svg";

  return {
    id: `lesson-${module.id}`,
    moduleId: module.id,
    title: module.title,
    learningObjective: module.learningObjective,
    bloomVerb: module.bloomVerb,
    gradeBand,
    stages: {
      visualHook: {
        assetUrl: primaryAssetUrl,
        duration: hookDuration,
        description: getHookDescription(module.visualType),
      },
      guidedExploration: {
        assetUrl: primaryAssetUrl,
        teacherActions: getTeacherActions(module.visualType, module.topics),
        duration: explorationDuration,
      },
      collaborativeInquiry: {
        assetUrl: primaryAssetUrl,
        studentActions: getStudentActions(module.visualType),
        duration: inquiryDuration,
      },
      boardExamAlignment: {
        assetUrl: examAssetUrl,
        examQuestions: getExamQuestions(module.title, module.topics),
        duration: examDuration,
      },
    },
    visuals: [
      {
        visualType: module.visualType,
        visualFormat: module.visualFormat,
        assetUrl: primaryAssetUrl,
        cognitiveLoadType: "germane",
        multimediaPrinciples: {
          spatialContiguity: true,
          temporalContiguity: module.visualFormat === "3d" || module.visualFormat === "animation",
          coherence: true,
          modality: true,
          redundancy: false,
        },
      },
      {
        visualType: "concept-diagram",
        visualFormat: "2d",
        assetUrl: examAssetUrl,
        cognitiveLoadType: "germane",
        multimediaPrinciples: {
          spatialContiguity: true,
          temporalContiguity: false,
          coherence: true,
          modality: false,
          redundancy: false,
        },
      },
    ],
  };
}

export function generateLessons(modules: readonly AIModule[]): AILesson[] {
  return modules.map(createLessonFromModule);
}
