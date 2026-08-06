/**
 * Continuous Repository Intelligence
 * Bhavya OS v7.0 — Universal Autonomous Engineering System
 * 
 * Auto-update:
 * - Knowledge
 * - Architecture
 * - Dependencies
 * - Documentation
 * - Metrics on every commit
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface IntelligenceUpdate {
  id: string;
  repositoryId: string;
  timestamp: string;
  commitSha: string;
  updates: Update[];
  score: number;
}

export interface Update {
  id: string;
  type: 'knowledge' | 'architecture' | 'dependencies' | 'documentation' | 'metrics';
  title: string;
  description: string;
  status: 'success' | 'failed' | 'skipped';
  duration: number;
}

export class ContinuousIntelligence {
  private updates: Map<string, IntelligenceUpdate> = new Map();
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadUpdates();
  }

  private loadUpdates(): void {
    const updatesFile = join(this.dataDir, 'intelligence-updates.json');
    if (existsSync(updatesFile)) {
      const data = JSON.parse(readFileSync(updatesFile, 'utf-8'));
      for (const [id, update] of Object.entries(data)) {
        this.updates.set(id, update as IntelligenceUpdate);
      }
    }
  }

  private saveUpdates(): void {
    const data: Record<string, IntelligenceUpdate> = {};
    for (const [id, update] of this.updates) {
      data[id] = update;
    }
    writeFileSync(join(this.dataDir, 'intelligence-updates.json'), JSON.stringify(data, null, 2));
  }

  /**
   * Process commit
   */
  async processCommit(repositoryId: string, commitSha: string, repoPath: string): Promise<IntelligenceUpdate> {
    const startTime = Date.now();
    const updates: Update[] = [];

    updates.push(await this.updateKnowledge(repositoryId, commitSha, repoPath));
    updates.push(await this.updateArchitecture(repositoryId, commitSha, repoPath));
    updates.push(await this.updateDependencies(repositoryId, commitSha, repoPath));
    updates.push(await this.updateDocumentation(repositoryId, commitSha, repoPath));
    updates.push(await this.updateMetrics(repositoryId, commitSha, repoPath));

    const update: IntelligenceUpdate = {
      id: `int-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      repositoryId,
      timestamp: new Date().toISOString(),
      commitSha,
      updates,
      score: this.calculateScore(updates)
    };

    this.updates.set(update.id, update);
    this.saveUpdates();
    return update;
  }

  private async updateKnowledge(repositoryId: string, commitSha: string, repoPath: string): Promise<Update> {
    const startTime = Date.now();
    try {
      const knowledgeDir = join(repoPath, '.bhavya', 'knowledge');
      if (!existsSync(knowledgeDir)) {
        mkdirSync(knowledgeDir, { recursive: true });
      }

      const knowledgeFile = join(knowledgeDir, 'knowledge.json');
      const knowledge = existsSync(knowledgeFile) 
        ? JSON.parse(readFileSync(knowledgeFile, 'utf-8'))
        : { commits: [], patterns: [] };

      knowledge.commits.push({
        sha: commitSha,
        timestamp: new Date().toISOString()
      });

      writeFileSync(knowledgeFile, JSON.stringify(knowledge, null, 2));

      return {
        id: `upd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'knowledge',
        title: 'Knowledge updated',
        description: `Added commit ${commitSha.substring(0, 7)} to knowledge graph`,
        status: 'success',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        id: `upd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'knowledge',
        title: 'Knowledge update failed',
        description: String(error),
        status: 'failed',
        duration: Date.now() - startTime
      };
    }
  }

  private async updateArchitecture(repositoryId: string, commitSha: string, repoPath: string): Promise<Update> {
    const startTime = Date.now();
    try {
      const archDir = join(repoPath, '.bhavya', 'architecture');
      if (!existsSync(archDir)) {
        mkdirSync(archDir, { recursive: true });
      }

      const archFile = join(archDir, 'architecture.json');
      const arch = existsSync(archFile)
        ? JSON.parse(readFileSync(archFile, 'utf-8'))
        : { components: [], dependencies: [] };

      arch.lastUpdated = new Date().toISOString();
      arch.lastCommit = commitSha;

      writeFileSync(archFile, JSON.stringify(arch, null, 2));

      return {
        id: `upd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'architecture',
        title: 'Architecture updated',
        description: 'Architecture memory refreshed',
        status: 'success',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        id: `upd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'architecture',
        title: 'Architecture update failed',
        description: String(error),
        status: 'failed',
        duration: Date.now() - startTime
      };
    }
  }

  private async updateDependencies(repositoryId: string, commitSha: string, repoPath: string): Promise<Update> {
    const startTime = Date.now();
    try {
      const packageJsonPath = join(repoPath, 'package.json');
      if (existsSync(packageJsonPath)) {
        const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };

        const depsDir = join(repoPath, '.bhavya', 'dependencies');
        if (!existsSync(depsDir)) {
          mkdirSync(depsDir, { recursive: true });
        }

        writeFileSync(join(depsDir, 'dependencies.json'), JSON.stringify({
          dependencies: deps,
          lastChecked: new Date().toISOString(),
          lastCommit: commitSha
        }, null, 2));
      }

      return {
        id: `upd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'dependencies',
        title: 'Dependencies updated',
        description: 'Dependency graph refreshed',
        status: 'success',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        id: `upd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'dependencies',
        title: 'Dependencies update failed',
        description: String(error),
        status: 'failed',
        duration: Date.now() - startTime
      };
    }
  }

  private async updateDocumentation(repositoryId: string, commitSha: string, repoPath: string): Promise<Update> {
    const startTime = Date.now();
    try {
      const docsDir = join(repoPath, '.bhavya', 'documentation');
      if (!existsSync(docsDir)) {
        mkdirSync(docsDir, { recursive: true });
      }

      const readmePath = join(repoPath, 'README.md');
      if (existsSync(readmePath)) {
        const readme = readFileSync(readmePath, 'utf-8');
        writeFileSync(join(docsDir, 'readme-backup.md'), readme);
      }

      return {
        id: `upd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'documentation',
        title: 'Documentation updated',
        description: 'Documentation state captured',
        status: 'success',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        id: `upd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'documentation',
        title: 'Documentation update failed',
        description: String(error),
        status: 'failed',
        duration: Date.now() - startTime
      };
    }
  }

  private async updateMetrics(repositoryId: string, commitSha: string, repoPath: string): Promise<Update> {
    const startTime = Date.now();
    try {
      const metricsDir = join(repoPath, '.bhavya', 'metrics');
      if (!existsSync(metricsDir)) {
        mkdirSync(metricsDir, { recursive: true });
      }

      const metricsFile = join(metricsDir, 'metrics.json');
      const metrics = existsSync(metricsFile)
        ? JSON.parse(readFileSync(metricsFile, 'utf-8'))
        : { commits: 0, lastUpdate: null };

      metrics.commits++;
      metrics.lastUpdate = new Date().toISOString();
      metrics.lastCommit = commitSha;

      writeFileSync(metricsFile, JSON.stringify(metrics, null, 2));

      return {
        id: `upd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'metrics',
        title: 'Metrics updated',
        description: `Total commits tracked: ${metrics.commits}`,
        status: 'success',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        id: `upd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'metrics',
        title: 'Metrics update failed',
        description: String(error),
        status: 'failed',
        duration: Date.now() - startTime
      };
    }
  }

  private calculateScore(updates: Update[]): number {
    const successful = updates.filter(u => u.status === 'success').length;
    return Math.round((successful / updates.length) * 100);
  }

  /**
   * Get update
   */
  getUpdate(id: string): IntelligenceUpdate | undefined {
    return this.updates.get(id);
  }

  /**
   * Get all updates
   */
  getAllUpdates(): IntelligenceUpdate[] {
    return Array.from(this.updates.values());
  }

  /**
   * Get summary
   */
  getSummary(): {
    totalUpdates: number;
    avgScore: number;
    successfulUpdates: number;
    failedUpdates: number;
  } {
    const updates = Array.from(this.updates.values());
    return {
      totalUpdates: updates.length,
      avgScore: updates.length > 0 ? Math.round(updates.reduce((sum, u) => sum + u.score, 0) / updates.length) : 0,
      successfulUpdates: updates.reduce((sum, u) => sum + u.updates.filter(upd => upd.status === 'success').length, 0),
      failedUpdates: updates.reduce((sum, u) => sum + u.updates.filter(upd => upd.status === 'failed').length, 0)
    };
  }
}

// Singleton instance
let instance: ContinuousIntelligence | null = null;

export function getContinuousIntelligence(dataDir: string): ContinuousIntelligence {
  if (!instance) {
    instance = new ContinuousIntelligence(dataDir);
  }
  return instance;
}
