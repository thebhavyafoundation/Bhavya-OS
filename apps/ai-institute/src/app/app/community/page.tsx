import type { Metadata } from "next";
import { Users, MessageSquare, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Community — My Bhavya",
  description: "Connect with the Bhavya Foundation community.",
};

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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-8)",
          }}
        >
          {/* Groups */}
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

            <div
              style={{
                padding: "var(--space-8)",
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  margin: "0 auto var(--space-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--border)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <MessageSquare
                  size={24}
                  style={{ color: "var(--text-secondary)" }}
                />
              </div>
              <h3
                style={{
                  fontSize: "var(--text-base)",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "var(--space-2)",
                }}
              >
                No groups yet
              </h3>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--text-secondary)",
                }}
              >
                Join a group to connect with others who share your interests.
              </p>
            </div>
          </div>

          {/* Events */}
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

            <div
              style={{
                padding: "var(--space-8)",
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  margin: "0 auto var(--space-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--border)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <Calendar
                  size={24}
                  style={{ color: "var(--text-secondary)" }}
                />
              </div>
              <h3
                style={{
                  fontSize: "var(--text-base)",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "var(--space-2)",
                }}
              >
                No upcoming events
              </h3>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--text-secondary)",
                }}
              >
                Community events will appear here when scheduled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
