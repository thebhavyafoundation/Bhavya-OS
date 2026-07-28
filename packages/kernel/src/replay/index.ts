// Replay Engine
// Restore context, replay events, resume workflow.
// Makes debugging, auditing, and recovery possible.

import type { ExecutionContext, Event, ExecutionRecord, ExecutionState } from '../types/index.js';

export interface ReplayConfig {
  idempotency: {
    getExecution: (id: string) => Promise<ExecutionRecord | undefined>;
    updateExecution: (id: string, state: ExecutionState, output?: unknown) => Promise<void>;
  };
  events: {
    emit: (type: string, payload: Record<string, unknown>) => Promise<void>;
    getHistory: (type?: string) => Event[];
    on: (type: string, handler: (event: Event) => Promise<void>) => () => void;
  };
  memory: {
    set: (entry: any) => Promise<any>;
    get: (id: string) => Promise<any>;
  };
}

export interface ReplayResult {
  executionId: string;
  originalStatus: ExecutionState;
  replayedEvents: number;
  newStatus: ExecutionState;
  context: ExecutionContext;
  duration: number;
  timestamp: Date;
}

export class ReplayEngine {
  private config: ReplayConfig;
  private replays = new Map<string, ReplayResult>();

  constructor(config: ReplayConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Replay engine ready
  }

  // Replay a failed execution
  async replay(executionId: string): Promise<ReplayResult> {
    const startTime = Date.now();

    // 1. Get original execution
    const original = await this.config.idempotency.getExecution(executionId);
    if (!original) {
      throw new Error(`Execution ${executionId} not found`);
    }

    const originalStatus = original.status;

    // 2. Restore context
    const context: ExecutionContext = {
      ...original.context,
      state: 'running',
      retryCount: original.context.retryCount + 1,
      timestamps: {
        ...original.context.timestamps,
        lastUpdated: new Date(),
      },
    };

    // 3. Get events from original execution
    const events = this.config.events.getHistory();
    const executionEvents = events.filter(
      (e) => e.context?.executionId === executionId,
    );

    // 4. Replay events
    let replayedEvents = 0;
    for (const event of executionEvents) {
      try {
        await this.config.events.emit(event.type, event.payload);
        replayedEvents++;
      } catch {
        // Skip failed events
      }
    }

    // 5. Update execution state
    await this.config.idempotency.updateExecution(executionId, 'running');

    // 6. Update memory
    await this.config.memory.set({
      type: 'history',
      content: `Execution ${executionId} replayed (attempt ${context.retryCount})`,
      tags: ['replay', executionId, `attempt-${context.retryCount}`],
      source: 'replay-engine',
      confidence: 1,
    });

    const result: ReplayResult = {
      executionId,
      originalStatus,
      replayedEvents,
      newStatus: 'running',
      context,
      duration: Date.now() - startTime,
      timestamp: new Date(),
    };

    this.replays.set(executionId, result);
    return result;
  }

  // Resume a paused execution
  async resume(executionId: string): Promise<ReplayResult> {
    const startTime = Date.now();

    const original = await this.config.idempotency.getExecution(executionId);
    if (!original) {
      throw new Error(`Execution ${executionId} not found`);
    }

    const context: ExecutionContext = {
      ...original.context,
      state: 'running',
      timestamps: {
        ...original.context.timestamps,
        lastUpdated: new Date(),
      },
    };

    await this.config.idempotency.updateExecution(executionId, 'running');

    const result: ReplayResult = {
      executionId,
      originalStatus: original.status,
      replayedEvents: 0,
      newStatus: 'running',
      context,
      duration: Date.now() - startTime,
      timestamp: new Date(),
    };

    this.replays.set(executionId, result);
    return result;
  }

  // Get replay history
  async getReplayHistory(executionId: string): Promise<ReplayResult[]> {
    return Array.from(this.replays.values()).filter(
      (r) => r.executionId === executionId,
    );
  }

  // Get all replays
  async getAllReplays(): Promise<ReplayResult[]> {
    return Array.from(this.replays.values());
  }

  async shutdown(): Promise<void> {
    this.replays.clear();
  }
}
