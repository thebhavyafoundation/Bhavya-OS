/**
 * @bhavya/shared — Canonical Types
 *
 * SINGLE SOURCE OF TRUTH for all Bhavya OS types.
 * Every package imports from here. No package redefines these types.
 *
 * Resolved from: @bhavya/types, @bhavya/kernel, @bhavya/runtime,
 * @bhavya/mission-runtime, @bhavya/intelligence
 *
 * @version 1.0.0
 * @license MIT
 */

// ───────────────────────────────────────────────────────────────────
// CORE IDENTIFIERS
// ───────────────────────────────────────────────────────────────────

export type AgentId = string;
export type TaskId = string;
export type WorkflowId = string;
export type EventId = string;
export type MemoryId = string;
export type GoalId = string;
export type PlanId = string;
export type ExecutionId = string;
export type CorrelationId = string;

// ───────────────────────────────────────────────────────────────────
// COMMON ENUMS
// ───────────────────────────────────────────────────────────────────

export type Priority = "critical" | "high" | "medium" | "low";

export type EntityStatus = "draft" | "review" | "published" | "archived";

// ───────────────────────────────────────────────────────────────────
// EXECUTION CONTEXT
// ───────────────────────────────────────────────────────────────────

export interface ExecutionContext {
  executionId: ExecutionId;
  parentExecutionId?: ExecutionId;
  triggeringEvent?: EventId;
  initiatingAgent?: AgentId;
  correlationId: CorrelationId;
  timestamps: ExecutionTimestamps;
  retryCount: number;
  maxRetries: number;
  state: ExecutionState;
  metadata: Record<string, unknown>;
}

export interface ExecutionTimestamps {
  started: Date;
  lastUpdated: Date;
  completed?: Date;
  deadline?: Date;
}

export type ExecutionState =
  | "initializing"
  | "running"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled"
  | "retrying";

// ───────────────────────────────────────────────────────────────────
// EVENT SYSTEM — Single canonical EventBus
// ───────────────────────────────────────────────────────────────────

/** Canonical event — used by all packages */
export interface BhavyaEvent<T = unknown> {
  id: EventId;
  type: string;
  name: string;
  version: number;
  source: string;
  producer: string;
  payload: T;
  timestamp: string;
  priority: EventPriority;
  status: EventStatus;
  metadata: Record<string, unknown>;
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  processedAt?: Date;
  failedAt?: Date;
  error?: string;
  context?: ExecutionContext;
}

export type EventPriority = "critical" | "high" | "medium" | "low";

export type EventStatus =
  "pending" | "processing" | "completed" | "failed" | "retrying";

export type EventHandler<T = unknown> = (
  event: BhavyaEvent<T>,
) => Promise<void> | void;

export interface EventSubscription {
  id: string;
  eventType: string;
  handler: EventHandler;
  priority: EventPriority;
  filter?: EventFilter;
  once: boolean;
  active: boolean;
  createdAt: Date;
}

export interface EventFilter {
  types?: string[];
  source?: string[];
  priority?: EventPriority[];
  since?: Date;
  until?: Date;
  limit?: number;
  payloadFilter?: (payload: Record<string, unknown>) => boolean;
}

export interface EventBusConfig {
  maxRetries: number;
  retryDelay: number;
  maxQueueSize: number;
  persistenceEnabled: boolean;
  persistencePath?: string;
}

export interface EventBusMetrics {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsByPriority: Record<EventPriority, number>;
  eventsByStatus: Record<EventStatus, number>;
  avgProcessingTime: number;
  errorRate: number;
}

// ─── Common Event Payloads ────────────────────────────────────────

export interface KnowledgeCreatedPayload {
  koId: string;
  title: string;
  domain: string;
  userId: string;
}

export interface PackageBuiltPayload {
  packageId: string;
  koId: string;
  title: string;
  status: string;
}

export interface PipelineCompletedPayload {
  executionId: string;
  packageId: string;
  duration: number;
  artifacts: string[];
}

export interface UserRegisteredPayload {
  userId: string;
  email: string;
  name?: string;
}

export interface NotificationSentPayload {
  notificationId: string;
  channel: string;
  recipient: string;
  success: boolean;
}

// ───────────────────────────────────────────────────────────────────
// WORKFLOW SYSTEM — Single canonical WorkflowEngine
// ───────────────────────────────────────────────────────────────────

/** Canonical workflow definition */
export interface Workflow {
  id: WorkflowId;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  status: WorkflowStatus;
  variables: Record<string, unknown>;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface WorkflowTrigger {
  type: "manual" | "event" | "schedule" | "webhook";
  event?: string;
  schedule?: string;
  config: Record<string, unknown>;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: StepType;
  status: StepStatus;
  config: StepConfig;
  dependencies: string[];
  retryPolicy: RetryPolicy;
  timeout: number;
  onError: "fail" | "skip" | "retry" | "continue";
  metadata: Record<string, unknown>;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  result?: unknown;
}

/** Unified step configuration — supports both capability-based and action-based patterns */
export interface StepConfig {
  // Capability-based (from @bhavya/types)
  capabilityId?: string;
  skillId?: string;
  agentId?: string;
  inputs?: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  // Action-based (from runtime)
  action?: string;
  condition?: string;
  parallel?: string[];
  loop?: { items: string; step: string };
  wait?: { duration: number };
  subworkflow?: { workflowId: string; input: Record<string, unknown> };
  // Catch-all for extensibility
  [key: string]: unknown;
}

/** Unified retry policy — most configurable version */
export interface RetryPolicy {
  maxAttempts: number;
  maxRetries: number;
  backoffMs: number;
  backoffMultiplier: number;
  initialDelay: number;
}

export type WorkflowStatus =
  "draft" | "active" | "paused" | "completed" | "failed" | "cancelled";

export type StepType =
  | "action"
  | "approval"
  | "notification"
  | "condition"
  | "parallel"
  | "loop"
  | "wait"
  | "subworkflow";

export type StepStatus =
  "pending" | "running" | "completed" | "failed" | "skipped" | "cancelled";

/** Runtime execution state for a workflow */
export interface WorkflowExecution {
  id: ExecutionId;
  workflowId: WorkflowId;
  status: WorkflowStatus;
  stepResults: Map<string, StepResult>;
  variables: Record<string, unknown>;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  context?: ExecutionContext;
}

export interface StepResult {
  stepId: string;
  status: StepStatus;
  output: unknown;
  error?: string;
  duration: number;
}

export interface WorkflowMetrics {
  totalWorkflows: number;
  byStatus: Record<WorkflowStatus, number>;
  avgExecutionTime: number;
  successRate: number;
  totalExecutions: number;
}

// ───────────────────────────────────────────────────────────────────
// MEMORY SYSTEM — Single canonical MemoryEngine
// ───────────────────────────────────────────────────────────────────

/** Canonical memory entry — merges kernel + runtime definitions */
export interface Memory {
  id: MemoryId;
  type: MemoryType;
  priority: MemoryPriority;
  status: MemoryStatus;
  content: string;
  summary: string;
  tags: string[];
  embeddings?: number[];
  metadata: Record<string, unknown>;
  relations: MemoryRelation[];
  accessCount: number;
  lastAccessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  // Optional context (from kernel)
  context?: string;
  source?: string;
  confidence?: number;
}

/** Merged memory types — kernel + runtime values */
export type MemoryType =
  | "decision"
  | "learning"
  | "pattern"
  | "anti-pattern"
  | "insight"
  | "fact"
  | "procedure"
  | "incident"
  | "conversation"
  | "context"
  | "project"
  | "person"
  | "knowledge"
  | "architecture"
  | "history"
  | "bug"
  | "lesson";

export type MemoryPriority = "critical" | "high" | "medium" | "low";

export type MemoryStatus = "active" | "archived" | "deprecated" | "superseded";

export interface MemoryRelation {
  targetId: string;
  type: "supports" | "contradicts" | "extends" | "depends_on" | "related_to";
  strength: number;
}

export interface MemoryQuery {
  text?: string;
  types?: MemoryType[];
  tags?: string[];
  priority?: MemoryPriority;
  status?: MemoryStatus;
  dateRange?: { start: Date; end: Date };
  limit?: number;
  offset?: number;
  minRelevance?: number;
}

export interface MemorySearchResult {
  memory: Memory;
  score: number;
  explanation: string;
}

export interface MemoryStats {
  totalMemories: number;
  byType: Record<MemoryType, number>;
  byPriority: Record<MemoryPriority, number>;
  byStatus: Record<MemoryStatus, number>;
  avgAccessCount: number;
  oldestMemory: Date;
  newestMemory: Date;
}

// ───────────────────────────────────────────────────────────────────
// GOAL & PLAN SYSTEM
// ───────────────────────────────────────────────────────────────────

/** Canonical goal — merges @bhavya/types (rich) + kernel (simple) */
export interface Goal {
  id: GoalId;
  name: string;
  description: string;
  status: GoalStatus;
  priority: Priority;
  kpis: KPI[];
  deadline?: Date;
  owner?: string;
  progress: number;
  constraints: string[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface KPI {
  name: string;
  target: number;
  current: number;
  unit: string;
}

export type GoalStatus =
  "draft" | "active" | "completed" | "cancelled" | "failed";

/** Canonical plan — merges both definitions */
export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  goalId?: GoalId;
  status: PlanStatus;
  goals?: Goal[];
  steps: PlanStep[];
  milestones: Milestone[];
  resources: Resource[];
  timeline: Timeline;
  dependencies: string[];
  context?: ExecutionContext;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanStep {
  name: string;
  task: Task;
  dependencies: number[];
  estimatedDuration?: number;
}

export type PlanStatus =
  | "draft"
  | "approved"
  | "active"
  | "on-hold"
  | "executing"
  | "completed"
  | "cancelled"
  | "failed";

export interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  completed: boolean;
}

export interface Resource {
  id: string;
  name: string;
  type: string;
  capacity: number;
  allocated: number;
}

export interface Timeline {
  startDate: string;
  endDate: string;
  phases: TimelinePhase[];
}

export interface TimelinePhase {
  name: string;
  startDate: string;
  endDate: string;
}

// ───────────────────────────────────────────────────────────────────
// AGENT & TASK SYSTEM
// ───────────────────────────────────────────────────────────────────

export interface Agent {
  id: AgentId;
  name: string;
  role: string;
  description: string;
  capabilities: Capability[];
  permissions: Permission[];
  status: AgentStatus;
  metadata: Record<string, unknown>;
}

export type AgentStatus = "idle" | "busy" | "error" | "offline";

export interface Capability {
  name: string;
  description: string;
  inputs: Schema[];
  outputs: Schema[];
}

export interface Task {
  id: TaskId;
  type: string;
  goal: string;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  status: TaskStatus;
  assignee?: AgentId;
  dependencies: TaskId[];
  events: EventId[];
  context?: ExecutionContext;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  error?: Error;
}

export type TaskStatus =
  "pending" | "queued" | "running" | "completed" | "failed" | "cancelled";

// ───────────────────────────────────────────────────────────────────
// KNOWLEDGE TYPES — Educational + Technology domains
// ───────────────────────────────────────────────────────────────────

// ─── Educational Knowledge ────────────────────────────────────────

/** Knowledge Object — a unit of educational content. Canonical source for all KO types. */
export interface KnowledgeObject {
  id: string;
  title: string;
  domain: string;
  subject?: string;
  grade: number;
  description?: string;
  sourceType: SourceType;
  sourceContent?: string;
  sourceUrl?: string;
  concepts: Concept[];
  definitions: Definition[];
  examples: Example[];
  misconceptions: Misconception[];
  exercises: Exercise[];
  prerequisites: string[];
  related: string[];
  metadata: KnowledgeObjectMetadata;
  status: EntityStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeObjectMetadata {
  author?: string;
  targetAudience?: string;
  language?: string;
  estimatedDuration?: string;
  bloomTaxonomy?: string[];
  tags?: string[];
  [key: string]: unknown;
}

export interface Concept {
  name: string;
  description: string;
  difficulty: Difficulty;
}

export interface Definition {
  term: string;
  definition: string;
}

export interface Example {
  title: string;
  description: string;
}

export interface Misconception {
  misconception: string;
  correction: string;
}

export interface Exercise {
  prompt: string;
  type: ExerciseType;
  difficulty: Difficulty;
  answer?: string;
}

/** KnowledgePackage — canonical name for compiled artifact bundles (alias for EducationalPackage) */
export type KnowledgePackage = EducationalPackage;

/** Educational Knowledge Package — compiled bundle of learning artifacts */
export interface EducationalPackage {
  id: string;
  version: string;
  status: EntityStatus;
  title: string;
  description?: string;
  domain?: string;
  subject?: string;
  gradeLevel?: string;
  koId: string;
  userId: string;
  lesson?: Lesson;
  assessment?: Assessment;
  teacherGuide?: TeacherGuide;
  workbook?: Workbook;
  visualSpec?: VisualSpec;
  video?: VideoSpec;
  website?: Website;
  publicationStatus: PublicationStatus;
  publishedAt?: string;
  approvedBy?: string;
  immutableHash?: string;
  previousVersion?: string;
  createdAt: string;
  updatedAt: string;
}

/** Lesson — a structured learning unit within a course. Canonical source for all Lesson types. */
export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  subject: string;
  grade: number;
  duration: number;
  status: LessonStatus;
  learningOutcomes: LearningOutcome[];
  sections: LessonSection[];
  vocabulary: Vocabulary[];
  prerequisites: string[];
  createdAt: string;
  updatedAt: string;
  version: number;
}

export type LessonStatus = "draft" | "ready" | "published";

export interface LearningOutcome {
  id: string;
  description: string;
  bloomLevel: BloomLevel;
}

export type BloomLevel =
  "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create";

export interface LessonSection {
  id: string;
  type: LessonSectionType;
  title: string;
  content: string;
  order: number;
}

export type LessonSectionType =
  | "introduction"
  | "key-concepts"
  | "visual-explanation"
  | "examples"
  | "exercises"
  | "summary";

/** Course — a structured learning path containing modules and lessons. Canonical source for all Course types. */
export interface Course {
  id: string;
  title: string;
  description: string;
  domain: string;
  subject: string;
  grade: number;
  level: CourseLevel;
  status: LessonStatus;
  modules: CourseModule[];
  prerequisites: string[];
  estimatedDuration: number;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type CourseLevel =
  "foundation" | "beginner" | "intermediate" | "advanced" | "expert";

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: CourseModuleLesson[];
}

export interface CourseModuleLesson {
  id: string;
  title: string;
  order: number;
  duration: number;
}

/** StudentProgress — tracks learner progress through courses and lessons */
export interface StudentProgress {
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  score?: number;
  timeSpent: number;
  completedAt?: string;
}

export interface Vocabulary {
  term: string;
  definition: string;
}

export interface Assessment {
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string;
  marks?: number;
}

export interface TeacherGuide {
  title: string;
  objectives: string[];
  materials: string[];
  discussionPrompts: string[];
  timingGuide: TimingGuide;
}

export interface TimingGuide {
  totalMinutes: number;
  sections: TimingSection[];
}

export interface TimingSection {
  title: string;
  minutes: number;
}

export interface Workbook {
  title: string;
  pages: WorkbookPage[];
}

export interface WorkbookPage {
  title: string;
  content: string;
  exercises?: Exercise[];
}

export interface VisualSpec {
  scenes: Scene[];
  palette: string[];
  totalDuration: number;
}

export interface Scene {
  id: string;
  title: string;
  duration: number;
  elements: VisualElement[];
}

export interface VisualElement {
  type: string;
  content: string;
  position?: { x: number; y: number };
  style?: Record<string, unknown>;
}

export interface VideoSpec {
  compositions: VideoComposition[];
  totalDuration: number;
  resolution: { width: number; height: number };
}

export interface VideoComposition {
  id: string;
  duration: number;
  scenes: string[];
}

export interface Website {
  pages: WebsitePage[];
}

export interface WebsitePage {
  title: string;
  slug: string;
  content: string;
}

// ─── Institutional Missions ───────────────────────────────────────

/** Mission — a permanent institutional mission of Bhavya Foundation. Canonical source for all Mission types. */
export interface Mission {
  id: MissionId;
  name: string;
  slug: MissionSlug;
  purpose: string;
  description: string;
  status: MissionStatus;
  domain: MissionDomain;
  programs: Program[];
  projects: ProjectRef[];
  knowledge: KnowledgeRef[];
  evidence: EvidenceRef[];
  impact: ImpactMetrics;
  participation: ParticipationInfo;
  createdAt: string;
  updatedAt: string;
}

export type MissionId = "forest" | "knowledge" | "heritage" | "community";

export type MissionSlug = "forest" | "knowledge" | "heritage" | "community";

export type MissionStatus = "active" | "on-hold" | "completed" | "archived";

export type MissionDomain =
  "environment" | "education" | "heritage" | "community" | "research";

export interface Program {
  id: string;
  name: string;
  description: string;
  missionId: MissionId;
  status: EntityStatus;
}

export interface ProjectRef {
  id: string;
  name: string;
  programId?: string;
  status: EntityStatus;
}

export interface KnowledgeRef {
  id: string;
  title: string;
  koId: string;
  type: "lesson" | "assessment" | "guide" | "workbook" | "video";
}

export interface EvidenceRef {
  id: string;
  type: "impact" | "research" | "testimonial" | "metric";
  title: string;
  url?: string;
}

export interface ImpactMetrics {
  metrics: ImpactMetric[];
}

export interface ImpactMetric {
  id: string;
  name: string;
  unit: string;
  target: number;
  current: number;
}

export interface ParticipationInfo {
  ways: string[];
  ctaLabel: string;
  ctaUrl: string;
}

// ─── Technology Knowledge ─────────────────────────────────────────

/** Technology Knowledge Package — discovered tech item with analysis */
export interface TechnologyPackage {
  id: string;
  sourceId: string;
  sourceKind: SourceKind;
  externalId: string;
  category: KnowledgeCategory;
  title: string;
  description: string;
  url: string;
  tags: string[];
  metadata: Record<string, unknown>;
  analysis: Analysis | null;
  recommendation: Recommendation | null;
  radarClassification: RadarClassification | null;
  relatedIds: string[];
  dependsOnIds: string[];
  usedByIds: string[];
  createdAt: string;
  updatedAt: string;
  version: number;
}

export type SourceKind =
  | "github"
  | "mcp_registry"
  | "ai_framework"
  | "ui_inspiration"
  | "education"
  | "research"
  | "website"
  | "social"
  | "blog"
  | "youtube"
  | "product_hunt";

export type KnowledgeCategory =
  | "repository"
  | "framework"
  | "mcp_server"
  | "ai_tool"
  | "education_resource"
  | "research_paper"
  | "website"
  | "ui_pattern"
  | "architecture_pattern"
  | "course"
  | "video"
  | "article"
  | "product"
  | "comparison";

export interface Analysis {
  executiveSummary: string;
  architecture: string;
  technologyStack: string[];
  interestingIdeas: string[];
  reusablePatterns: string[];
  risks: string[];
  alternatives: string[];
  adoptionScore: number;
  integrationNotes: string;
  relatedTechnologies: string[];
  suggestedLearningResources: string[];
  futureWatchlist: string[];
  analyzedAt: string;
  model: string;
}

export type RecommendationLevel =
  | "adopt_immediately"
  | "pilot"
  | "study"
  | "reference"
  | "monitor"
  | "ignore"
  | "archive";

export interface Recommendation {
  level: RecommendationLevel;
  reasoning: string;
  confidence: number;
  factors: RecommendationFactor[];
  recommendedAt: string;
}

export interface RecommendationFactor {
  name: string;
  score: number;
  weight: number;
  explanation: string;
}

export type RadarQuadrant = "adopt" | "trial" | "assess" | "hold";
export type RadarRing = "leading" | "emerging" | "experimental" | "deprecated";

export interface RadarClassification {
  quadrant: RadarQuadrant;
  ring: RadarRing;
  isNew: boolean;
  changedFrom?: RadarQuadrant;
  classifiedAt: string;
}

// ─── Knowledge Enums ──────────────────────────────────────────────

export type SourceType = "text" | "pdf" | "docx" | "markdown" | "url" | "api";
export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";
export type PublicationStatus = "draft" | "pending" | "published" | "archived";
export type QuestionType = "mcq" | "short-answer" | "reflection" | "practical";
export type ExerciseType = "short-answer" | "mcq" | "reflection" | "practical";

// ───────────────────────────────────────────────────────────────────
// UNIVERSAL ENTITY — Base for Knowledge Graph
// ───────────────────────────────────────────────────────────────────

/** Base entity — every knowledge graph node extends this */
export interface BaseEntity {
  id: string;
  type: EntityType;
  name: string;
  description: string;
  domain: string;
  tags: string[];
  metadata: Record<string, unknown>;
  status: EntityStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type EntityType =
  | "concept"
  | "course"
  | "project"
  | "publication"
  | "research"
  | "person"
  | "institution"
  | "tool"
  | "technology"
  | "forest"
  | "species"
  | "grant"
  | "policy"
  | "media"
  | "organization"
  | "location"
  | "asset"
  | "beneficiary"
  | "evidence"
  | "activity"
  | "event"
  | "outcome"
  | "metric"
  | "document"
  | "report";

/** Typed relationship between entities */
export interface EntityRelation {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationType;
  weight: number;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export type RelationType =
  | "prerequisite"
  | "related_to"
  | "depends_on"
  | "part_of"
  | "teaches"
  | "uses"
  | "created_by"
  | "funded_by"
  | "located_in"
  | "cites"
  | "extends"
  | "contradicts"
  | "supports"
  | "supersedes"
  | "produces"
  | "participates_in"
  | "benefits_from"
  | "measures"
  | "documents"
  | "verified_by";

// ───────────────────────────────────────────────────────────────────
// ARTIFACTS
// ───────────────────────────────────────────────────────────────────

export interface Artifact {
  path: string;
  action: "created" | "updated" | "deleted";
  content?: string;
  metadata: Record<string, unknown>;
}

export type ArtifactType =
  "document" | "code" | "image" | "video" | "audio" | "data" | "package";

export interface ArtifactMetadata {
  type: ArtifactType;
  size: number;
  hash: string;
  encoding?: string;
}

// ───────────────────────────────────────────────────────────────────
// PIPELINE
// ───────────────────────────────────────────────────────────────────

export interface PipelineExecution {
  id: ExecutionId;
  pipelineId: string;
  status: PipelineStatus;
  nodeResults: Map<string, NodeResult>;
  variables: Record<string, unknown>;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  events: PipelineEvent[];
  metrics: PipelineMetrics;
  trace: TraceSpan[];
  context?: ExecutionContext;
}

export type PipelineStatus =
  "pending" | "running" | "completed" | "failed" | "cancelled";

export interface NodeResult {
  nodeId: string;
  status: NodeStatus;
  output: unknown;
  error?: string;
  duration: number;
}

export type NodeStatus =
  "pending" | "running" | "completed" | "failed" | "skipped";

export interface PipelineEvent {
  type: string;
  nodeId?: string;
  timestamp: Date;
  data: Record<string, unknown>;
}

export interface PipelineMetrics {
  totalNodes: number;
  completedNodes: number;
  failedNodes: number;
  totalDuration: number;
  nodeDurations: Record<string, number>;
}

export interface TraceSpan {
  id: string;
  parentId?: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  attributes: Record<string, unknown>;
}

// ───────────────────────────────────────────────────────────────────
// SEARCH
// ───────────────────────────────────────────────────────────────────

export interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
  score: number;
  highlights: SearchHighlight[];
  metadata: Record<string, unknown>;
}

export interface SearchHighlight {
  field: string;
  snippet: string;
  offset: number;
  length: number;
}

export interface SearchQuery {
  text: string;
  filters?: Record<string, unknown>;
  limit?: number;
  offset?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: SearchQuery;
  duration: number;
}

// ───────────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ───────────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: NotificationType;
  channel: NotificationChannel;
  recipient: string;
  title: string;
  body: string;
  status: NotificationStatus;
  metadata: Record<string, unknown>;
  createdAt: Date;
  sentAt?: Date;
  readAt?: Date;
}

export type NotificationType =
  "info" | "warning" | "error" | "success" | "reminder";

export type NotificationChannel =
  "email" | "in-app" | "slack" | "discord" | "telegram" | "push";

export type NotificationStatus =
  "pending" | "sent" | "delivered" | "read" | "failed";

export interface NotificationPreference {
  userId: string;
  channel: NotificationChannel;
  enabled: boolean;
  types: NotificationType[];
}

// ───────────────────────────────────────────────────────────────────
// AUDIT
// ───────────────────────────────────────────────────────────────────

export interface AuditEntry {
  id: string;
  action: AuditAction;
  actor: string;
  resource: string;
  resourceId: string;
  changes: Record<string, { before: unknown; after: unknown }>;
  timestamp: Date;
  metadata: Record<string, unknown>;
}

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "publish"
  | "archive"
  | "approve"
  | "reject"
  | "execute";

// ───────────────────────────────────────────────────────────────────
// PROVIDERS
// ───────────────────────────────────────────────────────────────────

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  status: ProviderStatus;
  capabilities: ProviderCapability[];
  health: ProviderHealth;
  config: Record<string, unknown>;
}

export type ProviderType =
  | "git"
  | "social"
  | "storage"
  | "search"
  | "email"
  | "calendar"
  | "ocr"
  | "speech"
  | "video"
  | "image"
  | "browser"
  | "crawler"
  | "ai";

export type ProviderStatus = "active" | "inactive" | "error";

export interface ProviderCapability {
  name: string;
  supported: boolean;
  config?: Record<string, unknown>;
}

export interface ProviderHealth {
  status: "healthy" | "degraded" | "unhealthy";
  lastChecked: Date;
  latency?: number;
  error?: string;
}

// ───────────────────────────────────────────────────────────────────
// USER & AUTH
// ───────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  interests?: string[];
  onboardingComplete?: boolean;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/** User roles — canonical source for all auth systems */
export type UserRole =
  | "guest"
  | "viewer"
  | "student"
  | "editor"
  | "mentor"
  | "instructor"
  | "admin"
  | "security"
  | "cto"
  | "founder";

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  email: string;
  password: string;
  name: string;
}

// ───────────────────────────────────────────────────────────────────
// SCHEMA & REGISTRY
// ───────────────────────────────────────────────────────────────────

export interface Schema {
  type: string;
  properties?: Record<string, Schema>;
  required?: string[];
  description?: string;
}

export interface RegistryEntry {
  id: string;
  type: RegistryType;
  name: string;
  path: string;
  metadata: Record<string, unknown>;
  discoveredAt: Date;
}

export type RegistryType =
  | "agent"
  | "workflow"
  | "event"
  | "memory"
  | "command"
  | "prompt"
  | "template"
  | "schema"
  | "policy";

// ───────────────────────────────────────────────────────────────────
// HEALTH & REPORTING
// ───────────────────────────────────────────────────────────────────

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  components: ComponentHealth[];
  timestamp: Date;
}

export interface ComponentHealth {
  name: string;
  status: "healthy" | "degraded" | "unhealthy";
  message?: string;
  latency?: number;
}

export interface ExecutionReport {
  executionId: ExecutionId;
  goal?: Goal;
  plan?: Plan;
  tasks: Task[];
  artifacts: Artifact[];
  events: string[];
  memoryUpdates: string[];
  status: "success" | "partial" | "failed";
  duration: number;
  timestamp: Date;
  context: ExecutionContext;
}

// ───────────────────────────────────────────────────────────────────
// PERMISSION
// ───────────────────────────────────────────────────────────────────

export interface Permission {
  resource: string;
  actions: string[];
  conditions?: Record<string, unknown>;
}
