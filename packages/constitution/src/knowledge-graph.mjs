/**
 * Constitution Knowledge Graph — Maps relationships between constitutional elements
 * 
 * Builds a graph of relationships between documents, articles, definitions,
 * policies, principles, and responsibilities across all constitutional documents.
 */

import { DOCUMENTS, getDocument, getDependencies, getDependents } from './registry.mjs';
import { parseDocument } from './parser.mjs';

// Knowledge graph storage
let knowledgeGraph = null;

/**
 * Build the knowledge graph from all documents
 * @param {Array} documents - Loaded documents with content
 * @returns {Object} Knowledge graph
 */
export function buildKnowledgeGraph(documents) {
  const graph = {
    nodes: new Map(),    // id -> {type, data, relationships}
    edges: [],           // [{source, target, type, weight, metadata}]
    clusters: new Map(), // category -> [nodeIds]
    builtAt: new Date().toISOString()
  };

  // Add document nodes
  for (const doc of documents) {
    addDocumentNode(graph, doc);
  }

  // Add dependency edges
  for (const doc of documents) {
    addDependencyEdges(graph, doc);
  }

  // Add article nodes and edges
  for (const doc of documents) {
    if (doc.parsed) {
      addArticleNodes(graph, doc);
    }
  }

  // Add definition nodes and links
  for (const doc of documents) {
    if (doc.parsed) {
      addDefinitionNodes(graph, doc);
    }
  }

  // Add policy nodes and links
  for (const doc of documents) {
    if (doc.parsed) {
      addPolicyNodes(graph, doc);
    }
  }

  // Add cross-reference edges
  for (const doc of documents) {
    if (doc.parsed) {
      addCrossReferenceEdges(graph, doc);
    }
  }

  // Build clusters
  buildClusters(graph);

  knowledgeGraph = graph;
  return graph;
}

/**
 * Add a document node to the graph
 */
function addDocumentNode(graph, doc) {
  const nodeId = `doc:${doc.id}`;
  graph.nodes.set(nodeId, {
    id: nodeId,
    type: 'document',
    data: {
      id: doc.id,
      number: doc.number,
      title: doc.title,
      category: doc.category,
      authority: doc.authority,
      authorityLevel: doc.authorityLevel,
      tags: doc.tags || [],
      wordCount: doc.wordCount || 0
    },
    relationships: []
  });
}

/**
 * Add dependency edges between documents
 */
function addDependencyEdges(graph, doc) {
  const sourceId = `doc:${doc.id}`;
  
  for (const depId of (doc.dependencies || [])) {
    const targetId = `doc:${depId}`;
    if (graph.nodes.has(targetId)) {
      graph.edges.push({
        source: sourceId,
        target: targetId,
        type: 'depends_on',
        weight: 0.8,
        metadata: { document: doc.id, dependency: depId }
      });
    }
  }

  // Add reverse edges for dependents
  for (const dep of getDependents(doc.id)) {
    const targetId = `doc:${dep.id}`;
    if (graph.nodes.has(targetId)) {
      graph.edges.push({
        source: sourceId,
        target: targetId,
        type: 'required_by',
        weight: 0.6,
        metadata: { document: doc.id, requiredBy: dep.id }
      });
    }
  }
}

/**
 * Add article nodes and edges
 */
function addArticleNodes(graph, doc) {
  for (const article of (doc.parsed?.articles || [])) {
    const nodeId = `article:${doc.id}:${article.number}`;
    graph.nodes.set(nodeId, {
      id: nodeId,
      type: 'article',
      data: {
        number: article.number,
        title: article.title,
        documentId: doc.id,
        documentTitle: doc.title
      },
      relationships: []
    });

    // Link to parent document
    graph.edges.push({
      source: `doc:${doc.id}`,
      target: nodeId,
      type: 'contains',
      weight: 1.0,
      metadata: { document: doc.id, article: article.number }
    });
  }
}

/**
 * Add definition nodes and links
 */
function addDefinitionNodes(graph, doc) {
  for (const def of (doc.parsed?.definitions || [])) {
    const nodeId = `def:${doc.id}:${slugify(def.term)}`;
    graph.nodes.set(nodeId, {
      id: nodeId,
      type: 'definition',
      data: {
        term: def.term,
        definition: def.definition,
        documentId: doc.id,
        documentTitle: doc.title
      },
      relationships: []
    });

    // Link to parent document
    graph.edges.push({
      source: `doc:${doc.id}`,
      target: nodeId,
      type: 'defines',
      weight: 0.9,
      metadata: { document: doc.id, term: def.term }
    });
  }
}

/**
 * Add policy nodes and links
 */
function addPolicyNodes(graph, doc) {
  for (const policy of (doc.parsed?.policies || [])) {
    const nodeId = `policy:${doc.id}:${slugify(policy.statement.slice(0, 50))}`;
    graph.nodes.set(nodeId, {
      id: nodeId,
      type: 'policy',
      data: {
        statement: policy.statement,
        keyword: policy.keyword,
        confidence: policy.confidence,
        documentId: doc.id,
        documentTitle: doc.title
      },
      relationships: []
    });

    // Link to parent document
    graph.edges.push({
      source: `doc:${doc.id}`,
      target: nodeId,
      type: 'establishes',
      weight: 0.7,
      metadata: { document: doc.id }
    });
  }
}

/**
 * Add cross-reference edges based on content analysis
 */
function addCrossReferenceEdges(graph, doc) {
  const content = doc.content || '';
  
  // Look for references to other documents
  for (const otherDoc of DOCUMENTS) {
    if (otherDoc.id === doc.id) continue;
    
    const references = [
      otherDoc.title,
      otherDoc.number,
      ...otherDoc.tags
    ];

    for (const ref of references) {
      if (content.toLowerCase().includes(ref.toLowerCase())) {
        const sourceId = `doc:${doc.id}`;
        const targetId = `doc:${otherDoc.id}`;
        
        // Avoid duplicate edges
        const edgeExists = graph.edges.some(e => 
          e.source === sourceId && e.target === targetId && e.type === 'references'
        );
        
        if (!edgeExists) {
          graph.edges.push({
            source: sourceId,
            target: targetId,
            type: 'references',
            weight: 0.3,
            metadata: { 
              document: doc.id, 
              references: otherDoc.id,
              referenceType: 'content_mention'
            }
          });
        }
      }
    }
  }
}

/**
 * Build clusters by category
 */
function buildClusters(graph) {
  for (const [nodeId, node] of graph.nodes) {
    if (node.type === 'document') {
      const category = node.data.category;
      if (!graph.clusters.has(category)) {
        graph.clusters.set(category, []);
      }
      graph.clusters.get(category).push(nodeId);
    }
  }
}

/**
 * Create a slug from text
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
}

/**
 * Query the knowledge graph
 * @param {string} nodeId - Node to start from
 * @param {Object} options - Query options
 * @returns {Object} Subgraph around the node
 */
export function queryGraph(nodeId, options = {}) {
  if (!knowledgeGraph) {
    throw new Error('Knowledge graph not built. Call buildKnowledgeGraph() first.');
  }

  const {
    depth = 1,
    edgeTypes = null,
    minWeight = 0
  } = options;

  const visited = new Set();
  const result = {
    nodes: new Map(),
    edges: []
  };

  function traverse(currentId, currentDepth) {
    if (currentDepth > depth || visited.has(currentId)) return;
    visited.add(currentId);

    const node = knowledgeGraph.nodes.get(currentId);
    if (!node) return;

    result.nodes.set(currentId, node);

    // Find connected edges
    for (const edge of knowledgeGraph.edges) {
      if (edge.source === currentId || edge.target === currentId) {
        if (edgeTypes && !edgeTypes.includes(edge.type)) continue;
        if (edge.weight < minWeight) continue;

        result.edges.push(edge);

        const nextId = edge.source === currentId ? edge.target : edge.source;
        traverse(nextId, currentDepth + 1);
      }
    }
  }

  traverse(nodeId, 0);
  return result;
}

/**
 * Find shortest path between two nodes
 */
export function findPath(sourceId, targetId, maxDepth = 5) {
  if (!knowledgeGraph) {
    throw new Error('Knowledge graph not built.');
  }

  const queue = [[sourceId]];
  const visited = new Set([sourceId]);

  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];

    if (current === targetId) {
      return path.map(id => ({
        id,
        node: knowledgeGraph.nodes.get(id)
      }));
    }

    if (path.length > maxDepth) continue;

    for (const edge of knowledgeGraph.edges) {
      let next = null;
      if (edge.source === current) next = edge.target;
      if (edge.target === current) next = edge.source;

      if (next && !visited.has(next)) {
        visited.add(next);
        queue.push([...path, next]);
      }
    }
  }

  return null; // No path found
}

/**
 * Get graph statistics
 */
export function getGraphStats() {
  if (!knowledgeGraph) return null;

  const nodeTypes = {};
  const edgeTypes = {};

  for (const node of knowledgeGraph.nodes.values()) {
    nodeTypes[node.type] = (nodeTypes[node.type] || 0) + 1;
  }

  for (const edge of knowledgeGraph.edges) {
    edgeTypes[edge.type] = (edgeTypes[edge.type] || 0) + 1;
  }

  return {
    totalNodes: knowledgeGraph.nodes.size,
    totalEdges: knowledgeGraph.edges.length,
    nodeTypes,
    edgeTypes,
    clusters: Object.fromEntries(
      Array.from(knowledgeGraph.clusters.entries()).map(([k, v]) => [k, v.length])
    ),
    builtAt: knowledgeGraph.builtAt
  };
}

export default {
  buildKnowledgeGraph,
  queryGraph,
  findPath,
  getGraphStats
};
