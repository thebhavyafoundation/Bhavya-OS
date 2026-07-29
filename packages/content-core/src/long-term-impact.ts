import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

// ── Long-Term Impact Types ─────────────────────────────────

export interface ImpactMetric {
  id: string;
  name: string;
  domain: "forest" | "heritage" | "research" | "volunteer" | "governance" | "knowledge" | "cross-domain";
  category: "environmental" | "social" | "governance" | "knowledge" | "operational";
  unit: string;
  description: string;
  created: string;
}

export interface ImpactRecord {
  id: string;
  metricId: string;
  value: number;
  date: string;
  period: "monthly" | "quarterly" | "annually";
  source: string;
  notes?: string;
  created: string;
}

export interface ImpactTrend {
  metricId: string;
  metricName: string;
  domain: string;
  currentValue: number;
  previousValue: number;
  change: number;
  changePercent: number;
  direction: "improving" | "declining" | "stable";
  timeframe: string;
}

export interface LongTermImpactSummary {
  totalMetrics: number;
  totalRecords: number;
  byDomain: Record<string, number>;
  byCategory: Record<string, number>;
  improvingTrends: number;
  decliningTrends: number;
  stableTrends: number;
}

export interface MultiYearComparison {
  metricId: string;
  metricName: string;
  domain: string;
  years: Array<{
    year: number;
    value: number;
  }>;
  overallTrend: "improving" | "declining" | "stable";
  totalChange: number;
  averageAnnualChange: number;
}

// ── Long-Term Impact Storage ───────────────────────────────

const DATA_DIR = join(import.meta.dirname, "..", "..", "data");
const METRICS_FILE = join(DATA_DIR, "impact-metrics.json");
const RECORDS_FILE = join(DATA_DIR, "impact-records.json");

function readMetricsData(): ImpactMetric[] {
  if (!existsSync(METRICS_FILE)) {
    return [];
  }
  return JSON.parse(readFileSync(METRICS_FILE, "utf-8")) as ImpactMetric[];
}

function writeMetricsData(data: ImpactMetric[]): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(METRICS_FILE, JSON.stringify(data, null, 2));
}

function readRecordsData(): ImpactRecord[] {
  if (!existsSync(RECORDS_FILE)) {
    return [];
  }
  return JSON.parse(readFileSync(RECORDS_FILE, "utf-8")) as ImpactRecord[];
}

function writeRecordsData(data: ImpactRecord[]): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(RECORDS_FILE, JSON.stringify(data, null, 2));
}

// ── Impact Metric CRUD ─────────────────────────────────────

export function createImpactMetric(
  name: string,
  domain: ImpactMetric["domain"],
  category: ImpactMetric["category"],
  unit: string,
  description: string
): ImpactMetric {
  const metrics = readMetricsData();
  const now = new Date().toISOString();

  const metric: ImpactMetric = {
    id: `metric-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name,
    domain,
    category,
    unit,
    description,
    created: now,
  };

  metrics.push(metric);
  writeMetricsData(metrics);
  return metric;
}

export function getImpactMetrics(): ImpactMetric[] {
  return readMetricsData();
}

export function getImpactMetricById(id: string): ImpactMetric | undefined {
  return readMetricsData().find((m) => m.id === id);
}

export function getImpactMetricsByDomain(domain: ImpactMetric["domain"]): ImpactMetric[] {
  return readMetricsData().filter((m) => m.domain === domain);
}

export function getImpactMetricsByCategory(category: ImpactMetric["category"]): ImpactMetric[] {
  return readMetricsData().filter((m) => m.category === category);
}

// ── Impact Record CRUD ─────────────────────────────────────

export function createImpactRecord(
  metricId: string,
  value: number,
  date: string,
  period: ImpactRecord["period"],
  source: string,
  notes?: string
): ImpactRecord {
  const records = readRecordsData();
  const now = new Date().toISOString();

  const record: ImpactRecord = {
    id: `record-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    metricId,
    value,
    date,
    period,
    source,
    notes,
    created: now,
  };

  records.push(record);
  writeRecordsData(records);
  return record;
}

export function getImpactRecords(): ImpactRecord[] {
  return readRecordsData();
}

export function getImpactRecordsByMetric(metricId: string): ImpactRecord[] {
  return readRecordsData().filter((r) => r.metricId === metricId);
}

export function getImpactRecordsByDateRange(startDate: string, endDate: string): ImpactRecord[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return readRecordsData().filter((r) => {
    const recordDate = new Date(r.date);
    return recordDate >= start && recordDate <= end;
  });
}

// ── Impact Trend Analysis ──────────────────────────────────

export function calculateImpactTrends(timeframe: string = "1 year"): ImpactTrend[] {
  const metrics = getImpactMetrics();
  const records = getImpactRecords();
  const now = new Date();

  // Calculate timeframe boundaries
  let startDate: Date;
  switch (timeframe) {
    case "6 months":
      startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      break;
    case "1 year":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    case "2 years":
      startDate = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);
      break;
    case "5 years":
      startDate = new Date(now.getTime() - 1825 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  }

  const midpoint = new Date(startDate.getTime() + (now.getTime() - startDate.getTime()) / 2);

  return metrics.map((metric) => {
    const metricRecords = records.filter((r) => r.metricId === metric.id);
    const recentRecords = metricRecords.filter((r) => new Date(r.date) >= midpoint);
    const olderRecords = metricRecords.filter((r) => new Date(r.date) < midpoint && new Date(r.date) >= startDate);

    const currentValue = recentRecords.length > 0
      ? recentRecords.reduce((sum, r) => sum + r.value, 0) / recentRecords.length
      : 0;

    const previousValue = olderRecords.length > 0
      ? olderRecords.reduce((sum, r) => sum + r.value, 0) / olderRecords.length
      : 0;

    const change = currentValue - previousValue;
    const changePercent = previousValue !== 0 ? Math.round((change / previousValue) * 100) : 0;

    let direction: "improving" | "declining" | "stable" = "stable";
    if (Math.abs(changePercent) > 5) {
      direction = changePercent > 0 ? "improving" : "declining";
    }

    return {
      metricId: metric.id,
      metricName: metric.name,
      domain: metric.domain,
      currentValue: Math.round(currentValue * 100) / 100,
      previousValue: Math.round(previousValue * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent,
      direction,
      timeframe,
    };
  });
}

// ── Multi-Year Comparison ──────────────────────────────────

export function compareMultiYear(years: number = 5): MultiYearComparison[] {
  const metrics = getImpactMetrics();
  const records = getImpactRecords();
  const now = new Date();
  const currentYear = now.getFullYear();

  return metrics.map((metric) => {
    const metricRecords = records.filter((r) => r.metricId === metric.id);
    const yearData: Array<{ year: number; value: number }> = [];

    for (let i = 0; i < years; i++) {
      const year = currentYear - i;
      const yearRecords = metricRecords.filter((r) => new Date(r.date).getFullYear() === year);
      const avgValue = yearRecords.length > 0
        ? yearRecords.reduce((sum, r) => sum + r.value, 0) / yearRecords.length
        : 0;

      yearData.unshift({ year, value: Math.round(avgValue * 100) / 100 });
    }

    // Calculate overall trend
    const validYears = yearData.filter((y) => y.value > 0);
    let overallTrend: "improving" | "declining" | "stable" = "stable";
    let totalChange = 0;
    let averageAnnualChange = 0;

    if (validYears.length >= 2) {
      const firstValue = validYears[0].value;
      const lastValue = validYears[validYears.length - 1].value;
      totalChange = lastValue - firstValue;
      averageAnnualChange = totalChange / (validYears.length - 1);

      if (Math.abs(totalChange / firstValue) > 0.1) {
        overallTrend = totalChange > 0 ? "improving" : "declining";
      }
    }

    return {
      metricId: metric.id,
      metricName: metric.name,
      domain: metric.domain,
      years: yearData,
      overallTrend,
      totalChange: Math.round(totalChange * 100) / 100,
      averageAnnualChange: Math.round(averageAnnualChange * 100) / 100,
    };
  });
}

// ── Long-Term Impact Summary ───────────────────────────────

export function getLongTermImpactSummary(): LongTermImpactSummary {
  const metrics = getImpactMetrics();
  const records = getImpactRecords();
  const trends = calculateImpactTrends();

  const byDomain: Record<string, number> = {};
  const byCategory: Record<string, number> = {};

  metrics.forEach((metric) => {
    byDomain[metric.domain] = (byDomain[metric.domain] || 0) + 1;
    byCategory[metric.category] = (byCategory[metric.category] || 0) + 1;
  });

  const improvingTrends = trends.filter((t) => t.direction === "improving").length;
  const decliningTrends = trends.filter((t) => t.direction === "declining").length;
  const stableTrends = trends.filter((t) => t.direction === "stable").length;

  return {
    totalMetrics: metrics.length,
    totalRecords: records.length,
    byDomain,
    byCategory,
    improvingTrends,
    decliningTrends,
    stableTrends,
  };
}

// ── Default Impact Metrics ─────────────────────────────────

export function createDefaultImpactMetrics(): ImpactMetric[] {
  const metrics: ImpactMetric[] = [];

  // Forest metrics
  metrics.push(
    createImpactMetric("Forest Cover (hectares)", "forest", "environmental", "hectares", "Total forest cover area"),
    createImpactMetric("Species Diversity Index", "forest", "environmental", "index", "Biodiversity measurement"),
    createImpactMetric("Trees Planted", "forest", "environmental", "count", "Cumulative trees planted")
  );

  // Governance metrics
  metrics.push(
    createImpactMetric("Board Attendance Rate", "governance", "governance", "percentage", "Average board meeting attendance"),
    createImpactMetric("Resolution Implementation Rate", "governance", "governance", "percentage", "Resolutions implemented on time"),
    createImpactMetric("Policy Compliance Rate", "governance", "governance", "percentage", "Policy compliance score")
  );

  // Knowledge metrics
  metrics.push(
    createImpactMetric("Knowledge Documents", "knowledge", "knowledge", "count", "Total knowledge documents"),
    createImpactMetric("Institutional Patterns", "knowledge", "knowledge", "count", "Validated patterns"),
    createImpactMetric("Lessons Captured", "knowledge", "knowledge", "count", "Lessons learned from missions")
  );

  // Volunteer metrics
  metrics.push(
    createImpactMetric("Active Volunteers", "volunteer", "social", "count", "Currently active volunteers"),
    createImpactMetric("Volunteer Retention Rate", "volunteer", "social", "percentage", "Year-over-year retention"),
    createImpactMetric("Hours Contributed", "volunteer", "social", "hours", "Total volunteer hours")
  );

  return metrics;
}
