// Structured execution results.
//
// An agent execution can end in many ways, and "it failed" is not an
// executable statement: the operator needs to know whether a retry is safe,
// whether a human is required, and whether the work may be resumed. Free-text
// error strings cannot answer those questions, and an unknown error must never
// be quietly treated as success or as a retry.
//
// RELATIONSHIP TO THE EXISTING VOCABULARY: this is NOT a second status
// vocabulary. The kernel already has `ExecutionState` (types/index.ts) and
// Mission Control has its own job statuses. This contract describes the
// outcome of one attempt and maps explicitly onto `ExecutionState` through
// `executionStateForCode`. Mission Control's job states are untouched
// (decision D-08 remains open).
//
// POLICY IS SEPARATE: the retry, human-intervention and resumability policy
// lives in one table, `EXECUTION_RESULT_POLICY`. The constructors derive every
// flag from that table, so a result's flags can never disagree with its code.
// Transport and presentation are out of scope: this module formats nothing.

import type { ExecutionState } from "../types/index.js";

export const EXECUTION_RESULT_VERSION = "1.0.0";

/** Versions of the contract this implementation can read. */
export const SUPPORTED_EXECUTION_RESULT_VERSIONS = ["1.0.0"];

export type ExecutionResultCode =
  /** The work completed and its acceptance criteria were met. */
  | "success"
  /** It failed in a way that is safe and useful to attempt again. */
  | "retryable_failure"
  /** It failed in a way that will not change on another attempt. */
  | "permanent_failure"
  /** A policy or permission boundary refused the action. */
  | "policy_denied"
  /** The work needs a human decision before it may continue. */
  | "approval_required"
  /** A quota or resource limit stopped the work; it may continue later. */
  | "quota_paused"
  /** The work was cancelled deliberately. */
  | "cancelled"
  /** The work exceeded its time limit. */
  | "timeout"
  /** The execution was interrupted (runner loss, context loss, crash). */
  | "interrupted"
  /** The outcome could not be classified. Always needs a human. */
  | "unknown_failure";

export interface ExecutionResultPolicy {
  /** Another attempt of the same action may succeed. */
  retryable: boolean;
  /** A human must decide what happens next. */
  requiresHuman: boolean;
  /** The work may continue from a checkpoint. */
  resumable: boolean;
  /** No further automatic action will be taken. */
  terminal: boolean;
}

/**
 * The single policy table. Every flag in a produced result is derived from
 * it, so the code and the flags can never drift apart.
 */
export const EXECUTION_RESULT_POLICY: Record<
  ExecutionResultCode,
  ExecutionResultPolicy
> = {
  success: { retryable: false, requiresHuman: false, resumable: false, terminal: true },
  retryable_failure: { retryable: true, requiresHuman: false, resumable: true, terminal: false },
  permanent_failure: { retryable: false, requiresHuman: true, resumable: false, terminal: true },
  policy_denied: { retryable: false, requiresHuman: true, resumable: false, terminal: true },
  approval_required: { retryable: false, requiresHuman: true, resumable: true, terminal: false },
  quota_paused: { retryable: false, requiresHuman: false, resumable: true, terminal: false },
  cancelled: { retryable: false, requiresHuman: false, resumable: false, terminal: true },
  timeout: { retryable: true, requiresHuman: false, resumable: true, terminal: false },
  interrupted: { retryable: true, requiresHuman: false, resumable: true, terminal: false },
  unknown_failure: { retryable: false, requiresHuman: true, resumable: false, terminal: true },
};

/** How each result code maps onto the kernel's existing ExecutionState. */
export const EXECUTION_STATE_FOR_CODE: Record<ExecutionResultCode, ExecutionState> = {
  success: "completed",
  retryable_failure: "retrying",
  permanent_failure: "failed",
  policy_denied: "failed",
  approval_required: "paused",
  quota_paused: "paused",
  cancelled: "cancelled",
  timeout: "failed",
  interrupted: "paused",
  unknown_failure: "failed",
};

export interface ExecutionResult {
  /** Contract version. */
  resultVersion: string;
  /** Stable machine-readable outcome code. */
  code: ExecutionResultCode;
  /** Human-readable explanation, safe to show to an operator. */
  summary: string;
  /** Optional longer explanation. Never contains credentials or learner data. */
  detail?: string;
  /** Derived from the policy table. */
  retryable: boolean;
  requiresHuman: boolean;
  resumable: boolean;
  terminal: boolean;
  /** Correlation id shared with the execution record. */
  correlationId: string;
  /** Attempt number, starting at 1. */
  attempt: number;
  jobId?: string;
  sessionId?: string;
  idempotencyKey?: string;
  /** References to artefacts or logs that evidence the outcome. */
  evidence?: string[];
  /** ISO-8601 timestamp of the outcome. */
  occurredAt: string;
}

export interface ExecutionResultInput {
  code: ExecutionResultCode;
  summary: string;
  detail?: string;
  correlationId: string;
  attempt?: number;
  jobId?: string;
  sessionId?: string;
  idempotencyKey?: string;
  evidence?: string[];
  occurredAt?: string;
}

export function executionStateForCode(code: ExecutionResultCode): ExecutionState {
  return EXECUTION_STATE_FOR_CODE[code];
}

export function isSupportedExecutionResultVersion(version: unknown): boolean {
  return (
    typeof version === "string" &&
    SUPPORTED_EXECUTION_RESULT_VERSIONS.includes(version)
  );
}

/**
 * Build a result. Every policy flag is derived from the policy table, so a
 * caller cannot declare a retryable permanent failure.
 */
export function createExecutionResult(
  input: ExecutionResultInput,
): ExecutionResult {
  const policy = EXECUTION_RESULT_POLICY[input.code];
  return {
    resultVersion: EXECUTION_RESULT_VERSION,
    code: input.code,
    summary: input.summary,
    ...(input.detail !== undefined ? { detail: input.detail } : {}),
    retryable: policy.retryable,
    requiresHuman: policy.requiresHuman,
    resumable: policy.resumable,
    terminal: policy.terminal,
    correlationId: input.correlationId,
    attempt: input.attempt ?? 1,
    ...(input.jobId !== undefined ? { jobId: input.jobId } : {}),
    ...(input.sessionId !== undefined ? { sessionId: input.sessionId } : {}),
    ...(input.idempotencyKey !== undefined
      ? { idempotencyKey: input.idempotencyKey }
      : {}),
    ...(input.evidence !== undefined ? { evidence: input.evidence } : {}),
    occurredAt: input.occurredAt ?? new Date().toISOString(),
  };
}

/**
 * Classify an arbitrary outcome into a result code.
 *
 * Fail-closed: anything that is not a recognised, explicitly-safe outcome
 * becomes `unknown_failure`, which is not retryable, requires a human and is
 * terminal. An unknown error is never mapped to success, and never to a
 * retryable failure.
 */
export function classifyExecutionOutcome(
  outcome: unknown,
): ExecutionResultCode {
  if (typeof outcome === "string") {
    const normalised = outcome.trim().toLowerCase();
    if (isExecutionResultCode(normalised)) return normalised;
    return "unknown_failure";
  }
  if (outcome && typeof outcome === "object") {
    const code = (outcome as { code?: unknown }).code;
    if (typeof code === "string" && isExecutionResultCode(code.trim().toLowerCase())) {
      return code.trim().toLowerCase() as ExecutionResultCode;
    }
  }
  return "unknown_failure";
}

export function isExecutionResultCode(value: unknown): value is ExecutionResultCode {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(EXECUTION_RESULT_POLICY, value)
  );
}

/**
 * Validate a result received from elsewhere (for example a remote agent).
 * Returns the reasons it is not acceptable; an empty array means it is
 * acceptable.
 */
export function validateExecutionResult(result: unknown): string[] {
  const errors: string[] = [];

  if (!result || typeof result !== "object" || Array.isArray(result)) {
    return ["result must be an object"];
  }
  const candidate = result as Partial<ExecutionResult>;

  if (!isSupportedExecutionResultVersion(candidate.resultVersion)) {
    errors.push(
      `resultVersion ${String(candidate.resultVersion)} is not supported; supported: ${SUPPORTED_EXECUTION_RESULT_VERSIONS.join(", ")}`,
    );
  }
  if (!isExecutionResultCode(candidate.code)) {
    errors.push(`code ${String(candidate.code)} is not a recognised result code`);
  }
  if (typeof candidate.summary !== "string" || candidate.summary.length === 0) {
    errors.push("summary must be a non-empty string");
  }
  if (typeof candidate.correlationId !== "string" || candidate.correlationId.length === 0) {
    errors.push("correlationId must be a non-empty string");
  }
  if (
    typeof candidate.attempt !== "number" ||
    !Number.isInteger(candidate.attempt) ||
    candidate.attempt < 1
  ) {
    errors.push("attempt must be an integer of at least 1");
  }
  if (typeof candidate.occurredAt !== "string" || candidate.occurredAt.length === 0) {
    errors.push("occurredAt must be an ISO-8601 timestamp");
  }

  if (isExecutionResultCode(candidate.code)) {
    const policy = EXECUTION_RESULT_POLICY[candidate.code];
    if (candidate.retryable !== policy.retryable) {
      errors.push(`retryable must be ${policy.retryable} for code ${candidate.code}`);
    }
    if (candidate.requiresHuman !== policy.requiresHuman) {
      errors.push(
        `requiresHuman must be ${policy.requiresHuman} for code ${candidate.code}`,
      );
    }
    if (candidate.resumable !== policy.resumable) {
      errors.push(`resumable must be ${policy.resumable} for code ${candidate.code}`);
    }
    if (candidate.terminal !== policy.terminal) {
      errors.push(`terminal must be ${policy.terminal} for code ${candidate.code}`);
    }
  }

  return errors;
}
