import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../lib/db';
import type { Objective, KeyResult, ObjectiveStatus, KeyResultStatus, DepartmentType } from '../lib/types';

export function createObjective(input: {
  title: string;
  description?: string;
  department?: DepartmentType;
  quarter: string;
}): Objective {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO objectives (id, title, description, department, quarter, status, progress, key_results, initiatives, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'not_started', 0, '[]', '[]', ?, ?)
  `).run(id, input.title, input.description || '', input.department || null, input.quarter, now, now);

  const item = getObjective(id);
  if (!item) throw new Error("Objective not found after insert");
  return item;
}

export function getObjective(id: string): Objective | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM objectives WHERE id = ?').get(id) as any;
  if (!row) return null;
  return mapRowToObjective(row);
}

export function listObjectives(filter?: { quarter?: string; department?: DepartmentType; status?: ObjectiveStatus; limit?: number }): Objective[] {
  const db = getDb();
  let query = 'SELECT * FROM objectives';
  const params: any[] = [];
  const conditions: string[] = [];

  if (filter?.quarter) { conditions.push('quarter = ?'); params.push(filter.quarter); }
  if (filter?.department) { conditions.push('department = ?'); params.push(filter.department); }
  if (filter?.status) { conditions.push('status = ?'); params.push(filter.status); }

  if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY created_at DESC';
  if (filter?.limit) { query += ' LIMIT ?'; params.push(filter.limit); }

  return db.prepare(query).all(...params).map(mapRowToObjective);
}

export function updateObjectiveStatus(id: string, status: ObjectiveStatus, progress: number): Objective | null {
  const db = getDb();
  db.prepare('UPDATE objectives SET status = ?, progress = ?, updated_at = ? WHERE id = ?').run(status, progress, new Date().toISOString(), id);
  return getObjective(id);
}

export function addKeyResult(objectiveId: string, input: {
  title: string;
  description?: string;
  metric: string;
  targetValue: number;
  unit: string;
}): KeyResult {
  const obj = getObjective(objectiveId);
  if (!obj) throw new Error('Objective not found');

  const kr: KeyResult = {
    id: uuidv4(),
    objectiveId,
    title: input.title,
    description: input.description || '',
    metric: input.metric,
    targetValue: input.targetValue,
    currentValue: 0,
    unit: input.unit,
    status: 'not_started',
  };

  const keyResults = [...obj.keyResults, kr];
  const db = getDb();
  db.prepare('UPDATE objectives SET key_results = ?, updated_at = ? WHERE id = ?').run(JSON.stringify(keyResults), new Date().toISOString(), objectiveId);
  return kr;
}

export function updateKeyResult(objectiveId: string, krId: string, currentValue: number): void {
  const obj = getObjective(objectiveId);
  if (!obj) return;

  const keyResults = obj.keyResults.map((kr) => {
    if (kr.id === krId) {
      const updated = { ...kr, currentValue };
      updated.status = currentValue >= kr.targetValue ? 'completed' : currentValue > 0 ? 'on_track' : 'not_started';
      return updated;
    }
    return kr;
  });

  const totalProgress = keyResults.length > 0
    ? Math.round(keyResults.reduce((sum, kr) => sum + (kr.currentValue / kr.targetValue) * 100, 0) / keyResults.length)
    : 0;

  const db = getDb();
  db.prepare('UPDATE objectives SET key_results = ?, progress = ?, updated_at = ? WHERE id = ?').run(JSON.stringify(keyResults), Math.min(totalProgress, 100), new Date().toISOString(), objectiveId);
}

export function getOKRSummary(): {
  totalObjectives: number;
  completedObjectives: number;
  onTrackObjectives: number;
  atRiskObjectives: number;
  totalKeyResults: number;
  completedKeyResults: number;
  overallProgress: number;
  byDepartment: Record<string, { count: number; progress: number }>;
} {
  const objectives = listObjectives();
  const byDepartment: Record<string, { count: number; progress: number }> = {};

  let totalProgress = 0;
  let completed = 0;
  let onTrack = 0;
  let atRisk = 0;
  let totalKR = 0;
  let completedKR = 0;

  for (const obj of objectives) {
    totalProgress += obj.progress;
    if (obj.status === 'completed') completed++;
    else if (obj.status === 'on_track') onTrack++;
    else if (obj.status === 'at_risk' || obj.status === 'behind') atRisk++;

    totalKR += obj.keyResults.length;
    completedKR += obj.keyResults.filter((kr) => kr.status === 'completed').length;

    const dept = obj.department || 'general';
    if (!byDepartment[dept]) byDepartment[dept] = { count: 0, progress: 0 };
    byDepartment[dept].count++;
    byDepartment[dept].progress += obj.progress;
  }

  for (const dept of Object.keys(byDepartment)) {
    byDepartment[dept].progress = Math.round(byDepartment[dept].progress / byDepartment[dept].count);
  }

  return {
    totalObjectives: objectives.length,
    completedObjectives: completed,
    onTrackObjectives: onTrack,
    atRiskObjectives: atRisk,
    totalKeyResults: totalKR,
    completedKeyResults: completedKR,
    overallProgress: objectives.length > 0 ? Math.round(totalProgress / objectives.length) : 0,
    byDepartment,
  };
}

function mapRowToObjective(row: any): Objective {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    department: row.department,
    quarter: row.quarter,
    status: row.status as ObjectiveStatus,
    progress: row.progress,
    keyResults: JSON.parse(row.key_results || '[]'),
    initiatives: JSON.parse(row.initiatives || '[]'),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
