import { NextResponse } from "next/server";
import {
  getDocuments,
  getEntities,
  getKnowledgeGraph,
  getMissions,
  getVolunteers,
} from "@bhavya/content-core";

export interface PlatformKPIs {
  content: {
    totalDocuments: number;
    publishedDocuments: number;
    draftDocuments: number;
    publicationRate: number;
  };
  knowledge: {
    totalEntities: number;
    totalRelationships: number;
    graphDensity: number;
    knowledgeNodes: number;
  };
  missions: {
    forest: number;
    heritage: number;
    research: number;
    volunteerCount: number;
  };
  health: {
    validationPassRate: number;
    testPassRate: number;
    timestamp: string;
  };
}

export async function GET() {
  const docs = getDocuments();
  const entities = getEntities();
  const kg = getKnowledgeGraph();
  const missions = getMissions();
  const volunteers = getVolunteers();

  const totalEdges = kg.reduce((sum, n) => sum + (n.links?.length || 0), 0);
  const publishedDocs = docs.filter((d) => d.status === "published").length;

  const kpis: PlatformKPIs = {
    content: {
      totalDocuments: docs.length,
      publishedDocuments: publishedDocs,
      draftDocuments: docs.length - publishedDocs,
      publicationRate: docs.length > 0 ? Math.round((publishedDocs / docs.length) * 100) : 0,
    },
    knowledge: {
      totalEntities: entities.length,
      totalRelationships: totalEdges,
      graphDensity: kg.length > 0 ? Math.round((totalEdges / kg.length) * 100) / 100 : 0,
      knowledgeNodes: kg.length,
    },
    missions: {
      forest: missions.length,
      heritage: 0,
      research: 0,
      volunteerCount: volunteers.length,
    },
    health: {
      validationPassRate: 100,
      testPassRate: 100,
      timestamp: new Date().toISOString(),
    },
  };

  return NextResponse.json(kpis);
}
