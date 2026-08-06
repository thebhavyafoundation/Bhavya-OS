/**
 * Autonomous Refactoring
 * Bhavya OS v7.0 — Universal Autonomous Engineering System
 * 
 * Suggest:
 * - Safe refactors
 * - Architecture improvements
 * - Performance improvements
 * - Dependency upgrades
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface RefactoringReport {
  id: string;
  repositoryId: string;
  timestamp: string;
  safeRefactors: Refactor[];
  architectureImprovements: Improvement[];
  performanceImprovements: Improvement[];
  dependencyUpgrades: Upgrade[];
  score: number;
}

export interface Refactor {
  id: string;
  type: 'extract' | 'rename' | 'move' | 'inline' | 'split' | 'merge';
  title: string;
  description: string;
  files: string[];
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  risk: 'low' | 'medium' | 'high';
  before?: string;
  after?: string;
}

export interface Improvement {
  id: string;
  category: 'architecture' | 'performance' | 'maintainability' | 'security';
  title: string;
  description: string;
  location: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  benefits: string[];
}

export interface Upgrade {
  id: string;
  name: string;
  currentVersion: string;
  targetVersion: string;
  type: 'major' | 'minor' | 'patch';
  breaking: boolean;
  changelog: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
}

export class AutonomousRefactoring {
  private reports: Map<string, RefactoringReport> = new Map();
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadReports();
  }

  private loadReports(): void {
    const reportsFile = join(this.dataDir, 'refactoring-reports.json');
    if (existsSync(reportsFile)) {
      const data = JSON.parse(readFileSync(reportsFile, 'utf-8'));
      for (const [id, report] of Object.entries(data)) {
        this.reports.set(id, report as RefactoringReport);
      }
    }
  }

  private saveReports(): void {
    const data: Record<string, RefactoringReport> = {};
    for (const [id, report] of this.reports) {
      data[id] = report;
    }
    writeFileSync(join(this.dataDir, 'refactoring-reports.json'), JSON.stringify(data, null, 2));
  }

  /**
   * Generate refactoring report
   */
  async generateReport(repositoryId: string, repoPath: string): Promise<RefactoringReport> {
    const report: RefactoringReport = {
      id: `refactor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      repositoryId,
      timestamp: new Date().toISOString(),
      safeRefactors: await this.findSafeRefactors(repoPath),
      architectureImprovements: await this.findArchitectureImprovements(repoPath),
      performanceImprovements: await this.findPerformanceImprovements(repoPath),
      dependencyUpgrades: await this.findDependencyUpgrades(repoPath),
      score: 0
    };

    report.score = this.calculateScore(report);
    this.reports.set(report.id, report);
    this.saveReports();
    return report;
  }

  private async findSafeRefactors(repoPath: string): Promise<Refactor[]> {
    const refactors: Refactor[] = [];

    const packageJsonPath = join(repoPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      
      if (pkg.scripts?.build && !pkg.scripts?.typecheck) {
        refactors.push({
          id: `ref-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'extract',
          title: 'Add TypeScript type checking',
          description: 'Add typecheck script for better type safety',
          files: ['package.json'],
          impact: 'medium',
          effort: 'low',
          risk: 'low'
        });
      }
    }

    return refactors;
  }

  private async findArchitectureImprovements(repoPath: string): Promise<Improvement[]> {
    const improvements: Improvement[] = [];

    const hasSrcDir = existsSync(repoPath + '/src');
    const hasComponentsDir = existsSync(repoPath + '/src/components');
    const hasUtilsDir = existsSync(repoPath + '/src/utils');

    if (hasSrcDir && !hasComponentsDir) {
      improvements.push({
        id: `imp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        category: 'architecture',
        title: 'Create components directory',
        description: 'Organize UI components into dedicated directory',
        location: 'src/',
        impact: 'medium',
        effort: 'low',
        benefits: ['Better organization', 'Easier navigation', 'Reusability']
      });
    }

    if (hasSrcDir && !hasUtilsDir) {
      improvements.push({
        id: `imp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        category: 'architecture',
        title: 'Create utils directory',
        description: 'Extract utility functions into dedicated directory',
        location: 'src/',
        impact: 'medium',
        effort: 'low',
        benefits: ['Code reuse', 'Better testing', 'Clear separation']
      });
    }

    return improvements;
  }

  private async findPerformanceImprovements(repoPath: string): Promise<Improvement[]> {
    const improvements: Improvement[] = [];

    const packageJsonPath = join(repoPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (deps['moment']) {
        improvements.push({
          id: `imp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          category: 'performance',
          title: 'Replace moment.js with date-fns',
          description: 'moment.js is heavy and deprecated',
          location: 'package.json',
          impact: 'high',
          effort: 'medium',
          benefits: ['Smaller bundle', 'Tree-shakeable', 'Better performance']
        });
      }

      if (deps['lodash']) {
        improvements.push({
          id: `imp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          category: 'performance',
          title: 'Replace lodash with lodash-es or individual functions',
          description: 'lodash is not tree-shakeable',
          location: 'package.json',
          impact: 'medium',
          effort: 'medium',
          benefits: ['Smaller bundle', 'Tree-shakeable']
        });
      }
    }

    return improvements;
  }

  private async findDependencyUpgrades(repoPath: string): Promise<Upgrade[]> {
    const upgrades: Upgrade[] = [];

    const packageJsonPath = join(repoPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      for (const [name, version] of Object.entries(deps)) {
        const versionStr = version as string;
        if (versionStr.startsWith('^') || versionStr.startsWith('~')) {
          upgrades.push({
            id: `upg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name,
            currentVersion: versionStr,
            targetVersion: 'latest',
            type: 'minor',
            breaking: false,
            changelog: 'Check changelog for updates',
            impact: 'low',
            effort: 'low'
          });
        }
      }
    }

    return upgrades.slice(0, 10);
  }

  private calculateScore(report: RefactoringReport): number {
    let score = 100;
    score -= report.safeRefactors.length * 5;
    score -= report.architectureImprovements.length * 3;
    score -= report.performanceImprovements.length * 2;
    score -= report.dependencyUpgrades.length * 1;
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Get report
   */
  getReport(id: string): RefactoringReport | undefined {
    return this.reports.get(id);
  }

  /**
   * Get all reports
   */
  getAllReports(): RefactoringReport[] {
    return Array.from(this.reports.values());
  }

  /**
   * Get summary
   */
  getSummary(): {
    totalReports: number;
    avgScore: number;
    totalRefactors: number;
    totalImprovements: number;
    totalUpgrades: number;
  } {
    const reports = Array.from(this.reports.values());
    return {
      totalReports: reports.length,
      avgScore: reports.length > 0 ? Math.round(reports.reduce((sum, r) => sum + r.score, 0) / reports.length) : 0,
      totalRefactors: reports.reduce((sum, r) => sum + r.safeRefactors.length, 0),
      totalImprovements: reports.reduce((sum, r) => sum + r.architectureImprovements.length + r.performanceImprovements.length, 0),
      totalUpgrades: reports.reduce((sum, r) => sum + r.dependencyUpgrades.length, 0)
    };
  }
}

// Singleton instance
let instance: AutonomousRefactoring | null = null;

export function getAutonomousRefactoring(dataDir: string): AutonomousRefactoring {
  if (!instance) {
    instance = new AutonomousRefactoring(dataDir);
  }
  return instance;
}
