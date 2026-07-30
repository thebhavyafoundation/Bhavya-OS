export const dynamic = "force-dynamic";

export default function VolunteersPage() {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 24 }}>🤝</span>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#fafafa",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Volunteers
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "#71717a", margin: 0 }}>
          Volunteer coordination and management
        </p>
      </div>

      <div
        style={{
          padding: 60,
          textAlign: "center",
          background: "#18181b",
          border: "1px solid #27272a",
          borderRadius: 12,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🤝</div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#fafafa",
            marginBottom: 8,
          }}
        >
          Volunteer data lives in the Volunteer App
        </div>
        <p
          style={{
            fontSize: 14,
            color: "#71717a",
            marginBottom: 24,
            maxWidth: 400,
            margin: "0 auto 24px",
          }}
        >
          Volunteer records, coordination, and engagement are managed in the
          dedicated Volunteer application.
        </p>
        <a
          href="/volunteer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            background: "#22c55e",
            color: "#000",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#16a34a")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#22c55e")}
        >
          Open Volunteer App →
        </a>
      </div>
    </div>
  );
}
