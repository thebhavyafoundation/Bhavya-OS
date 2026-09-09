// ─── Intelligence Graph Integration ─────────────────────────────────────────
// Extends the knowledge graph builder with intelligence findings,
// writes results back to knowledge_graph_nodes/edges tables.

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
 * Build intelligence finding nodes and edges from the daily intelligence tables.
 * Returns nodes and edges without writing to DB.
 */
export function buildIntelligenceGraphComponents(): {
  findingNodes: GraphNode[];
  findingEdges: GraphEdge[];
  categoryNodes: GraphNode[];
  repositoryEdges: GraphEdge[];
  crossFindingEdges: GraphEdge[];
  stats: {
    findingNodes: number;
    categoryNodes: number;
    repositoryEdges: number;
    crossFindingEdges: number;
  };
} {
  const db = getDb();
  const findingNodes: GraphNode[] = [];
  const findingEdges: GraphEdge[] = [];
  const categoryNodes: GraphNode[] = [];
  const repositoryEdges: GraphEdge[] = [];
  const crossFindingEdges: GraphEdge[] = [];

  // 1. Fetch all intelligence findings
  const findings = db
    .prepare(
      "SELECT id, finding_type, category, title, confidence_score, relevance_to_bhavya, tags, repository_id FROM intelligence_findings",
    )
    .all() as Array<{
    id: string;
    finding_type: string;
    category: string;
    title: string;
    confidence_score: number;
    relevance_to_bhavya: string;
    tags: string;
    repository_id: string | null;
  }>;

  // 2. Create finding nodes
  for (const finding of findings) {
    findingNodes.push({
      id: `finding-${finding.id}`,
      node_type: "finding",
      label: finding.title,
      metadata: {
        finding_type: finding.finding_type,
        category: finding.category,
        confidence: finding.confidence_score,
        relevance: finding.relevance_to_bhavya,
      },
    });

    // 3. Create repository edges (finding derived from repository)
    if (finding.repository_id) {
      repositoryEdges.push({
        id: `edge-finding-${finding.id}-repo-${finding.repository_id}`,
        source_id: `finding-${finding.id}`,
        target_id: `repo-${finding.repository_id}`,
        relationship: "extracted_from",
        weight: finding.confidence_score / 100,
      });
    }
  }

  // 4. Create category nodes (one per finding category)
  const categories = [
    "engineering",
    "architecture",
    "ai",
    "design",
    "education",
    "security",
    "license",
    "quality",
    "community",
  ];

  for (const cat of categories) {
    const catFindings = findings.filter((f) => f.category === cat);
    if (catFindings.length > 0) {
      categoryNodes.push({
        id: `category-${cat}`,
        node_type: "category",
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
        metadata: {
          finding_count: catFindings.length,
          avg_confidence:
            catFindings.reduce((a, f) => a + f.confidence_score, 0) /
            catFindings.length,
        },
      });

      // Connect findings to their category
      for (const finding of catFindings) {
        findingEdges.push({
          id: `edge-finding-${finding.id}-cat-${cat}`,
          source_id: `finding-${finding.id}`,
          target_id: `category-${cat}`,
          relationship: "belongs_to",
          weight: 0.8,
        });
      }
    }
  }

  // 5. Cross-finding edges: connect findings that share tags
  const tagMap = new Map<string, string[]>();
  for (const finding of findings) {
    try {
      const tags = JSON.parse(finding.tags || "[]") as string[];
      for (const tag of tags) {
        if (!tagMap.has(tag)) tagMap.set(tag, []);
        tagMap.get(tag)!.push(finding.id);
      }
    } catch {
      // Skip malformed JSON
    }
  }

  const seenPairs = new Set<string>();
  for (const [, findingIds] of tagMap) {
    if (findingIds.length < 2) continue;
    for (let i = 0; i < findingIds.length; i++) {
      for (let j = i + 1; j < findingIds.length; j++) {
        const pairKey = [findingIds[i], findingIds[j]].sort().join(":");
        if (seenPairs.has(pairKey)) continue;
        seenPairs.add(pairKey);
        crossFindingEdges.push({
          id: `edge-finding-${findingIds[i]}-related-${findingIds[j]}`,
          source_id: `finding-${findingIds[i]}`,
          target_id: `finding-${findingIds[j]}`,
          relationship: "related_to",
          weight: 0.5,
        });
      }
    }
  }

  return {
    findingNodes,
    findingEdges,
    categoryNodes,
    repositoryEdges,
    crossFindingEdges,
    stats: {
      findingNodes: findingNodes.length,
      categoryNodes: categoryNodes.length,
      repositoryEdges: repositoryEdges.length,
      crossFindingEdges: crossFindingEdges.length,
    },
  };
}

/**
 * Persist intelligence graph components to knowledge_graph_nodes/edges tables.
 * Deduplicates by id before insert.
 */
export function persistIntelligenceGraph(): {
  nodesCreated: number;
  edgesCreated: number;
  stats: {
    findingNodes: number;
    categoryNodes: number;
    repositoryEdges: number;
    crossFindingEdges: number;
  };
} {
  const db = getDb();
  const components = buildIntelligenceGraphComponents();

  // Collect all nodes and edges
  const allNodes = [...components.findingNodes, ...components.categoryNodes];
  const allEdges = [
    ...components.repositoryEdges,
    ...components.findingEdges,
    ...components.crossFindingEdges,
  ];

  // Deduplicate nodes by id
  const uniqueNodes = new Map<string, GraphNode>();
  for (const node of allNodes) {
    if (!uniqueNodes.has(node.id)) {
      uniqueNodes.set(node.id, node);
    }
  }

  // Deduplicate edges by id
  const uniqueEdges = new Map<string, GraphEdge>();
  for (const edge of allEdges) {
    if (!uniqueEdges.has(edge.id)) {
      uniqueEdges.set(edge.id, edge);
    }
  }

  let nodesCreated = 0;
  let edgesCreated = 0;

  // Insert nodes (upsert by id)
  const insertNode = db.prepare(
    `INSERT OR REPLACE INTO knowledge_graph_nodes (id, node_type, label, metadata)
     VALUES (?, ?, ?, ?)`,
  );

  for (const node of uniqueNodes.values()) {
    try {
      insertNode.run(
        node.id,
        node.node_type,
        node.label,
        JSON.stringify(node.metadata),
      );
      nodesCreated++;
    } catch {
      // Skip duplicates or errors
    }
  }

  // Insert edges (upsert by id)
  const insertEdge = db.prepare(
    `INSERT OR REPLACE INTO knowledge_graph_edges (id, source_id, target_id, relationship, weight)
     VALUES (?, ?, ?, ?, ?)`,
  );

  for (const edge of uniqueEdges.values()) {
    try {
      insertEdge.run(
        edge.id,
        edge.source_id,
        edge.target_id,
        edge.relationship,
        edge.weight,
      );
      edgesCreated++;
    } catch {
      // Skip duplicates or errors
    }
  }

  return {
    nodesCreated,
    edgesCreated,
    stats: components.stats,
  };
}

/**
 * Get intelligence graph summary for display
 */
export function getIntelligenceGraphSummary(): {
  totalFindings: number;
  totalCategories: number;
  totalRepoConnections: number;
  totalCrossConnections: number;
  topCategories: Array<{ category: string; count: number }>;
  topRepos: Array<{ repo: string; findingCount: number }>;
} {
  const db = getDb();

  const totalFindings = (
    db
      .prepare(
        "SELECT COUNT(*) as count FROM knowledge_graph_nodes WHERE node_type = 'finding'",
      )
      .get() as { count: number }
  ).count;

  const totalCategories = (
    db
      .prepare(
        "SELECT COUNT(*) as count FROM knowledge_graph_nodes WHERE node_type = 'category'",
      )
      .get() as { count: number }
  ).count;

  const totalRepoConnections = (
    db
      .prepare(
        "SELECT COUNT(*) as count FROM knowledge_graph_edges WHERE relationship = 'extracted_from'",
      )
      .get() as { count: number }
  ).count;

  const totalCrossConnections = (
    db
      .prepare(
        "SELECT COUNT(*) as count FROM knowledge_graph_edges WHERE relationship = 'related_to'",
      )
      .get() as { count: number }
  ).count;

  const topCategories = db
    .prepare(
      `SELECT label as category, 
              CAST(json_extract(metadata, '$.finding_count') AS INTEGER) as count
       FROM knowledge_graph_nodes 
       WHERE node_type = 'category' 
       ORDER BY count DESC 
       LIMIT 5`,
    )
    .all() as Array<{ category: string; count: number }>;

  const topRepos = db
    .prepare(
      `SELECT n.label as repo, COUNT(*) as findingCount
       FROM knowledge_graph_edges e
       JOIN knowledge_graph_nodes n ON e.target_id = n.id
       WHERE e.relationship = 'extracted_from' AND n.node_type = 'repository'
       GROUP BY e.target_id
       ORDER BY findingCount DESC
       LIMIT 5`,
    )
    .all() as Array<{ repo: string; findingCount: number }>;

  return {
    totalFindings,
    totalCategories,
    totalRepoConnections,
    totalCrossConnections,
    topCategories,
    topRepos,
  };
}
