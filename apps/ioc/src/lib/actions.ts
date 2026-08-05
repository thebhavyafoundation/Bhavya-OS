import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../lib/db';
import type { ActionItem } from '../lib/types';

export function createActionItem(input: {
  title: string;
  description?: string;
  type?: string;
  priority?: ActionItem['priority'];
  owner?: string;
  dueDate?: string;
  linkedRiskId?: string;
  linkedObjectiveId?: string;
}): ActionItem {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO action_items (id, title, description, assignee, due_date, priority, status, related_objective_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)
  `).run(id, input.title, input.description || '', input.owner || null, input.dueDate || null, input.priority || 'normal', input.linkedObjectiveId || null, now);

  return getActionItem(id)!;
}

export function getActionItem(id: string): ActionItem | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM action_items WHERE id = ?').get(id) as any;
  if (!row) return null;
  return mapRowToActionItem(row);
}

export function listActionItems(filter?: { status?: string; priority?: string; assignee?: string }): ActionItem[] {
  const db = getDb();
  let query = 'SELECT * FROM action_items';
  const params: any[] = [];
  const conditions: string[] = [];

  if (filter?.status) { conditions.push('status = ?'); params.push(filter.status); }
  if (filter?.priority) { conditions.push('priority = ?'); params.push(filter.priority); }
  if (filter?.assignee) { conditions.push('assignee = ?'); params.push(filter.assignee); }

  if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY created_at DESC';

  return db.prepare(query).all(...params).map(mapRowToActionItem);
}

export function updateActionStatus(id: string, status: string): ActionItem | null {
  const db = getDb();
  db.prepare('UPDATE action_items SET status = ? WHERE id = ?').run(status, id);
  return getActionItem(id);
}

export function completeAction(id: string, result?: string): ActionItem | null {
  const db = getDb();
  db.prepare('UPDATE action_items SET status = ? WHERE id = ?').run('completed', id);
  return getActionItem(id);
}

export function getActionSummary(): {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  byPriority: Record<string, number>;
} {
  const db = getDb();
  const total = (db.prepare('SELECT COUNT(*) as c FROM action_items').get() as any).c;
  const pending = (db.prepare("SELECT COUNT(*) as c FROM action_items WHERE status = 'pending'").get() as any).c;
  const inProgress = (db.prepare("SELECT COUNT(*) as c FROM action_items WHERE status = 'in-progress'").get() as any).c;
  const completed = (db.prepare("SELECT COUNT(*) as c FROM action_items WHERE status = 'completed'").get() as any).c;
  const overdue = (db.prepare("SELECT COUNT(*) as c FROM action_items WHERE status = 'pending' AND due_date < date('now')").get() as any).c;

  const byPriorityRows = db.prepare('SELECT priority, COUNT(*) as c FROM action_items GROUP BY priority').all() as any[];
  const byPriority: Record<string, number> = {};
  for (const row of byPriorityRows) byPriority[row.priority] = row.c;

  return { total, pending, inProgress, completed, overdue, byPriority };
}

function mapRowToActionItem(row: any): ActionItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    assignee: row.assignee,
    dueDate: row.due_date,
    priority: row.priority,
    status: row.status,
    relatedObjectiveId: row.related_objective_id,
    createdAt: row.created_at,
  };
}
