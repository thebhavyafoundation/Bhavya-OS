"use client";

const releases = [
  { tag: "v1.0.0-rc2", date: "2026-07-24", status: "rc", notes: "Platform RC with governance policy, release train, ADR-0003" },
  { tag: "v1.0.0-rc1", date: "2026-07-24", status: "rc", notes: "Platform release candidate: 3 apps, shared runtime, production infrastructure" },
  { tag: "v0.9.0-rc1", date: "2026-07-23", status: "rc", notes: "APP-001 frozen, website redesigned with UI/UX Pro Max" },
];

const statusStyles: Record<string, { bg: string; text: string }> = {
  ga: { bg: "bg-green-900/30", text: "text-green-400" },
  rc: { bg: "bg-blue-900/30", text: "text-blue-400" },
  beta: { bg: "bg-amber-900/30", text: "text-amber-400" },
};

export function ReleaseList() {
  return (
    <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-tertiary">
              <th className="text-left px-4 py-2 font-medium text-text-secondary">Tag</th>
              <th className="text-left px-4 py-2 font-medium text-text-secondary">Date</th>
              <th className="text-left px-4 py-2 font-medium text-text-secondary">Status</th>
              <th className="text-left px-4 py-2 font-medium text-text-secondary">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary">
            {releases.map((release) => (
              <tr key={release.tag} className="hover:bg-bg-tertiary transition-colors">
                <td className="px-4 py-2 font-mono font-medium text-text-primary">{release.tag}</td>
                <td className="px-4 py-2 text-text-muted">{release.date}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusStyles[release.status]?.bg} ${statusStyles[release.status]?.text}`}>
                    {release.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-text-secondary">{release.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
