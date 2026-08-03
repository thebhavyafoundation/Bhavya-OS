/**
 * @bhavya/types — Workflow Types
 *
 * Canonical workflow, plan, and goal types.
 */

/** Goal — an objective to achieve */
export interface Goal {
  id: string;
  name: string;
  description: string;
  status: GoalStatus;
  priority: Priority;
  kpis: KPI[];
  deadline?: string;
  owner?: string;
  progress: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/** A key performance indicator for a goal */
export interface KPI {
  name: string;
  target: number;
  current: number;
  unit: string;
}

/** Plan — a set of steps to achieve goals */
export interface Plan {
  id: string;
  name: string;
  description: string;
  status: PlanStatus;
  goals: Goal[];
  milestones: Milestone[];
  resources: Resource[];
  timeline: Timeline;
  dependencies: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/** A milestone in a plan */
export interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  completed: boolean;
}

/** A resource allocation */
export interface Resource {
  id: string;
  name: string;
  type: string;
  capacity: number;
  allocated: number;
}

/** Timeline */
export interface Timeline {
  startDate: string;
  endDate: string;
  phases: TimelinePhase[];
}

/** A phase in the timeline */
export interface TimelinePhase {
  name: string;
  startDate: string;
  endDate: string;
}

/** Workflow — an automated sequence of steps */
export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  status: WorkflowStatus;
  variables: Record<string, unknown>;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
}

/** Workflow trigger */
export interface WorkflowTrigger {
  type: "event" | "schedule" | "manual";
  event?: string;
  schedule?: string;
}

/** A step in a workflow */
export interface WorkflowStep {
  id: string;
  name: string;
  type: StepType;
  status: StepStatus;
  config: StepConfig;
  dependencies: string[];
  retryPolicy?: RetryPolicy;
  timeout?: number;
  onError: "fail" | "skip" | "retry";
}

/** Step configuration */
export interface StepConfig {
  capabilityId?: string;
  skillId?: string;
  agentId?: string;
  inputs?: Record<string, unknown>;
  outputs?: Record<string, unknown>;
}

/** Retry policy */
export interface RetryPolicy {
  maxAttempts: number;
  backoffMs: number;
}

// ─── Enums ────────────────────────────────────────

export type Priority = "critical" | "high" | "medium" | "low";
export type GoalStatus =
  "draft" | "active" | "completed" | "cancelled" | "failed";
export type PlanStatus =
  "draft" | "active" | "on-hold" | "completed" | "cancelled" | "failed";
export type WorkflowStatus =
  "draft" | "active" | "paused" | "completed" | "failed" | "cancelled";
export type StepType =
  "action" | "approval" | "notification" | "parallel" | "conditional";
export type StepStatus =
  "pending" | "running" | "completed" | "failed" | "skipped" | "cancelled";
