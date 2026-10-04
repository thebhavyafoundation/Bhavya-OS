// Lesson Content — populated by P5 content task
// This file contains all lesson definitions and populates the registry.
// Import this file to populate the registry (side effect).

import { registerLesson } from "@/lib/curriculum/lessons";
import type {
  Lesson,
  LessonBlock,
  QuizQuestion,
  WidgetSpec,
} from "@/data/curriculum";
import { getAllModules, getModule } from "@/data/curriculum";

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
          "Alignment ensures AI systems pursue goals that match human intentions.",
      },
    },
    "l6-m1": {
      id: "tap-match",
      config: {
        pairs: [
          { a: "Agent", b: "Autonomous AI" },
          { a: "Tool", b: "Function call" },
          { a: "Memory", b: "Context storage" },
        ],
      },
    },
    "l6-m2": {
      id: "sim-controls",
      config: { preset: "perceptron-step", prompt: "Design agent loop" },
    },
    "l6-m3": {
      id: "investigate",
      config: {
        prompt: "Flag multi-agent risks",
        mode: "flag",
        dataset: ["Agent comms", "Task allocation", "Consensus"],
        items: [
          { text: "Infinite loops", correct: true },
          { text: "Fast execution", correct: false },
          { text: "Consensus failure", correct: true },
        ],
      },
    },
    "jr-a-1": {
      id: "story-scene",
      config: {
        scenes: [
          {
            narration: "Look around — smart tools are everywhere!",
            highlight: "From phones to thermostats",
          },
          {
            narration: "Can you name three smart tools you used today?",
            highlight: "Think about your morning",
          },
        ],
        speak: true,
        autoPlay: false,
      },
    },
    "jr-a-2": {
      id: "tap-match",
      config: {
        pairs: [
          { a: "Camera", b: "Sees" },
          { a: "Microphone", b: "Hears" },
          { a: "Sensor", b: "Feels" },
        ],
      },
    },
    "jr-a-3": {
      id: "sort-basket",
      config: {
        prompt: "Sort: Human or Machine does it better?",
        categories: ["Human", "Machine"],
        items: [
          { text: "Be creative", category: "Human" },
          { text: "Calculate fast", category: "Machine" },
          { text: "Show empathy", category: "Human" },
          { text: "Process data", category: "Machine" },
        ],
      },
    },
    "jr-a-4": {
      id: "predict-reveal",
      config: {
        prompt: "What is data?",
        options: [
          "Just numbers",
          "Information collected",
          "Secret codes",
          "Magic",
        ],
        answer: "Information collected",
        reveal: "Data is information we collect to learn about the world.",
      },
    },
    "jr-a-5": {
      id: "story-scene",
      config: {
        scenes: [
          {
            narration: "Robots can be helpful friends!",
            highlight: "But we must be safe",
          },
          {
            narration: "What rules should robots follow?",
            highlight: "Kindness first",
          },
        ],
        speak: true,
        autoPlay: false,
      },
    },
    "jr-a-6": {
      id: "sort-basket",
      config: {
        prompt: "Sort: Kind or Unkind online?",
        categories: ["Kind", "Unkind"],
        items: [
          { text: "Share nicely", category: "Kind" },
          { text: "Call names", category: "Unkind" },
          { text: "Help others", category: "Kind" },
          { text: "Exclude people", category: "Unkind" },
        ],
      },
    },
    "jr-b-1": {
      id: "tap-match",
      config: {
        pairs: [
          { a: "Training", b: "Show examples" },
          { a: "Model", b: "Learns patterns" },
          { a: "Predict", b: "Guess new" },
        ],
      },
    },
    "jr-b-2": {
      id: "sort-basket",
      config: {
        prompt: "Sort: Pattern or Random?",
        categories: ["Pattern", "Random"],
        items: [
          { text: "Seasons", category: "Pattern" },
          { text: "Dice roll", category: "Random" },
          { text: "Heartbeat", category: "Pattern" },
          { text: "Lottery", category: "Random" },
        ],
      },
    },
    "jr-b-3": {
      id: "sim-controls",
      config: { preset: "bar-perception", prompt: "Count the sensors" },
    },
    "jr-b-4": {
      id: "story-scene",
      config: {
        scenes: [
          {
            narration: "Chatbots listen and reply",
            highlight: "But they can misunderstand",
          },
          {
            narration: "How do you ask clear questions?",
            highlight: "Be specific",
          },
        ],
        speak: true,
        autoPlay: false,
      },
    },
    "jr-b-5": {
      id: "investigate",
      config: {
        prompt: "Flag unfair rules",
        mode: "flag",
        dataset: [
          "Same rules for all",
          "Different rules for some",
          "Rules change daily",
        ],
        items: [
          { text: "Same rules for all", correct: false },
          { text: "Different rules for some", correct: true },
          { text: "Rules change daily", correct: true },
        ],
      },
    },
    "jr-b-6": {
      id: "sim-controls",
      config: { preset: "bar-perception", prompt: "Build your rule-bot" },
    },
  } as const;

  const widget = widgetMap[moduleId] || {
    id: "predict-reveal",
    config: {
      prompt: "What did you learn?",
      options: ["Nothing", "Something", "Everything"],
      answer: "Something",
      reveal: "Every lesson teaches something new!",
    },
  };

  blocks.push({ kind: "interactive", widget });

  // Quiz block
  blocks.push({
    kind: "quiz",
    questions: [
      {
        id: `q1`,
        prompt: `What is the main concept of "${lessonTitle}"?`,
        options: [
          "Core concept",
          "Unrelated topic",
          "Advanced theory",
          "Historical fact",
        ],
        correctIndex: 0,
        feedback: {
          correct: "Correct! The lesson focuses on the core concept.",
          incorrect: "Review the lesson objectives to find the main concept.",
        },
      },
      {
        id: `q2`,
        prompt: `Which skill does this lesson develop?`,
        options: [
          "Critical thinking",
          "Memorization",
          "Speed reading",
          "Guessing",
        ],
        correctIndex: 0,
        feedback: {
          correct:
            "Yes! This lesson builds critical thinking through practice.",
          incorrect:
            "The lesson is designed to build understanding, not just memorize.",
        },
      },
    ],
  });

  // Experiment or Project (alternating)
  if (lessonIndex % 2 === 0) {
    blocks.push({
      kind: "experiment",
      title: `${lessonTitle} — Hands-on Lab`,
      materials: ["Computer", "Browser", "Notebook"],
      steps: [
        "Open the interactive widget above",
        "Complete the activity",
        "Record your observations",
        "Compare with expected results",
      ],
      safety: "No physical hazards — digital activity only",
    });
  } else {
    blocks.push({
      kind: "project",
      brief: `Create a mini-project demonstrating ${lessonTitle.toLowerCase()}`,
      steps: [
        "Plan your approach",
        "Build the solution",
        "Test with sample inputs",
        "Document what you learned",
      ],
      deliverable: "Working demo + 1-paragraph reflection",
    });
  }

  return blocks;
}

function createLesson(
  moduleId: string,
  lessonIndex: number,
  lessonTitle: string,
): void {
  const module = getModule(moduleId);
  if (!module) return;

  const ageBand = module.ageBand;
  const lessonId = `${moduleId}-l${lessonIndex + 1}`;

  const lesson: Lesson = {
    id: lessonId,
    moduleId,
    band: ageBand,
    title: lessonTitle,
    durationMin: 30,
    blocks: makeBlocks(moduleId, lessonIndex, lessonTitle),
  };

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
    "l3-m3": ["RL", "Generative AI", "Data Governance"],
    "l4-m1": ["Bias & Fairness", "Privacy", "Work & Economy"],
    "l5-m1": ["Frontier Models", "AI Agents", "Research Methods"],
    "l6-m1": ["Intelligent Agents", "Deploy Models", "Research Methods"],
    "jr-a-1": [
      "Machines That Listen",
      "Machines That See",
      "Smart Rules",
      "Sort and Match",
      "Helpful Machines",
      "Data All Around",
      "Talking to Assistants",
      "Learning with Examples",
      "Fair and Unfair",
      "Class Agreement",
    ],
    "jr-a-2": [
      "How Machines See and Hear",
      "Teaching with Examples",
      "Patterns in Data",
      "Why Recommendations Appear",
      "Chatbots and Questions",
      "Robots and Sensors",
      "Bias In Bias Out",
      "Build a Rule-Based Game",
    ],
    "jr-b-1": [
      "How Machines See and Hear",
      "Teaching with Examples",
      "Patterns in Data",
      "Why Recommendations Appear",
      "Chatbots and Questions",
      "Robots and Sensors",
      "Bias In Bias Out",
      "Build a Rule-Based Game",
    ],
  };

  return titles[moduleId] || ["Lesson"];
}

function populateAllLessons(): void {
  const modules = getAllModules();
  for (const module of modules) {
    const lessonTitles = getModuleLessonTitles(module.id);
    lessonTitles.forEach((title, index) => {
      createLesson(module.id, index, title);
    });
  }
}

populateAllLessons();
