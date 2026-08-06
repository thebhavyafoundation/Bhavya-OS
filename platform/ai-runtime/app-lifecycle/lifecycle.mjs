/**
 * Application Lifecycle
 * Bhavya OS v6.0 — Autonomous Product Studio
 * 
 * Full lifecycle management:
 * - Init
 * - Development
 * - Testing
 * - Deployment
 * - Monitoring
 * - Improvement
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'app-lifecycle', 'data');

interface AppLifecycle {
  appId: string;
  name: string;
  status: 'init' | 'development' | 'testing' | 'deployed' | 'monitoring' | 'improvement';
  phases: Phase[];
  metrics: AppMetrics;
  history: HistoryEntry[];
}

interface Phase {
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
  startDate?: string;
  endDate?: string;
  tasks: Task[];
}

interface Task {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignee?: string;
}

interface AppMetrics {
  performance: number;
  accessibility: number;
  seo: number;
  security: number;
  lastUpdated: string;
}

interface HistoryEntry {
  timestamp: string;
  event: string;
  details: string;
}

export class AppLifecycleManager {
  private lifecycles: AppLifecycle[] = [];
  private dataDir: string;

  constructor() {
    this.dataDir = DATA_DIR;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadLifecycles();
  }

  private loadLifecycles(): void {
    const lifecyclesFile = join(this.dataDir, 'lifecycles.json');
    if (existsSync(lifecyclesFile)) {
      this.lifecycles = JSON.parse(readFileSync(lifecyclesFile, 'utf-8'));
    }
  }

  private saveLifecycles(): void {
    writeFileSync(
      join(this.dataDir, 'lifecycles.json'),
      JSON.stringify(this.lifecycles, null, 2)
    );
  }

  /**
   * Initialize app lifecycle
   */
  initApp(appId: string, name: string): AppLifecycle {
    const lifecycle: AppLifecycle = {
      appId,
      name,
      status: 'init',
      phases: [
        { name: 'init', status: 'in-progress', tasks: [] },
        { name: 'development', status: 'pending', tasks: [] },
        { name: 'testing', status: 'pending', tasks: [] },
        { name: 'deployment', status: 'pending', tasks: [] },
        { name: 'monitoring', status: 'pending', tasks: [] },
        { name: 'improvement', status: 'pending', tasks: [] }
      ],
      metrics: {
        performance: 0,
        accessibility: 0,
        seo: 0,
        security: 0,
        lastUpdated: new Date().toISOString()
      },
      history: [
        {
          timestamp: new Date().toISOString(),
          event: 'init',
          details: 'App lifecycle initialized'
        }
      ]
    };

    this.lifecycles.push(lifecycle);
    this.saveLifecycles();
    return lifecycle;
  }

  /**
   * Advance to next phase
   */
  advancePhase(appId: string): void {
    const lifecycle = this.lifecycles.find(l => l.appId === appId);
    if (lifecycle) {
      const currentPhaseIndex = lifecycle.phases.findIndex(p => p.status === 'in-progress');
      if (currentPhaseIndex < lifecycle.phases.length - 1) {
        lifecycle.phases[currentPhaseIndex].status = 'completed';
        lifecycle.phases[currentPhaseIndex].endDate = new Date().toISOString();
        lifecycle.phases[currentPhaseIndex + 1].status = 'in-progress';
        lifecycle.phases[currentPhaseIndex + 1].startDate = new Date().toISOString();
        lifecycle.status = lifecycle.phases[currentPhaseIndex + 1].name as any;
        lifecycle.history.push({
          timestamp: new Date().toISOString(),
          event: 'phase-advance',
          details: `Advanced to ${lifecycle.phases[currentPhaseIndex + 1].name}`
        });
        this.saveLifecycles();
      }
    }
  }

  /**
   * Update metrics
   */
  updateMetrics(appId: string, metrics: Partial<AppMetrics>): void {
    const lifecycle = this.lifecycles.find(l => l.appId === appId);
    if (lifecycle) {
      Object.assign(lifecycle.metrics, metrics, { lastUpdated: new Date().toISOString() });
      lifecycle.history.push({
        timestamp: new Date().toISOString(),
        event: 'metrics-update',
        details: `Metrics updated: ${Object.keys(metrics).join(', ')}`
      });
      this.saveLifecycles();
    }
  }

  /**
   * Get app lifecycle
   */
  getAppLifecycle(appId: string): AppLifecycle | undefined {
    return this.lifecycles.find(l => l.appId === appId);
  }

  /**
   * Get all lifecycles
   */
  getAllLifecycles(): AppLifecycle[] {
    return this.lifecycles;
  }

  /**
   * Get summary
   */
  getSummary(): {
    total: number;
    byStatus: Record<string, number>;
    avgMetrics: { performance: number; accessibility: number; seo: number; security: number };
  } {
    const byStatus: Record<string, number> = {};
    for (const l of this.lifecycles) {
      byStatus[l.status] = (byStatus[l.status] || 0) + 1;
    }

    const avgMetrics = this.lifecycles.length > 0
      ? {
          performance: Math.round(this.lifecycles.reduce((sum, l) => sum + l.metrics.performance, 0) / this.lifecycles.length),
          accessibility: Math.round(this.lifecycles.reduce((sum, l) => sum + l.metrics.accessibility, 0) / this.lifecycles.length),
          seo: Math.round(this.lifecycles.reduce((sum, l) => sum + l.metrics.seo, 0) / this.lifecycles.length),
          security: Math.round(this.lifecycles.reduce((sum, l) => sum + l.metrics.security, 0) / this.lifecycles.length)
        }
      : { performance: 0, accessibility: 0, seo: 0, security: 0 };

    return {
      total: this.lifecycles.length,
      byStatus,
      avgMetrics
    };
  }
}

// Singleton instance
let instance: AppLifecycleManager | null = null;

export function getAppLifecycleManager(): AppLifecycleManager {
  if (!instance) {
    instance = new AppLifecycleManager();
  }
  return instance;
}
