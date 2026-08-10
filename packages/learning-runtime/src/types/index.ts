// AI Learning Runtime — Core Types

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface CompletionRequest {
  messages: Message[];
  maxTokens?: number;
  temperature?: number;
}

export interface CompletionResponse {
  content: string;
  usage: { promptTokens: number; completionTokens: number };
  model: string;
}

export interface AIProvider {
  name: string;
  complete(request: CompletionRequest): Promise<CompletionResponse>;
}

export interface Experiment {
  id: string;
  lessonId: string;
  prompt: string;
  context?: string;
  output: string;
  timestamp: number;
  version: number;
  reflection?: Reflection;
  aiFeedback?: string;
  studentRating?: number;
}

export interface Reflection {
  whatChanged: string;
  whyChanged: string;
  surprised: string;
  improveNext: string;
  timestamp: number;
}

export interface MentorResponse {
  type: "question" | "challenge" | "encouragement" | "suggestion";
  content: string;
}

export interface ExperimentMetrics {
  totalAttempts: number;
  bestScore: number;
  currentScore: number;
  improvementRate: number;
  trend: "improving" | "stable" | "declining";
}

export interface PortfolioArtifact {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  skills: string[];
  knowledgePackages: string[];
  repositories: string[];
  technologies: string[];
  experiments: Experiment[];
  reflections: Reflection[];
  bestAttempt: Experiment;
  improvementRate: number;
  totalAttempts: number;
  reflectionDepth: number;
  createdAt: number;
  exportedAt?: number;
}

export interface CapabilityScore {
  experimentsCompleted: number;
  totalIterations: number;
  averageIterations: number;
  reflectionDepth: number;
  promptImprovement: number;
  portfolioArtifacts: number;
  overallScore: number;
  trend: "improving" | "stable" | "declining";
}

export interface TimeDistribution {
  experimenting: number;
  reflecting: number;
  building: number;
  reading: number;
  totalActive: number;
  totalPassive: number;
  creationRatio: number;
}

export interface RuntimeState {
  lessonId: string | null;
  experiments: Experiment[];
  currentExperiment: Experiment | null;
  artifacts: PortfolioArtifact[];
  analytics: CapabilityScore;
  timeDistribution: TimeDistribution;
}

export interface LessonConfig {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  systemMessage?: string;
  knowledgePackages?: { id: string; title: string; relevance: string }[];
  repositories?: { name: string; url: string; relevance: string }[];
}
