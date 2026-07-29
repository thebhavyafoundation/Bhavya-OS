import {
  generateImpactReport,
  generateExecutiveSummary,
  generateForestImpactReport,
  generateGovernanceEffectivenessReport,
} from "@bhavya/content-core";

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div style={{ background: "#1e293b", borderRadius: 12, padding: "20px 24px" }}>
      <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 4px 0" }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 700, color, margin: 0 }}>{value}</p>
    </div>
  );
}

function WidgetCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#1e293b", borderRadius: 12, padding: "24px" }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: "0 0 16px 0" }}>{title}</h2>
      {children}
    </div>
  );
}

export default function ImpactPage() {
  const report = generateImpactReport();
  const forestReport = generateForestImpactReport();
  const governanceEffectiveness = generateGovernanceEffectivenessReport();

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#10b981", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          Impact Reporting
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>
          Institutional Impact
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 640 }}>
          Generated from institutional records with full traceability from governance decisions to operational outcomes.
        </p>
      </div>

      {/* Overall Score */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", borderRadius: 16, padding: "32px 40px", marginBottom: 32, border: "1px solid #334155" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 8px 0" }}>Overall Impact Score</p>
            <p style={{ fontSize: 48, fontWeight: 700, color: "#10b981", margin: 0 }}>{report.summary.overallScore}</p>
            <p style={{ fontSize: 14, color: "#94a3b8", margin: "4px 0 0 0" }}>out of 100</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 4px 0" }}>Report Period</p>
            <p style={{ fontSize: 18, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{report.period}</p>
            <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0 0" }}>Generated: {new Date(report.generatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Top Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard label="Board Meetings" value={report.summary.totalMeetings} color="#f59e0b" />
        <StatCard label="Resolutions" value={report.summary.totalResolutions} color="#3b82f6" />
        <StatCard label="Action Items" value={report.summary.totalActionItems} color="#8b5cf6" />
        <StatCard label="Completion Rate" value={`${report.summary.completionRate}%`} color="#10b981" />
        <StatCard label="Evidence Collected" value={report.summary.evidenceCount} color="#06b6d4" />
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Governance Impact */}
        <WidgetCard title="Governance Impact">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Decisions Made</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{report.governanceImpact.decisionsMade}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Implementation Rate</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: report.governanceImpact.implementationRate >= 80 ? "#10b981" : "#f59e0b", margin: 0 }}>
                {report.governanceImpact.implementationRate}%
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Avg Time to Implement</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{report.governanceImpact.avgTimeToImplement} days</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Policy Updates</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{report.governanceImpact.policyUpdates}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Compliance Rate</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: report.governanceImpact.complianceRate >= 90 ? "#10b981" : "#f59e0b", margin: 0 }}>
                {report.governanceImpact.complianceRate}%
              </p>
            </div>
          </div>
        </WidgetCard>

        {/* Operational Impact */}
        <WidgetCard title="Operational Impact">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Missions Affected</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{report.operationalImpact.missionsAffected}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Projects Affected</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{report.operationalImpact.projectsAffected}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Actions Completed</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#10b981", margin: 0 }}>{report.operationalImpact.actionsCompleted}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Evidence Collected</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#06b6d4", margin: 0 }}>{report.operationalImpact.evidenceCollected}</p>
            </div>
          </div>
        </WidgetCard>
      </div>

      {/* Forest Impact */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        <WidgetCard title="Forest Mission Impact">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Missions with Actions</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{forestReport.missions}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Actions Completed</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#10b981", margin: 0 }}>{forestReport.actionsCompleted}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Evidence Items</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#06b6d4", margin: 0 }}>{forestReport.evidenceCount}</p>
            </div>
          </div>
        </WidgetCard>

        <WidgetCard title="Governance Effectiveness">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Meeting Frequency</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{governanceEffectiveness.meetingFrequency}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Resolution Rate</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#10b981", margin: 0 }}>{governanceEffectiveness.resolutionRate}%</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Action Completion</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#10b981", margin: 0 }}>{governanceEffectiveness.actionCompletion}%</p>
            </div>
          </div>
        </WidgetCard>
      </div>

      {/* Recommendations */}
      <WidgetCard title="Recommendations">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {report.recommendations.map((rec, i) => (
            <div key={i} style={{ padding: "12px 16px", background: "#0f172a", borderRadius: 8, border: "1px solid #334155" }}>
              <p style={{ fontSize: 13, color: "#f8fafc", margin: 0 }}>{rec}</p>
            </div>
          ))}
        </div>
      </WidgetCard>

      {/* Executive Summary */}
      <div style={{ marginTop: 24 }}>
        <WidgetCard title="Executive Summary">
          <div style={{ background: "#0f172a", borderRadius: 8, padding: "16px 20px", fontFamily: "monospace", fontSize: 12, color: "#94a3b8", whiteSpace: "pre-wrap" }}>
            {generateExecutiveSummary()}
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
