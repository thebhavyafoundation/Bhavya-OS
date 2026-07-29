// ── @bhavya/intelligence ──────────────────────────────────
// Cross-mission intelligence layer for the Bhavya Foundation platform.
// Provides search, exploration, analytics, and recommendations.

export {
  search,
  searchDocuments,
  searchEntities,
  searchAll,
} from "./search";

export type {
  SearchResult,
  SearchOptions,
  SearchResponse,
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

export type {
  GraphNode,
  GraphEdge,
  GraphPath,
  GraphStats,
  Neighborhood,
} from "./graph-explorer";

export {
  getPlatformOverview,
  getDomainCoverage,
  getMissionActivity,
  getEntityTypeDistribution,
  getDocumentStatusDistribution,
  getKnowledgeGraphStats,
} from "./analytics";

export type {
  MissionSummary,
  ActivityTimeline,
  DomainCoverage,
  PlatformOverview,
} from "./analytics";

export {
  getRecommendations,
  getRelatedDocuments,
  getRelatedEntities,
} from "./recommendations";

export type {
  Recommendation,
  RecommendationsResponse,
} from "./recommendations";
