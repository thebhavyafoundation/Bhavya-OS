import { NextRequest, NextResponse } from "next/server";
import { initDatabase } from "@/lib/db";
import { getMissionControlRepository } from "@/lib/repositories";
import { requireMissionOperator, actorOf } from "../_auth";

export async function GET(req: NextRequest) {
  const gate = await requireMissionOperator(req);
  if ("error" in gate) return gate.error;
  await initDatabase();
  const repo = getMissionControlRepository();
  const status = req.nextUrl.searchParams.get("status") ?? undefined;
  const jobs = await repo.listJobs(
    status as Parameters<typeof repo.listJobs>[0],
  );
  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const gate = await requireMissionOperator(req);
  if ("error" in gate) return gate.error;
  const body = (await req.json().catch(() => null)) as {
    title?: string;
    department?: string;
    agent?: string;
    taskContractIds?: string[];
  } | null;
  if (!body?.title?.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  await initDatabase();
  const repo = getMissionControlRepository();
  const job = await repo.createJob({
    title: body.title,
    department: body.department,
    agent: body.agent,
    taskContractIds: body.taskContractIds,
    createdBy: actorOf(gate.user),
  });
  return NextResponse.json(job, { status: 201 });
}
