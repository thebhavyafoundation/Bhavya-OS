/**
 * Engineering Marketplace
 * Bhavya OS v7.0 — Universal Autonomous Engineering System
 * 
 * Connect:
 * - Projects with workers
 * - Skills with tasks
 * - Demand with supply
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface MarketplaceListing {
  id: string;
  type: 'project' | 'worker' | 'skill';
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedHours: number;
  status: 'open' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface ProjectListing extends MarketplaceListing {
  type: 'project';
  repositoryUrl: string;
  budget?: number;
  deadline?: string;
}

export interface WorkerListing extends MarketplaceListing {
  type: 'worker';
  workerId: string;
  capabilities: string[];
  availability: 'available' | 'busy' | 'unavailable';
  rating: number;
  completedTasks: number;
}

export interface SkillListing extends MarketplaceListing {
  type: 'skill';
  skillName: string;
  category: string;
  prerequisites: string[];
  learningResources: string[];
}

export interface Match {
  id: string;
  projectId: string;
  workerId: string;
  score: number;
  reasons: string[];
  createdAt: string;
}

export class EngineeringMarketplace {
  private listings: Map<string, MarketplaceListing> = new Map();
  private matches: Map<string, Match> = new Map();
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadListings();
    this.loadMatches();
  }

  private loadListings(): void {
    const listingsFile = join(this.dataDir, 'marketplace-listings.json');
    if (existsSync(listingsFile)) {
      const data = JSON.parse(readFileSync(listingsFile, 'utf-8'));
      for (const [id, listing] of Object.entries(data)) {
        this.listings.set(id, listing as MarketplaceListing);
      }
    }
  }

  private saveListings(): void {
    const data: Record<string, MarketplaceListing> = {};
    for (const [id, listing] of this.listings) {
      data[id] = listing;
    }
    writeFileSync(join(this.dataDir, 'marketplace-listings.json'), JSON.stringify(data, null, 2));
  }

  private loadMatches(): void {
    const matchesFile = join(this.dataDir, 'marketplace-matches.json');
    if (existsSync(matchesFile)) {
      const data = JSON.parse(readFileSync(matchesFile, 'utf-8'));
      for (const [id, match] of Object.entries(data)) {
        this.matches.set(id, match as Match);
      }
    }
  }

  private saveMatches(): void {
    const data: Record<string, Match> = {};
    for (const [id, match] of this.matches) {
      data[id] = match;
    }
    writeFileSync(join(this.dataDir, 'marketplace-matches.json'), JSON.stringify(data, null, 2));
  }

  /**
   * Create project listing
   */
  createProjectListing(project: Omit<ProjectListing, 'id' | 'createdAt' | 'updatedAt'>): ProjectListing {
    const listing: ProjectListing = {
      ...project,
      id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.listings.set(listing.id, listing);
    this.saveListings();
    return listing;
  }

  /**
   * Create worker listing
   */
  createWorkerListing(worker: Omit<WorkerListing, 'id' | 'createdAt' | 'updatedAt'>): WorkerListing {
    const listing: WorkerListing = {
      ...worker,
      id: `worker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.listings.set(listing.id, listing);
    this.saveListings();
    return listing;
  }

  /**
   * Create skill listing
   */
  createSkillListing(skill: Omit<SkillListing, 'id' | 'createdAt' | 'updatedAt'>): SkillListing {
    const listing: SkillListing = {
      ...skill,
      id: `skill-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.listings.set(listing.id, listing);
    this.saveListings();
    return listing;
  }

  /**
   * Find matches for project
   */
  findMatches(projectId: string): Match[] {
    const project = this.listings.get(projectId) as ProjectListing;
    if (!project || project.type !== 'project') return [];

    const workers = Array.from(this.listings.values()).filter(
      l => l.type === 'worker' && (l as WorkerListing).availability === 'available'
    ) as WorkerListing[];

    const matches: Match[] = [];

    for (const worker of workers) {
      const score = this.calculateMatchScore(project, worker);
      if (score > 50) {
        const match: Match = {
          id: `match-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          projectId,
          workerId: worker.id,
          score,
          reasons: this.getMatchReasons(project, worker),
          createdAt: new Date().toISOString()
        };
        matches.push(match);
        this.matches.set(match.id, match);
      }
    }

    this.saveMatches();
    return matches.sort((a, b) => b.score - a.score);
  }

  private calculateMatchScore(project: ProjectListing, worker: WorkerListing): number {
    let score = 0;

    const commonSkills = project.skills.filter(s => worker.capabilities.includes(s));
    score += (commonSkills.length / project.skills.length) * 50;

    score += worker.rating * 10;

    score += Math.min(worker.completedTasks, 10) * 2;

    if (project.difficulty === worker.difficulty) score += 20;
    else if (project.difficulty === 'beginner' && worker.difficulty === 'intermediate') score += 10;

    return Math.min(100, Math.round(score));
  }

  private getMatchReasons(project: ProjectListing, worker: WorkerListing): string[] {
    const reasons: string[] = [];
    const commonSkills = project.skills.filter(s => worker.capabilities.includes(s));
    
    if (commonSkills.length > 0) {
      reasons.push(`Has ${commonSkills.length} matching skills: ${commonSkills.join(', ')}`);
    }
    if (worker.rating >= 4) {
      reasons.push(`High rating: ${worker.rating}/5`);
    }
    if (worker.completedTasks >= 10) {
      reasons.push(`Experienced: ${worker.completedTasks} completed tasks`);
    }

    return reasons;
  }

  /**
   * Get listing
   */
  getListing(id: string): MarketplaceListing | undefined {
    return this.listings.get(id);
  }

  /**
   * Get all listings
   */
  getAllListings(): MarketplaceListing[] {
    return Array.from(this.listings.values());
  }

  /**
   * Get matches
   */
  getMatches(projectId: string): Match[] {
    return Array.from(this.matches.values()).filter(m => m.projectId === projectId);
  }

  /**
   * Get summary
   */
  getSummary(): {
    totalListings: number;
    projects: number;
    workers: number;
    skills: number;
    totalMatches: number;
    avgMatchScore: number;
  } {
    const listings = Array.from(this.listings.values());
    const matches = Array.from(this.matches.values());

    return {
      totalListings: listings.length,
      projects: listings.filter(l => l.type === 'project').length,
      workers: listings.filter(l => l.type === 'worker').length,
      skills: listings.filter(l => l.type === 'skill').length,
      totalMatches: matches.length,
      avgMatchScore: matches.length > 0 ? Math.round(matches.reduce((sum, m) => sum + m.score, 0) / matches.length) : 0
    };
  }
}

// Singleton instance
let instance: EngineeringMarketplace | null = null;

export function getEngineeringMarketplace(dataDir: string): EngineeringMarketplace {
  if (!instance) {
    instance = new EngineeringMarketplace(dataDir);
  }
  return instance;
}
