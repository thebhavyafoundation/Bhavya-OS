import Link from "next/link";
import { requirePolicy } from "@/lib/require-role";
import { initDatabase } from "@/lib/db";
import { getMissionControlRepository } from "@/lib/repositories";
import { DecisionForm } from "../components/forms";
import type {
  McApprovalRequest,
  McArtifact,
  McArtifactVersion,
  McDecision,
  McJob,
} from "@/lib/repositories";

interface PendingRow {
  request: McApprovalRequest;
  artifact?: McArtifact;
  versions: McArtifactVersion[];
  priorRounds: { request: McApprovalRequest; decisions: McDecision[] }[];
  job?: McJob;
}

export const metadata = {
  title: "Approval Review | Mission Control",
  description: "Pending human approvals with evidence",
};

export default async function ApprovalsPage() {
  await requirePolicy("/os/mission/approvals");
  await initDatabase();
  const repo = getMissionControlRepository();
  const pendingRows = await repo.listPendingApprovals();
  const pending: PendingRow[] = [];
  for (const r of pendingRows) {
    const artifact = await repo.getArtifact(r.artifactId);
    const rounds = await repo.listApprovalRequests(r.artifactId);
    const priorRounds: PendingRow["priorRounds"] = [];
    for (const round of rounds) {
      if (round.id === r.id) continue;
      priorRounds.push({ request: round, decisions: await repo.listDecisions("approval_request", round.id) });
    }
    pending.push({
      request: r,
      artifact,
      versions: await repo.listVersions(r.artifactId),
      priorRounds,
      job: artifact ? ((await repo.getJob(artifact.jobId)) ?? undefined) : undefined,
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/os/mission" className="text-sm text-accent-gold hover:underline">← Mission Control</Link>
      <h1 className="mt-3 text-3xl font-bold text-text-primary tracking-tight">Approval review</h1>
      <p className="text-sm text-text-tertiary mt-2">Each decision is persisted with actor, reason, and instruction.</p>

      <div className="mt-8 space-y-6">
        {pending.length === 0 && (
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-12 text-center">
            <p className="text-sm text-text-muted">No pending approvals. Nothing awaiting human review.</p>
          </div>
        )}
        {pending.map(({ request, artifact, versions, priorRounds, job }) => (
          <div key={request.id} className="bg-bg-secondary border border-border-primary rounded-xl p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold text-text-primary">{artifact?.title ?? request.artifactId}</div>
                <div className="text-xs text-text-muted mt-1">
                  v{request.version} of {versions.length} version(s) · {artifact?.kind} · source: {artifact?.source} · job: {job?.title ?? "—"}
                </div>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-gold/10 text-accent-gold">pending</span>
            </div>
            <div className="mt-4 text-xs text-text-secondary">
              <span className="font-semibold text-text-primary">Lineage: </span>
              {versions.map((v) => `v${v.version}${v.humanReplacement ? " (human)" : ""} by ${v.producer}`).join(" → ")}
            </div>
            {priorRounds.length > 0 && (
              <div className="mt-4 text-xs text-text-secondary">
                <span className="font-semibold text-text-primary">Previous rounds: </span>
                {priorRounds.map((round) => (
                  <span key={round.request.id} className="block mt-1">
                    v{round.request.version} → {round.request.status}
                    {round.decisions.map((d) => ` — ${d.action} by ${d.actor}${d.reason ? `: ${d.reason}` : ""}`).join("; ")}
                  </span>
                ))}
              </div>
            )}
            {artifact?.jobId && (
              <Link href={`/os/mission/jobs/${artifact.jobId}`} className="inline-block mt-2 text-xs text-accent-gold hover:underline">
                Open job timeline →
              </Link>
            )}
            <div className="mt-4 border-t border-border-primary pt-4">
              <DecisionForm requestId={request.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
