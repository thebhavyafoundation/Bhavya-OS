import { describe, expect, it } from "vitest";

import {
  CHECKPOINT_VERSION,
  canonicalize,
  createCheckpoint,
  isResumable,
  serializeCheckpoint,
  sha256,
  verifyCheckpoint,
  type CheckpointInput,
} from "../checkpoint/index.js";

/**
 * GAP D characterisation.
 *
 * The Mission Control store holds pointers (`path`, `hash`) rather than a
 * document body, so the checkpoint payload and its integrity contract live
 * here. These specifications prove the fail-closed behaviour: tampering,
 * incompatible versions, missing identity and unknown external state are all
 * refused.
 */
const baseInput = (): CheckpointInput => ({
  jobId: "job-1",
  sessionId: "session-1",
  attempt: 1,
  idempotencyKey: "job-1",
  currentStep: "verify-remote",
  branch: "chore/example",
  commitSha: "a".repeat(40),
  completedSteps: ["plan", "implement", "test-local"],
  artifacts: [
    { artifactId: "artifact-1", version: 2, path: "evidence/report.json", hash: "b".repeat(64) },
  ],
  testResults: [{ suite: "pnpm platform:check", result: "pass" as const }],
  pendingApprovals: ["approval-1"],
  recovery: {
    resumeAt: "verify-remote",
    instructions: "Re-run the remote verification, then request review.",
    doNotReplay: ["deploy"],
    inspectBeforeReplay: ["pr-create"],
    externalState: "not-applied",
  },
});

describe("checkpoint envelope", () => {
  it("round-trips through serialisation and verification", () => {
    const envelope = createCheckpoint(baseInput());
    const serialized = serializeCheckpoint(envelope);
    const result = verifyCheckpoint(serialized);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.envelope?.jobId).toBe("job-1");
    expect(result.envelope?.sessionId).toBe("session-1");
    expect(result.envelope?.attempt).toBe(1);
    expect(result.envelope?.completedSteps).toEqual(["plan", "implement", "test-local"]);
    expect(result.envelope?.currentStep).toBe("verify-remote");
    expect(result.envelope?.pendingApprovals).toEqual(["approval-1"]);
    expect(result.envelope?.artifacts?.[0]?.hash).toBe("b".repeat(64));
    expect(result.envelope?.checkpointVersion).toBe(CHECKPOINT_VERSION);
  });

  it("produces a stable hash regardless of key insertion order", () => {
    const first = canonicalize({ a: 1, b: { c: 2, d: 3 } });
    const second = canonicalize({ b: { d: 3, c: 2 }, a: 1 });
    expect(first).toBe(second);
    expect(sha256(first)).toBe(sha256(second));
  });

  it("rejects a tampered payload", () => {
    const serialized = serializeCheckpoint(createCheckpoint(baseInput()));
    const parsed = JSON.parse(serialized);
    parsed.checkpoint.currentStep = "deploy-production";
    const result = verifyCheckpoint(JSON.stringify(parsed));

    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/integrity hash/i);
  });

  it("rejects an incompatible checkpoint version", () => {
    const envelope = createCheckpoint(baseInput());
    envelope.checkpointVersion = "2.0.0";
    const result = verifyCheckpoint(serializeCheckpoint(envelope));

    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/unsupported checkpoint version/i);
  });

  it("rejects a checkpoint without identity fields", () => {
    const envelope = createCheckpoint(baseInput());
    (envelope as { jobId: string }).jobId = "";
    const result = verifyCheckpoint(serializeCheckpoint(envelope));

    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/jobId/);
  });

  it("rejects a non-integer or non-positive attempt", () => {
    const envelope = createCheckpoint(baseInput());
    envelope.attempt = 0;
    const result = verifyCheckpoint(serializeCheckpoint(envelope));

    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/attempt/i);
  });

  it("rejects a malformed commit sha", () => {
    const envelope = createCheckpoint(baseInput());
    envelope.commitSha = "abc";
    const result = verifyCheckpoint(serializeCheckpoint(envelope));

    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/commitSha/i);
  });

  it("refuses to resume when external state is unknown and an action must not be replayed", () => {
    const input = baseInput();
    input.recovery.externalState = "unknown";
    const envelope = createCheckpoint(input);
    const result = verifyCheckpoint(serializeCheckpoint(envelope));

    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/external state is not 'not-applied'/i);
    expect(isResumable(envelope)).toBe(false);
  });

  it("resumes when external state is known and no action forbids replay", () => {
    const input = baseInput();
    input.recovery.doNotReplay = [];
    const envelope = createCheckpoint(input);
    const result = verifyCheckpoint(serializeCheckpoint(envelope));

    expect(result.valid).toBe(true);
    expect(isResumable(envelope)).toBe(true);
  });

  it("rejects malformed input that is not valid JSON", () => {
    const result = verifyCheckpoint("not json at all");
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/not valid JSON/i);
  });

  it("rejects an unrecognised external state spelling", () => {
    for (const spelling of ["Unknown", "UNKNOWN", "banana", "", null]) {
      const envelope = createCheckpoint(baseInput());
      (envelope.recovery as { externalState: unknown }).externalState = spelling;
      const result = verifyCheckpoint(serializeCheckpoint(envelope));
      expect(result.valid).toBe(false);
      expect(result.errors.join(" ")).toMatch(/externalState/);
    }
  });
  it("refuses a do-not-replay list that names an idempotent action", () => {
    const input = baseInput();
    input.recovery.doNotReplay = ["read"];
    const result = verifyCheckpoint(serializeCheckpoint(createCheckpoint(input)));
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/idempotent/i);
  });

  it("refuses an inspect-before-replay list that names an unsafe action", () => {
    const input = baseInput();
    input.recovery.inspectBeforeReplay = ["deploy"];
    const result = verifyCheckpoint(serializeCheckpoint(createCheckpoint(input)));
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/doNotReplay/);
  });

  it("rejects a malformed artefact hash and wrong-typed collections", () => {
    const envelope = createCheckpoint(baseInput());
    envelope.artifacts = [{ artifactId: "a", version: 1, path: "p", hash: "short" }];
    (envelope as { completedSteps: unknown }).completedSteps = "plan";
    const result = verifyCheckpoint(serializeCheckpoint(envelope));
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/hash|completedSteps/);
  });

  it("answers false rather than throwing for a malformed recovery block", () => {
    const envelope = createCheckpoint(baseInput());
    (envelope as { recovery: unknown }).recovery = { resumeAt: "x" };
    expect(isResumable(envelope)).toBe(false);
  });

  it("refuses to canonicalise undefined or non-finite numbers", () => {
    expect(() => canonicalize(undefined)).toThrow();
    expect(() => canonicalize(Number.NaN)).toThrow();
    expect(() => canonicalize([undefined])).toThrow();
    expect(canonicalize([null])).not.toBe(canonicalize([1]));
  });
});
