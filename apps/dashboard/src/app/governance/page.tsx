import {
  getBoardMeetings,
  getResolutions,
  getPolicies,
  getGovernanceStats,
  getUpcomingMeetings,
  getOverdueResolutions,
  getPoliciesDueForReview,
  getOperationalHealth,
  getActionItems,
  getActionItemStats,
  getOverdueActionItems,
  getTrendMetrics,
  getLatestSnapshot,
} from "@bhavya/content-core";

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
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

export default function GovernancePage() {
  const stats = getGovernanceStats();
  const operationalHealth = getOperationalHealth();
  const actionStats = getActionItemStats();
  const trendData = getTrendMetrics();
  const latestSnapshot = getLatestSnapshot();
  const upcomingMeetings = getUpcomingMeetings();
  const overdueResolutions = getOverdueResolutions();
  const policiesDueForReview = getPoliciesDueForReview();
  const overdueActions = getOverdueActionItems();

  const recentResolutions = [...getResolutions()]
    .sort((a, b) => (b.created || "").localeCompare(a.created || ""))
    .slice(0, 5);

  const recentPolicies = [...getPolicies()]
    .sort((a, b) => (b.updated || "").localeCompare(a.updated || ""))
    .slice(0, 5);

  const recentActions = [...getActionItems()]
    .sort((a, b) => (b.updated || "").localeCompare(a.updated || ""))
    .slice(0, 5);

  // Get resolutions due for implementation
  const resolutionsDueForImplementation = getResolutions().filter(
    (r) => r.status === "approved" && r.dueDate
  );

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#f59e0b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          Governance Operations
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>
          Board & Policy Management
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 640 }}>
          Track board meetings, resolutions, and policy compliance. All data flows from institutional knowledge.
        </p>
      </div>

      {/* Top Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard label="Board Meetings" value={stats.totalMeetings} color="#f59e0b" />
        <StatCard label="Resolutions" value={stats.totalResolutions} color="#3b82f6" />
        <StatCard label="Policies" value={stats.totalPolicies} color="#8b5cf6" />
        <StatCard label="Pending Reviews" value={stats.pendingReviews} color="#ef4444" />
      </div>

      {/* Operational Health */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        <div style={{ background: "#1e293b", borderRadius: 12, padding: "16px 20px" }}>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 4px 0" }}>Implementation Rate</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: operationalHealth.implementationRate >= 80 ? "#10b981" : "#f59e0b", margin: 0 }}>
            {operationalHealth.implementationRate}%
          </p>
        </div>
        <div style={{ background: "#1e293b", borderRadius: 12, padding: "16px 20px" }}>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 4px 0" }}>Avg Days to Resolution</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: operationalHealth.avgTimeToResolution <= 30 ? "#10b981" : "#f59e0b", margin: 0 }}>
            {operationalHealth.avgTimeToResolution}
          </p>
        </div>
        <div style={{ background: "#1e293b", borderRadius: 12, padding: "16px 20px" }}>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 4px 0" }}>Policy Compliance</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: operationalHealth.policyComplianceRate >= 90 ? "#10b981" : "#f59e0b", margin: 0 }}>
            {operationalHealth.policyComplianceRate}%
          </p>
        </div>
        <div style={{ background: "#1e293b", borderRadius: 12, padding: "16px 20px" }}>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 4px 0" }}>Action Completion</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: actionStats.completionRate >= 80 ? "#10b981" : "#f59e0b", margin: 0 }}>
            {actionStats.completionRate}%
          </p>
        </div>
      </div>

      {/* Trend Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
        {trendData.metrics.length > 0 ? (
          trendData.metrics.map((metric) => (
            <div key={metric.name} style={{ background: "#0f172a", borderRadius: 8, padding: "12px 16px", border: "1px solid #334155" }}>
              <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>{metric.name}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: 0 }}>
                  {metric.current}{metric.unit}
                </p>
                {metric.direction !== "stable" && (
                  <p style={{ fontSize: 10, color: metric.direction === "up" ? "#10b981" : "#ef4444", margin: 0 }}>
                    {metric.direction === "up" ? "↑" : "↓"} {Math.abs(metric.change)}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <>
            <div style={{ background: "#0f172a", borderRadius: 8, padding: "12px 16px", border: "1px solid #334155" }}>
              <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>Open Resolutions</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{operationalHealth.openResolutions}</p>
            </div>
            <div style={{ background: "#0f172a", borderRadius: 8, padding: "12px 16px", border: "1px solid #334155" }}>
              <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>Policies Approaching Review</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: operationalHealth.policiesApproachingReview > 0 ? "#f59e0b" : "#f8fafc", margin: 0 }}>
                {operationalHealth.policiesApproachingReview}
              </p>
            </div>
            <div style={{ background: "#0f172a", borderRadius: 8, padding: "12px 16px", border: "1px solid #334155" }}>
              <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>Avg Policy Versions</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{operationalHealth.avgPolicyVersions}</p>
            </div>
            <div style={{ background: "#0f172a", borderRadius: 8, padding: "12px 16px", border: "1px solid #334155" }}>
              <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>Avg Days to Complete</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{actionStats.avgDaysToComplete}</p>
            </div>
            <div style={{ background: "#0f172a", borderRadius: 8, padding: "12px 16px", border: "1px solid #334155" }}>
              <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>Snapshot Status</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#f59e0b", margin: 0 }}>No data</p>
            </div>
          </>
        )}
      </div>

      {/* Alerts */}
      {(overdueResolutions.length > 0 || policiesDueForReview.length > 0) && (
        <div style={{ display: "grid", gridTemplateColumns: overdueResolutions.length > 0 && policiesDueForReview.length > 0 ? "1fr 1fr" : "1fr", gap: 24, marginBottom: 32 }}>
          {overdueResolutions.length > 0 && (
            <div style={{ background: "#ef444420", border: "1px solid #ef4444", borderRadius: 12, padding: "16px 24px" }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#ef4444", margin: "0 0 8px 0" }}>⚠ Overdue Resolutions</p>
              <p style={{ fontSize: 13, color: "#f8fafc", margin: 0 }}>
                {overdueResolutions.length} resolution{overdueResolutions.length > 1 ? "s" : ""} past due date
              </p>
            </div>
          )}
          {policiesDueForReview.length > 0 && (
            <div style={{ background: "#f59e0b20", border: "1px solid #f59e0b", borderRadius: 12, padding: "16px 24px" }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#f59e0b", margin: "0 0 8px 0" }}>📋 Policies Due for Review</p>
              <p style={{ fontSize: 13, color: "#f8fafc", margin: 0 }}>
                {policiesDueForReview.length} polic{policiesDueForReview.length > 1 ? "ies" : "y"} require review
              </p>
            </div>
          )}
        </div>
      )}

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Upcoming Meetings */}
        <WidgetCard title="Upcoming Board Meetings">
          {upcomingMeetings.length === 0 ? (
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>No upcoming meetings scheduled</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {upcomingMeetings.slice(0, 3).map((meeting) => (
                <div key={meeting.id} style={{ padding: "12px 16px", background: "#0f172a", borderRadius: 8, border: "1px solid #334155" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#f8fafc", margin: 0 }}>{meeting.title}</p>
                    <span style={{ fontSize: 11, color: "#10b981" }}>Scheduled</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                    {new Date(meeting.date).toLocaleDateString()} at {meeting.time}
                  </p>
                  <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0 0" }}>
                    {meeting.agenda.length} agenda items
                  </p>
                </div>
              ))}
            </div>
          )}
        </WidgetCard>

        {/* Resolution Status */}
        <WidgetCard title="Resolution Status">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {Object.entries(stats.resolutionsByStatus).map(([status, count]) => (
              <div key={status} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, textTransform: "capitalize" }}>{status.replace(/-/g, " ")}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{count}</p>
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>

      {/* Resolutions Due for Implementation */}
      {resolutionsDueForImplementation.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <WidgetCard title="Resolutions Due for Implementation">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {resolutionsDueForImplementation.map((resolution) => (
                <div key={resolution.id} style={{ padding: "12px 16px", background: "#0f172a", borderRadius: 8, border: "1px solid #f59e0b" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#f8fafc", margin: 0 }}>
                      {resolution.number}: {resolution.title}
                    </p>
                    <span style={{ fontSize: 11, color: "#f59e0b" }}>Due: {resolution.dueDate}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                    Assigned to: {resolution.assignedTo || "Not assigned"}
                  </p>
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>
      )}

      {/* Bottom Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Recent Resolutions */}
        <WidgetCard title="Recent Resolutions">
          {recentResolutions.length === 0 ? (
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>No resolutions yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {recentResolutions.map((resolution) => (
                <div key={resolution.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #334155" }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#f8fafc", margin: 0 }}>
                      {resolution.number}: {resolution.title}
                    </p>
                    <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0 0" }}>
                      Proposed by {resolution.proposer}
                    </p>
                  </div>
                  <span style={{
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: resolution.status === "approved" ? "#10b98120" : resolution.status === "rejected" ? "#ef444420" : "#f59e0b20",
                    color: resolution.status === "approved" ? "#10b981" : resolution.status === "rejected" ? "#ef4444" : "#f59e0b",
                  }}>
                    {resolution.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </WidgetCard>

        {/* Policy Compliance */}
        <WidgetCard title="Policy Compliance">
          {recentPolicies.length === 0 ? (
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>No policies yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {recentPolicies.map((policy) => (
                <div key={policy.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #334155" }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#f8fafc", margin: 0 }}>{policy.title}</p>
                    <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0 0" }}>
                      v{policy.version} • Review: {new Date(policy.reviewDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={{
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: policy.status === "active" ? "#10b98120" : policy.status === "under-review" ? "#f59e0b20" : "#3b82f620",
                    color: policy.status === "active" ? "#10b981" : policy.status === "under-review" ? "#f59e0b" : "#3b82f6",
                  }}>
                    {policy.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </WidgetCard>
      </div>

      {/* Action Items */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
        {/* Action Item Stats */}
        <WidgetCard title="Action Items">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {Object.entries(actionStats.byStatus).map(([status, count]) => (
              <div key={status} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, textTransform: "capitalize" }}>{status.replace(/-/g, " ")}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{count}</p>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #334155", paddingTop: 16 }}>
            <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 8px 0" }}>By Source</p>
            {Object.entries(actionStats.bySource).map(([source, count]) => (
              <div key={source} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, textTransform: "capitalize" }}>{source}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{count}</p>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Overdue Actions */}
        <WidgetCard title="Overdue Actions">
          {overdueActions.length === 0 ? (
            <p style={{ fontSize: 13, color: "#10b981", margin: 0 }}>✓ No overdue actions</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {overdueActions.slice(0, 4).map((action) => (
                <div key={action.id} style={{ padding: "12px 16px", background: "#0f172a", borderRadius: 8, border: "1px solid #ef4444" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#f8fafc", margin: 0 }}>{action.title}</p>
                    <span style={{ fontSize: 10, color: "#ef4444" }}>Due: {action.dueDate}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{action.assignedTo}</p>
                </div>
              ))}
            </div>
          )}
        </WidgetCard>
      </div>
    </div>
  );
}
