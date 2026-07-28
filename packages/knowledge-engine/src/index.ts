// Knowledge Engine
// Manages institutional knowledge graph

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface KnowledgeNode {
  id: string;
  type: string;
  content: string;
  edges: KnowledgeEdge[];
  metadata: Record<string, unknown>;
}

export interface KnowledgeEdge {
  target: string;
  relation: string;
  weight: number;
}

export interface KnowledgeEngineConfig {
  root: string;
}

export class KnowledgeEngine {
  private config: KnowledgeEngineConfig;
  private nodes = new Map<string, KnowledgeNode>();

  constructor(config: KnowledgeEngineConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    await this.loadGraph();
  }

  private async loadGraph(): Promise<void> {
    const graphPath = resolve(this.config.root, '.ai/graph/graph.json');
    if (!existsSync(graphPath)) return;

    try {
      const content = readFileSync(graphPath, 'utf-8');
      const graph = JSON.parse(content);
      if (graph.nodes) {
        for (const node of graph.nodes) {
          this.nodes.set(node.id, node);
        }
      }
    } catch {
      // Ignore parse errors
    }
  }

  async get(id: string): Promise<KnowledgeNode | undefined> {
    return this.nodes.get(id);
  }

  async getAll(): Promise<KnowledgeNode[]> {
    return Array.from(this.nodes.values());
  }

  async add(node: KnowledgeNode): Promise<void> {
    this.nodes.set(node.id, node);
  }

  async connect(sourceId: string, targetId: string, relation: string, weight = 1): Promise<void> {
    const source = this.nodes.get(sourceId);
    if (source) {
      source.edges.push({ target: targetId, relation, weight });
    }
  }

  async findRelated(nodeId: string, relation?: string): Promise<KnowledgeNode[]> {
    const node = this.nodes.get(nodeId);
    if (!node) return [];

    const edges = relation
      ? node.edges.filter((e) => e.relation === relation)
      : node.edges;

    return edges.map((e) => this.nodes.get(e.target)).filter(Boolean) as KnowledgeNode[];
  }

  async search(query: string): Promise<KnowledgeNode[]> {
    const lower = query.toLowerCase();
    return Array.from(this.nodes.values()).filter(
      (n) => n.content.toLowerCase().includes(lower),
    );
  }

  async shutdown(): Promise<void> {
    this.nodes.clear();
  }
}
