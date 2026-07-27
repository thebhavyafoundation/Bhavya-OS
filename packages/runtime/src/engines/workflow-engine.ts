/**
 * Workflow Engine
 *
 * Manages and executes workflows, processes, and task orchestration.
 * Provides step definition, execution, monitoring, and error handling.
 *
 * @version 1.0
 * @license MIT
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type WorkflowStatus =
  "draft" | "active" | "paused" | "completed" | "failed" | "cancelled";

export type StepStatus =
  "pending" | "running" | "completed" | "failed" | "skipped" | "cancelled";

export type StepType =
  "action" | "condition" | "parallel" | "loop" | "wait" | "subworkflow";

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  variables: Record<string, unknown>;
  triggers: WorkflowTrigger[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: StepType;
  status: StepStatus;
  config: StepConfig;
  dependencies: string[];
  retryPolicy: RetryPolicy;
  timeout: number;
  onError: "fail" | "skip" | "retry";
  metadata: Record<string, unknown>;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  result?: unknown;
}

export interface StepConfig {
  action?: string;
  condition?: string;
  parallel?: string[];
  loop?: { items: string; step: string };
  wait?: { duration: number };
  subworkflow?: { workflowId: string; input: Record<string, unknown> };
  [key: string]: unknown;
}

export interface RetryPolicy {
  maxRetries: number;
  backoffMultiplier: number;
  initialDelay: number;
}

export interface WorkflowTrigger {
  type: "manual" | "schedule" | "event" | "webhook";
  config: Record<string, unknown>;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: WorkflowStatus;
  stepResults: Map<string, StepResult>;
  variables: Record<string, unknown>;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface StepResult {
  stepId: string;
  status: StepStatus;
  output: unknown;
  error?: string;
  duration: number;
}

export interface WorkflowMetrics {
  totalWorkflows: number;
  byStatus: Record<WorkflowStatus, number>;
  avgExecutionTime: number;
  successRate: number;
  totalExecutions: number;
}

// ─── Engine ───────────────────────────────────────────────────────────────────

export class WorkflowEngine {
  private workflows: Map<string, Workflow> = new Map();
  private executions: Map<string, WorkflowExecution> = new Map();
  private stepHandlers: Map<string, (input: unknown) => Promise<unknown>> =
    new Map();

  /**
   * Create a new workflow
   */
  async create(
    workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt">,
  ): Promise<Workflow> {
    const id = this.generateId();
    const now = new Date();

    const newWorkflow: Workflow = {
      ...workflow,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.workflows.set(id, newWorkflow);
    return newWorkflow;
  }

  /**
   * Get a workflow by ID
   */
  async get(id: string): Promise<Workflow | null> {
    return this.workflows.get(id) || null;
  }

  /**
   * Update a workflow
   */
  async update(
    id: string,
    updates: Partial<Omit<Workflow, "id" | "createdAt">>,
  ): Promise<Workflow | null> {
    const workflow = this.workflows.get(id);
    if (!workflow) return null;

    const updatedWorkflow: Workflow = {
      ...workflow,
      ...updates,
      updatedAt: new Date(),
    };

    this.workflows.set(id, updatedWorkflow);
    return updatedWorkflow;
  }

  /**
   * Delete a workflow
   */
  async delete(id: string): Promise<boolean> {
    return this.workflows.delete(id);
  }

  /**
   * Execute a workflow
   */
  async execute(
    workflowId: string,
    input: Record<string, unknown> = {},
  ): Promise<WorkflowExecution> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    if (workflow.status !== "active") {
      throw new Error(`Workflow ${workflowId} is not active`);
    }

    const execution: WorkflowExecution = {
      id: this.generateId(),
      workflowId,
      status: "running",
      stepResults: new Map(),
      variables: { ...workflow.variables, ...input },
      startedAt: new Date(),
    };

    this.executions.set(execution.id, execution);

    try {
      await this.executeSteps(workflow, execution);
      execution.status = "completed";
      execution.completedAt = new Date();
    } catch (error) {
      execution.status = "failed";
      execution.error = error instanceof Error ? error.message : String(error);
    }

    return execution;
  }

  /**
   * Get an execution by ID
   */
  async getExecution(id: string): Promise<WorkflowExecution | null> {
    return this.executions.get(id) || null;
  }

  /**
   * Get executions for a workflow
   */
  async getExecutionsByWorkflow(
    workflowId: string,
    limit: number = 10,
  ): Promise<WorkflowExecution[]> {
    return Array.from(this.executions.values())
      .filter((e) => e.workflowId === workflowId)
      .slice(0, limit);
  }

  /**
   * Pause a workflow execution
   */
  async pauseExecution(executionId: string): Promise<boolean> {
    const execution = this.executions.get(executionId);
    if (!execution || execution.status !== "running") return false;

    execution.status = "paused";
    return true;
  }

  /**
   * Resume a workflow execution
   */
  async resumeExecution(executionId: string): Promise<boolean> {
    const execution = this.executions.get(executionId);
    if (!execution || execution.status !== "paused") return false;

    execution.status = "running";
    const workflow = this.workflows.get(execution.workflowId);
    if (workflow) {
      await this.executeSteps(workflow, execution);
    }
    return true;
  }

  /**
   * Cancel a workflow execution
   */
  async cancelExecution(executionId: string): Promise<boolean> {
    const execution = this.executions.get(executionId);
    if (!execution) return false;

    execution.status = "cancelled";
    return true;
  }

  /**
   * Register a step handler
   */
  registerStepHandler(
    action: string,
    handler: (input: unknown) => Promise<unknown>,
  ): void {
    this.stepHandlers.set(action, handler);
  }

  /**
   * Get workflow metrics
   */
  async getMetrics(): Promise<WorkflowMetrics> {
    const workflows = Array.from(this.workflows.values());
    const executions = Array.from(this.executions.values());

    const byStatus: Record<WorkflowStatus, number> = {
      draft: 0,
      active: 0,
      paused: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
    };

    for (const workflow of workflows) {
      byStatus[workflow.status]++;
    }

    let totalExecutionTime = 0;
    let completedCount = 0;

    for (const execution of executions) {
      if (execution.completedAt) {
        totalExecutionTime +=
          execution.completedAt.getTime() - execution.startedAt.getTime();
        completedCount++;
      }
    }

    const successfulExecutions = executions.filter(
      (e) => e.status === "completed",
    ).length;

    return {
      totalWorkflows: workflows.length,
      byStatus,
      avgExecutionTime:
        completedCount > 0 ? totalExecutionTime / completedCount : 0,
      successRate:
        executions.length > 0 ? successfulExecutions / executions.length : 0,
      totalExecutions: executions.length,
    };
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private generateId(): string {
    return `wf_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private async executeSteps(
    workflow: Workflow,
    execution: WorkflowExecution,
  ): Promise<void> {
    // Topological sort of steps based on dependencies
    const sortedSteps = this.topologicalSort(workflow.steps);

    for (const step of sortedSteps) {
      if (execution.status === "cancelled" || execution.status === "paused") {
        break;
      }

      // Check dependencies
      const dependenciesMet = step.dependencies.every((depId) => {
        const depResult = execution.stepResults.get(depId);
        return depResult && depResult.status === "completed";
      });

      if (!dependenciesMet) {
        step.status = "skipped";
        continue;
      }

      await this.executeStep(step, execution);
    }
  }

  private async executeStep(
    step: WorkflowStep,
    execution: WorkflowExecution,
  ): Promise<void> {
    step.status = "running";
    step.startedAt = new Date();

    const startTime = Date.now();

    try {
      let result: unknown;

      switch (step.type) {
        case "action":
          result = await this.executeAction(step, execution);
          break;
        case "condition":
          result = await this.executeCondition(step, execution);
          break;
        case "parallel":
          result = await this.executeParallel(step, execution);
          break;
        case "loop":
          result = await this.executeLoop(step, execution);
          break;
        case "wait":
          result = await this.executeWait(step);
          break;
        case "subworkflow":
          result = await this.executeSubworkflow(step, execution);
          break;
      }

      step.status = "completed";
      step.result = result;
      step.completedAt = new Date();

      execution.stepResults.set(step.id, {
        stepId: step.id,
        status: "completed",
        output: result,
        duration: Date.now() - startTime,
      });
    } catch (error) {
      step.status = "failed";
      step.error = error instanceof Error ? error.message : String(error);
      step.completedAt = new Date();

      execution.stepResults.set(step.id, {
        stepId: step.id,
        status: "failed",
        output: null,
        error: step.error,
        duration: Date.now() - startTime,
      });

      if (step.onError === "fail") {
        throw error;
      } else if (step.onError === "retry") {
        await this.retryStep(step, execution);
      }
    }
  }

  private async executeAction(
    step: WorkflowStep,
    execution: WorkflowExecution,
  ): Promise<unknown> {
    const handler = this.stepHandlers.get(step.config.action || "");
    if (!handler) {
      throw new Error(
        `No handler registered for action: ${step.config.action}`,
      );
    }

    return handler(execution.variables);
  }

  private async executeCondition(
    step: WorkflowStep,
    execution: WorkflowExecution,
  ): Promise<boolean> {
    // Simple condition evaluation (would use a proper expression engine in production)
    const condition = step.config.condition || "true";

    // Evaluate condition against variables
    try {
      const func = new Function(
        ...Object.keys(execution.variables),
        `return ${condition}`,
      );
      return func(...Object.values(execution.variables));
    } catch {
      throw new Error(`Invalid condition: ${condition}`);
    }
  }

  private async executeParallel(
    step: WorkflowStep,
    execution: WorkflowExecution,
  ): Promise<unknown[]> {
    const parallelSteps = step.config.parallel || [];
    const results: unknown[] = [];

    await Promise.all(
      parallelSteps.map(async (stepId) => {
        const subStep = {
          id: stepId,
          name: stepId,
          type: "action" as StepType,
          status: "pending" as StepStatus,
          config: {},
          dependencies: [],
          retryPolicy: step.retryPolicy,
          timeout: step.timeout,
          onError: step.onError,
          metadata: {},
        };

        await this.executeStep(subStep, execution);
        results.push(subStep.result);
      }),
    );

    return results;
  }

  private async executeLoop(
    step: WorkflowStep,
    execution: WorkflowExecution,
  ): Promise<unknown[]> {
    const items = execution.variables[
      step.config.loop?.items || ""
    ] as unknown[];
    const results: unknown[] = [];

    if (!Array.isArray(items)) {
      throw new Error(
        `Loop items must be an array: ${step.config.loop?.items}`,
      );
    }

    for (const item of items) {
      // Add loop variable
      execution.variables["loopItem"] = item;
      execution.variables["loopIndex"] = results.length;

      const subStep = {
        id: `${step.id}_loop_${results.length}`,
        name: `${step.name} iteration ${results.length}`,
        type: "action" as StepType,
        status: "pending" as StepStatus,
        config: step.config,
        dependencies: [],
        retryPolicy: step.retryPolicy,
        timeout: step.timeout,
        onError: step.onError,
        metadata: {},
      };

      await this.executeStep(subStep, execution);
      results.push(subStep.result);
    }

    return results;
  }

  private async executeWait(step: WorkflowStep): Promise<void> {
    const duration = step.config.wait?.duration || 1000;
    return new Promise((resolve) => setTimeout(resolve, duration));
  }

  private async executeSubworkflow(
    step: WorkflowStep,
    execution: WorkflowExecution,
  ): Promise<unknown> {
    const subworkflowId = step.config.subworkflow?.workflowId;
    if (!subworkflowId) {
      throw new Error("Subworkflow ID not specified");
    }

    const subworkflow = this.workflows.get(subworkflowId);
    if (!subworkflow) {
      throw new Error(`Subworkflow ${subworkflowId} not found`);
    }

    const subExecution = await this.execute(subworkflowId, {
      ...step.config.subworkflow?.input,
      parentExecutionId: execution.id,
    });

    return subExecution;
  }

  private async retryStep(
    step: WorkflowStep,
    execution: WorkflowExecution,
  ): Promise<void> {
    let retryCount = 0;
    const maxRetries = step.retryPolicy.maxRetries;

    while (retryCount < maxRetries) {
      try {
        await this.executeStep(step, execution);
        return;
      } catch (error) {
        retryCount++;
        if (retryCount >= maxRetries) {
          throw error;
        }

        const delay =
          step.retryPolicy.initialDelay *
          Math.pow(step.retryPolicy.backoffMultiplier, retryCount);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  private topologicalSort(steps: WorkflowStep[]): WorkflowStep[] {
    const sorted: WorkflowStep[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (step: WorkflowStep) => {
      if (visited.has(step.id)) return;
      if (visiting.has(step.id)) {
        throw new Error(`Circular dependency detected: ${step.id}`);
      }

      visiting.add(step.id);

      for (const depId of step.dependencies) {
        const dep = steps.find((s) => s.id === depId);
        if (dep) visit(dep);
      }

      visiting.delete(step.id);
      visited.add(step.id);
      sorted.push(step);
    };

    for (const step of steps) {
      visit(step);
    }

    return sorted;
  }
}

export default WorkflowEngine;
