/**
 * Knowledge Graph
 *
 * Graph database for relationships between concepts, entities,
 * and knowledge in Bhavya OS.
 *
 * @version 1.0
 * @license MIT
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type NodeType =
  | "concept"
  | "entity"
  | "document"
  | "decision"
  | "person"
  | "organization"
  | "event"
  | "metric";

export type EdgeType =
  | "depends_on"
  | "related_to"
  | "causes"
  | "part_of"
  | "derived_from"
  | "supersedes"
  | "implements"
  | "governs";

export interface GraphNode {
  id: string;
  type: NodeType;
  name: string;
  description: string;
  properties: Record<string, unknown>;
  embeddings?: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  weight: number;
  properties: Record<string, unknown>;
  createdAt: Date;
}

export interface GraphPath {
  nodes: GraphNode[];
  edges: GraphEdge[];
  totalWeight: number;
}

export interface GraphQuery {
  nodeTypes?: NodeType[];
  edgeTypes?: EdgeType[];
  startNode?: string;
  maxDepth?: number;
  minWeight?: number;
  limit?: number;
}

export interface GraphMetrics {
  totalNodes: number;
  totalEdges: number;
  nodesByType: Record<NodeType, number>;
  edgesByType: Record<EdgeType, number>;
  avgDegree: number;
  density: number;
  connectedComponents: number;
}

export interface Community {
  id: string;
  nodes: string[];
  density: number;
  centrality: Record<string, number>;
}

// ─── Engine ───────────────────────────────────────────────────────────────────

export class KnowledgeGraph {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: Map<string, GraphEdge> = new Map();
  private adjacencyList: Map<string, Set<string>> = new Map();
  private reverseAdjacencyList: Map<string, Set<string>> = new Map();

  /**
   * Add a node
   */
  async addNode(
    node: Omit<GraphNode, "id" | "createdAt" | "updatedAt">,
  ): Promise<GraphNode> {
    const id = this.generateId();
    const now = new Date();

    const newNode: GraphNode = {
      ...node,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.nodes.set(id, newNode);
    this.adjacencyList.set(id, new Set());
    this.reverseAdjacencyList.set(id, new Set());

    return newNode;
  }

  /**
   * Get a node by ID
   */
  async getNode(id: string): Promise<GraphNode | null> {
    return this.nodes.get(id) || null;
  }

  /**
   * Update a node
   */
  async updateNode(
    id: string,
    updates: Partial<Omit<GraphNode, "id" | "createdAt">>,
  ): Promise<GraphNode | null> {
    const node = this.nodes.get(id);
    if (!node) return null;

    const updatedNode: GraphNode = {
      ...node,
      ...updates,
      updatedAt: new Date(),
    };

    this.nodes.set(id, updatedNode);
    return updatedNode;
  }

  /**
   * Delete a node
   */
  async deleteNode(id: string): Promise<boolean> {
    const node = this.nodes.get(id);
    if (!node) return false;

    // Remove all edges connected to this node
    const outgoingEdges = this.adjacencyList.get(id) || new Set();
    const incomingEdges = this.reverseAdjacencyList.get(id) || new Set();

    for (const edgeId of outgoingEdges) {
      this.edges.delete(edgeId);
    }

    for (const edgeId of incomingEdges) {
      this.edges.delete(edgeId);
    }

    // Remove from adjacency lists
    this.adjacencyList.delete(id);
    this.reverseAdjacencyList.delete(id);

    // Remove node
    this.nodes.delete(id);

    return true;
  }

  /**
   * Add an edge
   */
  async addEdge(edge: Omit<GraphEdge, "id" | "createdAt">): Promise<GraphEdge> {
    // Validate nodes exist
    if (!this.nodes.has(edge.source) || !this.nodes.has(edge.target)) {
      throw new Error("Source or target node does not exist");
    }

    const id = this.generateId();

    const newEdge: GraphEdge = {
      ...edge,
      id,
      createdAt: new Date(),
    };

    this.edges.set(id, newEdge);

    // Update adjacency lists
    this.adjacencyList.get(edge.source)!.add(id);
    this.reverseAdjacencyList.get(edge.target)!.add(id);

    return newEdge;
  }

  /**
   * Get an edge by ID
   */
  async getEdge(id: string): Promise<GraphEdge | null> {
    return this.edges.get(id) || null;
  }

  /**
   * Delete an edge
   */
  async deleteEdge(id: string): Promise<boolean> {
    const edge = this.edges.get(id);
    if (!edge) return false;

    this.adjacencyList.get(edge.source)?.delete(id);
    this.reverseAdjacencyList.get(edge.target)?.delete(id);
    this.edges.delete(id);

    return true;
  }

  /**
   * Get neighbors of a node
   */
  async getNeighbors(
    nodeId: string,
    direction: "outgoing" | "incoming" | "both" = "both",
  ): Promise<GraphNode[]> {
    const neighbors = new Set<string>();

    if (direction === "outgoing" || direction === "both") {
      const outgoingEdges = this.adjacencyList.get(nodeId) || new Set();
      for (const edgeId of outgoingEdges) {
        const edge = this.edges.get(edgeId);
        if (edge) neighbors.add(edge.target);
      }
    }

    if (direction === "incoming" || direction === "both") {
      const incomingEdges = this.reverseAdjacencyList.get(nodeId) || new Set();
      for (const edgeId of incomingEdges) {
        const edge = this.edges.get(edgeId);
        if (edge) neighbors.add(edge.source);
      }
    }

    return Array.from(neighbors)
      .map((id) => this.nodes.get(id))
      .filter((node): node is GraphNode => node !== undefined);
  }

  /**
   * Find shortest path between two nodes
   */
  async findPath(
    sourceId: string,
    targetId: string,
    maxDepth: number = 10,
  ): Promise<GraphPath | null> {
    if (!this.nodes.has(sourceId) || !this.nodes.has(targetId)) {
      return null;
    }

    const visited = new Map<
      string,
      { node: string; edge: string | null; distance: number }
    >();
    const queue: { nodeId: string; edgeId: string | null; distance: number }[] =
      [];

    queue.push({ nodeId: sourceId, edgeId: null, distance: 0 });
    visited.set(sourceId, { node: sourceId, edge: null, distance: 0 });

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.nodeId === targetId) {
        // Reconstruct path
        const pathNodes: GraphNode[] = [];
        const pathEdges: GraphEdge[] = [];
        let totalWeight = 0;

        let currentId: string | null = targetId;
        while (currentId) {
          const node = this.nodes.get(currentId);
          if (node) pathNodes.unshift(node);

          const info = visited.get(currentId);
          if (info?.edge) {
            const edge = this.edges.get(info.edge);
            if (edge) {
              pathEdges.unshift(edge);
              totalWeight += edge.weight;
            }
          }

          currentId = info?.node !== currentId ? info?.node || null : null;
        }

        return {
          nodes: pathNodes,
          edges: pathEdges,
          totalWeight,
        };
      }

      if (current.distance >= maxDepth) continue;

      // Get neighbors
      const outgoingEdges = this.adjacencyList.get(current.nodeId) || new Set();
      for (const edgeId of outgoingEdges) {
        const edge = this.edges.get(edgeId);
        if (edge && !visited.has(edge.target)) {
          visited.set(edge.target, {
            node: current.nodeId,
            edge: edgeId,
            distance: current.distance + 1,
          });
          queue.push({
            nodeId: edge.target,
            edgeId,
            distance: current.distance + 1,
          });
        }
      }
    }

    return null;
  }

  /**
   * Find nodes by type
   */
  async findByType(type: NodeType, limit: number = 100): Promise<GraphNode[]> {
    return Array.from(this.nodes.values())
      .filter((node) => node.type === type)
      .slice(0, limit);
  }

  /**
   * Find nodes by property
   */
  async findByProperty(
    key: string,
    value: unknown,
    limit: number = 100,
  ): Promise<GraphNode[]> {
    return Array.from(this.nodes.values())
      .filter((node) => node.properties[key] === value)
      .slice(0, limit);
  }

  /**
   * Search nodes by name
   */
  async search(query: string, limit: number = 10): Promise<GraphNode[]> {
    const lowerQuery = query.toLowerCase();

    return Array.from(this.nodes.values())
      .filter(
        (node) =>
          node.name.toLowerCase().includes(lowerQuery) ||
          node.description.toLowerCase().includes(lowerQuery),
      )
      .slice(0, limit);
  }

  /**
   * Get subgraph around a node
   */
  async getSubgraph(
    nodeId: string,
    depth: number = 2,
  ): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
    const visitedNodes = new Set<string>();
    const visitedEdges = new Set<string>();

    const traverse = (currentId: string, currentDepth: number) => {
      if (currentDepth > depth || visitedNodes.has(currentId)) return;

      visitedNodes.add(currentId);

      // Outgoing edges
      const outgoingEdges = this.adjacencyList.get(currentId) || new Set();
      for (const edgeId of outgoingEdges) {
        const edge = this.edges.get(edgeId);
        if (edge) {
          visitedEdges.add(edgeId);
          traverse(edge.target, currentDepth + 1);
        }
      }

      // Incoming edges
      const incomingEdges =
        this.reverseAdjacencyList.get(currentId) || new Set();
      for (const edgeId of incomingEdges) {
        const edge = this.edges.get(edgeId);
        if (edge) {
          visitedEdges.add(edgeId);
          traverse(edge.source, currentDepth + 1);
        }
      }
    };

    traverse(nodeId, 0);

    return {
      nodes: Array.from(visitedNodes)
        .map((id) => this.nodes.get(id))
        .filter((node): node is GraphNode => node !== undefined),
      edges: Array.from(visitedEdges)
        .map((id) => this.edges.get(id))
        .filter((edge): edge is GraphEdge => edge !== undefined),
    };
  }

  /**
   * Detect communities (simple connected components)
   */
  async detectCommunities(): Promise<Community[]> {
    const visited = new Set<string>();
    const communities: Community[] = [];

    for (const nodeId of this.nodes.keys()) {
      if (visited.has(nodeId)) continue;

      const communityNodes: string[] = [];
      const queue = [nodeId];

      while (queue.length > 0) {
        const current = queue.shift()!;
        if (visited.has(current)) continue;

        visited.add(current);
        communityNodes.push(current);

        // Add neighbors
        const outgoingEdges = this.adjacencyList.get(current) || new Set();
        for (const edgeId of outgoingEdges) {
          const edge = this.edges.get(edgeId);
          if (edge && !visited.has(edge.target)) {
            queue.push(edge.target);
          }
        }

        const incomingEdges =
          this.reverseAdjacencyList.get(current) || new Set();
        for (const edgeId of incomingEdges) {
          const edge = this.edges.get(edgeId);
          if (edge && !visited.has(edge.source)) {
            queue.push(edge.source);
          }
        }
      }

      // Calculate density
      const possibleEdges =
        (communityNodes.length * (communityNodes.length - 1)) / 2;
      const actualEdges = Array.from(this.edges.values()).filter(
        (e) =>
          communityNodes.includes(e.source) &&
          communityNodes.includes(e.target),
      ).length;

      communities.push({
        id: this.generateId(),
        nodes: communityNodes,
        density: possibleEdges > 0 ? actualEdges / possibleEdges : 0,
        centrality: this.calculateCentrality(communityNodes),
      });
    }

    return communities;
  }

  /**
   * Get graph metrics
   */
  async getMetrics(): Promise<GraphMetrics> {
    const nodesArray = Array.from(this.nodes.values());
    const edgesArray = Array.from(this.edges.values());

    const nodesByType: Record<NodeType, number> = {
      concept: 0,
      entity: 0,
      document: 0,
      decision: 0,
      person: 0,
      organization: 0,
      event: 0,
      metric: 0,
    };

    const edgesByType: Record<EdgeType, number> = {
      depends_on: 0,
      related_to: 0,
      causes: 0,
      part_of: 0,
      derived_from: 0,
      supersedes: 0,
      implements: 0,
      governs: 0,
    };

    for (const node of nodesArray) {
      nodesByType[node.type]++;
    }

    for (const edge of edgesArray) {
      edgesByType[edge.type]++;
    }

    // Calculate average degree
    let totalDegree = 0;
    for (const adjacency of this.adjacencyList.values()) {
      totalDegree += adjacency.size;
    }
    const avgDegree =
      nodesArray.length > 0 ? totalDegree / nodesArray.length : 0;

    // Calculate density
    const possibleEdges = (nodesArray.length * (nodesArray.length - 1)) / 2;
    const density = possibleEdges > 0 ? edgesArray.length / possibleEdges : 0;

    // Count connected components
    const communities = await this.detectCommunities();

    return {
      totalNodes: nodesArray.length,
      totalEdges: edgesArray.length,
      nodesByType,
      edgesByType,
      avgDegree,
      density,
      connectedComponents: communities.length,
    };
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private generateId(): string {
    return `kg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private calculateCentrality(nodeIds: string[]): Record<string, number> {
    const centrality: Record<string, number> = {};

    for (const nodeId of nodeIds) {
      const outgoingEdges = this.adjacencyList.get(nodeId)?.size || 0;
      const incomingEdges = this.reverseAdjacencyList.get(nodeId)?.size || 0;
      centrality[nodeId] = outgoingEdges + incomingEdges;
    }

    // Normalize
    const maxCentrality = Math.max(...Object.values(centrality), 1);
    for (const nodeId of nodeIds) {
      centrality[nodeId] /= maxCentrality;
    }

    return centrality;
  }
}

export default KnowledgeGraph;
