import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRoles } from "@/lib/require-role";
import { initDatabase } from "@/lib/db";
import { getMissionControlRepository } from "@/lib/repositories";
import { JobActions, RequestApprovalButton, DecisionForm, NewVersionForm } from "../../components/forms";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `Job ${id} | Mission Control` };
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Dynamic segment: enforced inline (exact-match policy map cannot cover ids).
  await requireRoles(["admin", "staff"], "/os/mission");
  const { id } = await params;
  await initDatabase();
  const repo = getMissionControlRepository();
  const job = await repo.getJob(id);
  if (!job) notFound();
  const artifacts = await repo.listArtifacts(id);
  const versionsByArtifact = await Promise.all(artifacts.map((a) => repo.listVersions(a.id)));
  const decisions = await repo.listDecisions("job", id);
  const pending = await repo.listPendingApprovals();
  const pendingByArtifact = new Map(pending.map((r) => [r.artifactId, r]));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/os/mission" className="text-sm text-accent-gold hover:underline">← Mission Control</Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">{job.title}</h1>
          <p className="text-xs text-text-muted mt-2">
            {job.department} · {job.agent || "unassigned"} · created by {job.createdBy} · {new Date(job.createdAt).toLocaleString()}
          </p>
        </div>
        <span className="text-xs px-2 py-1 rounded bg-bg-secondary border border-border-primary text-text-primary">{job.status}</span>
      </div>
      <div className="mt-4">
        <JobActions jobId={job.id} status={job.status} />
      </div>

      <h2 className="mt-10 text-xl font-bold text-text-primary">Artifacts ({artifacts.length})</h2>
      <div className="mt-4 space-y-6">
        {artifacts.length === 0 && (
          <p className="text-xs text-text-muted">No artifacts yet. Artifacts are created from real work — nothing is fabricated here.</p>
        )}
        {artifacts.map((artifact, i) => {
          const versions = versionsByArtifact[i];
          const req = pendingByArtifact.get(artifact.id);
          return (
            <div key={artifact.id} className="bg-bg-secondary border border-border-primary rounded-xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-text-primary">{artifact.title}</div>
                  <div className="text-xs text-text-muted mt-1">
                    {artifact.kind} · source: {artifact.source} · v{artifact.currentVersion} · {artifact.status}
                  </div>
                </div>
                {!req && artifact.status !== "integrated" && artifact.status !== "archived" && (
                  <RequestApprovalButton artifactId={artifact.id} />
                )}
              </div>
              <div className="mt-4 text-xs text-text-secondary">
                <span className="font-semibold text-text-primary">Lineage: </span>
                {versions.map((v) => `v${v.version}${v.humanReplacement ? " (human)" : ""} by ${v.producer}${v.note ? ` — ${v.note}` : ""}`).join(" → ")}
              </div>
              {req && (
                <div className="mt-4 border-t border-border-primary pt-4">
                  <p className="text-xs text-text-tertiary mb-1">
                    Pending approval (v{req.version}, requested by {req.requestedBy}). Review the evidence above, then decide:
                  </p>
                  <DecisionForm requestId={req.id} />
                </div>
              )}
              <NewVersionForm artifactId={artifact.id} />
            </div>
          );
        })}
      </div>

      <h2 className="mt-10 text-xl font-bold text-text-primary">Decision history ({decisions.length})</h2>
      <div className="mt-4 space-y-2">
        {decisions.length === 0 && <p className="text-xs text-text-muted">No job-level decisions recorded.</p>}
        {decisions.map((d) => (
          <div key={d.id} className="text-xs text-text-secondary bg-bg-secondary border border-border-primary rounded-lg px-4 py-2.5">
            <span className="font-semibold text-text-primary">{d.action}</span> by {d.actor} · {new Date(d.createdAt).toLocaleString()}
            {d.reason && <span className="block mt-0.5">Reason: {d.reason}</span>}
            {d.instruction && <span className="block mt-0.5">Instruction: {d.instruction}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
