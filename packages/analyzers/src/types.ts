import type { KnowledgePackage, Analysis } from "@bhavya/intelligence";

export interface ComparativeAnalysis {
  id: string;
  title: string;
  items: Array<{ name: string; url: string; scores: Record<string, number> }>;
  criteria: ComparisonCriteria;
  verdict: string;
  recommendation: string;
  generatedAt: string;
}

export interface ComparisonCriteria {
  architecture: string;
  complexity: string;
  performance: string;
  community: string;
  documentation: string;
  maintenance: string;
  learningCurve: string;
  bhavyaSuitability: string;
}

export interface TrendAnalysis {
  technology: string;
  direction: "rising" | "stable" | "declining";
  velocity: number;
  factors: string[];
  prediction: string;
  confidence: number;
}

export interface EcosystemHealth {
  category: string;
  totalProjects: number;
  activeProjects: number;
  averageScore: number;
  topProjects: Array<{ name: string; score: number }>;
  concerns: string[];
  opportunities: string[];
}
