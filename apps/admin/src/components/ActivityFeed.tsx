"use client";

const events = [
  {
    time: "2 min ago",
    action: "Tagged v1.0.0-rc2",
    user: "Governance Agent",
    type: "release",
  },
  {
    time: "15 min ago",
    action: "Added ADR-009: Release Train",
    user: "Governance Agent",
    type: "governance",
  },
  {
    time: "1 hour ago",
    action: "Fixed CSP headers",
    user: "Platform Agent",
    type: "security",
  },
  {
    time: "2 hours ago",
    action: "Added docs accessibility fixes",
    user: "Platform Agent",
    type: "accessibility",
  },
  {
    time: "3 hours ago",
    action: "Updated pnpm-lock.yaml",
    user: "Platform Agent",
    type: "infrastructure",
  },
  {
    time: "5 hours ago",
    action: "Created APP-002 Docs Platform",
    user: "Platform Agent",
    type: "application",
  },
];

const typeColors: Record<string, string> = {
  release: "var(--admin-success)",
  governance: "var(--admin-primary)",
  security: "var(--admin-danger)",
  accessibility: "var(--admin-warning)",
  infrastructure: "var(--admin-text-muted)",
  application: "var(--admin-info)",
};

export function ActivityFeed() {
  return (
    <div
      className="rounded-lg border p-4"
      style={{
        backgroundColor: "var(--admin-surface)",
        borderColor: "var(--admin-border)",
      }}
    >
      <h3
        className="text-sm font-semibold mb-3"
        style={{ color: "var(--admin-text)" }}
      >
        Recent Activity
      </h3>
      <div className="space-y-3">
        {events.map((event, i) => (
          <div key={i} className="flex items-start gap-3">
            <div
              className="w-2 h-2 rounded-full mt-1.5 shrink-0"
              style={{
                backgroundColor:
                  typeColors[event.type] || "var(--admin-text-muted)",
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm" style={{ color: "var(--admin-text)" }}>
                {event.action}
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--admin-text-muted)" }}
              >
                {event.user} · {event.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
