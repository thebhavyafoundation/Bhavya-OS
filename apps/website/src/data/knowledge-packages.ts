export type KnowledgePackageStatus = "Gold Standard" | "Draft" | "Review";

export interface KnowledgePackageArtifact {
  readonly type: string;
  readonly file: string;
  readonly description: string;
}

export interface KnowledgePackage {
  id: string;
  title: string;
  level: number;
  version: string;
  date: string;
  status: KnowledgePackageStatus;
  description: string;
  artifacts: readonly KnowledgePackageArtifact[];
  learningOutcomes: readonly string[];
}

export const knowledgePackages: readonly KnowledgePackage[] = [
  {
    id: "KP-001",
    title: "How Large Language Models Work",
    level: 1,
    version: "v1.0.0",
    date: "August 5, 2026",
    status: "Gold Standard",
    description:
      "The first Knowledge Package from Bhavya Foundation's AI Institute. A complete educational module covering how Large Language Models (LLMs) work, designed for Grade 9+ learners.",
    artifacts: [
      {
        type: "Lesson",
        file: "KP-001-Lesson.md",
        description: "6 sections, 5 learning outcomes, vocabulary",
      },
      {
        type: "Assessment",
        file: "KP-001-Assessment.md",
        description: "15 questions (8 MCQ, 4 short-answer, 3 reflection)",
      },
      {
        type: "Teacher Guide",
        file: "KP-001-Teacher-Guide.md",
        description: "Objectives, materials, discussion prompts",
      },
      {
        type: "Workbook",
        file: "KP-001-Workbook.md",
        description: "8 pages with exercises and reflection",
      },
      {
        type: "Visual Spec",
        file: "KP-001-Visual-Spec.md",
        description: "8 scenes, subject-aware palette",
      },
      {
        type: "Website",
        file: "KP-001-Website/",
        description: "4 pages with HTML/CSS",
      },
    ],
    learningOutcomes: [
      "Define what an LLM is and how it differs from traditional software",
      "Explain how text is converted into numerical representations (tokens and embeddings)",
      "Describe how LLMs learn patterns from training data",
      "Identify the role of transformers and attention in language understanding",
      "Evaluate the capabilities and limitations of LLMs",
    ],
  },
] as const;
