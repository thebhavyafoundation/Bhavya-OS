import { NextRequest, NextResponse } from "next/server";
import { runDiscoveryLoop, getRecentRuns, getRun } from "@/lib/engine";
import { requireOperator, requireAuthenticated } from "@/lib/auth";

export async function POST(_req: NextRequest) {
  const auth = await requireOperator(_req);
  if (auth.error) return auth.error;

  const run = await runDiscoveryLoop();
  return NextResponse.json({ ok: true, run });
}

export async function GET(req: NextRequest) {
  const auth = await requireAuthenticated(req);
  if (auth.error) return auth.error;

  const url = new URL(req.url);
  const runId = url.searchParams.get("runId");

  if (runId) {
    const run = getRun(runId);
    if (!run)
      return NextResponse.json(
        { ok: false, error: "Run not found" },
        { status: 404 },
      );
    return NextResponse.json({ ok: true, run });
  }

  const runs = getRecentRuns(20);
  return NextResponse.json({ ok: true, runs });
}
