/**
 * @bhavya/knowledge-graph — Canonical Knowledge Graph Schema
 *
 * SINGLE SOURCE OF TRUTH for all knowledge graph entities, relations,
 * and graph operations. Every package that touches the knowledge graph
 * imports from here.
 *
 * Entity types: 17 (Concept, Course, Project, Publication, Research,
 * Person, Institution, Tool, Technology, Forest, Species, Grant,
 * Policy, Media, Organization, Location, Asset)
 *
 * Relation types: 14 (prerequisite, related_to, depends_on, part_of,
 * teaches, uses, created_by, funded_by, located_in, cites, extends,
 * contradicts, supports, supersedes)
 *
 * @version 1.0.0
 * @license MIT
 */

import type {
  BaseEntity,
  EntityType,
  EntityRelation,
  RelationType,
  EntityStatus,
  Difficulty,
} from "@bhavya/shared";

// ═══════════════════════════════════════════════════════════════════
// ENTITY TYPES — 17 typed entities extending BaseEntity
// ═══════════════════════════════════════════════════════════════════

// ─── Concept ─────────────────────────────────────────────────────

export interface ConceptEntity extends BaseEntity {
  type: "concept";
  prerequisites: string[];
  difficulty: Difficulty;
  estimatedMinutes: number;
  labs: string[];
  codeExamples: CodeExample[];
}

export interface CodeExample {
  title: string;
  description: string;
  language: string;
  code: string;
}

// ─── Course ──────────────────────────────────────────────────────

export interface CourseEntity extends BaseEntity {
  type: "course";
  modules: CourseModule[];
  duration: number;
  level: Difficulty;
  enrollment: EnrollmentStats;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  conceptIds: string[];
  order: number;
}

export interface EnrollmentStats {
  total: number;
  active: number;
  completed: number;
}

// ─── Project ─────────────────────────────────────────────────────

export interface ProjectEntity extends BaseEntity {
  type: "project";
  milestones: ProjectMilestone[];
  technologies: string[];
  difficulty: Difficulty;
  status: ProjectStatus;
}

export type ProjectStatus =
  "planning" | "active" | "paused" | "completed" | "abandoned";

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  dueDate?: Date;
  completed: boolean;
}

// ─── Publication ─────────────────────────────────────────────────

export interface PublicationEntity extends BaseEntity {
  type: "publication";
  authors: string[];
  citations: number;
  journal?: string;
  doi?: string;
  publishedAt?: Date;
  accessUrl?: string;
}

// ─── Research ────────────────────────────────────────────────────

export interface ResearchEntity extends BaseEntity {
  type: "research";
  hypothesis: string;
  methodology: string;
  findings: string[];
  funding: string[];
  status: ResearchStatus;
  principalInvestigator?: string;
}

export type ResearchStatus =
  "proposed" | "in-progress" | "completed" | "published" | "archived";

// ─── Person ──────────────────────────────────────────────────────

export interface PersonEntity extends BaseEntity {
  type: "person";
  role: string;
  expertise: string[];
  affiliations: string[];
  publications: string[];
  avatarUrl?: string;
}

// ─── Institution ─────────────────────────────────────────────────

export interface InstitutionEntity extends BaseEntity {
  type: "institution";
  institutionType: InstitutionType;
  location: string;
  programs: string[];
  faculty: number;
  website?: string;
}

export type InstitutionType =
  | "university"
  | "college"
  | "research-lab"
  | "school"
  | "training-center"
  | "government"
  | "ngo";

// ─── Tool ────────────────────────────────────────────────────────

export interface ToolEntity extends BaseEntity {
  type: "tool";
  version: string;
  license: string;
  category: ToolCategory;
  ecosystem: string[];
  repositoryUrl?: string;
  documentationUrl?: string;
}

export type ToolCategory =
  | "framework"
  | "library"
  | "cli"
  | "ide"
  | "service"
  | "dataset"
  | "model"
  | "mcp-server";

// ─── Technology ──────────────────────────────────────────────────

export interface TechnologyEntity extends BaseEntity {
  type: "technology";
  maturity: TechnologyMaturity;
  adoption: AdoptionLevel;
  alternatives: string[];
  radar: RadarPosition;
}

export type TechnologyMaturity =
  "emerging" | "growing" | "mature" | "declining";

export type AdoptionLevel =
  "experimental" | "early-adopter" | "mainstream" | "ubiquitous";

export interface RadarPosition {
  quadrant: "adopt" | "trial" | "assess" | "hold";
  ring: "leading" | "emerging" | "experimental" | "deprecated";
}

// ─── Forest ──────────────────────────────────────────────────────

export interface ForestEntity extends BaseEntity {
  type: "forest";
  location: string;
  area: number;
  species: string[];
  carbonSequestered: number;
  establishedAt?: Date;
  coordinates?: GeoCoordinates;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

// ─── Species ─────────────────────────────────────────────────────

export interface SpeciesEntity extends BaseEntity {
  type: "species";
  scientificName: string;
  conservationStatus: ConservationStatus;
  habitat: string[];
  population?: number;
  threats: string[];
}

export type ConservationStatus =
  | "least-concern"
  | "near-threatened"
  | "vulnerable"
  | "endangered"
  | "critically-endangered"
  | "extinct-in-wild"
  | "extinct";

// ─── Grant ───────────────────────────────────────────────────────

export interface GrantEntity extends BaseEntity {
  type: "grant";
  funder: string;
  amount: number;
  currency: string;
  duration: number;
  status: GrantStatus;
  startDate?: Date;
  endDate?: Date;
  applicationUrl?: string;
}

export type GrantStatus =
  "open" | "under-review" | "awarded" | "active" | "completed" | "rejected";

// ─── Policy ──────────────────────────────────────────────────────

export interface PolicyEntity extends BaseEntity {
  type: "policy";
  authority: string;
  scope: string;
  effectiveDate: Date;
  compliance: ComplianceLevel;
  reviewCycle?: number;
  supersededBy?: string;
}

export type ComplianceLevel = "mandatory" | "recommended" | "advisory";

// ─── Media ───────────────────────────────────────────────────────

export interface MediaEntity extends BaseEntity {
  type: "media";
  format: MediaFormat;
  duration?: number;
  source: string;
  caption?: string;
  thumbnailUrl?: string;
  fileUrl?: string;
}

export type MediaFormat =
  "video" | "audio" | "image" | "document" | "interactive" | "animation";

// ─── Organization ────────────────────────────────────────────────

export interface OrganizationEntity extends BaseEntity {
  type: "organization";
  organizationType: OrganizationType;
  mission: string;
  members: string[];
  website?: string;
  foundedAt?: Date;
}

export type OrganizationType =
  | "ngo"
  | "corporation"
  | "government"
  | "academic"
  | "community"
  | "foundation";

// ─── Location ────────────────────────────────────────────────────

export interface LocationEntity extends BaseEntity {
  type: "location";
  coordinates: GeoCoordinates;
  region: string;
  timezone: string;
  country?: string;
  state?: string;
  city?: string;
}

// ─── Asset ───────────────────────────────────────────────────────

export interface AssetEntity extends BaseEntity {
  type: "asset";
  assetType: AssetCategory;
  value: number;
  currency: string;
  condition: AssetCondition;
  maintenanceSchedule?: string;
  lastInspectedAt?: Date;
}

export type AssetCategory =
  | "equipment"
  | "vehicle"
  | "building"
  | "land"
  | "digital"
  | "intellectual-property";

export type AssetCondition =
  "excellent" | "good" | "fair" | "poor" | "critical";

// ═══════════════════════════════════════════════════════════════════
// UNION TYPE — Any entity in the graph
// ═══════════════════════════════════════════════════════════════════

export type KnowledgeEntity =
  | ConceptEntity
  | CourseEntity
  | ProjectEntity
  | PublicationEntity
  | ResearchEntity
  | PersonEntity
  | InstitutionEntity
  | ToolEntity
  | TechnologyEntity
  | ForestEntity
  | SpeciesEntity
  | GrantEntity
  | PolicyEntity
  | MediaEntity
  | OrganizationEntity
  | LocationEntity
  | AssetEntity;

// ═══════════════════════════════════════════════════════════════════
// GRAPH STORE — In-memory knowledge graph
// ═══════════════════════════════════════════════════════════════════

export interface KnowledgeGraph {
  entities: Map<string, KnowledgeEntity>;
  relations: Map<string, EntityRelation>;
}

export function createKnowledgeGraph(): KnowledgeGraph {
  return {
    entities: new Map(),
    relations: new Map(),
  };
}

// ═══════════════════════════════════════════════════════════════════
// UTILITY — Access BaseEntity fields on any KnowledgeEntity
// ═══════════════════════════════════════════════════════════════════

function baseOf(entity: KnowledgeEntity): BaseEntity {
  return entity as BaseEntity;
}

// ═══════════════════════════════════════════════════════════════════
// MUTATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

export function addEntity<T extends KnowledgeEntity>(
  graph: KnowledgeGraph,
  entity: T,
): T {
  const base = baseOf(entity);
  const validation = validateEntity(entity);
  if (!validation.valid) {
    throw new Error(
      `Invalid entity "${base.id}": ${validation.errors.join(", ")}`,
    );
  }
  graph.entities.set(base.id, entity);
  return entity;
}

export function addRelation(
  graph: KnowledgeGraph,
  relation: EntityRelation,
): EntityRelation {
  const validation = validateRelation(graph, relation);
  if (!validation.valid) {
    throw new Error(
      `Invalid relation "${relation.id}": ${validation.errors.join(", ")}`,
    );
  }
  graph.relations.set(relation.id, relation);
  return relation;
}

export function removeEntity(graph: KnowledgeGraph, entityId: string): boolean {
  const deleted = graph.entities.delete(entityId);
  if (deleted) {
    const toDelete: string[] = [];
    for (const [relId, rel] of graph.relations) {
      if (rel.sourceId === entityId || rel.targetId === entityId) {
        toDelete.push(relId);
      }
    }
    for (const id of toDelete) {
      graph.relations.delete(id);
    }
  }
  return deleted;
}

export function removeRelation(
  graph: KnowledgeGraph,
  relationId: string,
): boolean {
  return graph.relations.delete(relationId);
}

export function updateEntity<T extends KnowledgeEntity>(
  graph: KnowledgeGraph,
  entityId: string,
  patch: Partial<Omit<T, "id" | "type" | "createdAt">>,
): T | undefined {
  const existing = graph.entities.get(entityId);
  if (!existing) return undefined;

  const updated = {
    ...existing,
    ...patch,
    updatedAt: new Date(),
  } as unknown as T;

  const validation = validateEntity(updated);
  if (!validation.valid) {
    throw new Error(
      `Invalid updated entity "${entityId}": ${validation.errors.join(", ")}`,
    );
  }

  graph.entities.set(entityId, updated);
  return updated;
}

// ═══════════════════════════════════════════════════════════════════
// QUERY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

export function getEntity(
  graph: KnowledgeGraph,
  id: string,
): KnowledgeEntity | undefined {
  return graph.entities.get(id);
}

export function getEntitiesByType<T extends KnowledgeEntity>(
  graph: KnowledgeGraph,
  type: T["type"],
): T[] {
  const result: T[] = [];
  for (const entity of graph.entities.values()) {
    if (entity.type === type) {
      result.push(entity as T);
    }
  }
  return result;
}

export function getRelations(
  graph: KnowledgeGraph,
  sourceId: string,
): EntityRelation[] {
  const result: EntityRelation[] = [];
  for (const rel of graph.relations.values()) {
    if (rel.sourceId === sourceId) {
      result.push(rel);
    }
  }
  return result;
}

export function getIncomingRelations(
  graph: KnowledgeGraph,
  targetId: string,
): EntityRelation[] {
  const result: EntityRelation[] = [];
  for (const rel of graph.relations.values()) {
    if (rel.targetId === targetId) {
      result.push(rel);
    }
  }
  return result;
}

export function getRelatedEntities(
  graph: KnowledgeGraph,
  sourceId: string,
  relationType?: RelationType,
): { entity: KnowledgeEntity; relation: EntityRelation }[] {
  const result: { entity: KnowledgeEntity; relation: EntityRelation }[] = [];
  for (const rel of graph.relations.values()) {
    if (rel.sourceId === sourceId) {
      if (relationType && rel.type !== relationType) continue;
      const entity = graph.entities.get(rel.targetId);
      if (entity) {
        result.push({ entity, relation: rel });
      }
    }
  }
  return result;
}

export function searchEntities(
  graph: KnowledgeGraph,
  query: string,
): KnowledgeEntity[] {
  const lower = query.toLowerCase();
  const result: KnowledgeEntity[] = [];
  for (const entity of graph.entities.values()) {
    const base = baseOf(entity);
    if (
      base.name.toLowerCase().includes(lower) ||
      base.description.toLowerCase().includes(lower) ||
      base.tags.some((t: string) => t.toLowerCase().includes(lower))
    ) {
      result.push(entity);
    }
  }
  return result;
}

// ═══════════════════════════════════════════════════════════════════
// GRAPH TRAVERSAL
// ═══════════════════════════════════════════════════════════════════

/**
 * BFS shortest path between two entities.
 * Returns the path as an array of entity IDs, or null if no path exists.
 */
export function findPath(
  graph: KnowledgeGraph,
  sourceId: string,
  targetId: string,
): string[] | null {
  if (sourceId === targetId) return [sourceId];
  if (!graph.entities.has(sourceId) || !graph.entities.has(targetId)) {
    return null;
  }

  const visited = new Set<string>();
  const queue: { id: string; path: string[] }[] = [
    { id: sourceId, path: [sourceId] },
  ];
  visited.add(sourceId);

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const rel of graph.relations.values()) {
      if (rel.sourceId === current.id && !visited.has(rel.targetId)) {
        const newPath = [...current.path, rel.targetId];
        if (rel.targetId === targetId) return newPath;
        visited.add(rel.targetId);
        queue.push({ id: rel.targetId, path: newPath });
      }
    }
  }

  return null;
}

/**
 * Get all entities reachable from a source within a given depth.
 * Follows outgoing relations only.
 */
export function getDescendants(
  graph: KnowledgeGraph,
  entityId: string,
  depth: number,
): { entity: KnowledgeEntity; depth: number }[] {
  const result: { entity: KnowledgeEntity; depth: number }[] = [];
  const visited = new Set<string>();
  const queue: { id: string; currentDepth: number }[] = [
    { id: entityId, currentDepth: 0 },
  ];
  visited.add(entityId);

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.currentDepth >= depth) continue;

    for (const rel of graph.relations.values()) {
      if (rel.sourceId === current.id && !visited.has(rel.targetId)) {
        const entity = graph.entities.get(rel.targetId);
        if (entity) {
          visited.add(rel.targetId);
          result.push({ entity, depth: current.currentDepth + 1 });
          queue.push({
            id: rel.targetId,
            currentDepth: current.currentDepth + 1,
          });
        }
      }
    }
  }

  return result;
}

/**
 * Get all ancestors (entities that must come before) within a given depth.
 * Follows incoming prerequisite/depends_on relations only.
 */
export function getAncestors(
  graph: KnowledgeGraph,
  entityId: string,
  depth: number,
): { entity: KnowledgeEntity; depth: number }[] {
  const result: { entity: KnowledgeEntity; depth: number }[] = [];
  const visited = new Set<string>();
  const queue: { id: string; currentDepth: number }[] = [
    { id: entityId, currentDepth: 0 },
  ];
  visited.add(entityId);

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.currentDepth >= depth) continue;

    for (const rel of graph.relations.values()) {
      if (
        rel.targetId === current.id &&
        !visited.has(rel.sourceId) &&
        (rel.type === "prerequisite" || rel.type === "depends_on")
      ) {
        const entity = graph.entities.get(rel.sourceId);
        if (entity) {
          visited.add(rel.sourceId);
          result.push({ entity, depth: current.currentDepth + 1 });
          queue.push({
            id: rel.sourceId,
            currentDepth: current.currentDepth + 1,
          });
        }
      }
    }
  }

  return result;
}

/**
 * Get the full recursive prerequisite chain for a concept.
 * Returns all prerequisites in topological order (leaves first).
 */
export function getPrerequisites(
  graph: KnowledgeGraph,
  conceptId: string,
): ConceptEntity[] {
  const result: ConceptEntity[] = [];
  const visited = new Set<string>();

  function dfs(id: string): void {
    for (const rel of graph.relations.values()) {
      if (rel.sourceId === id && rel.type === "prerequisite") {
        if (!visited.has(rel.targetId)) {
          visited.add(rel.targetId);
          const entity = graph.entities.get(rel.targetId);
          if (entity && entity.type === "concept") {
            dfs(rel.targetId);
            result.push(entity as ConceptEntity);
          }
        }
      }
    }
  }

  dfs(conceptId);
  return result;
}

/**
 * Get all entities that list this concept as a prerequisite.
 */
export function getDependents(
  graph: KnowledgeGraph,
  conceptId: string,
): ConceptEntity[] {
  const result: ConceptEntity[] = [];
  for (const rel of graph.relations.values()) {
    if (rel.targetId === conceptId && rel.type === "prerequisite") {
      const entity = graph.entities.get(rel.sourceId);
      if (entity && entity.type === "concept") {
        result.push(entity as ConceptEntity);
      }
    }
  }
  return result;
}

// ═══════════════════════════════════════════════════════════════════
// GRAPH STATISTICS
// ═══════════════════════════════════════════════════════════════════

export interface GraphStats {
  totalEntities: number;
  totalRelations: number;
  entitiesByType: Record<EntityType, number>;
  relationsByType: Record<RelationType, number>;
  orphans: string[];
  disconnectedComponents: number;
}

export function getKnowledgeGraphStats(graph: KnowledgeGraph): GraphStats {
  const entitiesByType = {} as Record<EntityType, number>;
  const relationsByType = {} as Record<RelationType, number>;

  for (const t of ENTITY_TYPES) entitiesByType[t] = 0;
  for (const t of RELATION_TYPES) relationsByType[t] = 0;

  for (const entity of graph.entities.values()) {
    const base = baseOf(entity);
    entitiesByType[base.type] = (entitiesByType[base.type] ?? 0) + 1;
  }

  for (const rel of graph.relations.values()) {
    relationsByType[rel.type] = (relationsByType[rel.type] ?? 0) + 1;
  }

  const orphans: string[] = [];
  for (const entity of graph.entities.values()) {
    const base = baseOf(entity);
    let hasRelation = false;
    for (const rel of graph.relations.values()) {
      if (rel.sourceId === base.id || rel.targetId === base.id) {
        hasRelation = true;
        break;
      }
    }
    if (!hasRelation) orphans.push(base.id);
  }

  return {
    totalEntities: graph.entities.size,
    totalRelations: graph.relations.size,
    entitiesByType,
    relationsByType,
    orphans,
    disconnectedComponents: countDisconnectedComponents(graph),
  };
}

function countDisconnectedComponents(graph: KnowledgeGraph): number {
  const visited = new Set<string>();
  let count = 0;

  for (const entityId of graph.entities.keys()) {
    if (!visited.has(entityId)) {
      count++;
      const queue = [entityId];
      while (queue.length > 0) {
        const current = queue.shift()!;
        if (visited.has(current)) continue;
        visited.add(current);
        for (const rel of graph.relations.values()) {
          if (rel.sourceId === current && !visited.has(rel.targetId)) {
            queue.push(rel.targetId);
          }
          if (rel.targetId === current && !visited.has(rel.sourceId)) {
            queue.push(rel.sourceId);
          }
        }
      }
    }
  }

  return count;
}

// ═══════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function validateEntity(entity: KnowledgeEntity): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const base = baseOf(entity);

  if (!base.id || typeof base.id !== "string") {
    errors.push("Entity id is required and must be a string");
  }
  if (!base.name || typeof base.name !== "string") {
    errors.push("Entity name is required and must be a string");
  }
  if (!base.description || typeof base.description !== "string") {
    errors.push("Entity description is required and must be a string");
  }
  if (!base.domain || typeof base.domain !== "string") {
    errors.push("Entity domain is required and must be a string");
  }
  if (!Array.isArray(base.tags)) {
    errors.push("Entity tags must be an array");
  }
  if (!ENTITY_TYPES.includes(base.type)) {
    errors.push(`Invalid entity type: "${base.type}"`);
  }
  if (!VALID_STATUSES.includes(base.status)) {
    errors.push(`Invalid entity status: "${base.status}"`);
  }
  if (!(base.createdAt instanceof Date)) {
    errors.push("Entity createdAt must be a Date");
  }
  if (!(base.updatedAt instanceof Date)) {
    errors.push("Entity updatedAt must be a Date");
  }

  return { valid: errors.length === 0, errors, warnings };
}

function validateRelation(
  graph: KnowledgeGraph,
  relation: EntityRelation,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!relation.id || typeof relation.id !== "string") {
    errors.push("Relation id is required and must be a string");
  }
  if (!relation.sourceId || typeof relation.sourceId !== "string") {
    errors.push("Relation sourceId is required and must be a string");
  }
  if (!relation.targetId || typeof relation.targetId !== "string") {
    errors.push("Relation targetId is required and must be a string");
  }
  if (!RELATION_TYPES.includes(relation.type)) {
    errors.push(`Invalid relation type: "${relation.type}"`);
  }
  if (
    typeof relation.weight !== "number" ||
    relation.weight < 0 ||
    relation.weight > 1
  ) {
    errors.push("Relation weight must be a number between 0 and 1");
  }
  if (!(relation.createdAt instanceof Date)) {
    errors.push("Relation createdAt must be a Date");
  }

  if (relation.sourceId === relation.targetId) {
    errors.push("Self-references are not allowed in relations");
  }

  if (!graph.entities.has(relation.sourceId)) {
    errors.push(`Source entity "${relation.sourceId}" does not exist`);
  }
  if (!graph.entities.has(relation.targetId)) {
    errors.push(`Target entity "${relation.targetId}" does not exist`);
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Full graph validation. Checks:
 * - All entities have valid schema
 * - All relations reference existing entities
 * - No self-references
 * - No circular prerequisite chains
 * - No orphans (entities with zero relations)
 * - Orphan warnings for disconnected entities
 */
export function validateGraph(graph: KnowledgeGraph): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate all entities
  for (const entity of graph.entities.values()) {
    const base = baseOf(entity);
    const result = validateEntity(entity);
    if (!result.valid) {
      errors.push(...result.errors.map((e) => `Entity "${base.id}": ${e}`));
    }
  }

  // Validate all relations
  for (const rel of graph.relations.values()) {
    const result = validateRelation(graph, rel);
    if (!result.valid) {
      errors.push(...result.errors.map((e) => `Relation "${rel.id}": ${e}`));
    }
  }

  // Check for circular prerequisite chains
  const cycleErrors = detectPrerequisiteCycles(graph);
  errors.push(...cycleErrors);

  // Check for orphans
  for (const entity of graph.entities.values()) {
    const base = baseOf(entity);
    let hasRelation = false;
    for (const rel of graph.relations.values()) {
      if (rel.sourceId === base.id || rel.targetId === base.id) {
        hasRelation = true;
        break;
      }
    }
    if (!hasRelation) {
      warnings.push(`Orphan entity: "${base.id}" (${base.name})`);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Detect cycles in prerequisite and depends_on relations using DFS.
 * These relation types must form a DAG.
 */
function detectPrerequisiteCycles(graph: KnowledgeGraph): string[] {
  const errors: string[] = [];
  const WHITE = 0;
  const GRAY = 1;
  const BLACK = 2;
  const color = new Map<string, number>();

  for (const id of graph.entities.keys()) {
    color.set(id, WHITE);
  }

  function dfs(id: string, path: string[]): void {
    color.set(id, GRAY);
    path.push(id);

    for (const rel of graph.relations.values()) {
      if (
        rel.sourceId === id &&
        (rel.type === "prerequisite" || rel.type === "depends_on")
      ) {
        const targetColor = color.get(rel.targetId);
        if (targetColor === GRAY) {
          const cycleStart = path.indexOf(rel.targetId);
          const cycle = path.slice(cycleStart).concat(rel.targetId);
          errors.push(
            `Circular prerequisite chain detected: ${cycle.join(" → ")}`,
          );
        } else if (targetColor === WHITE) {
          dfs(rel.targetId, path);
        }
      }
    }

    path.pop();
    color.set(id, BLACK);
  }

  for (const [id, c] of color) {
    if (c === WHITE) {
      dfs(id, []);
    }
  }

  return errors;
}

// ═══════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════

export const ENTITY_TYPES: EntityType[] = [
  "concept",
  "course",
  "project",
  "publication",
  "research",
  "person",
  "institution",
  "tool",
  "technology",
  "forest",
  "species",
  "grant",
  "policy",
  "media",
  "organization",
  "location",
  "asset",
];

export const RELATION_TYPES: RelationType[] = [
  "prerequisite",
  "related_to",
  "depends_on",
  "part_of",
  "teaches",
  "uses",
  "created_by",
  "funded_by",
  "located_in",
  "cites",
  "extends",
  "contradicts",
  "supports",
  "supersedes",
];

const VALID_STATUSES: EntityStatus[] = [
  "draft",
  "review",
  "published",
  "archived",
];

// ═══════════════════════════════════════════════════════════════════
// FACTORY HELPERS
// ═══════════════════════════════════════════════════════════════════

export function createEntity<T extends KnowledgeEntity>(
  fields: Omit<T, "createdAt" | "updatedAt"> & {
    createdAt?: Date;
    updatedAt?: Date;
  },
): T {
  const now = new Date();
  return {
    ...fields,
    createdAt: fields.createdAt ?? now,
    updatedAt: fields.updatedAt ?? now,
  } as unknown as T;
}

export function createRelation(
  fields: Omit<EntityRelation, "createdAt"> & { createdAt?: Date },
): EntityRelation {
  return {
    ...fields,
    createdAt: fields.createdAt ?? new Date(),
  };
}

// ═══════════════════════════════════════════════════════════════════
// IMPORT / EXPORT
// ═══════════════════════════════════════════════════════════════════

export interface KnowledgeGraphExport {
  version: string;
  exportedAt: string;
  entities: KnowledgeEntity[];
  relations: EntityRelation[];
}

export function exportGraph(graph: KnowledgeGraph): KnowledgeGraphExport {
  return {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    entities: Array.from(graph.entities.values()),
    relations: Array.from(graph.relations.values()),
  };
}

export function importGraph(data: KnowledgeGraphExport): KnowledgeGraph {
  const graph = createKnowledgeGraph();
  for (const entity of data.entities) {
    const base = baseOf(entity);
    graph.entities.set(base.id, entity);
  }
  for (const rel of data.relations) {
    graph.relations.set(rel.id, rel);
  }
  return graph;
}
