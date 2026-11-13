// Mapping between a kernel execution result and a Mission Control job status.
//
// The kernel describes the outcome of one execution attempt; Mission Control
// describes the state of a job. They do not align one-to-one: the kernel can
// express "interrupted" and "quota paused", while Mission Control's job
// statuses have no such value and its transition table makes several states
// terminal.
//
// This module is a PURE mapping. It does not write, does not transition
// anything, and does not know Mission Control's transition table: the caller
// supplies it, so there is exactly one source of truth for the table (the
// Mission Control repository) and none in the kernel.
//
// It is deliberately not wired into any production caller. Wiring it is
// blocked on decision D-08 (job status vocabulary).

import type { ExecutionResult, ExecutionResultCode } from "./result.js";

/**
 * The Mission Control job statuses, as declared by `McJobStatus` in
 * apps/ai-institute/src/lib/repositories/mission-control-repository.ts.
 * Declared here so the mapping can be typed without a dependency from the
 * kernel to the application.
 */
export type MissionControlJobStatus =
  | "queued"
  | "running"
  | "awaiting_approval"
  | "revising"
  | "completed"
  | "stopped"
  | "failed"
  | "cancelled";

/** A transition table supplied by the caller (Mission Control owns the real one). */
export type MissionControlTransitionTable = Record<string, string[]>;

/**
 * The preferred job status for each execution result code.
 *
 * Two codes deliberately map onto a status the job already holds, because the
 * kernel's state is finer-grained than Mission Control's: a retryable failure
 * means the job is still running while another attempt is made, and a success
 * that needs no transition needs none.
 *
 * "interrupted" maps onto "stopped", which is terminal in Mission Control
 * even though the kernel records the execution as resumable. That gap has no
 * counterpart in the job statuses and is reported by the interface map rather
 * than hidden here.
 */
export const JOB_STATUS_FOR_RESULT_CODE: Readonly<
  Record<ExecutionResultCode, MissionControlJobStatus>
> = Object.freeze({
  success: "completed",
  retryable_failure: "running",
  permanent_failure: "failed",
  policy_denied: "failed",
  approval_required: "awaiting_approval",
  quota_paused: "stopped",
  cancelled: "cancelled",
  timeout: "running",
  interrupted: "stopped",
  unknown_failure: "failed",
});

export interface JobStatusPlan {
  /** The status the job should hold after this result. */
  target: MissionControlJobStatus;
  /** Whether moving from `current` to `target` is permitted by the supplied table. */
  permitted: boolean;
  /** Why the transition is not permitted, when it is not. */
  reason?: string;
  /** True when the job already holds the target status. */
  unchanged: boolean;
}

/** The status a job should hold for a given result code. */
export function jobStatusForResultCode(
  code: ExecutionResultCode,
): MissionControlJobStatus {
  return JOB_STATUS_FOR_RESULT_CODE[code];
}

/**
 * Plan the job-status update for an execution result.
 *
 * The caller supplies the transition table, so this function never carries a
 * second copy of Mission Control's rules. A transition the table does not
 * permit is reported, not performed and not silently rewritten.
 */
export function planJobStatusUpdate(
  result: ExecutionResult,
  current: MissionControlJobStatus,
  transitions: MissionControlTransitionTable,
): JobStatusPlan {
  const target = JOB_STATUS_FOR_RESULT_CODE[result.code];
  if (target === current) {
    return { target, permitted: true, unchanged: true };
  }

  const allowed = transitions[current];
  if (!allowed) {
    return {
      target,
      permitted: false,
      reason: `no transition table entry for the current status "${current}"`,
      unchanged: false,
    };
  }
  if (!allowed.includes(target)) {
    return {
      target,
      permitted: false,
      reason: `the transition "${current}" -> "${target}" is not permitted by the job state machine`,
      unchanged: false,
    };
  }
  return { target, permitted: true, unchanged: false };
}
