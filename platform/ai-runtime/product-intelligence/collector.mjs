/**
 * Metrics Collector
 * Bhavya OS v6.0 — Autonomous Product Studio
 * 
 * Collects metrics from all applications
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { getProductIntelligenceEngine } from './engine.mjs';

const APPS_DIR = join(process.cwd(), '..', '..', 'apps');

const APPLICATIONS = [
  { id: 'APP-001', name: 'Foundation Website', dir: 'website' },
  { id: 'APP-002', name: 'Transparency Portal', dir: 'transparency' },
  { id: 'APP-003', name: 'Administration Platform', dir: 'admin' },
  { id: 'APP-004', name: 'Knowledge Platform', dir: 'knowledge-studio' }
];

export class MetricsCollector {
  private engine = getProductIntelligenceEngine();

  /**
   * Collect metrics from all applications
   */
  async collectAll(): Promise<void> {
    console.log('Collecting metrics from all applications...');

    for (const app of APPLICATIONS) {
      const appDir = join(APPS_DIR, app.dir);
      if (existsSync(appDir)) {
        console.log(`Collecting metrics from ${app.name}...`);
        await this.engine.collectMetrics(app.id, appDir);
      }
    }

    console.log('Metrics collection complete.');
  }

  /**
   * Collect metrics from a specific application
   */
  async collectApp(appId: string): Promise<void> {
    const app = APPLICATIONS.find(a => a.id === appId);
    if (!app) {
      console.error(`Application ${appId} not found`);
      return;
    }

    const appDir = join(APPS_DIR, app.dir);
    if (existsSync(appDir)) {
      console.log(`Collecting metrics from ${app.name}...`);
      await this.engine.collectMetrics(app.id, appDir);
    }
  }

  /**
   * Get collection summary
   */
  getSummary(): void {
    const summary = this.engine.getSummary();
    console.log('\n=== Metrics Collection Summary ===');
    console.log(`Total Apps: ${summary.totalApps}`);
    console.log(`Total Metrics: ${summary.totalMetrics}`);
    console.log(`Avg Performance: ${summary.avgPerformance.toFixed(1)}`);
    console.log(`Avg Accessibility: ${summary.avgAccessibility.toFixed(1)}`);
    console.log(`Avg SEO: ${summary.avgSeo.toFixed(1)}`);
    console.log(`Total Errors: ${summary.totalErrors}`);
    console.log(`Total Page Views: ${summary.totalPageViews}`);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const collector = new MetricsCollector();
  collector.collectAll().then(() => {
    collector.getSummary();
  });
}
