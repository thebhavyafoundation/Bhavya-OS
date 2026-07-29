// Website Content Service
// Solves: Create, update, publish website content
// Exercises: Planner, workflow, content, search

import { resolve } from 'node:path';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import type { InstitutionService } from './index.js';
import type { ExecutionContext, Artifact } from '../types/index.js';

export interface WebsiteContentInput {
  action: 'create' | 'update' | 'delete';
  type: 'page' | 'blog' | 'mission';
  name: string;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export class WebsiteContentService implements InstitutionService {
  name = 'website-content';
  description = 'Create, update, publish website content';
  capabilities = ['create-page', 'update-page', 'delete-page', 'generate-content', 'search-content'];
  private root: string;

  constructor(root: string) {
    this.root = root;
  }

  async initialize(): Promise<void> {
    // Service ready
  }

  async execute(input: WebsiteContentInput): Promise<{ artifacts: Artifact[]; success: boolean }> {
    const artifacts: Artifact[] = [];

    switch (input.action) {
      case 'create':
        return this.create(input, artifacts);
      case 'update':
        return this.update(input, artifacts);
      case 'delete':
        return this.delete(input, artifacts);
    }
  }

  private async create(input: WebsiteContentInput, artifacts: Artifact[]): Promise<{ artifacts: Artifact[]; success: boolean }> {
    const dir = resolve(this.root, `apps/website/src/app/${input.name}`);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const content = this.generateContent(input);
    writeFileSync(resolve(dir, 'page.tsx'), content);
    artifacts.push({ path: `apps/website/src/app/${input.name}/page.tsx`, action: 'created', content, metadata: {} });

    return { artifacts, success: true };
  }

  private async update(input: WebsiteContentInput, artifacts: Artifact[]): Promise<{ artifacts: Artifact[]; success: boolean }> {
    const path = resolve(this.root, `apps/website/src/app/${input.name}/page.tsx`);
    if (!existsSync(path)) return { artifacts, success: false };

    const content = this.generateContent(input);
    writeFileSync(path, content);
    artifacts.push({ path: `apps/website/src/app/${input.name}/page.tsx`, action: 'updated', content, metadata: {} });

    return { artifacts, success: true };
  }

  private async delete(input: WebsiteContentInput, artifacts: Artifact[]): Promise<{ artifacts: Artifact[]; success: boolean }> {
    // Mark for deletion (actual deletion happens in workflow)
    artifacts.push({ path: `apps/website/src/app/${input.name}`, action: 'deleted', metadata: {} });
    return { artifacts, success: true };
  }

  private generateContent(input: WebsiteContentInput): string {
    return `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${input.title} | Bhavya Foundation',
  description: '${input.content.slice(0, 160)}',
};

export default function ${input.name.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Page() {
  return (
    <main className="min-h-screen bg-cream-white">
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h1 className="text-4xl md:text-6xl font-bold text-charcoal-black mb-6">
          ${input.title}
        </h1>
        <div className="prose prose-lg max-w-3xl">
          ${input.content}
        </div>
      </section>
    </main>
  );
}
`;
  }

  async shutdown(): Promise<void> {
    // Nothing to clean up
  }
}
