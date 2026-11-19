// Replay safety classification.
//
// `ReplayEngine.replay` re-emits every recorded event through `events.emit`.
// It has no notion of which events carried an external side effect and never
// consults the idempotency ledger, so replaying an execution that deployed,
// published or merged can repeat that effect.
//
// This module classifies actions and provides fail-closed guards so a caller
// can decide, BEFORE replaying, which recorded actions may be re-emitted. The
// default is refusal: an action that is not explicitly known to be idempotent
// is treated as unsafe. Pure and dependency-free; additive (no existing
// behaviour or consumer changes).

export type ActionSafetyClass =
  /** Re-executing produces the same effect and is safe to replay. */
  | "idempotent"
  /** Re-executing may be safe, but only after external state is inspected. */
  | "verifiable"
  /** Re-executing may repeat an irreversible external effect. Never automatic. */
  | "unsafe";

export interface ActionClassification {
  action: string;
  safety: ActionSafetyClass;
  /** True when the action's effect can only be judged by inspecting a provider. */
  requiresExternalStateEvidence: boolean;
  reason: string;
}

/**
 * Actions that are safe to re-execute without inspecting anything. Kept
 * deliberately small: the safe default is refusal.
 */
const IDEMPOTENT_ACTIONS = new Set([
  "read",
  "list",
  "get",
  "status",
  "diff",
  "lint",
  "typecheck",
  "test",
  "build",
  "format",
  "analyse",
  "analyze",
  "inspect",
  "validate",
  "plan",
  "classify",
  "select",
  "http_get",
  "static_check",
]);

/**
 * Actions whose effect is externally visible and can be inspected before a
 * retry: creating a branch, opening a pull request, uploading an artefact.
 */
const VERIFIABLE_ACTIONS = new Set([
  "branch-create",
  "pr-create",
  "pr-comment",
  "artefact-upload",
  "artifact-upload",
  "checkpoint-write",
  "issue-create",
]);

/**
 * Actions with irreversible or externally charged effects. Never replayed
 * automatically, regardless of what a recorded execution did. One-shot
 * actions (approval consumption, quota-consuming retry) are deliberately
 * included here: they are unsafe to repeat, so they belong in this class.
 */
const UNSAFE_ACTIONS = new Set([
  "deploy",
  "vercel deploy",
  "wrangler deploy",
  "preview-deploy",
  "production-deploy",
  "promote",
  "publish",
  "merge",
  "migrate",
  "migration",
  "credential-set",
  "permission-grant",
  "secret-write",
  "payment",
  "notify-person",
  "delete",
  "purge",
  "force-push",
  "branch-delete",
  "approve",
  "decide",
  "retry-quota",
]);

/** Classify an action name. Unknown or non-string actions fail closed as "unsafe". */
export function classifyAction(action: unknown): ActionClassification {
  if (typeof action !== "string" || action.trim().length === 0) {
    return {
      action: String(action),
      safety: "unsafe",
      requiresExternalStateEvidence: true,
      reason: "action is not a usable string; unknown actions fail closed",
    };
  }

  const normalized = action.trim().toLowerCase();

  if (IDEMPOTENT_ACTIONS.has(normalized)) {
    return {
      action: normalized,
      safety: "idempotent",
      requiresExternalStateEvidence: false,
      reason: "action is on the idempotent allow-list",
    };
  }

  if (VERIFIABLE_ACTIONS.has(normalized)) {
    return {
      action: normalized,
      safety: "verifiable",
      requiresExternalStateEvidence: true,
      reason: "action has an externally visible effect that can be inspected before a retry",
    };
  }

  if (UNSAFE_ACTIONS.has(normalized)) {
    return {
      action: normalized,
      safety: "unsafe",
      requiresExternalStateEvidence: true,
      reason: "action may repeat an irreversible external effect",
    };
  }

  return {
    action: normalized,
    safety: "unsafe",
    requiresExternalStateEvidence: true,
    reason: "action is not on any allow-list; unknown actions fail closed",
  };
}

/** True only for actions that may be replayed without further inspection. */
export function isReplaySafe(action: unknown): boolean {
  return classifyAction(action).safety === "idempotent";
}

export class UnsafeReplayError extends Error {
  readonly classifications: ActionClassification[];

  constructor(message: string, classifications: ActionClassification[] = []) {
    super(message);
    this.name = "UnsafeReplayError";
    this.classifications = classifications;
  }
}

/**
 * Throw unless every supplied action is idempotent. Call this before
 * replaying a recorded execution.
 */
export function assertReplaySafe(actions: unknown[]): void {
  const classifications = actions.map((action) => classifyAction(action));
  const unsafe = classifications.filter((c) => c.safety !== "idempotent");
  if (unsafe.length > 0) {
    throw new UnsafeReplayError(
      `refusing to replay ${unsafe.length} non-idempotent action(s): ${unsafe
        .map((c) => c.action)
        .join(", ")}`,
      unsafe,
    );
  }
}

/**
 * Assert that a set of recorded actions may be replayed given the current
 * knowledge of external state.
 *
 * Fail-closed rules:
 *  - an unsafe action is never replayable automatically;
 *  - a verifiable action is replayable only when external state is known to
 *    be "not-applied" (the caller supplies that evidence);
 *  - an unknown action is never replayable;
 *  - an unknown external state blocks every action that needs evidence.
 */
export function assertReplayAllowed(
  actions: unknown[],
  externalState: "unknown" | "not-applied" | "applied",
): void {
  const classifications = actions.map((action) => classifyAction(action));

  const needsEvidence = classifications.some(
    (c) => c.requiresExternalStateEvidence,
  );
  if (externalState === "unknown" && needsEvidence) {
    throw new UnsafeReplayError(
      "refusing to replay: external state is unknown; escalate instead of acting",
      classifications,
    );
  }

  const unsafe = classifications.filter((c) => c.safety === "unsafe");
  if (unsafe.length > 0) {
    throw new UnsafeReplayError(
      `refusing to replay ${unsafe.length} unsafe action(s): ${unsafe
        .map((c) => c.action)
        .join(", ")}`,
      unsafe,
    );
  }

  const verifiable = classifications.filter((c) => c.safety === "verifiable");
  if (verifiable.length > 0 && externalState !== "not-applied") {
    throw new UnsafeReplayError(
      `refusing to replay ${verifiable.length} verifiable action(s) without evidence that they were not applied`,
      verifiable,
    );
  }
}
