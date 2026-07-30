// ── Knowledge Graph Explorer ──────────────────────────────
// Explores relationships between documents, entities, and missions.
// Returns GraphInsight with graph data.

import {
  getDocuments,
  getEntities,
  getKnowledgeGraph,
} from "@bhavya/content-core";

import {
  GraphInsight,
  GraphNode,
  GraphEdge,
  GraphPath,
  createInsight,
  createEvidence,
  calculateConfidence,
} from "./insight";

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

// ── Graph Cache ───────────────────────────────────────────

let _graphCache: { nodes: GraphNode[]; edges: GraphEdge[] } | null = null;

function getGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  if (!_graphCache) {
    _graphCache = buildFullGraph();
  }
  return _graphCache;
}

// ── Graph Exploration Functions ────────────────────────────

export function getGraphNodes(): GraphInsight {
  const graph = getGraph();

  return {
    ...createInsight({
      id: `graph-nodes-${Date.now()}`,
      title: "All Graph Nodes",
      description: `Graph contains ${graph.nodes.length} nodes`,
      confidence: 1,
      evidence: [],
      data: { nodes: graph.nodes, edges: [] },
    }),
    category: "graph",
  };
}

export function getGraphEdges(): GraphInsight {
  const graph = getGraph();

  return {
    ...createInsight({
      id: `graph-edges-${Date.now()}`,
      title: "All Graph Edges",
      description: `Graph contains ${graph.edges.length} edges`,
      confidence: 1,
      evidence: [],
      data: { nodes: [], edges: graph.edges },
    }),
    category: "graph",
  };
}

export function getGraphNodeById(id: string): GraphInsight {
  const graph = getGraph();
  const node = graph.nodes.find((n) => n.id === id);

  if (!node) {
    return {
      ...createInsight({
        id: `graph-node-${id}-not-found`,
        title: `Node Not Found: ${id}`,
        description: `No node found with ID "${id}"`,
        confidence: 1,
        evidence: [],
        data: { nodes: [], edges: [] },
      }),
      category: "graph",
    };
  }

  const edges = graph.edges.filter(
    (e) => e.source === id || e.target === id,
  );

  return {
    ...createInsight({
      id: `graph-node-${id}`,
      title: `Node: ${node.title}`,
      description: `Node of type "${node.type}" with ${edges.length} connections`,
      confidence: 1,
      evidence: [
        createEvidence({
          sourceId: id,
          sourceType: node.type as "document" | "entity" | "mission",
          relevance: "Direct node lookup",
        }),
      ],
      data: { nodes: [node], edges },
    }),
    category: "graph",
  };
}

export function getNodeNeighbors(nodeId: string): GraphInsight {
  const graph = getGraph();
  const node = graph.nodes.find((n) => n.id === nodeId);

  if (!node) {
    return {
      ...createInsight({
        id: `graph-neighbors-${nodeId}-not-found`,
        title: `Neighbors Not Found: ${nodeId}`,
        description: `No node found with ID "${nodeId}"`,
        confidence: 1,
        evidence: [],
        data: { nodes: [], edges: [], center: nodeId },
      }),
      category: "graph",
    };
  }

  const edges = graph.edges.filter(
    (e) => e.source === nodeId || e.target === nodeId,
  );

  const neighborIds = new Set<string>();
  for (const edge of edges) {
    if (edge.source === nodeId) neighborIds.add(edge.target);
    if (edge.target === nodeId) neighborIds.add(edge.source);
  }

  const neighbors = graph.nodes.filter((n) => neighborIds.has(n.id));

  return {
    ...createInsight({
      id: `graph-neighbors-${nodeId}`,
      title: `Neighbors of: ${node.title}`,
      description: `${neighbors.length} nodes connected to "${node.title}"`,
      confidence: 1,
      evidence: [
        createEvidence({
          sourceId: nodeId,
          sourceType: node.type as "document" | "entity" | "mission",
          relevance: "Center node",
        }),
      ],
      data: { nodes: [node, ...neighbors], edges, center: nodeId },
    }),
    category: "graph",
  };
}

// ── Path Finding (BFS) ───────────────────────────────────

export function findPath(
  startId: string,
  endId: string,
  maxDepth: number = 5,
): GraphInsight {
  const graph = getGraph();
  const startNode = graph.nodes.find((n) => n.id === startId);
  const endNode = graph.nodes.find((n) => n.id === endId);

  if (!startNode || !endNode) {
    return {
      ...createInsight({
        id: `graph-path-${startId}-to-${endId}-not-found`,
        title: "Path Not Found",
        description: `Could not find path from "${startId}" to "${endId}"`,
        confidence: 1,
        evidence: [],
        data: { nodes: [], edges: [] },
      }),
      category: "graph",
    };
  }

  // BFS
  const visited = new Set<string>();
  const queue: { nodeId: string; path: string[] }[] = [
    { nodeId: startId, path: [startId] },
  ];

  while (queue.length > 0) {
    const { nodeId, path } = queue.shift()!;

    if (nodeId === endId) {
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
        ...createInsight({
          id: `graph-path-${startId}-to-${endId}`,
          title: `Path: ${startNode.title} → ${endNode.title}`,
          description: `Found path of length ${path.length - 1}`,
          confidence: 1,
          evidence: [
            createEvidence({
              sourceId: startId,
              sourceType: startNode.type as "document" | "entity" | "mission",
              relevance: "Path start",
            }),
            createEvidence({
              sourceId: endId,
              sourceType: endNode.type as "document" | "entity" | "mission",
              relevance: "Path end",
            }),
          ],
          data: {
            nodes: pathNodes,
            edges: pathEdges,
            path: { nodes: path, edges: pathEdges.map((e) => `${e.source}->${e.target}`), length: path.length - 1 },
          },
        }),
        category: "graph",
      };
    }

    if (path.length > maxDepth) continue;
    if (visited.has(nodeId)) continue;

    visited.add(nodeId);

    const neighbors = graph.edges
      .filter((e) => e.source === nodeId || e.target === nodeId)
      .map((e) => (e.source === nodeId ? e.target : e.source));

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push({ nodeId: neighbor, path: [...path, neighbor] });
      }
    }
  }

  return {
    ...createInsight({
      id: `graph-path-${startId}-to-${endId}-no-path`,
      title: "No Path Found",
      description: `No path exists between "${startId}" and "${endId}" within depth ${maxDepth}`,
      confidence: 0.8,
      evidence: [],
      data: { nodes: [], edges: [] },
    }),
    category: "graph",
  };
}

// ── Graph Statistics ──────────────────────────────────────

export function getGraphStatistics(): GraphInsight {
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
    ...createInsight({
      id: `graph-stats-${Date.now()}`,
      title: "Knowledge Graph Statistics",
      description: `${graph.nodes.length} nodes, ${graph.edges.length} edges`,
      confidence: 1,
      evidence: [],
      data: {
        nodes: [],
        edges: [],
        // Include stats in the insight data
        ...{
          totalNodes: graph.nodes.length,
          totalEdges: graph.edges.length,
          averageConnections: Math.round(averageConnections * 100) / 100,
          nodesByType,
          edgesByType,
        },
      },
    }),
    category: "graph",
  };
}

// ── Connected Components ──────────────────────────────────

export function getConnectedComponents(): GraphInsight {
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

  return {
    ...createInsight({
      id: `graph-components-${Date.now()}`,
      title: "Connected Components",
      description: `Graph has ${components.length} connected components`,
      confidence: 1,
      evidence: [],
      data: {
        nodes: graph.nodes,
        edges: graph.edges,
        components,
      },
    }),
    category: "graph",
  };
}
