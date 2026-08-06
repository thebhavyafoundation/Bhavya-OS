/**
 * Impact Platform
 * Bhavya Ecosystem v1.0
 * 
 * Measures:
 * - Trees planted
 * - Volunteers
 * - Events
 * - Projects
 * - Research
 * - Publications
 * - Communities served
 * 
 * Generates live impact reports
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'ecosystem', 'impact', 'data');

interface ImpactMetric {
  id: string;
  name: string;
  category: 'environment' | 'social' | 'education' | 'health' | 'economic';
  value: number;
  unit: string;
  target: number;
  trend: 'up' | 'down' | 'stable';
  history: { date: string; value: number }[];
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
}

interface ImpactReport {
  id: string;
  title: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  startDate: string;
  endDate: string;
  metrics: ImpactMetric[];
  summary: string;
  recommendations: string[];
  generatedAt: string;
}

interface ImpactGoal {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  status: 'on-track' | 'at-risk' | 'behind' | 'achieved';
}

export class ImpactPlatform {
  private metrics: ImpactMetric[] = [];
  private reports: ImpactReport[] = [];
  private goals: ImpactGoal[] = [];
  private dataDir: string;

  constructor() {
    this.dataDir = DATA_DIR;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadData();
  }

  private loadData(): void {
    const metricsFile = join(this.dataDir, 'metrics.json');
    if (existsSync(metricsFile)) {
      this.metrics = JSON.parse(readFileSync(metricsFile, 'utf-8'));
    }

    const reportsFile = join(this.dataDir, 'reports.json');
    if (existsSync(reportsFile)) {
      this.reports = JSON.parse(readFileSync(reportsFile, 'utf-8'));
    }

    const goalsFile = join(this.dataDir, 'goals.json');
    if (existsSync(goalsFile)) {
      this.goals = JSON.parse(readFileSync(goalsFile, 'utf-8'));
    }
  }

  private saveData(): void {
    writeFileSync(join(this.dataDir, 'metrics.json'), JSON.stringify(this.metrics, null, 2));
    writeFileSync(join(this.dataDir, 'reports.json'), JSON.stringify(this.reports, null, 2));
    writeFileSync(join(this.dataDir, 'goals.json'), JSON.stringify(this.goals, null, 2));
  }

  /**
   * Add impact metric
   */
  addMetric(metric: Omit<ImpactMetric, 'id' | 'history' | 'metadata'>): ImpactMetric {
    const newMetric: ImpactMetric = {
      id: `metric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...metric,
      history: [{ date: new Date().toISOString(), value: metric.value }],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    this.metrics.push(newMetric);
    this.saveData();
    return newMetric;
  }

  /**
   * Update metric value
   */
  updateMetric(metricId: string, value: number): void {
    const metric = this.metrics.find(m => m.id === metricId);
    if (metric) {
      metric.value = value;
      metric.history.push({ date: new Date().toISOString(), value });
      metric.trend = value > (metric.history[metric.history.length - 2]?.value || 0) ? 'up' : value < (metric.history[metric.history.length - 2]?.value || 0) ? 'down' : 'stable';
      metric.metadata.updatedAt = new Date().toISOString();
      this.saveData();
    }
  }

  /**
   * Get all metrics
   */
  getMetrics(): ImpactMetric[] {
    return this.metrics;
  }

  /**
   * Get metrics by category
   */
  getMetricsByCategory(category: ImpactMetric['category']): ImpactMetric[] {
    return this.metrics.filter(m => m.category === category);
  }

  /**
   * Add impact goal
   */
  addGoal(goal: Omit<ImpactGoal, 'id' | 'status'>): ImpactGoal {
    const newGoal: ImpactGoal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...goal,
      status: goal.current >= goal.target ? 'achieved' : 'on-track'
    };

    this.goals.push(newGoal);
    this.saveData();
    return newGoal;
  }

  /**
   * Update goal progress
   */
  updateGoal(goalId: string, current: number): void {
    const goal = this.goals.find(g => g.id === goalId);
    if (goal) {
      goal.current = current;
      goal.status = current >= goal.target ? 'achieved' : current >= goal.target * 0.8 ? 'on-track' : current >= goal.target * 0.5 ? 'at-risk' : 'behind';
      this.saveData();
    }
  }

  /**
   * Get all goals
   */
  getGoals(): ImpactGoal[] {
    return this.goals;
  }

  /**
   * Generate impact report
   */
  generateReport(period: ImpactReport['period'], startDate: string, endDate: string): ImpactReport {
    const report: ImpactReport = {
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `${period.charAt(0).toUpperCase() + period.slice(1)} Impact Report`,
      period,
      startDate,
      endDate,
      metrics: this.metrics.map(m => ({ ...m })),
      summary: this.generateSummary(),
      recommendations: this.generateRecommendations(),
      generatedAt: new Date().toISOString()
    };

    this.reports.push(report);
    this.saveData();
    return report;
  }

  private generateSummary(): string {
    const totalMetrics = this.metrics.length;
    const achievedGoals = this.goals.filter(g => g.status === 'achieved').length;
    return `Tracking ${totalMetrics} impact metrics. ${achievedGoals} of ${this.goals.length} goals achieved.`;
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const behindGoals = this.goals.filter(g => g.status === 'behind');
    if (behindGoals.length > 0) {
      recommendations.push(`Focus on ${behindGoals.length} goals that are behind schedule`);
    }
    const decliningMetrics = this.metrics.filter(m => m.trend === 'down');
    if (decliningMetrics.length > 0) {
      recommendations.push(`Investigate declining metrics: ${decliningMetrics.map(m => m.name).join(', ')}`);
    }
    return recommendations;
  }

  /**
   * Get impact summary
   */
  getSummary(): {
    totalMetrics: number;
    totalGoals: number;
    achievedGoals: number;
    totalReports: number;
  } {
    return {
      totalMetrics: this.metrics.length,
      totalGoals: this.goals.length,
      achievedGoals: this.goals.filter(g => g.status === 'achieved').length,
      totalReports: this.reports.length
    };
  }
}

// Singleton instance
let instance: ImpactPlatform | null = null;

export function getImpactPlatform(): ImpactPlatform {
  if (!instance) {
    instance = new ImpactPlatform();
  }
  return instance;
}
