import { NextRequest, NextResponse } from "next/server";
import { initDatabase } from "@/lib/db";
import { getMissionControlRepository } from "@/lib/repositories";
import { listTaskContracts, getTaskContract } from "@/lib/task-contracts";
import { requireMissionOperator } from "../_auth";

export async function GET(req: NextRequest) {
  const gate = await requireMissionOperator(req);
  if ("error" in gate) return gate.error;
  const id = req.nextUrl.searchParams.get("id");
  await initDatabase();
  const repo = getMissionControlRepository();
  if (id) {
    const task = getTaskContract(id);
    if (!task) return NextResponse.json({ error: "Task contract not found" }, { status: 404 });
    const jobs = await repo.findJobsByTaskContract(id);
    return NextResponse.json({ task, jobs });
  }
  const tasks = listTaskContracts();
  const withCounts = await Promise.all(
    tasks.map(async (t) => ({ task: t, jobCount: (await repo.findJobsByTaskContract(t.id)).length })),
  );
  return NextResponse.json(withCounts);
}
