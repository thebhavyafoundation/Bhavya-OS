import {
  getLifecycleEntries,
  getLifecycleStats,
  getReviewStats,
  getEntriesNeedingReview,
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

function StateBadge({ state }: { state: string }) {
  const stateColors: Record<string, { bg: string; text: string }> = {
    draft: { bg: "#64748b20", text: "#64748b" },
    published: { bg: "#10b98120", text: "#10b981" },
    reviewed: { bg: "#3b82f620", text: "#3b82f6" },
    archived: { bg: "#f59e0b20", text: "#f59e0b" },
    preserved: { bg: "#8b5cf620", text: "#8b5cf6" },
  };

  const colors = stateColors[state] || stateColors.draft;

  return (
    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: colors.bg, color: colors.text }}>
      {state}
    </span>
  );
}

function LifecycleEntryCard({ entry }: { entry: any }) {
  const typeColors: Record<string, { bg: string; text: string }> = {
    document: { bg: "#3b82f620", text: "#3b82f6" },
    lesson: { bg: "#10b98120", text: "#10b981" },
    pattern: { bg: "#8b5cf620", text: "#8b5cf6" },
    playbook: { bg: "#f59e0b20", text: "#f59e0b" },
    "decision-context": { bg: "#ef444420", text: "#ef4444" },
    evidence: { bg: "#06b6d420", text: "#06b6d4" },
  };

  const colors = typeColors[entry.knowledgeType] || typeColors.document;

  return (
    <div style={{ padding: "16px 20px", background: "#0f172a", borderRadius: 8, border: "1px solid #334155" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: "#f8fafc", margin: 0 }}>{entry.title}</h3>
          <StateBadge state={entry.state} />
        </div>
        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: colors.bg, color: colors.text }}>
          {entry.knowledgeType}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 8 }}>
        <div>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>Review Cycle</p>
          <p style={{ fontSize: 12, fontWeight: 500, color: "#f8fafc", margin: 0 }}>{entry.reviewCycle}</p>
        </div>
        <div>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>Next Review</p>
          <p style={{ fontSize: 12, fontWeight: 500, color: entry.nextReview && new Date(entry.nextReview) < new Date() ? "#ef4444" : "#f8fafc", margin: 0 }}>
            {entry.nextReview ? new Date(entry.nextReview).toLocaleDateString() : "None"}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px 0" }}>Last Updated</p>
          <p style={{ fontSize: 12, fontWeight: 500, color: "#f8fafc", margin: 0 }}>
            {new Date(entry.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      </div>

      {entry.reviewHistory.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 4px 0" }}>Recent Reviews:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {entry.reviewHistory.slice(-2).map((review: any) => (
              <div key={review.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <StateBadge state={review.previousState} />
                <span style={{ fontSize: 10, color: "#64748b" }}>→</span>
                <StateBadge state={review.newState} />
                <span style={{ fontSize: 10, color: "#94a3b8" }}>
                  by {review.reviewer} on {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {entry.archiveReason && (
        <p style={{ fontSize: 11, color: "#f59e0b", margin: "8px 0 0 0" }}>
          Archive reason: {entry.archiveReason}
        </p>
      )}

      {entry.preservationReason && (
        <p style={{ fontSize: 11, color: "#8b5cf6", margin: "8px 0 0 0" }}>
          Preservation reason: {entry.preservationReason}
        </p>
      )}
    </div>
  );
}

export default function LifecyclePage() {
  const entries = getLifecycleEntries();
  const stats = getLifecycleStats();
  const reviewStats = getReviewStats();
  const needsReview = getEntriesNeedingReview();

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#8b5cf6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          Phase IV: Institutional Stewardship
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>
          Knowledge Lifecycle
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 640 }}>
          Track the lifecycle of institutional knowledge from draft through publication, review, and archival. Ensure knowledge remains current and accessible.
        </p>
      </div>

      {/* Top Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Knowledge" value={stats.total} color="#f8fafc" />
        <StatCard label="Published" value={stats.byState.published} color="#10b981" />
        <StatCard label="Reviewed" value={stats.byState.reviewed} color="#3b82f6" />
        <StatCard label="Archived" value={stats.byState.archived} color="#f59e0b" />
        <StatCard label="Preserved" value={stats.byState.preserved} color="#8b5cf6" />
      </div>

      {/* Review Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard label="Needs Review" value={reviewStats.needsReview} color="#ef4444" />
        <StatCard label="Overdue" value={reviewStats.overdue} color="#ef4444" />
        <StatCard label="Upcoming (30 days)" value={reviewStats.upcomingMonth} color="#f59e0b" />
        <StatCard label="Active Knowledge" value={reviewStats.total} color="#10b981" />
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Knowledge by State */}
        <WidgetCard title="Knowledge by State">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(stats.byState).map(([state, count]) => (
              <div key={state} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <StateBadge state={state} />
                <span style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc" }}>{count}</span>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Knowledge by Type */}
        <WidgetCard title="Knowledge by Type">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{type}</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc" }}>{count}</span>
              </div>
            ))}
            {Object.keys(stats.byType).length === 0 && (
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>No knowledge tracked yet</p>
            )}
          </div>
        </WidgetCard>
      </div>

      {/* Needs Review */}
      {needsReview.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <WidgetCard title={`Needs Review (${needsReview.length})`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {needsReview.slice(0, 5).map((entry) => (
                <LifecycleEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </WidgetCard>
        </div>
      )}

      {/* All Knowledge */}
      <WidgetCard title={`All Knowledge (${entries.length})`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {entries.length === 0 ? (
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
              No knowledge lifecycle entries yet. Knowledge will be tracked as it is created and used.
            </p>
          ) : (
            entries.slice(0, 10).map((entry) => (
              <LifecycleEntryCard key={entry.id} entry={entry} />
            ))
          )}
        </div>
      </WidgetCard>
    </div>
  );
}
