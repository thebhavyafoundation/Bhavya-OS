import { NextRequest, NextResponse } from "next/server";
import { executePipeline } from "@/lib/pipeline";
import { getKO } from "@/lib/ingestion";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { koId, goal } = body;

    if (!koId) {
      return NextResponse.json({ error: "koId is required" }, { status: 400 });
    }

    const ko = getKO(koId);
    if (!ko) {
      return NextResponse.json(
        { error: `KO not found: ${koId}` },
        { status: 404 },
      );
    }

    // Execute pipeline (async)
    const execution = await executePipeline(ko, goal);

    return NextResponse.json({
      success: true,
      planId: execution.planId,
      status: execution.status,
      totalArtifacts: execution.artifacts.length,
      nodeResults: execution.nodeResults,
      durationMs: execution.completedAt
        ? new Date(execution.completedAt).getTime() -
          new Date(execution.startedAt).getTime()
        : null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
