import { NextRequest, NextResponse } from "next/server";
import { initDatabase } from "@/lib/db";
import { getMissionControlRepository } from "@/lib/repositories";
import type { McDestination } from "@/lib/repositories";
import { requireMissionOperator, actorOf } from "../_auth";

const DESTINATIONS: McDestination[] = ["website", "offline-app", "openskool", "internal", "social"];

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
    reason?: string;
    destination?: string;
    path?: string;
    hash?: string;
    humanReplacement?: boolean;
  } | null;
  if (!body?.op || (body.op !== "create" && body.op !== "addVersion" && body.op !== "verify" && body.op !== "beginIntegrate" && body.op !== "completeIntegrate" && body.op !== "supersede" && body.op !== "archive" && body.op !== "setDestination")) {
    return NextResponse.json({ error: "op must be create, addVersion, verify, beginIntegrate, completeIntegrate, supersede, archive, or setDestination" }, { status: 400 });
  }
  await initDatabase();
  const repo = getMissionControlRepository();

  if (body.op === "verify" || body.op === "beginIntegrate" || body.op === "completeIntegrate" || body.op === "supersede" || body.op === "archive" || body.op === "setDestination") {
    if (!body.artifactId) {
      return NextResponse.json({ error: "artifactId is required" }, { status: 400 });
    }
    try {
      if (body.op === "verify") return NextResponse.json(await repo.markVerified(body.artifactId));
      if (body.op === "beginIntegrate") return NextResponse.json(await repo.beginIntegration(body.artifactId));
      if (body.op === "supersede" || body.op === "archive") {
        if (!body.reason?.trim()) {
          return NextResponse.json({ error: "reason is required" }, { status: 400 });
        }
        const out =
          body.op === "supersede"
            ? await repo.supersedeArtifact(body.artifactId, actorOf(gate.user), body.reason)
            : await repo.archiveArtifact(body.artifactId, actorOf(gate.user), body.reason);
        return NextResponse.json(out);
      }
      if (body.op === "setDestination") {
        if (!body.destination || !(DESTINATIONS as string[]).includes(body.destination)) {
          return NextResponse.json({ error: `destination must be one of: ${DESTINATIONS.join(", ")}` }, { status: 400 });
        }
        return NextResponse.json(
          await repo.setDestination(body.artifactId, body.destination as McDestination, actorOf(gate.user)),
        );
      }
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
