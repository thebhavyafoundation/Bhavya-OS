import { describe, expect, it, vi } from "vitest";

import {
  UnsafeReplayError,
  assertReplayAllowed,
  assertReplaySafe,
  classifyAction,
  isReplaySafe,
} from "../replay/safety.js";
import { ReplayEngine } from "../replay/index.js";

/**
 * GAP C characterisation.
 *
 * `ReplayEngine.replay` re-emits every recorded event and has no notion of
 * side-effecting actions. These specifications pin that behaviour (so it
 * cannot change silently) and prove that the new guard refuses to authorise
 * the unsafe cases.
 */
describe("replay safety classification", () => {
  it("treats read-only actions as idempotent", () => {
    expect(classifyAction("read").safety).toBe("idempotent");
    expect(classifyAction("test").safety).toBe("idempotent");
    expect(classifyAction("build").safety).toBe("idempotent");
    expect(isReplaySafe("lint")).toBe(true);
  });

  it("treats externally visible, inspectable actions as verifiable", () => {
    const classification = classifyAction("pr-create");
    expect(classification.safety).toBe("verifiable");
    expect(classification.requiresExternalStateEvidence).toBe(true);
  });

  it("treats irreversible actions as unsafe", () => {
    for (const action of ["deploy", "publish", "merge", "migrate", "delete", "payment"]) {
      expect(classifyAction(action).safety).toBe("unsafe");
      expect(isReplaySafe(action)).toBe(false);
    }
  });

  it("fails closed for an action it does not know", () => {
    const classification = classifyAction("some-unrecorded-capability");
    expect(classification.safety).toBe("unsafe");
    expect(classification.reason).toMatch(/fail closed/i);
  });

  it("fails closed for a non-string action instead of throwing a TypeError", () => {
    for (const value of [null, undefined, 42, {}, []]) {
      expect(classifyAction(value).safety).toBe("unsafe");
      expect(isReplaySafe(value)).toBe(false);
    }
  });
});

describe("replay guard", () => {
  it("allows a replay of only idempotent actions", () => {
    expect(() => assertReplaySafe(["read", "test", "build"])).not.toThrow();
  });

  it("refuses a replay that includes an unsafe action", () => {
    expect(() => assertReplaySafe(["read", "deploy"])).toThrow(UnsafeReplayError);
    try {
      assertReplaySafe(["read", "deploy"]);
    } catch (error) {
      const unsafe = (error as UnsafeReplayError).classifications.map((c) => c.action);
      expect(unsafe).toContain("deploy");
      expect(unsafe).not.toContain("read");
    }
  });

  it("refuses an unsafe action even when external state says it was not applied", () => {
    expect(() => assertReplayAllowed(["deploy"], "not-applied")).toThrow(UnsafeReplayError);
  });

  it("refuses a verifiable action when external state is unknown", () => {
    expect(() => assertReplayAllowed(["pr-create"], "unknown")).toThrow(UnsafeReplayError);
  });

  it("refuses a verifiable action when external state shows it was already applied", () => {
    expect(() => assertReplayAllowed(["pr-create"], "applied")).toThrow(UnsafeReplayError);
  });

  it("allows a verifiable action only with evidence that it was not applied", () => {
    expect(() => assertReplayAllowed(["pr-create"], "not-applied")).not.toThrow();
  });

  it("allows idempotent actions without any external-state evidence", () => {
    expect(() => assertReplayAllowed(["read"], "unknown")).not.toThrow();
  });
});

describe("ReplayEngine hazard characterisation", () => {
  it("re-emits recorded events, so an un-guarded replay repeats side effects", async () => {
    const handler = vi.fn(async () => {});
    const history: Array<{ type: string; payload: Record<string, unknown>; context?: { executionId: string } }> = [
      {
        type: "deploy.completed",
        payload: { worker: "bhavya-foundation" },
        context: { executionId: "exec-1" },
      },
    ];

    const engine = new ReplayEngine({
      idempotency: {
        getExecution: async () => ({
          executionId: "exec-1",
          status: "failed",
          context: {
            executionId: "exec-1",
            state: "running",
            retryCount: 0,
            timestamps: {
              started: new Date(),
              lastUpdated: new Date(),
            },
          },
        } as never),
        updateExecution: async () => {},
      },
      events: {
        emit: async (type, payload) => {
          await handler(type, payload);
        },
        getHistory: () => history as never,
        on: () => () => {},
      },
      memory: {
        set: async () => {},
        get: async () => undefined,
      },
    });

    const result = await engine.replay("exec-1");

    // The engine really does re-emit the recorded event...
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith("deploy.completed", { worker: "bhavya-foundation" });
    expect(result.replayedEvents).toBe(1);

    // ...and the guard is what prevents that from being acceptable.
    expect(() => assertReplayAllowed(["deploy"], "unknown")).toThrow(UnsafeReplayError);
  });
});
