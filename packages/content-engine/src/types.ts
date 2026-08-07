export interface KnowledgePackage {
  id: string;
  version: string;
  status: "draft" | "review" | "approved" | "published" | "archived";
  metadata: PackageMetadata;
  content: PackageContent;
  assessment: PackageAssessment;
  resources: PackageResources;
  quality: QualityMetrics;
  history: VersionHistory[];
}

export interface PackageMetadata {
  title: string;
  subtitle: string;
  description: string;
  school: string;
  program: string;
  course: string;
  module: string;
  lesson: string;
  order: number;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  tags: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  competencies: string[];
  careerRelevance: string[];
  authors: string[];
  reviewers: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  contentHash: string;
}

export interface PackageContent {
  sections: ContentSection[];
  visualExplanations: VisualExplanation[];
  interactiveDiagrams: InteractiveDiagram[];
  codeExamples: CodeExample[];
  executableNotebooks: Notebook[];
  glossary: GlossaryEntry[];
  revisionNotes: RevisionNote[];
}

export interface ContentSection {
  id: string;
  type: "concept" | "theory" | "application" | "example" | "exercise";
  title: string;
  content: string;
  order: number;
  estimatedReadTime: string;
  keyTakeaways: string[];
  concepts: string[];
}

export interface VisualExplanation {
  id: string;
  type: "diagram" | "chart" | "animation" | "infographic";
  title: string;
  description: string;
  data: Record<string, unknown>;
  format: "svg" | "canvas" | "react" | "latex";
}

export interface InteractiveDiagram {
  id: string;
  type: "explorer" | "simulator" | "visualizer" | "playground";
  title: string;
  description: string;
  component: string;
  props: Record<string, unknown>;
}

export interface CodeExample {
  id: string;
  language: string;
  title: string;
  description: string;
  code: string;
  explanation: string;
  runnable: boolean;
  expectedOutput?: string;
  concepts: string[];
}

export interface Notebook {
  id: string;
  title: string;
  description: string;
  cells: NotebookCell[];
  kernel: string;
  requirements: string[];
}

export interface NotebookCell {
  id: string;
  type: "markdown" | "code" | "output";
  content: string;
  executionCount?: number;
  outputs?: Array<Record<string, unknown>>;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  relatedTerms: string[];
  examples: string[];
}

export interface RevisionNote {
  concept: string;
  keyPoints: string[];
  commonMistakes: string[];
  practiceQuestions: string[];
}

export interface PackageAssessment {
  checkpoints: Checkpoint[];
  quiz: Quiz;
  assignment: Assignment;
  lab: Lab;
  project: Project;
}

export interface Checkpoint {
  id: string;
  sectionId: string;
  questions: Question[];
  passingScore: number;
}

export interface Question {
  id: string;
  type: "mcq" | "code" | "short-answer" | "reflection" | "practical";
  content: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  concepts: string[];
}

export interface Quiz {
  id: string;
  questions: Question[];
  timeLimit: number;
  passingScore: number;
  attempts: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  rubric: Rubric;
  estimatedTime: string;
}

export interface Rubric {
  categories: RubricCategory[];
  passingScore: number;
}

export interface RubricCategory {
  name: string;
  weight: number;
  criteria: RubricCriterion[];
}

export interface RubricCriterion {
  description: string;
  levels: {
    excellent: string;
    good: string;
    satisfactory: string;
    needsImprovement: string;
  };
}

export interface Lab {
  id: string;
  title: string;
  objective: string;
  problemStatement: string;
  dataset?: Dataset;
  requirements: LabRequirement[];
  hints: Hint[];
  solution: Solution;
  tests: Test[];
  estimatedTime: string;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  source: string;
  format: string;
  size: string;
  columns: Column[];
}

export interface Column {
  name: string;
  type: "numerical" | "categorical" | "text" | "date";
  description: string;
}

export interface LabRequirement {
  id: string;
  description: string;
  type: "functional" | "performance" | "correctness";
  criteria: string;
}

export interface Hint {
  id: string;
  level: 1 | 2 | 3;
  content: string;
  revealAfter: number;
}

export interface Solution {
  code: string;
  explanation: string;
  alternatives: string[];
}

export interface Test {
  id: string;
  description: string;
  input: string | number | boolean | Record<string, unknown>;
  expectedOutput: string | number | boolean | Record<string, unknown>;
  type: "unit" | "integration" | "e2e";
}

export interface Project {
  id: string;
  title: string;
  brief: string;
  milestones: Milestone[];
  rubric: Rubric;
  estimatedTime: string;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  week: number;
  deliverables: string[];
  criteria: string[];
}

export interface PackageResources {
  reading: Reading[];
  researchPapers: ResearchPaper[];
  githubReferences: GitHubReference[];
  benchmarks: Benchmark[];
  datasets: DatasetReference[];
  interviewQuestions: InterviewQuestion[];
}

export interface Reading {
  id: string;
  title: string;
  author: string;
  type: "book" | "article" | "tutorial" | "documentation";
  url: string;
  relevance: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  url: string;
  abstract: string;
  relevance: string;
}

export interface GitHubReference {
  id: string;
  name: string;
  url: string;
  stars: number;
  description: string;
  relevance: string;
}

export interface Benchmark {
  id: string;
  name: string;
  description: string;
  url: string;
  currentSOTA: string;
  relevance: string;
}

export interface DatasetReference {
  id: string;
  name: string;
  url: string;
  size: string;
  format: string;
  relevance: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  concepts: string[];
}

export interface QualityMetrics {
  contentAccuracy: number;
  educationalEffectiveness: number;
  technicalCorrectness: number;
  accessibility: number;
  overallScore: number;
}

export interface VersionHistory {
  version: string;
  date: Date;
  author: string;
  changes: string[];
  contentHash: string;
}
