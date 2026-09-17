// Contracts — Validation for every engine input
// Every engine validates its inputs before execution.

export interface ContractResult {
  valid: boolean;
  errors: string[];
}

// ─── Agent Contract ─────────────────────────────────────────────────

export function validateAgent(input: unknown): ContractResult {
  const errors: string[] = [];
  const agent = input as Record<string, unknown>;

  if (!agent.id || typeof agent.id !== "string")
    errors.push("Agent id is required and must be a string");
  if (!agent.name || typeof agent.name !== "string")
    errors.push("Agent name is required and must be a string");
  if (!agent.role || typeof agent.role !== "string")
    errors.push("Agent role is required and must be a string");
  if (!Array.isArray(agent.capabilities))
    errors.push("Agent capabilities must be an array");
  if (!Array.isArray(agent.permissions))
    errors.push("Agent permissions must be an array");

  const validStatuses = ["idle", "busy", "error", "offline"];
  if (agent.status && !validStatuses.includes(agent.status as string)) {
    errors.push(`Agent status must be one of: ${validStatuses.join(", ")}`);
  }

  return { valid: errors.length === 0, errors };
}

// ─── Workflow Contract ──────────────────────────────────────────────

export function validateWorkflow(input: unknown): ContractResult {
  const errors: string[] = [];
  const workflow = input as Record<string, unknown>;

  if (!workflow.id || typeof workflow.id !== "string")
    errors.push("Workflow id is required");
  if (!workflow.name || typeof workflow.name !== "string")
    errors.push("Workflow name is required");
  if (!Array.isArray(workflow.steps))
    errors.push("Workflow steps must be an array");

  const validStatuses = ["active", "inactive", "draft"];
  if (workflow.status && !validStatuses.includes(workflow.status as string)) {
    errors.push(`Workflow status must be one of: ${validStatuses.join(", ")}`);
  }

  // Validate each step
  if (Array.isArray(workflow.steps)) {
    workflow.steps.forEach((step: Record<string, unknown>, i: number) => {
      if (!step.name) errors.push(`Step ${i} missing name`);
      if (!step.action) errors.push(`Step ${i} missing action`);
    });
  }

  return { valid: errors.length === 0, errors };
}

// ─── Event Contract ─────────────────────────────────────────────────

export function validateEvent(input: unknown): ContractResult {
  const errors: string[] = [];
  const event = input as Record<string, unknown>;

  if (!event.type || typeof event.type !== "string")
    errors.push("Event type is required");
  if (!event.source || typeof event.source !== "string")
    errors.push("Event source is required");
  if (!event.payload || typeof event.payload !== "object")
    errors.push("Event payload must be an object");
  if (!event.timestamp) errors.push("Event timestamp is required");

  return { valid: errors.length === 0, errors };
}

// ─── Memory Contract ────────────────────────────────────────────────

export function validateMemory(input: unknown): ContractResult {
  const errors: string[] = [];
  const memory = input as Record<string, unknown>;

  if (!memory.id || typeof memory.id !== "string")
    errors.push("Memory id is required");
  if (!memory.type || typeof memory.type !== "string")
    errors.push("Memory type is required");
  if (!memory.content || typeof memory.content !== "string")
    errors.push("Memory content is required");
  if (!Array.isArray(memory.tags)) errors.push("Memory tags must be an array");

  const validTypes = [
    "project",
    "person",
    "knowledge",
    "architecture",
    "history",
    "bug",
    "lesson",
  ];
  if (memory.type && !validTypes.includes(memory.type as string)) {
    errors.push(`Memory type must be one of: ${validTypes.join(", ")}`);
  }

  return { valid: errors.length === 0, errors };
}

// ─── Goal Contract ──────────────────────────────────────────────────

export function validateGoal(input: unknown): ContractResult {
  const errors: string[] = [];
  const goal = input as Record<string, unknown>;

  if (!goal.id || typeof goal.id !== "string")
    errors.push("Goal id is required");
  if (!goal.description || typeof goal.description !== "string")
    errors.push("Goal description is required");
  if (goal.description && (goal.description as string).length < 10)
    errors.push("Goal description must be at least 10 characters");

  const validPriorities = ["critical", "high", "medium", "low"];
  if (goal.priority && !validPriorities.includes(goal.priority as string)) {
    errors.push(`Goal priority must be one of: ${validPriorities.join(", ")}`);
  }

  if (!Array.isArray(goal.constraints))
    errors.push("Goal constraints must be an array");

  return { valid: errors.length === 0, errors };
}

// ─── Task Contract ──────────────────────────────────────────────────

export function validateTask(input: unknown): ContractResult {
  const errors: string[] = [];
  const task = input as Record<string, unknown>;

  if (!task.id || typeof task.id !== "string")
    errors.push("Task id is required");
  if (!task.type || typeof task.type !== "string")
    errors.push("Task type is required");
  if (!task.goal || typeof task.goal !== "string")
    errors.push("Task goal is required");
  if (!task.input || typeof task.input !== "object")
    errors.push("Task input must be an object");

  const validStatuses = [
    "pending",
    "queued",
    "running",
    "completed",
    "failed",
    "cancelled",
  ];
  if (task.status && !validStatuses.includes(task.status as string)) {
    errors.push(`Task status must be one of: ${validStatuses.join(", ")}`);
  }

  if (!Array.isArray(task.dependencies))
    errors.push("Task dependencies must be an array");

  return { valid: errors.length === 0, errors };
}

// ─── Plan Contract ──────────────────────────────────────────────────

export function validatePlan(input: unknown): ContractResult {
  const errors: string[] = [];
  const plan = input as Record<string, unknown>;

  if (!plan.id || typeof plan.id !== "string")
    errors.push("Plan id is required");
  if (!plan.goalId || typeof plan.goalId !== "string")
    errors.push("Plan goalId is required");
  if (!Array.isArray(plan.steps)) errors.push("Plan steps must be an array");

  const validStatuses = [
    "draft",
    "approved",
    "executing",
    "completed",
    "failed",
  ];
  if (plan.status && !validStatuses.includes(plan.status as string)) {
    errors.push(`Plan status must be one of: ${validStatuses.join(", ")}`);
  }

  return { valid: errors.length === 0, errors };
}
