import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRoles } from "@/lib/require-role";
import { initDatabase } from "@/lib/db";
import { getMissionControlRepository } from "@/lib/repositories";
import { DecisionForm } from "../../components/forms";

const CONSEQUENCE: Record<string, { approve: string; reject: string; revise: string }> = {
  pending: {
    approve: "The version advances toward verification and, after a separate explicit step, integration.",
    reject: "The version is closed; the job returns to revising and a new version is required.",
    revise: "The job returns to revising; the next version restarts review. History is preserved.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `Approval ${id} | Mission Control` };
}

export default async function ApprovalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRoles(["admin", "staff"], "/os/mission");
  const { id } = await params;
  await initDatabase();
  const repo = getMissionControlRepository();
  const pending = await repo.listPendingApprovals();
  const request = pending.find((r) => r.id === id);
  if (!request) notFound();
  const artifact = await repo.getArtifact(request.artifactId);
  if (!artifact) notFound();
  const versions = await repo.listVersions(artifact.id);
  const version = versions.find((v) => v.version === request.version);
  const job = await repo.getJob(artifact.jobId);
  const rounds = await repo.listApprovalRequests(artifact.id);
  const history: { requestId: string; version: number; status: string; decisions: { action: string; actor: string; reason: string; instruction: string }[] }[] = [];
  for (const round of rounds) {
    if (round.id === request.id) continue;
    history.push({
      requestId: round.id,
      version: round.version,
      status: round.status,
      decisions: (await repo.listDecisions("approval_request", round.id)).map((d) => ({
        action: d.action,
        actor: d.actor,
        reason: d.reason,
        instruction: d.instruction,
      })),
    });
  }
  const consequence = CONSEQUENCE.pending;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/os/mission/approvals" className="text-sm text-accent-gold hover:underline">← Approval review</Link>
      <h1 className="mt-3 text-3xl font-bold text-text-primary tracking-tight">Review: {artifact.title}</h1>

      <div className="mt-6 bg-bg-secondary border border-border-primary rounded-xl p-6 space-y-3 text-sm">
        <div><span className="font-semibold text-text-primary">What: </span><span className="text-text-secondary">{artifact.kind} · version {request.version} of {versions.length} · status {artifact.status}</span></div>
        <div><span className="font-semibold text-text-primary">Producer: </span><span className="text-text-secondary">{version?.producer ?? "unknown"}{version?.humanReplacement ? " (human replacement)" : ""}</span></div>
        <div><span className="font-semibold text-text-primary">Source: </span><span className="text-text-secondary">{artifact.source}</span></div>
        <div><span className="font-semibold text-text-primary">Job: </span><span className="text-text-secondary">{job ? <Link className="text-accent-gold hover:underline" href={`/os/mission/jobs/${job.id}`}>{job.title} ({job.status})</Link> : "missing job record"}</span></div>
        <div><span className="font-semibold text-text-primary">Requested by: </span><span className="text-text-secondary">{request.requestedBy} · {new Date(request.createdAt).toLocaleString()}</span></div>
        {version?.note && <div><span className="font-semibold text-text-primary">Version note: </span><span className="text-text-secondary">{version.note}</span></div>}
      </div>

      <div className="mt-6 bg-bg-secondary border border-border-primary rounded-xl p-6 text-sm">
        <h2 className="font-semibold text-text-primary mb-3">Consequence (from the implemented state machine)</h2>
        <ul className="space-y-1.5 text-text-secondary">
          <li><span className="font-semibold text-green-400">Approve</span> — {consequence.approve}</li>
          <li><span className="font-semibold text-red-400">Reject</span> — {consequence.reject}</li>
          <li><span className="font-semibold text-accent-gold">Request revision</span> — {consequence.revise}</li>
        </ul>
      </div>

      {history.length > 0 && (
        <div className="mt-6 bg-bg-secondary border border-border-primary rounded-xl p-6 text-sm">
          <h2 className="font-semibold text-text-primary mb-3">Previous rounds</h2>
          {history.map((h) => (
            <div key={h.requestId} className="py-2 border-t border-border-primary first:border-0 first:pt-0 text-text-secondary text-xs">
              v{h.version} → {h.status}
              {h.decisions.map((d, i) => (
                <span key={i} className="block">— {d.action} by {d.actor}{d.reason ? `: ${d.reason}` : ""}{d.instruction ? ` (instruction: ${d.instruction})` : ""}</span>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 bg-bg-secondary border border-border-primary rounded-xl p-6">
        <h2 className="font-semibold text-text-primary text-sm mb-1">Decide</h2>
        <DecisionForm requestId={request.id} />
      </div>
    </div>
  );
}
