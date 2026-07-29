// ── Knowledge Graph Explorer ──────────────────────────────
// Explores relationships between documents, entities, and missions.
// Provides graph traversal, path finding, and neighborhood analysis.

import {
  getDocuments,
  getEntities,
  getKnowledgeGraph,
  getGraphNode,
  getLinkedNodes,
  getRelationships,
  getGraphNodeNeighbors,
} from "@bhavya/content-core";

// ── Types ─────────────────────────────────────────────────

export interface GraphNode {
  id: string;
  type: string;
  title: string;
  level: number;
  metadata: Record<string, unknown>;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: string;
  weight: number;
}

export interface GraphPath {
  nodes: GraphNode[];
  edges: GraphEdge[];
  length: number;
}

export interface GraphStats {
  totalNodes: number;
  totalEdges: number;
  nodesByType: Record<string, number>;
  edgesByType: Record<string, number>;
  averageConnections: number;
}

export interface Neighborhood {
  center: GraphNode;
  neighbors: GraphNode[];
  edges: GraphEdge[];
}

// ── Graph Building ────────────────────────────────────────

function buildFullGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeIds = new Set<string>();

  // Add documents as nodes
  const docs = getDocuments();
  for (const doc of docs) {
    if (!nodeIds.has(doc.id)) {
      nodes.push({
        id: doc.id,
        type: "document",
        title: doc.title,
        level: 0,
        metadata: {
          category: doc.category,
          status: doc.status,
          created: doc.created,
        },
      });
      nodeIds.add(doc.id);
    }
  }

  // Add entities as nodes
  const entities = getEntities();
  for (const entity of entities) {
    if (!nodeIds.has(entity.id)) {
      nodes.push({
        id: entity.id,
        type: "entity",
        title: entity.name,
        level: 1,
        metadata: {
          entityType: entity.type,
          mentions: entity.mentions,
        },
      });
      nodeIds.add(entity.id);
    }
  }

  // Add knowledge graph nodes
  const kg = getKnowledgeGraph();
  for (const node of kg) {
    if (!nodeIds.has(node.id)) {
      nodes.push({
        id: node.id,
        type: node.type,
        title: node.title,
        level: 2,
        metadata: {
          status: node.status,
          owner: node.owner,
          created: node.created,
        },
      });
      nodeIds.add(node.id);
    }
  }

  // Add edges from knowledge graph links
  for (const node of kg) {
    if (node.links) {
      for (const targetId of node.links) {
        if (nodeIds.has(targetId)) {
          edges.push({
            source: node.id,
            target: targetId,
            type: "related_to",
            weight: 1,
          });
        }
      }
    }
  }

  // Add edges from entity document relationships
  for (const entity of entities) {
    for (const docId of entity.documentIds) {
      if (nodeIds.has(docId)) {
        edges.push({
          source: entity.id,
          target: docId,
          type: "mentions",
          weight: entity.mentions,
        });
      }
    }
  }

  return { nodes, edges };
}

// ── Graph Exploration ─────────────────────────────────────

let _graphCache: { nodes: GraphNode[]; edges: GraphEdge[] } | null = null;

function getGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  if (!_graphCache) {
    _graphCache = buildFullGraph();
  }
  return _graphCache;
}

export function getGraphNodes(): GraphNode[] {
  return getGraph().nodes;
}

export function getGraphEdges(): GraphEdge[] {
  return getGraph().edges;
}

export function getGraphNodeById(id: string): GraphNode | undefined {
  return getGraph().nodes.find((n) => n.id === id);
}

export function getNodeNeighbors(nodeId: string): Neighborhood {
  const center = getGraphNodeById(nodeId);
  if (!center) {
    return {
      center: { id: nodeId, type: "unknown", title: "Unknown", level: 0, metadata: {} },
      neighbors: [],
      edges: [],
    };
  }

  const edges = getGraph().edges.filter(
    (e) => e.source === nodeId || e.target === nodeId,
  );

  const neighborIds = new Set<string>();
  for (const edge of edges) {
    if (edge.source === nodeId) neighborIds.add(edge.target);
    if (edge.target === nodeId) neighborIds.add(edge.source);
  }

  const neighbors = getGraph().nodes.filter((n) => neighborIds.has(n.id));

  return { center, neighbors, edges };
}

// ── Path Finding (BFS) ───────────────────────────────────

export function findPath(
  startId: string,
  endId: string,
  maxDepth: number = 5,
): GraphPath | null {
  const graph = getGraph();
  const startNode = graph.nodes.find((n) => n.id === startId);
  const endNode = graph.nodes.find((n) => n.id === endId);

  if (!startNode || !endNode) return null;

  const visited = new Set<string>();
  const queue: { nodeId: string; path: string[] }[] = [
    { nodeId: startId, path: [startId] },
  ];

  while (queue.length > 0) {
    const { nodeId, path } = queue.shift()!;

    if (nodeId === endId) {
      // Build path result
      const pathNodes = path
        .map((id) => graph.nodes.find((n) => n.id === id))
        .filter(Boolean) as GraphNode[];

      const pathEdges: GraphEdge[] = [];
      for (let i = 0; i < path.length - 1; i++) {
        const edge = graph.edges.find(
          (e) =>
            (e.source === path[i] && e.target === path[i + 1]) ||
            (e.source === path[i + 1] && e.target === path[i]),
        );
        if (edge) pathEdges.push(edge);
      }

      return {
        nodes: pathNodes,
        edges: pathEdges,
        length: path.length - 1,
      };
    }

    if (path.length > maxDepth) continue;
    if (visited.has(nodeId)) continue;

    visited.add(nodeId);

    // Find neighbors
    const neighbors = graph.edges
      .filter((e) => e.source === nodeId || e.target === nodeId)
      .map((e) => (e.source === nodeId ? e.target : e.source));

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push({ nodeId: neighbor, path: [...path, neighbor] });
      }
    }
  }

  return null;
}

// ── Graph Statistics ──────────────────────────────────────

export function getGraphStatistics(): GraphStats {
  const graph = getGraph();
  const nodesByType: Record<string, number> = {};
  const edgesByType: Record<string, number> = {};

  for (const node of graph.nodes) {
    nodesByType[node.type] = (nodesByType[node.type] || 0) + 1;
  }

  for (const edge of graph.edges) {
    edgesByType[edge.type] = (edgesByType[edge.type] || 0) + 1;
  }

  const totalConnections = graph.edges.length * 2;
  const averageConnections =
    graph.nodes.length > 0 ? totalConnections / graph.nodes.length : 0;

  return {
    totalNodes: graph.nodes.length,
    totalEdges: graph.edges.length,
    nodesByType,
    edgesByType,
    averageConnections: Math.round(averageConnections * 100) / 100,
  };
}

// ── Connected Components ──────────────────────────────────

export function getConnectedComponents(): string[][] {
  const graph = getGraph();
  const visited = new Set<string>();
  const components: string[][] = [];

  for (const node of graph.nodes) {
    if (!visited.has(node.id)) {
      const component: string[] = [];
      const queue = [node.id];

      while (queue.length > 0) {
        const nodeId = queue.shift()!;
        if (visited.has(nodeId)) continue;

        visited.add(nodeId);
        component.push(nodeId);

        const neighbors = graph.edges
          .filter((e) => e.source === nodeId || e.target === nodeId)
          .map((e) => (e.source === nodeId ? e.target : e.source));

        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            queue.push(neighbor);
          }
        }
      }

      components.push(component);
    }
  }

  return components;
}
