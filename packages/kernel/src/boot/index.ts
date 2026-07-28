// Bhavya Kernel — Boot Module
// Bootstrap and initialization.

import type { KernelConfig } from '../types/index.js';
import { Runtime } from '../runtime/index.js';
import { Configuration } from '../configuration/index.js';
import { Logging } from '../logging/index.js';
import { Registry } from '../registry/index.js';
import { EventBus } from '../events/index.js';
import { MemoryEngine } from '../memory/index.js';
import { Permissions } from '../permissions/index.js';
import { Health } from '../health/index.js';
import { Scheduler } from '../scheduler/index.js';
import { Planner } from '../planner/index.js';
import { Api } from '../api/index.js';

export interface Kernel {
  runtime: Runtime;
  config: Configuration;
  logging: Logging;
  registry: Registry;
  events: EventBus;
  memory: MemoryEngine;
  permissions: Permissions;
  health: Health;
  scheduler: Scheduler;
  planner: Planner;
  api: Api;
}

export async function boot(config: KernelConfig): Promise<Kernel> {
  // 1. Load configuration
  const configuration = new Configuration(config);
  await configuration.load();

  // 2. Initialize logging
  const logging = new Logging({ level: config.logLevel ?? 'info' });
  logging.info('kernel', 'Booting Bhavya Kernel...');

  // 3. Initialize event bus (first, so other modules can emit)
  const events = new EventBus();
  await events.initialize();

  // 4. Initialize registry
  const registry = new Registry({ root: config.root });
  await registry.initialize();

  // 5. Initialize memory
  const memory = new MemoryEngine({ root: config.root });
  await memory.initialize();

  // 6. Initialize permissions
  const permissions = new Permissions();
  await permissions.initialize();

  // 7. Initialize health
  const health = new Health();
  await health.initialize();

  // 8. Initialize scheduler
  const scheduler = new Scheduler({ events });
  await scheduler.initialize();

  // 9. Initialize planner
  const planner = new Planner({ memory, events, scheduler });
  await planner.initialize();

  // 10. Initialize API
  const api = new Api({ kernel: { runtime: null as any, config: configuration, logging, registry, events, memory, permissions, health, scheduler, planner } });
  await api.initialize();

  // 11. Initialize runtime (last, depends on everything)
  const runtime = new Runtime({
    config: configuration,
    logging,
    registry,
    events,
    memory,
    permissions,
    health,
    scheduler,
    planner,
    api,
  });
  await runtime.initialize();

  logging.info('kernel', 'Bhavya Kernel booted successfully.');

  // Emit boot event
  await events.emit('kernel.booted', {
    timestamp: new Date(),
    version: '0.1.0',
  });

  return {
    runtime,
    config: configuration,
    logging,
    registry,
    events,
    memory,
    permissions,
    health,
    scheduler,
    planner,
    api,
  };
}
