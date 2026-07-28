// Transparency Service
// Solves: Publish transparent reports, releases, financials
// Exercises: Events, memory, releases, registry

import { resolve } from 'node:path';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import type { InstitutionService } from './index.js';
import type { Artifact } from '../types/index.js';

export interface TransparencyInput {
  action: 'publish-release' | 'publish-financials' | 'publish-audit' | 'publish-governance';
  version?: string;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export class TransparencyService implements InstitutionService {
  name = 'transparency';
  description = 'Publish transparent reports, releases, financials';
  capabilities = ['publish-release', 'publish-financials', 'publish-audit', 'publish-governance'];
  private root: string;

  constructor(root: string) {
    this.root = root;
  }

  async initialize(): Promise<void> {
    // Service ready
  }

  async execute(input: TransparencyInput): Promise<{ artifacts: Artifact[]; success: boolean }> {
    const artifacts: Artifact[] = [];

    switch (input.action) {
      case 'publish-release':
        return this.publishRelease(input, artifacts);
      case 'publish-financials':
        return this.publishFinancials(input, artifacts);
      case 'publish-audit':
        return this.publishAudit(input, artifacts);
      case 'publish-governance':
        return this.publishGovernance(input, artifacts);
    }
  }

  private async publishRelease(input: TransparencyInput, artifacts: Artifact[]): Promise<{ artifacts: Artifact[]; success: boolean }> {
    const dir = resolve(this.root, 'docs/releases');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const content = `# v${input.version}\n\n**Release Date:** ${new Date().toLocaleDateString()}\n\n---\n\n${input.content}\n`;
    writeFileSync(resolve(dir, `v${input.version}.md`), content);
    artifacts.push({ path: `docs/releases/v${input.version}.md`, action: 'created', content, metadata: {} });

    return { artifacts, success: true };
  }

  private async publishFinancials(input: TransparencyInput, artifacts: Artifact[]): Promise<{ artifacts: Artifact[]; success: boolean }> {
    const dir = resolve(this.root, 'content/financials');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const content = JSON.stringify({ title: input.title, content: input.content, date: new Date().toISOString() }, null, 2);
    writeFileSync(resolve(dir, `${input.title.toLowerCase().replace(/\s+/g, '-')}.json`), content);
    artifacts.push({ path: `content/financials/${input.title.toLowerCase().replace(/\s+/g, '-')}.json`, action: 'created', content, metadata: {} });

    return { artifacts, success: true };
  }

  private async publishAudit(input: TransparencyInput, artifacts: Artifact[]): Promise<{ artifacts: Artifact[]; success: boolean }> {
    const dir = resolve(this.root, 'docs/audit');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const content = `# Audit: ${input.title}\n\n${input.content}`;
    writeFileSync(resolve(dir, `${input.title.toLowerCase().replace(/\s+/g, '-')}.md`), content);
    artifacts.push({ path: `docs/audit/${input.title.toLowerCase().replace(/\s+/g, '-')}.md`, action: 'created', content, metadata: {} });

    return { artifacts, success: true };
  }

  private async publishGovernance(input: TransparencyInput, artifacts: Artifact[]): Promise<{ artifacts: Artifact[]; success: boolean }> {
    const dir = resolve(this.root, 'docs/governance/active');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const content = `# ${input.title}\n\n${input.content}`;
    writeFileSync(resolve(dir, `${input.title.toLowerCase().replace(/\s+/g, '-')}.md`), content);
    artifacts.push({ path: `docs/governance/active/${input.title.toLowerCase().replace(/\s+/g, '-')}.md`, action: 'created', content, metadata: {} });

    return { artifacts, success: true };
  }

  async shutdown(): Promise<void> {
    // Nothing to clean up
  }
}
