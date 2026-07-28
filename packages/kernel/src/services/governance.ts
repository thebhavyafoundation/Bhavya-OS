// Governance Service
// Solves: Manage governance documents, approvals, history
// Exercises: Documents, approvals, history

import { resolve } from 'node:path';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import type { InstitutionService } from './index.js';
import type { Artifact } from '../types/index.js';

export interface GovernanceInput {
  action: 'create' | 'approve' | 'archive' | 'list';
  title: string;
  content?: string;
  status?: 'draft' | 'active' | 'superseded' | 'archived';
  category?: string;
}

export class GovernanceService implements InstitutionService {
  name = 'governance';
  description = 'Manage governance documents, approvals, history';
  capabilities = ['create-document', 'approve-document', 'archive-document', 'list-documents'];
  private root: string;

  constructor(root: string) {
    this.root = root;
  }

  async initialize(): Promise<void> {
    // Service ready
  }

  async execute(input: GovernanceInput): Promise<{ artifacts: Artifact[]; success: boolean; documents?: any[] }> {
    const artifacts: Artifact[] = [];

    switch (input.action) {
      case 'create':
        return this.create(input, artifacts);
      case 'approve':
        return this.approve(input, artifacts);
      case 'archive':
        return this.archive(input, artifacts);
      case 'list':
        return this.list(input, artifacts);
    }
  }

  private async create(input: GovernanceInput, artifacts: Artifact[]): Promise<{ artifacts: Artifact[]; success: boolean }> {
    const dir = resolve(this.root, 'docs/governance/active');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const content = `# ${input.title}\n\n**Status:** Draft\n**Created:** ${new Date().toISOString()}\n\n---\n\n${input.content ?? ''}`;
    const filename = input.title.toLowerCase().replace(/\s+/g, '-') + '.md';
    writeFileSync(resolve(dir, filename), content);
    artifacts.push({ path: `docs/governance/active/${filename}`, action: 'created', content, metadata: {} });

    return { artifacts, success: true };
  }

  private async approve(input: GovernanceInput, artifacts: Artifact[]): Promise<{ artifacts: Artifact[]; success: boolean }> {
    const filename = input.title.toLowerCase().replace(/\s+/g, '-') + '.md';
    const path = resolve(this.root, `docs/governance/active/${filename}`);
    if (!existsSync(path)) return { artifacts, success: false };

    const content = readFileSync(path, 'utf-8').replace('**Status:** Draft', '**Status:** Active');
    writeFileSync(path, content);
    artifacts.push({ path: `docs/governance/active/${filename}`, action: 'updated', content, metadata: {} });

    return { artifacts, success: true };
  }

  private async archive(input: GovernanceInput, artifacts: Artifact[]): Promise<{ artifacts: Artifact[]; success: boolean }> {
    const filename = input.title.toLowerCase().replace(/\s+/g, '-') + '.md';
    const srcPath = resolve(this.root, `docs/governance/active/${filename}`);
    if (!existsSync(srcPath)) return { artifacts, success: false };

    const content = readFileSync(srcPath, 'utf-8').replace('**Status:** Active', '**Status:** Archived');
    const destDir = resolve(this.root, 'docs/governance/archived');
    if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
    writeFileSync(resolve(destDir, filename), content);
    artifacts.push({ path: `docs/governance/archived/${filename}`, action: 'created', content, metadata: {} });

    return { artifacts, success: true };
  }

  private async list(input: GovernanceInput, artifacts: Artifact[]): Promise<{ artifacts: Artifact[]; success: boolean; documents: any[] }> {
    const dir = resolve(this.root, 'docs/governance/active');
    if (!existsSync(dir)) return { artifacts, success: true, documents: [] };

    const files = require('node:fs').readdirSync(dir).filter((f: string) => f.endsWith('.md'));
    const documents = files.map((f: string) => ({ name: f, path: `docs/governance/active/${f}` }));

    return { artifacts, success: true, documents };
  }

  async shutdown(): Promise<void> {
    // Nothing to clean up
  }
}
