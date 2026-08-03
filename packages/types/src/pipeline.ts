/**
 * @bhavya/types — Pipeline Types
 *
 * Canonical types for pipeline execution and orchestration.
 */

/** Pipeline execution record */
export interface PipelineExecution {
  id: string;
  goal: string;
  status: PipelineStatus;
  koId: string;
  packageId?: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  totalDurationMs?: number;
  error?: string;
  nodeResults: NodeResult[];
  events: PipelineEvent[];
  metrics?: PipelineMetrics;
  trace?: TraceSpan[];
  createdAt: string;
  updatedAt: string;
}

/** Result of a single pipeline node */
export interface NodeResult {
  nodeId: string;
  capabilityId: string;
  status: NodeStatus;
  output?: unknown;
  error?: string;
  durationMs?: number;
}

/** An event during pipeline execution */
export interface PipelineEvent {
  type: string;
  nodeId?: string;
  timestamp: string;
  data?: unknown;
}

/** Pipeline execution metrics */
export interface PipelineMetrics {
  totalNodes: number;
  completed: number;
  failed: number;
  parallelized: number;
  totalDurationMs: number;
}

/** A trace span for observability */
export interface TraceSpan {
  id: string;
  parentId?: string;
  name: string;
  startTime: string;
  endTime?: string;
  attributes: Record<string, unknown>;
}

// ─── Enums ────────────────────────────────────────

export type PipelineStatus =
  "pending" | "running" | "completed" | "failed" | "cancelled";
export type NodeStatus =
  "pending" | "running" | "completed" | "failed" | "skipped" | "cancelled";
