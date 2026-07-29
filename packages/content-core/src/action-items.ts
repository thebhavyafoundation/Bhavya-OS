import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import {
  ActionItem,
  ActionItemStatus,
  ActionItemSource,
  ActionItemStats,
  ActionItemEvent,
} from "./models";

const DATA_DIR = join(process.cwd(), "data");
const ACTIONS_FILE = join(DATA_DIR, "action-items.json");

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadActions(): ActionItem[] {
  ensureDataDir();
  if (!existsSync(ACTIONS_FILE)) {
    return [];
  }
  try {
    return JSON.parse(readFileSync(ACTIONS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveActions(actions: ActionItem[]): void {
  ensureDataDir();
  writeFileSync(ACTIONS_FILE, JSON.stringify(actions, null, 2));
}

// ── CRUD Operations ───────────────────────────────────────

export function getActionItems(): ActionItem[] {
  return loadActions();
}

export function getActionItemById(id: string): ActionItem | undefined {
  return loadActions().find((a) => a.id === id);
}

export function getActionItemsByStatus(status: ActionItemStatus): ActionItem[] {
  return loadActions().filter((a) => a.status === status);
}

export function getActionItemsBySource(source: ActionItemSource): ActionItem[] {
  return loadActions().filter((a) => a.source === source);
}

export function getActionItemsByAssignee(assignee: string): ActionItem[] {
  return loadActions().filter((a) => a.assignedTo === assignee);
}

export function getOverdueActionItems(): ActionItem[] {
  const now = new Date().toISOString();
  return loadActions().filter(
    (a) => a.dueDate < now && !["completed", "cancelled"].includes(a.status),
  );
}

export function getActionItemsDueSoon(days: number = 7): ActionItem[] {
  const now = new Date();
  const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const nowStr = now.toISOString();
  const futureStr = future.toISOString();
  return loadActions().filter(
    (a) =>
      a.dueDate >= nowStr &&
      a.dueDate <= futureStr &&
      !["completed", "cancelled"].includes(a.status),
  );
}

export function createActionItem(
  action: Omit<ActionItem, "created" | "updated">,
): ActionItem {
  const actions = loadActions();
  const newAction: ActionItem = {
    ...action,
    evidenceIds: action.evidenceIds || [],
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  };
  actions.push(newAction);
  saveActions(actions);
  return newAction;
}

export function updateActionItem(
  id: string,
  updates: Partial<ActionItem>,
): ActionItem | null {
  const actions = loadActions();
  const index = actions.findIndex((a) => a.id === id);
  if (index === -1) return null;
  actions[index] = {
    ...actions[index],
    ...updates,
    updated: new Date().toISOString(),
  };
  saveActions(actions);
  return actions[index];
}

export function advanceActionItem(
  id: string,
  toStatus: ActionItemStatus,
  actor: string,
  notes?: string,
): ActionItem | null {
  const actions = loadActions();
  const index = actions.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const action = actions[index];
  const fromStatus = action.status;

  // Valid transitions
  const validTransitions: Record<ActionItemStatus, ActionItemStatus[]> = {
    pending: ["in-progress", "cancelled"],
    "in-progress": ["completed", "cancelled", "overdue"],
    completed: [],
    cancelled: [],
    overdue: ["in-progress", "completed", "cancelled"],
  };

  if (!validTransitions[fromStatus]?.includes(toStatus)) {
    return null;
  }

  actions[index] = {
    ...action,
    status: toStatus,
    completedDate:
      toStatus === "completed"
        ? new Date().toISOString()
        : action.completedDate,
    notes: notes ? [...action.notes, `${actor}: ${notes}`] : action.notes,
    updated: new Date().toISOString(),
  };

  saveActions(actions);
  return actions[index];
}

// ── Statistics ─────────────────────────────────────────────

export function getActionItemStats(): ActionItemStats {
  const actions = loadActions();
  const now = new Date().toISOString();

  const byStatus: Record<ActionItemStatus, number> = {
    pending: 0,
    "in-progress": 0,
    completed: 0,
    cancelled: 0,
    overdue: 0,
  };

  const bySource: Record<ActionItemSource, number> = {
    resolution: 0,
    meeting: 0,
    policy: 0,
    manual: 0,
  };

  for (const action of actions) {
    byStatus[action.status]++;
    bySource[action.source]++;
  }

  const overdue = actions.filter(
    (a) => a.dueDate < now && !["completed", "cancelled"].includes(a.status),
  ).length;

  const completedActions = actions.filter((a) => a.status === "completed");
  const completionRate =
    actions.length > 0
      ? Math.round((completedActions.length / actions.length) * 100)
      : 100;

  let avgDaysToComplete = 0;
  if (completedActions.length > 0) {
    const totalTime = completedActions.reduce((sum, a) => {
      const created = new Date(a.created).getTime();
      const completed = new Date(a.completedDate || a.updated).getTime();
      return sum + (completed - created);
    }, 0);
    avgDaysToComplete = Math.round(
      totalTime / completedActions.length / (1000 * 60 * 60 * 24),
    );
  }

  return {
    total: actions.length,
    byStatus,
    bySource,
    overdue,
    completionRate,
    avgDaysToComplete,
  };
}

// ── Actions from Resolutions ──────────────────────────────

export function createActionItemsFromResolution(
  resolutionId: string,
  actions: Array<{
    title: string;
    description: string;
    assignedTo: string;
    priority: "high" | "medium" | "low";
    dueDate: string;
  }>,
): ActionItem[] {
  const createdActions: ActionItem[] = [];

  for (const action of actions) {
    const newAction = createActionItem({
      id: `action-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title: action.title,
      description: action.description,
      source: "resolution",
      sourceId: resolutionId,
      assignedTo: action.assignedTo,
      status: "pending",
      priority: action.priority,
      dueDate: action.dueDate,
      notes: [],
      dependencies: [],
      evidenceIds: [],
    });
    createdActions.push(newAction);
  }

  return createdActions;
}
