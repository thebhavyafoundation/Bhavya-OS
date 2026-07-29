import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

// ── Automated Stewardship Types ────────────────────────────

export type TaskType =
  | "policy-review"
  | "annual-report"
  | "board-agenda"
  | "compliance-reminder"
  | "knowledge-review"
  | "broken-reference-detection"
  | "archive-recommendation"
  | "succession-review"
  | "pattern-validation"
  | "playbook-update";

export type StewardshipTaskStatus = "scheduled" | "pending" | "in-progress" | "completed" | "overdue" | "cancelled";

export type RecurrencePattern = "daily" | "weekly" | "monthly" | "quarterly" | "annually" | "custom";

export interface ScheduledTask {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  status: StewardshipTaskStatus;
  assignedTo?: string;
  scheduledDate: string;
  dueDate?: string;
  completedDate?: string;
  recurrence: RecurrencePattern;
  customRecurrence?: string;
  lastRun?: string;
  nextRun: string;
  dependencies: string[];
  metadata: Record<string, unknown>;
  created: string;
  lastUpdated: string;
}

export interface TaskExecution {
  id: string;
  taskId: string;
  startTime: string;
  endTime?: string;
  status: "running" | "success" | "failure" | "partial";
  output?: string;
  errors?: string[];
  metrics?: Record<string, number>;
}

export interface StewardshipStats {
  totalTasks: number;
  byStatus: Record<StewardshipTaskStatus, number>;
  byType: Record<TaskType, number>;
  overdueCount: number;
  upcomingCount: number;
  completionRate: number;
}

// ── Stewardship Storage ────────────────────────────────────

const DATA_DIR = join(import.meta.dirname, "..", "..", "data");
const TASKS_FILE = join(DATA_DIR, "scheduled-tasks.json");
const EXECUTIONS_FILE = join(DATA_DIR, "task-executions.json");

function readTasksData(): ScheduledTask[] {
  if (!existsSync(TASKS_FILE)) {
    return [];
  }
  return JSON.parse(readFileSync(TASKS_FILE, "utf-8")) as ScheduledTask[];
}

function writeTasksData(data: ScheduledTask[]): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2));
}

function readExecutionsData(): TaskExecution[] {
  if (!existsSync(EXECUTIONS_FILE)) {
    return [];
  }
  return JSON.parse(readFileSync(EXECUTIONS_FILE, "utf-8")) as TaskExecution[];
}

function writeExecutionsData(data: TaskExecution[]): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(EXECUTIONS_FILE, JSON.stringify(data, null, 2));
}

// ── Scheduled Task CRUD ────────────────────────────────────

export function createScheduledTask(
  type: TaskType,
  title: string,
  description: string,
  scheduledDate: string,
  recurrence: RecurrencePattern = "monthly",
  assignedTo?: string,
  dueDate?: string,
  metadata: Record<string, unknown> = {}
): ScheduledTask {
  const tasks = readTasksData();
  const now = new Date().toISOString();

  const task: ScheduledTask = {
    id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    type,
    title,
    description,
    status: "scheduled",
    assignedTo,
    scheduledDate,
    dueDate,
    recurrence,
    nextRun: scheduledDate,
    dependencies: [],
    metadata,
    created: now,
    lastUpdated: now,
  };

  tasks.push(task);
  writeTasksData(tasks);
  return task;
}

export function getScheduledTasks(): ScheduledTask[] {
  return readTasksData();
}

export function getScheduledTaskById(id: string): ScheduledTask | undefined {
  return readTasksData().find((t) => t.id === id);
}

export function getScheduledTasksByType(type: TaskType): ScheduledTask[] {
  return readTasksData().filter((t) => t.type === type);
}

export function getScheduledTasksByStatus(status: StewardshipTaskStatus): ScheduledTask[] {
  return readTasksData().filter((t) => t.status === status);
}

export function updateScheduledTask(
  id: string,
  updates: Partial<Omit<ScheduledTask, "id" | "created">>
): ScheduledTask {
  const tasks = readTasksData();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error(`Scheduled task not found: ${id}`);
  }

  tasks[index] = {
    ...tasks[index],
    ...updates,
    lastUpdated: new Date().toISOString(),
  };

  writeTasksData(tasks);
  return tasks[index];
}

export function completeScheduledTask(id: string, output?: string): ScheduledTask {
  const task = updateScheduledTask(id, {
    status: "completed",
    completedDate: new Date().toISOString(),
    lastRun: new Date().toISOString(),
  });

  // Calculate next run based on recurrence
  const nextRun = computeNextRun(task.scheduledDate, task.recurrence);
  return updateScheduledTask(id, { nextRun });
}

export function cancelScheduledTask(id: string): ScheduledTask {
  return updateScheduledTask(id, { status: "cancelled" });
}

// ── Task Execution Tracking ────────────────────────────────

export function startTaskExecution(taskId: string): TaskExecution {
  const executions = readExecutionsData();
  const now = new Date().toISOString();

  const execution: TaskExecution = {
    id: `exec-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    taskId,
    startTime: now,
    status: "running",
  };

  executions.push(execution);
  writeExecutionsData(executions);

  // Update task status
  updateScheduledTask(taskId, { status: "in-progress" });

  return execution;
}

export function completeTaskExecution(
  executionId: string,
  status: "success" | "failure" | "partial",
  output?: string,
  errors?: string[],
  metrics?: Record<string, number>
): TaskExecution {
  const executions = readExecutionsData();
  const index = executions.findIndex((e) => e.id === executionId);
  if (index === -1) {
    throw new Error(`Task execution not found: ${executionId}`);
  }

  executions[index] = {
    ...executions[index],
    endTime: new Date().toISOString(),
    status,
    output,
    errors,
    metrics,
  };

  writeExecutionsData(executions);

  // Update task status based on execution
  const task = getScheduledTaskById(executions[index].taskId);
  if (task) {
    if (status === "success") {
      completeScheduledTask(task.id, output);
    } else if (status === "failure") {
      updateScheduledTask(task.id, { status: "overdue" });
    }
  }

  return executions[index];
}

export function getExecutionsByTask(taskId: string): TaskExecution[] {
  return readExecutionsData().filter((e) => e.taskId === taskId);
}

// ── Stewardship Statistics ─────────────────────────────────

export function getStewardshipStats(): StewardshipStats {
  const tasks = readTasksData();
  const now = new Date();

  const byStatus: Record<StewardshipTaskStatus, number> = {
    scheduled: 0,
    pending: 0,
    "in-progress": 0,
    completed: 0,
    overdue: 0,
    cancelled: 0,
  };

  const byType: Record<TaskType, number> = {
    "policy-review": 0,
    "annual-report": 0,
    "board-agenda": 0,
    "compliance-reminder": 0,
    "knowledge-review": 0,
    "broken-reference-detection": 0,
    "archive-recommendation": 0,
    "succession-review": 0,
    "pattern-validation": 0,
    "playbook-update": 0,
  };

  let overdueCount = 0;
  let upcomingCount = 0;

  tasks.forEach((task) => {
    byStatus[task.status]++;
    byType[task.type]++;

    if (task.status === "overdue" || (task.dueDate && new Date(task.dueDate) < now)) {
      overdueCount++;
    }

    if (task.status === "scheduled" || task.status === "pending") {
      const nextRun = new Date(task.nextRun);
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      if (nextRun <= weekFromNow) {
        upcomingCount++;
      }
    }
  });

  const completedCount = byStatus.completed;
  const totalCount = tasks.length - byStatus.cancelled;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    totalTasks: tasks.length,
    byStatus,
    byType,
    overdueCount,
    upcomingCount,
    completionRate,
  };
}

// ── Overdue and Upcoming Tasks ─────────────────────────────

export function getOverdueTasks(): ScheduledTask[] {
  const now = new Date();
  return readTasksData().filter((task) => {
    if (task.status === "completed" || task.status === "cancelled") {
      return false;
    }
    if (task.dueDate && new Date(task.dueDate) < now) {
      return true;
    }
    if (task.status === "overdue") {
      return true;
    }
    return false;
  });
}

export function getUpcomingTasks(days: number = 7): ScheduledTask[] {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return readTasksData().filter((task) => {
    if (task.status === "completed" || task.status === "cancelled") {
      return false;
    }
    const nextRun = new Date(task.nextRun);
    return nextRun >= now && nextRun <= futureDate;
  });
}

// ── Helper Functions ───────────────────────────────────────

function computeNextRun(from: string, recurrence: RecurrencePattern): string {
  const date = new Date(from);
  switch (recurrence) {
    case "daily":
      date.setDate(date.getDate() + 1);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "quarterly":
      date.setMonth(date.getMonth() + 3);
      break;
    case "annually":
      date.setFullYear(date.getFullYear() + 1);
      break;
    case "custom":
      // For custom recurrence, just add a month as fallback
      date.setMonth(date.getMonth() + 1);
      break;
  }
  return date.toISOString();
}

// ── Default Stewardship Tasks ──────────────────────────────

export function createDefaultStewardshipTasks(): ScheduledTask[] {
  const tasks: ScheduledTask[] = [];
  const now = new Date().toISOString();

  // Policy Review - Quarterly
  tasks.push(
    createScheduledTask(
      "policy-review",
      "Quarterly Policy Review",
      "Review all active policies for continued relevance and compliance",
      new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      "quarterly",
      undefined,
      new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    )
  );

  // Annual Report - Annually
  tasks.push(
    createScheduledTask(
      "annual-report",
      "Annual Institutional Report",
      "Generate comprehensive annual report across all domains",
      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      "annually",
      undefined,
      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    )
  );

  // Knowledge Review - Monthly
  tasks.push(
    createScheduledTask(
      "knowledge-review",
      "Monthly Knowledge Review",
      "Review institutional knowledge for accuracy and relevance",
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      "monthly",
      undefined,
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    )
  );

  // Broken Reference Detection - Weekly
  tasks.push(
    createScheduledTask(
      "broken-reference-detection",
      "Weekly Reference Check",
      "Detect broken references and links in institutional knowledge",
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      "weekly",
      undefined,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    )
  );

  // Succession Review - Quarterly
  tasks.push(
    createScheduledTask(
      "succession-review",
      "Quarterly Succession Review",
      "Review succession plans and readiness for key roles",
      new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      "quarterly",
      undefined,
      new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    )
  );

  return tasks;
}
