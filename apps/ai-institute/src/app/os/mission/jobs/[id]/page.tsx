import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { requireRoles } from "@/lib/require-role";
import { initDatabase } from "@/lib/db";
import { getMissionControlRepository } from "@/lib/repositories";
import { JobActions, RequestApprovalButton, DecisionForm, NewVersionForm, IntegrationActions, CurationActions } from "../../components/forms";
import { LessonIntakeForm } from "../../components/intake";
import { MissionGraph } from "../../components/graph";
import { diffVersions } from "@/lib/mission-compare";
import { getGitHubData } from "@/lib/os-data";
import { courses as academyCourses } from "@/data/academy-courses";

function canonicalLessonLink(path: string): { href: string; label: string } | null {
  const studio = /^studio:lesson:(.+)$/.exec(path);
  if (studio) return { href: `/studio/lessons/${studio[1]}`, label: "Open in Studio (canonical editor)" };
  const academy = /^academy:(.+)$/.exec(path);
  if (academy) {
    for (const course of academyCourses) {
      if (course.modules.some((m) => m.lessons.some((l) => l.id === academy[1]))) {
        return { href: `/courses/${course.id}/lessons/${academy[1]}`, label: `Open in Academy (${course.title})` };
      }
    }
    return { href: "/courses", label: "Open Academy courses" };
  }
  return null;
}

function evaluationFacts(path: string) {
  const m = /^github-os:repository:(.+)$/.exec(path);
  if (!m) return null;
  let row: Record<string, unknown> | undefined;
  try {
    const data = getGitHubData();
    const rows = data.repositories as unknown as Record<string, unknown>[];
    row = rows.find((r) => String(r.id) === m[1]);
  } catch {
    return null;
  }
  if (!row) return null;
  const str = (v: unknown) => (typeof v === "string" && v ? v : null);
  const num = (v: unknown) => (typeof v === "number" ? String(v) : null);
  const facts = [
    row.name ? `Repository: ${String(row.name)}` : null,
    str(row.language) ? `Language: ${row.language}` : null,
    num(row.stars) ? `Stars: ${row.stars}` : null,
    num(row.forks) ? `Forks: ${row.forks}` : null,
    str(row.license) ? `License: ${row.license}` : null,
    num(row.health_score) ? `Health: ${row.health_score}` : null,
    num(row.technology_score) ? `Technology: ${row.technology_score}` : null,
    str(row.engineering_maturity) ? `Maturity: ${row.engineering_maturity}` : null,
  ].filter((x): x is string => Boolean(x));
  const recommendations = [
    num(row.bhavya_score) ? `Bhavya score: ${row.bhavya_score}` : null,
    str(row.recommendation_type) ? `Recommended action: ${row.recommendation_type}` : null,
    str(row.why_bhavya_cares) ? `Rationale: ${row.why_bhavya_cares}` : null,
  ].filter((x): x is string => Boolean(x));
  return { facts, recommendations };
}

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
  const sessions = await repo.listSessions(id);
  const evidence = await repo.listEvidence(id);
  const graph = await repo.getMissionGraph(id);
  const { getTaskContract } = await import("@/lib/task-contracts");
  const linkedTasks = job.taskContractIds
    .map((tc) => getTaskContract(tc))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/os/mission" className="text-sm text-accent-gold hover:underline">← Mission Control</Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">{job.title}</h1>
          <p className="text-xs text-text-muted mt-2">
            {job.department} · {job.agent || "unassigned"} · created by {job.createdBy} · {new Date(job.createdAt).toLocaleString()}
          </p>
          <p className="text-xs text-text-muted mt-1">
            {job.queueJobId ? `Queue: ${job.queueJobId}` : "No execution binding"}
          </p>
          {linkedTasks.length > 0 && (
            <div className="mt-3 rounded-lg bg-bg-secondary border border-border-primary px-4 py-3">
              <div className="text-xs font-semibold text-text-primary mb-2">Linked task contracts (planning source: .ai/tasks)</div>
              {linkedTasks.map((t) => (
                <div key={t.id} className="text-xs text-text-secondary py-1">
                  <span className="font-mono text-text-tertiary">{t.id}</span> · {t.title} · {t.status}
                  {t.goal && <span className="block text-text-muted">Goal: {t.goal}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
        <span className="text-xs px-2 py-1 rounded bg-bg-secondary border border-border-primary text-text-primary">{job.status}</span>
      </div>
      <div className="mt-4">
        <JobActions jobId={job.id} status={job.status} />
      </div>

      <h2 className="mt-10 text-xl font-bold text-text-primary">Artifacts ({artifacts.length})</h2>
      <div className="mt-2 mb-4 rounded-xl border border-border-primary bg-bg-secondary p-4">
        <div className="text-xs font-semibold text-text-primary mb-1">Intake canonical lesson</div>
        <p className="text-xs text-text-muted mb-2">References an Academy or Studio lesson — the lesson store is never copied. Editing happens in Studio; Mission Control tracks review.</p>
        <LessonIntakeForm jobId={job.id} />
      </div>
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
                      {artifact.destination && ` · destination: ${artifact.destination} (intent only — not published)`}
                    </div>
                </div>
                {!req && artifact.status !== "integrated" && artifact.status !== "archived" && artifact.status !== "superseded" && (
                  <RequestApprovalButton artifactId={artifact.id} />
                )}
              </div>
              <div className="mt-4 text-xs text-text-secondary break-words">
                <span className="font-semibold text-text-primary">Lineage: </span>
                {versions.map((v) => `v${v.version}${v.humanReplacement ? " (human)" : ""} by ${v.producer}${v.note ? ` — ${v.note}` : ""}`).join(" → ")}
              </div>
              {versions.length > 1 && (
                <div className="mt-2 text-xs text-text-secondary break-words">
                  <span className="font-semibold text-text-primary">Metadata changes (latest): </span>
                  {(() => {
                    const [prev, curr] = versions.slice(-2);
                    const changes = diffVersions(
                      { version: prev.version, producer: prev.producer, humanReplacement: prev.humanReplacement, note: prev.note, path: prev.path, hash: prev.hash, status: prev.status },
                      { version: curr.version, producer: curr.producer, humanReplacement: curr.humanReplacement, note: curr.note, path: curr.path, hash: curr.hash, status: curr.status },
                    );
                    return changes.length === 0 ? "no metadata changes" : changes.map((c) => `${c.field}: ${c.before} → ${c.after}`).join("; ");
                  })()}
                </div>
              )}
              <IntegrationActions artifactId={artifact.id} status={artifact.status} />
              <CurationActions artifactId={artifact.id} status={artifact.status} />
              {(() => {
                const ref = versions.map((v) => v.path).find((p) => p.startsWith("github-os:repository:"));
                if (!ref) return null;
                const panel = evaluationFacts(ref);
                if (!panel) return null;
                return (
                  <div className="mt-4 rounded-lg bg-bg-primary/50 border border-border-primary p-4 text-xs">
                    <div className="font-semibold text-text-primary mb-2">GitHub OS facts (live reference — not copied)</div>
                    <div className="text-text-secondary">
                      <span className="font-semibold text-text-primary">FACT: </span>
                      {panel.facts.length > 0 ? panel.facts.join(" · ") : "No fact fields available."}
                    </div>
                    <div className="text-text-secondary mt-1">
                      <span className="font-semibold text-text-primary">RECOMMENDATION (heuristic, not Bhavya fact): </span>
                      {panel.recommendations.length > 0 ? panel.recommendations.join(" · ") : "No recommendation recorded."}
                    </div>
                  </div>
                );
              })()}
              {(() => {
                const lessonRef = versions.map((v) => v.path).find((p) => p.startsWith("academy:") || p.startsWith("studio:lesson:"));
                if (!lessonRef) return null;
                const link = canonicalLessonLink(lessonRef);
                if (!link) return null;
                return (
                  <div className="mt-2 text-xs">
                    <Link href={link.href} className="text-accent-gold hover:underline">{link.label} →</Link>
                  </div>
                );
              })()}
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

      <h2 className="mt-10 text-xl font-bold text-text-primary">Sessions ({sessions.length})</h2>
      <div className="mt-4 space-y-2">
        {sessions.length === 0 && <p className="text-xs text-text-muted">No execution sessions bound. Sessions appear here only when a real execution starts one.</p>}
        {sessions.map((s) => (
          <div key={s.id} className="text-xs text-text-secondary bg-bg-secondary border border-border-primary rounded-lg px-4 py-2.5">
            <span className="font-semibold text-text-primary">{s.producer}</span> · {s.status} · started {new Date(s.startedAt).toLocaleString()}
            {s.endedAt && <span> · ended {new Date(s.endedAt).toLocaleString()}</span>}
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-bold text-text-primary">Evidence trail ({evidence.length})</h2>
      <div className="mt-4 space-y-2">
        {evidence.length === 0 && <p className="text-xs text-text-muted">No lifecycle events recorded yet.</p>}
        {evidence.map((e) => (
          <div key={e.id} className="text-xs text-text-secondary bg-bg-secondary border border-border-primary rounded-lg px-4 py-2.5">
            <span className="font-mono text-text-tertiary">{e.activityType}</span>
            <span className="block mt-0.5">{e.description} · {new Date(e.timestamp).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-bold text-text-primary">Graph ({graph.nodes.length} nodes, {graph.edges.length} edges)</h2>
      <p className="text-xs text-text-muted mt-1">Deterministic projection of persisted records — FACT edges only, no inference.</p>
      <div className="mt-4">
        <Suspense fallback={<p className="text-xs text-text-muted">Loading graph…</p>}>
          <MissionGraph nodes={graph.nodes} edges={graph.edges} />
        </Suspense>
      </div>
    </div>
  );
}
