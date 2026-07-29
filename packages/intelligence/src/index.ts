// ── @bhavya/intelligence ──────────────────────────────────
// Cross-mission intelligence layer for the Bhavya Foundation platform.
// Provides search, exploration, analytics, recommendations, and decision support.
//
// INVARIANT: This package never mutates institutional data.
// It only queries, aggregates, ranks, traverses, recommends, analyzes, and advises.

export {
  search,
  searchDocuments,
  searchEntities,
  searchAll,
} from "./search";

export type {
  SearchOptions,
} from "./search";

export {
  getGraphNodes,
  getGraphEdges,
  getGraphNodeById,
  getNodeNeighbors,
  findPath,
  getGraphStatistics,
  getConnectedComponents,
} from "./graph-explorer";

export {
  getOperationalMetrics,
  getKnowledgeMetrics,
  getPlatformAnalytics,
  getDomainCoverage,
} from "./analytics";

export {
  getRecommendations,
  getRelatedDocuments,
  getRelatedEntities,
} from "./recommendations";

export {
  generateDecisionSupport,
} from "./decision-support-generator";

export {
  recordSnapshot,
  getHistory,
  getLatestSnapshot,
  calculateTrends,
} from "./historical-metrics";

// ── Insight Types ─────────────────────────────────────────
// Common result type for all intelligence capabilities.

export type {
  Insight,
  Evidence,
  InsightCategory,
  SearchInsight,
  SearchData,
  SearchResult,
  SearchFacets,
  GraphInsight,
  GraphData,
  GraphNode,
  GraphEdge,
  GraphPath,
  AnalyticsInsight,
  AnalyticsData,
  Metric,
  RecommendationInsight,
  RecommendationData,
  Recommendation,
} from "./insight";

export {
  createInsight,
  createEvidence,
  calculateConfidence,
} from "./insight";

// ── Decision Support Types ────────────────────────────────
// Types for actionable insights and work queues.

export type {
  DecisionSupport,
  DataQualityAlert,
  MissionHealthScore,
  KnowledgeGap,
  WorkItem,
} from "./decision-support";

export type {
  MetricSnapshot,
  MetricTrend,
} from "./historical-metrics";
