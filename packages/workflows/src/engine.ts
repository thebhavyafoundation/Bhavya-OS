/**
 * @bhavya/workflows — Workflow Engine
 *
 * DAG-based workflow execution with steps, approvals, retry, and compensation.
 */

import type {
  Workflow,
  WorkflowStep,
  WorkflowStatus,
  StepStatus,
} from "@bhavya/types";

export type StepExecutor = (
  step: WorkflowStep,
  context: Record<string, unknown>,
) => Promise<Record<string, unknown>>;

export interface WorkflowResult {
  workflowId: string;
  status: WorkflowStatus;
  stepResults: StepResult[];
  output?: unknown;
  error?: string;
  durationMs: number;
}

export interface StepResult {
  stepId: string;
  status: StepStatus;
  output?: unknown;
  error?: string;
  durationMs: number;
}

/**
 * Execute a workflow's steps in dependency order.
 */
export async function executeWorkflow(
  workflow: Workflow,
  context: Record<string, unknown>,
  executors: Map<string, StepExecutor>,
): Promise<WorkflowResult> {
  const startTime = Date.now();
  const stepResults: StepResult[] = [];
  const completed = new Set<string>();
  const output: Record<string, unknown> = {};

  const sorted = topologicalSort(workflow.steps);

  for (const step of sorted) {
    if (step.status === "skipped" || step.status === "cancelled") continue;
    if (step.dependencies.some((d) => !completed.has(d))) {
      stepResults.push({ stepId: step.id, status: "skipped", durationMs: 0 });
      continue;
    }

    const executor = executors.get(step.type);
    if (!executor) {
      stepResults.push({
        stepId: step.id,
        status: "failed",
        error: `No executor for step type: ${step.type}`,
        durationMs: 0,
      });
      if (step.onError === "fail") break;
      continue;
    }

    const stepStart = Date.now();
    try {
      const result = await executor(step, { ...context, ...output });
      output[step.id] = result;
      completed.add(step.id);
      stepResults.push({
        stepId: step.id,
        status: "completed",
        output: result,
        durationMs: Date.now() - stepStart,
      });
    } catch (err: unknown) {
      if (step.retryPolicy && step.retryPolicy.maxAttempts > 1) {
        for (
          let attempt = 1;
          attempt < step.retryPolicy.maxAttempts;
          attempt++
        ) {
          await sleep(step.retryPolicy.backoffMs * attempt);
          try {
            const result = await executor(step, { ...context, ...output });
            output[step.id] = result;
            completed.add(step.id);
            stepResults.push({
              stepId: step.id,
              status: "completed",
              output: result,
              durationMs: Date.now() - stepStart,
            });
            break;
          } catch {
            if (attempt === step.retryPolicy.maxAttempts - 1) {
              stepResults.push({
                stepId: step.id,
                status: "failed",
                error: err instanceof Error ? err.message : String(err),
                durationMs: Date.now() - stepStart,
              });
              if (step.onError === "fail") break;
            }
          }
        }
      } else {
        stepResults.push({
          stepId: step.id,
          status: "failed",
          error: err instanceof Error ? err.message : String(err),
          durationMs: Date.now() - stepStart,
        });
        if (step.onError === "fail") break;
      }
    }
  }

  const anyFailed = stepResults.some((r) => r.status === "failed");
  return {
    workflowId: workflow.id,
    status: anyFailed ? "failed" : "completed",
    stepResults,
    output,
    durationMs: Date.now() - startTime,
  };
}

function topologicalSort(steps: WorkflowStep[]): WorkflowStep[] {
  const map = new Map(steps.map((s) => [s.id, s]));
  const visited = new Set<string>();
  const result: WorkflowStep[] = [];

  function visit(id: string) {
    if (visited.has(id)) return;
    visited.add(id);
    const step = map.get(id);
    if (!step) return;
    for (const dep of step.dependencies) visit(dep);
    result.push(step);
  }

  for (const step of steps) visit(step.id);
  return result;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
