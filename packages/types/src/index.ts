/**
 * @bhavya/types — Canonical Type Re-exports
 *
 * ALL types now live in @bhavya/shared.
 * This package re-exports them for backward compatibility.
 * New code should import directly from @bhavya/shared.
 */

export type {
  // Knowledge Types
  KnowledgeObject,
  KnowledgePackage,
  Concept,
  Definition,
  Example,
  Misconception,
  Exercise,
  Lesson,
  LessonSection,
  Vocabulary,
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
  SourceType,
  Difficulty,
  EntityStatus,
  PublicationStatus,
  QuestionType,
  ExerciseType,

  // User & Auth
  User,
  UserRole,
  Session,
  AuthCredentials,
  RegistrationData,
  Permission,

  // Workflow & Goals
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
  Workflow,
  WorkflowTrigger,
  WorkflowStep,
  StepConfig,
  RetryPolicy,
  Priority,
  WorkflowStatus,
  StepType,
  StepStatus,

  // Events
  BhavyaEvent,
  EventHandler,
  EventSubscription,
  EventFilter,
  EventPriority,
  EventStatus,
  KnowledgeCreatedPayload,
  PackageBuiltPayload,
  PipelineCompletedPayload,
  UserRegisteredPayload,
  NotificationSentPayload,

  // Artifacts
  Artifact,
  ArtifactType,
  ArtifactMetadata,

  // Pipeline
  PipelineExecution,
  NodeResult,
  PipelineEvent,
  PipelineMetrics,
  TraceSpan,
  PipelineStatus,
  NodeStatus,

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
} from "@bhavya/shared";
