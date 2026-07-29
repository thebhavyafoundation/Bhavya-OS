// Event-Driven Orchestrator
// Reacts to events, triggers workflows automatically.
// No polling — pure event-driven.

import type { Event } from '../types/index.js';

export interface WorkflowTrigger {
  id: string;
  eventType: string;
  condition?: (payload: Record<string, unknown>) => boolean;
  workflowId: string;
  workflowInput: (payload: Record<string, unknown>) => Record<string, unknown>;
  enabled: boolean;
  cooldownMs?: number;
  lastTriggered?: Date;
}

export interface OrchestratorConfig {
  events: {
    emit: (type: string, payload: Record<string, unknown>) => Promise<void>;
    on: (type: string, handler: (event: Event) => Promise<void>) => () => void;
  };
  workflows: {
    start: (id: string, input: Record<string, unknown>) => Promise<string>;
    getStatus: (id: string) => Promise<string>;
  };
  memory: {
    set: (entry: any) => Promise<any>;
  };
}

export class EventDrivenOrchestrator {
  private config: OrchestratorConfig;
  private triggers = new Map<string, WorkflowTrigger>();
  private executionLog: Array<{ triggerId: string; eventType: string; timestamp: Date; success: boolean }> = [];

  constructor(config: OrchestratorConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Set up event listeners for all triggers
    for (const [id, trigger] of this.triggers) {
      if (trigger.enabled) {
        this.setupListener(id, trigger);
      }
    }
  }

  // Register a new trigger
  registerTrigger(trigger: Omit<WorkflowTrigger, 'id'>): string {
    const id = `trigger:${crypto.randomUUID()}`;
    const fullTrigger: WorkflowTrigger = { ...trigger, id };
    this.triggers.set(id, fullTrigger);

    if (trigger.enabled) {
      this.setupListener(id, fullTrigger);
    }

    return id;
  }

  // Set up event listener for a trigger
  private setupListener(triggerId: string, trigger: WorkflowTrigger): void {
    this.config.events.on(trigger.eventType, async (event) => {
      await this.handleEvent(triggerId, trigger, event);
    });
  }

  // Handle incoming event
  private async handleEvent(triggerId: string, trigger: WorkflowTrigger, event: Event): Promise<void> {
    // Check cooldown
    if (trigger.cooldownMs && trigger.lastTriggered) {
      const elapsed = Date.now() - trigger.lastTriggered.getTime();
      if (elapsed < trigger.cooldownMs) return;
    }

    // Check condition
    if (trigger.condition && !trigger.condition(event.payload)) {
      return;
    }

    // Execute workflow
    try {
      const input = trigger.workflowInput(event.payload);
      await this.config.workflows.start(trigger.workflowId, input);

      trigger.lastTriggered = new Date();

      this.executionLog.push({
        triggerId,
        eventType: event.type,
        timestamp: new Date(),
        success: true,
      });

      await this.config.memory.set({
        type: 'orchestration',
        content: `Triggered: ${trigger.workflowId} from ${event.type}`,
        tags: ['orchestration', trigger.workflowId, event.type],
        source: 'event-orchestrator',
        confidence: 1,
      });
    } catch {
      this.executionLog.push({
        triggerId,
        eventType: event.type,
        timestamp: new Date(),
        success: false,
      });
    }
  }

  // Enable/disable trigger
  setTriggerEnabled(triggerId: string, enabled: boolean): void {
    const trigger = this.triggers.get(triggerId);
    if (trigger) trigger.enabled = enabled;
  }

  // Get execution log
  getExecutionLog(): Array<{ triggerId: string; eventType: string; timestamp: Date; success: boolean }> {
    return [...this.executionLog];
  }

  // Get all triggers
  getTriggers(): WorkflowTrigger[] {
    return Array.from(this.triggers.values());
  }

  async shutdown(): Promise<void> {
    this.triggers.clear();
    this.executionLog = [];
  }
}
