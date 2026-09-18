import { NextRequest, NextResponse } from "next/server";
import { initDatabase } from "@/lib/db";
import { getMissionControlRepository } from "@/lib/repositories";
import { requireMissionOperator, actorOf } from "../_auth";

export async function POST(req: NextRequest) {
  const gate = await requireMissionOperator(req);
  if ("error" in gate) return gate.error;
  const body = (await req.json().catch(() => null)) as {
    op?: string;
    jobId?: string;
    artifactId?: string;
    kind?: string;
    title?: string;
    source?: string;
    producer?: string;
    note?: string;
    path?: string;
    hash?: string;
    humanReplacement?: boolean;
  } | null;
  if (!body?.op || (body.op !== "create" && body.op !== "addVersion" && body.op !== "verify" && body.op !== "beginIntegrate" && body.op !== "completeIntegrate")) {
    return NextResponse.json({ error: "op must be create, addVersion, verify, beginIntegrate, or completeIntegrate" }, { status: 400 });
  }
  await initDatabase();
  const repo = getMissionControlRepository();

  if (body.op === "verify" || body.op === "beginIntegrate" || body.op === "completeIntegrate") {
    if (!body.artifactId) {
      return NextResponse.json({ error: "artifactId is required" }, { status: 400 });
    }
    try {
      if (body.op === "verify") return NextResponse.json(await repo.markVerified(body.artifactId));
      if (body.op === "beginIntegrate") return NextResponse.json(await repo.beginIntegration(body.artifactId));
      return NextResponse.json(
        await repo.completeIntegration(body.artifactId, actorOf(gate.user), body.note),
      );
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Integration operation failed" },
        { status: 422 },
      );
    }
  }

  try {
    if (body.op === "create") {
      if (!body.jobId || !body.title || !body.producer) {
        return NextResponse.json(
          { error: "jobId, title, and producer are required" },
          { status: 400 },
        );
      }
      const out = await repo.createArtifact({
        jobId: body.jobId,
        kind: body.kind,
        title: body.title,
        source: body.source,
        producer: body.producer,
        note: body.note,
      });
      return NextResponse.json(out, { status: 201 });
    }
    if (!body.artifactId || !body.producer) {
      return NextResponse.json(
        { error: "artifactId and producer are required" },
        { status: 400 },
      );
    }
    const version = await repo.addVersion({
      artifactId: body.artifactId,
      producer: body.producer,
      path: body.path,
      hash: body.hash,
      humanReplacement: body.humanReplacement,
      note: body.note,
    });
    return NextResponse.json(version, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Artifact operation failed" },
      { status: 422 },
    );
  }
}
