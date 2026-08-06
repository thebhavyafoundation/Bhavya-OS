/**
 * AI Product Manager
 * Bhavya OS v6.0 — Autonomous Product Studio
 * 
 * Autonomous product manager responsibilities:
 * - Prioritize backlog
 * - Estimate ROI
 * - Estimate effort
 * - Generate sprint plan
 * - Assign engineering work
 * - Track completion
 * - Generate executive summaries
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'ai-product-manager', 'data');

interface BacklogItem {
  id: string;
  title: string;
  description: string;
  appId: string;
  type: 'feature' | 'improvement' | 'bugfix' | 'debt' | 'research';
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  roi: number;
  effort: number;
  businessValue: number;
  risk: 'low' | 'medium' | 'high';
  dependencies: string[];
  status: 'backlog' | 'ready' | 'in-progress' | 'review' | 'completed';
  assignedTo?: string;
  sprintId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  items: string[];
  status: 'planned' | 'active' | 'completed';
  velocity: number;
  completedPoints: number;
  totalPoints: number;
}

interface ExecutiveSummary {
  timestamp: string;
  totalItems: number;
  completedItems: number;
  inProgressItems: number;
  backlogItems: number;
  velocity: number;
  sprintProgress: number;
  topPriorities: string[];
  risks: string[];
  recommendations: string[];
}

export class AIProductManager {
  private backlog: BacklogItem[] = [];
  private sprints: Sprint[] = [];
  private dataDir: string;

  constructor() {
    this.dataDir = DATA_DIR;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadData();
  }

  private loadData(): void {
    const backlogFile = join(this.dataDir, 'backlog.json');
    if (existsSync(backlogFile)) {
      this.backlog = JSON.parse(readFileSync(backlogFile, 'utf-8'));
    }

    const sprintsFile = join(this.dataDir, 'sprints.json');
    if (existsSync(sprintsFile)) {
      this.sprints = JSON.parse(readFileSync(sprintsFile, 'utf-8'));
    }
  }

  private saveData(): void {
    writeFileSync(
      join(this.dataDir, 'backlog.json'),
      JSON.stringify(this.backlog, null, 2)
    );

    writeFileSync(
      join(this.dataDir, 'sprints.json'),
      JSON.stringify(this.sprints, null, 2)
    );
  }

  /**
   * Add item to backlog
   */
  addToBacklog(item: Omit<BacklogItem, 'id' | 'createdAt' | 'updatedAt'>): BacklogItem {
    const newItem: BacklogItem = {
      id: `backlog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.backlog.push(newItem);
    this.saveData();
    return newItem;
  }

  /**
   * Prioritize backlog by ROI
   */
  prioritizeBacklog(): BacklogItem[] {
    return this.backlog
      .filter(item => item.status !== 'completed')
      .sort((a, b) => {
        const roiA = (a.roi * a.businessValue) / a.effort;
        const roiB = (b.roi * b.businessValue) / b.effort;
        return roiB - roiA;
      });
  }

  /**
   * Estimate ROI for item
   */
  estimateROI(item: Partial<BacklogItem>): number {
    const businessValue = item.businessValue || 5;
    const effort = item.effort || 5;
    const riskMultiplier = item.risk === 'low' ? 1 : item.risk === 'medium' ? 0.8 : 0.6;
    return Math.round((businessValue / effort) * 10 * riskMultiplier);
  }

  /**
   * Estimate effort for item
   */
  estimateEffort(item: Partial<BacklogItem>): number {
    const complexity = item.type === 'feature' ? 3 : item.type === 'improvement' ? 2 : 1;
    const riskFactor = item.risk === 'low' ? 1 : item.risk === 'medium' ? 1.5 : 2;
    return Math.round(complexity * riskFactor * 2);
  }

  /**
   * Generate sprint plan
   */
  generateSprintPlan(sprintName: string, startDate: string, endDate: string, capacity: number = 40): Sprint {
    const prioritized = this.prioritizeBacklog();
    let remainingCapacity = capacity;
    const selectedItems: string[] = [];

    for (const item of prioritized) {
      if (remainingCapacity <= 0) break;
      if (item.effort <= remainingCapacity) {
        selectedItems.push(item.id);
        remainingCapacity -= item.effort;
        item.status = 'ready';
        item.sprintId = `sprint-${Date.now()}`;
      }
    }

    const sprint: Sprint = {
      id: `sprint-${Date.now()}`,
      name: sprintName,
      startDate,
      endDate,
      items: selectedItems,
      status: 'planned',
      velocity: 0,
      completedPoints: 0,
      totalPoints: selectedItems.length
    };

    this.sprints.push(sprint);
    this.saveData();
    return sprint;
  }

  /**
   * Assign item to engineer
   */
  assignItem(itemId: string, engineer: string): void {
    const item = this.backlog.find(i => i.id === itemId);
    if (item) {
      item.assignedTo = engineer;
      item.status = 'in-progress';
      item.updatedAt = new Date().toISOString();
      this.saveData();
    }
  }

  /**
   * Complete item
   */
  completeItem(itemId: string): void {
    const item = this.backlog.find(i => i.id === itemId);
    if (item) {
      item.status = 'completed';
      item.completedAt = new Date().toISOString();
      item.updatedAt = new Date().toISOString();
      this.saveData();
    }
  }

  /**
   * Get sprint by ID
   */
  getSprint(sprintId: string): Sprint | undefined {
    return this.sprints.find(s => s.id === sprintId);
  }

  /**
   * Get active sprint
   */
  getActiveSprint(): Sprint | undefined {
    return this.sprints.find(s => s.status === 'active');
  }

  /**
   * Generate executive summary
   */
  generateExecutiveSummary(): ExecutiveSummary {
    const totalItems = this.backlog.length;
    const completedItems = this.backlog.filter(i => i.status === 'completed').length;
    const inProgressItems = this.backlog.filter(i => i.status === 'in-progress').length;
    const backlogItems = this.backlog.filter(i => i.status === 'backlog').length;

    const activeSprint = this.getActiveSprint();
    const sprintProgress = activeSprint
      ? (activeSprint.completedPoints / activeSprint.totalPoints) * 100
      : 0;

    const velocity = this.sprints.length > 0
      ? this.sprints.reduce((sum, s) => sum + s.velocity, 0) / this.sprints.length
      : 0;

    const topPriorities = this.prioritizeBacklog()
      .slice(0, 5)
      .map(i => i.title);

    const risks = this.backlog
      .filter(i => i.risk === 'high' && i.status !== 'completed')
      .map(i => `${i.title} (high risk)`);

    const recommendations = [];
    if (backlogItems > 10) {
      recommendations.push('Consider breaking down large backlog items');
    }
    if (inProgressItems > 5) {
      recommendations.push('Too many items in progress, consider limiting WIP');
    }
    if (velocity < 10) {
      recommendations.push('Velocity is low, consider capacity planning');
    }

    return {
      timestamp: new Date().toISOString(),
      totalItems,
      completedItems,
      inProgressItems,
      backlogItems,
      velocity,
      sprintProgress,
      topPriorities,
      risks,
      recommendations
    };
  }

  /**
   * Get backlog summary
   */
  getSummary(): {
    totalItems: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    byType: Record<string, number>;
    avgROI: number;
    avgEffort: number;
  } {
    const byStatus: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    const byType: Record<string, number> = {};

    for (const item of this.backlog) {
      byStatus[item.status] = (byStatus[item.status] || 0) + 1;
      byPriority[item.priority] = (byPriority[item.priority] || 0) + 1;
      byType[item.type] = (byType[item.type] || 0) + 1;
    }

    const avgROI = this.backlog.length > 0
      ? this.backlog.reduce((sum, i) => sum + i.roi, 0) / this.backlog.length
      : 0;

    const avgEffort = this.backlog.length > 0
      ? this.backlog.reduce((sum, i) => sum + i.effort, 0) / this.backlog.length
      : 0;

    return {
      totalItems: this.backlog.length,
      byStatus,
      byPriority,
      byType,
      avgROI,
      avgEffort
    };
  }
}

// Singleton instance
let instance: AIProductManager | null = null;

export function getAIProductManager(): AIProductManager {
  if (!instance) {
    instance = new AIProductManager();
  }
  return instance;
}
