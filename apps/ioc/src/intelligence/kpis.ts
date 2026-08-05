import { getDb } from '../lib/db';
import { getOKRSummary } from '../okr/engine';
import { getRiskSummary } from '../lib/risks';
import { listActionItems } from '../lib/actions';
import { getOperationalHealth } from '../lib/system-health';
import { getEventSummary } from '../intelligence/events';
import type { InstitutionKPI, SystemName } from '../lib/types';
import { v4 as uuidv4 } from 'uuid';

export function saveKPI(input: {
  name: string;
  category: InstitutionKPI['category'];
  value: number;
  unit: string;
  target?: number;
  trend?: InstitutionKPI['trend'];
  changePercent?: number;
  period?: string;
  source: SystemName;
}): InstitutionKPI {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO institution_kpis (id, name, category, value, unit, target, trend, change_percent, period, source, collected_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, input.name, input.category, input.value, input.unit, input.target || null, input.trend || 'stable', input.changePercent || 0, input.period || 'current', input.source, now);

  return {
    id,
    name: input.name,
    category: input.category,
    value: input.value,
    unit: input.unit,
    target: input.target,
    trend: input.trend || 'stable',
    changePercent: input.changePercent || 0,
    period: input.period || 'current',
    source: input.source,
    collectedAt: now,
  };
}

export function getKPIs(category?: InstitutionKPI['category']): InstitutionKPI[] {
  const db = getDb();
  let query = 'SELECT * FROM institution_kpis';
  const params: any[] = [];

  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  query += ' ORDER BY collected_at DESC LIMIT 100';

  const rows = db.prepare(query).all(...params) as any[];
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    value: r.value,
    unit: r.unit,
    target: r.target,
    trend: r.trend,
    changePercent: r.change_percent,
    period: r.period,
    source: r.source,
    collectedAt: r.collected_at,
  }));
}

export function getInstitutionalIntelligence(): {
  okrSummary: ReturnType<typeof getOKRSummary>;
  riskSummary: ReturnType<typeof getRiskSummary>;
  pendingActions: number;
  systemHealth: ReturnType<typeof getOperationalHealth>;
  eventSummary: ReturnType<typeof getEventSummary>;
  topOpportunities: string[];
  criticalRisks: string[];
  blockedWork: string[];
  missionDrift: string[];
  communityNeeds: string[];
  curriculumGaps: string[];
  publishingGaps: string[];
} {
  const okrSummary = getOKRSummary();
  const riskSummary = getRiskSummary();
  const pendingActions = listActionItems({ status: 'pending' }).length;
  const systemHealth = getOperationalHealth();
  const eventSummary = getEventSummary();

  const topOpportunities: string[] = [];
  const criticalRisks: string[] = [];
  const blockedWork: string[] = [];
  const missionDrift: string[] = [];
  const communityNeeds: string[] = [];
  const curriculumGaps: string[] = [];
  const publishingGaps: string[] = [];

  if (okrSummary.overallProgress > 50) topOpportunities.push('OKR progress above 50% — accelerate remaining key results');
  if (systemHealth.overall === 'healthy') topOpportunities.push('All systems operational — increase publishing cadence');

  if (riskSummary.critical > 0) criticalRisks.push(`${riskSummary.critical} critical risks require immediate attention`);
  if (riskSummary.high > 0) criticalRisks.push(`${riskSummary.high} high-severity risks need mitigation`);

  if (pendingActions > 10) blockedWork.push(`${pendingActions} pending action items may block progress`);

  if (okrSummary.atRiskObjectives > 0) missionDrift.push(`${okrSummary.atRiskObjectives} objectives at risk of not being achieved`);

  const kpis = getKPIs();
  const communityKPIs = kpis.filter((k) => k.category === 'community');
  if (communityKPIs.length === 0 || communityKPIs.every((k) => k.value === 0)) {
    communityNeeds.push('No community metrics collected — establish feedback channels');
  }

  return {
    okrSummary,
    riskSummary,
    pendingActions,
    systemHealth,
    eventSummary,
    topOpportunities,
    criticalRisks,
    blockedWork,
    missionDrift,
    communityNeeds,
    curriculumGaps,
    publishingGaps,
  };
}
