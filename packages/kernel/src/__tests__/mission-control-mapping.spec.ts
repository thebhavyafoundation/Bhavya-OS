import { describe, expect, it } from "vitest";

import {
  JOB_STATUS_FOR_RESULT_CODE,
  jobStatusForResultCode,
  planJobStatusUpdate,
  type MissionControlTransitionTable,
} from "../execution/mission-control-mapping.js";
import { createExecutionResult, type ExecutionResultCode } from "../execution/result.js";

/**
 * The transition table exactly as Mission Control declares it
 * (apps/ai-institute/src/lib/repositories/sqlite-mission-control-repository.ts).
 * It is copied here as *test input*, not as a second source of truth: the
 * production code receives the table from its caller.
 */
const MISSION_CONTROL_TRANSITIONS: MissionControlTransitionTable = {
  queued: ["running", "cancelled"],
  running: ["awaiting_approval", "stopped", "failed", "cancelled"],
  awaiting_approval: ["revising", "completed", "stopped"],
  revising: ["awaiting_approval", "stopped"],
  completed: [],
  stopped: [],
  failed: [],
  cancelled: [],
};

const result = (code: ExecutionResultCode) =>
  createExecutionResult({ code, summary: `outcome: ${code}`, correlationId: "corr-1" });

describe("mission control job-status mapping", () => {
  it("maps every result code to a job status", () => {
    const codes = Object.keys(JOB_STATUS_FOR_RESULT_CODE) as ExecutionResultCode[];
    expect(codes.length).toBe(10);
    for (const code of codes) {
      expect(jobStatusForResultCode(code)).toBeTruthy();
    }
  });

  it("keeps a retryable failure inside a running job", () => {
    expect(jobStatusForResultCode("retryable_failure")).toBe("running");
  });

  it("keeps a timeout inside a running job, because it may be retried", () => {
    // A timeout is retryable in the kernel's policy, so it must not close a
    // job that is still able to make another attempt.
    expect(jobStatusForResultCode("timeout")).toBe("running");
  });

  it("cannot be edited by a consumer", () => {
    expect(Object.isFrozen(JOB_STATUS_FOR_RESULT_CODE)).toBe(true);
    try {
      (
        JOB_STATUS_FOR_RESULT_CODE as unknown as Record<string, unknown>
      ).success = "failed";
    } catch {
      // A frozen object throws in strict mode, which is the expected result.
    }
    expect(jobStatusForResultCode("success")).toBe("completed");
  });

  it("maps the terminal outcomes to terminal job statuses", () => {
    expect(jobStatusForResultCode("success")).toBe("completed");
    expect(jobStatusForResultCode("permanent_failure")).toBe("failed");
    expect(jobStatusForResultCode("cancelled")).toBe("cancelled");
  });

  it("reports a permitted transition", () => {
    const plan = planJobStatusUpdate(
      result("success"),
      "awaiting_approval",
      MISSION_CONTROL_TRANSITIONS,
    );
    expect(plan.target).toBe("completed");
    expect(plan.permitted).toBe(true);
    expect(plan.unchanged).toBe(false);
  });

  it("reports no transition when the job already holds the target status", () => {
    const plan = planJobStatusUpdate(
      result("retryable_failure"),
      "running",
      MISSION_CONTROL_TRANSITIONS,
    );
    expect(plan.unchanged).toBe(true);
    expect(plan.permitted).toBe(true);
  });

  it("reports a transition the state machine does not permit instead of performing it", () => {
    // Mission Control cannot move a queued job straight to failed, so a job
    // blocked before it starts has no valid target.
    const plan = planJobStatusUpdate(
      result("unknown_failure"),
      "queued",
      MISSION_CONTROL_TRANSITIONS,
    );
    expect(plan.permitted).toBe(false);
    expect(plan.reason).toMatch(/not permitted/);
  });

  it("reports a missing table entry rather than assuming it is allowed", () => {
    const plan = planJobStatusUpdate(result("success"), "queued", {});
    expect(plan.permitted).toBe(false);
    expect(plan.reason).toMatch(/no transition table entry/);
  });

  it("shows that an interrupted execution cannot be resumed through the job status alone", () => {
    // "stopped" is terminal in Mission Control, so the resumability the kernel
    // records has no counterpart in the job status.
    const plan = planJobStatusUpdate(
      result("interrupted"),
      "running",
      MISSION_CONTROL_TRANSITIONS,
    );
    expect(plan.target).toBe("stopped");
    expect(plan.permitted).toBe(true);

    // Resuming would require moving the job back to "running", which the
    // terminal "stopped" state does not allow.
    const resume = planJobStatusUpdate(
      result("retryable_failure"),
      "stopped",
      MISSION_CONTROL_TRANSITIONS,
    );
    expect(resume.target).toBe("running");
    expect(resume.permitted).toBe(false);
    expect(resume.reason).toMatch(/not permitted/);
  });
});
