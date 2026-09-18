import Link from "next/link";
import { requirePolicy } from "@/lib/require-role";
import { initDatabase } from "@/lib/db";
import { getMissionControlRepository, getEvidenceRepository } from "@/lib/repositories";
import { getGitHubData } from "@/lib/os-data";
import { NewJobForm } from "./components/forms";
import { NewEvaluationForm } from "./components/evaluation";

export const metadata = {
  title: "Mission Control | Bhavya Foundation",
  description: "Human control plane: jobs, artifacts, approvals, decisions",
};

export default async function MissionControlPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await requirePolicy("/os/mission");
  await initDatabase();
  const sp = await searchParams;
  const repo = getMissionControlRepository();
  const evidenceRepo = getEvidenceRepository();

  const q = (sp.q ?? "").trim();
  const statusFilter = (sp.status ?? "").trim();
  const validStatuses = ["queued", "running", "awaiting_approval", "revising", "completed", "stopped", "failed", "cancelled"];
  const jobs = q
    ? (await repo.searchJobs(q)).filter((j) => !statusFilter || j.status === statusFilter)
    : statusFilter && (validStatuses as string[]).includes(statusFilter)
      ? await repo.listJobs(statusFilter as Parameters<typeof repo.listJobs>[0])
      : await repo.listJobs();

  const [pending, failed, recentArtifacts, recentDecisions, recentEvidence, integrationCandidates] = await Promise.all([
    (async () => {
      const rows = await repo.listPendingApprovals();
      return Promise.all(rows.map(async (r) => ({ request: r, artifact: await repo.getArtifact(r.artifactId) })));
    })(),
    repo.listJobs("failed"),
    repo.listRecentArtifacts(5),
    repo.listDecisions(),
    evidenceRepo.listRecent(8),
    repo.listArtifactsByStatus(["approved", "verified", "integrating", "integrated"]),
  ]);
  const gh = await (async () => {
    try {
      return getGitHubData();
    } catch {
      return { repositories: [] as unknown[] };
    }
  })();
  const repos = (gh.repositories as { id: string; name: string; language?: string; stars?: number; license?: string; bhavya_score?: number }[]).slice(0, 50);

  const active = jobs.filter((j) => ["queued", "running", "awaiting_approval", "revising"].includes(j.status));
  const done = jobs.filter((j) => !["queued", "running", "awaiting_approval", "revising"].includes(j.status));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Mission Control</h1>
        <p className="text-sm text-text-tertiary mt-2">
          Jobs, artifacts, approvals, and recorded human decisions. Only real persisted state is shown.
        </p>
      </div>

      <form method="get" className="mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs text-text-tertiary mb-1" htmlFor="mc-q">Search jobs</label>
          <input id="mc-q" name="q" defaultValue={q} placeholder="Title or job id…" className="px-3 py-2 bg-bg-secondary border border-border-primary rounded-lg text-sm text-text-primary placeholder-text-secondary" />
        </div>
        <div>
          <label className="block text-xs text-text-tertiary mb-1" htmlFor="mc-status">Status</label>
          <select id="mc-status" name="status" defaultValue={statusFilter} className="px-3 py-2 bg-bg-secondary border border-border-primary rounded-lg text-sm text-text-primary">
            <option value="">All</option>
            {validStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="px-4 py-2 rounded-lg border border-border-primary text-sm text-text-primary">Filter</button>
        {(q || statusFilter) && <Link href="/os/mission" className="px-4 py-2 text-sm text-accent-gold hover:underline">Clear</Link>}
      </form>

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
            <h2 className="text-sm font-semibold text-text-primary mb-4">Active jobs ({active.length})</h2>
            {active.length === 0 ? (
              <p className="text-xs text-text-muted">{q || statusFilter ? "No jobs match the current filter." : "No active jobs. Create one below — jobs track real work only."}</p>
            ) : (
              <div className="divide-y divide-border-primary">
                {active.map((job) => (
                  <Link key={job.id} href={`/os/mission/jobs/${job.id}`} className="flex items-center justify-between py-3 hover:bg-bg-primary/50 transition-colors">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-text-primary truncate">{job.title}</div>
                      <div className="text-xs text-text-muted mt-0.5">{job.department} · {job.agent || "unassigned"} · {new Date(job.updatedAt).toLocaleString()}</div>
                    </div>
                    <span className="ml-3 flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-bg-primary text-text-tertiary">{job.status}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-bg-secondary border border-border-primary rounded-xl p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Recently completed ({done.length})</h2>
            {done.length === 0 ? (
              <p className="text-xs text-text-muted">No completed, stopped, failed, or cancelled jobs{q || statusFilter ? " match the filter" : ""}.</p>
            ) : (
              <div className="divide-y divide-border-primary">
                {done.slice(0, 10).map((job) => (
                  <Link key={job.id} href={`/os/mission/jobs/${job.id}`} className="flex items-center justify-between py-2.5 hover:bg-bg-primary/50 transition-colors">
                    <div className="min-w-0 text-sm text-text-primary truncate">{job.title}</div>
                    <span className="ml-3 flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-bg-primary text-text-tertiary">{job.status}</span>
                  </Link>
                ))}
              </div>
            )}
            {failed.length > 0 && (
              <p className="mt-3 text-xs text-red-400">{failed.length} failed job(s) — open each for evidence before retrying.</p>
            )}
          </div>

          <div className="bg-bg-secondary border border-border-primary rounded-xl p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Recent artifacts</h2>
            {recentArtifacts.length === 0 ? (
              <p className="text-xs text-text-muted">No artifacts yet.</p>
            ) : (
              <div className="divide-y divide-border-primary">
                {recentArtifacts.map(({ artifact, jobTitle }) => (
                  <Link key={artifact.id} href={`/os/mission/jobs/${artifact.jobId}`} className="block py-2.5 hover:bg-bg-primary/50 transition-colors">
                    <div className="text-sm text-text-primary truncate">{artifact.title}</div>
                    <div className="text-xs text-text-muted mt-0.5">{artifact.kind} · {artifact.status} · {jobTitle}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-bg-secondary border border-border-primary rounded-xl p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Integration candidates ({integrationCandidates.length})</h2>
            {integrationCandidates.length === 0 ? (
              <p className="text-xs text-text-muted">No approved, verified, integrating, or integrated artifacts.</p>
            ) : (
              <div className="divide-y divide-border-primary">
                {integrationCandidates.slice(0, 10).map(({ artifact, jobTitle }) => (
                  <Link key={artifact.id} href={`/os/mission/jobs/${artifact.jobId}`} className="flex items-center justify-between py-2.5 hover:bg-bg-primary/50 transition-colors">
                    <div className="min-w-0 text-sm text-text-primary truncate">{artifact.title}</div>
                    <span className="ml-3 flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-accent-gold/10 text-accent-gold">{artifact.status}</span>
                  </Link>
                ))}
              </div>
            )}
            <Link href="/os/mission/integrations" className="inline-block mt-3 text-xs text-accent-gold hover:underline">
              Open integration center →
            </Link>
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
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Recent decisions</h2>
            {recentDecisions.length === 0 ? (
              <p className="text-xs text-text-muted">No decisions recorded.</p>
            ) : (
              <div className="space-y-2">
                {recentDecisions.slice(0, 5).map((d) => (
                  <div key={d.id} className="text-xs text-text-secondary">
                    <span className="font-semibold text-text-primary">{d.action}</span> by {d.actor}
                    <span className="block text-text-muted">{new Date(d.createdAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
            <Link href="/os/mission/decisions" className="inline-block mt-3 text-xs text-accent-gold hover:underline">
              Open decision history →
            </Link>
          </div>
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Recent evidence</h2>
            {recentEvidence.length === 0 ? (
              <p className="text-xs text-text-muted">No evidence recorded.</p>
            ) : (
              <div className="space-y-2">
                {recentEvidence.slice(0, 5).map((e) => (
                  <div key={e.id} className="text-xs text-text-secondary">
                    <span className="font-mono text-text-tertiary">{e.activityType}</span>
                    <span className="block text-text-muted truncate">{e.description}</span>
                  </div>
                ))}
              </div>
            )}
            <Link href="/os/mission/evidence" className="inline-block mt-3 text-xs text-accent-gold hover:underline">
              Open evidence center →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
