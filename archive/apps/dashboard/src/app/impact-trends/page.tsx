import {
  getImpactMetrics,
  getImpactRecords,
  calculateImpactTrends,
  compareMultiYear,
  getLongTermImpactSummary,
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

function TrendBadge({ direction }: { direction: string }) {
  const trendColors: Record<string, { bg: string; text: string; symbol: string }> = {
    improving: { bg: "#10b98120", text: "#10b981", symbol: "↑" },
    declining: { bg: "#ef444420", text: "#ef4444", symbol: "↓" },
    stable: { bg: "#64748b20", text: "#64748b", symbol: "→" },
  };

  const trend = trendColors[direction] || trendColors.stable;

  return (
    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: trend.bg, color: trend.text }}>
      {trend.symbol} {direction}
    </span>
  );
}

function TrendCard({ trend }: { trend: any }) {
  const domainColors: Record<string, { bg: string; text: string }> = {
    forest: { bg: "#10b98120", text: "#10b981" },
    heritage: { bg: "#8b5cf620", text: "#8b5cf6" },
    research: { bg: "#3b82f620", text: "#3b82f6" },
    volunteer: { bg: "#f59e0b20", text: "#f59e0b" },
    governance: { bg: "#ef444420", text: "#ef4444" },
    knowledge: { bg: "#06b6d420", text: "#06b6d4" },
    "cross-domain": { bg: "#64748b20", text: "#64748b" },
  };

  const colors = domainColors[trend.domain] || domainColors["cross-domain"];

  return (
    <div style={{ padding: "16px 20px", background: "#0f172a", borderRadius: 8, border: "1px solid #334155" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: "#f8fafc", margin: 0 }}>{trend.metricName}</h3>
          <TrendBadge direction={trend.direction} />
        </div>
        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: colors.bg, color: colors.text }}>
          {trend.domain}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <div>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>Current</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{trend.currentValue}</p>
        </div>
        <div>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>Previous</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{trend.previousValue}</p>
        </div>
        <div>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>Change</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: trend.change >= 0 ? "#10b981" : "#ef4444", margin: 0 }}>
            {trend.change >= 0 ? "+" : ""}{trend.change}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>Change %</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: trend.changePercent >= 0 ? "#10b981" : "#ef4444", margin: 0 }}>
            {trend.changePercent >= 0 ? "+" : ""}{trend.changePercent}%
          </p>
        </div>
      </div>
    </div>
  );
}

function MultiYearCard({ comparison }: { comparison: any }) {
  const domainColors: Record<string, { bg: string; text: string }> = {
    forest: { bg: "#10b98120", text: "#10b981" },
    heritage: { bg: "#8b5cf620", text: "#8b5cf6" },
    research: { bg: "#3b82f620", text: "#3b82f6" },
    volunteer: { bg: "#f59e0b20", text: "#f59e0b" },
    governance: { bg: "#ef444420", text: "#ef4444" },
    knowledge: { bg: "#06b6d420", text: "#06b6d4" },
    "cross-domain": { bg: "#64748b20", text: "#64748b" },
  };

  const colors = domainColors[comparison.domain] || domainColors["cross-domain"];

  return (
    <div style={{ padding: "16px 20px", background: "#0f172a", borderRadius: 8, border: "1px solid #334155" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: "#f8fafc", margin: 0 }}>{comparison.metricName}</h3>
          <TrendBadge direction={comparison.overallTrend} />
        </div>
        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: colors.bg, color: colors.text }}>
          {comparison.domain}
        </span>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 8, overflowX: "auto" }}>
        {comparison.years.map((yearData: any) => (
          <div key={yearData.year} style={{ minWidth: 60, padding: "6px 10px", background: "#1e293b", borderRadius: 6, textAlign: "center" }}>
            <p style={{ fontSize: 10, color: "#64748b", margin: "0 0 2px 0" }}>{yearData.year}</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{yearData.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        <div>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>Total Change</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: comparison.totalChange >= 0 ? "#10b981" : "#ef4444", margin: 0 }}>
            {comparison.totalChange >= 0 ? "+" : ""}{comparison.totalChange}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>Avg Annual Change</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: comparison.averageAnnualChange >= 0 ? "#10b981" : "#ef4444", margin: 0 }}>
            {comparison.averageAnnualChange >= 0 ? "+" : ""}{comparison.averageAnnualChange}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ImpactTrendsPage() {
  const metrics = getImpactMetrics();
  const records = getImpactRecords();
  const trends = calculateImpactTrends();
  const multiYear = compareMultiYear();
  const summary = getLongTermImpactSummary();

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#14b8a6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          Phase IV: Institutional Stewardship
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>
          Long-Term Impact
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 640 }}>
          Multi-year outcome analysis across all domains. Track institutional progress over years, not just individual projects.
        </p>
      </div>

      {/* Top Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard label="Impact Metrics" value={summary.totalMetrics} color="#f8fafc" />
        <StatCard label="Data Points" value={summary.totalRecords} color="#3b82f6" />
        <StatCard label="Improving" value={summary.improvingTrends} color="#10b981" />
        <StatCard label="Declining" value={summary.decliningTrends} color="#ef4444" />
        <StatCard label="Stable" value={summary.stableTrends} color="#64748b" />
      </div>

      {/* Domain Distribution */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, marginBottom: 32 }}>
        <WidgetCard title="Metrics by Domain">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(summary.byDomain).map(([domain, count]) => (
              <div key={domain} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{domain}</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc" }}>{count}</span>
              </div>
            ))}
          </div>
        </WidgetCard>

        <WidgetCard title="Metrics by Category">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(summary.byCategory).map(([category, count]) => (
              <div key={category} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{category}</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc" }}>{count}</span>
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>

      {/* Trends */}
      <div style={{ marginBottom: 32 }}>
        <WidgetCard title={`Impact Trends (${trends.length})`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {trends.length === 0 ? (
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                No impact metrics tracked yet. Add metrics to see trends.
              </p>
            ) : (
              trends.map((trend) => (
                <TrendCard key={trend.metricId} trend={trend} />
              ))
            )}
          </div>
        </WidgetCard>
      </div>

      {/* Multi-Year Comparison */}
      <WidgetCard title="Multi-Year Comparison">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {multiYear.length === 0 ? (
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
              No multi-year data available. Add records over multiple years to see comparisons.
            </p>
          ) : (
            multiYear.map((comparison) => (
              <MultiYearCard key={comparison.metricId} comparison={comparison} />
            ))
          )}
        </div>
      </WidgetCard>
    </div>
  );
}
