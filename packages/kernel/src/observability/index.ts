// Observability Module
// Runtime dashboard showing kernel state

import type { EventBus } from '../events/index.js';
import type { Registry } from '../registry/index.js';
import type { MemoryEngine } from '../memory/index.js';
import type { Scheduler } from '../scheduler/index.js';
import type { Health } from '../health/index.js';
import type { Logging } from '../logging/index.js';

export interface ObservabilityConfig {
  events: EventBus;
  registry: Registry;
  memory: MemoryEngine;
  scheduler: Scheduler;
  health: Health;
  logging: Logging;
}

export interface Dashboard {
  kernel: KernelStatus;
  agents: AgentStatus[];
  workflows: WorkflowStatus[];
  memory: MemoryStatus;
  events: EventStatus;
  scheduler: SchedulerStatus;
  planner: PlannerStatus;
  errors: ErrorEntry[];
  warnings: WarningEntry[];
  timestamp: Date;
}

export interface KernelStatus {
  status: 'booting' | 'ready' | 'degraded' | 'shutdown';
  uptime: number;
  version: string;
}

export interface AgentStatus {
  id: string;
  name: string;
  role: string;
  status: string;
}

export interface WorkflowStatus {
  id: string;
  name: string;
  status: string;
  lastRun?: Date;
}

export interface MemoryStatus {
  totalEntries: number;
  byType: Record<string, number>;
  lastUpdated?: Date;
}

export interface EventStatus {
  totalEmitted: number;
  handlersRegistered: number;
  lastEvent?: Date;
}

export interface SchedulerStatus {
  queued: number;
  running: number;
  completed: number;
  failed: number;
}

export interface PlannerStatus {
  totalPlans: number;
  activePlans: number;
  completedPlans: number;
}

export interface ErrorEntry {
  timestamp: Date;
  module: string;
  message: string;
}

export interface WarningEntry {
  timestamp: Date;
  module: string;
  message: string;
}

export class Observability {
  private config: ObservabilityConfig;
  private errors: ErrorEntry[] = [];
  private warnings: WarningEntry[] = [];
  private startTime: Date;

  constructor(config: ObservabilityConfig) {
    this.config = config;
    this.startTime = new Date();
  }

  async initialize(): Promise<void> {
    // Listen for errors and warnings
    this.config.events.on('kernel.error', (event) => {
      this.errors.push({
        timestamp: new Date(),
        module: event.source,
        message: (event.payload.message as string) ?? 'Unknown error',
      });
    });

    this.config.events.on('kernel.warning', (event) => {
      this.warnings.push({
        timestamp: new Date(),
        module: event.source,
        message: (event.payload.message as string) ?? 'Unknown warning',
      });
    });
  }

  async getDashboard(): Promise<Dashboard> {
    const agents = await this.config.registry.get('agent');
    const workflows = await this.config.registry.get('workflow');
    const memoryEntries = await this.config.memory.getAll();
    const eventHistory = this.config.events.getHistory();
    const schedulerStats = this.config.scheduler.getStats();
    const health = await this.config.health.check();

    return {
      kernel: {
        status: health.status === 'healthy' ? 'ready' : health.status === 'degraded' ? 'degraded' : 'shutdown',
        uptime: Date.now() - this.startTime.getTime(),
        version: '1.1.0-alpha',
      },
      agents: agents.map((a) => ({
        id: a.id,
        name: a.name,
        role: a.role,
        status: 'idle',
      })),
      workflows: workflows.map((w) => ({
        id: w.id,
        name: w.name,
        status: 'active',
      })),
      memory: {
        totalEntries: memoryEntries.length,
        byType: this.groupByType(memoryEntries),
        lastUpdated: memoryEntries.length > 0
          ? new Date(Math.max(...memoryEntries.map((e) => e.updatedAt.getTime())))
          : undefined,
      },
      events: {
        totalEmitted: eventHistory.length,
        handlersRegistered: 0, // Would need to track this
        lastEvent: eventHistory.length > 0
          ? eventHistory[eventHistory.length - 1].timestamp
          : undefined,
      },
      scheduler: {
        queued: schedulerStats.queued,
        running: schedulerStats.running,
        completed: schedulerStats.completed,
        failed: 0,
      },
      planner: {
        totalPlans: 0,
        activePlans: 0,
        completedPlans: 0,
      },
      errors: this.errors.slice(-50),
      warnings: this.warnings.slice(-50),
      timestamp: new Date(),
    };
  }

  private groupByType(entries: { type: string }[]): Record<string, number> {
    return entries.reduce((acc, entry) => {
      acc[entry.type] = (acc[entry.type] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  async getHealth() {
    return this.config.health.check();
  }

  async getErrors(limit = 50): Promise<ErrorEntry[]> {
    return this.errors.slice(-limit);
  }

  async getWarnings(limit = 50): Promise<WarningEntry[]> {
    return this.warnings.slice(-limit);
  }

  async shutdown(): Promise<void> {
    this.errors = [];
    this.warnings = [];
  }
}
