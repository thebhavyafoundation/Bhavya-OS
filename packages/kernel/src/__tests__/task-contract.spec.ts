import { describe, expect, it } from "vitest";

import {
  classifyContractFields,
  validateTaskContract,
} from "../contracts/task-contract.js";

// Assembled from fragments so no secret-shaped literal exists in this file.
const FAKE_CREDENTIAL = "sk" + "_live_" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456";

const base = () => ({
  contract_id: "bfaos-task-2026-11-13-001",
  contract_version: "1.0.0",
  job_id: "job-2026-11-13-001",
  objective: "Verify the contract validator behaves as documented.",
  risk_level: "L0" as const,
  required_approval: { level: "none" as const },
  scope: { include: ["read"], exclude: ["deploy"] },
  assigned: { agent: "bhavya/research-agent", role: "research" },
  allowed_tools: [{ tool: "read", mode: "allow" as const }],
  budget: { usd: 0, wall_clock_minutes: 60 },
  time_limit: { max_duration_minutes: 60 },
  retry_policy: { max_attempts: 2, on_quota_exhausted: "pause_and_report" as const },
  checkpoint_policy: { every_n_steps: 10, store: "mc_artifact_version" },
  acceptance_criteria: [{ id: "AC-01", criterion: "The validator accepts a valid contract." }],
  verification: { evidence_required: true, independent_review: "agent" as const },
  evidence: [],
  rollback: { instructions: "Revert the commit. Nothing else is affected." },
  idempotency_key: "bfaos-task-2026-11-13-001",
  metadata: { phase: "3" },
});

describe("task contract validation", () => {
  it("accepts a valid L0 contract", () => {
    const result = validateTaskContract(base());
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
    expect(result.enforced.allowedTools).toContain("read");
    expect(result.enforced.approvalRequired).toBe(false);
  });

  it("classifies every contract field by how it is enforced", () => {
    const fields = classifyContractFields();
    const names = fields.map((f) => f.field);
    expect(names.some((n) => n.includes("risk_level"))).toBe(true);
    expect(fields.every((f) => f.enforcement && f.note)).toBe(true);
    const allowedTools = fields.find((f) => f.field === "allowed_tools");
    expect(allowedTools?.enforcement).toBe("advisory-only");
  });

  it("refuses an unknown risk level rather than defaulting it", () => {
    const contract = { ...base(), risk_level: "L9" };
    const result = validateTaskContract(contract);
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/risk_level/);
  });

  it("requires explicit exclusions for L2 and L3 contracts", () => {
    const l2 = { ...base(), risk_level: "L2" as const, scope: { include: ["x"], exclude: [] } };
    expect(validateTaskContract(l2).errors.join(" ")).toMatch(/exclusions/);

    const l2NoScope = { ...base(), risk_level: "L2" as const, scope: undefined };
    expect(validateTaskContract(l2NoScope).errors.join(" ")).toMatch(/scope is required/);
  });

  it("requires founder approval and an assignment for L3 contracts", () => {
    const l3 = {
      ...base(),
      risk_level: "L3" as const,
      required_approval: { level: "role" as const },
      assigned: {},
    };
    const errors = validateTaskContract(l3).errors.join(" ");
    expect(errors).toMatch(/assigned/);
    expect(errors).toMatch(/founder/);

    const validL3 = {
      ...base(),
      risk_level: "L3" as const,
      required_approval: { level: "founder" as const },
      verification: { evidence_required: true, independent_review: "human" as const },
    };
    expect(validateTaskContract(validL3).valid).toBe(true);
  });

  it("requires an independent review when founder approval is requested", () => {
    const contract = {
      ...base(),
      required_approval: { level: "founder" as const },
      verification: { evidence_required: true, independent_review: "none" as const },
    };
    expect(validateTaskContract(contract).errors.join(" ")).toMatch(/independent review/);
  });

  it("refuses a non-zero monetary budget", () => {
    const contract = { ...base(), budget: { usd: 0.5 } };
    expect(validateTaskContract(contract).errors.join(" ")).toMatch(/zero-budget|usd/i);
  });

  it("refuses an attempt ceiling above the limit and a paid fallback", () => {
    expect(
      validateTaskContract({ ...base(), retry_policy: { max_attempts: 9 } }).errors.join(" "),
    ).toMatch(/max_attempts/);
    expect(
      validateTaskContract({
        ...base(),
        retry_policy: { max_attempts: 1, on_quota_exhausted: "switch_to_paid" },
      }).errors.join(" "),
    ).toMatch(/pause_and_report/);
  });

  it("refuses an unsafe tool unless founder approval is present", () => {
    const unsafe = {
      ...base(),
      allowed_tools: [{ tool: "deploy", mode: "allow" as const }],
    };
    expect(validateTaskContract(unsafe).errors.join(" ")).toMatch(/unsafe tool/);

    const approved = {
      ...base(),
      risk_level: "L3" as const,
      required_approval: { level: "founder" as const },
      verification: { evidence_required: true, independent_review: "human" as const },
      allowed_tools: [{ tool: "deploy", mode: "allow" as const }],
    };
    const result = validateTaskContract(approved);
    expect(result.valid).toBe(true);
    expect(result.enforced.classifyTool.deploy).toBe("unsafe");
  });

  it("separates denied tools from allowed tools and lists them as do-not-replay", () => {
    const contract = {
      ...base(),
      allowed_tools: [
        { tool: "read", mode: "allow" as const },
        { tool: "deploy", mode: "deny" as const },
      ],
    };
    const result = validateTaskContract(contract);
    expect(result.enforced.allowedTools).toEqual(["read"]);
    expect(result.enforced.deniedTools).toEqual(["deploy"]);
    expect(result.enforced.doNotReplay).toContain("deploy");
  });

  it("refuses credential-shaped and learner-identifying metadata", () => {
    const withCredential = { ...base(), metadata: { api_key: FAKE_CREDENTIAL } };
    expect(validateTaskContract(withCredential).errors.join(" ")).toMatch(/credential/);

    const withLearner = { ...base(), metadata: { learner_email: "student-42@example.com" } };
    expect(validateTaskContract(withLearner).errors.join(" ")).toMatch(/learner/);
  });

  it("warns but does not fail when the idempotency key is absent", () => {
    const contract = { ...base(), idempotency_key: undefined };
    const result = validateTaskContract(contract);
    expect(result.valid).toBe(true);
    expect(result.warnings.join(" ")).toMatch(/idempotency_key/);
  });

  it("refuses a contract with no rollback instructions", () => {
    const contract = { ...base(), rollback: { instructions: "" } };
    expect(validateTaskContract(contract).errors.join(" ")).toMatch(/rollback/);
  });

  it("refuses input that is not a contract object", () => {
    expect(validateTaskContract("nope").valid).toBe(false);
    expect(validateTaskContract(null).errors.join(" ")).toMatch(/object/);
  });
});
