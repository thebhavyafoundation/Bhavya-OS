// Memory Engine
// Unified interface for institutional memory
// Initially backed by files; later swap to SQLite/Qdrant without changing API

import type { MemoryEntry, MemoryType } from "@bhavya/kernel";
import { existsSync, readdirSync, readFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_MEMORY_DIR = fileURLToPath(new URL("../memory", import.meta.url));

export interface MemoryEngineConfig {
  root?: string;
  backend?: "file" | "sqlite" | "qdrant";
}

export class MemoryEngine {
  private config: MemoryEngineConfig;
  private store = new Map<string, MemoryEntry>();
  private memoryDir: string;

  constructor(config: MemoryEngineConfig = {}) {
    this.config = config;
    this.memoryDir = config.root ? resolve(config.root) : DEFAULT_MEMORY_DIR;
  }

  async initialize(): Promise<void> {
    if (!existsSync(this.memoryDir)) {
      mkdirSync(this.memoryDir, { recursive: true });
    }
    await this.loadAll();
  }

  private async loadAll(): Promise<void> {
    const files = readdirSync(this.memoryDir).filter(
      (f) => f.endsWith(".md") || f.endsWith(".json"),
    );
    for (const file of files) {
      const content = readFileSync(resolve(this.memoryDir, file), "utf-8");
      const entry: MemoryEntry = {
        id: `memory:${file}`,
        type: this.inferType(file),
        content,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.store.set(entry.id, entry);
    }
  }

  private inferType(filename: string): MemoryType {
    if (filename.includes("project")) return "project";
    if (filename.includes("people") || filename.includes("person"))
      return "person";
    if (filename.includes("knowledge")) return "knowledge";
    if (filename.includes("architecture")) return "architecture";
    if (filename.includes("history")) return "history";
    if (filename.includes("bug")) return "bug";
    if (filename.includes("lesson")) return "lesson";
    return "knowledge";
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

  async set(
    entry: Omit<MemoryEntry, "id" | "createdAt" | "updatedAt">,
  ): Promise<MemoryEntry> {
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
