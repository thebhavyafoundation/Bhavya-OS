// Checkpoint envelope with integrity verification.
//
// WHY THIS EXISTS
// ---------------
// Long-running executions need a resumable record: which job and attempt it
// belongs to, what already completed, what evidence exists, what is pending
// approval, and which actions must never be replayed automatically.
//
// The Mission Control store (`mc_artifact_versions`) holds pointers (`path`,
// `hash`) rather than a document body, so this module defines the payload
// and its integrity contract without changing that schema: the envelope
// serialises to a canonical JSON string whose SHA-256 is the hash a store
// would keep alongside it.
//
// Fail-closed rules:
//  - a checkpoint whose hash does not match its payload is rejected;
//  - a checkpoint whose version is not compatible is rejected;
//  - a checkpoint whose external state is unknown is rejected for resumption
//    when it carries actions that must not be replayed.
//
// Pure and dependency-free: `node:crypto` only. Additive: no existing module
// is modified and no consumer changes.

import { createHash } from "node:crypto";

export const CHECKPOINT_VERSION = "1.0.0";

/** Versions this implementation can read. */
export const SUPPORTED_CHECKPOINT_VERSIONS = ["1.0.0"];

export interface CheckpointArtifactRef {
  artifactId: string;
  version: number;
  path: string;
  hash: string;
}

export interface CheckpointTestResult {
  suite: string;
  result: "pass" | "fail" | "skipped";
  evidenceArtifactId?: string;
}

export interface CheckpointRecovery {
  /** Step to resume at. */
  resumeAt: string;
  /** Human-readable recovery instructions. */
  instructions: string;
  /** Actions that must never be re-executed automatically. */
  doNotReplay: string[];
  /** Actions whose effect must be inspected before a retry. */
  inspectBeforeReplay: string[];
  /**
   * Whether the caller knows the external state of the recorded actions.
   * "unknown" is the safe default and blocks resumption of non-replayable work.
   */
  externalState: "unknown" | "not-applied" | "applied";
}

export interface CheckpointEnvelope {
  checkpointVersion: string;
  jobId: string;
  sessionId: string;
  attempt: number;
  idempotencyKey: string;
  completedSteps: string[];
  currentStep: string;
  branch?: string;
  commitSha?: string;
  artifacts: CheckpointArtifactRef[];
  testResults: CheckpointTestResult[];
  pendingApprovals: string[];
  recovery: CheckpointRecovery;
  createdAt: string;
}

export interface CheckpointInput {
  jobId: string;
  sessionId: string;
  attempt: number;
  idempotencyKey: string;
  completedSteps?: string[];
  currentStep: string;
  branch?: string;
  commitSha?: string;
  artifacts?: CheckpointArtifactRef[];
  testResults?: CheckpointTestResult[];
  pendingApprovals?: string[];
  recovery: CheckpointRecovery;
  createdAt?: string;
}

/** Stable serialisation: object keys are emitted in sorted order. */
export function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value ?? null);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalize(item)).join(",")}]`;
  }
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, item]) => item !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return `{${entries
    .map(([key, item]) => `${JSON.stringify(key)}:${canonicalize(item)}`)
    .join(",")}}`;
}

export function sha256(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

export function createCheckpoint(input: CheckpointInput): CheckpointEnvelope {
  return {
    checkpointVersion: CHECKPOINT_VERSION,
    jobId: input.jobId,
    sessionId: input.sessionId,
    attempt: input.attempt,
    idempotencyKey: input.idempotencyKey,
    completedSteps: input.completedSteps ?? [],
    currentStep: input.currentStep,
    branch: input.branch,
    commitSha: input.commitSha,
    artifacts: input.artifacts ?? [],
    testResults: input.testResults ?? [],
    pendingApprovals: input.pendingApprovals ?? [],
    recovery: input.recovery,
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
}

/** Serialise an envelope with an integrity hash appended. */
export function serializeCheckpoint(envelope: CheckpointEnvelope): string {
  const payload = canonicalize(envelope);
  return canonicalize({
    checkpoint: envelope,
    payloadHash: sha256(payload),
  });
}

export interface CheckpointVerification {
  valid: boolean;
  envelope?: CheckpointEnvelope;
  errors: string[];
}

const COMMIT_SHA = /^[0-9a-f]{40}$/i;

/**
 * Verify a serialised checkpoint. Fails closed on every integrity, version or
 * identity problem, and refuses resumption when the external state of a
 * non-replayable action is unknown.
 */
export function verifyCheckpoint(serialized: string): CheckpointVerification {
  const errors: string[] = [];

  let parsed: { checkpoint?: CheckpointEnvelope; payloadHash?: string };
  try {
    parsed = JSON.parse(serialized);
  } catch {
    return { valid: false, errors: ["checkpoint is not valid JSON"] };
  }

  const envelope = parsed.checkpoint;
  const payloadHash = parsed.payloadHash;

  if (!envelope) {
    return { valid: false, errors: ["checkpoint envelope is missing"] };
  }
  if (typeof payloadHash !== "string" || payloadHash.length === 0) {
    return { valid: false, errors: ["checkpoint integrity hash is missing"] };
  }

  const expectedHash = sha256(canonicalize(envelope));
  if (expectedHash !== payloadHash) {
    errors.push("checkpoint integrity hash does not match its payload");
  }

  if (!SUPPORTED_CHECKPOINT_VERSIONS.includes(envelope.checkpointVersion)) {
    errors.push(
      `unsupported checkpoint version ${envelope.checkpointVersion ?? "(none)"}; supported: ${SUPPORTED_CHECKPOINT_VERSIONS.join(", ")}`,
    );
  }

  for (const field of ["jobId", "sessionId", "idempotencyKey", "currentStep"] as const) {
    if (!envelope[field]) {
      errors.push(`checkpoint is missing required field ${field}`);
    }
  }

  if (typeof envelope.attempt !== "number" || !Number.isInteger(envelope.attempt) || envelope.attempt < 1) {
    errors.push("checkpoint attempt must be an integer of at least 1");
  }

  if (envelope.commitSha && !COMMIT_SHA.test(envelope.commitSha)) {
    errors.push("checkpoint commitSha must be a full 40-character commit SHA");
  }

  const recovery = envelope.recovery;
  if (!recovery) {
    errors.push("checkpoint recovery block is missing");
  } else {
    if (!recovery.resumeAt) {
      errors.push("checkpoint recovery.resumeAt is missing");
    }
    if (!Array.isArray(recovery.doNotReplay)) {
      errors.push("checkpoint recovery.doNotReplay must be an array");
    }
    if (!Array.isArray(recovery.inspectBeforeReplay)) {
      errors.push("checkpoint recovery.inspectBeforeReplay must be an array");
    }
    if (
      recovery.externalState === "unknown" &&
      Array.isArray(recovery.doNotReplay) &&
      recovery.doNotReplay.length > 0
    ) {
      errors.push(
        "checkpoint cannot be resumed automatically: external state is unknown while doNotReplay is non-empty",
      );
    }
  }

  return {
    valid: errors.length === 0,
    envelope: errors.length === 0 ? envelope : undefined,
    errors,
  };
}

/** True when the checkpoint may be resumed without further inspection. */
export function isResumable(checkpoint: CheckpointEnvelope): boolean {
  const recovery = checkpoint.recovery;
  if (!recovery) return false;
  if (recovery.externalState === "unknown" && recovery.doNotReplay.length > 0) {
    return false;
  }
  return true;
}
