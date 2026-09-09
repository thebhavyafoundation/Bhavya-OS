// ─── Knowledge Graph Builder ────────────────────────────────────────────────
// Constructs knowledge graph relationships from analyzed repositories.
// Runs after the intelligence pipeline stores results.

import { getDb } from "./db";

interface GraphNode {
  id: string;
  node_type: string;
  label: string;
  metadata: Record<string, unknown>;
}

interface GraphEdge {
  id: string;
  source_id: string;
  target_id: string;
  relationship: string;
  weight: number;
}

/**
 * Build the knowledge graph from all stored repository data.
 * Creates nodes and edges for repositories, technologies, patterns, and skills.
 */
export function buildKnowledgeGraphFromData(): {
  nodesCreated: number;
  edgesCreated: number;
  nodeTypes: Record<string, number>;
  edgeTypes: Record<string, number>;
} {
  const db = getDb();
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // 1. Repository nodes
  const repos = db.prepare("SELECT * FROM repositories").all() as Array<{
    id: string;
    name: string;
    language: string;
    tech_stack: string;
    patterns: string;
    bhavya_score: number;
  }>;

  for (const repo of repos) {
    nodes.push({
      id: `repo-${repo.id}`,
      node_type: "repository",
      label: repo.name,
      metadata: { bhavya_score: repo.bhavya_score },
    });

    // 2. Technology nodes from language
    if (repo.language) {
      const techId = `tech-${repo.language.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
      const existing = nodes.find((n) => n.id === techId);
      if (!existing) {
        nodes.push({
          id: techId,
          node_type: "technology",
          label: repo.language,
          metadata: { category: "language" },
        });
      }
      edges.push({
        id: `edge-${repo.id}-uses-${repo.language.toLowerCase()}`,
        source_id: `repo-${repo.id}`,
        target_id: techId,
        relationship: "uses",
        weight: 1,
      });
    }

    // 3. Pattern nodes
    try {
      const patterns = JSON.parse(repo.patterns || "[]") as string[];
      for (const patternName of patterns) {
        const patId = `pattern-${patternName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
        const existing = nodes.find((n) => n.id === patId);
        if (!existing) {
          nodes.push({
            id: patId,
            node_type: "pattern",
            label: patternName,
            metadata: {},
          });
        }
        edges.push({
          id: `edge-${repo.id}-implements-${patId}`,
          source_id: `repo-${repo.id}`,
          target_id: patId,
          relationship: "implements",
          weight: 1,
        });
      }
    } catch {
      // Skip malformed JSON
    }

    // 4. Technology stack nodes
    try {
      const techStack = JSON.parse(repo.tech_stack || "{}") as Record<
        string,
        string
      >;
      for (const [key, value] of Object.entries(techStack)) {
        if (value && typeof value === "string") {
          const techId = `tech-${value.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
          const existing = nodes.find((n) => n.id === techId);
          if (!existing) {
            nodes.push({
              id: techId,
              node_type: "technology",
              label: value,
              metadata: { category: key },
            });
          }
          edges.push({
            id: `edge-${repo.id}-uses-${techId}`,
            source_id: `repo-${repo.id}`,
            target_id: techId,
            relationship: "uses",
            weight: 1,
          });
        }
      }
    } catch {
      // Skip malformed JSON
    }
  }

  // 5. Knowledge package nodes
  const kps = db.prepare("SELECT * FROM knowledge_packages").all() as Array<{
    id: string;
    repository_id: string;
    category: string;
    title: string;
  }>;

  for (const kp of kps) {
    nodes.push({
      id: `kp-${kp.id}`,
      node_type: "knowledge_package",
      label: kp.title,
      metadata: { category: kp.category },
    });

    if (kp.repository_id) {
      edges.push({
        id: `edge-${kp.id}-derived-from-${kp.repository_id}`,
        source_id: `kp-${kp.id}`,
        target_id: `repo-${kp.repository_id}`,
        relationship: "derived_from",
        weight: 1,
      });
    }
  }

  // 6. Recommendation nodes
  const recs = db.prepare("SELECT * FROM recommendations").all() as Array<{
    id: string;
    type: string;
    title: string;
  }>;

  for (const rec of recs) {
    nodes.push({
      id: `rec-${rec.id}`,
      node_type: "recommendation",
      label: rec.title,
      metadata: { type: rec.type },
    });
  }

  // 7. Technology radar nodes
  const radar = db.prepare("SELECT * FROM technology_radar").all() as Array<{
    id: string;
    name: string;
    category: string;
    ring: string;
  }>;

  for (const entry of radar) {
    const radarId = `radar-${entry.id}`;
    nodes.push({
      id: radarId,
      node_type: "technology",
      label: entry.name,
      metadata: { category: entry.category, ring: entry.ring },
    });

    // Link radar entries to repositories that use them
    for (const repo of repos) {
      const techStackStr = (repo.tech_stack || "").toLowerCase();
      if (techStackStr.includes(entry.name.toLowerCase())) {
        edges.push({
          id: `edge-${repo.id}-uses-radar-${entry.id}`,
          source_id: `repo-${repo.id}`,
          target_id: radarId,
          relationship: "uses",
          weight: 2,
        });
      }
    }
  }

  // 8. Engineering pattern nodes (from engineering_patterns table)
  const engPatterns = db
    .prepare("SELECT * FROM engineering_patterns")
    .all() as Array<{
    id: string;
    repository_id: string;
    pattern_name: string;
    confidence: number;
  }>;

  for (const pat of engPatterns) {
    const patId = `engpat-${pat.id}`;
    nodes.push({
      id: patId,
      node_type: "pattern",
      label: pat.pattern_name,
      metadata: { confidence: pat.confidence },
    });

    if (pat.repository_id) {
      edges.push({
        id: `edge-${pat.id}-found-in-${pat.repository_id}`,
        source_id: patId,
        target_id: `repo-${pat.repository_id}`,
        relationship: "extracted_from",
        weight: pat.confidence / 100,
      });
    }
  }

  // Deduplicate nodes and edges
  const uniqueNodes = new Map<string, GraphNode>();
  for (const node of nodes) {
    if (!uniqueNodes.has(node.id)) {
      uniqueNodes.set(node.id, node);
    }
  }

  const uniqueEdges = new Map<string, GraphEdge>();
  for (const edge of edges) {
    if (!uniqueEdges.has(edge.id)) {
      uniqueEdges.set(edge.id, edge);
    }
  }

  // Count types
  const nodeTypes: Record<string, number> = {};
  for (const node of uniqueNodes.values()) {
    nodeTypes[node.node_type] = (nodeTypes[node.node_type] || 0) + 1;
  }

  const edgeTypes: Record<string, number> = {};
  for (const edge of uniqueEdges.values()) {
    edgeTypes[edge.relationship] = (edgeTypes[edge.relationship] || 0) + 1;
  }

  return {
    nodesCreated: uniqueNodes.size,
    edgesCreated: uniqueEdges.size,
    nodeTypes,
    edgeTypes,
  };
}

/**
 * Get the knowledge graph with filtering
 */
export function getKnowledgeGraph(
  options: {
    nodeType?: string;
    relationship?: string;
    limit?: number;
  } = {},
): {
  nodes: Array<{
    id: string;
    node_type: string;
    label: string;
    metadata: string;
  }>;
  edges: Array<{
    id: string;
    source_id: string;
    target_id: string;
    relationship: string;
    weight: number;
  }>;
  stats: {
    totalNodes: number;
    totalEdges: number;
    nodeTypes: Record<string, number>;
    edgeTypes: Record<string, number>;
  };
} {
  const db = getDb();
  const { nodeType, relationship, limit = 200 } = options;

  let nodesQuery = "SELECT * FROM knowledge_graph_nodes";
  const nodeParams: string[] = [];
  if (nodeType) {
    nodesQuery += " WHERE node_type = ?";
    nodeParams.push(nodeType);
  }
  nodesQuery += ` ORDER BY label LIMIT ${limit}`;

  const nodes = db.prepare(nodesQuery).all(...nodeParams) as Array<{
    id: string;
    node_type: string;
    label: string;
    metadata: string;
  }>;

  let edgesQuery = "SELECT * FROM knowledge_graph_edges";
  const edgeParams: string[] = [];
  if (relationship) {
    edgesQuery += " WHERE relationship = ?";
    edgeParams.push(relationship);
  }
  edgesQuery += ` ORDER BY relationship LIMIT ${limit * 2}`;

  const edges = db.prepare(edgesQuery).all(...edgeParams) as Array<{
    id: string;
    source_id: string;
    target_id: string;
    relationship: string;
    weight: number;
  }>;

  // Stats
  const nodeTypeCounts = db
    .prepare(
      "SELECT node_type, COUNT(*) as count FROM knowledge_graph_nodes GROUP BY node_type",
    )
    .all() as Array<{ node_type: string; count: number }>;
  const nodeTypes: Record<string, number> = {};
  for (const row of nodeTypeCounts) nodeTypes[row.node_type] = row.count;

  const edgeTypeCounts = db
    .prepare(
      "SELECT relationship, COUNT(*) as count FROM knowledge_graph_edges GROUP BY relationship",
    )
    .all() as Array<{ relationship: string; count: number }>;
  const edgeTypes: Record<string, number> = {};
  for (const row of edgeTypeCounts) edgeTypes[row.relationship] = row.count;

  const totalNodes = db
    .prepare("SELECT COUNT(*) as count FROM knowledge_graph_nodes")
    .get() as { count: number };
  const totalEdges = db
    .prepare("SELECT COUNT(*) as count FROM knowledge_graph_edges")
    .get() as { count: number };

  return {
    nodes,
    edges,
    stats: {
      totalNodes: totalNodes.count,
      totalEdges: totalEdges.count,
      nodeTypes,
      edgeTypes,
    },
  };
}
