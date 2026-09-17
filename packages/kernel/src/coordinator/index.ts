// Coordinator Module
// Orchestrates multiple engines and combines their outputs.
// The coordinator doesn't perform work itself.
// Its role is to orchestrate multiple engines and combine their outputs.

import type {
  Goal,
  Plan,
  Task,
  Event,
  ExecutionContext,
  ExecutionReport,
  Artifact,
} from "../types/index.js";

export interface CoordinatorConfig {
  planner: {
    createPlan: (goal: Goal) => Promise<Plan>;
    execute: (planId: string) => Promise<boolean>;
  };
  scheduler: { enqueue: (task: Task) => Promise<void> };
  events: {
    emit: (type: string, payload: Record<string, unknown>) => Promise<void>;
    on: (type: string, handler: (event: Event) => Promise<void>) => () => void;
  };
  memory: {
    set: (entry: Record<string, unknown>) => Promise<void>;
    get: (id: string) => Promise<Record<string, unknown> | undefined>;
  };
  registry: { get: (type: string) => Array<Record<string, unknown>> };
  idempotency: {
    shouldExecute: (
      key: string,
    ) => Promise<{ proceed: boolean; reason: string }>;
    register: (key: string, executionId: string) => Promise<void>;
    complete: (key: string, result?: unknown) => Promise<void>;
  };
}

export interface CoordinatedExecution {
  executionId: string;
  goal: Goal;
  plan?: Plan;
  agents: AgentExecution[];
  artifacts: Artifact[];
  events: string[];
  status: "pending" | "running" | "completed" | "failed";
  context: ExecutionContext;
}

export interface AgentExecution {
  agentId: string;
  role: string;
  task: Task;
  result?: unknown;
  status: "pending" | "running" | "completed" | "failed";
}

export class Coordinator {
  private config: CoordinatorConfig;
  private executions = new Map<string, CoordinatedExecution>();

  constructor(config: CoordinatorConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Listen for events to track execution state
    this.config.events.on("task.completed", async (event) => {
      const payload = event.payload as Record<string, unknown>;
      const executionId = payload.executionId as string;
      if (executionId) {
        const execution = this.executions.get(executionId);
        if (execution) {
          // Update agent execution status
          const agentExec = execution.agents.find(
            (a) => a.task.id === payload.taskId,
          );
          if (agentExec) {
            agentExec.status = "completed";
            agentExec.result = payload.result;
          }

          // Check if all agents are done
          const allDone = execution.agents.every(
            (a) => a.status === "completed" || a.status === "failed",
          );
          if (allDone) {
            execution.status = "completed";
            await this.config.events.emit("execution.completed", {
              executionId,
              artifacts: execution.artifacts.length,
            });
          }
        }
      }
    });
  }

  async execute(goal: Goal): Promise<CoordinatedExecution> {
    const executionId = `exec:${crypto.randomUUID()}`;

    // Check idempotency
    const { proceed, reason } = await this.config.idempotency.shouldExecute(
      `coordinator:${goal.id}`,
    );
    if (!proceed) {
      throw new Error(`Execution blocked: ${reason}`);
    }

    await this.config.idempotency.register(
      `coordinator:${goal.id}`,
      executionId,
    );

    const context: ExecutionContext = {
      executionId,
      correlationId: `corr:${crypto.randomUUID()}`,
      retryCount: 0,
      maxRetries: 3,
      state: "running",
      timestamps: { started: new Date(), lastUpdated: new Date() },
      metadata: { coordinator: true, goalId: goal.id },
    };

    const execution: CoordinatedExecution = {
      executionId,
      goal,
      agents: [],
      artifacts: [],
      events: [],
      status: "running",
      context,
    };

    this.executions.set(executionId, execution);

    try {
      // 1. Create plan
      const plan = await this.config.planner.createPlan(goal);
      execution.plan = plan;

      // 2. Assign agents based on plan steps
      for (const step of plan.steps) {
        const agentExec: AgentExecution = {
          agentId: step.task.assignee ?? "unassigned",
          role: step.task.type,
          task: step.task,
          status: "pending",
        };
        execution.agents.push(agentExec);
      }

      // 3. Execute plan
      await this.config.planner.execute(plan.id);

      // 4. Emit events
      await this.config.events.emit("execution.started", {
        executionId,
        goalId: goal.id,
        agents: execution.agents.length,
      });
      execution.events.push("execution.started");

      // 5. Update memory
      await this.config.memory.set({
        type: "project",
        content: `Execution ${executionId} started for goal: ${goal.description}`,
        tags: ["execution", "started", goal.id],
        source: "coordinator",
        confidence: 1,
      });

      await this.config.idempotency.complete(`coordinator:${goal.id}`, {
        executionId,
      });

      return execution;
    } catch (error) {
      execution.status = "failed";
      context.state = "failed";
      throw error;
    }
  }

  async getExecution(
    executionId: string,
  ): Promise<CoordinatedExecution | undefined> {
    return this.executions.get(executionId);
  }

  async getAllExecutions(): Promise<CoordinatedExecution[]> {
    return Array.from(this.executions.values());
  }

  async getExecutionReport(
    executionId: string,
  ): Promise<ExecutionReport | null> {
    const execution = this.executions.get(executionId);
    if (!execution) return null;

    return {
      executionId,
      goal: execution.goal,
      plan: execution.plan,
      tasks: execution.agents.map((a) => a.task),
      artifacts: execution.artifacts,
      events: execution.events,
      memoryUpdates: [],
      status:
        execution.status === "completed"
          ? "success"
          : execution.status === "failed"
            ? "failed"
            : "partial",
      duration: Date.now() - execution.context.timestamps.started.getTime(),
      timestamp: new Date(),
      context: execution.context,
    };
  }

  async shutdown(): Promise<void> {
    this.executions.clear();
  }
}

export type { ExecutionReport } from "../types/index.js";
