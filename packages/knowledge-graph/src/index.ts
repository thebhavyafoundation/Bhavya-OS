/**
 * @bhavya/knowledge-graph
 *
 * Canonical knowledge graph schema, entities, relations,
 * graph operations, and validation.
 *
 * @version 1.0.0
 * @license MIT
 */

export {
  // ─── Entity Types ────────────────────────────────────────────
  type KnowledgeEntity,
  type ConceptEntity,
  type CodeExample,
  type CourseEntity,
  type CourseModule,
  type EnrollmentStats,
  type ProjectEntity,
  type ProjectStatus,
  type ProjectMilestone,
  type PublicationEntity,
  type ResearchEntity,
  type ResearchStatus,
  type PersonEntity,
  type InstitutionEntity,
  type InstitutionType,
  type ToolEntity,
  type ToolCategory,
  type TechnologyEntity,
  type TechnologyMaturity,
  type AdoptionLevel,
  type RadarPosition,
  type ForestEntity,
  type SpeciesEntity,
  type ConservationStatus,
  type GrantEntity,
  type GrantStatus,
  type PolicyEntity,
  type ComplianceLevel,
  type MediaEntity,
  type MediaFormat,
  type OrganizationEntity,
  type OrganizationType,
  type LocationEntity,
  type AssetEntity,
  type AssetCategory,
  type AssetCondition,
  type GeoCoordinates,

  // ─── Graph Store ─────────────────────────────────────────────
  type KnowledgeGraph,
  createKnowledgeGraph,

  // ─── Mutations ───────────────────────────────────────────────
  addEntity,
  addRelation,
  removeEntity,
  removeRelation,
  updateEntity,

  // ─── Queries ─────────────────────────────────────────────────
  getEntity,
  getEntitiesByType,
  getRelations,
  getIncomingRelations,
  getRelatedEntities,
  searchEntities,

  // ─── Traversal ───────────────────────────────────────────────
  findPath,
  getDescendants,
  getAncestors,
  getPrerequisites,
  getDependents,

  // ─── Statistics ──────────────────────────────────────────────
  type GraphStats,
  getKnowledgeGraphStats,

  // ─── Validation ──────────────────────────────────────────────
  type ValidationResult,
  validateGraph,

  // ─── Factory Helpers ─────────────────────────────────────────
  createEntity,
  createRelation,

  // ─── Import / Export ─────────────────────────────────────────
  type KnowledgeGraphExport,
  exportGraph,
  importGraph,

  // ─── Constants ───────────────────────────────────────────────
  ENTITY_TYPES,
  RELATION_TYPES,
} from "./schema";
