import {
  getPlaybooks,
  getPlaybookSummary,
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

function PlaybookCard({ playbook }: { playbook: any }) {
  const domainColors: Record<string, { bg: string; text: string }> = {
    forest: { bg: "#10b98120", text: "#10b981" },
    heritage: { bg: "#8b5cf620", text: "#8b5cf6" },
    research: { bg: "#3b82f620", text: "#3b82f6" },
    volunteer: { bg: "#f59e0b20", text: "#f59e0b" },
    governance: { bg: "#ef444420", text: "#ef4444" },
    knowledge: { bg: "#06b6d420", text: "#06b6d4" },
    "cross-domain": { bg: "#64748b20", text: "#64748b" },
  };

  const colors = domainColors[playbook.domain] || domainColors["cross-domain"];

  return (
    <div style={{ padding: "20px 24px", background: "#0f172a", borderRadius: 12, border: "1px solid #334155" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{playbook.name}</h3>
        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: colors.bg, color: colors.text }}>
          {playbook.domain}
        </span>
      </div>
      <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 12px 0" }}>{playbook.description}</p>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 12 }}>
        <div style={{ padding: "8px 12px", background: "#1e293b", borderRadius: 8 }}>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>Confidence</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{Math.round(playbook.confidence * 100)}%</p>
        </div>
        <div style={{ padding: "8px 12px", background: "#1e293b", borderRadius: 8 }}>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>Phases</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{playbook.phases.length}</p>
        </div>
        <div style={{ padding: "8px 12px", background: "#1e293b", borderRadius: 8 }}>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>Sources</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{playbook.sourceCount}</p>
        </div>
        <div style={{ padding: "8px 12px", background: "#1e293b", borderRadius: 8 }}>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>Version</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", margin: 0 }}>{playbook.version}</p>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 6px 0" }}>Phases:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {playbook.phases.map((phase: any) => (
            <div key={phase.id} style={{ padding: "10px 14px", background: "#1e293b", borderRadius: 8, border: "1px solid #334155" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: "#f8fafc", margin: 0 }}>
                  {phase.order}. {phase.name}
                </p>
                {phase.duration && (
                  <span style={{ fontSize: 10, color: "#64748b" }}>{phase.duration}</span>
                )}
              </div>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 6px 0" }}>{phase.description}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {phase.tasks.map((task: any) => (
                  <span key={task.id} style={{ fontSize: 10, padding: "2px 6px", background: "#334155", color: "#94a3b8", borderRadius: 4 }}>
                    {task.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 6px 0" }}>Success Criteria:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {playbook.successCriteria.map((criteria: string, i: number) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#10b981", fontSize: 12 }}>✓</span>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{criteria}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 6px 0" }}>Tags:</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {playbook.tags.map((tag: string) => (
              <span key={tag} style={{ fontSize: 10, padding: "2px 8px", background: "#334155", color: "#94a3b8", borderRadius: 4 }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlaybooksPage() {
  const playbooks = getPlaybooks();
  const summary = getPlaybookSummary();

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#10b981", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          Phase III: Institutional Playbooks
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>
          Reusable Guidance
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 640 }}>
          Playbooks generated from validated lessons and patterns. Each playbook provides a structured approach for recurring mission types.
        </p>
      </div>

      {/* Top Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard label="Playbooks" value={summary.totalPlaybooks} color="#f8fafc" />
        <StatCard label="Domains" value={summary.domains} color="#10b981" />
        <StatCard label="Avg Confidence" value={`${Math.round(summary.avgConfidence * 100)}%`} color="#3b82f6" />
        <StatCard label="Total Phases" value={summary.totalPhases} color="#8b5cf6" />
        <StatCard label="Total Tasks" value={summary.totalTasks} color="#f59e0b" />
      </div>

      {/* Playbooks */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {playbooks.length === 0 ? (
          <WidgetCard title="Playbooks">
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>No playbooks generated yet. Complete more missions to generate playbooks.</p>
          </WidgetCard>
        ) : (
          playbooks.map((playbook) => (
            <PlaybookCard key={playbook.id} playbook={playbook} />
          ))
        )}
      </div>
    </div>
  );
}
