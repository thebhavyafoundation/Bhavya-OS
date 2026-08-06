/**
 * Benchmarking System
 * Bhavya OS v7.0 — Universal Autonomous Engineering System
 * 
 * Compare:
 * - With industry standards
 * - With best practices
 * - With similar projects
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface Benchmark {
  id: string;
  timestamp: string;
  repositoryId: string;
  metrics: BenchmarkMetric[];
  comparisons: Comparison[];
  score: number;
}

export interface BenchmarkMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  industryAverage: number;
  bestPractice: number;
  percentile: number;
}

export interface Comparison {
  id: string;
  category: string;
  repository: number;
  industry: number;
  bestPractice: number;
  difference: number;
  status: 'above' | 'below' | 'at';
}

export class BenchmarkingSystem {
  private benchmarks: Map<string, Benchmark> = new Map();
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadBenchmarks();
  }

  private loadBenchmarks(): void {
    const benchmarksFile = join(this.dataDir, 'benchmarks.json');
    if (existsSync(benchmarksFile)) {
      const data = JSON.parse(readFileSync(benchmarksFile, 'utf-8'));
      for (const [id, benchmark] of Object.entries(data)) {
        this.benchmarks.set(id, benchmark as Benchmark);
      }
    }
  }

  private saveBenchmarks(): void {
    const data: Record<string, Benchmark> = {};
    for (const [id, benchmark] of this.benchmarks) {
      data[id] = benchmark;
    }
    writeFileSync(join(this.dataDir, 'benchmarks.json'), JSON.stringify(data, null, 2));
  }

  /**
   * Create benchmark
   */
  async createBenchmark(repositoryId: string, repoPath: string): Promise<Benchmark> {
    const benchmark: Benchmark = {
      id: `bench-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      repositoryId,
      metrics: await this.collectMetrics(repoPath),
      comparisons: [],
      score: 0
    };

    benchmark.comparisons = await this.createComparisons(benchmark.metrics);
    benchmark.score = this.calculateScore(benchmark);
    this.benchmarks.set(benchmark.id, benchmark);
    this.saveBenchmarks();
    return benchmark;
  }

  private async collectMetrics(repoPath: string): Promise<BenchmarkMetric[]> {
    const metrics: BenchmarkMetric[] = [];

    const packageJsonPath = join(repoPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      const deps = Object.keys(pkg.dependencies || {}).length;
      const devDeps = Object.keys(pkg.devDependencies || {}).length;

      metrics.push({
        id: `met-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: 'dependencies',
        value: deps,
        unit: 'packages',
        industryAverage: 25,
        bestPractice: 15,
        percentile: this.calculatePercentile(deps, 25, 15)
      });

      metrics.push({
        id: `met-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: 'devDependencies',
        value: devDeps,
        unit: 'packages',
        industryAverage: 20,
        bestPractice: 10,
        percentile: this.calculatePercentile(devDeps, 20, 10)
      });
    }

    return metrics;
  }

  private calculatePercentile(value: number, average: number, best: number): number {
    if (value <= best) return 100;
    if (value >= average * 2) return 0;
    return Math.round(100 - ((value - best) / (average - best)) * 50);
  }

  private async createComparisons(metrics: BenchmarkMetric[]): Promise<Comparison[]> {
    return metrics.map(metric => ({
      id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category: metric.name,
      repository: metric.value,
      industry: metric.industryAverage,
      bestPractice: metric.bestPractice,
      difference: metric.value - metric.industryAverage,
      status: metric.value <= metric.bestPractice ? 'at' : 
              metric.value <= metric.industryAverage ? 'above' : 'below'
    }));
  }

  private calculateScore(benchmark: Benchmark): number {
    let score = 0;
    for (const metric of benchmark.metrics) {
      score += metric.percentile;
    }
    return Math.round(score / benchmark.metrics.length);
  }

  /**
   * Get benchmark
   */
  getBenchmark(id: string): Benchmark | undefined {
    return this.benchmarks.get(id);
  }

  /**
   * Get all benchmarks
   */
  getAllBenchmarks(): Benchmark[] {
    return Array.from(this.benchmarks.values());
  }

  /**
   * Get summary
   */
  getSummary(): {
    totalBenchmarks: number;
    avgScore: number;
    avgPercentile: number;
  } {
    const benchmarks = Array.from(this.benchmarks.values());
    return {
      totalBenchmarks: benchmarks.length,
      avgScore: benchmarks.length > 0 ? Math.round(benchmarks.reduce((sum, b) => sum + b.score, 0) / benchmarks.length) : 0,
      avgPercentile: benchmarks.length > 0 ? Math.round(
        benchmarks.reduce((sum, b) => sum + b.metrics.reduce((mSum, m) => mSum + m.percentile, 0) / b.metrics.length, 0) / benchmarks.length
      ) : 0
    };
  }
}

// Singleton instance
let instance: BenchmarkingSystem | null = null;

export function getBenchmarkingSystem(dataDir: string): BenchmarkingSystem {
  if (!instance) {
    instance = new BenchmarkingSystem(dataDir);
  }
  return instance;
}
