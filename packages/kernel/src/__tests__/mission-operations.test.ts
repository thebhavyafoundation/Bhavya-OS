// Mission Operations Integration Test
// Tests the complete mission lifecycle end-to-end.

import { MissionService } from '../services/mission-service.js';
import { ResourceRegistry } from '../services/resource-registry.js';
import { ImpactRegistry } from '../services/impact-registry.js';

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

export class MissionOperationsTest {
  private results: TestResult[] = [];
  private missions: MissionService;
  private resources: ResourceRegistry;
  private impact: ImpactRegistry;

  constructor() {
    this.missions = new MissionService();
    this.resources = new ResourceRegistry();
    this.impact = new ImpactRegistry();
  }

  async runAll(): Promise<{ passed: number; failed: number; total: number; results: TestResult[] }> {
    console.log('=== Mission Operations Integration Test ===\n');

    // Phase 1: Initialize
    await this.test('Initialize all services', async () => {
      await this.missions.initialize();
      await this.resources.initialize();
      await this.impact.initialize();
    });

    // Phase 2: Create Mission
    let missionId = '';
    await this.test('Create Forest Restoration mission', async () => {
      const { success, mission } = await this.missions.execute({
        action: 'create',
        name: 'Forest Restoration Initiative',
        description: 'Restore 100 hectares of degraded forest in partnership with local communities.',
        domain: 'environment',
        owner: 'founder',
        budget: 500000,
      });
      if (!success || !mission) throw new Error('Failed to create mission');
      missionId = mission.id;
    });

    await this.test('Add objectives', async () => {
      await this.missions.execute({
        action: 'add-objective',
        missionId,
        objectiveTitle: 'Plant 50,000 native trees',
        objectiveDescription: 'Plant native species across degraded areas',
        measurableOutcome: 'Trees planted',
        targetValue: 50000,
      });
      await this.missions.execute({
        action: 'add-objective',
        missionId,
        objectiveTitle: 'Restore 100 hectares',
        measurableOutcome: 'Hectares restored',
        targetValue: 100,
      });
    });

    await this.test('Approve and start mission', async () => {
      await this.missions.execute({ action: 'approve', missionId, approver: 'chair' });
      await this.missions.execute({ action: 'start', missionId });
    });

    // Phase 3: Register Resources
    let volunteerId = '';
    let equipmentId = '';
    await this.test('Register volunteers', async () => {
      const { success, resource } = await this.resources.execute({
        action: 'register',
        missionId,
        type: 'volunteer',
        name: 'Volunteer Group A',
        description: '10 trained volunteers for plantation',
        quantity: 10,
        unit: 'people',
      });
      if (!success || !resource) throw new Error('Failed to register volunteers');
      volunteerId = resource.id;
    });

    await this.test('Register equipment', async () => {
      const { success, resource } = await this.resources.execute({
        action: 'register',
        missionId,
        type: 'equipment',
        name: 'Planting Tools',
        description: 'Shovels, spades, watering cans',
        quantity: 20,
        unit: 'pieces',
        cost: 5000,
      });
      if (!success || !resource) throw new Error('Failed to register equipment');
      equipmentId = resource.id;
    });

    await this.test('Register grant', async () => {
      await this.resources.execute({
        action: 'register',
        missionId,
        type: 'grant',
        name: 'UNESCO Environmental Grant',
        description: 'Grant for forest restoration',
        quantity: 1,
        unit: 'grant',
        cost: 250000,
        source: 'UNESCO',
      });
    });

    await this.test('Assign resources', async () => {
      await this.resources.execute({ action: 'assign', resourceId: volunteerId, assignedTo: 'project:village-a' });
      await this.resources.execute({ action: 'assign', resourceId: equipmentId, assignedTo: 'project:village-a' });
    });

    // Phase 4: Track Impact
    await this.test('Record impact metrics', async () => {
      await this.impact.execute({
        action: 'record-metric',
        missionId,
        metricId: 'trees-planted',
        value: 5000,
        notes: 'Phase 1 planting complete',
      });
      await this.impact.execute({
        action: 'record-metric',
        missionId,
        metricId: 'hectares-restored',
        value: 15,
      });
    });

    await this.test('Generate impact report', async () => {
      const { success, report } = await this.impact.execute({
        action: 'generate-report',
        missionId,
        period: '2026-Q1',
      });
      if (!success || !report) throw new Error('Failed to generate report');
    });

    // Phase 5: Timeline
    await this.test('Add timeline events', async () => {
      await this.missions.execute({
        action: 'add-timeline',
        missionId,
        timelineTitle: 'Phase 1 Complete',
        timelineDate: new Date('2026-09-30'),
        timelineType: 'milestone',
      });
      await this.missions.execute({
        action: 'add-timeline',
        missionId,
        timelineTitle: 'Mid-term Review',
        timelineDate: new Date('2026-12-31'),
        timelineType: 'review',
      });
    });

    // Phase 6: Query
    await this.test('Query mission', async () => {
      const { success, mission } = await this.missions.execute({ action: 'get', missionId });
      if (!success || !mission) throw new Error('Failed to get mission');
      if (mission.status !== 'active') throw new Error(`Wrong status: ${mission.status}`);
      if (mission.objectives.length !== 2) throw new Error(`Wrong objectives: ${mission.objectives.length}`);
    });

    await this.test('Query resources by mission', async () => {
      const { success, resources } = await this.resources.execute({ action: 'get-by-mission', missionId });
      if (!success) throw new Error('Failed to query resources');
      if (resources.length !== 3) throw new Error(`Wrong resources: ${resources.length}`);
    });

    await this.test('Query impact summary', async () => {
      const { success, summary } = await this.impact.execute({ action: 'get-summary', missionId });
      if (!success) throw new Error('Failed to get summary');
    });

    // Phase 7: Domain Query
    await this.test('Query missions by domain', async () => {
      const { success, missions } = await this.missions.execute({ action: 'get-by-domain', domainFilter: 'environment' });
      if (!success) throw new Error('Failed to query by domain');
      if (missions.length !== 1) throw new Error(`Wrong count: ${missions.length}`);
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
    console.log(`  Mission actions: ${this.missions.getAuditLog().length}`);
    console.log(`  Resource actions: ${this.resources.getAuditLog().length}`);
    console.log(`  Impact actions: ${this.impact.getAuditLog().length}`);

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
