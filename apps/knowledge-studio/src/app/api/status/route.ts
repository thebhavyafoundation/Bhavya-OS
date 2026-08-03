import { NextRequest, NextResponse } from "next/server";
import { getPipeline, listPipelines } from "@/lib/pipeline";
import { listPipelineResults } from "@/lib/artifacts";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const planId = searchParams.get("planId");

  if (planId) {
    const pipeline = getPipeline(planId);
    if (pipeline) {
      return NextResponse.json({
        planId: pipeline.planId,
        goal: pipeline.goal,
        status: pipeline.status,
        startedAt: pipeline.startedAt,
        completedAt: pipeline.completedAt,
        totalArtifacts: pipeline.artifacts.length,
        nodeResults: pipeline.nodeResults,
        events: pipeline.events.slice(-20),
        metrics: pipeline.metrics,
        graph: pipeline.graph,
      });
    }
    // Check persisted results
    const results = listPipelineResults();
    const result = results.find((r) => r.planId === planId);
    if (result) return NextResponse.json(result);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // List all pipelines
  const active = listPipelines().map((p) => ({
    planId: p.planId,
    goal: p.goal,
    status: p.status,
    startedAt: p.startedAt,
    completedAt: p.completedAt,
    totalArtifacts: p.artifacts.length,
  }));

  const persisted = listPipelineResults().map((r) => ({
    planId: r.planId,
    goal: r.goal,
    status: r.status,
    startedAt: r.startedAt,
    completedAt: r.completedAt,
    totalArtifacts: r.artifacts.length,
  }));

  // Merge, deduplicate by planId
  const seen = new Set<string>();
  const all = [...active, ...persisted].filter((p) => {
    if (seen.has(p.planId)) return false;
    seen.add(p.planId);
    return true;
  });

  return NextResponse.json({ pipelines: all });
}
