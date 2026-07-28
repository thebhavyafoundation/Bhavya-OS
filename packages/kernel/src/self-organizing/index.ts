// Self-Organizing Engine
// Discovers work, assigns agents, coordinates autonomously.
// No human tells it what to do — it figures it out.

import type { ExecutionContext, Event } from '../types/index.js';

export interface WorkItem {
  id: string;
  type: 'task' | 'workflow' | 'goal';
  title: string;
  description: string;
  requiredCapabilities: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'discovered' | 'assigned' | 'in-progress' | 'completed' | 'failed';
  assignedAgent?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, unknown>;
}

export interface Agent {
  id: string;
  name: string;
  capabilities: string[];
  availability: 'available' | 'busy' | 'offline';
  currentWorkload: number;
  maxWorkload: number;
  performance: number; // 0-1 score
}

export interface SelfOrganizingConfig {
  events: {
    emit: (type: string, payload: Record<string, unknown>) => Promise<void>;
    on: (type: string, handler: (event: Event) => Promise<void>) => () => void;
  };
  memory: {
    set: (entry: any) => Promise<any>;
    get: (id: string) => Promise<any>;
    search: (query: string) => Promise<any[]>;
  };
  agents: {
    getAll: () => Agent[];
    getAvailable: () => Agent[];
    getBestMatch: (capabilities: string[]) => Agent | undefined;
  };
}

export class SelfOrganizingEngine {
  private config: SelfOrganizingConfig;
  private workItems = new Map<string, WorkItem>();
  private running = false;

  constructor(config: SelfOrganizingConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    this.running = true;

    // Listen for new work signals
    this.config.events.on('work.discovered', async (event) => {
      await this.discoverWork(event.payload as any);
    });

    // Listen for agent availability changes
    this.config.events.on('agent.available', async () => {
      await this.attemptAssignment();
    });

    // Auto-discover work periodically
    this.startDiscoveryLoop();
  }

  // Discover new work from events, memory, or external signals
  async discoverWork(signal: { type: string; title: string; description: string; requiredCapabilities: string[]; priority?: WorkItem['priority'] }): Promise<WorkItem> {
    const workItem: WorkItem = {
      id: `work:${crypto.randomUUID()}`,
      type: 'task',
      title: signal.title,
      description: signal.description,
      requiredCapabilities: signal.requiredCapabilities,
      priority: signal.priority ?? 'medium',
      status: 'discovered',
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: { source: signal.type },
    };

    this.workItems.set(workItem.id, workItem);

    // Persist to memory
    await this.config.memory.set({
      type: 'work-item',
      content: `Discovered: ${workItem.title}`,
      tags: ['work', workItem.priority, workItem.status],
      source: 'self-organizing',
      confidence: 1,
    });

    // Emit event
    await this.config.events.emit('work.item.discovered', {
      workItemId: workItem.id,
      title: workItem.title,
      priority: workItem.priority,
    });

    // Try to assign immediately
    await this.attemptAssignment();

    return workItem;
  }

  // Attempt to assign unassigned work to available agents
  async attemptAssignment(): Promise<void> {
    const unassigned = Array.from(this.workItems.values()).filter(
      (w) => w.status === 'discovered',
    );

    for (const work of unassigned) {
      const agent = this.config.agents.getBestMatch(work.requiredCapabilities);
      if (agent && agent.availability === 'available' && agent.currentWorkload < agent.maxWorkload) {
        await this.assignWork(work.id, agent.id);
      }
    }
  }

  // Assign work to an agent
  async assignWork(workItemId: string, agentId: string): Promise<void> {
    const work = this.workItems.get(workItemId);
    if (!work) return;

    work.assignedAgent = agentId;
    work.status = 'assigned';
    work.updatedAt = new Date();

    await this.config.events.emit('work.item.assigned', {
      workItemId,
      agentId,
      title: work.title,
    });

    await this.config.memory.set({
      type: 'assignment',
      content: `Assigned: ${work.title} → ${agentId}`,
      tags: ['assignment', workItemId, agentId],
      source: 'self-organizing',
      confidence: 1,
    });
  }

  // Mark work as in-progress
  async startWork(workItemId: string): Promise<void> {
    const work = this.workItems.get(workItemId);
    if (!work) return;

    work.status = 'in-progress';
    work.updatedAt = new Date();

    await this.config.events.emit('work.item.started', { workItemId });
  }

  // Complete work
  async completeWork(workItemId: string, output?: unknown): Promise<void> {
    const work = this.workItems.get(workItemId);
    if (!work) return;

    work.status = 'completed';
    work.updatedAt = new Date();
    work.metadata.output = output;

    await this.config.events.emit('work.item.completed', {
      workItemId,
      agentId: work.assignedAgent,
      output,
    });

    await this.config.memory.set({
      type: 'completion',
      content: `Completed: ${work.title}`,
      tags: ['completion', workItemId],
      source: 'self-organizing',
      confidence: 1,
    });
  }

  // Get all work items
  async getWorkItems(status?: WorkItem['status']): Promise<WorkItem[]> {
    const items = Array.from(this.workItems.values());
    if (status) return items.filter((w) => w.status === status);
    return items;
  }

  // Get unassigned work
  async getUnassigned(): Promise<WorkItem[]> {
    return Array.from(this.workItems.values()).filter(
      (w) => w.status === 'discovered',
    );
  }

  // Start periodic discovery loop
  private startDiscoveryLoop(): void {
    setInterval(async () => {
      if (!this.running) return;
      await this.attemptAssignment();
    }, 5000);
  }

  async shutdown(): Promise<void> {
    this.running = false;
    this.workItems.clear();
  }
}
