import { NextResponse } from "next/server";
import {
  getDocuments,
  getEntities,
  getKnowledgeGraph,
  getMissions,
} from "@bhavya/content-core";

export interface Insight {
  id: string;
  type: "publication" | "entity" | "relationship" | "mission" | "milestone";
  title: string;
  description: string;
  timestamp: string;
  source: string;
}

function generateInsights(): Insight[] {
  const docs = getDocuments();
  const entities = getEntities();
  const kg = getKnowledgeGraph();
  const missions = getMissions();

  const insights: Insight[] = [];

  // Recent publications
  const recentDocs = [...docs]
    .sort((a, b) => (b.created || "").localeCompare(a.created || ""))
    .slice(0, 3);

  for (const doc of recentDocs) {
    insights.push({
      id: `pub-${doc.id}`,
      type: "publication",
      title: `${doc.title} published`,
      description: `${doc.category} document added to ${doc.category} knowledge base.`,
      timestamp: doc.created || new Date().toISOString(),
      source: doc.category,
    });
  }

  // Entity growth
  const recentEntities = [...entities]
    .sort((a, b) => (b.created || "").localeCompare(a.created || ""))
    .slice(0, 2);

  for (const entity of recentEntities) {
    insights.push({
      id: `entity-${entity.id}`,
      type: "entity",
      title: `New entity: ${entity.name}`,
      description: `${entity.type} entity added to the knowledge graph.`,
      timestamp: entity.created || new Date().toISOString(),
      source: "knowledge-graph",
    });
  }

  // Mission activity
  for (const mission of missions.slice(0, 2)) {
    insights.push({
      id: `mission-${mission.id}`,
      type: "mission",
      title: `Forest mission: ${mission.name}`,
      description: `Active mission in ${mission.region} with goals: ${mission.goals.slice(0, 2).join(", ")}.`,
      timestamp: mission.created || new Date().toISOString(),
      source: "forest",
    });
  }

  // Knowledge graph milestone
  const totalEdges = kg.reduce((sum, n) => sum + (n.links?.length || 0), 0);
  if (totalEdges > 0) {
    insights.push({
      id: "kg-milestone",
      type: "milestone",
      title: `Knowledge graph: ${totalEdges} relationships`,
      description: `Institutional knowledge graph now connects ${kg.length} nodes through ${totalEdges} relationships.`,
      timestamp: new Date().toISOString(),
      source: "intelligence",
    });
  }

  // Sort by timestamp
  insights.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return insights.slice(0, 10);
}

export async function GET() {
  const insights = generateInsights();

  return NextResponse.json({
    insights,
    count: insights.length,
    generatedAt: new Date().toISOString(),
  });
}
