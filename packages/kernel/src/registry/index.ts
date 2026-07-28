// Bhavya Kernel — Registry Module
// Auto-discovery of resources.

import type { RegistryEntry, RegistryType } from '../types/index.js';
import { resolve } from 'node:path';
import { existsSync, readdirSync, statSync } from 'node:fs';

export interface RegistryConfig {
  root: string;
}

export class Registry {
  private config: RegistryConfig;
  private entries = new Map<string, RegistryEntry[]>();

  constructor(config: RegistryConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    await this.discoverAll();
  }

  private async discoverAll(): Promise<void> {
    const types: RegistryType[] = [
      'agent', 'workflow', 'event', 'memory',
      'command', 'prompt', 'template', 'schema', 'policy',
    ];

    for (const type of types) {
      await this.discover(type);
    }
  }

  async discover(type: RegistryType): Promise<RegistryEntry[]> {
    const dirMap: Record<RegistryType, string[]> = {
      agent: ['.agents'],
      workflow: ['.workflows'],
      event: ['.events'],
      memory: ['.memory'],
      command: ['.commands'],
      prompt: ['.prompts'],
      template: ['.templates'],
      schema: ['.schemas'],
      policy: ['.policies'],
    };

    const dirs = dirMap[type] ?? [];
    const entries: RegistryEntry[] = [];

    for (const dir of dirs) {
      const fullPath = resolve(this.config.root, dir);
      if (!existsSync(fullPath)) continue;

      const files = readdirSync(fullPath);
      for (const file of files) {
        const filePath = resolve(fullPath, file);
        const stat = statSync(filePath);
        if (!stat.isFile()) continue;

        entries.push({
          id: `${type}:${file}`,
          type,
          name: file.replace(/\.[^.]+$/, ''),
          path: `${dir}/${file}`,
          metadata: {},
          discoveredAt: new Date(),
        });
      }
    }

    this.entries.set(type, entries);
    return entries;
  }

  get(type: RegistryType): RegistryEntry[] {
    return this.entries.get(type) ?? [];
  }

  getById(id: string): RegistryEntry | undefined {
    for (const entries of this.entries.values()) {
      const found = entries.find((e) => e.id === id);
      if (found) return found;
    }
    return undefined;
  }

  getAll(): RegistryEntry[] {
    return Array.from(this.entries.values()).flat();
  }

  async shutdown(): Promise<void> {
    this.entries.clear();
  }
}
