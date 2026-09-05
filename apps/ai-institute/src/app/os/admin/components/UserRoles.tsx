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
      <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
        <div className="px-4 py-3.5 border-b border-border-primary">
          <span className="text-sm font-semibold text-text-primary">Role Model</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-tertiary">
                <th className="text-left px-4 py-2 font-medium text-text-secondary">Role</th>
                <th className="text-left px-4 py-2 font-medium text-text-secondary">Users</th>
                {allPermissions.map((p) => (
                  <th key={p} className="text-center px-2 py-2 font-medium text-xs text-text-secondary">
                    {p.split(".")[1]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary">
              {roles.map((role) => (
                <tr key={role.name} className="hover:bg-bg-tertiary transition-colors">
                  <td className="px-4 py-2 font-medium text-text-primary">{role.name}</td>
                  <td className="px-4 py-2 text-text-muted">{role.count}</td>
                  {allPermissions.map((p) => (
                    <td key={p} className="text-center px-2 py-2">
                      {role.permissions.includes(p) ? (
                        <span className="text-green-400">✓</span>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass rounded-xl p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-2">Authentication</h3>
        <p className="text-sm text-text-secondary">
          Placeholder — authentication integration will be implemented when a real identity provider is configured.
          Currently using role-based access control with static roles.
        </p>
      </div>
    </div>
  );
}
