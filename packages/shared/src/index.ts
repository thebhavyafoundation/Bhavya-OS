/**
 * @bhavya/shared — Barrel Export
 *
 * Single source of truth for all Bhavya OS types.
 * Every package imports from here.
 */

export type {
  // Core Identifiers
  AgentId,
  TaskId,
  WorkflowId,
  EventId,
  MemoryId,
  GoalId,
  PlanId,
  ExecutionId,
  CorrelationId,

  // Common Enums
  Priority,
  EntityStatus,

  // Execution Context
  ExecutionContext,
  ExecutionTimestamps,
  ExecutionState,

  // Event System
  BhavyaEvent,
  EventPriority,
  EventStatus,
  EventHandler,
  EventSubscription,
  EventFilter,
  EventBusConfig,
  EventBusMetrics,
  KnowledgeCreatedPayload,
  PackageBuiltPayload,
  PipelineCompletedPayload,
  UserRegisteredPayload,
  NotificationSentPayload,

  // Workflow System
  Workflow,
  WorkflowTrigger,
  WorkflowStep,
  StepConfig,
  RetryPolicy,
  WorkflowStatus,
  StepType,
  StepStatus,
  WorkflowExecution,
  StepResult,
  WorkflowMetrics,

  // Memory System
  Memory,
  MemoryType,
  MemoryPriority,
  MemoryStatus,
  MemoryRelation,
  MemoryQuery,
  MemorySearchResult,
  MemoryStats,

  // Goal & Plan
  Goal,
  KPI,
  GoalStatus,
  Plan,
  PlanStep,
  PlanStatus,
  Milestone,
  Resource,
  Timeline,
  TimelinePhase,

  // Agent & Task
  Agent,
  AgentStatus,
  Capability,
  Task,
  TaskStatus,

  // Knowledge Types
  KnowledgeObject,
  KnowledgeObjectMetadata,
  KnowledgePackage,
  Concept,
  Definition,
  Example,
  Misconception,
  Exercise,
  EducationalPackage,
  Lesson,
  LessonStatus,
  LearningOutcome,
  BloomLevel,
  LessonSection,
  LessonSectionType,
  Vocabulary,
  Course,
  CourseLevel,
  CourseModule,
  CourseModuleLesson,
  StudentProgress,
  Assessment,
  Question,
  TeacherGuide,
  TimingGuide,
  TimingSection,
  Workbook,
  WorkbookPage,
  VisualSpec,
  Scene,
  VisualElement,
  VideoSpec,
  VideoComposition,
  Website,
  WebsitePage,
  TechnologyPackage,
  SourceKind,
  KnowledgeCategory,
  Analysis,
  Recommendation,
  RecommendationLevel,
  RecommendationFactor,
  RadarQuadrant,
  RadarRing,
  RadarClassification,
  SourceType,
  Difficulty,
  PublicationStatus,
  QuestionType,
  ExerciseType,

  // Universal Entity
  BaseEntity,
  EntityType,
  EntityRelation,
  RelationType,

  // Artifacts
  Artifact,
  ArtifactType,
  ArtifactMetadata,

  // Pipeline
  PipelineExecution,
  PipelineStatus,
  NodeResult,
  NodeStatus,
  PipelineEvent,
  PipelineMetrics,
  TraceSpan,

  // Search
  SearchResult,
  SearchHighlight,
  SearchQuery,
  SearchResponse,

  // Notifications
  Notification,
  NotificationType,
  NotificationChannel,
  NotificationStatus,
  NotificationPreference,

  // Audit
  AuditEntry,
  AuditAction,

  // Providers
  Provider,
  ProviderType,
  ProviderStatus,
  ProviderCapability,
  ProviderHealth,

  // User & Auth
  User,
  UserRole,
  Session,
  AuthCredentials,
  RegistrationData,

  // Schema & Registry
  Schema,
  RegistryEntry,
  RegistryType,

  // Health
  HealthStatus,
  ComponentHealth,
  ExecutionReport,

  // Permission
  Permission,
} from "./types.js";
