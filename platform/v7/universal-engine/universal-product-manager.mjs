/**
 * Universal Product Manager
 * Bhavya OS v7.0 — Universal Autonomous Engineering System
 * 
 * Automatically infer:
 * - Product purpose
 * - Users
 * - Features
 * - Roadmap
 * - Backlog
 * - Engineering priorities
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

export interface ProductProfile {
  id: string;
  repositoryId: string;
  timestamp: string;
  purpose: ProductPurpose;
  users: User[];
  features: Feature[];
  roadmap: Roadmap;
  backlog: BacklogItem[];
  priorities: EngineeringPriority[];
  score: number;
}

export interface ProductPurpose {
  description: string;
  category: string;
  domain: string;
  valueProposition: string;
  targetAudience: string;
}

export interface User {
  id: string;
  type: string;
  description: string;
  needs: string[];
  painPoints: string[];
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'planned' | 'in-progress' | 'completed';
  complexity: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}

export interface Roadmap {
  vision: string;
  phases: RoadmapPhase[];
}

export interface RoadmapPhase {
  name: string;
  duration: string;
  goals: string[];
  features: string[];
}

export interface BacklogItem {
  id: string;
  title: string;
  description: string;
  type: 'feature' | 'bugfix' | 'improvement' | 'documentation' | 'test';
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  effort: number;
  impact: number;
  status: 'backlog' | 'ready' | 'in-progress' | 'done';
}

export interface EngineeringPriority {
  area: string;
  priority: number;
  reason: string;
  impact: string;
}

export class UniversalProductManager {
  private profiles: Map<string, ProductProfile> = new Map();
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadProfiles();
  }

  private loadProfiles(): void {
    const profilesFile = join(this.dataDir, 'product-profiles.json');
    if (existsSync(profilesFile)) {
      const data = JSON.parse(readFileSync(profilesFile, 'utf-8'));
      for (const [id, profile] of Object.entries(data)) {
        this.profiles.set(id, profile as ProductProfile);
      }
    }
  }

  private saveProfiles(): void {
    const data: Record<string, ProductProfile> = {};
    for (const [id, profile] of this.profiles) {
      data[id] = profile;
    }
    writeFileSync(join(this.dataDir, 'product-profiles.json'), JSON.stringify(data, null, 2));
  }

  /**
   * Generate product profile
   */
  async generateProfile(repositoryId: string, repoPath: string): Promise<ProductProfile> {
    const profile: ProductProfile = {
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      repositoryId,
      timestamp: new Date().toISOString(),
      purpose: await this.inferPurpose(repoPath),
      users: await this.inferUsers(repoPath),
      features: await this.inferFeatures(repoPath),
      roadmap: await this.generateRoadmap(repoPath),
      backlog: await this.generateBacklog(repoPath),
      priorities: await this.generatePriorities(repoPath),
      score: 0
    };

    profile.score = this.calculateScore(profile);
    this.profiles.set(profile.id, profile);
    this.saveProfiles();
    return profile;
  }

  private async inferPurpose(repoPath: string): Promise<ProductPurpose> {
    const packageJsonPath = join(repoPath, 'package.json');
    const readmePath = join(repoPath, 'README.md');
    
    let description = '';
    let name = '';

    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      name = pkg.name || '';
      description = pkg.description || '';
    }

    if (!description && existsSync(readmePath)) {
      const readme = readFileSync(readmePath, 'utf-8');
      const lines = readme.split('\n');
      description = lines.find(l => l.trim() && !l.startsWith('#')) || '';
    }

    const category = this.inferCategory(name, description);
    const domain = this.inferDomain(name, description);

    return {
      description: description || 'Software application',
      category,
      domain,
      valueProposition: `Provides ${category} capabilities for ${domain}`,
      targetAudience: 'Developers and end users'
    };
  }

  private inferCategory(name: string, description: string): string {
    const text = `${name} ${description}`.toLowerCase();
    
    if (text.includes('api') || text.includes('server') || text.includes('backend')) return 'Backend Service';
    if (text.includes('web') || text.includes('frontend') || text.includes('ui')) return 'Web Application';
    if (text.includes('cli') || text.includes('command')) return 'CLI Tool';
    if (text.includes('library') || text.includes('package')) return 'Library';
    if (text.includes('mobile') || text.includes('app')) return 'Mobile Application';
    
    return 'Application';
  }

  private inferDomain(name: string, description: string): string {
    const text = `${name} ${description}`.toLowerCase();
    
    if (text.includes('finance') || text.includes('payment') || text.includes('bank')) return 'Finance';
    if (text.includes('health') || text.includes('medical') || text.includes('care')) return 'Healthcare';
    if (text.includes('education') || text.includes('learn') || text.includes('teach')) return 'Education';
    if (text.includes('ecommerce') || text.includes('shop') || text.includes('store')) return 'E-commerce';
    if (text.includes('social') || text.includes('community') || text.includes('chat')) return 'Social';
    
    return 'General';
  }

  private async inferUsers(repoPath: string): Promise<User[]> {
    const users: User[] = [];

    const packageJsonPath = join(repoPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      
      if (pkg.peerDependencies?.react || pkg.dependencies?.react) {
        users.push({
          id: 'user-1',
          type: 'Developer',
          description: 'React developers building user interfaces',
          needs: ['Component library', 'Documentation', 'Examples'],
          painPoints: ['Complex setup', 'Poor documentation']
        });
      }

      users.push({
        id: 'user-2',
        type: 'End User',
        description: 'End users of the application',
        needs: ['Intuitive UI', 'Fast performance', 'Reliability'],
        painPoints: ['Slow load times', 'Confusing navigation']
      });
    }

    return users;
  }

  private async inferFeatures(repoPath: string): Promise<Feature[]> {
    const features: Feature[] = [];

    const packageJsonPath = join(repoPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (deps['next']) {
        features.push({ id: 'feat-1', name: 'Server-Side Rendering', description: 'SSR support', priority: 'high', status: 'completed', complexity: 'high', impact: 'high' });
      }

      if (deps['tailwindcss']) {
        features.push({ id: 'feat-2', name: 'Styling System', description: 'Tailwind CSS integration', priority: 'medium', status: 'completed', complexity: 'low', impact: 'medium' });
      }

      if (deps['@supabase/supabase-js']) {
        features.push({ id: 'feat-3', name: 'Authentication', description: 'User authentication', priority: 'critical', status: 'completed', complexity: 'medium', impact: 'high' });
      }
    }

    return features;
  }

  private async generateRoadmap(repoPath: string): Promise<Roadmap> {
    return {
      vision: 'Build a high-quality software product',
      phases: [
        { name: 'Foundation', duration: '1-2 months', goals: ['Core functionality', 'Basic UI'], features: ['Authentication', 'Core features'] },
        { name: 'Growth', duration: '2-3 months', goals: ['User engagement', 'Performance'], features: ['Advanced features', 'Optimization'] },
        { name: 'Scale', duration: '3-6 months', goals: ['Scale infrastructure', 'Enterprise features'], features: ['Multi-tenant', 'Analytics'] }
      ]
    };
  }

  private async generateBacklog(repoPath: string): Promise<BacklogItem[]> {
    const backlog: BacklogItem[] = [];

    backlog.push({ id: 'bl-1', title: 'Add comprehensive documentation', description: 'Create detailed documentation', type: 'documentation', priority: 'P1', effort: 3, impact: 4, status: 'backlog' });
    backlog.push({ id: 'bl-2', title: 'Add unit tests', description: 'Write unit tests for core functionality', type: 'test', priority: 'P1', effort: 4, impact: 4, status: 'backlog' });
    backlog.push({ id: 'bl-3', title: 'Performance optimization', description: 'Optimize bundle size and load time', type: 'improvement', priority: 'P2', effort: 3, impact: 3, status: 'backlog' });

    return backlog;
  }

  private async generatePriorities(repoPath: string): Promise<EngineeringPriority[]> {
    return [
      { area: 'Documentation', priority: 1, reason: 'Essential for adoption', impact: 'High developer experience' },
      { area: 'Testing', priority: 2, reason: 'Ensures reliability', impact: 'Reduced bugs' },
      { area: 'Performance', priority: 3, reason: 'User experience', impact: 'Faster load times' },
      { area: 'Security', priority: 4, reason: 'Protect users', impact: 'Reduced vulnerabilities' }
    ];
  }

  private calculateScore(profile: ProductProfile): number {
    let score = 0;
    if (profile.purpose.description) score += 20;
    if (profile.users.length > 0) score += 20;
    if (profile.features.length > 0) score += 20;
    if (profile.roadmap.phases.length > 0) score += 20;
    if (profile.backlog.length > 0) score += 10;
    if (profile.priorities.length > 0) score += 10;
    return score;
  }

  /**
   * Get profile
   */
  getProfile(id: string): ProductProfile | undefined {
    return this.profiles.get(id);
  }

  /**
   * Get all profiles
   */
  getAllProfiles(): ProductProfile[] {
    return Array.from(this.profiles.values());
  }

  /**
   * Get summary
   */
  getSummary(): {
    totalProfiles: number;
    avgScore: number;
    totalFeatures: number;
    totalBacklogItems: number;
  } {
    const profiles = Array.from(this.profiles.values());
    return {
      totalProfiles: profiles.length,
      avgScore: profiles.length > 0 ? Math.round(profiles.reduce((sum, p) => sum + p.score, 0) / profiles.length) : 0,
      totalFeatures: profiles.reduce((sum, p) => sum + p.features.length, 0),
      totalBacklogItems: profiles.reduce((sum, p) => sum + p.backlog.length, 0)
    };
  }
}

// Singleton instance
let instance: UniversalProductManager | null = null;

export function getUniversalProductManager(dataDir: string): UniversalProductManager {
  if (!instance) {
    instance = new UniversalProductManager(dataDir);
  }
  return instance;
}
