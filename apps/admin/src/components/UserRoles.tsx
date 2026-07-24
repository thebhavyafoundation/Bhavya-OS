"use client";

const roles = [
  {
    name: "Founder",
    permissions: ["content.write", "release.manage", "audit.view", "users.manage", "settings.admin"],
    count: 1,
  },
  {
    name: "Governance Agent",
    permissions: ["content.write", "release.manage", "audit.view"],
    count: 1,
  },
  {
    name: "Contributor",
    permissions: ["content.write", "audit.view"],
    count: 3,
  },
  {
    name: "Viewer",
    permissions: ["audit.view"],
    count: 0,
  },
];

const allPermissions = [
  "content.write",
  "release.manage",
  "audit.view",
  "users.manage",
  "settings.admin",
];

export function UserRoles() {
  return (
    <div className="space-y-6">
      <div
        className="rounded-lg border overflow-hidden"
        style={{ borderColor: "var(--admin-border)" }}
      >
        <div className="px-4 py-3 border-b" style={{ borderColor: "var(--admin-border)", backgroundColor: "var(--admin-surface-hover)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--admin-text)" }}>
            Role Model
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "var(--admin-surface-hover)" }}>
              <th className="text-left px-4 py-2 font-medium" style={{ color: "var(--admin-text-secondary)" }}>Role</th>
              <th className="text-left px-4 py-2 font-medium" style={{ color: "var(--admin-text-secondary)" }}>Users</th>
              {allPermissions.map((p) => (
                <th key={p} className="text-center px-2 py-2 font-medium text-xs" style={{ color: "var(--admin-text-secondary)" }}>
                  {p.split(".")[1]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr
                key={role.name}
                className="border-t"
                style={{ borderColor: "var(--admin-border)" }}
              >
                <td className="px-4 py-2 font-medium" style={{ color: "var(--admin-text)" }}>{role.name}</td>
                <td className="px-4 py-2" style={{ color: "var(--admin-text-muted)" }}>{role.count}</td>
                {allPermissions.map((p) => (
                  <td key={p} className="text-center px-2 py-2">
                    {role.permissions.includes(p) ? (
                      <span style={{ color: "var(--admin-success)" }}>✓</span>
                    ) : (
                      <span style={{ color: "var(--admin-text-muted)" }}>—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="rounded-lg border p-4"
        style={{ borderColor: "var(--admin-border)", backgroundColor: "var(--admin-surface)" }}
      >
        <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--admin-text)" }}>
          Authentication
        </h3>
        <p className="text-sm" style={{ color: "var(--admin-text-secondary)" }}>
          Placeholder — authentication integration will be implemented when a real identity provider is configured.
          Currently using role-based access control with static roles.
        </p>
      </div>
    </div>
  );
}
