import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-auth";
import {
  buildKnowledgeGraphFromData,
  getKnowledgeGraph,
} from "@/lib/knowledge-graph-builder";

export const GET = withAuth(async (request, _user) => {
  const { searchParams } = new URL(request.url);
  const nodeType = searchParams.get("nodeType") || undefined;
  const relationship = searchParams.get("relationship") || undefined;
  const rebuild = searchParams.get("rebuild") === "true";

  if (rebuild) {
    // Rebuild graph from all stored data
    const result = buildKnowledgeGraphFromData();
    return NextResponse.json({
      success: true,
      rebuilt: true,
      ...result,
    });
  }

  const graph = getKnowledgeGraph({ nodeType, relationship });

  return NextResponse.json({
    success: true,
    nodes: graph.nodes,
    edges: graph.edges,
    stats: graph.stats,
    filters: {
      nodeTypes: Object.keys(graph.stats.nodeTypes),
      relationships: Object.keys(graph.stats.edgeTypes),
    },
  });
});

/**
 * POST /api/knowledge-graph — Rebuild the knowledge graph
 */
export const POST = withAuth(async () => {
  try {
    const result = buildKnowledgeGraphFromData();
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
});
