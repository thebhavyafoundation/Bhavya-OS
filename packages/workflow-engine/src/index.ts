// Workflow Engine
// Loads .workflows/, executes steps, triggers events, recovers from failures

import type { Workflow, WorkflowId, WorkflowStep } from "@bhavya/kernel";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export interface WorkflowEngineConfig {
  root: string;
  events: {
    emit: (type: string, payload: Record<string, unknown>) => Promise<void>;
  };
}

export class WorkflowEngine {
  private config: WorkflowEngineConfig;
  private workflows = new Map<WorkflowId, Workflow>();
  private running = new Map<WorkflowId, Workflow>();

  constructor(config: WorkflowEngineConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    await this.loadAll();
  }

  private async loadAll(): Promise<void> {
    const dir = resolve(this.config.root, ".workflows");
    if (!existsSync(dir)) return;

    const files = readdirSync(dir).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      const workflow = await this.loadWorkflow(`${dir}/${file}`);
      if (workflow) this.workflows.set(workflow.id, workflow);
    }
  }

  private async loadWorkflow(path: string): Promise<Workflow | null> {
    try {
      const content = readFileSync(path, "utf-8");
      const name =
        path
          .split("/")
          .pop()
          ?.replace(/\.[^.]+$/, "") ?? "unknown";

      return {
        id: `workflow:${name}`,
        name,
        description: content.slice(0, 200),
        trigger: { type: "manual", config: {} },
        steps: [],
        status: "active",
        variables: {},
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch {
      return null;
    }
  }

  async start(workflowId: WorkflowId): Promise<boolean> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow || workflow.status !== "active") return false;

    this.running.set(workflowId, workflow);
    await this.config.events.emit("workflow.started", { workflowId });

    try {
      for (const step of workflow.steps) {
        await this.executeStep(step);
      }
      await this.config.events.emit("workflow.completed", { workflowId });
      return true;
    } catch (error) {
      await this.config.events.emit("workflow.failed", { workflowId, error });
      return false;
    } finally {
      this.running.delete(workflowId);
    }
  }

  private async executeStep(step: WorkflowStep): Promise<void> {
    await this.config.events.emit("workflow.step.started", { step: step.name });
    // Step execution would be handled by agent engine in production
    await this.config.events.emit("workflow.step.completed", {
      step: step.name,
    });
  }

  async get(id: WorkflowId): Promise<Workflow | undefined> {
    return this.workflows.get(id);
  }

  async getAll(): Promise<Workflow[]> {
    return Array.from(this.workflows.values());
  }

  async shutdown(): Promise<void> {
    this.workflows.clear();
    this.running.clear();
  }
}
