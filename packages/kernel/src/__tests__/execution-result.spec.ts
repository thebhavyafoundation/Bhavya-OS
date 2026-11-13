import { describe, expect, it } from "vitest";

import {
  EXECUTION_RESULT_POLICY,
  EXECUTION_RESULT_VERSION,
  SUPPORTED_EXECUTION_RESULT_VERSIONS,
  classifyExecutionOutcome,
  createExecutionResult,
  executionStateForCode,
  isExecutionResultCode,
  isSupportedExecutionResultVersion,
  validateExecutionResult,
  type ExecutionResultCode,
} from "../execution/result.js";

const ALL_CODES: ExecutionResultCode[] = [
  "success",
  "retryable_failure",
  "permanent_failure",
  "policy_denied",
  "approval_required",
  "quota_paused",
  "cancelled",
  "timeout",
  "interrupted",
  "unknown_failure",
];

describe("execution result policy", () => {
  it("defines a policy for every documented code and nothing else", () => {
    expect(Object.keys(EXECUTION_RESULT_POLICY).sort()).toEqual(
      [...ALL_CODES].sort(),
    );
  });

  it("maps every code onto an existing kernel execution state", () => {
    const states = new Set(
      ALL_CODES.map((code) => executionStateForCode(code)),
    );
    for (const state of states) {
      expect([
        "initializing",
        "running",
        "paused",
        "completed",
        "failed",
        "cancelled",
        "retrying",
      ]).toContain(state);
    }
    expect(executionStateForCode("success")).toBe("completed");
    expect(executionStateForCode("quota_paused")).toBe("paused");
    expect(executionStateForCode("cancelled")).toBe("cancelled");
  });

  it("never marks a permanent failure or a policy denial as retryable", () => {
    for (const code of ["permanent_failure", "policy_denied", "unknown_failure"]) {
      const policy = EXECUTION_RESULT_POLICY[code];
      expect(policy.retryable).toBe(false);
      expect(policy.requiresHuman).toBe(true);
      expect(policy.terminal).toBe(true);
    }
  });

  it("never lets an unknown failure be silently retried or resumed", () => {
    const policy = EXECUTION_RESULT_POLICY.unknown_failure;
    expect(policy.retryable).toBe(false);
    expect(policy.resumable).toBe(false);
    expect(policy.requiresHuman).toBe(true);
  });
});

describe("execution result construction", () => {
  it("derives every policy flag from the policy table", () => {
    for (const code of ALL_CODES) {
      const result = createExecutionResult({
        code,
        summary: `outcome: ${code}`,
        correlationId: "corr-1",
      });
      const policy = EXECUTION_RESULT_POLICY[code];
      expect(result.retryable).toBe(policy.retryable);
      expect(result.requiresHuman).toBe(policy.requiresHuman);
      expect(result.resumable).toBe(policy.resumable);
      expect(result.terminal).toBe(policy.terminal);
      expect(result.resultVersion).toBe(EXECUTION_RESULT_VERSION);
      expect(result.attempt).toBe(1);
    }
  });

  it("carries the correlation and attempt metadata", () => {
    const result = createExecutionResult({
      code: "retryable_failure",
      summary: "transient network error",
      correlationId: "corr-42",
      attempt: 3,
      jobId: "job-1",
      sessionId: "session-1",
      idempotencyKey: "job-1",
      evidence: ["artifact-1"],
    });
    expect(result.correlationId).toBe("corr-42");
    expect(result.attempt).toBe(3);
    expect(result.jobId).toBe("job-1");
    expect(result.sessionId).toBe("session-1");
    expect(result.idempotencyKey).toBe("job-1");
    expect(result.evidence).toEqual(["artifact-1"]);
  });

  it("produces a result that validates", () => {
    const result = createExecutionResult({
      code: "success",
      summary: "done",
      correlationId: "corr-1",
    });
    expect(validateExecutionResult(result)).toEqual([]);
  });
});

describe("execution result classification (fail closed)", () => {
  it("recognises a known code given as a string or as an object", () => {
    expect(classifyExecutionOutcome("success")).toBe("success");
    expect(classifyExecutionOutcome("  Retryable_Failure ")).toBe("retryable_failure");
    expect(classifyExecutionOutcome({ code: "quota_paused" })).toBe("quota_paused");
  });

  it("maps anything unrecognised to unknown_failure, never to success or a retry", () => {
    for (const outcome of [
      "nonsense",
      "",
      null,
      undefined,
      42,
      {},
      { code: "bogus" },
      { code: 7 },
      [1, 2, 3],
      new Error("boom"),
    ]) {
      expect(classifyExecutionOutcome(outcome)).toBe("unknown_failure");
    }
  });

  it("does not treat an Error instance as a retryable failure", () => {
    expect(classifyExecutionOutcome(new Error("boom"))).not.toBe("retryable_failure");
    expect(classifyExecutionOutcome(new Error("boom"))).not.toBe("success");
  });
});

describe("execution result validation (negative and boundary)", () => {
  const base = () =>
    createExecutionResult({
      code: "success",
      summary: "done",
      correlationId: "corr-1",
    });

  it("rejects a non-object", () => {
    for (const value of ["x", 42, null, undefined, []]) {
      expect(validateExecutionResult(value).length).toBeGreaterThan(0);
    }
  });

  it("rejects an unsupported contract version", () => {
    const result = { ...base(), resultVersion: "2.0.0" };
    expect(validateExecutionResult(result).join(" ")).toMatch(/resultVersion/);
    expect(isSupportedExecutionResultVersion("2.0.0")).toBe(false);
    expect(isSupportedExecutionResultVersion("1.0.0")).toBe(true);
    expect(SUPPORTED_EXECUTION_RESULT_VERSIONS).toContain(EXECUTION_RESULT_VERSION);
  });

  it("rejects an unknown code", () => {
    const result = { ...base(), code: "not_a_code" };
    expect(validateExecutionResult(result).join(" ")).toMatch(/not a recognised result code/);
    expect(isExecutionResultCode("not_a_code")).toBe(false);
  });

  it("accepts attempt 1 and rejects anything below it", () => {
    expect(validateExecutionResult({ ...base(), attempt: 1 })).toEqual([]);
    for (const attempt of [0, -1, 1.5, Number.NaN]) {
      expect(
        validateExecutionResult({ ...base(), attempt }).join(" "),
      ).toMatch(/attempt/);
    }
  });

  it("rejects a missing summary, correlation id or timestamp", () => {
    expect(validateExecutionResult({ ...base(), summary: "" }).join(" ")).toMatch(/summary/);
    expect(
      validateExecutionResult({ ...base(), correlationId: "" }).join(" "),
    ).toMatch(/correlationId/);
    expect(
      validateExecutionResult({ ...base(), occurredAt: "" }).join(" "),
    ).toMatch(/occurredAt/);
  });
});

describe("execution result validation (mutation)", () => {
  const base = () =>
    createExecutionResult({
      code: "permanent_failure",
      summary: "failed for good",
      correlationId: "corr-1",
    });

  it("rejects a result whose retryable flag was flipped", () => {
    const mutated = { ...base(), retryable: true };
    expect(validateExecutionResult(mutated).join(" ")).toMatch(/retryable must be false/);
  });

  it("rejects a result whose code was changed without updating its flags", () => {
    const mutated = { ...base(), code: "retryable_failure" as ExecutionResultCode };
    expect(validateExecutionResult(mutated).length).toBeGreaterThan(0);
  });

  it("rejects a result that claims a human is not needed for an unknown failure", () => {
    const unknown = createExecutionResult({
      code: "unknown_failure",
      summary: "unclassified",
      correlationId: "corr-1",
    });
    const mutated = { ...unknown, requiresHuman: false };
    expect(validateExecutionResult(mutated).join(" ")).toMatch(/requiresHuman must be true/);
  });

  it("rejects a result that claims a permanent failure is resumable", () => {
    const mutated = { ...base(), resumable: true };
    expect(validateExecutionResult(mutated).join(" ")).toMatch(/resumable must be false/);
  });
});
