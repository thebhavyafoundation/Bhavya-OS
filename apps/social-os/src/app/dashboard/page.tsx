import { getAnalyticsSummary } from "@/analytics/collector";
import { listPublications, getPublication } from "@/lib/publications";
import { getPendingApprovals } from "@/approval/gate";
import { getRecentEvents } from "@/lib/events";
import { getQueue } from "@/queue/queue";

export default function DashboardPage() {
  const summary = getAnalyticsSummary();
  const pendingApprovals = getPendingApprovals();
  const recentPublications = listPublications({ limit: 10 });
  const queue = getQueue(undefined, 10);
  const recentEvents = getRecentEvents(20);

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#1a3a2a" }}>
        Social OS Dashboard
      </h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Bhavya Foundation — Content Publishing Hub
      </p>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard
          label="Total Publications"
          value={summary.totalPublications}
        />
        <StatCard label="Published" value={summary.publishedCount} />
        <StatCard label="Total Impressions" value={summary.totalImpressions} />
        <StatCard label="Total Engagement" value={summary.totalEngagement} />
      </div>

      {/* Pending Approvals */}
      <section style={{ marginBottom: "2rem" }}>
        <h2
          style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#1a3a2a" }}
        >
          Pending Approvals ({pendingApprovals.length})
        </h2>
        {pendingApprovals.length === 0 ? (
          <p style={{ color: "#888" }}>No pending approvals</p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {pendingApprovals.map((a) => (
              <div
                key={a.id}
                style={{
                  padding: "1rem",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>{a.publicationId}</strong>
                  <span style={{ color: "#888", marginLeft: "1rem" }}>
                    Requested: {new Date(a.requestedAt).toLocaleString()}
                  </span>
                </div>
                <span
                  style={{
                    padding: "0.25rem 0.75rem",
                    background: "#fff3cd",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                  }}
                >
                  Pending
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Publications */}
      <section style={{ marginBottom: "2rem" }}>
        <h2
          style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#1a3a2a" }}
        >
          Recent Publications
        </h2>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {recentPublications.map((p) => (
            <div
              key={p.id}
              style={{
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{p.title}</strong>
                <span style={{ color: "#888", marginLeft: "1rem" }}>
                  {p.source.type}
                </span>
              </div>
              <StatusBadge status={p.status} />
            </div>
          ))}
        </div>
      </section>

      {/* Queue */}
      <section style={{ marginBottom: "2rem" }}>
        <h2
          style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#1a3a2a" }}
        >
          Publication Queue
        </h2>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {queue.map((q) => (
            <div
              key={q.id}
              style={{
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{q.publicationId}</strong>
                <span style={{ color: "#888", marginLeft: "1rem" }}>
                  Priority: {q.priority}
                </span>
              </div>
              <StatusBadge status={q.status} />
            </div>
          ))}
        </div>
      </section>

      {/* Recent Events */}
      <section>
        <h2
          style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#1a3a2a" }}
        >
          Recent Events
        </h2>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {recentEvents.map((e) => (
            <div
              key={e.id}
              style={{
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{e.type}</strong>
                <span style={{ color: "#888", marginLeft: "1rem" }}>
                  {new Date(e.createdAt).toLocaleString()}
                </span>
              </div>
              <span
                style={{
                  padding: "0.25rem 0.75rem",
                  background: e.processed ? "#d4edda" : "#fff3cd",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              >
                {e.processed ? "Processed" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        padding: "1.5rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#1a3a2a" }}>
        {value.toLocaleString()}
      </div>
      <div style={{ color: "#666", fontSize: "0.875rem" }}>{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: "#6c757d",
    pending_approval: "#ffc107",
    approved: "#28a745",
    rejected: "#dc3545",
    published: "#17a2b8",
    analytics_collected: "#6f42c1",
  };
  const color = colors[status] || "#6c757d";

  return (
    <span
      style={{
        padding: "0.25rem 0.75rem",
        background: color,
        color: "white",
        borderRadius: "4px",
        fontSize: "0.875rem",
      }}
    >
      {status.replace("_", " ")}
    </span>
  );
}
