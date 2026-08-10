/**
 * Roadmap Engine
 * Bhavya OS v6.0 — Autonomous Product Studio
 * 
 * Generates dynamic roadmaps from:
 * - Repository status
 * - Issues
 * - Technical debt
 * - Performance metrics
 * - Product maturity
 * - Business goals
 * 
 * Every roadmap item includes:
 * - Priority
 * - ROI
 * - Engineering effort
 * - Business value
 * - Risk
 * - Dependencies
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'roadmap-engine', 'data');

interface RoadmapItem {
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
  status: 'planned' | 'in-progress' | 'completed' | 'blocked';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface Roadmap {
  id: string;
  name: string;
  appId: string;
  items: RoadmapItem[];
  createdAt: string;
  updatedAt: string;
}

export class RoadmapEngine {
  private roadmaps: Map<string, Roadmap> = new Map();
  private dataDir: string;

  constructor() {
    this.dataDir = DATA_DIR;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadRoadmaps();
  }

  private loadRoadmaps(): void {
    const roadmapsFile = join(this.dataDir, 'roadmaps.json');
    if (existsSync(roadmapsFile)) {
      const data = JSON.parse(readFileSync(roadmapsFile, 'utf-8'));
      for (const [id, roadmap] of Object.entries(data)) {
        this.roadmaps.set(id, roadmap as Roadmap);
      }
    }
  }

  private saveRoadmaps(): void {
    const obj: Record<string, Roadmap> = {};
    for (const [id, roadmap] of this.roadmaps.entries()) {
      obj[id] = roadmap;
    }
    writeFileSync(
      join(this.dataDir, 'roadmaps.json'),
      JSON.stringify(obj, null, 2)
    );
  }

  /**
   * Create a new roadmap
   */
  createRoadmap(name: string, appId: string): Roadmap {
    const id = `roadmap-${Date.now()}`;
    const roadmap: Roadmap = {
      id,
      name,
      appId,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.roadmaps.set(id, roadmap);
    this.saveRoadmaps();
    return roadmap;
  }

  /**
   * Add item to roadmap
   */
  addItem(roadmapId: string, item: Omit<RoadmapItem, 'id' | 'createdAt' | 'updatedAt'>): RoadmapItem {
    const roadmap = this.roadmaps.get(roadmapId);
    if (!roadmap) {
      throw new Error(`Roadmap ${roadmapId} not found`);
    }

    const newItem: RoadmapItem = {
      id: `item-${Date.now()}`,
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    roadmap.items.push(newItem);
    roadmap.updatedAt = new Date().toISOString();
    this.saveRoadmaps();
    return newItem;
  }

  /**
   * Update item status
   */
  updateItemStatus(roadmapId: string, itemId: string, status: RoadmapItem['status']): void {
    const roadmap = this.roadmaps.get(roadmapId);
    if (!roadmap) {
      throw new Error(`Roadmap ${roadmapId} not found`);
    }

    const item = roadmap.items.find(i => i.id === itemId);
    if (!item) {
      throw new Error(`Item ${itemId} not found`);
    }

    item.status = status;
    item.updatedAt = new Date().toISOString();
    if (status === 'completed') {
      item.completedAt = new Date().toISOString();
    }

    roadmap.updatedAt = new Date().toISOString();
    this.saveRoadmaps();
  }

  /**
   * Get roadmap by ID
   */
  getRoadmap(roadmapId: string): Roadmap | undefined {
    return this.roadmaps.get(roadmapId);
  }

  /**
   * Get roadmaps for app
   */
  getAppRoadmaps(appId: string): Roadmap[] {
    return Array.from(this.roadmaps.values()).filter(r => r.appId === appId);
  }

  /**
   * Get all roadmaps
   */
  getAllRoadmaps(): Roadmap[] {
    return Array.from(this.roadmaps.values());
  }

  /**
   * Generate roadmap from metrics
   */
  generateFromMetrics(appId: string, metrics: any): RoadmapItem[] {
    const items: RoadmapItem[] = [];

    // Performance improvements
    if (metrics.performance?.score < 90) {
      items.push({
        id: `item-${Date.now()}-perf`,
        title: 'Improve performance score',
        description: `Current score: ${metrics.performance.score}. Target: 90+`,
        appId,
        type: 'improvement',
        priority: 'P1',
        roi: 8,
        effort: 5,
        businessValue: 7,
        risk: 'low',
        dependencies: [],
        status: 'planned',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // Accessibility improvements
    if (metrics.accessibility?.score < 90) {
      items.push({
        id: `item-${Date.now()}-a11y`,
        title: 'Improve accessibility score',
        description: `Current score: ${metrics.accessibility.score}. Target: 90+`,
        appId,
        type: 'improvement',
        priority: 'P1',
        roi: 7,
        effort: 4,
        businessValue: 8,
        risk: 'low',
        dependencies: [],
        status: 'planned',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // SEO improvements
    if (metrics.seo?.score < 90) {
      items.push({
        id: `item-${Date.now()}-seo`,
        title: 'Improve SEO score',
        description: `Current score: ${metrics.seo.score}. Target: 90+`,
        appId,
        type: 'improvement',
        priority: 'P2',
        roi: 6,
        effort: 3,
        businessValue: 6,
        risk: 'low',
        dependencies: [],
        status: 'planned',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // Error fixes
    if (metrics.errors?.critical > 0) {
      items.push({
        id: `item-${Date.now()}-errors`,
        title: 'Fix critical errors',
        description: `${metrics.errors.critical} critical errors found`,
        appId,
        type: 'bugfix',
        priority: 'P0',
        roi: 10,
        effort: 2,
        businessValue: 9,
        risk: 'medium',
        dependencies: [],
        status: 'planned',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    return items;
  }

  /**
   * Prioritize items by ROI
   */
  prioritizeByROI(roadmapId: string): RoadmapItem[] {
    const roadmap = this.roadmaps.get(roadmapId);
    if (!roadmap) {
      return [];
    }

    return roadmap.items
      .filter(item => item.status !== 'completed')
      .sort((a, b) => (b.roi * b.businessValue) / b.effort - (a.roi * a.businessValue) / a.effort);
  }

  /**
   * Get roadmap summary
   */
  getSummary(): {
    totalRoadmaps: number;
    totalItems: number;
    completedItems: number;
    inProgressItems: number;
    plannedItems: number;
  } {
    let totalItems = 0;
    let completedItems = 0;
    let inProgressItems = 0;
    let plannedItems = 0;

    for (const roadmap of this.roadmaps.values()) {
      totalItems += roadmap.items.length;
      completedItems += roadmap.items.filter(i => i.status === 'completed').length;
      inProgressItems += roadmap.items.filter(i => i.status === 'in-progress').length;
      plannedItems += roadmap.items.filter(i => i.status === 'planned').length;
    }

    return {
      totalRoadmaps: this.roadmaps.size,
      totalItems,
      completedItems,
      inProgressItems,
      plannedItems
    };
  }
}

// Singleton instance
let instance: RoadmapEngine | null = null;

export function getRoadmapEngine(): RoadmapEngine {
  if (!instance) {
    instance = new RoadmapEngine();
  }
  return instance;
}
