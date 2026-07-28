import { NextResponse } from "next/server";
import { getKnowledgeGraph, getLinkedNodes, searchDocuments } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const node = searchParams.get("node");
  const query = searchParams.get("q");

  if (node) {
    const linkedNodes = getLinkedNodes(node);
    return NextResponse.json({
      nodeId: node,
      linkedNodes: linkedNodes.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        owner: n.owner,
        status: n.status,
      })),
    });
  }

  if (query) {
    const results = searchDocuments(query);
    return NextResponse.json({
      query,
      total: results.length,
      results: results.map((d) => ({
        id: d.id,
        title: d.title,
        category: d.category,
        summary: d.summary,
        tags: d.tags,
      })),
    });
  }

  const graph = getKnowledgeGraph();
  return NextResponse.json({
    total: graph.length,
    nodes: graph.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      owner: n.owner,
      status: n.status,
      links: n.links,
    })),
  });
}
