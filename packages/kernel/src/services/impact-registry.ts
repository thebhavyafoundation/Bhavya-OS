// Impact Registry
// Measurable outcomes, metrics, reporting for every mission.

export interface ImpactReport {
  id: string;
  missionId: string;
  period: string;
  metrics: MetricSnapshot[];
  summary: string;
  generatedAt: Date;
  generatedBy: string;
  approvedBy?: string;
  publishedAt?: Date;
  documentId?: string;
}

export interface MetricSnapshot {
  metricId: string;
  name: string;
  target: number;
  current: number;
  progress: number; // percentage
  trend: "improving" | "stable" | "declining";
}

export interface ImpactInput {
  action:
    | "record-metric"
    | "generate-report"
    | "get-report"
    | "get-reports"
    | "get-summary"
    | "compare-missions";
  missionId?: string;
  metricId?: string;
  value?: number;
  notes?: string;
  period?: string;
  reportId?: string;
}

export class ImpactRegistry {
  name = "impact";
  description = "Measurable outcomes, metrics, reporting for every mission";
  capabilities = [
    "record-metrics",
    "generate-reports",
    "query-impact",
    "compare-missions",
    "audit-trail",
  ];

  private reports = new Map<string, ImpactReport>();
  private auditLog: Array<{
    action: string;
    missionId: string;
    agent: string;
    timestamp: Date;
    details: Record<string, unknown>;
  }> = [];

  async initialize(): Promise<void> {
    // Ready
  }

  async execute(
    input: ImpactInput,
  ): Promise<{ success: boolean; result?: unknown }> {
    switch (input.action) {
      case "record-metric":
        return this.recordMetric(input);
      case "generate-report":
        return this.generateReport(input);
      case "get-report":
        return this.getReport(input);
      case "get-reports":
        return this.getReports(input);
      case "get-summary":
        return this.getSummary(input);
      case "compare-missions":
        return this.compareMissions(input);
    }
  }

  private async recordMetric(
    input: ImpactInput,
  ): Promise<{ success: boolean }> {
    if (!input.missionId || !input.metricId || input.value === undefined)
      return { success: false };

    this.audit("record-metric", input.missionId, "impact-registry", {
      metricId: input.metricId,
      value: input.value,
      notes: input.notes,
    });

    return { success: true };
  }

  private async generateReport(
    input: ImpactInput,
  ): Promise<{ success: boolean; report?: ImpactReport }> {
    if (!input.missionId || !input.period) return { success: false };

    const report: ImpactReport = {
      id: `impact:${crypto.randomUUID()}`,
      missionId: input.missionId,
      period: input.period,
      metrics: [],
      summary: `Impact report for ${input.period}`,
      generatedAt: new Date(),
      generatedBy: "impact-registry",
    };

    this.reports.set(report.id, report);
    this.audit("generate-report", input.missionId, "impact-registry", {
      period: input.period,
    });

    return { success: true, report };
  }

  private async getReport(
    input: ImpactInput,
  ): Promise<{ success: boolean; report?: ImpactReport }> {
    if (!input.reportId) return { success: false };
    const report = this.reports.get(input.reportId);
    return { success: !!report, report };
  }

  private async getReports(
    input: ImpactInput,
  ): Promise<{ success: boolean; reports: ImpactReport[] }> {
    if (!input.missionId) return { success: false, reports: [] };
    const reports = Array.from(this.reports.values()).filter(
      (r) => r.missionId === input.missionId,
    );
    return { success: true, reports };
  }

  private async getSummary(
    input: ImpactInput,
  ): Promise<{ success: boolean; summary: Record<string, unknown> }> {
    if (!input.missionId) return { success: false, summary: {} };

    const reports = Array.from(this.reports.values()).filter(
      (r) => r.missionId === input.missionId,
    );

    return {
      success: true,
      summary: {
        missionId: input.missionId,
        totalReports: reports.length,
        latestReport: reports[reports.length - 1]?.period,
        metricsTracked: reports.reduce((sum, r) => sum + r.metrics.length, 0),
      },
    };
  }

  private async compareMissions(
    _input: ImpactInput,
  ): Promise<{ success: boolean; comparison: Record<string, unknown> }> {
    const allReports = Array.from(this.reports.values());
    const missionIds = [...new Set(allReports.map((r) => r.missionId))];

    return {
      success: true,
      comparison: {
        totalMissions: missionIds.length,
        totalReports: allReports.length,
        missionDetails: missionIds.map((id) => ({
          id,
          reports: allReports.filter((r) => r.missionId === id).length,
        })),
      },
    };
  }

  getAuditLog() {
    return [...this.auditLog];
  }

  private audit(
    action: string,
    missionId: string,
    agent: string,
    details: Record<string, unknown>,
  ): void {
    this.auditLog.push({
      action,
      missionId,
      agent,
      timestamp: new Date(),
      details,
    });
  }

  async shutdown(): Promise<void> {
    this.reports.clear();
    this.auditLog = [];
  }
}
