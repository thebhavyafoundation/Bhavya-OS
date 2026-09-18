import { NextRequest, NextResponse } from "next/server";
import { initDatabase } from "@/lib/db";
import { getMissionControlRepository } from "@/lib/repositories";
import { getGitHubData } from "@/lib/os-data";
import { requireMissionOperator, actorOf } from "../_auth";

/**
 * POST /os/mission/api/evaluations — idempotent adapter entrypoint.
 * Body: { repoId: string, taskContractIds?: string[] }.
 * Creates (or returns the existing) Mission Control evaluation job +
 * session + artifact v1 from a REAL github-os repository row.
 */
export async function POST(req: NextRequest) {
  const gate = await requireMissionOperator(req);
  if ("error" in gate) return gate.error;
  const body = (await req.json().catch(() => null)) as {
    repoId?: string;
    taskContractIds?: string[];
  } | null;
  if (!body?.repoId?.trim()) {
    return NextResponse.json({ error: "repoId is required" }, { status: 400 });
  }
  await initDatabase();
  let row: Record<string, unknown> | undefined;
  try {
    const data = getGitHubData();
    const rows = data.repositories as unknown as Record<string, unknown>[];
    row = rows.find((r) => String(r.id) === body.repoId!.trim());
  } catch {
    row = undefined;
  }
  if (!row) {
    return NextResponse.json(
      { error: "Repository record not found in github-os data" },
      { status: 404 },
    );
  }
  const num = (v: unknown): number | undefined => (typeof v === "number" ? v : undefined);
  const str = (v: unknown): string | undefined => (typeof v === "string" && v ? v : undefined);
  const repo = getMissionControlRepository();
  try {
    const out = await repo.createJobFromEvaluation({
      repoId: String(row.id),
      repoName: String(row.name ?? row.id),
      language: str(row.language),
      stars: num(row.stars),
      forks: num(row.forks),
      license: str(row.license),
      healthScore: num(row.health_score),
      technologyScore: num(row.technology_score),
      bhavyaScore: num(row.bhavya_score),
      maturity: str(row.engineering_maturity),
      recommendation: str(row.recommendation_type),
      relevance: str(row.why_bhavya_cares),
      taskContractIds: body.taskContractIds,
      createdBy: actorOf(gate.user),
    });
    return NextResponse.json(
      { job: out.job, session: out.session, artifact: out.artifact, version: out.version, deduped: out.deduped },
      { status: out.deduped ? 200 : 201 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Evaluation failed" },
      { status: 422 },
    );
  }
}
