import { lessonContent, type LessonContent } from "@/data/lesson-content";
import type { Lesson, LessonBlock, WidgetSpec } from "@/types/curriculum";

const WIDGETS: Record<string, WidgetSpec> = {
  "defining-ai": {
    id: "tap-match",
    config: {
      pairs: [
        {
          a: "Artificial Intelligence",
          b: "The broad field of machines performing tasks that require human intelligence",
        },
        {
          a: "Machine Learning",
          b: "A subset of AI in which systems learn patterns from data",
        },
        {
          a: "Deep Learning",
          b: "Machine learning that uses neural networks with many layers",
        },
      ],
    },
  },
  "history-of-ai": {
    id: "predict-reveal",
    config: {
      prompt: "What mainly caused the first AI winter in the 1970s?",
      options: [
        "Computers were too slow",
        "Unmet promises and reduced funding",
        "A global economic recession",
        "The internet did not exist yet",
      ],
      answer: "Unmet promises and reduced funding",
      reveal:
        "AI researchers over-promised capabilities. When expert systems proved expensive and brittle, funding agencies pulled back.",
    },
  },
  "types-of-ai-systems": {
    id: "sort-basket",
    config: {
      prompt: "Sort each system into the capability type it uses today.",
      categories: ["Reactive AI", "Limited Memory AI"],
      items: [
        {
          text: "Chess engine evaluating the current board",
          category: "Reactive AI",
        },
        { text: "Calculator", category: "Reactive AI" },
        { text: "IBM Deep Blue", category: "Reactive AI" },
        {
          text: "Self-driving car using recent sensor data",
          category: "Limited Memory AI",
        },
        { text: "Recommendation engine", category: "Limited Memory AI" },
        { text: "ChatGPT", category: "Limited Memory AI" },
      ],
    },
  },
  "the-ai-workflow": {
    id: "predict-reveal",
    config: {
      prompt: "What should happen after an AI model is deployed?",
      options: [
        "The project is finished",
        "Monitor performance and iterate",
        "Delete the training data",
        "Freeze the model forever",
      ],
      answer: "Monitor performance and iterate",
      reveal:
        "Deployment is not the end. Models require ongoing monitoring, retraining, and updating as conditions change.",
    },
  },
  "ethics-in-ai": {
    id: "investigate",
    config: {
      prompt: "Flag every statement that describes a real source of AI bias.",
      items: [
        {
          text: "Training data reflects past discrimination",
          correct: true,
        },
        {
          text: "Certain groups are underrepresented in the data",
          correct: true,
        },
        {
          text: "Features act as proxies for protected attributes",
          correct: true,
        },
        { text: "A syntax bug in the source code", correct: false },
        { text: "Bias in the training hardware", correct: false },
        {
          text: "Removing protected attributes from the data eliminates bias",
          correct: false,
        },
      ],
    },
  },
};

const MODULE_LESSON_MAP: readonly {
  readonly moduleId: string;
  readonly legacyIds: readonly string[];
}[] = [
  {
    moduleId: "l0-m1",
    legacyIds: ["defining-ai", "history-of-ai", "types-of-ai-systems"],
  },
  { moduleId: "l4-m1", legacyIds: ["the-ai-workflow"] },
  { moduleId: "l0-m7", legacyIds: ["ethics-in-ai"] },
];

function bulletList(items: readonly string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

function toLesson(
  legacy: LessonContent,
  moduleId: string,
  index: number,
): Lesson {
  const lessonId = `${moduleId}-l${index + 1}`;
  const widget = WIDGETS[legacy.id];
  const blocks: LessonBlock[] = [
    {
      kind: "prose",
      text: `In this lesson you will:\n${bulletList(legacy.objectives)}`,
    },
    { kind: "prose", text: legacy.visualExplanation },
  ];
  if (widget) {
    blocks.push({ kind: "interactive", widget });
  }
  blocks.push({
    kind: "quiz",
    questions: legacy.quiz.map((question, questionIndex) => ({
      id: `${lessonId}-q${questionIndex + 1}`,
      prompt: question.question,
      options: question.options,
      correctIndex: question.correctIndex,
      feedback: {
        correct: question.explanation,
        incorrect: question.explanation,
      },
    })),
  });
  blocks.push({
    kind: "experiment",
    title: legacy.lab.title,
    materials: ["Python 3", "A text editor or Jupyter notebook"],
    steps: legacy.lab.steps.map((step) =>
      [
        step.instruction,
        step.code,
        step.hint ? `Hint: ${step.hint}` : undefined,
      ]
        .filter((part): part is string => Boolean(part))
        .join("\n\n"),
    ),
  });
  blocks.push({
    kind: "project",
    brief: `${legacy.assignment.title}: ${legacy.assignment.description}`,
    steps: legacy.assignment.tasks.map((task) => task.task),
    deliverable: `${legacy.miniProject.title}: ${legacy.miniProject.deliverables.join(" ")}`,
  });
  blocks.push({
    kind: "prose",
    text: `Common misconceptions:\n${bulletList(legacy.commonMisconceptions)}`,
  });
  blocks.push({ kind: "prose", text: legacy.revisionSummary });
  blocks.push({
    kind: "prose",
    text: `Further reading:\n${bulletList(legacy.researchReferences)}`,
  });
  return {
    id: lessonId,
    moduleId,
    title: legacy.title,
    blocks,
  };
}

export const LESSONS: readonly Lesson[] = MODULE_LESSON_MAP.flatMap(
  ({ moduleId, legacyIds }) =>
    legacyIds.map((legacyId, index) => {
      const legacy = lessonContent.find((entry) => entry.id === legacyId);
      if (!legacy) {
        throw new Error(`Missing legacy lesson content: ${legacyId}`);
      }
      return toLesson(legacy, moduleId, index);
    }),
);
