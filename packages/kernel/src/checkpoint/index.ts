// Checkpoint envelope with integrity verification.

// Long-running executions need a resumable record: which job and attempt it
// belongs to, what already completed, what evidence exists, what is pending
// approval, and which actions must never be replayed automatically.

// Mission Control stores pointers (`path`, `hash`) rather than a document
// body, so this module defines the payload and its integrity contract without
// changing that schema.

// INTEGRITY TARGET: `serializeCheckpoint` writes a document whose `payloadHash`
// member is the SHA-256 of `canonicalize(envelope)` — the canonical string of
// the inner envelope, NOT of the document that contains it. A store must keep
// exactly that value in its hash column.

// FAIL-CLOSED: tampering, an unsupported version, a missing identity field, a
// malformed array or hash, an unknown external state, or a do-not-replay list
// naming an idempotent action are all rejected.

// Pure (node:crypto only) and additive.

import { createHash } from "node:crypto";

import { classifyAction } from "../replay/safety.js";

export const CHECKPOINT_VERSION = "1.0.0";

/** Versions this implementation can read. */
export const SUPPORTED_CHECKPOINT_VERSIONS = ["1.0.0"];

export type ExternalState = "unknown" | "not-applied" | "applied";

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
   * Anything other than "not-applied" is treated as unknown.
   */
  externalState: ExternalState;
}

export interface CheckpointEnvelope {
  checkpointVersion: string;
  jobId: string;
  sessionId: string;
  attempt: number;
  producer?: string;
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
  producer?: string;
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

export interface CheckpointVerification {
  valid: boolean;
  envelope?: CheckpointEnvelope;
  errors: string[];
}

const COMMIT_SHA = /^[0-9a-f]{40}$/i;
const ARTIFACT_SHA = /^[0-9a-f]{64}$/i;
const EXTERNAL_STATES: ExternalState[] = ["unknown", "not-applied", "applied"];

function isString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Stable serialisation: object keys are emitted in sorted order and
 * undefined / NaN / Infinity are rejected rather than silently coerced, so a
 * top-level value or array element of those kinds cannot canonicalise to the
 * same string as a null. (An object property whose value is undefined is still
 * dropped, so `{a: undefined}` and `{}` share a canonical form.)
 */
export function canonicalize(value: unknown): string {
  if (value === undefined) {
    throw new TypeError("cannot canonicalize undefined");
  }
  if (typeof value === "number" && !Number.isFinite(value)) {
    throw new TypeError("cannot canonicalize a non-finite number");
  }
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
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
    producer: input.producer,
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

/** Serialise an envelope with its integrity hash. */
export function serializeCheckpoint(envelope: CheckpointEnvelope): string {
  const payload = canonicalize(envelope);
  return canonicalize({
    checkpoint: envelope,
    payloadHash: sha256(payload),
  });
}

/**
 * Verify a serialised checkpoint. Fails closed on every integrity, version,
 * identity, shape and resume-safety problem.
 */
export function verifyCheckpoint(serialized: string): CheckpointVerification {
  const errors: string[] = [];

  let parsed: { checkpoint?: unknown; payloadHash?: unknown };
  try {
    parsed = JSON.parse(serialized);
  } catch {
    return { valid: false, errors: ["checkpoint is not valid JSON"] };
  }

  const raw = parsed.checkpoint;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { valid: false, errors: ["checkpoint envelope is missing or malformed"] };
  }
  const envelope = raw as CheckpointEnvelope;
  const payloadHash = parsed.payloadHash;

  if (typeof payloadHash !== "string" || payloadHash.length === 0) {
    return { valid: false, errors: ["checkpoint integrity hash is missing"] };
  }

  let expectedHash: string;
  try {
    expectedHash = sha256(canonicalize(envelope));
  } catch (error) {
    return {
      valid: false,
      errors: [`checkpoint payload cannot be canonicalised: ${(error as Error).message}`],
    };
  }
  if (expectedHash !== payloadHash) {
    errors.push("checkpoint integrity hash does not match its payload");
  }

  if (!SUPPORTED_CHECKPOINT_VERSIONS.includes(envelope.checkpointVersion)) {
    errors.push(
      `unsupported checkpoint version ${String(envelope.checkpointVersion)}; supported: ${SUPPORTED_CHECKPOINT_VERSIONS.join(", ")}`,
    );
  }

  for (const field of ["jobId", "sessionId", "idempotencyKey", "currentStep"] as const) {
    if (!isString(envelope[field])) {
      errors.push(`checkpoint is missing required field ${field}`);
    }
  }

  if (!isFiniteNumber(envelope.attempt) || !Number.isInteger(envelope.attempt) || envelope.attempt < 1) {
    errors.push("checkpoint attempt must be an integer of at least 1");
  }

  for (const field of ["completedSteps", "artifacts", "testResults", "pendingApprovals"] as const) {
    if (!Array.isArray(envelope[field])) {
      errors.push(`checkpoint ${field} must be an array`);
    }
  }

  if (Array.isArray(envelope.artifacts)) {
    for (const artifact of envelope.artifacts) {
      if (!artifact || typeof artifact !== "object") {
        errors.push("checkpoint artifact entries must be objects");
        continue;
      }
      if (!isString(artifact.artifactId) || !isString(artifact.path)) {
        errors.push("checkpoint artifact entries need an artifactId and a path");
      }
      if (!isFiniteNumber(artifact.version) || !Number.isInteger(artifact.version)) {
        errors.push("checkpoint artifact version must be an integer");
      }
      if (!isString(artifact.hash) || !ARTIFACT_SHA.test(artifact.hash)) {
        errors.push("checkpoint artifact hash must be a 64-character hex digest");
      }
    }
  }

  if (envelope.commitSha !== undefined && !COMMIT_SHA.test(envelope.commitSha)) {
    errors.push("checkpoint commitSha must be a full 40-character commit SHA");
  }

  const recovery = envelope.recovery;
  if (!recovery || typeof recovery !== "object") {
    errors.push("checkpoint recovery block is missing");
  } else {
    if (!isString(recovery.resumeAt)) {
      errors.push("checkpoint recovery.resumeAt is missing");
    }
    if (!isString(recovery.instructions)) {
      errors.push("checkpoint recovery.instructions are missing");
    }
    if (!Array.isArray(recovery.doNotReplay)) {
      errors.push("checkpoint recovery.doNotReplay must be an array");
    } else {
      for (const action of recovery.doNotReplay) {
        if (!isString(action)) {
          errors.push("checkpoint recovery.doNotReplay entries must be non-empty strings");
          continue;
        }
        if (classifyAction(action).safety === "idempotent") {
          errors.push(
            `checkpoint recovery.doNotReplay lists "${action}", which is idempotent and must not be on a do-not-replay list`,
          );
        }
      }
    }
    if (!Array.isArray(recovery.inspectBeforeReplay)) {
      errors.push("checkpoint recovery.inspectBeforeReplay must be an array");
    } else {
      for (const action of recovery.inspectBeforeReplay) {
        if (!isString(action)) {
          errors.push(
            "checkpoint recovery.inspectBeforeReplay entries must be non-empty strings",
          );
          continue;
        }
        if (classifyAction(action).safety === "unsafe") {
          errors.push(
            `checkpoint recovery.inspectBeforeReplay lists "${action}", which is unsafe to repeat; it belongs in doNotReplay`,
          );
        }
      }
    }
    if (!EXTERNAL_STATES.includes(recovery.externalState)) {
      errors.push(
        `checkpoint recovery.externalState must be one of ${EXTERNAL_STATES.join(", ")}`,
      );
    } else if (
      recovery.externalState !== "not-applied" &&
      Array.isArray(recovery.doNotReplay) &&
      recovery.doNotReplay.length > 0
    ) {
      errors.push(
        "checkpoint cannot be resumed automatically: external state is not 'not-applied' while doNotReplay is non-empty",
      );
    }
  }

  return {
    valid: errors.length === 0,
    envelope: errors.length === 0 ? envelope : undefined,
    errors,
  };
}

/**
 * True when the checkpoint may be resumed without further inspection.
 * Any malformed recovery block answers false rather than throwing.
 */
export function isResumable(checkpoint: CheckpointEnvelope): boolean {
  const recovery = checkpoint?.recovery;
  if (!recovery || typeof recovery !== "object") return false;
  if (!Array.isArray(recovery.doNotReplay)) return false;
  if (!EXTERNAL_STATES.includes(recovery.externalState)) return false;
  if (recovery.externalState !== "not-applied" && recovery.doNotReplay.length > 0) {
    return false;
  }
  return true;
}
