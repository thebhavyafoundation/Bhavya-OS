import { NextRequest, NextResponse } from "next/server";
import { initDatabase } from "@/lib/db";
import { getMissionControlRepository } from "@/lib/repositories";
import { requireMissionOperator } from "../_auth";

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
  if (!body?.op || (body.op !== "create" && body.op !== "addVersion")) {
    return NextResponse.json({ error: "op must be create or addVersion" }, { status: 400 });
  }
  await initDatabase();
  const repo = getMissionControlRepository();
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
