import Link from "next/link";
import { requirePolicy } from "@/lib/require-role";
import { initDatabase } from "@/lib/db";
import { getMissionControlRepository } from "@/lib/repositories";

export const metadata = {
  title: "Integration Center | Mission Control",
  description: "Approved, verified, integrating, and integrated artifacts",
};

export default async function IntegrationsPage() {
  await requirePolicy("/os/mission");
  await initDatabase();
  const repo = getMissionControlRepository();
  const rows = await repo.listArtifactsByStatus(["approved", "verified", "integrating", "integrated"]);
  const groups: Record<string, typeof rows> = { approved: [], verified: [], integrating: [], integrated: [] };
  for (const row of rows) groups[row.artifact.status]?.push(row);
  const integrations = await repo.listDecisions();
  const integrationDecisions = integrations.filter((d) => d.action === "approve_integration").slice(0, 20);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/os/mission" className="text-sm text-accent-gold hover:underline">← Mission Control</Link>
      <h1 className="mt-3 text-3xl font-bold text-text-primary tracking-tight">Integration center</h1>
      <p className="text-sm text-text-tertiary mt-2">
        Approved is not integrated. Each stage below requires its own explicit, persisted transition.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {(Object.keys(groups) as (keyof typeof groups)[]).map((status) => (
          <div key={status} className="bg-bg-secondary border border-border-primary rounded-xl p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-1 capitalize">{status}</h2>
            <p className="text-xs text-text-muted mb-4">{groups[status].length} artifact(s)</p>
            {groups[status].length === 0 ? (
              <p className="text-xs text-text-muted">None in this stage.</p>
            ) : (
              <div className="space-y-2">
                {groups[status].slice(0, 10).map(({ artifact, jobTitle }) => (
                  <Link key={artifact.id} href={`/os/mission/jobs/${artifact.jobId}`} className="block text-xs hover:bg-bg-primary/50 rounded p-1.5 -m-1.5 transition-colors">
                    <div className="text-text-primary font-medium truncate">{artifact.title}</div>
                    <div className="text-text-muted">v{artifact.currentVersion} · {jobTitle}{artifact.destination ? ` · → ${artifact.destination} (intent)` : ""}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-bold text-text-primary">Integration decisions ({integrationDecisions.length} recent)</h2>
      <div className="mt-4 space-y-2">
        {integrationDecisions.length === 0 && <p className="text-xs text-text-muted">No integration approvals recorded yet.</p>}
        {integrationDecisions.map((d) => (
          <div key={d.id} className="text-xs text-text-secondary bg-bg-secondary border border-border-primary rounded-lg px-4 py-2.5">
            <span className="font-semibold text-text-primary">approve_integration</span> by {d.actor} · {new Date(d.createdAt).toLocaleString()}
            {d.reason && <span className="block mt-0.5">Note: {d.reason}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
