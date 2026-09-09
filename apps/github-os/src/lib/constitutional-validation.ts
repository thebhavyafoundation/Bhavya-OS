// ─── Constitutional Validation ──────────────────────────────────────────────
// Validates intelligence findings against Bhavya Foundation's constitutional
// principles: truth, evidence, provenance, no fabrication.

import { getDb } from "./db";
import type {
  IntelligenceFinding,
  DailyRun,
  DailyBriefing,
} from "./daily-intelligence-types";

// ─── Validation Rules ───────────────────────────────────────────────────────

export type ViolationSeverity = "error" | "warning" | "info";

export interface ValidationViolation {
  rule: string;
  severity: ViolationSeverity;
  message: string;
  finding_id?: string;
  field?: string;
  value?: unknown;
}

export interface ValidationResult {
  valid: boolean;
  violations: ValidationViolation[];
  checked: {
    findings: number;
    runs: number;
    briefings: number;
  };
  stats: {
    errors: number;
    warnings: number;
    info: number;
  };
}

// ─── Rules ──────────────────────────────────────────────────────────────────

/**
 * TRUTH-001: Finding descriptions must not be empty
 */
function ruleTruth001(findings: IntelligenceFinding[]): ValidationViolation[] {
  return findings
    .filter((f) => !f.description || f.description.trim().length === 0)
    .map((f) => ({
      rule: "TRUTH-001",
      severity: "error" as ViolationSeverity,
      message: "Finding has empty description — violates truth principle",
      finding_id: f.id,
      field: "description",
      value: f.description,
    }));
}

/**
 * TRUTH-002: Finding titles must not be empty
 */
function ruleTruth002(findings: IntelligenceFinding[]): ValidationViolation[] {
  return findings
    .filter((f) => !f.title || f.title.trim().length === 0)
    .map((f) => ({
      rule: "TRUTH-002",
      severity: "error" as ViolationSeverity,
      message: "Finding has empty title — violates truth principle",
      finding_id: f.id,
      field: "title",
      value: f.title,
    }));
}

/**
 * TRUTH-003: Confidence scores must be between 0 and 1
 */
function ruleTruth003(findings: IntelligenceFinding[]): ValidationViolation[] {
  return findings
    .filter(
      (f) =>
        typeof f.confidence_score !== "number" ||
        f.confidence_score < 0 ||
        f.confidence_score > 1,
    )
    .map((f) => ({
      rule: "TRUTH-003",
      severity: "error" as ViolationSeverity,
      message: "Confidence score out of range [0,1]",
      finding_id: f.id,
      field: "confidence_score",
      value: f.confidence_score,
    }));
}

/**
 * EVIDENCE-001: Findings must have evidence
 */
function ruleEvidence001(
  findings: IntelligenceFinding[],
): ValidationViolation[] {
  return findings
    .filter(
      (f) =>
        !f.evidence || (Array.isArray(f.evidence) && f.evidence.length === 0),
    )
    .map((f) => ({
      rule: "EVIDENCE-001",
      severity: "warning" as ViolationSeverity,
      message:
        "Finding has no evidence — findings must be grounded in observable data",
      finding_id: f.id,
      field: "evidence",
      value: f.evidence,
    }));
}

/**
 * EVIDENCE-002: Verification state must be one of the allowed values
 */
function ruleEvidence002(
  findings: IntelligenceFinding[],
): ValidationViolation[] {
  const allowed = ["observed", "inferred", "recommended", "experimental"];
  return findings
    .filter((f) => !allowed.includes(f.verification_state))
    .map((f) => ({
      rule: "EVIDENCE-002",
      severity: "error" as ViolationSeverity,
      message: `Invalid verification state: "${f.verification_state}"`,
      finding_id: f.id,
      field: "verification_state",
      value: f.verification_state,
    }));
}

/**
 * EVIDENCE-003: Tags must be a non-empty array
 */
function ruleEvidence003(
  findings: IntelligenceFinding[],
): ValidationViolation[] {
  return findings
    .filter(
      (f) =>
        !Array.isArray(f.tags) ||
        (Array.isArray(f.tags) && f.tags.length === 0),
    )
    .map((f) => ({
      rule: "EVIDENCE-003",
      severity: "warning" as ViolationSeverity,
      message: "Finding has no tags — helps with categorization and discovery",
      finding_id: f.id,
      field: "tags",
      value: f.tags,
    }));
}

/**
 * PROVENANCE-001: Findings must have a repository_id
 */
function ruleProvenance001(
  findings: IntelligenceFinding[],
): ValidationViolation[] {
  return findings
    .filter((f) => !f.repository_id)
    .map((f) => ({
      rule: "PROVENANCE-001",
      severity: "warning" as ViolationSeverity,
      message: "Finding has no repository provenance — origin unclear",
      finding_id: f.id,
      field: "repository_id",
      value: f.repository_id,
    }));
}

/**
 * PROVENANCE-002: Run must have a valid status
 */
function ruleProvenance002(runs: DailyRun[]): ValidationViolation[] {
  const allowed = ["running", "completed", "failed", "partial"];
  return runs
    .filter((r) => !allowed.includes(r.status))
    .map((r) => ({
      rule: "PROVENANCE-002",
      severity: "error" as ViolationSeverity,
      message: `Invalid run status: "${r.status}"`,
      field: "status",
      value: r.status,
    }));
}

/**
 * PROVENANCE-003: Completed runs must have findings_count >= 0
 */
function ruleProvenance003(runs: DailyRun[]): ValidationViolation[] {
  return runs
    .filter(
      (r) =>
        r.status === "completed" &&
        (typeof r.findings_count !== "number" || r.findings_count < 0),
    )
    .map((r) => ({
      rule: "PROVENANCE-003",
      severity: "warning" as ViolationSeverity,
      message: "Completed run has invalid findings_count",
      field: "findings_count",
      value: r.findings_count,
    }));
}

/**
 * FABRICATION-001: Finding titles must not contain placeholder text
 */
function ruleFabrication001(
  findings: IntelligenceFinding[],
): ValidationViolation[] {
  const placeholders = [
    "todo",
    "tbd",
    "placeholder",
    "lorem ipsum",
    "test",
    "example",
    "sample",
  ];
  return findings
    .filter((f) => placeholders.some((p) => f.title.toLowerCase().includes(p)))
    .map((f) => ({
      rule: "FABRICATION-001",
      severity: "error" as ViolationSeverity,
      message: "Finding title contains placeholder text — possible fabrication",
      finding_id: f.id,
      field: "title",
      value: f.title,
    }));
}

/**
 * FABRICATION-002: Briefing summaries must not be empty for completed runs
 */
function ruleFabrication002(
  briefing: DailyBriefing | null,
): ValidationViolation[] {
  if (!briefing) return [];
  if (!briefing.summary || briefing.summary.trim().length === 0) {
    return [
      {
        rule: "FABRICATION-002",
        severity: "warning" as ViolationSeverity,
        message: "Briefing has empty summary",
        field: "summary",
        value: briefing.summary,
      },
    ];
  }
  return [];
}

// ─── Main Validator ─────────────────────────────────────────────────────────

/**
 * Run all constitutional validation rules against the intelligence data.
 */
export function validateConstitutionalCompliance(): ValidationResult {
  const db = getDb();

  const findings = db
    .prepare("SELECT * FROM intelligence_findings")
    .all() as IntelligenceFinding[];

  const runs = db.prepare("SELECT * FROM daily_runs").all() as DailyRun[];

  let briefing: DailyBriefing | null = null;
  try {
    const row = db
      .prepare("SELECT * FROM daily_briefings ORDER BY created_at DESC LIMIT 1")
      .get() as { briefing: string } | undefined;
    if (row) {
      briefing = JSON.parse(row.briefing) as DailyBriefing;
    }
  } catch {
    // No briefing
  }

  const violations: ValidationViolation[] = [];

  // Truth rules
  violations.push(...ruleTruth001(findings));
  violations.push(...ruleTruth002(findings));
  violations.push(...ruleTruth003(findings));

  // Evidence rules
  violations.push(...ruleEvidence001(findings));
  violations.push(...ruleEvidence002(findings));
  violations.push(...ruleEvidence003(findings));

  // Provenance rules
  violations.push(...ruleProvenance001(findings));
  violations.push(...ruleProvenance002(runs));
  violations.push(...ruleProvenance003(runs));

  // Fabrication rules
  violations.push(...ruleFabrication001(findings));
  violations.push(...ruleFabrication002(briefing));

  const errors = violations.filter((v) => v.severity === "error").length;
  const warnings = violations.filter((v) => v.severity === "warning").length;
  const info = violations.filter((v) => v.severity === "info").length;

  return {
    valid: errors === 0,
    violations,
    checked: {
      findings: findings.length,
      runs: runs.length,
      briefings: briefing ? 1 : 0,
    },
    stats: {
      errors,
      warnings,
      info,
    },
  };
}

/**
 * Get a human-readable report of constitutional validation
 */
export function getConstitutionalReport(): string {
  const result = validateConstitutionalCompliance();

  const lines: string[] = [
    "# Constitutional Validation Report",
    "",
    `**Status:** ${result.valid ? "✅ PASS" : "❌ FAIL"}`,
    `**Checked:** ${result.checked.findings} findings, ${result.checked.runs} runs, ${result.checked.briefings} briefings`,
    `**Violations:** ${result.stats.errors} errors, ${result.stats.warnings} warnings, ${result.stats.info} info`,
    "",
  ];

  if (result.violations.length === 0) {
    lines.push("No violations found. All constitutional principles satisfied.");
  } else {
    lines.push("## Violations");
    lines.push("");
    for (const v of result.violations) {
      const icon =
        v.severity === "error" ? "🔴" : v.severity === "warning" ? "🟡" : "ℹ️";
      lines.push(`${icon} **${v.rule}** (${v.severity}): ${v.message}`);
      if (v.finding_id) lines.push(`   - Finding: ${v.finding_id}`);
      if (v.field) lines.push(`   - Field: ${v.field}`);
      lines.push("");
    }
  }

  return lines.join("\n");
}
