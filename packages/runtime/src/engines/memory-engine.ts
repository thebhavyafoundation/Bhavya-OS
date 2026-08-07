/**
 * Memory Engine
 *
 * Stores and retrieves institutional knowledge, decisions, patterns,
 * and learnings. Provides semantic search, context retrieval, and
 * memory consolidation for the Bhavya OS AI system.
 *
 * @version 1.0
 * @license MIT
 */

// ─── Types ────────────────────────────────────────────────────────────────────

import type {
  MemoryPriority,
  MemoryStatus,
  MemoryRelation,
  MemoryQuery,
  MemorySearchResult,
  MemoryStats,
} from "@bhavya/shared";

export type {
  MemoryPriority,
  MemoryStatus,
  MemoryRelation,
  MemoryQuery,
  MemorySearchResult,
  MemoryStats,
};

/** Runtime MemoryType — subset for engine-specific use */
export type MemoryType =
  | "decision"
  | "learning"
  | "pattern"
  | "anti-pattern"
  | "insight"
  | "fact"
  | "procedure"
  | "incident"
  | "conversation"
  | "context";

/** Runtime Memory — extends shared with execution state */
export interface Memory {
  id: string;
  type: MemoryType;
  priority: MemoryPriority;
  status: MemoryStatus;
  content: string;
  summary: string;
  tags: string[];
  embeddings?: number[];
  metadata: Record<string, unknown>;
  relations: MemoryRelation[];
  accessCount: number;
  lastAccessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

// ─── Engine ───────────────────────────────────────────────────────────────────

export class MemoryEngine {
  private memories: Map<string, Memory> = new Map();
  private index: Map<string, Set<string>> = new Map(); // tag -> memory ids
  private typeIndex: Map<MemoryType, Set<string>> = new Map();
  private priorityIndex: Map<MemoryPriority, Set<string>> = new Map();

  constructor() {
    this.initializeIndexes();
  }

  // ─── Core Operations ──────────────────────────────────────────────────────

  /**
   * Store a new memory
   */
  async store(
    memory: Omit<
      Memory,
      "id" | "createdAt" | "updatedAt" | "accessCount" | "lastAccessedAt"
    >,
  ): Promise<Memory> {
    const id = this.generateId();
    const now = new Date();

    const newMemory: Memory = {
      ...memory,
      id,
      createdAt: now,
      updatedAt: now,
      accessCount: 0,
      lastAccessedAt: now,
    };

    this.memories.set(id, newMemory);
    this.updateIndexes(newMemory);

    return newMemory;
  }

  /**
   * Retrieve a memory by ID
   */
  async retrieve(id: string): Promise<Memory | null> {
    const memory = this.memories.get(id);
    if (!memory) return null;

    memory.accessCount++;
    memory.lastAccessedAt = new Date();

    return memory;
  }

  /**
   * Update an existing memory
   */
  async update(
    id: string,
    updates: Partial<Omit<Memory, "id" | "createdAt">>,
  ): Promise<Memory | null> {
    const memory = this.memories.get(id);
    if (!memory) return null;

    const updatedMemory: Memory = {
      ...memory,
      ...updates,
      updatedAt: new Date(),
    };

    this.memories.set(id, updatedMemory);
    this.rebuildIndexes();

    return updatedMemory;
  }

  /**
   * Delete a memory
   */
  async delete(id: string): Promise<boolean> {
    const existed = this.memories.delete(id);
    if (existed) {
      this.rebuildIndexes();
    }
    return existed;
  }

  /**
   * Search memories by query
   */
  async search(query: MemoryQuery): Promise<MemorySearchResult[]> {
    let results: Memory[] = Array.from(this.memories.values());

    // Filter by type
    if (query.types && query.types.length > 0) {
      results = results.filter((m) => query.types!.includes(m.type));
    }

    // Filter by tags
    if (query.tags && query.tags.length > 0) {
      results = results.filter((m) =>
        query.tags!.some((tag) => m.tags.includes(tag)),
      );
    }

    // Filter by priority
    if (query.priority) {
      results = results.filter((m) => m.priority === query.priority);
    }

    // Filter by status
    if (query.status) {
      results = results.filter((m) => m.status === query.status);
    }

    // Filter by date range
    if (query.dateRange) {
      results = results.filter(
        (m) =>
          m.createdAt >= query.dateRange!.start &&
          m.createdAt <= query.dateRange!.end,
      );
    }

    // Text search (simple contains for now, would use embeddings in production)
    if (query.text) {
      const searchText = query.text.toLowerCase();
      results = results.filter(
        (m) =>
          m.content.toLowerCase().includes(searchText) ||
          m.summary.toLowerCase().includes(searchText) ||
          m.tags.some((t) => t.toLowerCase().includes(searchText)),
      );
    }

    // Score results
    const scoredResults: MemorySearchResult[] = results.map((memory) => ({
      memory,
      score: this.calculateRelevanceScore(memory, query),
      explanation: this.generateExplanation(memory, query),
    }));

    // Filter by minimum relevance
    if (query.minRelevance) {
      const filtered = scoredResults.filter(
        (r) => r.score >= query.minRelevance!,
      );
      return filtered.slice(0, query.limit || 10);
    }

    // Sort by score descending
    scoredResults.sort((a, b) => b.score - a.score);

    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || 10;
    return scoredResults.slice(offset, offset + limit);
  }

  /**
   * Get related memories
   */
  async getRelated(
    memoryId: string,
    maxDepth: number = 2,
  ): Promise<MemorySearchResult[]> {
    const memory = this.memories.get(memoryId);
    if (!memory) return [];

    const visited = new Set<string>();
    const results: MemorySearchResult[] = [];

    const traverse = (currentId: string, depth: number) => {
      if (depth > maxDepth || visited.has(currentId)) return;
      visited.add(currentId);

      const current = this.memories.get(currentId);
      if (!current) return;

      for (const relation of current.relations) {
        if (!visited.has(relation.targetId)) {
          const target = this.memories.get(relation.targetId);
          if (target) {
            results.push({
              memory: target,
              score: relation.strength,
              explanation: `Related via ${relation.type}`,
            });
            traverse(relation.targetId, depth + 1);
          }
        }
      }
    };

    traverse(memoryId, 0);
    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Consolidate similar memories
   */
  async consolidate(): Promise<{ merged: number; removed: number }> {
    const duplicates = this.findDuplicates();
    let merged = 0;
    let removed = 0;

    for (const group of duplicates) {
      // Keep the oldest, merge others into it
      const primary = group[0];
      for (let i = 1; i < group.length; i++) {
        const secondary = group[i];
        await this.mergeMemories(primary.id, secondary.id);
        await this.delete(secondary.id);
        removed++;
      }
      merged++;
    }

    return { merged, removed };
  }

  // ─── Statistics ───────────────────────────────────────────────────────────

  /**
   * Get memory statistics
   */
  async getStats(): Promise<MemoryStats> {
    const memories = Array.from(this.memories.values());

    const byType = {} as Record<MemoryType, number>;
    const byPriority = {} as Record<MemoryPriority, number>;
    const byStatus = {} as Record<MemoryStatus, number>;

    for (const type of Object.values("decision" as MemoryType)) {
      byType[type] = 0;
    }
    for (const priority of Object.values("critical" as MemoryPriority)) {
      byPriority[priority] = 0;
    }
    for (const status of Object.values("active" as MemoryStatus)) {
      byStatus[status] = 0;
    }

    let totalAccessCount = 0;
    let oldestDate = new Date();
    let newestDate = new Date(0);

    for (const memory of memories) {
      byType[memory.type]++;
      byPriority[memory.priority]++;
      byStatus[memory.status]++;
      totalAccessCount += memory.accessCount;
      if (memory.createdAt < oldestDate) oldestDate = memory.createdAt;
      if (memory.createdAt > newestDate) newestDate = memory.createdAt;
    }

    return {
      totalMemories: memories.length,
      byType,
      byPriority,
      byStatus,
      avgAccessCount:
        memories.length > 0 ? totalAccessCount / memories.length : 0,
      oldestMemory: oldestDate,
      newestMemory: newestDate,
    };
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private generateId(): string {
    return `mem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private initializeIndexes(): void {
    // Initialize type index
    for (const type of [
      "decision",
      "learning",
      "pattern",
      "anti-pattern",
      "insight",
      "fact",
      "procedure",
      "incident",
      "conversation",
      "context",
    ] as MemoryType[]) {
      this.typeIndex.set(type, new Set());
    }

    // Initialize priority index
    for (const priority of [
      "critical",
      "high",
      "medium",
      "low",
    ] as MemoryPriority[]) {
      this.priorityIndex.set(priority, new Set());
    }
  }

  private updateIndexes(memory: Memory): void {
    // Update tag index
    for (const tag of memory.tags) {
      if (!this.index.has(tag)) {
        this.index.set(tag, new Set());
      }
      this.index.get(tag)!.add(memory.id);
    }

    // Update type index
    const typeSet = this.typeIndex.get(memory.type);
    if (typeSet) {
      typeSet.add(memory.id);
    }

    // Update priority index
    const prioritySet = this.priorityIndex.get(memory.priority);
    if (prioritySet) {
      prioritySet.add(memory.id);
    }
  }

  private rebuildIndexes(): void {
    this.index.clear();
    this.initializeIndexes();

    for (const memory of this.memories.values()) {
      this.updateIndexes(memory);
    }
  }

  private calculateRelevanceScore(memory: Memory, query: MemoryQuery): number {
    let score = 0;

    // Priority weight
    const priorityWeights: Record<MemoryPriority, number> = {
      critical: 1.0,
      high: 0.8,
      medium: 0.6,
      low: 0.4,
    };
    score += priorityWeights[memory.priority] * 0.3;

    // Recency weight (newer is better)
    const ageInDays =
      (Date.now() - memory.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 1 - ageInDays / 365);
    score += recencyScore * 0.2;

    // Access frequency weight
    const accessScore = Math.min(1, memory.accessCount / 100);
    score += accessScore * 0.2;

    // Tag match weight
    if (query.tags && query.tags.length > 0) {
      const tagMatchCount = query.tags.filter((t) =>
        memory.tags.includes(t),
      ).length;
      const tagScore = tagMatchCount / query.tags.length;
      score += tagScore * 0.3;
    }

    return Math.min(1, score);
  }

  private generateExplanation(memory: Memory, query: MemoryQuery): string {
    const reasons: string[] = [];

    if (query.types && query.types.includes(memory.type)) {
      reasons.push(`matches type ${memory.type}`);
    }
    if (query.tags) {
      const matchedTags = query.tags.filter((t) => memory.tags.includes(t));
      if (matchedTags.length > 0) {
        reasons.push(`has tags: ${matchedTags.join(", ")}`);
      }
    }
    if (memory.priority === "critical" || memory.priority === "high") {
      reasons.push(`high priority (${memory.priority})`);
    }
    if (memory.accessCount > 10) {
      reasons.push(`frequently accessed (${memory.accessCount} times)`);
    }

    return reasons.length > 0 ? reasons.join("; ") : "matched query criteria";
  }

  private findDuplicates(): Memory[][] {
    const groups: Map<string, Memory[]> = new Map();

    for (const memory of this.memories.values()) {
      const key = `${memory.type}:${memory.summary.toLowerCase().trim()}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(memory);
    }

    return Array.from(groups.values()).filter((group) => group.length > 1);
  }

  private async mergeMemories(
    primaryId: string,
    secondaryId: string,
  ): Promise<void> {
    const primary = this.memories.get(primaryId);
    const secondary = this.memories.get(secondaryId);
    if (!primary || !secondary) return;

    // Merge tags
    const mergedTags = [...new Set([...primary.tags, ...secondary.tags])];

    // Merge relations
    const mergedRelations = [
      ...primary.relations,
      ...secondary.relations.filter((r) => r.targetId !== primaryId),
    ];

    // Update primary
    await this.update(primaryId, {
      tags: mergedTags,
      relations: mergedRelations,
      content: `${primary.content}\n\n---\n\nMerged from ${secondaryId}:\n${secondary.content}`,
      metadata: {
        ...primary.metadata,
        mergedFrom: secondaryId,
        mergedAt: new Date().toISOString(),
      },
    });
  }
}

export default MemoryEngine;
