/**
 * AI Assistant Layer
 * Bhavya Ecosystem v1.0
 * 
 * Every application exposes:
 * - Context
 * - Knowledge
 * - Actions
 * - Permissions
 * - Memory
 * 
 * The assistant must understand the complete Bhavya ecosystem
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'ecosystem', 'ai-assistant', 'data');

interface AssistantContext {
  appId: string;
  appName: string;
  description: string;
  capabilities: string[];
  endpoints: Endpoint[];
  knowledge: KnowledgeRef[];
  permissions: Permission[];
}

interface Endpoint {
  id: string;
  name: string;
  description: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  parameters: Parameter[];
  response: string;
}

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface KnowledgeRef {
  id: string;
  title: string;
  type: string;
  url: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  scope: 'read' | 'write' | 'admin';
}

interface MemoryEntry {
  id: string;
  appId: string;
  key: string;
  value: any;
  timestamp: string;
  ttl?: number;
}

interface AssistantResponse {
  success: boolean;
  data?: any;
  error?: string;
  suggestions?: string[];
}

export class AIAssistantLayer {
  private contexts: AssistantContext[] = [];
  private memory: MemoryEntry[] = [];
  private dataDir: string;

  constructor() {
    this.dataDir = DATA_DIR;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadData();
  }

  private loadData(): void {
    const contextsFile = join(this.dataDir, 'contexts.json');
    if (existsSync(contextsFile)) {
      this.contexts = JSON.parse(readFileSync(contextsFile, 'utf-8'));
    }

    const memoryFile = join(this.dataDir, 'memory.json');
    if (existsSync(memoryFile)) {
      this.memory = JSON.parse(readFileSync(memoryFile, 'utf-8'));
    }
  }

  private saveData(): void {
    writeFileSync(join(this.dataDir, 'contexts.json'), JSON.stringify(this.contexts, null, 2));
    writeFileSync(join(this.dataDir, 'memory.json'), JSON.stringify(this.memory, null, 2));
  }

  /**
   * Register application context
   */
  registerContext(context: AssistantContext): void {
    const existingIndex = this.contexts.findIndex(c => c.appId === context.appId);
    if (existingIndex >= 0) {
      this.contexts[existingIndex] = context;
    } else {
      this.contexts.push(context);
    }
    this.saveData();
  }

  /**
   * Get application context
   */
  getContext(appId: string): AssistantContext | undefined {
    return this.contexts.find(c => c.appId === appId);
  }

  /**
   * Get all contexts
   */
  getAllContexts(): AssistantContext[] {
    return this.contexts;
  }

  /**
   * Understand ecosystem
   */
  understandEcosystem(): {
    totalApps: number;
    totalEndpoints: number;
    totalKnowledge: number;
    totalPermissions: number;
    capabilities: string[];
  } {
    const totalEndpoints = this.contexts.reduce((sum, c) => sum + c.endpoints.length, 0);
    const totalKnowledge = this.contexts.reduce((sum, c) => sum + c.knowledge.length, 0);
    const totalPermissions = this.contexts.reduce((sum, c) => sum + c.permissions.length, 0);

    const capabilities = new Set<string>();
    for (const context of this.contexts) {
      for (const cap of context.capabilities) {
        capabilities.add(cap);
      }
    }

    return {
      totalApps: this.contexts.length,
      totalEndpoints,
      totalKnowledge,
      totalPermissions,
      capabilities: Array.from(capabilities)
    };
  }

  /**
   * Find endpoint
   */
  findEndpoint(path: string, method: string): { context: AssistantContext; endpoint: Endpoint } | undefined {
    for (const context of this.contexts) {
      const endpoint = context.endpoints.find(e => e.path === path && e.method === method);
      if (endpoint) {
        return { context, endpoint };
      }
    }
    return undefined;
  }

  /**
   * Store memory
   */
  storeMemory(appId: string, key: string, value: any, ttl?: number): void {
    const existingIndex = this.memory.findIndex(m => m.appId === appId && m.key === key);
    const entry: MemoryEntry = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      appId,
      key,
      value,
      timestamp: new Date().toISOString(),
      ttl
    };

    if (existingIndex >= 0) {
      this.memory[existingIndex] = entry;
    } else {
      this.memory.push(entry);
    }
    this.saveData();
  }

  /**
   * Retrieve memory
   */
  retrieveMemory(appId: string, key: string): any | undefined {
    const entry = this.memory.find(m => m.appId === appId && m.key === key);
    if (!entry) return undefined;

    if (entry.ttl) {
      const expiry = new Date(entry.timestamp).getTime() + entry.ttl * 1000;
      if (Date.now() > expiry) {
        this.memory = this.memory.filter(m => m.id !== entry.id);
        this.saveData();
        return undefined;
      }
    }

    return entry.value;
  }

  /**
   * Get memory by app
   */
  getMemoryByApp(appId: string): MemoryEntry[] {
    return this.memory.filter(m => m.appId === appId);
  }

  /**
   * Clear memory
   */
  clearMemory(appId?: string): void {
    if (appId) {
      this.memory = this.memory.filter(m => m.appId !== appId);
    } else {
      this.memory = [];
    }
    this.saveData();
  }

  /**
   * Get assistant summary
   */
  getSummary(): {
    totalContexts: number;
    totalMemoryEntries: number;
    ecosystem: {
      totalApps: number;
      totalEndpoints: number;
      totalKnowledge: number;
      totalPermissions: number;
    };
  } {
    return {
      totalContexts: this.contexts.length,
      totalMemoryEntries: this.memory.length,
      ecosystem: this.understandEcosystem()
    };
  }
}

// Singleton instance
let instance: AIAssistantLayer | null = null;

export function getAIAssistantLayer(): AIAssistantLayer {
  if (!instance) {
    instance = new AIAssistantLayer();
  }
  return instance;
}
