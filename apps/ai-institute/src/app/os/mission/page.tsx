import Link from "next/link";
import { requirePolicy } from "@/lib/require-role";
import { initDatabase } from "@/lib/db";
import { getMissionControlRepository } from "@/lib/repositories";
import { getGitHubData } from "@/lib/os-data";
import { NewJobForm } from "./components/forms";
import { NewEvaluationForm } from "./components/evaluation";

export const metadata = {
  title: "Mission Control | Bhavya Foundation",
  description: "Human control plane: jobs, artifacts, approvals, decisions",
};

export default async function MissionControlPage() {
  await requirePolicy("/os/mission");
  await initDatabase();
  const repo = getMissionControlRepository();
  const [jobs, pending, gh] = await Promise.all([
    repo.listJobs(),
    (async () => {
      const rows = await repo.listPendingApprovals();
      return Promise.all(rows.map(async (r) => ({ request: r, artifact: await repo.getArtifact(r.artifactId) })));
    })(),
    (async () => {
      try {
        return getGitHubData();
      } catch {
        return { repositories: [] as unknown[] };
      }
    })(),
  ]);
  const repos = (gh.repositories as { id: string; name: string; language?: string; stars?: number; license?: string; bhavya_score?: number }[]).slice(0, 50);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Mission Control</h1>
        <p className="text-sm text-text-tertiary mt-2">
          Jobs, artifacts, approvals, and recorded human decisions. Only real persisted state is shown.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Approval queue ({pending.length})</h2>
            {pending.length === 0 ? (
              <p className="text-xs text-text-muted">No pending approvals.</p>
            ) : (
              <div className="divide-y divide-border-primary">
                {pending.map(({ request, artifact }) => (
                  <Link key={request.id} href={artifact ? `/os/mission/jobs/${artifact.jobId}` : "/os/mission"} className="block py-3 hover:bg-bg-primary/50 transition-colors">
                    <div className="text-sm font-medium text-text-primary">{artifact?.title ?? request.artifactId}</div>
                    <div className="text-xs text-text-muted mt-0.5">
                      v{request.version} · requested by {request.requestedBy} · {new Date(request.createdAt).toLocaleString()}
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <Link href="/os/mission/approvals" className="inline-block mt-3 text-xs text-accent-gold hover:underline">
              Open approval review →
            </Link>
          </div>

          <div className="bg-bg-secondary border border-border-primary rounded-xl p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Jobs ({jobs.length})</h2>
            {jobs.length === 0 ? (
              <p className="text-xs text-text-muted">No jobs yet. Create one below — jobs track real work only.</p>
            ) : (
              <div className="divide-y divide-border-primary">
                {jobs.map((job) => (
                  <Link key={job.id} href={`/os/mission/jobs/${job.id}`} className="flex items-center justify-between py-3 hover:bg-bg-primary/50 transition-colors">
                    <div>
                      <div className="text-sm font-medium text-text-primary">{job.title}</div>
                      <div className="text-xs text-text-muted mt-0.5">{job.department} · {job.agent || "unassigned"} · {new Date(job.updatedAt).toLocaleString()}</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-primary text-text-tertiary">{job.status}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">New job</h2>
            <NewJobForm />
          </div>
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Evaluate repository</h2>
            <NewEvaluationForm repos={repos} />
          </div>
        </div>
      </div>
    </div>
  );
}
