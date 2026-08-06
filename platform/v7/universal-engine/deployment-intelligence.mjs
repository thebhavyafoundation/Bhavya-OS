/**
 * Deployment Intelligence
 * Bhavya OS v7.0 — Universal Autonomous Engineering System
 * 
 * Understand:
 * - Vercel, Docker, Cloud Run, Netlify, AWS, Azure, self-hosted
 * - Generate deployment plans
 * - Optimize configurations
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface DeploymentPlan {
  id: string;
  repositoryId: string;
  timestamp: string;
  platform: DeploymentPlatform;
  config: DeploymentConfig;
  recommendations: Recommendation[];
  optimizations: Optimization[];
  score: number;
}

export type DeploymentPlatform = 
  | 'vercel' 
  | 'docker' 
  | 'cloud-run' 
  | 'netlify' 
  | 'aws' 
  | 'azure' 
  | 'self-hosted'
  | 'railway'
  | 'fly-io'
  | 'render';

export interface DeploymentConfig {
  buildCommand: string;
  startCommand: string;
  port: number;
  envVars: string[];
  healthCheck: string;
  scaling: ScalingConfig;
  caching: CachingConfig;
  security: SecurityConfig;
}

export interface ScalingConfig {
  minInstances: number;
  maxInstances: number;
  targetCPU: number;
  targetMemory: number;
}

export interface CachingConfig {
  enabled: boolean;
  ttl: number;
  strategy: 'memory' | 'redis' | 'cdn';
}

export interface SecurityConfig {
  https: boolean;
  headers: boolean;
  cors: boolean;
  rateLimiting: boolean;
}

export interface Recommendation {
  id: string;
  type: 'platform' | 'config' | 'performance' | 'security' | 'cost';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
}

export interface Optimization {
  id: string;
  category: 'build' | 'runtime' | 'network' | 'storage';
  title: string;
  description: string;
  savings: string;
}

export class DeploymentIntelligence {
  private plans: Map<string, DeploymentPlan> = new Map();
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadPlans();
  }

  private loadPlans(): void {
    const plansFile = join(this.dataDir, 'deployment-plans.json');
    if (existsSync(plansFile)) {
      const data = JSON.parse(readFileSync(plansFile, 'utf-8'));
      for (const [id, plan] of Object.entries(data)) {
        this.plans.set(id, plan as DeploymentPlan);
      }
    }
  }

  private savePlans(): void {
    const data: Record<string, DeploymentPlan> = {};
    for (const [id, plan] of this.plans) {
      data[id] = plan;
    }
    writeFileSync(join(this.dataDir, 'deployment-plans.json'), JSON.stringify(data, null, 2));
  }

  /**
   * Generate deployment plan
   */
  async generatePlan(repositoryId: string, repoPath: string): Promise<DeploymentPlan> {
    const platform = await this.detectPlatform(repoPath);
    const config = await this.generateConfig(platform, repoPath);
    const recommendations = await this.generateRecommendations(platform, repoPath);
    const optimizations = await this.generateOptimizations(platform, repoPath);

    const plan: DeploymentPlan = {
      id: `deploy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      repositoryId,
      timestamp: new Date().toISOString(),
      platform,
      config,
      recommendations,
      optimizations,
      score: 0
    };

    plan.score = this.calculateScore(plan);
    this.plans.set(plan.id, plan);
    this.savePlans();
    return plan;
  }

  private async detectPlatform(repoPath: string): Promise<DeploymentPlatform> {
    if (existsSync(join(repoPath, 'vercel.json'))) return 'vercel';
    if (existsSync(join(repoPath, 'netlify.toml'))) return 'netlify';
    if (existsSync(join(repoPath, 'Dockerfile'))) return 'docker';
    if (existsSync(join(repoPath, '.dockerignore'))) return 'docker';
    if (existsSync(join(repoPath, 'railway.json'))) return 'railway';
    if (existsSync(join(repoPath, 'fly.toml'))) return 'fly-io';
    if (existsSync(join(repoPath, 'render.yaml'))) return 'render';
    if (existsSync(join(repoPath, 'app.yaml'))) return 'cloud-run';
    if (existsSync(join(repoPath, 'serverless.yml'))) return 'aws';
    if (existsSync(join(repoPath, 'azure-pipelines.yml'))) return 'azure';

    const packageJsonPath = join(repoPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      if (pkg.dependencies?.next || pkg.devDependencies?.next) return 'vercel';
    }

    return 'self-hosted';
  }

  private async generateConfig(platform: DeploymentPlatform, repoPath: string): Promise<DeploymentConfig> {
    const baseConfig: DeploymentConfig = {
      buildCommand: 'npm run build',
      startCommand: 'npm start',
      port: 3000,
      envVars: [],
      healthCheck: '/health',
      scaling: {
        minInstances: 1,
        maxInstances: 10,
        targetCPU: 70,
        targetMemory: 80
      },
      caching: {
        enabled: true,
        ttl: 3600,
        strategy: 'memory'
      },
      security: {
        https: true,
        headers: true,
        cors: true,
        rateLimiting: true
      }
    };

    switch (platform) {
      case 'vercel':
        baseConfig.buildCommand = 'vercel build';
        baseConfig.startCommand = 'vercel start';
        break;
      case 'docker':
        baseConfig.buildCommand = 'docker build -t app .';
        baseConfig.startCommand = 'docker run -p 3000:3000 app';
        break;
      case 'cloud-run':
        baseConfig.buildCommand = 'gcloud builds submit --tag gcr.io/PROJECT_ID/APP';
        baseConfig.startCommand = 'gcloud run deploy --image gcr.io/PROJECT_ID/APP';
        break;
      case 'netlify':
        baseConfig.buildCommand = 'netlify build';
        baseConfig.startCommand = 'netlify deploy';
        break;
    }

    const packageJsonPath = join(repoPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      if (pkg.scripts?.build) baseConfig.buildCommand = 'npm run build';
      if (pkg.scripts?.start) baseConfig.startCommand = 'npm start';
    }

    return baseConfig;
  }

  private async generateRecommendations(platform: DeploymentPlatform, repoPath: string): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    recommendations.push({
      id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'platform',
      title: `Optimal platform: ${platform}`,
      description: `Based on repository analysis, ${platform} is the recommended deployment platform`,
      impact: 'high',
      effort: 'low'
    });

    const packageJsonPath = join(repoPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      
      if (pkg.dependencies?.next || pkg.devDependencies?.next) {
        recommendations.push({
          id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'performance',
          title: 'Enable ISR for Next.js',
          description: 'Incremental Static Regeneration improves performance',
          impact: 'high',
          effort: 'low'
        });
      }

      if (pkg.scripts?.test) {
        recommendations.push({
          id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'config',
          title: 'Add CI/CD pipeline',
          description: 'Automate testing and deployment',
          impact: 'high',
          effort: 'medium'
        });
      }
    }

    return recommendations;
  }

  private async generateOptimizations(platform: DeploymentPlatform, repoPath: string): Promise<Optimization[]> {
    const optimizations: Optimization[] = [];

    optimizations.push({
      id: `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category: 'build',
      title: 'Enable build caching',
      description: 'Cache node_modules and build artifacts',
      savings: '50% faster builds'
    });

    optimizations.push({
      id: `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category: 'runtime',
      title: 'Enable gzip compression',
      description: 'Compress responses to reduce transfer size',
      savings: '70% smaller payloads'
    });

    optimizations.push({
      id: `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category: 'network',
      title: 'Enable CDN caching',
      description: 'Cache static assets at edge locations',
      savings: '90% faster static assets'
    });

    return optimizations;
  }

  private calculateScore(plan: DeploymentPlan): number {
    let score = 100;
    score += plan.recommendations.length * 5;
    score += plan.optimizations.length * 3;
    if (plan.config.security.https) score += 10;
    if (plan.config.security.headers) score += 5;
    if (plan.config.caching.enabled) score += 5;
    return Math.min(100, score);
  }

  /**
   * Get plan
   */
  getPlan(id: string): DeploymentPlan | undefined {
    return this.plans.get(id);
  }

  /**
   * Get all plans
   */
  getAllPlans(): DeploymentPlan[] {
    return Array.from(this.plans.values());
  }

  /**
   * Get summary
   */
  getSummary(): {
    totalPlans: number;
    avgScore: number;
    platforms: Record<string, number>;
    totalRecommendations: number;
    totalOptimizations: number;
  } {
    const plans = Array.from(this.plans.values());
    const platforms: Record<string, number> = {};
    
    for (const plan of plans) {
      platforms[plan.platform] = (platforms[plan.platform] || 0) + 1;
    }

    return {
      totalPlans: plans.length,
      avgScore: plans.length > 0 ? Math.round(plans.reduce((sum, p) => sum + p.score, 0) / plans.length) : 0,
      platforms,
      totalRecommendations: plans.reduce((sum, p) => sum + p.recommendations.length, 0),
      totalOptimizations: plans.reduce((sum, p) => sum + p.optimizations.length, 0)
    };
  }
}

// Singleton instance
let instance: DeploymentIntelligence | null = null;

export function getDeploymentIntelligence(dataDir: string): DeploymentIntelligence {
  if (!instance) {
    instance = new DeploymentIntelligence(dataDir);
  }
  return instance;
}
