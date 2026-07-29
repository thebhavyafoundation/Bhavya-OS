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

// ── Forest ─────────────────────────────────────────────────
export {
  getMissions,
  getMission,
  getMissionsByStatus,
  createMission,
  updateMission,
  getSites,
  getSite,
  getSitesByMission,
  createSite,
  getSurveys,
  getSurvey,
  getSurveysBySite,
  getSurveysByMission,
  createSurvey,
  getPlantings,
  getPlanting,
  getPlantingsBySite,
  getPlantingsByMission,
  createPlanting,
  updatePlanting,
  getMonitoring,
  getMonitoringEntry,
  getMonitoringByPlanting,
  getMonitoringByMission,
  createMonitoring,
  getImpactReports,
  getImpact,
  getImpactByMission,
  createImpact,
  getForestStats,
} from "./forest";

// ── Publication Contract ───────────────────────────────────
export {
  publishKnowledge,
  publishFieldReport,
  publishImpactReport,
  publishSurveyResult,
  publishMonitoringLog,
} from "./publish";
export type {
  PublicationRequest,
  PublicationResult,
  DocumentType,
  Visibility,
} from "./publish";

// ── Heritage ───────────────────────────────────────────────
export {
  getHeritageMissions,
  getHeritageMission,
  createHeritageMission,
  getHeritageSites,
  getHeritageSite,
  getHeritageSitesByMission,
  createHeritageSite,
  getHeritageAssets,
  getHeritageAsset,
  getHeritageAssetsBySite,
  getHeritageAssetsByMission,
  createHeritageAsset,
  getAssessments,
  getAssessment,
  getAssessmentsByAsset,
  createAssessment,
  getDocumentations,
  getDocumentation,
  getDocumentationsByAsset,
  createDocumentation,
  getConservationPlans,
  getConservationPlan,
  getConservationPlansByAsset,
  createConservationPlan,
  getHeritageImpactReports,
  getHeritageImpact,
  createHeritageImpact,
  getHeritageStats,
} from "./heritage";
export type {
  AssetType,
  AssetCondition,
  HeritageAsset,
  AssessmentType,
  ConditionAssessment,
  DocumentationType,
  Documentation,
  ConservationStatus,
  ConservationPlan,
  HeritageImpact,
  HeritageMissionStatus,
  HeritageMission,
  HeritageSite,
  HeritageStats,
} from "./heritage";

// ── Volunteer ─────────────────────────────────────────────
export {
  getVolunteers,
  getVolunteer,
  createVolunteer,
  getSkills,
  getSkill,
  createSkill,
  getTrainings,
  getTraining,
  getTrainingsByVolunteer,
  createTraining,
  getAssignments,
  getAssignment,
  getAssignmentsByVolunteer,
  createAssignment,
  getParticipations,
  getParticipation,
  getParticipationsByVolunteer,
  createParticipation,
  getRecognitions,
  getRecognition,
  getRecognitionsByVolunteer,
  createRecognition,
  getVolunteerStats,
} from "./volunteer";
export type {
  VolunteerStatus,
  Volunteer,
  Skill,
  TrainingStatus,
  Training,
  MissionType,
  AssignmentStatus,
  MissionAssignment,
  TaskStatus,
  Participation,
  RecognitionType,
  Recognition,
  VolunteerStats,
} from "./volunteer";

// ── Governance ─────────────────────────────────────────────
export {
  getBoardMeetings,
  getBoardMeetingById,
  getBoardMeetingsByStatus,
  getUpcomingMeetings,
  createBoardMeeting,
  updateBoardMeeting,
  getResolutions,
  getResolutionById,
  getResolutionsByStatus,
  getResolutionsByMeeting,
  getOverdueResolutions,
  getResolutionsDueForImplementation,
  createResolution,
  updateResolution,
  advanceResolution,
  getPolicies,
  getPolicyById,
  getPoliciesByStatus,
  getPoliciesDueForReview,
  createPolicy,
  updatePolicy,
  createPolicyVersion,
  getPolicyLineage,
  getGovernanceStats,
  getOperationalHealth,
} from "./governance";
export type {
  BoardMeetingStatus,
  BoardMeeting,
  AgendaItem,
  ResolutionStatus,
  Resolution,
  ResolutionEvent,
  PolicyStatus,
  Policy,
  PolicyVersion,
  GovernanceStats,
} from "./models";

// ── Action Items ──────────────────────────────────────────
export {
  getActionItems,
  getActionItemById,
  getActionItemsByStatus,
  getActionItemsBySource,
  getActionItemsByAssignee,
  getOverdueActionItems,
  getActionItemsDueSoon,
  createActionItem,
  updateActionItem,
  advanceActionItem,
  getActionItemStats,
  createActionItemsFromResolution,
} from "./action-items";
export type {
  ActionItemStatus,
  ActionItemSource,
  ActionItem,
  ActionItemEvent,
  ActionItemStats,
  TraceabilityChain,
  Evidence,
} from "./models";

// ── Traceability ──────────────────────────────────────────
export {
  buildTraceabilityChain,
  traceFromResolution,
  traceFromActionItem,
  traceFromMission,
  getEvidence,
  getEvidenceByActionItem,
  addEvidence,
  verifyEvidence,
  getFullTraceability,
} from "./traceability";

// ── Governance Metrics ─────────────────────────────────────
export {
  captureSnapshot,
  getTrendMetrics,
  getSnapshotHistory,
  getLatestSnapshot,
} from "./governance-metrics";
export type {
  SnapshotMetrics,
  TrendMetric,
  TrendMetrics,
} from "./governance-metrics";

// ── Impact Reporting ──────────────────────────────────────
export {
  generateImpactReport,
  getImpactReports,
  generateExecutiveSummary,
  generateForestImpactReport,
  generateGovernanceEffectivenessReport,
} from "./impact-reporting";
export type {
  ImpactReport,
  ImpactSummary,
  GovernanceImpact,
  OperationalImpact,
  KnowledgeImpact,
} from "./impact-reporting";

// ── Cross-Domain Reporting ────────────────────────────────
export {
  generateInstitutionalReport,
  getInstitutionalReports,
  generateAnnualReport,
  generateQuarterlyReport,
} from "./cross-domain-reporting";
export type {
  InstitutionalReport,
  ReportSection,
  ReportMetric,
} from "./cross-domain-reporting";
