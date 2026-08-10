import type { Metadata } from "next";
import { Users, MessageSquare, Calendar, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Community — My Bhavya",
  description: "Connect with the Bhavya Foundation community.",
};

const groups = [
  {
    id: "forest-restoration",
    name: "Forest Restoration Team",
    members: 47,
    activity: "12 posts this week",
    description: "Working together to restore 1000 hectares of degraded forest.",
  },
  {
    id: "ai-learners",
    name: "AI Learners Circle",
    members: 89,
    activity: "8 posts this week",
    description: "Students and mentors discussing AI concepts and projects.",
  },
  {
    id: "heritage-preservers",
    name: "Heritage Preservers",
    members: 34,
    activity: "5 posts this week",
    description: "Documenting and preserving Indian cultural heritage.",
  },
];

const events = [
  {
    id: "1",
    title: "Forest Planting Drive",
    date: "2026-08-15",
    location: "Bhavya Forest, Maharashtra",
    type: "volunteer",
  },
  {
    id: "2",
    title: "AI Workshop: Build Your First Model",
    date: "2026-08-20",
    location: "Online",
    type: "learning",
  },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1
            style={{
              fontSize: "var(--text-3xl)",
              fontWeight: 800,
              color: "var(--text)",
              letterSpacing: "-0.03em",
            }}
          >
            Community
          </h1>
          <p
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--text-secondary)",
              marginTop: "var(--space-3)",
            }}
          >
            Your people, your discussions, your events.
          </p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)" }}>
          <div>
            <h2
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "var(--space-5)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
              }}
            >
              <Users size={20} />
              My Groups
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {groups.map((group) => (
                <div
                  key={group.id}
                  style={{
                    padding: "var(--space-5)",
                    background: "var(--bg-raised)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    cursor: "pointer",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "var(--text-base)",
                      fontWeight: 700,
                      color: "var(--text)",
                      marginBottom: "var(--space-2)",
                    }}
                  >
                    {group.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--text-secondary)",
                      marginBottom: "var(--space-3)",
                      lineHeight: 1.5,
                    }}
                  >
                    {group.description}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "var(--text-xs)",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    <span>{group.members} members</span>
                    <span>{group.activity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "var(--space-5)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
              }}
            >
              <Calendar size={20} />
              Upcoming Events
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {events.map((event) => (
                <div
                  key={event.id}
                  style={{
                    padding: "var(--space-5)",
                    background: "var(--bg-raised)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      padding: "var(--space-1) var(--space-2)",
                      background: event.type === "volunteer" ? "var(--forest)" : "var(--gold)",
                      color: "var(--bg)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "var(--text-xs)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      marginBottom: "var(--space-3)",
                    }}
                  >
                    {event.type}
                  </div>
                  <h3
                    style={{
                      fontSize: "var(--text-base)",
                      fontWeight: 700,
                      color: "var(--text)",
                      marginBottom: "var(--space-2)",
                    }}
                  >
                    {event.title}
                  </h3>
                  <div
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <div>{new Date(event.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
                    <div>{event.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
