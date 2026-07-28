import { GraphNode, Relationship, RelationshipType } from "./models";
import { getKnowledgeGraph, getGraphNode } from "./documents";
import { getEntities } from "./entities";

// ── Relationship Repository ────────────────────────────────

function buildRelationshipsFromGraph(): Relationship[] {
  const kg = getKnowledgeGraph();
  const relationships: Relationship[] = [];
  let idx = 0;

  for (const node of kg) {
    if (!node.links) continue;
    for (const targetId of node.links) {
      relationships.push({
        id: `rel-${idx++}`,
        sourceId: node.id,
        targetId,
        type: "related_to" as RelationshipType,
        weight: 1,
        properties: {},
        created: new Date().toISOString(),
      });
    }
  }

  return relationships;
}

function buildRelationshipsFromEntities(): Relationship[] {
  const entities = getEntities();
  const relationships: Relationship[] = [];
  let idx = 1000;

  for (const entity of entities) {
    for (const docId of entity.documentIds) {
      relationships.push({
        id: `rel-ent-${idx++}`,
        sourceId: entity.id,
        targetId: docId,
        type: "mentions" as RelationshipType,
        weight: entity.mentions,
        properties: {},
        created: new Date().toISOString(),
      });
    }
  }

  return relationships;
}

let _relationshipsCache: Relationship[] | null = null;

export function getRelationships(): Relationship[] {
  if (!_relationshipsCache) {
    _relationshipsCache = [
      ...buildRelationshipsFromGraph(),
      ...buildRelationshipsFromEntities(),
    ];
  }
  return _relationshipsCache;
}

export function getRelationshipsBySource(sourceId: string): Relationship[] {
  return getRelationships().filter((r) => r.sourceId === sourceId);
}

export function getRelationshipsByTarget(targetId: string): Relationship[] {
  return getRelationships().filter((r) => r.targetId === targetId);
}

export function getRelationshipsByType(type: RelationshipType): Relationship[] {
  return getRelationships().filter((r) => r.type === type);
}

// ── Graph Helpers ──────────────────────────────────────────

export function getGraphNodeNeighbors(nodeId: string): GraphNode[] {
  const node = getGraphNode(nodeId);
  if (!node?.links) return [];
  const kg = getKnowledgeGraph();
  return node.links
    .map((linkId) => kg.find((n) => n.id === linkId))
    .filter(Boolean) as GraphNode[];
}

export function getGraphStats(): {
  totalNodes: number;
  totalEdges: number;
  nodesByType: Record<string, number>;
} {
  const kg = getKnowledgeGraph();
  const nodesByType: Record<string, number> = {};
  kg.forEach((n) => {
    nodesByType[n.type] = (nodesByType[n.type] || 0) + 1;
  });
  const totalEdges = kg.reduce((sum, n) => sum + (n.links?.length || 0), 0);
  return { totalNodes: kg.length, totalEdges, nodesByType };
}
