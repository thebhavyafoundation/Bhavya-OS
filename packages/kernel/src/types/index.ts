// Bhavya Runtime Protocol (BRP) Types
// Every engine understands these types.

// ─── Core Identifiers ───────────────────────────────────────────────

export type AgentId = string;
export type TaskId = string;
export type WorkflowId = string;
export type EventId = string;
export type MemoryId = string;
export type GoalId = string;
export type PlanId = string;
export type RegistryId = string;
export type ExecutionId = string;
export type CorrelationId = string;

// ─── Execution Context ──────────────────────────────────────────────
// Shared context across all events, tasks, workflows, and memory updates.
// Makes debugging and observability possible.

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

// ─── Idempotency ────────────────────────────────────────────────────
// Tracks what has already been executed to prevent duplicate work.

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

// ─── Agent ──────────────────────────────────────────────────────────

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

export type AgentStatus = 'idle' | 'busy' | 'error' | 'offline';

export interface Capability {
  name: string;
  description: string;
  inputs: Schema[];
  outputs: Schema[];
}

// ─── Task ───────────────────────────────────────────────────────────

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

export type TaskStatus = 'pending' | 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

// ─── Workflow ───────────────────────────────────────────────────────

export interface Workflow {
  id: WorkflowId;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  status: WorkflowStatus;
}

export type WorkflowStatus = 'active' | 'inactive' | 'draft';

export interface WorkflowTrigger {
  type: 'manual' | 'event' | 'schedule' | 'webhook';
  event?: string;
  schedule?: string;
}

export interface WorkflowStep {
  name: string;
  action: string;
  agent?: AgentId;
  inputs?: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  onError?: 'continue' | 'stop' | 'retry';
  idempotencyKey?: string;
}

// ─── Event ──────────────────────────────────────────────────────────

export interface Event {
  id: EventId;
  type: string;
  source: string;
  payload: Record<string, unknown>;
  timestamp: Date;
  metadata: Record<string, unknown>;
  context?: ExecutionContext;
}

export type EventHandler = (event: Event) => Promise<void>;

// ─── Memory ─────────────────────────────────────────────────────────

export interface MemoryEntry {
  id: MemoryId;
  type: MemoryType;
  content: string;
  context?: string;
  source?: string;
  confidence?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export type MemoryType = 'project' | 'person' | 'knowledge' | 'architecture' | 'history' | 'bug' | 'lesson';

// ─── Goal & Plan (BRP) ─────────────────────────────────────────────

export interface Goal {
  id: GoalId;
  description: string;
  priority: Priority;
  deadline?: Date;
  constraints: string[];
  metadata: Record<string, unknown>;
}

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface Plan {
  id: PlanId;
  goalId: GoalId;
  steps: PlanStep[];
  status: PlanStatus;
  context?: ExecutionContext;
  createdAt: Date;
}

export type PlanStatus = 'draft' | 'approved' | 'executing' | 'completed' | 'failed';

export interface PlanStep {
  name: string;
  task: Task;
  dependencies: number[];
  estimatedDuration?: number;
}

// ─── Registry ───────────────────────────────────────────────────────

export interface RegistryEntry {
  id: RegistryId;
  type: RegistryType;
  name: string;
  path: string;
  metadata: Record<string, unknown>;
  discoveredAt: Date;
}

export type RegistryType = 'agent' | 'workflow' | 'event' | 'memory' | 'command' | 'prompt' | 'template' | 'schema' | 'policy';

// ─── Permission ─────────────────────────────────────────────────────

export interface Permission {
  resource: string;
  actions: string[];
  conditions?: Record<string, unknown>;
}

// ─── Schema (for validation) ────────────────────────────────────────

export interface Schema {
  type: string;
  properties?: Record<string, Schema>;
  required?: string[];
  description?: string;
}

// ─── Health ─────────────────────────────────────────────────────────

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

// ─── Kernel Configuration ───────────────────────────────────────────

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

// ─── Artifact (tangible output) ─────────────────────────────────────

export interface Artifact {
  path: string;
  action: 'created' | 'updated' | 'deleted';
  content?: string;
  metadata: Record<string, unknown>;
}

// ─── Execution Report ───────────────────────────────────────────────

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
