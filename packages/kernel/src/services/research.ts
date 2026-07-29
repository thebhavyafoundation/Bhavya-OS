// Research Service
// Solves: Ingest, index, search research content
// Exercises: Knowledge engine, search, memory

import { resolve } from 'node:path';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import type { InstitutionService } from './index.js';
import type { Artifact } from '../types/index.js';

export interface ResearchInput {
  action: 'ingest' | 'index' | 'search' | 'summarize';
  title: string;
  content: string;
  topic: string;
  source?: string;
  query?: string;
}

export class ResearchService implements InstitutionService {
  name = 'research';
  description = 'Ingest, index, search research content';
  capabilities = ['ingest-research', 'index-content', 'search-research', 'summarize-research'];
  private root: string;
  private index = new Map<string, any>();

  constructor(root: string) {
    this.root = root;
  }

  async initialize(): Promise<void> {
    // Load existing research
    const researchDir = resolve(this.root, 'docs/research');
    if (existsSync(researchDir)) {
      const files = require('node:fs').readdirSync(researchDir).filter((f: string) => f.endsWith('.md'));
      for (const file of files) {
        const content = readFileSync(resolve(researchDir, file), 'utf-8');
        this.index.set(file, { title: file, content, topic: 'general' });
      }
    }
  }

  async execute(input: ResearchInput): Promise<{ artifacts: Artifact[]; success: boolean; results?: any }> {
    const artifacts: Artifact[] = [];

    switch (input.action) {
      case 'ingest':
        return this.ingest(input, artifacts);
      case 'index':
        return this.indexContent(input, artifacts);
      case 'search':
        return this.search(input, artifacts);
      case 'summarize':
        return this.summarize(input, artifacts);
    }
  }

  private async ingest(input: ResearchInput, artifacts: Artifact[]): Promise<{ artifacts: Artifact[]; success: boolean }> {
    const dir = resolve(this.root, 'docs/research');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const content = `# ${input.title}\n\n**Topic:** ${input.topic}\n**Source:** ${input.source ?? 'Unknown'}\n**Date:** ${new Date().toISOString()}\n\n---\n\n${input.content}`;
    const filename = input.title.toLowerCase().replace(/\s+/g, '-') + '.md';
    writeFileSync(resolve(dir, filename), content);
    artifacts.push({ path: `docs/research/${filename}`, action: 'created', content, metadata: {} });

    this.index.set(filename, { title: input.title, content: input.content, topic: input.topic });

    return { artifacts, success: true };
  }

  private async indexContent(input: ResearchInput, artifacts: Artifact[]): Promise<{ artifacts: Artifact[]; success: boolean }> {
    // Re-index all research
    const researchDir = resolve(this.root, 'docs/research');
    if (existsSync(researchDir)) {
      const files = require('node:fs').readdirSync(researchDir).filter((f: string) => f.endsWith('.md'));
      for (const file of files) {
        const content = readFileSync(resolve(researchDir, file), 'utf-8');
        this.index.set(file, { title: file, content, topic: 'general' });
      }
    }

    return { artifacts, success: true };
  }

  private async search(input: ResearchInput, artifacts: Artifact[]): Promise<{ artifacts: Artifact[]; success: boolean; results: any[] }> {
    const query = input.query?.toLowerCase() ?? '';
    const results = Array.from(this.index.values()).filter(
      (r) => r.title.toLowerCase().includes(query) || r.content.toLowerCase().includes(query),
    );

    return { artifacts, success: true, results };
  }

  private async summarize(input: ResearchInput, artifacts: Artifact[]): Promise<{ artifacts: Artifact[]; success: boolean; summary: string }> {
    // Simple extractive summary
    const sentences = input.content.split(/[.!?]+/).filter((s) => s.trim().length > 10);
    const summary = sentences.slice(0, 3).join('. ') + '.';

    return { artifacts, success: true, summary };
  }

  async shutdown(): Promise<void> {
    this.index.clear();
  }
}
