/**
 * Bhavya Runtime Protocol (BRP) Types
 *
 * Kernel-specific types for execution, idempotency, and registry.
 * All shared domain types (Workflow, Event, Memory, Goal, Task, Agent, etc.)
 * are imported from @bhavya/shared — the single source of truth.
 */

import type {
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

  // Shared Domain Types (canonical definitions)
  Workflow,
  WorkflowStep,
  WorkflowStatus,
  WorkflowTrigger,
  Agent,
  AgentStatus,
  Task,
  TaskStatus,
  BhavyaEvent,
  EventHandler,
  Memory,
  MemoryType,
  Goal,
  Priority,
  Plan,
  PlanStep,
  PlanStatus,
  Permission,
  Schema,
  Artifact,
  Capability,
} from "@bhavya/shared";

// Re-export shared types so existing kernel consumers don't break
export type {
  AgentId,
  TaskId,
  WorkflowId,
  EventId,
  MemoryId,
  GoalId,
  PlanId,
  ExecutionId,
  CorrelationId,
  Workflow,
  WorkflowStep,
  WorkflowStatus,
  WorkflowTrigger,
  Agent,
  AgentStatus,
  Task,
  TaskStatus,
  MemoryType,
  Goal,
  Priority,
  Plan,
  PlanStep,
  PlanStatus,
  Permission,
  Schema,
  Artifact,
  Capability,
};

// Re-export shared types under kernel-preferred aliases
export type Event = BhavyaEvent;
export type { EventHandler, EventHandler as EventHandler_ };
export type MemoryEntry = Memory;

// ─── BRP-Specific Types (not in @bhavya/shared) ────────────────────

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
  | 'initializing'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'retrying';

export interface IdempotencyKey {
  key: string;
  executionId: ExecutionId;
  status: 'pending' | 'completed' | 'failed';
  result?: unknown;
  createdAt: Date;
  completedAt?: Date;
  expiresAt?: Date;
}

export interface ExecutionRecord {
  executionId: ExecutionId;
  type: string;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  status: ExecutionState;
  context: ExecutionContext;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface RegistryEntry {
  id: string;
  type: RegistryType;
  name: string;
  role?: string;
  path: string;
  metadata: Record<string, unknown>;
  discoveredAt: Date;
}

export type RegistryType = 'agent' | 'workflow' | 'event' | 'memory' | 'command' | 'prompt' | 'template' | 'schema' | 'policy';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  components: ComponentHealth[];
  timestamp: Date;
}

export interface ComponentHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  message?: string;
  latency?: number;
}

export interface KernelConfig {
  root: string;
  config?: string;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  modules?: ModuleConfig[];
}

export interface ModuleConfig {
  name: string;
  enabled: boolean;
  options?: Record<string, unknown>;
}

export interface ExecutionReport {
  executionId: ExecutionId;
  goal?: Goal;
  plan?: Plan;
  tasks: Task[];
  artifacts: Artifact[];
  events: string[];
  memoryUpdates: string[];
  status: 'success' | 'partial' | 'failed';
  duration: number;
  timestamp: Date;
  context: ExecutionContext;
}
