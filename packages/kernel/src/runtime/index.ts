// Bhavya Kernel — Runtime Module
// Lifecycle management.

import type { Configuration } from '../configuration/index.js';
import type { Logging } from '../logging/index.js';
import type { Registry } from '../registry/index.js';
import type { EventBus } from '../events/index.js';
import type { MemoryEngine } from '../memory/index.js';
import type { Permissions } from '../permissions/index.js';
import type { Health } from '../health/index.js';
import type { Scheduler } from '../scheduler/index.js';
import type { Planner } from '../planner/index.js';
import type { Api } from '../api/index.js';

export interface RuntimeContext {
  config: Configuration;
  logging: Logging;
  registry: Registry;
  events: EventBus;
  memory: MemoryEngine;
  permissions: Permissions;
  health: Health;
  scheduler: Scheduler;
  planner: Planner;
  api?: Api;
}

export class Runtime {
  private context: RuntimeContext;
  private status: 'idle' | 'running' | 'stopping' | 'stopped' = 'idle';

  constructor(context: RuntimeContext) {
    this.context = context;
  }

  async initialize(): Promise<void> {
    this.context.logging.info('runtime', 'Initializing runtime...');
    this.status = 'running';
    await this.context.events.emit('runtime.initialized', {});
  }

  async shutdown(): Promise<void> {
    this.context.logging.info('runtime', 'Shutting down runtime...');
    this.status = 'stopping';

    // Shutdown in reverse order
    await this.context.api?.shutdown();
    await this.context.planner.shutdown();
    await this.context.scheduler.shutdown();
    await this.context.health.shutdown();
    await this.context.permissions.shutdown();
    await this.context.memory.shutdown();
    await this.context.registry.shutdown();
    await this.context.events.shutdown();
    await this.context.logging.shutdown();
    await this.context.config.shutdown();

    this.status = 'stopped';
  }

  getStatus(): string {
    return this.status;
  }

  getContext(): RuntimeContext {
    return this.context;
  }
}
