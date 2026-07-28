// ── Models ─────────────────────────────────────────────────
export * from "./models";

// ── I/O Utilities ──────────────────────────────────────────
export {
  readJSON,
  readMD,
  listDir,
  writeJSON,
  ensureDir,
  resolvePath,
} from "./io";

// ── Document Repository ────────────────────────────────────
export {
  getDocuments,
  getDocument,
  getDocumentsByCategory,
  getRecentDocuments,
  getKnowledgeGraph,
  getGraphNode,
  getLinkedNodes,
  parseMarkdownMetadata,
  parseJsonMetadata,
} from "./documents";

// ── Collection Repository ──────────────────────────────────
export { getCollections, getCollection } from "./collections";

// ── Entity Repository ──────────────────────────────────────
export {
  getEntities,
  getEntity,
  getEntitiesByType,
  searchEntities,
} from "./entities";

// ── Graph & Relationships ──────────────────────────────────
export {
  getRelationships,
  getRelationshipsBySource,
  getRelationshipsByTarget,
  getRelationshipsByType,
  getGraphNodeNeighbors,
  getGraphStats,
} from "./graph";

// ── Search ─────────────────────────────────────────────────
export {
  getSearchIndex,
  searchAll,
  searchDocuments,
  getContentStats,
} from "./search";
export type { SearchDocument } from "./search";

// ── Research ───────────────────────────────────────────────
export {
  getProjects,
  getProject,
  getProjectsByStatus,
  getProjectsByMission,
  createProject,
  updateProject,
  advanceProject,
  getSources,
  getSourcesByProject,
  addSource,
  getEvidence,
  getEvidenceByProject,
  addEvidence,
  getReviews,
  getReviewsByProject,
  addReview,
  getResearchStats,
} from "./research";
