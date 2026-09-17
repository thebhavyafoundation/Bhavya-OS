// Bhavya Kernel — Boot Module
// If the kernel cannot boot cleanly, nothing else runs.
// Boot sequence: Config → Registry → Agents → Workflows → Memory → Events → Scheduler → Health → READY

import type { KernelConfig } from "../types/index.js";
import { Runtime } from "../runtime/index.js";
import { Configuration } from "../configuration/index.js";
import { Logging } from "../logging/index.js";
import { Registry } from "../registry/index.js";
import { EventBus } from "../events/index.js";
import { MemoryEngine } from "../memory/index.js";
import { Permissions } from "../permissions/index.js";
import { Health } from "../health/index.js";
import { Scheduler } from "../scheduler/index.js";
import { Planner } from "../planner/index.js";
import { Api } from "../api/index.js";
import { Observability } from "../observability/index.js";

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
  observability: Observability;
}

export interface BootResult {
  success: boolean;
  kernel?: Kernel;
  error?: string;
  duration: number;
  steps: BootStep[];
}

export interface BootStep {
  name: string;
  status: "ok" | "error" | "skipped";
  duration: number;
  message?: string;
}

export async function boot(config: KernelConfig): Promise<BootResult> {
  const startTime = Date.now();
  const steps: BootStep[] = [];

  const step = async (
    name: string,
    fn: () => Promise<void>,
  ): Promise<boolean> => {
    const stepStart = Date.now();
    try {
      await fn();
      steps.push({ name, status: "ok", duration: Date.now() - stepStart });
      return true;
    } catch (error) {
      steps.push({
        name,
        status: "error",
        duration: Date.now() - stepStart,
        message: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  };

  // 1. Load Configuration
  const configuration = new Configuration(config);
  if (!(await step("Load Configuration", () => configuration.load()))) {
    return {
      success: false,
      error: "Failed to load configuration",
      duration: Date.now() - startTime,
      steps,
    };
  }

  // 2. Initialize Logging
  const logging = new Logging({ level: config.logLevel ?? "info" });
  if (
    !(await step("Initialize Logging", async () => {
      logging.info("kernel", "Booting Bhavya Kernel...");
    }))
  ) {
    return {
      success: false,
      error: "Failed to initialize logging",
      duration: Date.now() - startTime,
      steps,
    };
  }

  // 3. Initialize Event Bus (first, so other modules can emit)
  const events = new EventBus();
  if (!(await step("Initialize Event Bus", () => events.initialize()))) {
    return {
      success: false,
      error: "Failed to initialize event bus",
      duration: Date.now() - startTime,
      steps,
    };
  }

  // 4. Initialize Registry (discover agents, workflows, etc.)
  const registry = new Registry({ root: config.root });
  if (!(await step("Initialize Registry", () => registry.initialize()))) {
    return {
      success: false,
      error: "Failed to initialize registry",
      duration: Date.now() - startTime,
      steps,
    };
  }

  // 5. Initialize Memory
  const memory = new MemoryEngine({ root: config.root });
  if (!(await step("Initialize Memory", () => memory.initialize()))) {
    return {
      success: false,
      error: "Failed to initialize memory",
      duration: Date.now() - startTime,
      steps,
    };
  }

  // 6. Initialize Permissions
  const permissions = new Permissions();
  if (!(await step("Initialize Permissions", () => permissions.initialize()))) {
    return {
      success: false,
      error: "Failed to initialize permissions",
      duration: Date.now() - startTime,
      steps,
    };
  }

  // 7. Initialize Health
  const health = new Health();
  if (!(await step("Initialize Health", () => health.initialize()))) {
    return {
      success: false,
      error: "Failed to initialize health",
      duration: Date.now() - startTime,
      steps,
    };
  }

  // 8. Initialize Scheduler
  const scheduler = new Scheduler({ events });
  if (!(await step("Initialize Scheduler", () => scheduler.initialize()))) {
    return {
      success: false,
      error: "Failed to initialize scheduler",
      duration: Date.now() - startTime,
      steps,
    };
  }

  // 9. Initialize Planner
  const planner = new Planner({ memory, events, scheduler });
  if (!(await step("Initialize Planner", () => planner.initialize()))) {
    return {
      success: false,
      error: "Failed to initialize planner",
      duration: Date.now() - startTime,
      steps,
    };
  }

  // 10. Initialize Observability
  const observability = new Observability({
    events,
    registry,
    memory,
    scheduler,
    health,
    logging,
  });
  if (
    !(await step("Initialize Observability", () => observability.initialize()))
  ) {
    return {
      success: false,
      error: "Failed to initialize observability",
      duration: Date.now() - startTime,
      steps,
    };
  }

  // 11. Initialize API
  const kernelContext = {
    runtime: null as unknown,
    config: configuration,
    logging,
    registry,
    events,
    memory,
    permissions,
    health,
    scheduler,
    planner,
  };
  const api = new Api({ kernel: kernelContext });
  if (!(await step("Initialize API", () => api.initialize()))) {
    return {
      success: false,
      error: "Failed to initialize API",
      duration: Date.now() - startTime,
      steps,
    };
  }

  // 12. Initialize Runtime (last, depends on everything)
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
  if (!(await step("Initialize Runtime", () => runtime.initialize()))) {
    return {
      success: false,
      error: "Failed to initialize runtime",
      duration: Date.now() - startTime,
      steps,
    };
  }

  // 13. Health Check
  if (
    !(await step("Health Check", async () => {
      const healthStatus = await health.check();
      if (healthStatus.status === "unhealthy") {
        throw new Error("Kernel is unhealthy after boot");
      }
    }))
  ) {
    return {
      success: false,
      error: "Health check failed",
      duration: Date.now() - startTime,
      steps,
    };
  }

  // READY
  logging.info(
    "kernel",
    `Bhavya Kernel booted successfully in ${Date.now() - startTime}ms`,
  );
  logging.info(
    "kernel",
    `Boot steps: ${steps.filter((s) => s.status === "ok").length}/${steps.length} OK`,
  );

  await events.emit("kernel.booted", {
    timestamp: new Date(),
    version: "1.1.0-alpha",
    duration: Date.now() - startTime,
  });

  const kernel: Kernel = {
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
    observability,
  };

  return {
    success: true,
    kernel,
    duration: Date.now() - startTime,
    steps,
  };
}
