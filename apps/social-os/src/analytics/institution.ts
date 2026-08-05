import { v4 as uuidv4 } from "uuid";
import { getDb } from "../lib/db.js";
import { getAnalyticsSummary } from "../analytics/collector.js";
import type {
  InstitutionMetric,
  CampaignAnalytics,
  PlatformType,
} from "../lib/types.js";

export function saveInstitutionMetric(input: {
  name: string;
  category: InstitutionMetric["category"];
  value: number;
  unit: string;
  trend?: InstitutionMetric["trend"];
  changePercent?: number;
  period?: string;
}): InstitutionMetric {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(
    `
    INSERT INTO institution_metrics (id, name, category, value, unit, trend, change_percent, period, collected_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    id,
    input.name,
    input.category,
    input.value,
    input.unit,
    input.trend || "stable",
    input.changePercent || 0,
    input.period || "current",
    now,
  );

  return {
    id,
    name: input.name,
    category: input.category,
    value: input.value,
    unit: input.unit,
    trend: input.trend || "stable",
    changePercent: input.changePercent || 0,
    period: input.period || "current",
    collectedAt: now,
  };
}

export function getInstitutionMetrics(
  category?: InstitutionMetric["category"],
): InstitutionMetric[] {
  const db = getDb();
  let query = "SELECT * FROM institution_metrics";
  const params: any[] = [];

  if (category) {
    query += " WHERE category = ?";
    params.push(category);
  }

  query += " ORDER BY collected_at DESC LIMIT 100";

  const rows = db.prepare(query).all(...params) as any[];
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    value: r.value,
    unit: r.unit,
    trend: r.trend,
    changePercent: r.change_percent,
    period: r.period,
    collectedAt: r.collected_at,
  }));
}

export function getInstitutionPulse(): {
  trust: { score: number; trend: string; metrics: InstitutionMetric[] };
  participation: { score: number; trend: string; metrics: InstitutionMetric[] };
  growth: { score: number; trend: string; metrics: InstitutionMetric[] };
  educational: { score: number; trend: string; metrics: InstitutionMetric[] };
  mission: { score: number; trend: string; metrics: InstitutionMetric[] };
  overall: number;
} {
  const db = getDb();
  const categories = [
    "trust",
    "participation",
    "growth",
    "educational",
    "mission",
  ] as const;

  const result: any = {};
  let totalScore = 0;

  for (const cat of categories) {
    const metrics = getInstitutionMetrics(cat);
    const score =
      metrics.length > 0
        ? Math.round(
            metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length,
          )
        : 50;
    const trend = metrics.length > 0 ? metrics[0].trend : "stable";

    result[cat] = { score, trend, metrics };
    totalScore += score;
  }

  result.overall = Math.round(totalScore / categories.length);
  return result;
}

export function collectInstitutionalMetrics(): void {
  const summary = getAnalyticsSummary();

  saveInstitutionMetric({
    name: "Total Publications",
    category: "participation",
    value: summary.totalPublications,
    unit: "publications",
    trend: summary.totalPublications > 0 ? "up" : "stable",
  });

  saveInstitutionMetric({
    name: "Published Content",
    category: "participation",
    value: summary.publishedCount,
    unit: "publications",
    trend: summary.publishedCount > 0 ? "up" : "stable",
  });

  saveInstitutionMetric({
    name: "Total Impressions",
    category: "growth",
    value: summary.totalImpressions,
    unit: "impressions",
    trend: summary.totalImpressions > 1000 ? "up" : "stable",
  });

  saveInstitutionMetric({
    name: "Total Engagement",
    category: "trust",
    value: summary.totalEngagement,
    unit: "interactions",
    trend: summary.totalEngagement > 100 ? "up" : "stable",
  });

  saveInstitutionMetric({
    name: "Knowledge Package Views",
    category: "educational",
    value: 0,
    unit: "views",
    trend: "stable",
  });

  saveInstitutionMetric({
    name: "Community Contributors",
    category: "participation",
    value: 0,
    unit: "contributors",
    trend: "stable",
  });

  saveInstitutionMetric({
    name: "GitHub Stars",
    category: "growth",
    value: 0,
    unit: "stars",
    trend: "stable",
  });

  saveInstitutionMetric({
    name: "Newsletter Subscribers",
    category: "growth",
    value: 0,
    unit: "subscribers",
    trend: "stable",
  });

  saveInstitutionMetric({
    name: "Student Conversion Rate",
    category: "educational",
    value: 0,
    unit: "%",
    trend: "stable",
  });

  saveInstitutionMetric({
    name: "Trust Score",
    category: "trust",
    value: 75,
    unit: "score",
    trend: "up",
  });
}

export function getMissionMetrics(): {
  trust: number;
  participation: number;
  contributors: number;
  mentors: number;
  volunteers: number;
  institutionGrowth: number;
} {
  const metrics = getInstitutionMetrics();
  const trust = metrics.find((m) => m.name === "Trust Score")?.value || 75;
  const participation =
    metrics.find((m) => m.name === "Total Publications")?.value || 0;

  return {
    trust,
    participation,
    contributors:
      metrics.find((m) => m.name === "Community Contributors")?.value || 0,
    mentors: 0,
    volunteers: 0,
    institutionGrowth:
      metrics.find((m) => m.name === "Total Impressions")?.value || 0,
  };
}
