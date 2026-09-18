import { NextRequest, NextResponse } from "next/server";
import { initDatabase } from "@/lib/db";
import { getMissionControlRepository } from "@/lib/repositories";
import { requireMissionOperator, actorOf } from "../../_auth";

const ACTIONS = ["start", "submit", "complete", "stop", "cancel", "startSession", "endSession", "bind"] as const;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requireMissionOperator(req);
  if ("error" in gate) return gate.error;
  const { id } = await params;
  await initDatabase();
  const repo = getMissionControlRepository();
  const job = await repo.getJob(id);
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  const artifacts = await repo.listArtifacts(id);
  const versions = await Promise.all(artifacts.map((a) => repo.listVersions(a.id)));
  const decisions = await repo.listDecisions("job", id);
  return NextResponse.json({
    job,
    artifacts: artifacts.map((a, i) => ({ ...a, versions: versions[i] })),
    decisions,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requireMissionOperator(req);
  if ("error" in gate) return gate.error;
  const { id } = await params;
  const body = (await req.json().catch(() => null)) as {
    action?: string;
    reason?: string;
    producer?: string;
    sessionId?: string;
    sessionStatus?: "completed" | "failed";
    queueJobId?: string;
    graph?: boolean;
  } | null;
  if (!body || !(ACTIONS as readonly string[]).includes(body.action ?? "")) {
    return NextResponse.json(
      { error: `action must be one of: ${ACTIONS.join(", ")}` },
      { status: 400 },
    );
  }
  await initDatabase();
  const repo = getMissionControlRepository();
  try {
    switch (body.action) {
      case "start":
        return NextResponse.json(await repo.startJob(id));
      case "submit":
        return NextResponse.json(await repo.submitJobForApproval(id));
      case "complete":
        return NextResponse.json(await repo.completeJob(id));
      case "stop":
        return NextResponse.json(
          await repo.stopJob(id, actorOf(gate.user), body.reason ?? ""),
        );
      case "cancel":
        return NextResponse.json(await repo.cancelJob(id));
      case "startSession":
        if (!body.producer?.trim()) {
          return NextResponse.json({ error: "producer is required" }, { status: 400 });
        }
        return NextResponse.json(await repo.startSession(id, body.producer), { status: 201 });
      case "endSession": {
        if (!body.sessionId || (body.sessionStatus !== "completed" && body.sessionStatus !== "failed")) {
          return NextResponse.json(
            { error: "sessionId and sessionStatus (completed|failed) are required" },
            { status: 400 },
          );
        }
        return NextResponse.json(await repo.endSession(body.sessionId, body.sessionStatus));
      }
      case "bind":
        if (!body.queueJobId?.trim()) {
          return NextResponse.json({ error: "queueJobId is required" }, { status: 400 });
        }
        return NextResponse.json(await repo.bindQueueJob(id, body.queueJobId));
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Transition failed" },
      { status: 422 },
    );
  }
}
