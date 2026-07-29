// ── Insight Types ─────────────────────────────────────────
// Common result type for all intelligence capabilities.
// Every query, aggregation, and recommendation returns Insight<T>.

// ── Core Insight Type ─────────────────────────────────────

export interface Insight<T = unknown> {
  /** Unique identifier for this insight */
  id: string;

  /** Human-readable title */
  title: string;

  /** Brief description of what this insight represents */
  description: string;

  /** Confidence score (0-1) based on data quality and completeness */
  confidence: number;

  /** Evidence supporting this insight (source documents, entities, etc.) */
  evidence: Evidence[];

  /** When this insight was generated */
  generatedAt: string;

  /** The actual data payload */
  data: T;
}

export interface Evidence {
  /** Source document or entity ID */
  sourceId: string;

  /** Type of source */
  sourceType: "document" | "entity" | "mission" | "relationship";

  /** How this evidence supports the insight */
  relevance: string;

  /** Weight of this evidence (0-1) */
  weight: number;
}

// ── Insight Categories ────────────────────────────────────

export type InsightCategory =
  | "search"
  | "graph"
  | "analytics"
  | "recommendation"
  | "operational"
  | "knowledge";

// ── Search Results ────────────────────────────────────────

export interface SearchInsight extends Insight<SearchData> {
  category: "search";
}

export interface SearchData {
  query: string;
  results: SearchResult[];
  facets: SearchFacets;
}

export interface SearchResult {
  id: string;
  type: "document" | "entity" | "mission";
  title: string;
  summary: string;
  score: number;
  highlights: string[];
}

export interface SearchFacets {
  types: Record<string, number>;
  categories: Record<string, number>;
}

// ── Graph Insights ────────────────────────────────────────

export interface GraphInsight extends Insight<GraphData> {
  category: "graph";
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  center?: string;
  path?: GraphPath;
}

export interface GraphNode {
  id: string;
  type: string;
  title: string;
  level: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: string;
  weight: number;
}

export interface GraphPath {
  nodes: string[];
  edges: string[];
  length: number;
}

// ── Analytics Insights ────────────────────────────────────

export interface AnalyticsInsight extends Insight<AnalyticsData> {
  category: "analytics";
}

export interface AnalyticsData {
  type: "operational" | "knowledge";
  metrics: Metric[];
  summary: string;
}

export interface Metric {
  name: string;
  value: number;
  unit?: string;
  trend?: "up" | "down" | "stable";
  change?: number;
}

// ── Recommendation Insights ───────────────────────────────

export interface RecommendationInsight extends Insight<RecommendationData> {
  category: "recommendation";
}

export interface RecommendationData {
  targetId: string;
  targetType: string;
  recommendations: Recommendation[];
}

export interface Recommendation {
  id: string;
  type: "document" | "entity" | "mission";
  title: string;
  reason: string;
  score: number;
}

// ── Insight Builder ───────────────────────────────────────

export function createInsight<T>(params: {
  id: string;
  title: string;
  description: string;
  confidence: number;
  evidence: Evidence[];
  data: T;
}): Insight<T> {
  return {
    ...params,
    generatedAt: new Date().toISOString(),
  };
}

export function createEvidence(params: {
  sourceId: string;
  sourceType: Evidence["sourceType"];
  relevance: string;
  weight?: number;
}): Evidence {
  return {
    ...params,
    weight: params.weight ?? 1,
  };
}

// ── Confidence Helpers ────────────────────────────────────

export function calculateConfidence(factors: {
  dataCompleteness: number;
  sourceCount: number;
  recency: number;
}): number {
  const { dataCompleteness, sourceCount, recency } = factors;

  // More sources = higher confidence (diminishing returns)
  const sourceConfidence = Math.min(1, sourceCount / 10);

  // Recent data = higher confidence
  const recencyConfidence = recency;

  // Weighted average
  const confidence =
    dataCompleteness * 0.3 +
    sourceConfidence * 0.4 +
    recencyConfidence * 0.3;

  return Math.round(confidence * 100) / 100;
}
