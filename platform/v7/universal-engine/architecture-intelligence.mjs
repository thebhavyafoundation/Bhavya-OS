/**
 * Architecture Intelligence
 * Bhavya OS v7.0 — Universal Autonomous Engineering System
 * 
 * Generate:
 * - Architecture Report
 * - Dependency Graph
 * - Risk Analysis
 * - Technical Debt
 * - Component Registry
 * - Service Map
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

export interface ArchitectureReport {
  id: string;
  repositoryId: string;
  timestamp: string;
  overview: ArchitectureOverview;
  components: Component[];
  dependencies: DependencyGraph;
  risks: RiskAnalysis;
  technicalDebt: TechnicalDebt;
  serviceMap: ServiceMap;
  score: number;
}

export interface ArchitectureOverview {
  pattern: string;
  layers: string[];
  modules: string[];
  entryPoints: string[];
  configFiles: string[];
}

export interface Component {
  id: string;
  name: string;
  type: 'application' | 'library' | 'service' | 'utility' | 'config';
  path: string;
  dependencies: string[];
  dependents: string[];
  linesOfCode: number;
  files: number;
  complexity: 'low' | 'medium' | 'high';
}

export interface DependencyGraph {
  nodes: { id: string; name: string; type: string }[];
  edges: { source: string; target: string; type: string }[];
  cycles: string[][];
  orphans: string[];
}

export interface RiskAnalysis {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  risks: Risk[];
  score: number;
}

export interface Risk {
  id: string;
  category: 'security' | 'performance' | 'maintainability' | 'reliability' | 'scalability';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
  mitigation: string;
}

export interface TechnicalDebt {
  totalItems: number;
  categories: DebtCategory[];
  score: number;
  trend: 'improving' | 'stable' | 'degrading';
}

export interface DebtCategory {
  name: string;
  items: DebtItem[];
  count: number;
  effort: number;
}

export interface DebtItem {
  id: string;
  title: string;
  description: string;
  location: string;
  impact: 'low' | 'medium' | 'high';
  effort: number;
}

export interface ServiceMap {
  services: Service[];
  connections: ServiceConnection[];
}

export interface Service {
  id: string;
  name: string;
  type: string;
  port?: number;
  endpoints: string[];
  dependencies: string[];
}

export interface ServiceConnection {
  source: string;
  target: string;
  type: 'http' | 'grpc' | 'message' | 'database';
  protocol: string;
}

export class ArchitectureIntelligence {
  private reports: Map<string, ArchitectureReport> = new Map();
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadReports();
  }

  private loadReports(): void {
    const reportsFile = join(this.dataDir, 'architecture-reports.json');
    if (existsSync(reportsFile)) {
      const data = JSON.parse(readFileSync(reportsFile, 'utf-8'));
      for (const [id, report] of Object.entries(data)) {
        this.reports.set(id, report as ArchitectureReport);
      }
    }
  }

  private saveReports(): void {
    const data: Record<string, ArchitectureReport> = {};
    for (const [id, report] of this.reports) {
      data[id] = report;
    }
    writeFileSync(join(this.dataDir, 'architecture-reports.json'), JSON.stringify(data, null, 2));
  }

  /**
   * Generate architecture report
   */
  async generateReport(repositoryId: string, repoPath: string): Promise<ArchitectureReport> {
    const report: ArchitectureReport = {
      id: `arch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      repositoryId,
      timestamp: new Date().toISOString(),
      overview: await this.analyzeOverview(repoPath),
      components: await this.discoverComponents(repoPath),
      dependencies: await this.analyzeDependencies(repoPath),
      risks: await this.analyzeRisks(repoPath),
      technicalDebt: await this.analyzeTechnicalDebt(repoPath),
      serviceMap: await this.generateServiceMap(repoPath),
      score: 0
    };

    report.score = this.calculateScore(report);
    this.reports.set(report.id, report);
    this.saveReports();
    return report;
  }

  private async analyzeOverview(repoPath: string): Promise<ArchitectureOverview> {
    return {
      pattern: this.detectPattern(repoPath),
      layers: this.discoverLayers(repoPath),
      modules: this.discoverModules(repoPath),
      entryPoints: this.findEntryPoints(repoPath),
      configFiles: this.findConfigFiles(repoPath)
    };
  }

  private detectPattern(repoPath: string): string {
    if (existsSync(join(repoPath, 'packages')) && existsSync(join(repoPath, 'apps'))) {
      return 'monorepo';
    }
    if (existsSync(join(repoPath, 'services'))) {
      return 'microservices';
    }
    if (existsSync(join(repoPath, 'functions')) || existsSync(join(repoPath, 'serverless.yml'))) {
      return 'serverless';
    }
    return 'monolith';
  }

  private discoverLayers(repoPath: string): string[] {
    const layers: string[] = [];
    const srcDir = join(repoPath, 'src');
    
    if (existsSync(srcDir)) {
      for (const item of readdirSync(srcDir)) {
        if (!item.startsWith('.')) {
          layers.push(item);
        }
      }
    }

    return layers;
  }

  private discoverModules(repoPath: string): string[] {
    const modules: string[] = [];
    
    const packagesDir = join(repoPath, 'packages');
    if (existsSync(packagesDir)) {
      modules.push(...readdirSync(packagesDir));
    }

    const appsDir = join(repoPath, 'apps');
    if (existsSync(appsDir)) {
      modules.push(...readdirSync(appsDir));
    }

    return modules;
  }

  private findEntryPoints(repoPath: string): string[] {
    const entryPoints: string[] = [];
    const possibleEntries = ['index.js', 'index.ts', 'main.js', 'main.ts', 'app.js', 'app.ts', 'server.js', 'server.ts'];

    for (const entry of possibleEntries) {
      if (existsSync(join(repoPath, entry))) {
        entryPoints.push(entry);
      }
    }

    return entryPoints;
  }

  private findConfigFiles(repoPath: string): string[] {
    const configFiles: string[] = [];
    const configs = ['package.json', 'tsconfig.json', '.eslintrc.js', '.eslintrc.json', 'prettier.config.js', 'tailwind.config.js', 'next.config.js', 'next.config.mjs', 'vite.config.ts', 'webpack.config.js'];

    for (const config of configs) {
      if (existsSync(join(repoPath, config))) {
        configFiles.push(config);
      }
    }

    return configFiles;
  }

  private async discoverComponents(repoPath: string): Promise<Component[]> {
    const components: Component[] = [];

    const scanDir = (dir: string, type: Component['type']) => {
      if (existsSync(dir)) {
        for (const item of readdirSync(dir)) {
          const fullPath = join(dir, item);
          const stat = statSync(fullPath);
          
          if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            const files = this.countFiles(fullPath);
            const lines = this.countLines(fullPath);
            
            components.push({
              id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: item,
              type,
              path: fullPath.replace(repoPath, ''),
              dependencies: [],
              dependents: [],
              linesOfCode: lines,
              files,
              complexity: lines > 10000 ? 'high' : lines > 3000 ? 'medium' : 'low'
            });
          }
        }
      }
    };

    scanDir(join(repoPath, 'src'), 'application');
    scanDir(join(repoPath, 'packages'), 'library');
    scanDir(join(repoPath, 'apps'), 'application');
    scanDir(join(repoPath, 'services'), 'service');

    return components;
  }

  private countFiles(dir: string): number {
    let count = 0;
    try {
      for (const item of readdirSync(dir)) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          count += this.countFiles(fullPath);
        } else if (stat.isFile()) {
          count++;
        }
      }
    } catch (e) {}
    return count;
  }

  private countLines(dir: string): number {
    let count = 0;
    try {
      for (const item of readdirSync(dir)) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          count += this.countLines(fullPath);
        } else if (stat.isFile() && ['.js', '.ts', '.tsx', '.jsx', '.py', '.rs', '.go'].includes(extname(item))) {
          const content = readFileSync(fullPath, 'utf-8');
          count += content.split('\n').length;
        }
      }
    } catch (e) {}
    return count;
  }

  private async analyzeDependencies(repoPath: string): Promise<DependencyGraph> {
    const nodes: { id: string; name: string; type: string }[] = [];
    const edges: { source: string; target: string; type: string }[] = [];
    const cycles: string[][] = [];
    const orphans: string[] = [];

    const packageJsonPath = join(repoPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      
      nodes.push({ id: 'root', name: pkg.name || 'root', type: 'application' });

      for (const dep of Object.keys(pkg.dependencies || {})) {
        nodes.push({ id: dep, name: dep, type: 'production' });
        edges.push({ source: 'root', target: dep, type: 'dependency' });
      }

      for (const dep of Object.keys(pkg.devDependencies || {})) {
        nodes.push({ id: dep, name: dep, type: 'development' });
        edges.push({ source: 'root', target: dep, type: 'devDependency' });
      }
    }

    return { nodes, edges, cycles, orphans };
  }

  private async analyzeRisks(repoPath: string): Promise<RiskAnalysis> {
    const risks: Risk[] = [];

    const packageJsonPath = join(repoPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      
      if (!pkg.scripts?.test) {
        risks.push({
          id: `risk-${Date.now()}-1`,
          category: 'reliability',
          severity: 'medium',
          title: 'No test script configured',
          description: 'Repository lacks test configuration',
          impact: 'Code quality may degrade',
          mitigation: 'Add test framework and configure test script'
        });
      }

      if (!pkg.scripts?.lint) {
        risks.push({
          id: `risk-${Date.now()}-2`,
          category: 'maintainability',
          severity: 'low',
          title: 'No lint script configured',
          description: 'Repository lacks linting configuration',
          impact: 'Code style inconsistencies',
          mitigation: 'Add ESLint and configure lint script'
        });
      }
    }

    const score = Math.max(0, 100 - risks.length * 15);
    const overallRisk = risks.some(r => r.severity === 'critical') ? 'critical' :
                        risks.some(r => r.severity === 'high') ? 'high' :
                        risks.some(r => r.severity === 'medium') ? 'medium' : 'low';

    return { overallRisk, risks, score };
  }

  private async analyzeTechnicalDebt(repoPath: string): Promise<TechnicalDebt> {
    const categories: DebtCategory[] = [];

    const packageJsonPath = join(repoPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      const outdatedDeps = Object.entries(deps).filter(([_, version]) => 
        (version as string).includes('^') || (version as string).includes('~')
      );

      if (outdatedDeps.length > 0) {
        categories.push({
          name: 'Dependency Management',
          items: outdatedDeps.map(([name, version]) => ({
            id: `debt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: `Update dependency: ${name}`,
            description: `Version ${version} may be outdated`,
            location: 'package.json',
            impact: 'low',
            effort: 1
          })),
          count: outdatedDeps.length,
          effort: outdatedDeps.length
        });
      }
    }

    const totalItems = categories.reduce((sum, cat) => sum + cat.count, 0);
    const score = Math.max(0, 100 - totalItems * 5);

    return {
      totalItems,
      categories,
      score,
      trend: 'stable'
    };
  }

  private async generateServiceMap(repoPath: string): Promise<ServiceMap> {
    const services: Service[] = [];
    const connections: ServiceConnection[] = [];

    const packageJsonPath = join(repoPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      
      services.push({
        id: 'root',
        name: pkg.name || 'root',
        type: 'application',
        endpoints: [],
        dependencies: Object.keys(pkg.dependencies || {})
      });
    }

    return { services, connections };
  }

  private calculateScore(report: ArchitectureReport): number {
    let score = 100;
    score -= report.risks.risks.length * 5;
    score -= report.technicalDebt.totalItems * 2;
    score -= report.dependencies.cycles.length * 10;
    score -= report.dependencies.orphans.length * 3;
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Get report
   */
  getReport(id: string): ArchitectureReport | undefined {
    return this.reports.get(id);
  }

  /**
   * Get all reports
   */
  getAllReports(): ArchitectureReport[] {
    return Array.from(this.reports.values());
  }

  /**
   * Get summary
   */
  getSummary(): {
    totalReports: number;
    avgScore: number;
    totalRisks: number;
    totalDebt: number;
  } {
    const reports = Array.from(this.reports.values());
    return {
      totalReports: reports.length,
      avgScore: reports.length > 0 ? Math.round(reports.reduce((sum, r) => sum + r.score, 0) / reports.length) : 0,
      totalRisks: reports.reduce((sum, r) => sum + r.risks.risks.length, 0),
      totalDebt: reports.reduce((sum, r) => sum + r.technicalDebt.totalItems, 0)
    };
  }
}

// Singleton instance
let instance: ArchitectureIntelligence | null = null;

export function getArchitectureIntelligence(dataDir: string): ArchitectureIntelligence {
  if (!instance) {
    instance = new ArchitectureIntelligence(dataDir);
  }
  return instance;
}
