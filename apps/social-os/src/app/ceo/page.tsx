import {
  getInstitutionPulse,
  getMissionMetrics,
  getInstitutionMetrics,
} from "@/analytics/institution";
import { getAnalyticsSummary } from "@/analytics/collector";
import { getCalendarStats, getUpcomingEntries } from "@/campaign/calendar";
import { getFeedbackIntelligence } from "@/campaign/community-intelligence";
import { listCampaigns } from "@/campaign/engine";
import { listPublications } from "@/lib/publications";
import { getPendingApprovals } from "@/approval/gate";
import { getRecentEvents } from "@/lib/events";
import { getBrandReviews } from "@/lib/constitution-integration";
import { getCommunicationLoopStatus } from "@/campaign/communication-loop";
import { getGitHubOSFeedback } from "@/lib/github-integration";

export default function CEODashboardPage() {
  const pulse = getInstitutionPulse();
  const mission = getMissionMetrics();
  const analytics = getAnalyticsSummary();
  const calendar = getCalendarStats();
  const feedback = getFeedbackIntelligence();
  const campaigns = listCampaigns({ limit: 10 });
  const publications = listPublications({ limit: 10 });
  const approvals = getPendingApprovals();
  const events = getRecentEvents(20);
  const brandReviews = getBrandReviews();
  const loopStatus = getCommunicationLoopStatus();
  const upcomingEntries = getUpcomingEntries(7);
  const github = getGitHubOSFeedback();

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
        maxWidth: "1400px",
        margin: "0 auto",
        background: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "2rem",
          background: "linear-gradient(135deg, #1a3a2a 0%, #2d5a3d 100%)",
          borderRadius: "12px",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "2rem", margin: 0, marginBottom: "0.5rem" }}>
          Bhavya Foundation — CEO Dashboard
        </h1>
        <p style={{ margin: 0, opacity: 0.9 }}>
          Social OS v2 — Institutional Communication Operating System
        </p>
        <p
          style={{
            margin: 0,
            marginTop: "0.5rem",
            fontSize: "0.875rem",
            opacity: 0.7,
          }}
        >
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Institution Pulse */}
      <section style={{ marginBottom: "2rem" }}>
        <h2
          style={{ fontSize: "1.5rem", color: "#1a3a2a", marginBottom: "1rem" }}
        >
          Institution Pulse
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "1rem",
          }}
        >
          <PulseCard
            label="Overall"
            value={pulse.overall}
            suffix="/100"
            color="#1a3a2a"
          />
          <PulseCard
            label="Trust"
            value={pulse.trust.score}
            trend={pulse.trust.trend}
            color="#28a745"
          />
          <PulseCard
            label="Participation"
            value={pulse.participation.score}
            trend={pulse.participation.trend}
            color="#007bff"
          />
          <PulseCard
            label="Growth"
            value={pulse.growth.score}
            trend={pulse.growth.trend}
            color="#ffc107"
          />
          <PulseCard
            label="Educational"
            value={pulse.educational.score}
            trend={pulse.educational.trend}
            color="#17a2b8"
          />
          <PulseCard
            label="Mission"
            value={pulse.mission.score}
            trend={pulse.mission.trend}
            color="#6f42c1"
          />
        </div>
      </section>

      {/* Mission Metrics */}
      <section style={{ marginBottom: "2rem" }}>
        <h2
          style={{ fontSize: "1.5rem", color: "#1a3a2a", marginBottom: "1rem" }}
        >
          Mission Metrics
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
          }}
        >
          <StatCard label="Trust Score" value={mission.trust} unit="score" />
          <StatCard
            label="Contributors"
            value={mission.contributors}
            unit="people"
          />
          <StatCard label="Mentors" value={mission.mentors} unit="people" />
          <StatCard
            label="Institution Growth"
            value={mission.institutionGrowth}
            unit="impressions"
          />
        </div>
      </section>

      {/* Platform Analytics */}
      <section style={{ marginBottom: "2rem" }}>
        <h2
          style={{ fontSize: "1.5rem", color: "#1a3a2a", marginBottom: "1rem" }}
        >
          Platform Analytics
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
          }}
        >
          <StatCard
            label="Total Publications"
            value={analytics.totalPublications}
          />
          <StatCard label="Published" value={analytics.publishedCount} />
          <StatCard
            label="Total Impressions"
            value={analytics.totalImpressions}
          />
          <StatCard
            label="Total Engagement"
            value={analytics.totalEngagement}
          />
        </div>
      </section>

      {/* Campaigns & Calendar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          marginBottom: "2rem",
        }}
      >
        {/* Active Campaigns */}
        <section>
          <h2
            style={{
              fontSize: "1.5rem",
              color: "#1a3a2a",
              marginBottom: "1rem",
            }}
          >
            Active Campaigns
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {campaigns.length === 0 ? (
              <p style={{ color: "#888", padding: "1rem" }}>No campaigns yet</p>
            ) : (
              campaigns.slice(0, 5).map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: "1rem",
                    background: "white",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{c.name}</strong>
                    <div style={{ color: "#888", fontSize: "0.875rem" }}>
                      {c.type} · {c.channels.length} channels
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))
            )}
          </div>
        </section>

        {/* Editorial Calendar */}
        <section>
          <h2
            style={{
              fontSize: "1.5rem",
              color: "#1a3a2a",
              marginBottom: "1rem",
            }}
          >
            Editorial Calendar
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: "normal",
                color: "#888",
                marginLeft: "0.5rem",
              }}
            >
              {calendar.thisWeek} this week
            </span>
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <MiniStat label="Draft" value={calendar.draft} />
            <MiniStat label="Scheduled" value={calendar.scheduled} />
            <MiniStat label="Published" value={calendar.published} />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {upcomingEntries.slice(0, 5).map((e) => (
              <div
                key={e.id}
                style={{
                  padding: "0.75rem",
                  background: "white",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong style={{ fontSize: "0.875rem" }}>{e.title}</strong>
                  <div style={{ color: "#888", fontSize: "0.75rem" }}>
                    {e.type} · {new Date(e.scheduledDate).toLocaleDateString()}
                  </div>
                </div>
                <StatusBadge status={e.status} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Approvals & Brand Reviews */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          marginBottom: "2rem",
        }}
      >
        <section>
          <h2
            style={{
              fontSize: "1.5rem",
              color: "#1a3a2a",
              marginBottom: "1rem",
            }}
          >
            Pending Approvals ({approvals.length})
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {approvals.length === 0 ? (
              <p style={{ color: "#888", padding: "1rem" }}>
                No pending approvals
              </p>
            ) : (
              approvals.slice(0, 5).map((a) => (
                <div
                  key={a.id}
                  style={{
                    padding: "0.75rem",
                    background: "white",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <strong style={{ fontSize: "0.875rem" }}>
                      {a.publicationId.slice(0, 8)}...
                    </strong>
                    <span style={{ color: "#ffc107", fontSize: "0.75rem" }}>
                      Pending
                    </span>
                  </div>
                  <div style={{ color: "#888", fontSize: "0.75rem" }}>
                    Requested: {new Date(a.requestedAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2
            style={{
              fontSize: "1.5rem",
              color: "#1a3a2a",
              marginBottom: "1rem",
            }}
          >
            Constitution Compliance
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {brandReviews.length === 0 ? (
              <p style={{ color: "#888", padding: "1rem" }}>
                No brand reviews yet
              </p>
            ) : (
              brandReviews.slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  style={{
                    padding: "0.75rem",
                    background: "white",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong style={{ fontSize: "0.875rem" }}>
                      {r.publicationId.slice(0, 8)}...
                    </strong>
                    <div style={{ color: "#888", fontSize: "0.75rem" }}>
                      {r.issues.length} issues
                    </div>
                  </div>
                  <span
                    style={{
                      padding: "0.25rem 0.5rem",
                      background: r.passed ? "#d4edda" : "#f8d7da",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                    }}
                  >
                    {r.passed ? "Passed" : "Review"}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Community Intelligence */}
      <section style={{ marginBottom: "2rem" }}>
        <h2
          style={{ fontSize: "1.5rem", color: "#1a3a2a", marginBottom: "1rem" }}
        >
          Community Intelligence
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <StatCard label="Total Feedback" value={feedback.total} />
          <StatCard
            label="Avg Sentiment"
            value={Math.round(feedback.averageSentiment * 100)}
            unit="%"
          />
          <StatCard
            label="Knowledge Gaps"
            value={feedback.byClassification.knowledge_gap || 0}
          />
          <StatCard
            label="Product Requests"
            value={feedback.byClassification.product_improvement || 0}
          />
        </div>
      </section>

      {/* GitHub OS Insights */}
      <section style={{ marginBottom: "2rem" }}>
        <h2
          style={{ fontSize: "1.5rem", color: "#1a3a2a", marginBottom: "1rem" }}
        >
          GitHub OS Insights
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
          }}
        >
          <StatCard
            label="Total Impressions"
            value={github.socialImpact.totalImpressions}
          />
          <StatCard
            label="Total Engagement"
            value={github.socialImpact.totalEngagement}
          />
          <StatCard label="Repository" value={github.repository} isText />
        </div>
      </section>

      {/* Communication Loop Status */}
      <section style={{ marginBottom: "2rem" }}>
        <h2
          style={{ fontSize: "1.5rem", color: "#1a3a2a", marginBottom: "1rem" }}
        >
          Communication Loop
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
          }}
        >
          <StatCard
            label="Active Campaigns"
            value={loopStatus.activeCampaigns}
          />
          <StatCard
            label="Pending Publications"
            value={loopStatus.pendingPublications}
          />
          <StatCard
            label="Pending Approvals"
            value={loopStatus.pendingApprovals}
          />
          <StatCard
            label="Unprocessed Events"
            value={loopStatus.recentEvents}
          />
        </div>
      </section>

      {/* Recent Publications */}
      <section style={{ marginBottom: "2rem" }}>
        <h2
          style={{ fontSize: "1.5rem", color: "#1a3a2a", marginBottom: "1rem" }}
        >
          Recent Publications
        </h2>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {publications.slice(0, 5).map((p) => (
            <div
              key={p.id}
              style={{
                padding: "1rem",
                background: "white",
                borderRadius: "8px",
                border: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{p.title}</strong>
                <div style={{ color: "#888", fontSize: "0.875rem" }}>
                  {p.source.type} · {p.metadata.tags.join(", ")}
                </div>
              </div>
              <StatusBadge status={p.status} />
            </div>
          ))}
        </div>
      </section>

      {/* Recent Events */}
      <section>
        <h2
          style={{ fontSize: "1.5rem", color: "#1a3a2a", marginBottom: "1rem" }}
        >
          Recent Events
        </h2>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {events.slice(0, 10).map((e) => (
            <div
              key={e.id}
              style={{
                padding: "0.75rem",
                background: "white",
                borderRadius: "8px",
                border: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong style={{ fontSize: "0.875rem" }}>{e.type}</strong>
                <div style={{ color: "#888", fontSize: "0.75rem" }}>
                  {new Date(e.createdAt).toLocaleString()}
                </div>
              </div>
              <span
                style={{
                  padding: "0.25rem 0.5rem",
                  background: e.processed ? "#d4edda" : "#fff3cd",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
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

function PulseCard({
  label,
  value,
  suffix,
  trend,
  color,
}: {
  label: string;
  value: number;
  suffix?: string;
  trend?: string;
  color: string;
}) {
  return (
    <div
      style={{
        padding: "1.5rem",
        background: "white",
        borderRadius: "8px",
        border: `2px solid ${color}`,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "2rem", fontWeight: "bold", color }}>
        {value}
        {suffix || ""}
      </div>
      <div style={{ color: "#666", fontSize: "0.875rem" }}>{label}</div>
      {trend && (
        <div
          style={{
            fontSize: "0.75rem",
            marginTop: "0.25rem",
            color:
              trend === "up"
                ? "#28a745"
                : trend === "down"
                  ? "#dc3545"
                  : "#6c757d",
          }}
        >
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trend}
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  isText,
}: {
  label: string;
  value: number | string;
  unit?: string;
  isText?: boolean;
}) {
  return (
    <div
      style={{
        padding: "1.5rem",
        background: "white",
        borderRadius: "8px",
        border: "1px solid #ddd",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: isText ? "0.875rem" : "1.5rem",
          fontWeight: "bold",
          color: "#1a3a2a",
        }}
      >
        {isText
          ? value
          : typeof value === "number"
            ? value.toLocaleString()
            : value}
      </div>
      <div style={{ color: "#666", fontSize: "0.75rem" }}>{label}</div>
      {unit && (
        <div style={{ color: "#888", fontSize: "0.625rem" }}>{unit}</div>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        padding: "0.75rem",
        background: "white",
        borderRadius: "8px",
        border: "1px solid #ddd",
        textAlign: "center",
      }}
    >
      <div
        style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1a3a2a" }}
      >
        {value}
      </div>
      <div style={{ color: "#666", fontSize: "0.75rem" }}>{label}</div>
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
    planning: "#6c757d",
    active: "#28a745",
    paused: "#ffc107",
    completed: "#17a2b8",
    retrospective: "#6f42c1",
    scheduled: "#ffc107",
    in_progress: "#007bff",
  };
  const color = colors[status] || "#6c757d";

  return (
    <span
      style={{
        padding: "0.25rem 0.75rem",
        background: color,
        color: "white",
        borderRadius: "4px",
        fontSize: "0.75rem",
        textTransform: "capitalize",
      }}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
