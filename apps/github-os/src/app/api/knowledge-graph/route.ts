import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const nodeType = searchParams.get("nodeType") || "";

  let nodesQuery = "SELECT * FROM knowledge_graph_nodes";
  const nodeParams: string[] = [];

  if (nodeType) {
    nodesQuery += " WHERE node_type = ?";
    nodeParams.push(nodeType);
  }

  nodesQuery += " ORDER BY node_type, label";

  const nodes = db.prepare(nodesQuery).all(...nodeParams);
  const edges = db
    .prepare("SELECT * FROM knowledge_graph_edges ORDER BY relationship")
    .all();

  const nodeTypes = db
    .prepare(
      "SELECT DISTINCT node_type FROM knowledge_graph_nodes ORDER BY node_type",
    )
    .all() as { node_type: string }[];

  return NextResponse.json({
    nodes,
    edges,
    filters: {
      nodeTypes: nodeTypes.map((n) => n.node_type),
    },
  });
}
