/**
 * Knowledge Intelligence
 * Bhavya Ecosystem v1.0
 * 
 * Connects every document through:
 * - Relationships
 * - References
 * - Citations
 * - Versions
 * - Related content
 * 
 * Generates recommendations
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'ecosystem', 'knowledge-intelligence', 'data');

interface KnowledgeNode {
  id: string;
  title: string;
  type: 'article' | 'document' | 'research' | 'policy' | 'guide' | 'tutorial';
  content: string;
  tags: string[];
  relationships: Relationship[];
  citations: Citation[];
  versions: Version[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
  };
}

interface Relationship {
  id: string;
  type: 'related' | 'prerequisite' | 'follow-up' | 'references' | 'cites';
  targetId: string;
  targetTitle: string;
  strength: number;
}

interface Citation {
  id: string;
  sourceId: string;
  sourceTitle: string;
  context: string;
  date: string;
}

interface Version {
  id: string;
  version: number;
  content: string;
  changes: string;
  date: string;
  author: string;
}

interface Recommendation {
  id: string;
  sourceId: string;
  targetId: string;
  targetTitle: string;
  reason: string;
  score: number;
}

export class KnowledgeIntelligence {
  private nodes: KnowledgeNode[] = [];
  private dataDir: string;

  constructor() {
    this.dataDir = DATA_DIR;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadNodes();
  }

  private loadNodes(): void {
    const nodesFile = join(this.dataDir, 'nodes.json');
    if (existsSync(nodesFile)) {
      this.nodes = JSON.parse(readFileSync(nodesFile, 'utf-8'));
    }
  }

  private saveNodes(): void {
    writeFileSync(
      join(this.dataDir, 'nodes.json'),
      JSON.stringify(this.nodes, null, 2)
    );
  }

  /**
   * Add knowledge node
   */
  addNode(node: Omit<KnowledgeNode, 'id' | 'relationships' | 'citations' | 'versions' | 'metadata'>): KnowledgeNode {
    const newNode: KnowledgeNode = {
      id: `know-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...node,
      relationships: [],
      citations: [],
      versions: [{ id: `ver-1`, version: 1, content: node.content, changes: 'Initial version', date: new Date().toISOString(), author: 'system' }],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    this.nodes.push(newNode);
    this.saveNodes();
    return newNode;
  }

  /**
   * Get node
   */
  getNode(id: string): KnowledgeNode | undefined {
    return this.nodes.find(n => n.id === id);
  }

  /**
   * Get all nodes
   */
  getAllNodes(): KnowledgeNode[] {
    return this.nodes;
  }

  /**
   * Add relationship
   */
  addRelationship(sourceId: string, relationship: Omit<Relationship, 'id'>): void {
    const source = this.getNode(sourceId);
    if (source) {
      source.relationships.push({
        id: `rel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...relationship
      });
      source.metadata.updatedAt = new Date().toISOString();
      this.saveNodes();
    }
  }

  /**
   * Add citation
   */
  addCitation(sourceId: string, citation: Omit<Citation, 'id'>): void {
    const source = this.getNode(sourceId);
    if (source) {
      source.citations.push({
        id: `cite-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...citation
      });
      source.metadata.updatedAt = new Date().toISOString();
      this.saveNodes();
    }
  }

  /**
   * Add version
   */
  addVersion(nodeId: string, version: Omit<Version, 'id'>): void {
    const node = this.getNode(nodeId);
    if (node) {
      node.versions.push({
        id: `ver-${node.versions.length + 1}`,
        ...version
      });
      node.content = version.content;
      node.metadata.updatedAt = new Date().toISOString();
      this.saveNodes();
    }
  }

  /**
   * Get related content
   */
  getRelatedContent(nodeId: string): KnowledgeNode[] {
    const node = this.getNode(nodeId);
    if (!node) return [];

    const relatedIds = node.relationships.map(r => r.targetId);
    return this.nodes.filter(n => relatedIds.includes(n.id));
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(nodeId: string): Recommendation[] {
    const node = this.getNode(nodeId);
    if (!node) return [];

    const recommendations: Recommendation[] = [];
    const nodeTags = new Set(node.tags);

    for (const otherNode of this.nodes) {
      if (otherNode.id === nodeId) continue;

      const otherTags = new Set(otherNode.tags);
      const commonTags = [...nodeTags].filter(t => otherTags.has(t));

      if (commonTags.length > 0) {
        recommendations.push({
          id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          sourceId: nodeId,
          targetId: otherNode.id,
          targetTitle: otherNode.title,
          reason: `Shares ${commonTags.length} tags: ${commonTags.join(', ')}`,
          score: commonTags.length
        });
      }
    }

    return recommendations.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  /**
   * Search knowledge
   */
  search(query: string): KnowledgeNode[] {
    const lowerQuery = query.toLowerCase();
    return this.nodes.filter(n => {
      return (
        n.title.toLowerCase().includes(lowerQuery) ||
        n.content.toLowerCase().includes(lowerQuery) ||
        n.tags.some(t => t.toLowerCase().includes(lowerQuery))
      );
    });
  }

  /**
   * Get knowledge summary
   */
  getSummary(): {
    totalNodes: number;
    byType: Record<string, number>;
    totalRelationships: number;
    totalCitations: number;
  } {
    const byType: Record<string, number> = {};
    for (const node of this.nodes) {
      byType[node.type] = (byType[node.type] || 0) + 1;
    }

    return {
      totalNodes: this.nodes.length,
      byType,
      totalRelationships: this.nodes.reduce((sum, n) => sum + n.relationships.length, 0),
      totalCitations: this.nodes.reduce((sum, n) => sum + n.citations.length, 0)
    };
  }
}

// Singleton instance
let instance: KnowledgeIntelligence | null = null;

export function getKnowledgeIntelligence(): KnowledgeIntelligence {
  if (!instance) {
    instance = new KnowledgeIntelligence();
  }
  return instance;
}
