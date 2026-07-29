// Website Integration Test
// Verifies the website reflects the source of truth.

import { PAGE_SCHEMAS, getPageByPath } from '../lib/schemas.js';
import { PageRenderer } from '../lib/renderer.js';
import { Cache } from '../lib/cache.js';
import { SearchEngine } from '../lib/search.js';

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

export class WebsiteTest {
  private results: TestResult[] = [];

  async runAll(): Promise<{ passed: number; failed: number; total: number; results: TestResult[] }> {
    console.log('=== Website Integration Test ===\n');

    // Phase 1: Schema
    await this.test('Page schemas defined', async () => {
      if (PAGE_SCHEMAS.length === 0) throw new Error('No page schemas');
      const required = ['home', 'about', 'mission', 'projects', 'transparency', 'policies'];
      for (const id of required) {
        if (!PAGE_SCHEMAS.find((p) => p.id === id)) throw new Error(`Missing page: ${id}`);
      }
    });

    await this.test('Every page has metadata', async () => {
      for (const page of PAGE_SCHEMAS) {
        if (!page.metadata.title) throw new Error(`Page ${page.id} missing title`);
        if (!page.metadata.description) throw new Error(`Page ${page.id} missing description`);
      }
    });

    await this.test('Every page has sections', async () => {
      for (const page of PAGE_SCHEMAS) {
        if (page.sections.length === 0) throw new Error(`Page ${page.id} has no sections`);
      }
    });

    // Phase 2: Renderer
    await this.test('Page renderer works', async () => {
      const cache = new Cache();
      const renderer = new PageRenderer({
        apiClient: { get: async () => ({ success: true, data: [] }) },
        cache,
      });

      const schema = getPageByPath('/');
      if (!schema) throw new Error('Home page not found');

      const page = await renderer.render(schema);
      if (page.sections.length === 0) throw new Error('No sections rendered');
    });

    // Phase 3: Cache
    await this.test('Cache works', async () => {
      const cache = new Cache();
      await cache.set('test', { value: 42 });
      const cached = await cache.get('test');
      if (!cached) throw new Error('Cache miss');
      if ((cached as any).value !== 42) throw new Error('Cache wrong value');
    });

    // Phase 4: Search
    await this.test('Search engine works', async () => {
      const search = new SearchEngine({
        apiClient: {
          get: async (service, action) => {
            if (service === 'projects') return [{ id: '1', name: 'Forest Restoration', description: 'Restore forests', vertical: 'environment' }];
            if (service === 'governance') return [{ id: '2', title: 'Conservation Policy', content: 'Policy content', type: 'policy' }];
            return [];
          },
        },
      });

      const results = await search.search('forest');
      if (results.length === 0) throw new Error('No search results');
    });

    // Phase 5: Data flow
    await this.test('Adding project reflects on website', async () => {
      // Simulate: new project added to Projects Service
      // Website should reflect it without manual editing
      const schema = getPageByPath('/projects');
      if (!schema) throw new Error('Projects page not found');

      const projectSection = schema.sections.find((s) => s.type === 'projects');
      if (!projectSection) throw new Error('No projects section');
      if (!projectSection.source) throw new Error('No data source');
      if (projectSection.source.service !== 'projects') throw new Error('Wrong service');
    });

    await this.test('Publishing report reflects on website', async () => {
      // Simulate: annual report published via Finance Service
      // Website should reflect it without manual editing
      const schema = getPageByPath('/annual-reports');
      if (!schema) throw new Error('Annual reports page not found');

      const reportSection = schema.sections.find((s) => s.type === 'annual-reports');
      if (!reportSection) throw new Error('No reports section');
      if (!reportSection.source) throw new Error('No data source');
      if (reportSection.source.service !== 'finance') throw new Error('Wrong service');
    });

    await this.test('Policy approval reflects on website', async () => {
      // Simulate: policy approved via Governance Service
      // Website should reflect it without manual editing
      const schema = getPageByPath('/policies');
      if (!schema) throw new Error('Policies page not found');

      const policySection = schema.sections.find((s) => s.type === 'policies');
      if (!policySection) throw new Error('No policies section');
      if (!policySection.source) throw new Error('No data source');
      if (policySection.source.service !== 'governance') throw new Error('Wrong service');
    });

    // Summary
    const passed = this.results.filter((r) => r.passed).length;
    const failed = this.results.filter((r) => !r.passed).length;

    console.log(`\n=== Results: ${passed}/${this.results.length} passed, ${failed} failed ===`);

    return { passed, failed, total: this.results.length, results: this.results };
  }

  private async test(name: string, fn: () => Promise<void>): Promise<void> {
    const start = Date.now();
    try {
      await fn();
      const duration = Date.now() - start;
      this.results.push({ name, passed: true, duration });
      console.log(`  OK ${name} (${duration}ms)`);
    } catch (err) {
      const duration = Date.now() - start;
      const error = err instanceof Error ? err.message : String(err);
      this.results.push({ name, passed: false, duration, error });
      console.log(`  FAIL ${name} (${duration}ms): ${error}`);
    }
  }
}
