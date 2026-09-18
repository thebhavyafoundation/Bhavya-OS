import { NextRequest, NextResponse } from "next/server";
import { initDatabase } from "@/lib/db";
import { getMissionControlRepository } from "@/lib/repositories";
import type { McRequestDecision } from "@/lib/repositories";
import { requireMissionOperator, actorOf } from "../_auth";

export async function GET(req: NextRequest) {
  const gate = await requireMissionOperator(req);
  if ("error" in gate) return gate.error;
  await initDatabase();
  const repo = getMissionControlRepository();
  const pending = await repo.listPendingApprovals();
  const enriched = await Promise.all(
    pending.map(async (r) => ({ request: r, artifact: await repo.getArtifact(r.artifactId) })),
  );
  return NextResponse.json(enriched);
}

export async function POST(req: NextRequest) {
  const gate = await requireMissionOperator(req);
  if ("error" in gate) return gate.error;
  const body = (await req.json().catch(() => null)) as {
    op?: string;
    artifactId?: string;
    requestId?: string;
    action?: McRequestDecision;
    reason?: string;
    instruction?: string;
  } | null;
  if (!body?.op || (body.op !== "request" && body.op !== "decide")) {
    return NextResponse.json({ error: "op must be request or decide" }, { status: 400 });
  }
  await initDatabase();
  const repo = getMissionControlRepository();
  try {
    if (body.op === "request") {
      if (!body.artifactId) {
        return NextResponse.json({ error: "artifactId is required" }, { status: 400 });
      }
      const request = await repo.requestApproval(body.artifactId, actorOf(gate.user));
      return NextResponse.json(request, { status: 201 });
    }
    if (!body.requestId || !body.action) {
      return NextResponse.json({ error: "requestId and action are required" }, { status: 400 });
    }
    if (!["approve", "reject", "request_revision"].includes(body.action)) {
      return NextResponse.json({ error: "action must be approve, reject, or request_revision" }, { status: 400 });
    }
    const decision = await repo.decide({
      requestId: body.requestId,
      action: body.action,
      actor: actorOf(gate.user),
      reason: body.reason,
      instruction: body.instruction,
    });
    return NextResponse.json(decision, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Approval operation failed" },
      { status: 422 },
    );
  }
}
