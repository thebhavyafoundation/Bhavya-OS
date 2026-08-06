/**
 * Business Intelligence
 * Bhavya OS v6.0 — Autonomous Product Studio
 * 
 * Dashboard with all metrics:
 * - Product metrics
 * - Revenue metrics
 * - User metrics
 * - Engineering metrics
 * - Foundation metrics
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'business-intelligence', 'data');

interface DashboardMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  timestamp: string;
}

interface Dashboard {
  id: string;
  timestamp: string;
  products: ProductMetrics;
  revenue: RevenueMetrics;
  users: UserMetrics;
  engineering: EngineeringMetrics;
  foundation: FoundationMetrics;
}

interface ProductMetrics {
  totalApps: number;
  activeApps: number;
  totalFeatures: number;
  completedFeatures: number;
  avgScore: number;
}

interface RevenueMetrics {
  totalDonations: number;
  donationCount: number;
  avgDonation: number;
  monthlyGrowth: number;
}

interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  retention: number;
}

interface EngineeringMetrics {
  totalCommits: number;
  avgPRSize: number;
  deployFrequency: number;
  mttr: number;
}

interface FoundationMetrics {
  volunteers: number;
  projects: number;
  events: number;
  impact: number;
}

export class BusinessIntelligence {
  private dashboards: Dashboard[] = [];
  private dataDir: string;

  constructor() {
    this.dataDir = DATA_DIR;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadDashboards();
  }

  private loadDashboards(): void {
    const dashboardsFile = join(this.dataDir, 'dashboards.json');
    if (existsSync(dashboardsFile)) {
      this.dashboards = JSON.parse(readFileSync(dashboardsFile, 'utf-8'));
    }
  }

  private saveDashboards(): void {
    writeFileSync(
      join(this.dataDir, 'dashboards.json'),
      JSON.stringify(this.dashboards, null, 2)
    );
  }

  /**
   * Generate dashboard
   */
  generateDashboard(): Dashboard {
    const dashboard: Dashboard = {
      id: `dashboard-${Date.now()}`,
      timestamp: new Date().toISOString(),
      products: this.getProductMetrics(),
      revenue: this.getRevenueMetrics(),
      users: this.getUserMetrics(),
      engineering: this.getEngineeringMetrics(),
      foundation: this.getFoundationMetrics()
    };

    this.dashboards.push(dashboard);
    this.saveDashboards();
    return dashboard;
  }

  /**
   * Get product metrics
   */
  private getProductMetrics(): ProductMetrics {
    return {
      totalApps: 10,
      activeApps: 4,
      totalFeatures: 33,
      completedFeatures: 15,
      avgScore: 85.79
    };
  }

  /**
   * Get revenue metrics
   */
  private getRevenueMetrics(): RevenueMetrics {
    return {
      totalDonations: 0,
      donationCount: 0,
      avgDonation: 0,
      monthlyGrowth: 0
    };
  }

  /**
   * Get user metrics
   */
  private getUserMetrics(): UserMetrics {
    return {
      totalUsers: 0,
      activeUsers: 0,
      newUsers: 0,
      retention: 0
    };
  }

  /**
   * Get engineering metrics
   */
  private getEngineeringMetrics(): EngineeringMetrics {
    return {
      totalCommits: 0,
      avgPRSize: 0,
      deployFrequency: 0,
      mttr: 0
    };
  }

  /**
   * Get foundation metrics
   */
  private getFoundationMetrics(): FoundationMetrics {
    return {
      volunteers: 0,
      projects: 0,
      events: 0,
      impact: 0
    };
  }

  /**
   * Get latest dashboard
   */
  getLatestDashboard(): Dashboard | undefined {
    return this.dashboards[this.dashboards.length - 1];
  }

  /**
   * Get all dashboards
   */
  getAllDashboards(): Dashboard[] {
    return this.dashboards;
  }

  /**
   * Get dashboard summary
   */
  getSummary(): {
    totalDashboards: number;
    latestTimestamp: string | null;
    overallScore: number;
  } {
    const latest = this.getLatestDashboard();
    return {
      totalDashboards: this.dashboards.length,
      latestTimestamp: latest?.timestamp || null,
      overallScore: latest?.products.avgScore || 0
    };
  }
}

// Singleton instance
let instance: BusinessIntelligence | null = null;

export function getBusinessIntelligence(): BusinessIntelligence {
  if (!instance) {
    instance = new BusinessIntelligence();
  }
  return instance;
}
