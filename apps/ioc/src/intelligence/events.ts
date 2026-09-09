import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../lib/db';
import type { InstitutionEvent, SystemName } from '../lib/types';

export function emitInstitutionEvent(type: string, source: SystemName, payload: Record<string, any>): InstitutionEvent {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO institution_events (id, type, source, payload, created_at, aggregated)
    VALUES (?, ?, ?, ?, ?, 0)
  `).run(id, type, source, JSON.stringify(payload), now);

  return { id, type, source, payload, createdAt: now, aggregated: false };
}

export function getUnprocessedEvents(): InstitutionEvent[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM institution_events WHERE aggregated = 0 ORDER BY created_at ASC LIMIT 500').all() as any[];
  return rows.map(mapRowToEvent);
}

export function markEventsAggregated(ids: string[]): void {
  const db = getDb();
  const stmt = db.prepare('UPDATE institution_events SET aggregated = 1 WHERE id = ?');
  for (const id of ids) stmt.run(id);
}

export function getRecentEvents(limit: number = 50): InstitutionEvent[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM institution_events ORDER BY created_at DESC LIMIT ?').all(limit) as any[];
  return rows.map(mapRowToEvent);
}

export function getEventsBySource(source: SystemName, limit: number = 50): InstitutionEvent[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM institution_events WHERE source = ? ORDER BY created_at DESC LIMIT ?').all(source, limit) as any[];
  return rows.map(mapRowToEvent);
}

export function getEventSummary(): {
  total: number;
  unprocessed: number;
  bySource: Record<string, number>;
  byType: Record<string, number>;
} {
  const db = getDb();
  const total = (db.prepare('SELECT COUNT(*) as c FROM institution_events').get() as any).c;
  const unprocessed = (db.prepare('SELECT COUNT(*) as c FROM institution_events WHERE aggregated = 0').get() as any).c;

  const bySourceRows = db.prepare('SELECT source, COUNT(*) as c FROM institution_events GROUP BY source').all() as any[];
  const bySource: Record<string, number> = {};
  for (const row of bySourceRows) bySource[row.source] = row.c;

  const byTypeRows = db.prepare('SELECT type, COUNT(*) as c FROM institution_events GROUP BY type').all() as any[];
  const byType: Record<string, number> = {};
  for (const row of byTypeRows) byType[row.type] = row.c;

  return { total, unprocessed, bySource, byType };
}

function mapRowToEvent(row: any): InstitutionEvent {
  return {
    id: row.id,
    type: row.type,
    source: row.source as SystemName,
    payload: JSON.parse(row.payload || '{}'),
    createdAt: row.created_at,
    aggregated: row.aggregated === 1,
  };
}
