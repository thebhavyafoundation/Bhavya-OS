"use client";

const releases = [
  { tag: "v1.0.0-rc2", date: "2026-07-24", status: "rc", notes: "Platform RC with governance policy, release train, ADR-0003" },
  { tag: "v1.0.0-rc1", date: "2026-07-24", status: "rc", notes: "Platform release candidate: 3 apps, shared runtime, production infrastructure" },
  { tag: "v0.9.0-rc1", date: "2026-07-23", status: "rc", notes: "APP-001 frozen, website redesigned with UI/UX Pro Max" },
];

const statusStyles: Record<string, { bg: string; text: string }> = {
  ga: { bg: "#dcfce7", text: "#166534" },
  rc: { bg: "#dbeafe", text: "#1e40af" },
  beta: { bg: "#fef9c3", text: "#854d0e" },
};

export function ReleaseList() {
  return (
    <div className="space-y-4">
      <div
        className="rounded-lg border overflow-hidden"
        style={{ borderColor: "var(--admin-border)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "var(--admin-surface-hover)" }}>
              <th className="text-left px-4 py-2 font-medium" style={{ color: "var(--admin-text-secondary)" }}>Tag</th>
              <th className="text-left px-4 py-2 font-medium" style={{ color: "var(--admin-text-secondary)" }}>Date</th>
              <th className="text-left px-4 py-2 font-medium" style={{ color: "var(--admin-text-secondary)" }}>Status</th>
              <th className="text-left px-4 py-2 font-medium" style={{ color: "var(--admin-text-secondary)" }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {releases.map((release) => (
              <tr
                key={release.tag}
                className="border-t"
                style={{ borderColor: "var(--admin-border)" }}
              >
                <td className="px-4 py-2 font-mono font-medium" style={{ color: "var(--admin-text)" }}>{release.tag}</td>
                <td className="px-4 py-2" style={{ color: "var(--admin-text-muted)" }}>{release.date}</td>
                <td className="px-4 py-2">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      backgroundColor: statusStyles[release.status]?.bg,
                      color: statusStyles[release.status]?.text,
                    }}
                  >
                    {release.status}
                  </span>
                </td>
                <td className="px-4 py-2" style={{ color: "var(--admin-text-secondary)" }}>{release.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
