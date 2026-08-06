/**
 * Repository Memory
 * Bhavya OS v7.0 — Universal Autonomous Engineering System
 * 
 * Every repository receives:
 * - Knowledge Graph
 * - Architecture Memory
 * - Decision History
 * - Engineering Notes
 * - Task History
 * - Release History
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface RepositoryMemory {
  id: string;
  repositoryId: string;
  knowledgeGraph: KnowledgeGraph;
  architectureMemory: ArchitectureMemory;
  decisionHistory: Decision[];
  engineeringNotes: Note[];
  taskHistory: Task[];
  releaseHistory: Release[];
  lastUpdated: string;
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

export interface KnowledgeNode {
  id: string;
  type: 'concept' | 'component' | 'pattern' | 'decision' | 'issue';
  name: string;
  description: string;
  metadata: Record<string, any>;
}

export interface KnowledgeEdge {
  source: string;
  target: string;
  type: 'depends-on' | 'implements' | 'uses' | 'related-to' | 'caused-by';
  weight: number;
}

export interface ArchitectureMemory {
  current: ArchitectureSnapshot;
  history: ArchitectureSnapshot[];
}

export interface ArchitectureSnapshot {
  timestamp: string;
  pattern: string;
  components: string[];
  dependencies: string[];
  score: number;
}

export interface Decision {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  context: string;
  alternatives: string[];
  rationale: string;
  consequences: string[];
  status: 'proposed' | 'accepted' | 'deprecated' | 'superseded';
}

export interface Note {
  id: string;
  timestamp: string;
  category: 'architecture' | 'bug' | 'performance' | 'security' | 'refactor' | 'feature';
  title: string;
  content: string;
  tags: string[];
  author: string;
}

export interface Task {
  id: string;
  timestamp: string;
  type: 'feature' | 'bugfix' | 'refactor' | 'documentation' | 'test';
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  assignee?: string;
  completedAt?: string;
}

export interface Release {
  id: string;
  timestamp: string;
  version: string;
  changes: string[];
  breakingChanges: string[];
  deprecations: string[];
  contributors: string[];
}

export class RepositoryMemorySystem {
  private memories: Map<string, RepositoryMemory> = new Map();
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadMemories();
  }

  private loadMemories(): void {
    const memoriesFile = join(this.dataDir, 'repository-memories.json');
    if (existsSync(memoriesFile)) {
      const data = JSON.parse(readFileSync(memoriesFile, 'utf-8'));
      for (const [id, memory] of Object.entries(data)) {
        this.memories.set(id, memory as RepositoryMemory);
      }
    }
  }

  private saveMemories(): void {
    const data: Record<string, RepositoryMemory> = {};
    for (const [id, memory] of this.memories) {
      data[id] = memory;
    }
    writeFileSync(join(this.dataDir, 'repository-memories.json'), JSON.stringify(data, null, 2));
  }

  /**
   * Initialize repository memory
   */
  initializeMemory(repositoryId: string): RepositoryMemory {
    const memory: RepositoryMemory = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      repositoryId,
      knowledgeGraph: { nodes: [], edges: [] },
      architectureMemory: { current: { timestamp: new Date().toISOString(), pattern: 'unknown', components: [], dependencies: [], score: 0 }, history: [] },
      decisionHistory: [],
      engineeringNotes: [],
      taskHistory: [],
      releaseHistory: [],
      lastUpdated: new Date().toISOString()
    };

    this.memories.set(memory.id, memory);
    this.saveMemories();
    return memory;
  }

  /**
   * Get repository memory
   */
  getMemory(repositoryId: string): RepositoryMemory | undefined {
    return Array.from(this.memories.values()).find(m => m.repositoryId === repositoryId);
  }

  /**
   * Add knowledge node
   */
  addKnowledgeNode(memoryId: string, node: Omit<KnowledgeNode, 'id'>): void {
    const memory = this.memories.get(memoryId);
    if (memory) {
      memory.knowledgeGraph.nodes.push({
        id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...node
      });
      memory.lastUpdated = new Date().toISOString();
      this.saveMemories();
    }
  }

  /**
   * Add knowledge edge
   */
  addKnowledgeEdge(memoryId: string, edge: Omit<KnowledgeEdge, 'weight'>): void {
    const memory = this.memories.get(memoryId);
    if (memory) {
      memory.knowledgeGraph.edges.push({
        ...edge,
        weight: 1
      });
      memory.lastUpdated = new Date().toISOString();
      this.saveMemories();
    }
  }

  /**
   * Add decision
   */
  addDecision(memoryId: string, decision: Omit<Decision, 'id' | 'timestamp'>): void {
    const memory = this.memories.get(memoryId);
    if (memory) {
      memory.decisionHistory.push({
        id: `dec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ...decision
      });
      memory.lastUpdated = new Date().toISOString();
      this.saveMemories();
    }
  }

  /**
   * Add engineering note
   */
  addNote(memoryId: string, note: Omit<Note, 'id' | 'timestamp'>): void {
    const memory = this.memories.get(memoryId);
    if (memory) {
      memory.engineeringNotes.push({
        id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ...note
      });
      memory.lastUpdated = new Date().toISOString();
      this.saveMemories();
    }
  }

  /**
   * Add task
   */
  addTask(memoryId: string, task: Omit<Task, 'id' | 'timestamp'>): void {
    const memory = this.memories.get(memoryId);
    if (memory) {
      memory.taskHistory.push({
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ...task
      });
      memory.lastUpdated = new Date().toISOString();
      this.saveMemories();
    }
  }

  /**
   * Add release
   */
  addRelease(memoryId: string, release: Omit<Release, 'id' | 'timestamp'>): void {
    const memory = this.memories.get(memoryId);
    if (memory) {
      memory.releaseHistory.push({
        id: `rel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ...release
      });
      memory.lastUpdated = new Date().toISOString();
      this.saveMemories();
    }
  }

  /**
   * Update architecture memory
   */
  updateArchitecture(memoryId: string, snapshot: Omit<ArchitectureSnapshot, 'timestamp'>): void {
    const memory = this.memories.get(memoryId);
    if (memory) {
      memory.architectureMemory.history.push(memory.architectureMemory.current);
      memory.architectureMemory.current = {
        timestamp: new Date().toISOString(),
        ...snapshot
      };
      memory.lastUpdated = new Date().toISOString();
      this.saveMemories();
    }
  }

  /**
   * Get all memories
   */
  getAllMemories(): RepositoryMemory[] {
    return Array.from(this.memories.values());
  }

  /**
   * Get summary
   */
  getSummary(): {
    totalMemories: number;
    totalKnowledgeNodes: number;
    totalDecisions: number;
    totalNotes: number;
    totalTasks: number;
    totalReleases: number;
  } {
    const memories = Array.from(this.memories.values());
    return {
      totalMemories: memories.length,
      totalKnowledgeNodes: memories.reduce((sum, m) => sum + m.knowledgeGraph.nodes.length, 0),
      totalDecisions: memories.reduce((sum, m) => sum + m.decisionHistory.length, 0),
      totalNotes: memories.reduce((sum, m) => sum + m.engineeringNotes.length, 0),
      totalTasks: memories.reduce((sum, m) => sum + m.taskHistory.length, 0),
      totalReleases: memories.reduce((sum, m) => sum + m.releaseHistory.length, 0)
    };
  }
}

// Singleton instance
let instance: RepositoryMemorySystem | null = null;

export function getRepositoryMemorySystem(dataDir: string): RepositoryMemorySystem {
  if (!instance) {
    instance = new RepositoryMemorySystem(dataDir);
  }
  return instance;
}
