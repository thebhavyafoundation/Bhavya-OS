// Bhavya Kernel — Memory Module
// Unified memory interface.

import type { MemoryEntry, MemoryType } from '../types/index.js';
import { resolve } from 'node:path';
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';

export interface MemoryConfig {
  root: string;
}

export class MemoryEngine {
  private config: MemoryConfig;
  private store = new Map<string, MemoryEntry>();
  private memoryDir: string;

  constructor(config: MemoryConfig) {
    this.config = config;
    this.memoryDir = resolve(config.root, '.memory');
  }

  async initialize(): Promise<void> {
    if (!existsSync(this.memoryDir)) {
      mkdirSync(this.memoryDir, { recursive: true });
    }
    await this.loadAll();
  }

  private async loadAll(): Promise<void> {
    const files = readdirSync(this.memoryDir).filter((f) => f.endsWith('.md') || f.endsWith('.json'));
    for (const file of files) {
      const content = readFileSync(resolve(this.memoryDir, file), 'utf-8');
      const entry: MemoryEntry = {
        id: `memory:${file}`,
        type: this.inferType(file),
        priority: 'medium',
        status: 'active',
        content,
        summary: '',
        tags: [],
        metadata: {},
        relations: [],
        accessCount: 0,
        lastAccessedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.store.set(entry.id, entry);
    }
  }

  private inferType(filename: string): MemoryType {
    if (filename.includes('project')) return 'project';
    if (filename.includes('people') || filename.includes('person')) return 'person';
    if (filename.includes('knowledge')) return 'knowledge';
    if (filename.includes('architecture')) return 'architecture';
    if (filename.includes('history')) return 'history';
    if (filename.includes('bug')) return 'bug';
    if (filename.includes('lesson')) return 'lesson';
    return 'knowledge';
  }

  async get(id: string): Promise<MemoryEntry | undefined> {
    return this.store.get(id);
  }

  async getByType(type: MemoryType): Promise<MemoryEntry[]> {
    return Array.from(this.store.values()).filter((e) => e.type === type);
  }

  async getAll(): Promise<MemoryEntry[]> {
    return Array.from(this.store.values());
  }

  async set(entry: Omit<MemoryEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<MemoryEntry> {
    const id = `memory:${crypto.randomUUID()}`;
    const full: MemoryEntry = {
      ...entry,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.store.set(id, full);
    return full;
  }

  async update(id: string, updates: Partial<MemoryEntry>): Promise<MemoryEntry | undefined> {
    const existing = this.store.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.store.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }

  async search(query: string): Promise<MemoryEntry[]> {
    const lower = query.toLowerCase();
    return Array.from(this.store.values()).filter(
      (e) =>
        e.content.toLowerCase().includes(lower) ||
        e.tags.some((t) => t.toLowerCase().includes(lower)),
    );
  }

  async shutdown(): Promise<void> {
    this.store.clear();
  }
}
