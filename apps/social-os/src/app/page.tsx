import Link from "next/link";

export default function HomePage() {
  return (
    <div
      style={{
        padding: "4rem",
        fontFamily: "system-ui, sans-serif",
        maxWidth: "900px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h1
        style={{ fontSize: "3rem", color: "#1a3a2a", marginBottom: "0.5rem" }}
      >
        Social OS v2
      </h1>
      <p
        style={{ fontSize: "1.125rem", color: "#666", marginBottom: "0.5rem" }}
      >
        Bhavya Foundation — Institutional Communication Operating System
      </p>
      <p style={{ color: "#888", marginBottom: "3rem" }}>
        Campaign Engine · Editorial Calendar · Community Intelligence ·
        Constitutional Compliance · Analytics
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1rem",
          marginBottom: "3rem",
        }}
      >
        <Link
          href="/ceo"
          style={{
            padding: "2rem",
            background: "linear-gradient(135deg, #1a3a2a 0%, #2d5a3d 100%)",
            color: "white",
            borderRadius: "12px",
            textDecoration: "none",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            CEO Dashboard
          </div>
          <div style={{ opacity: 0.9, fontSize: "0.875rem" }}>
            Institution pulse, mission metrics, campaign performance, community
            intelligence
          </div>
        </Link>
        <Link
          href="/dashboard"
          style={{
            padding: "2rem",
            background: "white",
            color: "#1a3a2a",
            borderRadius: "12px",
            textDecoration: "none",
            border: "2px solid #1a3a2a",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            Publishing Dashboard
          </div>
          <div style={{ color: "#666", fontSize: "0.875rem" }}>
            Publications, approvals, queue management, platform health
          </div>
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          marginBottom: "3rem",
        }}
      >
        <ApiCard
          title="Campaigns"
          description="Launch and manage communication campaigns"
          endpoint="/api/campaigns"
        />
        <ApiCard
          title="Calendar"
          description="Editorial calendar for all channels"
          endpoint="/api/calendar"
        />
        <ApiCard
          title="Feedback"
          description="Community intelligence collection"
          endpoint="/api/feedback"
        />
        <ApiCard
          title="Loop"
          description="Autonomous communication loop"
          endpoint="/api/loop"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          marginBottom: "3rem",
        }}
      >
        <ApiCard
          title="Publications"
          description="Content publishing queue"
          endpoint="/api/publications"
        />
        <ApiCard
          title="Integrations"
          description="Content Factory, GitHub OS, Constitution"
          endpoint="/api/integrations"
        />
        <ApiCard
          title="Pulse"
          description="Institutional metrics and analytics"
          endpoint="/api/pulse"
        />
        <ApiCard
          title="Health"
          description="System health check"
          endpoint="/api/health"
        />
      </div>

      <div
        style={{
          padding: "2rem",
          background: "#f8f9fa",
          borderRadius: "12px",
          textAlign: "left",
        }}
      >
        <h2
          style={{ fontSize: "1.5rem", color: "#1a3a2a", marginBottom: "1rem" }}
        >
          Architecture
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
          }}
        >
          <div>
            <h3 style={{ color: "#1a3a2a", marginBottom: "0.5rem" }}>
              Communication Loop
            </h3>
            <p style={{ color: "#666", fontSize: "0.875rem" }}>
              GitHub OS → Research → Knowledge Package → Content Factory →
              Campaign → Calendar → Constitution → Approval → Publishing →
              Analytics → Community → GitHub OS
            </p>
          </div>
          <div>
            <h3 style={{ color: "#1a3a2a", marginBottom: "0.5rem" }}>
              Campaign Engine
            </h3>
            <p style={{ color: "#666", fontSize: "0.875rem" }}>
              Every publication belongs to a campaign. Campaigns own objectives,
              audience, assets, schedule, approvals, metrics, and retrospective.
            </p>
          </div>
          <div>
            <h3 style={{ color: "#1a3a2a", marginBottom: "0.5rem" }}>
              Constitutional Compliance
            </h3>
            <p style={{ color: "#666", fontSize: "0.875rem" }}>
              Every publication validated against 10 constitutional checks.
              Brand review, mission alignment, ethical compliance, source
              traceability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApiCard({
  title,
  description,
  endpoint,
}: {
  title: string;
  description: string;
  endpoint: string;
}) {
  return (
    <Link
      href={endpoint}
      style={{
        padding: "1.5rem",
        background: "white",
        borderRadius: "8px",
        border: "1px solid #ddd",
        textDecoration: "none",
        textAlign: "left",
      }}
    >
      <div
        style={{ fontWeight: "bold", color: "#1a3a2a", marginBottom: "0.5rem" }}
      >
        {title}
      </div>
      <div
        style={{ color: "#666", fontSize: "0.875rem", marginBottom: "0.5rem" }}
      >
        {description}
      </div>
      <code style={{ color: "#888", fontSize: "0.75rem" }}>GET {endpoint}</code>
    </Link>
  );
}
