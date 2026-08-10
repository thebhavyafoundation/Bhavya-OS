import { NextResponse } from "next/server";
import {
  calculateTrends,
  getHistory,
  recordSnapshot,
} from "@bhavya/intelligence";
import {
  getDocuments,
  getEntities,
  getKnowledgeGraph,
  getMissions,
  getVolunteers,
} from "@bhavya/content-core";

export async function GET() {
  const trends = calculateTrends();
  const history = getHistory();

  return NextResponse.json({
    trends,
    historyLength: history.length,
    latestSnapshot: history.length > 0 ? history[history.length - 1] : null,
  });
}

export async function POST() {
  // Record current snapshot
  const docs = getDocuments();
  const entities = getEntities();
  const kg = getKnowledgeGraph();
  const missions = getMissions();
  const volunteers = getVolunteers();

  const totalEdges = kg.reduce((sum, n) => sum + (n.links?.length || 0), 0);
  const publishedDocs = docs.filter((d) => d.status === "published").length;

  const snapshot = {
    timestamp: new Date().toISOString(),
    documents: {
      total: docs.length,
      published: publishedDocs,
      draft: docs.length - publishedDocs,
    },
    entities: {
      total: entities.length,
    },
    relationships: {
      total: totalEdges,
    },
    knowledge: {
      nodes: kg.length,
      density: kg.length > 0 ? Math.round((totalEdges / kg.length) * 100) / 100 : 0,
    },
    missions: {
      forest: missions.length,
      heritage: 0,
      research: 0,
      volunteers: volunteers.length,
    },
  };

  recordSnapshot(snapshot);

  return NextResponse.json({
    message: "Snapshot recorded",
    snapshot,
  });
}
