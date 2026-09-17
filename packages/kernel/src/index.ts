// Bhavya Kernel — Main Export
// Everything the kernel exposes.

export { boot } from "./boot/index.js";
export type { Kernel, BootResult, BootStep } from "./boot/index.js";

export { Runtime } from "./runtime/index.js";
export type { RuntimeContext } from "./runtime/index.js";

export { Configuration } from "./configuration/index.js";
export { ProductionConfiguration } from "./configuration/production.js";
export type {
  ProductionConfig,
  Environment,
  ConfigSchema,
} from "./configuration/production.js";

export { Logging } from "./logging/index.js";
export type { LogLevel, LogEntry, LoggingConfig } from "./logging/index.js";

export { EventBus } from "./events/index.js";

export { Registry } from "./registry/index.js";

export { MemoryEngine } from "./memory/index.js";

export { Permissions } from "./permissions/index.js";

export { Health } from "./health/index.js";

export { Scheduler } from "./scheduler/index.js";

export { Planner } from "./planner/index.js";

export { Api } from "./api/index.js";

export { Observability } from "./observability/index.js";
export type {
  Dashboard,
  KernelStatus,
  AgentStatus,
  WorkflowStatus,
  MemoryStatus,
  EventStatus,
  SchedulerStatus,
  PlannerStatus,
} from "./observability/index.js";

export { Idempotency } from "./idempotency/index.js";

export {
  validateAgent,
  validateWorkflow,
  validateEvent,
  validateMemory,
  validateGoal,
  validateTask,
  validatePlan,
} from "./contracts/index.js";
export type { ContractResult } from "./contracts/index.js";

// Coordinator (v1.3.0-alpha)
export { Coordinator } from "./coordinator/index.js";
export type {
  CoordinatorConfig,
  AgentExecution,
  ExecutionReport,
} from "./coordinator/index.js";

// Replay Engine (v1.3.0-alpha)
export { ReplayEngine } from "./replay/index.js";
export type { ReplayConfig, ReplayResult } from "./replay/index.js";

// Institution Services (v1.3.0-alpha)
export {
  TransparencyService,
  VolunteerService,
  ResearchService,
  GovernanceService,
} from "./services/index.js";
export type { InstitutionService } from "./services/index.js";

// Self-Organizing Engine (v1.4.0-alpha)
export { SelfOrganizingEngine } from "./self-organizing/index.js";
export type {
  SelfOrganizingConfig,
  WorkItem,
  Agent,
} from "./self-organizing/index.js";

// Event-Driven Orchestrator (v1.4.0-alpha)
export { EventDrivenOrchestrator } from "./orchestrator/index.js";
export type {
  OrchestratorConfig,
  WorkflowTrigger,
} from "./orchestrator/index.js";

// Consensus Engine (v1.4.0-alpha)
export { ConsensusEngine } from "./consensus/index.js";
export type { ConsensusConfig, Proposal, Vote } from "./consensus/index.js";

// Capability Matcher (v1.4.0-alpha)
export { CapabilityMatcher } from "./capability-matcher/index.js";
export type {
  MatchingConfig,
  MatchingRequest,
  MatchingResult,
  AgentMatch,
} from "./capability-matcher/index.js";

// Auth (v2.0.0-beta)
export { Auth } from "./auth/index.js";
export type { AuthToken, AuthConfig, Role } from "./auth/index.js";

// Rate Limiting (v2.0.0-beta)
export { RateLimiter } from "./rate-limit/index.js";
export type { RateLimitConfig, RateLimitResult } from "./rate-limit/index.js";

// Monitoring & Alerting (v2.0.0-beta)
export { Monitoring } from "./monitoring/index.js";
export type { MonitoringConfig, Alert, Metric } from "./monitoring/index.js";

// Backup & Recovery (v2.0.0-beta)
export { BackupRecovery } from "./backup/index.js";
export type { BackupConfig, Backup, RecoveryResult } from "./backup/index.js";

// Scenarios (real execution)
export { CreateMissionPage } from "./scenarios/create-mission-page.js";
export type {
  CreatePageInput,
  CreatePageContext,
} from "./scenarios/create-mission-page.js";

export { PublishReleaseNotes } from "./scenarios/publish-release-notes.js";
export type {
  PublishReleaseInput,
  PublishReleaseContext,
} from "./scenarios/publish-release-notes.js";

// Re-export all types
export * from "./types/index.js";
