import {
  getDependencies,
  getContinuityGaps,
  assessResilience,
  getResilienceStats,
  buildDependencyMap,
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

function SeverityBadge({ severity }: { severity: string }) {
  const severityColors: Record<string, { bg: string; text: string }> = {
    low: { bg: "#10b98120", text: "#10b981" },
    medium: { bg: "#f59e0b20", text: "#f59e0b" },
    high: { bg: "#ef444420", text: "#ef4444" },
    critical: { bg: "#dc262620", text: "#dc2626" },
  };

  const colors = severityColors[severity] || severityColors.low;

  return (
    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: colors.bg, color: colors.text }}>
      {severity}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    identified: { bg: "#64748b20", text: "#64748b" },
    acknowledged: { bg: "#f59e0b20", text: "#f59e0b" },
    mitigating: { bg: "#3b82f620", text: "#3b82f6" },
    resolved: { bg: "#10b98120", text: "#10b981" },
  };

  const colors = statusColors[status] || statusColors.identified;

  return (
    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: colors.bg, color: colors.text }}>
      {status}
    </span>
  );
}

function CriticalityBadge({ criticality }: { criticality: string }) {
  const criticalityColors: Record<string, { bg: string; text: string }> = {
    critical: { bg: "#dc262620", text: "#dc2626" },
    important: { bg: "#f59e0b20", text: "#f59e0b" },
    standard: { bg: "#3b82f620", text: "#3b82f6" },
  };

  const colors = criticalityColors[criticality] || criticalityColors.standard;

  return (
    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: colors.bg, color: colors.text }}>
      {criticality}
    </span>
  );
}

function GapCard({ gap }: { gap: any }) {
  const categoryLabels: Record<string, string> = {
    "single-point-of-failure": "Single Point of Failure",
    "undocumented-knowledge": "Undocumented Knowledge",
    "missing-playbook": "Missing Playbook",
    "unowned-asset": "Unowned Asset",
    "skill-gap": "Skill Gap",
    "dependency-risk": "Dependency Risk",
  };

  return (
    <div style={{ padding: "16px 20px", background: "#0f172a", borderRadius: 8, border: "1px solid #334155" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: "#f8fafc", margin: 0 }}>{gap.title}</h3>
          <SeverityBadge severity={gap.severity} />
        </div>
        <StatusBadge status={gap.status} />
      </div>

      <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 8px 0" }}>{gap.description}</p>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#64748b" }}>
          Category: {categoryLabels[gap.category] || gap.category}
        </span>
        <span style={{ fontSize: 11, color: "#64748b" }}>
          Affected: {gap.affectedEntity}
        </span>
      </div>

      {gap.mitigation && (
        <p style={{ fontSize: 11, color: "#10b981", margin: "8px 0 0 0" }}>
          Mitigation: {gap.mitigation}
        </p>
      )}
    </div>
  );
}

function DependencyCard({ dependency }: { dependency: any }) {
  return (
    <div style={{ padding: "12px 16px", background: "#0f172a", borderRadius: 8, border: "1px solid #334155" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: "#f8fafc" }}>
            {dependency.sourceType}: {dependency.sourceId}
          </span>
          <span style={{ fontSize: 10, color: "#64748b" }}>→</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: "#f8fafc" }}>
            {dependency.targetType}: {dependency.targetId}
          </span>
        </div>
        <CriticalityBadge criticality={dependency.criticality} />
      </div>
      <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{dependency.description}</p>
    </div>
  );
}

export default function ResiliencePage() {
  const dependencies = getDependencies();
  const gaps = getContinuityGaps();
  const resilience = assessResilience();
  const stats = getResilienceStats();
  const dependencyMap = buildDependencyMap();

  const criticalGaps = gaps.filter((g) => g.severity === "critical");
  const criticalDeps = dependencies.filter((d) => d.criticality === "critical");

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#dc2626", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          Phase IV: Institutional Stewardship
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>
          Institutional Resilience
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 640 }}>
          Map institutional dependencies and identify continuity gaps. Ensure the institution can sustain itself across decades.
        </p>
      </div>

      {/* Top Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard label="Resilience Score" value={`${resilience.overall}%`} color="#f8fafc" />
        <StatCard label="Dependencies" value={stats.totalDependencies} color="#3b82f6" />
        <StatCard label="Continuity Gaps" value={stats.totalGaps} color="#ef4444" />
        <StatCard label="Critical Gaps" value={resilience.criticalGaps} color="#dc2626" />
        <StatCard label="Mitigated" value={resilience.mitigatedGaps} color="#10b981" />
      </div>

      {/* Resilience Score Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard label="Low Severity" value={stats.bySeverity.low} color="#10b981" />
        <StatCard label="Medium Severity" value={stats.bySeverity.medium} color="#f59e0b" />
        <StatCard label="High Severity" value={stats.bySeverity.high} color="#ef4444" />
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Gaps by Category */}
        <WidgetCard title="Gaps by Category">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(stats.byCategory).map(([category, count]) => (
              <div key={category} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{category.replace(/-/g, " ")}</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc" }}>{count}</span>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Gaps by Status */}
        <WidgetCard title="Gaps by Status">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <div key={status} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <StatusBadge status={status} />
                <span style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc" }}>{count}</span>
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>

      {/* Critical Gaps */}
      {criticalGaps.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <WidgetCard title={`Critical Gaps (${criticalGaps.length})`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {criticalGaps.map((gap) => (
                <GapCard key={gap.id} gap={gap} />
              ))}
            </div>
          </WidgetCard>
        </div>
      )}

      {/* Critical Dependencies */}
      {criticalDeps.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <WidgetCard title={`Critical Dependencies (${criticalDeps.length})`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {criticalDeps.map((dep) => (
                <DependencyCard key={dep.id} dependency={dep} />
              ))}
            </div>
          </WidgetCard>
        </div>
      )}

      {/* Dependency Map */}
      <WidgetCard title={`Dependency Map (${dependencyMap.nodes.length} nodes, ${dependencyMap.edges.length} edges)`}>
        <div style={{ padding: "20px", background: "#0f172a", borderRadius: 8, border: "1px solid #334155" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
            {dependencyMap.nodes.slice(0, 10).map((node) => (
              <div key={node.id} style={{ padding: "8px 12px", background: "#1e293b", borderRadius: 6 }}>
                <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>{node.type}</p>
                <p style={{ fontSize: 12, fontWeight: 500, color: "#f8fafc", margin: 0 }}>{node.id}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>
            {dependencyMap.edges.length} dependencies mapped across {dependencyMap.nodes.length} entities
          </p>
        </div>
      </WidgetCard>

      {/* All Gaps */}
      <div style={{ marginTop: 24 }}>
        <WidgetCard title={`All Continuity Gaps (${gaps.length})`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {gaps.length === 0 ? (
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                No continuity gaps identified yet. Resilience analysis will detect gaps as the institution grows.
              </p>
            ) : (
              gaps.slice(0, 10).map((gap) => (
                <GapCard key={gap.id} gap={gap} />
              ))
            )}
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
