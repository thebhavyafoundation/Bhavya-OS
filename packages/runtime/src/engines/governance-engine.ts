/**
 * Governance Engine
 *
 * Enforces policies, compliance, audit trails, and regulatory
 * requirements for Bhavya OS.
 *
 * @version 1.0
 * @license MIT
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type PolicyStatus = "draft" | "active" | "suspended" | "archived";

export type ComplianceStatus =
  "compliant" | "non-compliant" | "partial" | "under-review";

export type AuditAction =
  "create" | "read" | "update" | "delete" | "execute" | "approve" | "reject";

export interface Policy {
  id: string;
  name: string;
  description: string;
  status: PolicyStatus;
  category: string;
  rules: PolicyRule[];
  enforcement: "strict" | "advisory" | "audit-only";
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  effectiveDate: Date;
  expiryDate?: Date;
}

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: "allow" | "deny" | "require-approval" | "log" | "notify";
  exceptions: string[];
  severity: "critical" | "high" | "medium" | "low";
}

export interface ComplianceCheck {
  id: string;
  policyId: string;
  status: ComplianceStatus;
  findings: ComplianceFinding[];
  checkedAt: Date;
  checkedBy: string;
  nextCheckAt: Date;
}

export interface ComplianceFinding {
  id: string;
  ruleId: string;
  status: "pass" | "fail" | "warning";
  description: string;
  evidence: string;
  recommendation: string;
  severity: "critical" | "high" | "medium" | "low";
}

export interface AuditEntry {
  id: string;
  timestamp: Date;
  actor: string;
  action: AuditAction;
  resource: string;
  resourceId: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface ComplianceReport {
  id: string;
  timestamp: Date;
  period: { start: Date; end: Date };
  totalChecks: number;
  compliant: number;
  nonCompliant: number;
  partial: number;
  score: number;
  findings: ComplianceFinding[];
  recommendations: string[];
}

export interface GovernanceMetrics {
  totalPolicies: number;
  activePolicies: number;
  complianceRate: number;
  totalAuditEntries: number;
  totalFindings: number;
  criticalFindings: number;
}

// ─── Engine ───────────────────────────────────────────────────────────────────

export class GovernanceEngine {
  private policies: Map<string, Policy> = new Map();
  private complianceChecks: Map<string, ComplianceCheck> = new Map();
  private auditLog: AuditEntry[] = [];

  /**
   * Create a new policy
   */
  async createPolicy(
    policy: Omit<Policy, "id" | "createdAt" | "updatedAt">,
  ): Promise<Policy> {
    const id = this.generateId();
    const now = new Date();

    const newPolicy: Policy = {
      ...policy,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.policies.set(id, newPolicy);
    return newPolicy;
  }

  /**
   * Get a policy by ID
   */
  async getPolicy(id: string): Promise<Policy | null> {
    return this.policies.get(id) || null;
  }

  /**
   * Update a policy
   */
  async updatePolicy(
    id: string,
    updates: Partial<Omit<Policy, "id" | "createdAt">>,
  ): Promise<Policy | null> {
    const policy = this.policies.get(id);
    if (!policy) return null;

    const updatedPolicy: Policy = {
      ...policy,
      ...updates,
      updatedAt: new Date(),
    };

    this.policies.set(id, updatedPolicy);
    return updatedPolicy;
  }

  /**
   * Check compliance against a policy
   */
  async checkCompliance(
    policyId: string,
    context: Record<string, unknown>,
  ): Promise<ComplianceCheck> {
    const policy = this.policies.get(policyId);
    if (!policy) {
      throw new Error(`Policy ${policyId} not found`);
    }

    const findings: ComplianceFinding[] = [];

    for (const rule of policy.rules) {
      const finding = this.evaluateRule(rule, context);
      findings.push(finding);
    }

    const failedFindings = findings.filter((f) => f.status === "fail");
    const warningFindings = findings.filter((f) => f.status === "warning");

    let status: ComplianceStatus;
    if (failedFindings.length === 0 && warningFindings.length === 0) {
      status = "compliant";
    } else if (failedFindings.length === 0) {
      status = "partial";
    } else {
      status = "non-compliant";
    }

    const check: ComplianceCheck = {
      id: this.generateId(),
      policyId,
      status,
      findings,
      checkedAt: new Date(),
      checkedBy: (context.actor as string) || "system",
      nextCheckAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    this.complianceChecks.set(check.id, check);

    // Log the compliance check
    await this.logAudit({
      actor: (context.actor as string) || "system",
      action: "execute",
      resource: "compliance-check",
      resourceId: check.id,
      details: { policyId, status, findingsCount: findings.length },
    });

    return check;
  }

  /**
   * Get compliance checks for a policy
   */
  async getComplianceChecks(
    policyId: string,
    limit: number = 10,
  ): Promise<ComplianceCheck[]> {
    return Array.from(this.complianceChecks.values())
      .filter((check) => check.policyId === policyId)
      .sort((a, b) => b.checkedAt.getTime() - a.checkedAt.getTime())
      .slice(0, limit);
  }

  /**
   * Log an audit entry
   */
  async logAudit(
    entry: Omit<AuditEntry, "id" | "timestamp">,
  ): Promise<AuditEntry> {
    const auditEntry: AuditEntry = {
      ...entry,
      id: this.generateId(),
      timestamp: new Date(),
    };

    this.auditLog.push(auditEntry);
    return auditEntry;
  }

  /**
   * Get audit log
   */
  async getAuditLog(filters: {
    actor?: string;
    action?: AuditAction;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<AuditEntry[]> {
    let results = [...this.auditLog];

    if (filters.actor) {
      results = results.filter((e) => e.actor === filters.actor);
    }

    if (filters.action) {
      results = results.filter((e) => e.action === filters.action);
    }

    if (filters.resource) {
      results = results.filter((e) => e.resource === filters.resource);
    }

    if (filters.startDate) {
      results = results.filter((e) => e.timestamp >= filters.startDate!);
    }

    if (filters.endDate) {
      results = results.filter((e) => e.timestamp <= filters.endDate!);
    }

    return results
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, filters.limit || 100);
  }

  /**
   * Generate compliance report
   */
  async generateReport(
    startDate: Date,
    endDate: Date,
  ): Promise<ComplianceReport> {
    const checks = Array.from(this.complianceChecks.values()).filter(
      (check) => check.checkedAt >= startDate && check.checkedAt <= endDate,
    );

    const compliant = checks.filter((c) => c.status === "compliant").length;
    const nonCompliant = checks.filter(
      (c) => c.status === "non-compliant",
    ).length;
    const partial = checks.filter((c) => c.status === "partial").length;

    const allFindings = checks.flatMap((c) => c.findings);

    const score = checks.length > 0 ? (compliant / checks.length) * 100 : 100;

    const recommendations = this.generateRecommendations(allFindings);

    const report: ComplianceReport = {
      id: this.generateId(),
      timestamp: new Date(),
      period: { start: startDate, end: endDate },
      totalChecks: checks.length,
      compliant,
      nonCompliant,
      partial,
      score,
      findings: allFindings,
      recommendations,
    };

    return report;
  }

  /**
   * Get governance metrics
   */
  async getMetrics(): Promise<GovernanceMetrics> {
    const policies = Array.from(this.policies.values());
    const checks = Array.from(this.complianceChecks.values());
    const allFindings = checks.flatMap((c) => c.findings);

    const compliantChecks = checks.filter(
      (c) => c.status === "compliant",
    ).length;
    const criticalFindings = allFindings.filter(
      (f) => f.severity === "critical",
    ).length;

    return {
      totalPolicies: policies.length,
      activePolicies: policies.filter((p) => p.status === "active").length,
      complianceRate: checks.length > 0 ? compliantChecks / checks.length : 1,
      totalAuditEntries: this.auditLog.length,
      totalFindings: allFindings.length,
      criticalFindings,
    };
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private generateId(): string {
    return `gov_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private evaluateRule(
    rule: PolicyRule,
    context: Record<string, unknown>,
  ): ComplianceFinding {
    // Simple rule evaluation - would use a proper rule engine in production
    try {
      const func = new Function(
        ...Object.keys(context),
        `return ${rule.condition}`,
      );
      const passed = func(...Object.values(context));

      return {
        id: this.generateId(),
        ruleId: rule.id,
        status: passed ? "pass" : "fail",
        description: passed
          ? `Rule "${rule.name}" satisfied`
          : `Rule "${rule.name}" violated`,
        evidence: JSON.stringify(context),
        recommendation: passed
          ? ""
          : `Ensure compliance with: ${rule.description}`,
        severity: rule.severity,
      };
    } catch {
      return {
        id: this.generateId(),
        ruleId: rule.id,
        status: "warning",
        description: `Could not evaluate rule "${rule.name}"`,
        evidence: "Evaluation error",
        recommendation: `Review rule condition: ${rule.condition}`,
        severity: rule.severity,
      };
    }
  }

  private generateRecommendations(findings: ComplianceFinding[]): string[] {
    const recommendations: string[] = [];
    const criticalFindings = findings.filter(
      (f) => f.severity === "critical" && f.status === "fail",
    );

    if (criticalFindings.length > 0) {
      recommendations.push(
        `Address ${criticalFindings.length} critical compliance findings immediately`,
      );
    }

    const highFindings = findings.filter(
      (f) => f.severity === "high" && f.status === "fail",
    );
    if (highFindings.length > 0) {
      recommendations.push(
        `Address ${highFindings.length} high-severity compliance findings`,
      );
    }

    const warningFindings = findings.filter((f) => f.status === "warning");
    if (warningFindings.length > 0) {
      recommendations.push(
        `Review ${warningFindings.length} warnings for potential issues`,
      );
    }

    if (findings.length === 0) {
      recommendations.push("No findings - maintain current compliance posture");
    }

    return recommendations;
  }
}

export default GovernanceEngine;
