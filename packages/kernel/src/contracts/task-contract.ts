// BFAOS task contract validation.

// The Phase 1 JSON Schema validates the *shape* of a task contract. A schema is
// not a permission system: it cannot know that a contract which grants the
// `deploy` tool must carry founder approval, that a budget must state zero
// money, or that a retry policy may not nominate a side-effecting action.

// This module performs that runtime policy check, and it classifies every
// contract field by how it is actually enforced, so an operator can see at a
// glance which parts of a contract are real controls and which are only
// declarations.

// COMPOSITION ORDER (important): this is a POLICY layer, not a shape layer. It
// must run **after** JSON Schema validation, because the schema rejects unknown
// properties and malformed types that this layer does not model. Pass
// `schemaValidated: true` when the caller has already validated the document.

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
  title?: unknown;
  objective?: unknown;
  risk_level?: unknown;
  required_approval?: { level?: unknown; approver_role?: unknown; digest_required?: unknown };
  scope?: { include?: unknown[]; exclude?: unknown[]; paths?: unknown[]; branches?: unknown[] };
  assigned?: { agent?: unknown; role?: unknown; producer?: unknown };
  dependencies?: { ref?: unknown; kind?: unknown; note?: unknown }[];
  allowed_tools?: ContractTool[];
  budget?: { usd?: unknown; wall_clock_minutes?: unknown; ci_minutes?: unknown; tokens?: unknown };
  time_limit?: { started_at?: unknown; deadline?: unknown; max_duration_minutes?: unknown };
  retry_policy?: {
    max_attempts?: unknown;
    backoff?: unknown;
    retryable_actions?: unknown[];
    on_quota_exhausted?: unknown;
  };
  checkpoint_policy?: { enabled?: unknown; every_n_steps?: unknown; store?: unknown };
  acceptance_criteria?: { id?: unknown; criterion?: unknown; verification?: unknown }[];
  verification?: {
    evidence_required?: unknown;
    checks?: unknown[];
    independent_review?: unknown;
    deployment_required?: unknown;
    notes?: unknown;
  };
  evidence?: { kind?: unknown; ref?: unknown; sha256?: unknown; note?: unknown }[];
  rollback?: { instructions?: unknown; revert_commit?: unknown; data_migration?: unknown };
  idempotency_key?: unknown;
  metadata?: unknown;
}

export interface FieldClassification {
  field: string;
  enforcement: FieldEnforcement;
  note: string;
}

export interface ContractEnforcement {
  allowedTools: string[];
  deniedTools: string[];
  /** Every tool the contract grants that carries an irreversible effect. */
  unsafeToolsGranted: string[];
  /** Unsafe tools granted without founder approval — the error condition. */
  unsafeToolsWithoutApproval: string[];
  /** Tools whose name is not classified; they require founder review. */
  unclassifiedTools: string[];
  /** Whether the policy requires founder approval for this contract. */
  approvalRequired: boolean;
  /** The approval level the contract asked for. */
  requestedApproval: ApprovalLevel | null;
  maxAttempts: number;
  wallClockMinutes: number | null;
  requiresExternalStateEvidence: boolean;
  doNotReplay: string[];
  classifyTool: Record<string, "safe" | "unsafe" | "unclassified">;
}

export interface ContractValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  classifications: FieldClassification[];
  enforced: ContractEnforcement;
}

export interface ValidateOptions {
  /** Set when the caller has already validated the document against the JSON Schema. */
  schemaValidated?: boolean;
}

const RISK_LEVELS: RiskLevel[] = ["L0", "L1", "L2", "L3"];
const APPROVAL_LEVELS: ApprovalLevel[] = ["none", "role", "founder"];
const MAX_ATTEMPTS = 5;
const MAX_WALL_CLOCK_MINUTES = 1440;

/**
 * Ordinary development tools. Granting these does not by itself require
 * founder approval: they are reversible, local and observable.
 *
 * This set is deliberately different from the replay module's action
 * allow-list: that one classifies *side effects to re-emit*, this one
 * classifies *tools a contract may grant*.
 */
const CONTRACT_SAFE_TOOLS = new Set([
  "read",
  "write",
  "edit",
  "patch",
  "bash",
  "shell",
  "grep",
  "glob",
  "list",
  "search",
  "test",
  "lint",
  "typecheck",
  "build",
  "format",
  "inspect",
  "validate",
  "plan",
  "classify",
  "select",
  "status",
  "diff",
  "http_get",
  "static_check",
  "git-status",
  "git-diff",
  "git-log",
  "git-show",
  "analyse",
  "analyze",
]);

/**
 * Tools that can change external state irreversibly or spend money. These
 * require founder approval, whatever the declared risk level.
 */
const CONTRACT_UNSAFE_TOOLS = new Set([
  "deploy",
  "production-deploy",
  "preview-deploy",
  "promote",
  "publish",
  "merge",
  "migrate",
  "migration",
  "payment",
  "notify-person",
  "delete",
  "purge",
  "force-push",
  "branch-delete",
  "credential-set",
  "permission-grant",
  "secret-write",
]);

const CREDENTIAL_SHAPES = [
  /sk_[A-Za-z0-9]{20,}/,
  /sk[-_]live[-_][A-Za-z0-9]{16,}/,
  /sk[-_]proj[-_][A-Za-z0-9\-_]{16,}/,
  /AKIA[0-9A-Z]{16}/,
  /ASIA[0-9A-Z]{16}/,
  /gh[pousr]_[A-Za-z0-9]{20,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /xox[baprs]-[A-Za-z0-9-]{10,}/,
  /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /(?:password|secret|api[_-]?key|auth[_-]?token)\s*[:=]\s*["'][^"']{6,}["']/i,
];

/** Learner-identifying values: an address, or an identifier next to a key. */
const LEARNER_SHAPES = [
  /\b(student|learner|child|pupil)[\w.+-]*@/i,
  /["']?\b(student|learner|child|pupil)[-_]?(id|email|record)\b["']?\s*[:=]\s*["'][^"']+["']/i,
];

type ToolClass = "safe" | "unsafe" | "unclassified";

function isString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function classifyContractTool(tool: string): ToolClass {
  const normalized = tool.trim().toLowerCase();
  if (CONTRACT_SAFE_TOOLS.has(normalized)) return "safe";
  if (CONTRACT_UNSAFE_TOOLS.has(normalized)) return "unsafe";
  return "unclassified";
}

/**
 * Walk a value tree and report credential-shaped or learner-identifying
 * strings. Implemented without serialisation so that circular structures and
 * exotic values cannot throw.
 */
function scanForSensitiveValues(
  value: unknown,
  path: string,
  found: string[],
  seen: Set<unknown> = new Set(),
): void {
  if (typeof value === "string") {
    for (const pattern of CREDENTIAL_SHAPES) {
      if (pattern.test(value)) {
        found.push(`${path}: credential-shaped value`);
        return;
      }
    }
    for (const pattern of LEARNER_SHAPES) {
      if (pattern.test(value)) {
        found.push(`${path}: learner-identifying value`);
        return;
      }
    }
    return;
  }
  if (typeof value === "bigint") {
    found.push(`${path}: value is not representable as contract data`);
    return;
  }
  if (value === null || typeof value !== "object") return;
  if (seen.has(value)) return;
  seen.add(value);
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanForSensitiveValues(item, `${path}[${index}]`, found, seen));
    return;
  }
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    scanForSensitiveValues(item, `${path}.${key}`, found, seen);
  }
}

/** How each contract field is actually enforced today. */
export function classifyContractFields(): FieldClassification[] {
  return [
    {
      field: "contract_id / contract_version / job_id / objective",
      enforcement: "validated-at-intake",
      note: "Shape and identity are checked when the contract is accepted. The JSON Schema remains the authority for shape; this layer adds the policy rules.",
    },
    {
      field: "risk_level",
      enforcement: "validated-at-intake",
      note: "Drives the approval rules below. It does not itself restrict anything.",
    },
    {
      field: "required_approval",
      enforcement: "validated-at-intake",
      note: "Requires founder approval for L3 contracts and for any unsafe tool. The approval itself is recorded by the human process, not by this module.",
    },
    {
      field: "scope.include / scope.exclude",
      enforcement: "advisory-only",
      note: "Read by the reviewer and the agent; nothing mechanically prevents work outside the scope.",
    },
    {
      field: "assigned.agent / role / producer",
      enforcement: "advisory-only",
      note: "The column mc_sessions.producer exists and startSession writes it, but nothing derives it from a contract yet.",
    },
    {
      field: "allowed_tools",
      enforcement: "advisory-only",
      note: "Declared intent. Tool access is intended to be governed by the OpenCode permission layer and the kernel Permissions store, but neither is currently configured to restrict the default agents, and neither reads this contract. This module's tool rule is a review gate, not a capability grant.",
    },
    {
      field: "budget",
      enforcement: "advisory-only",
      note: "Nothing meters wall clock, CI minutes or tokens against these numbers.",
    },
    {
      field: "time_limit",
      enforcement: "advisory-only",
      note: "ExecutionTimestamps carries a deadline field, but no code reads it; no watchdog enforces the deadline.",
    },
    {
      field: "retry_policy",
      enforcement: "advisory-only",
      note: "The kernel Idempotency store records no attempt counter and no code reads max_attempts from a contract, so the ceiling is a declaration.",
    },
    {
      field: "checkpoint_policy",
      enforcement: "advisory-only",
      note: "The checkpoint envelope and its integrity contract exist; no caller writes checkpoints from this contract yet.",
    },
    {
      field: "acceptance_criteria",
      enforcement: "not-implemented",
      note: "Nothing stores or evaluates the criteria: ExecutionRecord has no such field and no mc_* column exists.",
    },
    {
      field: "verification",
      enforcement: "not-implemented",
      note: "Evidence and independent review are declared but not recorded by any store; the reviewer acts outside the system.",
    },
    {
      field: "evidence",
      enforcement: "not-implemented",
      note: "No store holds contract evidence; the contract body itself has no storage home yet (D-09).",
    },
    {
      field: "rollback",
      enforcement: "advisory-only",
      note: "Instructions for a human. No automatic rollback exists.",
    },
    {
      field: "idempotency_key",
      enforcement: "advisory-only",
      note: "The kernel Idempotency mechanism exists (filesystem-backed, one-hour TTL, no attempt counter); nothing derives the key from a contract, and the store does not survive a fresh runner.",
    },
    {
      field: "metadata",
      enforcement: "advisory-only",
      note: "Free-form annotations with no authority. Credential-shaped and learner-identifying values are refused, but the field carries no decision weight.",
    },
  ];
}

function emptyEnforcement(): ContractEnforcement {
  return {
    allowedTools: [],
    deniedTools: [],
    unsafeToolsGranted: [],
    unsafeToolsWithoutApproval: [],
    unclassifiedTools: [],
    approvalRequired: false,
    requestedApproval: null,
    maxAttempts: MAX_ATTEMPTS,
    wallClockMinutes: null,
    requiresExternalStateEvidence: false,
    doNotReplay: [],
    classifyTool: {},
  };
}

/**
 * Validate a task contract's runtime policy.
 *
 * Fail-closed rules:
 *  - an unknown risk level or approval level is refused, never defaulted;
 *  - a wrong type is refused, never skipped;
 *  - L2 and L3 contracts must state explicit exclusions;
 *  - L3 contracts require an assignment and founder approval;
 *  - a contract granting an unsafe or unclassified tool requires founder approval;
 *  - a declared budget must state zero money;
 *  - a retry policy may not exceed the attempt ceiling, may not enable a paid
 *    fallback, and may not nominate a side-effecting action for automatic retry;
 *  - credential-shaped and learner-identifying values are refused in every
 *    free-text area.
 */
export function validateTaskContract(
  contract: unknown,
  options: ValidateOptions = {},
): ContractValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isPlainObject(contract)) {
    return {
      valid: false,
      errors: ["contract must be an object"],
      warnings,
      classifications: classifyContractFields(),
      enforced: emptyEnforcement(),
    };
  }

  const c = contract as TaskContractLike;

  if (!options.schemaValidated) {
    warnings.push(
      "this validator is a policy layer; it does not replace JSON Schema validation of the document's shape",
    );
  }

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

  if (c.required_approval !== undefined && !isPlainObject(c.required_approval)) {
    errors.push("contract.required_approval must be an object");
  }

  if (c.scope !== undefined && !isPlainObject(c.scope)) {
    errors.push("contract.scope must be an object");
  } else if (riskLevel === "L2" || riskLevel === "L3") {
    if (!c.scope) {
      errors.push(`contract.scope is required for ${riskLevel} contracts`);
    } else {
      const exclude = Array.isArray(c.scope.exclude) ? c.scope.exclude : [];
      if (exclude.length === 0) {
        errors.push(
          `contract.scope.exclude must state explicit exclusions for ${riskLevel} contracts`,
        );
      }
    }
  }

  if (riskLevel === "L3") {
    const assigned = c.assigned;
    const hasAssignment =
      isPlainObject(assigned) &&
      [assigned.agent, assigned.role, assigned.producer].some(isString);
    if (!hasAssignment) {
      errors.push(
        "contract.assigned must name an agent, role or producer for L3 contracts",
      );
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

  if (c.budget !== undefined) {
    if (!isPlainObject(c.budget)) {
      errors.push("contract.budget must be an object");
    } else {
      if (c.budget.usd !== 0) {
        errors.push(
          "contract.budget.usd must be 0: the zero-budget invariant is not negotiable",
        );
      }
      const minutes = c.budget.wall_clock_minutes;
      if (
        minutes !== undefined &&
        (typeof minutes !== "number" ||
          !Number.isInteger(minutes) ||
          minutes < 1 ||
          minutes > MAX_WALL_CLOCK_MINUTES)
      ) {
        errors.push(
          `contract.budget.wall_clock_minutes must be an integer between 1 and ${MAX_WALL_CLOCK_MINUTES}`,
        );
      }
      const tokens = c.budget.tokens;
      if (
        tokens !== undefined &&
        (typeof tokens !== "number" || !Number.isInteger(tokens) || tokens < 0)
      ) {
        errors.push("contract.budget.tokens must be a non-negative integer");
      }
    }
  }

  if (c.time_limit !== undefined) {
    if (!isPlainObject(c.time_limit)) {
      errors.push("contract.time_limit must be an object");
    } else {
      const minutes = c.time_limit.max_duration_minutes;
      if (
        minutes !== undefined &&
        (typeof minutes !== "number" ||
          !Number.isInteger(minutes) ||
          minutes < 1 ||
          minutes > MAX_WALL_CLOCK_MINUTES)
      ) {
        errors.push(
          `contract.time_limit.max_duration_minutes must be an integer between 1 and ${MAX_WALL_CLOCK_MINUTES}`,
        );
      }
      for (const field of ["started_at", "deadline"] as const) {
        const value = c.time_limit[field];
        if (value !== undefined && !isString(value)) {
          errors.push(`contract.time_limit.${field} must be a string`);
        }
      }
    }
  }

  if (c.retry_policy !== undefined) {
    if (!isPlainObject(c.retry_policy)) {
      errors.push("contract.retry_policy must be an object");
    } else {
      const attempts = c.retry_policy.max_attempts;
      if (
        attempts !== undefined &&
        (typeof attempts !== "number" ||
          !Number.isInteger(attempts) ||
          attempts < 0 ||
          attempts > MAX_ATTEMPTS)
      ) {
        errors.push(
          `contract.retry_policy.max_attempts must be an integer between 0 and ${MAX_ATTEMPTS}`,
        );
      }
      const quota = c.retry_policy.on_quota_exhausted;
      if (quota !== undefined && quota !== "pause_and_report") {
        errors.push(
          "contract.retry_policy.on_quota_exhausted must be 'pause_and_report'; no paid fallback is permitted",
        );
      }
      const retryable = c.retry_policy.retryable_actions;
      if (retryable !== undefined) {
        if (!Array.isArray(retryable)) {
          errors.push("contract.retry_policy.retryable_actions must be an array");
        } else {
          for (const action of retryable) {
            if (!isString(action)) {
              errors.push(
                "contract.retry_policy.retryable_actions entries must be non-empty strings",
              );
              continue;
            }
            const classification: ActionSafetyClass = classifyAction(action).safety;
            if (classification !== "idempotent") {
              errors.push(
                `contract.retry_policy.retryable_actions may only list idempotent actions; "${action}" is classified ${classification}`,
              );
            }
          }
        }
      }
    }
  }

  if (c.checkpoint_policy !== undefined) {
    if (!isPlainObject(c.checkpoint_policy)) {
      errors.push("contract.checkpoint_policy must be an object");
    } else {
      const store = c.checkpoint_policy.store;
      if (store !== undefined && store !== "mc_artifact_version") {
        errors.push(
          'contract.checkpoint_policy.store must be "mc_artifact_version"; no second checkpoint store is permitted',
        );
      }
      const steps = c.checkpoint_policy.every_n_steps;
      if (
        steps !== undefined &&
        (typeof steps !== "number" || !Number.isInteger(steps) || steps < 1)
      ) {
        errors.push("contract.checkpoint_policy.every_n_steps must be a positive integer");
      }
    }
  }

  const allowedTools: string[] = [];
  const deniedTools: string[] = [];
  const unsafeToolsGranted: string[] = [];
  const unsafeToolsWithoutApproval: string[] = [];
  const unclassifiedTools: string[] = [];
  const classifyTool: Record<string, ToolClass> = {};

  if (c.allowed_tools !== undefined) {
    if (!Array.isArray(c.allowed_tools)) {
      errors.push("contract.allowed_tools must be an array");
    } else {
      const seenModes = new Map<string, "allow" | "deny">();
      for (const entry of c.allowed_tools) {
        if (!isPlainObject(entry) || !isString(entry.tool)) {
          errors.push("each contract.allowed_tools entry needs a tool name");
          continue;
        }
        const mode = entry.mode ?? "allow";
        if (mode !== "allow" && mode !== "deny") {
          errors.push(
            `contract.allowed_tools[${entry.tool}].mode must be "allow" or "deny"`,
          );
          continue;
        }
        const previous = seenModes.get(entry.tool);
        if (previous && previous !== mode) {
          warnings.push(
            `contract.allowed_tools lists "${entry.tool}" twice with conflicting modes; the deny wins`,
          );
        }
        seenModes.set(entry.tool, mode === "deny" ? "deny" : (previous ?? mode));

        const toolClass = classifyContractTool(entry.tool);
        classifyTool[entry.tool] = toolClass;
        if (toolClass === "unclassified") {
          unclassifiedTools.push(entry.tool);
        }
      }

      for (const [tool, mode] of seenModes) {
        if (mode === "deny") {
          deniedTools.push(tool);
          continue;
        }
        allowedTools.push(tool);
        const toolClass = classifyTool[tool];
        if (toolClass === "unsafe" || toolClass === "unclassified") {
          unsafeToolsGranted.push(tool);
          if (approvalLevel !== "founder") {
            unsafeToolsWithoutApproval.push(tool);
          }
        }
      }
    }
  }

  if (unsafeToolsWithoutApproval.length > 0) {
    errors.push(
      `contract grants tool(s) ${unsafeToolsWithoutApproval.join(", ")} that carry irreversible or unclassified effects without founder approval`,
    );
  }
  if (unclassifiedTools.length > 0) {
    warnings.push(
      `contract tool(s) ${unclassifiedTools.join(", ")} are not classified; they require founder review`,
    );
  }

  if (c.acceptance_criteria !== undefined) {
    if (!Array.isArray(c.acceptance_criteria) || c.acceptance_criteria.length === 0) {
      errors.push("contract.acceptance_criteria must be a non-empty array");
    }
  }

  if (c.verification !== undefined && !isPlainObject(c.verification)) {
    errors.push("contract.verification must be an object");
  }

  if (c.evidence !== undefined && !Array.isArray(c.evidence)) {
    errors.push("contract.evidence must be an array");
  }

  if (!isPlainObject(c.rollback) || !isString(c.rollback.instructions)) {
    errors.push("contract.rollback.instructions are required");
  }

  if (c.idempotency_key !== undefined && !isString(c.idempotency_key)) {
    errors.push("contract.idempotency_key must be a non-empty string when present");
  } else if (c.idempotency_key === undefined) {
    warnings.push(
      "contract.idempotency_key is absent; the caller must derive the key from contract_id",
    );
  }

  if (c.metadata !== undefined) {
    if (!isPlainObject(c.metadata)) {
      errors.push("contract.metadata must be an object of scalar values");
    } else {
      const found: string[] = [];
      scanForSensitiveValues(c.metadata, "metadata", found);
      for (const problem of found) {
        errors.push(`contract.${problem}`);
      }
    }
  }

  // Every free-text area is scanned for credential and learner data.
  const freeText: Array<[string, unknown]> = [
    ["title", c.title],
    ["objective", c.objective],
    ["scope.include", c.scope?.include],
    ["scope.exclude", c.scope?.exclude],
    ["scope.paths", c.scope?.paths],
    ["scope.branches", c.scope?.branches],
    ["rollback.instructions", c.rollback?.instructions],
    ["acceptance_criteria", c.acceptance_criteria],
    ["verification", c.verification],
    ["evidence", c.evidence],
    ["dependencies", c.dependencies],
    ["assigned", c.assigned],
    ["allowed_tools", c.allowed_tools],
    ["idempotency_key", c.idempotency_key],
  ];
  const sensitive: string[] = [];
  for (const [path, value] of freeText) {
    if (value === undefined) continue;
    scanForSensitiveValues(value, path, sensitive);
  }
  for (const problem of sensitive) {
    errors.push(`contract.${problem}`);
  }

  const doNotReplay = Array.from(
    new Set([...deniedTools, ...unsafeToolsGranted]),
  );

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    classifications: classifyContractFields(),
    enforced: {
      allowedTools,
      deniedTools,
      unsafeToolsGranted,
      unsafeToolsWithoutApproval,
      unclassifiedTools,
      approvalRequired:
        riskLevel === "L3" ||
        approvalLevel === "founder" ||
        unsafeToolsGranted.length > 0,
      requestedApproval: APPROVAL_LEVELS.includes(approvalLevel)
        ? approvalLevel
        : null,
      maxAttempts:
        typeof c.retry_policy?.max_attempts === "number" &&
        Number.isInteger(c.retry_policy.max_attempts)
          ? (c.retry_policy.max_attempts as number)
          : MAX_ATTEMPTS,
      wallClockMinutes:
        typeof c.time_limit?.max_duration_minutes === "number" &&
        Number.isInteger(c.time_limit.max_duration_minutes)
          ? (c.time_limit.max_duration_minutes as number)
          : null,
      requiresExternalStateEvidence:
        riskLevel === "L2" ||
        riskLevel === "L3" ||
        unsafeToolsGranted.length > 0,
      doNotReplay,
      classifyTool,
    },
  };
}
