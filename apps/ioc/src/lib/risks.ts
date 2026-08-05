import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../lib/db';
import type { Risk, RiskSeverity, RiskStatus } from '../lib/types';

export function createRisk(input: {
  title: string;
  description?: string;
  severity?: RiskSeverity;
  department?: string;
  category?: string;
  mitigationPlan?: string;
  mitigation?: string;
  owner?: string;
}): Risk {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO risks (id, title, description, severity, status, category, mitigation, owner, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'open', ?, ?, ?, ?, ?)
  `).run(id, input.title, input.description || '', input.severity || 'medium', input.category || input.department || '', input.mitigationPlan || input.mitigation || null, input.owner || null, now, now);

  return getRisk(id)!;
}

export function getRisk(id: string): Risk | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM risks WHERE id = ?').get(id) as any;
  if (!row) return null;
  return mapRowToRisk(row);
}

export function listRisks(filter?: { severity?: RiskSeverity; status?: RiskStatus }): Risk[] {
  const db = getDb();
  let query = 'SELECT * FROM risks';
  const params: any[] = [];
  const conditions: string[] = [];

  if (filter?.severity) { conditions.push('severity = ?'); params.push(filter.severity); }
  if (filter?.status) { conditions.push('status = ?'); params.push(filter.status); }

  if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY created_at DESC';

  return db.prepare(query).all(...params).map(mapRowToRisk);
}

export function updateRiskStatus(id: string, status: string, mitigationProgress?: number): Risk | null {
  const db = getDb();
  db.prepare('UPDATE risks SET status = ?, updated_at = ? WHERE id = ?').run(status, new Date().toISOString(), id);
  return getRisk(id);
}

export function getRiskSummary(): {
  total: number;
  open: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  mitigated: number;
  closed: number;
} {
  const db = getDb();
  const total = (db.prepare('SELECT COUNT(*) as c FROM risks').get() as any).c;
  const open = (db.prepare("SELECT COUNT(*) as c FROM risks WHERE status = 'open'").get() as any).c;
  const critical = (db.prepare("SELECT COUNT(*) as c FROM risks WHERE severity = 'critical' AND status = 'open'").get() as any).c;
  const high = (db.prepare("SELECT COUNT(*) as c FROM risks WHERE severity = 'high' AND status = 'open'").get() as any).c;
  const medium = (db.prepare("SELECT COUNT(*) as c FROM risks WHERE severity = 'medium' AND status = 'open'").get() as any).c;
  const low = (db.prepare("SELECT COUNT(*) as c FROM risks WHERE severity = 'low' AND status = 'open'").get() as any).c;
  const mitigated = (db.prepare("SELECT COUNT(*) as c FROM risks WHERE status = 'mitigated'").get() as any).c;
  const closed = (db.prepare("SELECT COUNT(*) as c FROM risks WHERE status = 'closed'").get() as any).c;

  return { total, open, critical, high, medium, low, mitigated, closed };
}

function mapRowToRisk(row: any): Risk {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    severity: row.severity as RiskSeverity,
    status: row.status as RiskStatus,
    category: row.category,
    mitigation: row.mitigation,
    owner: row.owner,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
