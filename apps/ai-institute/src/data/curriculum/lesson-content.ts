import {
  type Lesson,
  type LessonBlock,
  type QuizQuestion,
  type WidgetSpec,
  type DiagramSpec,
  type ExperimentBlock,
  type ProjectBlock,
} from "@/data/curriculum";
import { getAllModules } from "@/data/curriculum";
import { registerLesson } from "@/lib/curriculum/lessons";

const _makeQuiz = (questions: Omit<QuizQuestion, "id">[]): QuizQuestion[] => {
  return questions.map((q, i) => ({ ...q, id: `q${i + 1}` }));
};

function makeBlocks(
  moduleId: string,
  lessonIndex: number,
  lessonTitle: string,
): LessonBlock[] {
  const blocks: LessonBlock[] = [];

  // Visual block
  blocks.push({
    kind: "visual",
    diagram: {
      kind: "flow",
      title: `${lessonTitle} — Overview`,
      steps: ["Concept", "Practice", "Application"],
    },
  });

  // Prose block
  blocks.push({
    kind: "prose",
    text: `In this lesson, you will explore ${lessonTitle.toLowerCase()}. We'll cover the key concepts, work through examples, and build intuition through hands-on practice.`,
  });

  // Interactive widget (varies by module)
  const widgetMap: Record<string, WidgetSpec> = {
    "l0-m1": {
      id: "tap-match",
      config: {
        pairs: [
          { a: "AI", b: "Artificial Intelligence" },
          { a: "ML", b: "Machine Learning" },
          { a: "NN", b: "Neural Network" },
        ],
      },
    },
    "l0-m2": {
      id: "sort-basket",
      config: {
        prompt: "Sort these into AI vs traditional software",
        categories: ["AI", "Traditional"],
        items: [
          { text: "Spam filter", category: "AI" },
          { text: "Calculator", category: "Traditional" },
          { text: "Recommendation engine", category: "AI" },
          { text: "Sort algorithm", category: "Traditional" },
        ],
      },
    },
    "l0-m3": {
      id: "predict-reveal",
      config: {
        prompt: "What happens when you ask an LLM a question?",
        options: [
          "It searches the web",
          "It predicts next token",
          "It runs code",
          "It calls an API",
        ],
        answer: "It predicts next token",
        reveal:
          "LLMs generate text by predicting the most likely next token based on context.",
      },
    },
    "l1-m1": {
      id: "tap-match",
      config: {
        pairs: [
          { a: "Token", b: "Unit of text" },
          { a: "Embedding", b: "Vector representation" },
          { a: "Context window", b: "Max input length" },
        ],
      },
    },
    "l1-m2": {
      id: "sort-basket",
      config: {
        prompt: "Sort by capability",
        categories: ["Understanding", "Generation"],
        items: [
          { text: "Summarization", category: "Generation" },
          { text: "Sentiment analysis", category: "Understanding" },
          { text: "Translation", category: "Generation" },
          { text: "Classification", category: "Understanding" },
        ],
      },
    },
    "l1-m3": {
      id: "predict-reveal",
      config: {
        prompt: "What is a token?",
        options: ["A word", "A character", "A subword unit", "A sentence"],
        answer: "A subword unit",
        reveal:
          "Tokens are subword units that LLMs process, not necessarily whole words.",
      },
    },
    "l2-m1": {
      id: "sim-controls",
      config: {
        preset: "perceptron-step",
        prompt: "Adjust the threshold to classify points",
      },
    },
    "l2-m2": {
      id: "investigate",
      config: {
        prompt: "Flag biased statements",
        mode: "flag",
        dataset: [
          "Data is neutral",
          "Models learn from data",
          "Bias comes from data",
        ],
        items: [
          { text: "Data reflects society", correct: true },
          { text: "Algorithms are objective", correct: false },
          { text: "Bias can be removed by ignoring race", correct: false },
        ],
      },
    },
    "l2-m3": {
      id: "tap-match",
      config: {
        pairs: [
          { a: "Accuracy", b: "Correct predictions / Total" },
          { a: "Precision", b: "TP / (TP + FP)" },
          { a: "Recall", b: "TP / (TP + FN)" },
        ],
      },
    },
    "l3-m1": {
      id: "sim-controls",
      config: {
        preset: "knn-1d",
        prompt: "Change k to see how classification changes",
      },
    },
    "l3-m2": {
      id: "sort-basket",
      config: {
        prompt: "Sort architectures",
        categories: ["CNN", "RNN", "Transformer"],
        items: [
          { text: "ResNet", category: "CNN" },
          { text: "LSTM", category: "RNN" },
          { text: "BERT", category: "Transformer" },
          { text: "GPT", category: "Transformer" },
        ],
      },
    },
    "l3-m3": {
      id: "predict-reveal",
      config: {
        prompt: "What does attention do?",
        options: [
          "Stores memory",
          "Weights input relevance",
          "Compresses data",
          "Generates text",
        ],
        answer: "Weights input relevance",
        reveal:
          "Attention computes weighted sums of values based on query-key similarity.",
      },
    },
    "l4-m1": {
      id: "investigate",
      config: {
        prompt: "Flag safety issues",
        mode: "flag",
        dataset: ["Model outputs", "User prompts", "System logs"],
        items: [
          { text: "Hallucinated facts", correct: true },
          { text: "Correct answer", correct: false },
          { text: "Refusal", correct: false },
        ],
      },
    },
    "l4-m2": {
      id: "tap-match",
      config: {
        pairs: [
          { a: "RAG", b: "Retrieval-Augmented Generation" },
          { a: "Embedding", b: "Vector search" },
          { a: "Chunking", b: "Split documents" },
        ],
      },
    },
    "l4-m3": {
      id: "sim-controls",
      config: {
        preset: "overfit-poly",
        prompt: "Increase degree to see overfitting",
      },
    },
    "l5-m1": {
      id: "investigate",
      config: {
        prompt: "Flag fairness issues",
        mode: "flag",
        dataset: ["Hiring model", "Loan model", "Medical model"],
        items: [
          { text: "Disparate impact", correct: true },
          { text: "Equal accuracy", correct: false },
          { text: "Demographic parity", correct: true },
        ],
      },
    },
    "l5-m2": {
      id: "sort-basket",
      config: {
        prompt: "Sort by risk level",
        categories: ["High", "Medium", "Low"],
        items: [
          { text: "Autonomous weapons", category: "High" },
          { text: "Content moderation", category: "Medium" },
          { text: "Spell check", category: "Low" },
        ],
      },
    },
    "l5-m3": {
      id: "predict-reveal",
      config: {
        prompt: "What is alignment?",
        options: [
          "Code optimization",
          "Human values match",
          "Speed optimization",
          "Memory reduction",
        ],
        answer: "Human values match",
        reveal:
          "Alignment ensures AI systems pursue goals that match human values.",
      },
    },
  };

  return blocks;
}

function createLesson(
  moduleId: string,
  lessonIndex: number,
  lessonTitle: string,
): void {
  // getModule() takes (level, id), so looking a module up by id alone always
  // failed and every lesson was skipped. Resolve from the module list instead.
  const mod = getAllModules().find((m) => m.id === moduleId);
  if (!mod) return;

  const ageBand = mod.ageBand;
  const lessonId = `${moduleId}-l${lessonIndex + 1}`;

  const lesson: Lesson = {
    id: lessonId,
    moduleId,
    band: ageBand,
    title: lessonTitle,
    durationMin: 30,
    blocks: makeBlocks(moduleId, lessonIndex, lessonTitle),
  };

  // Without this call every lesson route 404s: the registry the pages read from
  // is populated only when a lesson is registered against it.
  registerLesson(lesson);
}

function getModuleLessonTitles(moduleId: string): string[] {
  const titles: Record<string, string[]> = {
    "l0-m1": ["What Is AI?", "How AI Works", "AI History"],
    "l0-m2": ["Prompt Fundamentals", "Advanced Prompting", "Prompt Patterns"],
    "l1-m1": [
      "LLM API Integration",
      "Application Architecture",
      "User Experience",
    ],
    "l1-m2": ["LLM Fundamentals", "Fine-tuning", "RLHF"],
    "l2-m1": ["ML Pipeline", "Neural Networks", "Embeddings"],
    "l2-m2": ["Bias & Fairness", "Privacy", "Work & Economy"],
    "l3-m1": ["Frontier Models", "AI Agents", "Research Methods"],
    "l3-m2": ["Neural Nets In Depth", "Computer Vision", "Language Models"],
    "l4-m1": ["Frontier Models", "AI Agents", "Research Methods"],
    "l4-m2": ["Neural Nets In Depth", "Computer Vision", "Language Models"],
    "l5-m1": ["Frontier Models", "AI Agents", "Research Methods"],
    "l5-m2": ["Neural Nets In Depth", "Computer Vision", "Language Models"],
    "l5-m3": ["Alignment", "Safety", "Governance"],
  };

  return titles[moduleId] || ["Lesson"];
}

function populateAllLessons(): void {
  const mods = getAllModules();
  for (const mod of mods) {
    const lessonTitles = getModuleLessonTitles(mod.id);
    lessonTitles.forEach((title, index) => {
      createLesson(mod.id, index, title);
    });
  }
}

populateAllLessons();
