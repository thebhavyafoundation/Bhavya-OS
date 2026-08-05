import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../lib/db';
import { getOKRSummary } from '../okr/engine';
import { getRiskSummary, listRisks } from '../lib/risks';
import { listActionItems } from '../lib/actions';
import { getOperationalHealth } from '../lib/system-health';
import { getEventSummary } from '../intelligence/events';
import { getKPIs } from '../intelligence/kpis';
import type { WeeklyReview } from '../lib/types';

export function generateWeeklyReview(): WeeklyReview {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  const weekStart = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const weekEnd = new Date().toISOString().split('T')[0];

  const okrSummary = getOKRSummary();
  const riskSummary = getRiskSummary();
  const risks = listRisks({ status: 'open' });
  const actionItems = listActionItems({ status: 'pending' });
  const health = getOperationalHealth();
  const eventSummary = getEventSummary();
  const kpis = getKPIs();

  const summary = {
    knowledgeProduction: `OKR progress: ${okrSummary.overallProgress}%. ${okrSummary.completedObjectives} objectives completed.`,
    publishing: `${eventSummary.total} events tracked. ${eventSummary.unprocessed} unprocessed.`,
    community: `${riskSummary.open} open risks. ${riskSummary.critical} critical.`,
    technical: `System health: ${health.overall}. ${health.systems.filter((s) => s.status === 'healthy').length}/${health.systems.length} systems healthy.`,
    mission: `${okrSummary.onTrackObjectives} objectives on track. ${okrSummary.atRiskObjectives} at risk.`,
  };

  const nextWeekPlan = [
    'Review and update OKR progress',
    'Process unprocessed institutional events',
    'Address critical and high-severity risks',
    'Complete pending action items',
    'Collect system health metrics',
  ];

  const review: WeeklyReview = {
    id,
    weekStart,
    weekEnd,
    period: 'weekly',
    summary,
    metrics: kpis,
    risks,
    actionItems,
    nextWeekPlan,
    status: 'draft',
    createdAt: now,
  };

  db.prepare(`
    INSERT INTO weekly_reviews (id, week_start, week_end, period, summary, metrics, risks, action_items, next_week_plan, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?)
  `).run(id, weekStart, weekEnd, 'weekly', JSON.stringify(summary), JSON.stringify(kpis), JSON.stringify(risks), JSON.stringify(actionItems), JSON.stringify(nextWeekPlan), now);

  return review;
}

export function getWeeklyReviews(limit: number = 10): WeeklyReview[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM weekly_reviews ORDER BY created_at DESC LIMIT ?').all(limit) as any[];
  return rows.map(mapRowToReview);
}

export function getLatestReview(): WeeklyReview | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM weekly_reviews ORDER BY created_at DESC LIMIT 1').get() as any;
  if (!row) return null;
  return mapRowToReview(row);
}

function mapRowToReview(row: any): WeeklyReview {
  return {
    id: row.id,
    weekStart: row.week_start,
    weekEnd: row.week_end,
    period: row.period,
    summary: JSON.parse(row.summary || '{}'),
    metrics: JSON.parse(row.metrics || '[]'),
    risks: JSON.parse(row.risks || '[]'),
    actionItems: JSON.parse(row.action_items || '[]'),
    nextWeekPlan: JSON.parse(row.next_week_plan || '[]'),
    status: row.status,
    createdAt: row.created_at,
  };
}
