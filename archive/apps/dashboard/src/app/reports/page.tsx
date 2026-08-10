import {
  generateInstitutionalReport,
  generateAnnualReport,
} from "@bhavya/content-core";

function WidgetCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#1e293b", borderRadius: 12, padding: "24px" }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: "0 0 16px 0" }}>{title}</h2>
      {children}
    </div>
  );
}

function DomainCard({ section }: { section: any }) {
  const healthMetric = section.metrics.find((m: any) => m.name === "Health Score");
  const healthScore = healthMetric ? healthMetric.value : 0;

  return (
    <div style={{ background: "#0f172a", borderRadius: 8, padding: "16px 20px", border: "1px solid #334155" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{section.title}</h3>
        <span style={{
          fontSize: 12,
          padding: "4px 8px",
          borderRadius: 4,
          background: healthScore >= 80 ? "#10b98120" : healthScore >= 60 ? "#f59e0b20" : "#ef444420",
          color: healthScore >= 80 ? "#10b981" : healthScore >= 60 ? "#f59e0b" : "#ef4444",
        }}>
          {healthScore}/100
        </span>
      </div>
      <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 12px 0" }}>{section.summary}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {section.metrics.filter((m: any) => m.name !== "Health Score").slice(0, 4).map((metric: any) => (
          <div key={metric.name} style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{metric.name}</p>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{metric.value}{metric.unit}</p>
          </div>
        ))}
      </div>
      {section.highlights.length > 0 && (
        <div style={{ marginTop: 12, borderTop: "1px solid #334155", paddingTop: 12 }}>
          <p style={{ fontSize: 10, color: "#10b981", margin: "0 0 4px 0" }}>Highlights</p>
          {section.highlights.slice(0, 2).map((h: string, i: number) => (
            <p key={i} style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0" }}>• {h}</p>
          ))}
        </div>
      )}
      {section.concerns.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <p style={{ fontSize: 10, color: "#f59e0b", margin: "0 0 4px 0" }}>Concerns</p>
          {section.concerns.map((c: string, i: number) => (
            <p key={i} style={{ fontSize: 11, color: "#f59e0b", margin: "2px 0" }}>• {c}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReportsPage() {
  const report = generateAnnualReport(new Date().getFullYear());

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#3b82f6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          Cross-Domain Reporting
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>
          Institutional Report
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 640 }}>
          Aggregated evidence from all operational areas. Generated from canonical records with full traceability.
        </p>
      </div>

      {/* Overall Score */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", borderRadius: 16, padding: "32px 40px", marginBottom: 32, border: "1px solid #334155" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 8px 0" }}>Overall Institutional Health</p>
            <p style={{ fontSize: 48, fontWeight: 700, color: report.overallScore >= 80 ? "#10b981" : "#f59e0b", margin: 0 }}>{report.overallScore}</p>
            <p style={{ fontSize: 14, color: "#94a3b8", margin: "4px 0 0 0" }}>out of 100</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 4px 0" }}>Report Period</p>
            <p style={{ fontSize: 18, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{report.period}</p>
            <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0 0" }}>Generated: {new Date(report.generatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Domain Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 32 }}>
        {report.sections.map((section) => (
          <DomainCard key={section.domain} section={section} />
        ))}
      </div>

      {/* Executive Summary */}
      <WidgetCard title="Executive Summary">
        <div style={{ background: "#0f172a", borderRadius: 8, padding: "16px 20px", fontFamily: "monospace", fontSize: 12, color: "#94a3b8", whiteSpace: "pre-wrap", maxHeight: 400, overflow: "auto" }}>
          {report.executiveSummary}
        </div>
      </WidgetCard>

      {/* Recommendations */}
      <div style={{ marginTop: 24 }}>
        <WidgetCard title="Cross-Domain Recommendations">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {report.recommendations.map((rec, i) => (
              <div key={i} style={{ padding: "12px 16px", background: "#0f172a", borderRadius: 8, border: "1px solid #334155" }}>
                <p style={{ fontSize: 13, color: "#f8fafc", margin: 0 }}>{rec}</p>
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>

      {/* Report Summary */}
      <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <div style={{ background: "#1e293b", borderRadius: 12, padding: "16px 20px" }}>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 4px 0" }}>Domains Assessed</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#f8fafc", margin: 0 }}>{report.sections.length}</p>
        </div>
        <div style={{ background: "#1e293b", borderRadius: 12, padding: "16px 20px" }}>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 4px 0" }}>Total Metrics</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#f8fafc", margin: 0 }}>
            {report.sections.reduce((sum, s) => sum + s.metrics.length, 0)}
          </p>
        </div>
        <div style={{ background: "#1e293b", borderRadius: 12, padding: "16px 20px" }}>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 4px 0" }}>Evidence Items</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#06b6d4", margin: 0 }}>
            {report.sections.reduce((sum, s) => sum + s.evidenceCount, 0)}
          </p>
        </div>
        <div style={{ background: "#1e293b", borderRadius: 12, padding: "16px 20px" }}>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 4px 0" }}>Recommendations</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#f59e0b", margin: 0 }}>{report.recommendations.length}</p>
        </div>
      </div>
    </div>
  );
}
