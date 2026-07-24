"use client";

const services = [
  { name: "Website", status: "healthy", port: 3000 },
  { name: "Docs", status: "healthy", port: 3002 },
  { name: "Design System", status: "healthy", port: 3001 },
  { name: "Admin", status: "healthy", port: 3003 },
  { name: "Mission Runtime", status: "healthy", port: 4000 },
  { name: "Nginx", status: "healthy", port: 80 },
];

const statusColors: Record<string, string> = {
  healthy: "var(--admin-success)",
  degraded: "var(--admin-warning)",
  down: "var(--admin-danger)",
};

export function SystemHealth() {
  return (
    <div
      className="rounded-lg border p-4"
      style={{ backgroundColor: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
    >
      <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--admin-text)" }}>
        System Health
      </h3>
      <div className="space-y-2">
        {services.map((service) => (
          <div key={service.name} className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: statusColors[service.status] }}
              />
              <span className="text-sm" style={{ color: "var(--admin-text)" }}>
                {service.name}
              </span>
            </div>
            <span className="text-xs" style={{ color: "var(--admin-text-muted)" }}>
              :{service.port}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
