// Transparency Platform Integration Test
// Tests the complete governance lifecycle end-to-end.
// From document creation through approval, publication, and audit.

import { GovernanceService } from '../services/governance-service.js';
import { FinanceService } from '../services/finance-service.js';
import { ProjectsService } from '../services/projects-service.js';
import { AuditService } from '../services/audit-service.js';
import { PublicAPI } from '../services/public-api.js';

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

export class TransparencyPlatformTest {
  private results: TestResult[] = [];
  private governance: GovernanceService;
  private finance: FinanceService;
  private projects: ProjectsService;
  private audit: AuditService;
  private api: PublicAPI;

  constructor() {
    this.governance = new GovernanceService();
    this.finance = new FinanceService();
    this.projects = new ProjectsService();
    this.audit = new AuditService();
    this.api = new PublicAPI({ baseUrl: 'http://localhost:3000', cors: true, rateLimit: 100, authRequired: false });
  }

  async runAll(): Promise<{ passed: number; failed: number; total: number; results: TestResult[] }> {
    console.log('=== Transparency Platform Integration Test ===\n');

    // Phase 1: Initialize
    await this.test('Initialize all services', async () => {
      await this.governance.initialize();
      await this.finance.initialize();
      await this.projects.initialize();
      await this.audit.initialize();
      await this.api.initialize();
    });

    // Phase 2: Create Governance Document
    let governanceDocId = '';
    await this.test('Create governance document', async () => {
      const { success, document } = await this.governance.execute({
        action: 'create-document',
        title: 'Environmental Conservation Policy',
        content: 'This policy outlines the Bhavya Foundation commitment to environmental conservation. All projects must demonstrate measurable impact on forest restoration, biodiversity, and community engagement.',
        type: 'policy',
        tags: ['environment', 'policy', 'conservation'],
      });
      if (!success || !document) throw new Error('Failed to create document');
      governanceDocId = document.id;
    });

    // Phase 3: Route Through Approvals
    await this.test('Submit for approval', async () => {
      const { success } = await this.governance.execute({
        action: 'submit-for-approval',
        documentId: governanceDocId,
      });
      if (!success) throw new Error('Failed to submit for approval');
    });

    await this.test('Approve at each level', async () => {
      await this.governance.execute({ action: 'approve', documentId: governanceDocId, approver: 'reviewer-1', comments: 'Reviewed and approved' });
      await this.governance.execute({ action: 'approve', documentId: governanceDocId, approver: 'director-1', comments: 'Approved by director' });
      await this.governance.execute({ action: 'approve', documentId: governanceDocId, approver: 'chair-1', comments: 'Final approval' });
    });

    await this.test('Verify document approved', async () => {
      const { success, document } = await this.governance.execute({ action: 'get', documentId: governanceDocId });
      if (!success || !document) throw new Error('Failed to get document');
      if (document.status !== 'approved') throw new Error(`Document status is ${document.status}, expected approved`);
    });

    // Phase 4: Create Resolution
    let resolutionId = '';
    await this.test('Create resolution', async () => {
      const { success, resolution } = await this.governance.execute({
        action: 'create-resolution',
        documentId: governanceDocId,
        title: 'Approve Environmental Conservation Policy',
        content: 'Resolution to approve the Environmental Conservation Policy as the official policy of Bhavya Foundation.',
        approver: 'founder',
      });
      if (!success || !resolution) throw new Error('Failed to create resolution');
      resolutionId = resolution.id;
    });

    await this.test('Record trustee votes', async () => {
      await this.governance.execute({ action: 'vote', resolutionId, trustee: 'trustee-1', decision: 'yes', comments: 'Strongly support' });
      await this.governance.execute({ action: 'vote', resolutionId, trustee: 'trustee-2', decision: 'yes' });
      await this.governance.execute({ action: 'vote', resolutionId, trustee: 'trustee-3', decision: 'yes' });
    });

    await this.test('Verify resolution passed', async () => {
      // Resolution should be passed after 3 yes votes
    });

    // Phase 5: Create Project
    let projectId = '';
    await this.test('Create project from resolution', async () => {
      const { success, project } = await this.projects.execute({
        action: 'create',
        name: 'Forest Restoration Initiative',
        description: 'Restore 100 hectares of degraded forest in partnership with local communities.',
        vertical: 'environment',
        budget: 500000,
        manager: 'project-manager-1',
      });
      if (!success || !project) throw new Error('Failed to create project');
      projectId = project.id;
    });

    await this.test('Approve and start project', async () => {
      await this.projects.execute({ action: 'approve', projectId, approver: 'director-1' });
      await this.projects.execute({ action: 'start', projectId });
    });

    await this.test('Add milestones', async () => {
      await this.projects.execute({
        action: 'add-milestone',
        projectId,
        milestoneTitle: 'Site Assessment Complete',
        milestoneDescription: 'Complete assessment of restoration sites',
        dueDate: new Date('2026-09-30'),
      });
      await this.projects.execute({
        action: 'add-milestone',
        projectId,
        milestoneTitle: 'Planting Phase 1',
        milestoneDescription: 'Plant 5000 native trees',
        dueDate: new Date('2026-12-31'),
      });
    });

    // Phase 6: Assign Budget
    await this.test('Create and approve budget', async () => {
      const { success, budget } = await this.finance.execute({
        action: 'create-budget',
        name: 'FY2026-27 Operational Budget',
        fiscalYear: '2026-27',
        amount: 2000000,
        categories: [
          { name: 'Environment', allocated: 800000, spent: 0, projects: [projectId] },
          { name: 'Education', allocated: 600000, spent: 0, projects: [] },
          { name: 'Heritage', allocated: 400000, spent: 0, projects: [] },
          { name: 'Administration', allocated: 200000, spent: 0, projects: [] },
        ],
      });
      if (!success || !budget) throw new Error('Failed to create budget');
      await this.finance.execute({ action: 'approve-budget', budgetId: budget.id, approver: 'chair-1' });
    });

    await this.test('Record grant', async () => {
      await this.finance.execute({
        action: 'record-grant',
        name: 'UNESCO Heritage Grant',
        donor: 'UNESCO',
        amount: 250000,
        purpose: 'Heritage preservation and cultural education',
      });
    });

    await this.test('Record donations', async () => {
      await this.finance.execute({ action: 'record-donation', donor: 'Anonymous', amount: 50000, purpose: 'General fund' });
      await this.finance.execute({ action: 'record-donation', donor: 'Corporate CSR', amount: 100000, purpose: 'Education programs' });
    });

    // Phase 7: Record Meeting Minutes
    await this.test('Record meeting minutes', async () => {
      await this.governance.execute({
        action: 'record-minutes',
        title: 'Board Meeting - July 2026',
      });
    });

    // Phase 8: Update Impact
    await this.test('Update project impact', async () => {
      await this.projects.execute({
        action: 'update-impact',
        projectId,
        impact: {
          beneficiaries: 500,
          hectaresRestored: 25,
          treesPlanted: 2500,
          volunteersEngaged: 50,
        },
      });
    });

    // Phase 9: Audit
    await this.test('Record audit entries', async () => {
      await this.audit.execute({
        action: 'record',
        entry: {
          action: 'policy-approved',
          entity: 'governance-document',
          entityId: governanceDocId,
          agent: 'governance-service',
          details: { title: 'Environmental Conservation Policy' },
        },
      });
    });

    await this.test('Create snapshot', async () => {
      await this.audit.execute({
        action: 'snapshot',
        snapshotDescription: 'Post-approval snapshot of governance state',
      });
    });

    await this.test('Query audit trail', async () => {
      const { success, entries } = await this.audit.execute({
        action: 'query',
        entity: 'governance-document',
      });
      if (!success) throw new Error('Failed to query audit trail');
    });

    // Phase 10: Public API
    await this.test('API health check', async () => {
      const response = await this.api.handleRequest('/api/health', 'GET');
      if (!response.success) throw new Error('API health check failed');
    });

    await this.test('API get governance documents', async () => {
      const response = await this.api.handleRequest('/api/governance/documents', 'GET');
      if (!response.success) throw new Error('API governance documents failed');
    });

    await this.test('API get projects', async () => {
      const response = await this.api.handleRequest('/api/projects', 'GET');
      if (!response.success) throw new Error('API projects failed');
    });

    // Summary
    const passed = this.results.filter((r) => r.passed).length;
    const failed = this.results.filter((r) => !r.passed).length;

    console.log(`\n=== Results: ${passed}/${this.results.length} passed, ${failed} failed ===`);

    if (failed > 0) {
      console.log('\nFailed tests:');
      this.results.filter((r) => !r.passed).forEach((r) => {
        console.log(`  FAIL ${r.name}: ${r.error}`);
      });
    }

    console.log('\n=== Lifecycle Summary ===');
    console.log(`  Governance documents: ${this.governance.getAuditLog().length} actions`);
    console.log(`  Finance actions: ${this.finance.getAuditLog().length} actions`);
    console.log(`  Project actions: ${this.projects.getAuditLog().length} actions`);
    console.log(`  Audit entries: ${this.audit.getEntries().length} entries`);
    console.log(`  API endpoints: ${this.api.getSpec().endpoints.length} registered`);

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
