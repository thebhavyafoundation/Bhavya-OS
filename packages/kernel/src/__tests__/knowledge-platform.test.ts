// Knowledge Platform Integration Test
// Tests the complete end-to-end workflow.

import { KnowledgePlatformService } from '../services/knowledge-platform.js';

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

export class KnowledgePlatformTest {
  private results: TestResult[] = [];
  private service: KnowledgePlatformService;

  constructor(root: string) {
    this.service = new KnowledgePlatformService(root);
  }

  async runAll(): Promise<{ passed: number; failed: number; total: number; results: TestResult[] }> {
    console.log('=== Knowledge Platform Test ===\n');

    await this.test('Initialize service', async () => {
      await this.service.initialize();
    });

    await this.test('Upload document', async () => {
      const { success, document } = await this.service.execute({
        action: 'upload',
        title: 'Bhavya Foundation Research Report',
        content: 'This is a comprehensive research report on environmental conservation efforts. The Bhavya Foundation has been working to restore forests and empower communities. Our education programs have reached over 10,000 students across 50 schools.',
        format: 'markdown',
        topic: 'environment',
        type: 'report',
      });
      if (!success || !document) throw new Error('Upload failed');
      if (document.topic !== 'environment') throw new Error('Wrong topic');
      if (document.summary.length === 0) throw new Error('No summary');
    });

    await this.test('Classify content', async () => {
      const { document } = await this.service.execute({
        action: 'upload',
        title: 'Volunteer Onboarding Guide',
        content: 'Welcome to Bhavya Foundation! This guide will help you get started as a volunteer. You will learn about our mission, values, and how you can contribute to our goals.',
      });
      if (!document) throw new Error('No document');
      if (document.type !== 'guide') throw new Error('Wrong type');
    });

    await this.test('Extract entities', async () => {
      const { document } = await this.service.execute({
        action: 'upload',
        title: 'Partnership with UNESCO',
        content: 'Bhavya Foundation has partnered with UNESCO to preserve heritage sites. The collaboration will focus on temple restoration and cultural preservation.',
      });
      if (!document) throw new Error('No document');
      if (document.entities.length === 0) throw new Error('No entities extracted');
    });

    await this.test('Generate summary', async () => {
      const { success, summary, keyPoints } = await this.service.execute({
        action: 'summary',
        content: 'The Bhavya Foundation was established in 2024. Our mission is to restore nature, empower humanity, and preserve heritage. We operate across three verticals: environment, education, and heritage. Our impact includes restoring 1000 hectares of forest, educating 10,000 students, and preserving 50 heritage sites.',
      });
      if (!success) throw new Error('Summary failed');
      if (summary.length === 0) throw new Error('No summary');
    });

    await this.test('Search documents', async () => {
      const { success, results } = await this.service.execute({
        action: 'search',
        query: 'environment forest',
      });
      if (!success) throw new Error('Search failed');
      if (results.length === 0) throw new Error('No results');
    });

    await this.test('Find related documents', async () => {
      const docs = this.service.getAllDocuments();
      if (docs.length < 2) throw new Error('Need at least 2 documents');

      const { success, related } = await this.service.execute({
        action: 'related',
        documentId: docs[0].id,
      });
      if (!success) throw new Error('Find related failed');
    });

    await this.test('Track provenance', async () => {
      const docs = this.service.getAllDocuments();
      const doc = docs[0];
      if (!doc) throw new Error('No document');

      if (doc.provenance.version !== 1) throw new Error('Wrong version');
      if (doc.provenance.history.length === 0) throw new Error('No history');
    });

    await this.test('Audit trail', async () => {
      const auditLog = this.service.getAuditLog();
      if (auditLog.length === 0) throw new Error('No audit entries');
    });

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
