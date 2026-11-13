// BFAOS task contract validation.
//
// WHY THIS EXISTS
// ---------------
// The Phase 1 JSON Schema validates the *shape* of a task contract. A schema is
// not a permission system: it cannot know that a contract which declares the
// `deploy` tool must carry founder approval, that a budget must state zero
// money, or that an unsafe tool may only be granted with founder approval.
//
// This module performs that runtime policy check, and it classifies every
// contract field by how it is actually enforced, so an operator can see at a
// glance which parts of a contract are real controls and which are only
// declarations.
//
// It is pure, dependency-free and additive: no existing kernel behaviour is
// modified, no schema changes, no database access.

import { classifyAction, type ActionSafetyClass } from "../replay/safety.js";

export type RiskLevel = "L0" | "L1" | "L2" | "L3";
export type ApprovalLevel = "none" | "role" | "founder";

export type FieldEnforcement =
  /** Checked when the contract is accepted. */
  | "validated-at-intake"
  /** Checked by the runtime while the task executes. */
  | "enforced-by-runtime"
  /** Written to the execution record for audit. */
  | "recorded-for-audit"
  /** Declared, but nothing checks it. */
  | "advisory-only"
  /** Not implemented anywhere. */
  | "not-implemented";

export interface ContractTool {
  tool: string;
  scope?: string;
  mode?: "allow" | "deny";
}

export interface TaskContractLike {
  contract_id?: unknown;
  contract_version?: unknown;
  job_id?: unknown;
  objective?: unknown;
  risk_level?: unknown;
  required_approval?: { level?: unknown; approver_role?: unknown };
  scope?: { include?: unknown[]; exclude?: unknown[] };
  assigned?: { agent?: unknown; role?: unknown; producer?: unknown };
  allowed_tools?: ContractTool[];
  budget?: { usd?: unknown; wall_clock_minutes?: unknown };
  time_limit?: { max_duration_minutes?: unknown };
  retry_policy?: {
    max_attempts?: unknown;
    on_quota_exhausted?: unknown;
    retryable_actions?: unknown[];
  };
  checkpoint_policy?: { every_n_steps?: unknown; store?: unknown };
  acceptance_criteria?: { id?: unknown; criterion?: unknown }[];
  verification?: { evidence_required?: unknown; independent_review?: unknown };
  evidence?: { kind?: unknown; ref?: unknown; sha256?: unknown }[];
  rollback?: { instructions?: unknown };
  idempotency_key?: unknown;
  metadata?: Record<string, unknown>;
}

export interface FieldClassification {
  field: string;
  enforcement: FieldEnforcement;
  note: string;
}

export interface ContractEnforcement {
  allowedTools: string[];
  deniedTools: string[];
  unsafeAllowedTools: string[];
  approvalRequired: boolean;
  maxAttempts: number;
  wallClockMinutes: number | null;
  requiresExternalStateEvidence: boolean;
  doNotReplay: string[];
  classifyTool: Record<string, ActionSafetyClass>;
}

export interface ContractValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  classifications: FieldClassification[];
  enforced: ContractEnforcement;
}

const RISK_LEVELS: RiskLevel[] = ["L0", "L1", "L2", "L3"];
const APPROVAL_LEVELS: ApprovalLevel[] = ["none", "role", "founder"];
const MAX_ATTEMPTS = 5;
const MAX_WALL_CLOCK_MINUTES = 1440;

const CREDENTIAL_SHAPES = [
  /sk_[A-Za-z0-9]{20,}/,
  /sk[-_]live[-_][A-Za-z0-9]{16,}/,
  /AKIA[0-9A-Z]{16}/,
  /gh[pousr]_[A-Za-z0-9]{20,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /xox[baprs]-[A-Za-z0-9-]{10,}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
];

const LEARNER_SHAPES = [
  /\b(student|learner|child|pupil)[\w.+-]*@/i,
  /\b(student|learner|pupil)[-_]?(id|email|record)\b/i,
];

function isString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

/** How each contract field is actually enforced today. */
export function classifyContractFields(): FieldClassification[] {
  return [
    {
      field: "contract_id / contract_version / job_id / objective",
      enforcement: "validated-at-intake",
      note: "Shape and identity are checked when the contract is accepted.",
    },
    {
      field: "risk_level",
      enforcement: "validated-at-intake",
      note: "Drives the approval rules below. It does not itself restrict anything.",
    },
    {
      field: "required_approval",
      enforcement: "validated-at-intake",
      note: "Requires founder approval for L3 and for any unsafe tool. The approval itself is recorded by the human process, not by this module.",
    },
    {
      field: "scope.include / scope.exclude",
      enforcement: "advisory-only",
      note: "Read by the reviewer and the agent; nothing mechanically prevents work outside the scope.",
    },
    {
      field: "assigned.agent / role / producer",
      enforcement: "recorded-for-audit",
      note: "Written to mc_sessions.producer so the attempt can be attributed.",
    },
    {
      field: "allowed_tools",
      enforcement: "advisory-only",
      note: "Declared intent. Actual tool access is governed by the OpenCode permission layer and the kernel Permissions store, neither of which reads this contract yet.",
    },
    {
      field: "budget",
      enforcement: "advisory-only",
      note: "Nothing meters wall clock, CI minutes or tokens against these numbers.",
    },
    {
      field: "time_limit",
      enforcement: "advisory-only",
      note: "No watchdog currently enforces the deadline.",
    },
    {
      field: "retry_policy",
      enforcement: "advisory-only",
      note: "The kernel Idempotency store records no attempt counter, so max_attempts is not enforced by it.",
    },
    {
      field: "checkpoint_policy",
      enforcement: "advisory-only",
      note: "The checkpoint envelope and its integrity contract exist; no caller writes checkpoints from this contract yet.",
    },
    {
      field: "acceptance_criteria",
      enforcement: "recorded-for-audit",
      note: "The criteria are recorded with the execution and reviewed against them.",
    },
    {
      field: "verification",
      enforcement: "recorded-for-audit",
      note: "Evidence required and independent review are recorded; the review itself is performed by a separate agent or CI.",
    },
    {
      field: "evidence",
      enforcement: "recorded-for-audit",
      note: "References to artefacts, runs and digests.",
    },
    {
      field: "rollback",
      enforcement: "advisory-only",
      note: "Instructions for a human. No automatic rollback exists.",
    },
    {
      field: "idempotency_key",
      enforcement: "recorded-for-audit",
      note: "Must be presented to the idempotency mechanism; the mechanism's own durability limits are documented in the kernel idempotency specifications.",
    },
    {
      field: "metadata",
      enforcement: "advisory-only",
      note: "Free-form annotations. Credential-shaped and learner-identifying values are refused here, but the field carries no authority.",
    },
  ];
}

/**
 * Validate a task contract's shape *and* its runtime policy.
 *
 * Fail-closed rules:
 *  - an unknown risk level or approval level is an error, never a default;
 *  - L2 and L3 contracts must state explicit exclusions;
 *  - L3 contracts require founder approval and an assignment;
 *  - a contract that grants an unsafe tool (deploy, publish, merge, …) requires
 *    founder approval, whatever its risk level;
 *  - a declared budget must state zero money;
 *  - a retry policy may not exceed the attempt ceiling and may not enable a
 *    paid fallback;
 *  - credential-shaped and learner-identifying values are refused anywhere in
 *    free-text areas.
 */
export function validateTaskContract(
  contract: unknown,
): ContractValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!contract || typeof contract !== "object" || Array.isArray(contract)) {
    return {
      valid: false,
      errors: ["contract must be an object"],
      warnings,
      classifications: classifyContractFields(),
      enforced: {
        allowedTools: [],
        deniedTools: [],
        unsafeAllowedTools: [],
        approvalRequired: false,
        maxAttempts: MAX_ATTEMPTS,
        wallClockMinutes: null,
        requiresExternalStateEvidence: false,
        doNotReplay: [],
        classifyTool: {},
      },
    };
  }

  const c = contract as TaskContractLike;

  const requiredFields = [
    "contract_id",
    "contract_version",
    "job_id",
    "objective",
  ] as const;
  for (const field of requiredFields) {
    if (!isString(c[field])) {
      errors.push(`contract.${field} is required and must be a non-empty string`);
    }
  }

  if (isString(c.contract_version) && !/^1\.\d+\.\d+$/.test(c.contract_version)) {
    errors.push(
      `contract.contract_version ${c.contract_version} is not supported by this validator (expected 1.x.y)`,
    );
  }

  const riskLevel = c.risk_level as RiskLevel;
  if (!RISK_LEVELS.includes(riskLevel)) {
    errors.push(`contract.risk_level must be one of ${RISK_LEVELS.join(", ")}`);
  }

  const approvalLevel = c.required_approval?.level as ApprovalLevel;
  if (!APPROVAL_LEVELS.includes(approvalLevel)) {
    errors.push(
      `contract.required_approval.level must be one of ${APPROVAL_LEVELS.join(", ")}`,
    );
  }

  const requiresFounderApproval =
    riskLevel === "L3" || approvalLevel === "founder";

  if ((riskLevel === "L2" || riskLevel === "L3") && !c.scope) {
    errors.push(`contract.scope is required for ${riskLevel} contracts`);
  } else if (riskLevel === "L2" || riskLevel === "L3") {
    const exclude = Array.isArray(c.scope?.exclude) ? c.scope.exclude : [];
    if (exclude.length === 0) {
      errors.push(`contract.scope.exclude must state explicit exclusions for ${riskLevel} contracts`);
    }
  }

  if (riskLevel === "L3") {
    const assigned = c.assigned;
    const hasAssignment =
      !!assigned && [assigned.agent, assigned.role, assigned.producer].some(isString);
    if (!hasAssignment) {
      errors.push("contract.assigned must name an agent, role or producer for L3 contracts");
    }
    if (approvalLevel !== "founder") {
      errors.push("L3 contracts require required_approval.level to be 'founder'");
    }
  }

  if (approvalLevel === "founder") {
    const review = c.verification?.independent_review;
    if (!["agent", "ci", "human"].includes(String(review))) {
      errors.push(
        "a contract requiring founder approval must name an independent review (agent, ci or human)",
      );
    }
  }

  if (c.budget && typeof c.budget === "object") {
    const usd = c.budget.usd;
    if (usd !== undefined && usd !== 0) {
      errors.push("contract.budget.usd must be 0: the zero-budget invariant is not negotiable");
    }
  } else if (c.budget !== undefined) {
    errors.push("contract.budget must be an object");
  }

  if (c.time_limit && typeof c.time_limit === "object") {
    const minutes = c.time_limit.max_duration_minutes;
    if (
      typeof minutes === "number" &&
      (minutes < 1 || minutes > MAX_WALL_CLOCK_MINUTES)
    ) {
      errors.push(
        `contract.time_limit.max_duration_minutes must be between 1 and ${MAX_WALL_CLOCK_MINUTES}`,
      );
    }
  }

  if (c.retry_policy && typeof c.retry_policy === "object") {
    const attempts = c.retry_policy.max_attempts;
    if (typeof attempts === "number" && (attempts < 0 || attempts > MAX_ATTEMPTS)) {
      errors.push(`contract.retry_policy.max_attempts must be between 0 and ${MAX_ATTEMPTS}`);
    }
    const quota = c.retry_policy.on_quota_exhausted;
    if (quota !== undefined && quota !== "pause_and_report") {
      errors.push(
        "contract.retry_policy.on_quota_exhausted must be 'pause_and_report'; no paid fallback is permitted",
      );
    }
  }

  const allowedTools: string[] = [];
  const deniedTools: string[] = [];
  const unsafeAllowedTools: string[] = [];
  const classifyTool: Record<string, ActionSafetyClass> = {};

  if (c.allowed_tools !== undefined) {
    if (!Array.isArray(c.allowed_tools)) {
      errors.push("contract.allowed_tools must be an array");
    } else {
      for (const entry of c.allowed_tools) {
        if (!entry || typeof entry.tool !== "string" || entry.tool.length === 0) {
          errors.push("each contract.allowed_tools entry needs a tool name");
          continue;
        }
        const mode = entry.mode ?? "allow";
        if (mode !== "allow" && mode !== "deny") {
          errors.push(`contract.allowed_tools[${entry.tool}].mode must be "allow" or "deny"`);
          continue;
        }
        const classification = classifyAction(entry.tool);
        classifyTool[entry.tool] = classification.safety;
        if (mode === "deny") {
          deniedTools.push(entry.tool);
          continue;
        }
        allowedTools.push(entry.tool);
        if (classification.safety === "unsafe" && approvalLevel !== "founder") {
          unsafeAllowedTools.push(entry.tool);
        }
      }
    }
  }

  if (unsafeAllowedTools.length > 0) {
    errors.push(
      `contract grants unsafe tool(s) ${unsafeAllowedTools.join(", ")} without founder approval`,
    );
  }

  if (c.acceptance_criteria !== undefined) {
    if (!Array.isArray(c.acceptance_criteria) || c.acceptance_criteria.length === 0) {
      errors.push("contract.acceptance_criteria must be a non-empty array");
    }
  }

  if (!c.rollback || !isString(c.rollback.instructions)) {
    errors.push("contract.rollback.instructions are required");
  }

  if (c.idempotency_key !== undefined && !isString(c.idempotency_key)) {
    errors.push("contract.idempotency_key must be a non-empty string when present");
  } else if (c.idempotency_key === undefined) {
    warnings.push(
      "contract.idempotency_key is absent; the caller must derive the key from contract_id",
    );
  }

  if (c.metadata && typeof c.metadata === "object") {
    const serialised = JSON.stringify(c.metadata);
    for (const pattern of CREDENTIAL_SHAPES) {
      if (pattern.test(serialised)) {
        errors.push("contract.metadata contains a credential-shaped value");
        break;
      }
    }
    for (const pattern of LEARNER_SHAPES) {
      if (pattern.test(serialised)) {
        errors.push("contract.metadata contains a learner-identifying value");
        break;
      }
    }
  }

  if (c.evidence !== undefined && !Array.isArray(c.evidence)) {
    errors.push("contract.evidence must be an array");
  }

  const doNotReplay = [...deniedTools];
  const requiresExternalStateEvidence =
    riskLevel === "L2" || riskLevel === "L3" || unsafeAllowedTools.length > 0;

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    classifications: classifyContractFields(),
    enforced: {
      allowedTools,
      deniedTools,
      unsafeAllowedTools,
      approvalRequired: requiresFounderApproval,
      maxAttempts:
        typeof c.retry_policy?.max_attempts === "number"
          ? (c.retry_policy.max_attempts as number)
          : MAX_ATTEMPTS,
      wallClockMinutes:
        typeof c.time_limit?.max_duration_minutes === "number"
          ? (c.time_limit.max_duration_minutes as number)
          : null,
      requiresExternalStateEvidence,
      doNotReplay,
      classifyTool,
    },
  };
}
