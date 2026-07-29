import {
  getRoles,
  getSuccessionStats,
  assessSuccessionReadiness,
  getTransitions,
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

function StatusBadge({ status }: { status: string }) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    active: { bg: "#10b98120", text: "#10b981" },
    vacant: { bg: "#ef444420", text: "#ef4444" },
    transitioning: { bg: "#f59e0b20", text: "#f59e0b" },
  };

  const colors = statusColors[status] || statusColors.active;

  return (
    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: colors.bg, color: colors.text }}>
      {status}
    </span>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const riskColors: Record<string, { bg: string; text: string }> = {
    low: { bg: "#10b98120", text: "#10b981" },
    medium: { bg: "#f59e0b20", text: "#f59e0b" },
    high: { bg: "#ef444420", text: "#ef4444" },
  };

  const colors = riskColors[risk] || riskColors.low;

  return (
    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: colors.bg, color: colors.text }}>
      {risk} risk
    </span>
  );
}

function RoleCard({ role, readiness }: { role: any; readiness?: any }) {
  const domainColors: Record<string, { bg: string; text: string }> = {
    forest: { bg: "#10b98120", text: "#10b981" },
    heritage: { bg: "#8b5cf620", text: "#8b5cf6" },
    research: { bg: "#3b82f620", text: "#3b82f6" },
    volunteer: { bg: "#f59e0b20", text: "#f59e0b" },
    governance: { bg: "#ef444420", text: "#ef4444" },
    knowledge: { bg: "#06b6d420", text: "#06b6d4" },
    "cross-domain": { bg: "#64748b20", text: "#64748b" },
  };

  const colors = domainColors[role.domain] || domainColors["cross-domain"];

  return (
    <div style={{ padding: "20px 24px", background: "#0f172a", borderRadius: 12, border: "1px solid #334155" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{role.name}</h3>
          <StatusBadge status={role.status} />
        </div>
        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: colors.bg, color: colors.text }}>
          {role.domain}
        </span>
      </div>

      <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 12px 0" }}>{role.description}</p>

      {role.currentHolder && (
        <p style={{ fontSize: 12, color: "#10b981", margin: "0 0 8px 0" }}>
          Current Holder: {role.currentHolder}
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 4px 0" }}>Responsibilities ({role.responsibilities.length})</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {role.responsibilities.slice(0, 3).map((resp: string, i: number) => (
              <p key={i} style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>• {resp}</p>
            ))}
            {role.responsibilities.length > 3 && (
              <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>+{role.responsibilities.length - 3} more</p>
            )}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 4px 0" }}>Active Work ({role.activeWork.length})</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {role.activeWork.slice(0, 3).map((work: string, i: number) => (
              <p key={i} style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>• {work}</p>
            ))}
            {role.activeWork.length > 3 && (
              <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>+{role.activeWork.length - 3} more</p>
            )}
          </div>
        </div>
      </div>

      {role.successionPlan && (
        <div style={{ padding: "12px 16px", background: "#1e293b", borderRadius: 8, border: "1px solid #334155" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: "#f8fafc", margin: 0 }}>Succession Plan</p>
            {readiness && <RiskBadge risk={readiness.riskLevel} />}
          </div>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 4px 0" }}>
            Timeline: {role.successionPlan.transitionTimeline}
          </p>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 4px 0" }}>
            Candidates: {role.successionPlan.potentialSuccessors.length}
          </p>
          {readiness && (
            <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>
              Ready Candidates: {readiness.readyCandidates}
            </p>
          )}
        </div>
      )}

      {!role.successionPlan && (
        <div style={{ padding: "12px 16px", background: "#1e293b", borderRadius: 8, border: "1px solid #ef444440" }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: "#ef4444", margin: 0 }}>No Succession Plan</p>
          <p style={{ fontSize: 11, color: "#64748b", margin: "4px 0 0 0" }}>This role lacks a succession plan, creating continuity risk.</p>
        </div>
      )}
    </div>
  );
}

export default function SuccessionPage() {
  const roles = getRoles();
  const stats = getSuccessionStats();
  const readiness = assessSuccessionReadiness();
  const transitions = getTransitions();

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#06b6d4", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          Phase IV: Institutional Stewardship
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>
          Succession Support
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 640 }}>
          Preserve institutional context across leadership transitions. Ensure continuity regardless of individual changes.
        </p>
      </div>

      {/* Top Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Roles" value={stats.totalRoles} color="#f8fafc" />
        <StatCard label="Active" value={stats.activeRoles} color="#10b981" />
        <StatCard label="Vacant" value={stats.vacantRoles} color="#ef4444" />
        <StatCard label="With Plan" value={stats.rolesWithSuccessionPlan} color="#3b82f6" />
        <StatCard label="Without Plan" value={stats.rolesWithoutSuccessionPlan} color="#f59e0b" />
      </div>

      {/* Readiness Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard label="Ready (Low Risk)" value={readiness.readyRoles} color="#10b981" />
        <StatCard label="Near Ready (Medium Risk)" value={readiness.nearReadyRoles} color="#f59e0b" />
        <StatCard label="At Risk" value={readiness.atRiskRoles} color="#ef4444" />
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Roles by Status */}
        <WidgetCard title="Roles by Status">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <StatusBadge status="active" />
              <span style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc" }}>{stats.activeRoles}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <StatusBadge status="vacant" />
              <span style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc" }}>{stats.vacantRoles}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <StatusBadge status="transitioning" />
              <span style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc" }}>{stats.transitioningRoles}</span>
            </div>
          </div>
        </WidgetCard>

        {/* Recent Transitions */}
        <WidgetCard title={`Recent Transitions (${transitions.length})`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {transitions.length === 0 ? (
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>No transitions recorded yet</p>
            ) : (
              transitions.slice(-3).map((transition) => (
                <div key={transition.id} style={{ padding: "12px 16px", background: "#0f172a", borderRadius: 8, border: "1px solid #334155" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: "#f8fafc", margin: 0 }}>
                      {transition.fromHolder} → {transition.toHolder}
                    </p>
                    <span style={{ fontSize: 10, color: "#64748b" }}>
                      {new Date(transition.transitionDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
                    Knowledge transferred: {transition.knowledgeTransferred.length} items
                  </p>
                </div>
              ))
            )}
          </div>
        </WidgetCard>
      </div>

      {/* All Roles */}
      <WidgetCard title={`All Roles (${roles.length})`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {roles.length === 0 ? (
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
              No roles defined yet. Roles will be tracked for succession planning.
            </p>
          ) : (
            roles.map((role) => {
              const roleReadiness = readiness.details.find((d) => d.roleId === role.id);
              return (
                <RoleCard key={role.id} role={role} readiness={roleReadiness} />
              );
            })
          )}
        </div>
      </WidgetCard>
    </div>
  );
}
