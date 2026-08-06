/**
 * Engineering Understanding
 * Bhavya OS v7.0 — Universal Autonomous Engineering System
 * 
 * Automatically identify:
 * - Bugs
 * - Performance issues
 * - Security issues
 * - Duplicate code
 * - Large files
 * - Unused code
 * - Dead dependencies
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

export interface EngineeringReport {
  id: string;
  repositoryId: string;
  timestamp: string;
  bugs: Bug[];
  performance: PerformanceIssue[];
  security: SecurityIssue[];
  duplicates: Duplicate[];
  largeFiles: LargeFile[];
  unusedCode: UnusedCode[];
  deadDependencies: DeadDependency[];
  score: number;
}

export interface Bug {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  file: string;
  line?: number;
  pattern: string;
  suggestion: string;
}

export interface PerformanceIssue {
  id: string;
  type: 'bundle' | 'render' | 'memory' | 'network' | 'computation';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  location: string;
  impact: string;
  optimization: string;
}

export interface SecurityIssue {
  id: string;
  type: 'vulnerability' | 'exposure' | 'injection' | 'xss' | 'csrf' | 'auth';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  cwe?: string;
  mitigation: string;
}

export interface Duplicate {
  id: string;
  files: string[];
  lines: number;
  similarity: number;
  type: 'exact' | 'near' | 'structural';
}

export interface LargeFile {
  id: string;
  path: string;
  lines: number;
  bytes: number;
  type: string;
  recommendation: string;
}

export interface UnusedCode {
  id: string;
  type: 'function' | 'variable' | 'import' | 'class' | 'module';
  name: string;
  location: string;
  confidence: number;
}

export interface DeadDependency {
  id: string;
  name: string;
  version: string;
  type: 'production' | 'development';
  lastUsed?: string;
  reason: string;
}

export class EngineeringUnderstanding {
  private reports: Map<string, EngineeringReport> = new Map();
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadReports();
  }

  private loadReports(): void {
    const reportsFile = join(this.dataDir, 'engineering-reports.json');
    if (existsSync(reportsFile)) {
      const data = JSON.parse(readFileSync(reportsFile, 'utf-8'));
      for (const [id, report] of Object.entries(data)) {
        this.reports.set(id, report as EngineeringReport);
      }
    }
  }

  private saveReports(): void {
    const data: Record<string, EngineeringReport> = {};
    for (const [id, report] of this.reports) {
      data[id] = report;
    }
    writeFileSync(join(this.dataDir, 'engineering-reports.json'), JSON.stringify(data, null, 2));
  }

  /**
   * Generate engineering report
   */
  async generateReport(repositoryId: string, repoPath: string): Promise<EngineeringReport> {
    const report: EngineeringReport = {
      id: `eng-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      repositoryId,
      timestamp: new Date().toISOString(),
      bugs: await this.findBugs(repoPath),
      performance: await this.findPerformanceIssues(repoPath),
      security: await this.findSecurityIssues(repoPath),
      duplicates: await this.findDuplicates(repoPath),
      largeFiles: await this.findLargeFiles(repoPath),
      unusedCode: await this.findUnusedCode(repoPath),
      deadDependencies: await this.findDeadDependencies(repoPath),
      score: 0
    };

    report.score = this.calculateScore(report);
    this.reports.set(report.id, report);
    this.saveReports();
    return report;
  }

  private async findBugs(repoPath: string): Promise<Bug[]> {
    const bugs: Bug[] = [];

    const scanDir = (dir: string) => {
      try {
        for (const item of readdirSync(dir)) {
          if (item.startsWith('.') || item === 'node_modules' || item === 'dist') continue;
          
          const fullPath = join(dir, item);
          const stat = statSync(fullPath);
          
          if (stat.isDirectory()) {
            scanDir(fullPath);
          } else if (['.js', '.ts', '.tsx', '.jsx'].includes(extname(item))) {
            const content = readFileSync(fullPath, 'utf-8');
            const lines = content.split('\n');
            
            lines.forEach((line, index) => {
              if (line.includes('console.log') || line.includes('console.error')) {
                bugs.push({
                  id: `bug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  severity: 'low',
                  title: 'Console statement in production code',
                  description: 'Found console.log or console.error in production code',
                  file: fullPath.replace(repoPath, ''),
                  line: index + 1,
                  pattern: 'console.log|console.error',
                  suggestion: 'Remove console statements or use a logging library'
                });
              }

              if (line.includes('TODO') || line.includes('FIXME') || line.includes('HACK')) {
                bugs.push({
                  id: `bug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  severity: 'medium',
                  title: 'Unresolved TODO/FIXME',
                  description: 'Found unresolved TODO or FIXME comment',
                  file: fullPath.replace(repoPath, ''),
                  line: index + 1,
                  pattern: 'TODO|FIXME|HACK',
                  suggestion: 'Address the TODO/FIXME or create a ticket'
                });
              }

              if (line.includes('any') && line.includes(':')) {
                bugs.push({
                  id: `bug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  severity: 'low',
                  title: 'TypeScript any type usage',
                  description: 'Found usage of "any" type in TypeScript',
                  file: fullPath.replace(repoPath, ''),
                  line: index + 1,
                  pattern: ': any',
                  suggestion: 'Replace "any" with proper type definition'
                });
              }
            });
          }
        }
      } catch (e) {}
    };

    scanDir(repoPath);
    return bugs;
  }

  private async findPerformanceIssues(repoPath: string): Promise<PerformanceIssue[]> {
    const issues: PerformanceIssue[] = [];

    const packageJsonPath = join(repoPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      const heavyDeps = ['moment', 'lodash', 'underscore', 'jquery'];
      for (const dep of heavyDeps) {
        if (deps[dep]) {
          issues.push({
            id: `perf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'bundle',
            severity: 'medium',
            title: `Heavy dependency: ${dep}`,
            description: `${dep} is a heavy library that may impact bundle size`,
            location: 'package.json',
            impact: 'Increased bundle size and load time',
            optimization: `Consider using lighter alternatives like date-fns for ${dep}`
          });
        }
      }
    }

    return issues;
  }

  private async findSecurityIssues(repoPath: string): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];

    const scanDir = (dir: string) => {
      try {
        for (const item of readdirSync(dir)) {
          if (item.startsWith('.') || item === 'node_modules' || item === 'dist') continue;
          
          const fullPath = join(dir, item);
          const stat = statSync(fullPath);
          
          if (stat.isDirectory()) {
            scanDir(fullPath);
          } else if (['.js', '.ts', '.tsx', '.jsx', '.env'].includes(extname(item))) {
            const content = readFileSync(fullPath, 'utf-8');
            
            if (content.includes('API_KEY') || content.includes('SECRET') || content.includes('PASSWORD')) {
              issues.push({
                id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: 'exposure',
                severity: 'high',
                title: 'Potential secret exposure',
                description: 'Found potential API key, secret, or password in code',
                location: fullPath.replace(repoPath, ''),
                mitigation: 'Move secrets to environment variables'
              });
            }

            if (content.includes('eval(') || content.includes('innerHTML')) {
              issues.push({
                id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: 'xss',
                severity: 'medium',
                title: 'Potential XSS vulnerability',
                description: 'Found eval() or innerHTML usage',
                location: fullPath.replace(repoPath, ''),
                cwe: 'CWE-79',
                mitigation: 'Sanitize user input and avoid eval()'
              });
            }
          }
        }
      } catch (e) {}
    };

    scanDir(repoPath);
    return issues;
  }

  private async findDuplicates(repoPath: string): Promise<Duplicate[]> {
    const duplicates: Duplicate[] = [];
    const fileContents: Map<string, string[]> = new Map();

    const scanDir = (dir: string) => {
      try {
        for (const item of readdirSync(dir)) {
          if (item.startsWith('.') || item === 'node_modules' || item === 'dist') continue;
          
          const fullPath = join(dir, item);
          const stat = statSync(fullPath);
          
          if (stat.isDirectory()) {
            scanDir(fullPath);
          } else if (['.js', '.ts', '.tsx', '.jsx'].includes(extname(item))) {
            const content = readFileSync(fullPath, 'utf-8');
            const lines = content.split('\n').filter(l => l.trim());
            
            if (lines.length > 10) {
              const key = lines.slice(0, 5).join('\n');
              if (!fileContents.has(key)) {
                fileContents.set(key, []);
              }
              fileContents.get(key)!.push(fullPath.replace(repoPath, ''));
            }
          }
        }
      } catch (e) {}
    };

    scanDir(repoPath);

    for (const [_, files] of fileContents) {
      if (files.length > 1) {
        duplicates.push({
          id: `dup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          files,
          lines: 10,
          similarity: 80,
          type: 'structural'
        });
      }
    }

    return duplicates;
  }

  private async findLargeFiles(repoPath: string): Promise<LargeFile[]> {
    const largeFiles: LargeFile[] = [];
    const threshold = 1000;

    const scanDir = (dir: string) => {
      try {
        for (const item of readdirSync(dir)) {
          if (item.startsWith('.') || item === 'node_modules' || item === 'dist') continue;
          
          const fullPath = join(dir, item);
          const stat = statSync(fullPath);
          
          if (stat.isDirectory()) {
            scanDir(fullPath);
          } else if (['.js', '.ts', '.tsx', '.jsx', '.json'].includes(extname(item))) {
            const content = readFileSync(fullPath, 'utf-8');
            const lines = content.split('\n').length;
            
            if (lines > threshold) {
              largeFiles.push({
                id: `large-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                path: fullPath.replace(repoPath, ''),
                lines,
                bytes: stat.size,
                type: extname(item),
                recommendation: 'Consider splitting into smaller files'
              });
            }
          }
        }
      } catch (e) {}
    };

    scanDir(repoPath);
    return largeFiles;
  }

  private async findUnusedCode(repoPath: string): Promise<UnusedCode[]> {
    const unused: UnusedCode[] = [];

    const packageJsonPath = join(repoPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

      const scanDir = (dir: string) => {
        try {
          for (const item of readdirSync(dir)) {
            if (item.startsWith('.') || item === 'node_modules' || item === 'dist') continue;
            
            const fullPath = join(dir, item);
            const stat = statSync(fullPath);
            
            if (stat.isDirectory()) {
              scanDir(fullPath);
            } else if (['.js', '.ts', '.tsx', '.jsx'].includes(extname(item))) {
              const content = readFileSync(fullPath, 'utf-8');
              
              for (const dep of Object.keys(allDeps)) {
                if (!content.includes(dep) && !content.includes(`'${dep}'`) && !content.includes(`"${dep}"`)) {
                  unused.push({
                    id: `unused-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    type: 'import',
                    name: dep,
                    location: fullPath.replace(repoPath, ''),
                    confidence: 0.7
                  });
                }
              }
            }
          }
        } catch (e) {}
      };

      scanDir(repoPath);
    }

    return unused.slice(0, 10);
  }

  private async findDeadDependencies(repoPath: string): Promise<DeadDependency[]> {
    const dead: DeadDependency[] = [];

    const packageJsonPath = join(repoPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      const deps = pkg.dependencies || {};
      const devDeps = pkg.devDependencies || {};

      for (const [name, version] of Object.entries(deps)) {
        dead.push({
          id: `dead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          version: version as string,
          type: 'production',
          reason: 'Requires usage analysis'
        });
      }

      for (const [name, version] of Object.entries(devDeps)) {
        dead.push({
          id: `dead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          version: version as string,
          type: 'development',
          reason: 'Requires usage analysis'
        });
      }
    }

    return dead.slice(0, 10);
  }

  private calculateScore(report: EngineeringReport): number {
    let score = 100;
    score -= report.bugs.length * 2;
    score -= report.performance.length * 3;
    score -= report.security.length * 5;
    score -= report.duplicates.length * 2;
    score -= report.largeFiles.length * 1;
    score -= report.unusedCode.length * 1;
    score -= report.deadDependencies.length * 1;
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Get report
   */
  getReport(id: string): EngineeringReport | undefined {
    return this.reports.get(id);
  }

  /**
   * Get all reports
   */
  getAllReports(): EngineeringReport[] {
    return Array.from(this.reports.values());
  }

  /**
   * Get summary
   */
  getSummary(): {
    totalReports: number;
    avgScore: number;
    totalBugs: number;
    totalSecurityIssues: number;
    totalDuplicates: number;
  } {
    const reports = Array.from(this.reports.values());
    return {
      totalReports: reports.length,
      avgScore: reports.length > 0 ? Math.round(reports.reduce((sum, r) => sum + r.score, 0) / reports.length) : 0,
      totalBugs: reports.reduce((sum, r) => sum + r.bugs.length, 0),
      totalSecurityIssues: reports.reduce((sum, r) => sum + r.security.length, 0),
      totalDuplicates: reports.reduce((sum, r) => sum + r.duplicates.length, 0)
    };
  }
}

// Singleton instance
let instance: EngineeringUnderstanding | null = null;

export function getEngineeringUnderstanding(dataDir: string): EngineeringUnderstanding {
  if (!instance) {
    instance = new EngineeringUnderstanding(dataDir);
  }
  return instance;
}
