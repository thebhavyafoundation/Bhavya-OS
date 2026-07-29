// Human Capital Platform Integration Test
// Tests the complete people lifecycle end-to-end.

import { PeopleRegistry } from '../services/people-registry.js';
import { MissionAssignmentService } from '../services/mission-assignment.js';
import { RecognitionService } from '../services/recognition-service.js';

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

export class HumanCapitalTest {
  private results: TestResult[] = [];
  private people: PeopleRegistry;
  private assignments: MissionAssignmentService;
  private recognition: RecognitionService;

  constructor() {
    this.people = new PeopleRegistry();
    this.assignments = new MissionAssignmentService();
    this.recognition = new RecognitionService();
  }

  async runAll(): Promise<{ passed: number; failed: number; total: number; results: TestResult[] }> {
    console.log('=== Human Capital Platform Integration Test ===\n');

    // Phase 1: Initialize
    await this.test('Initialize all services', async () => {
      await this.people.initialize();
      await this.assignments.initialize();
      await this.recognition.initialize();
    });

    // Phase 2: Register Person
    let personId = '';
    await this.test('Register new person', async () => {
      const { success, person } = await this.people.execute({
        action: 'register',
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya@example.com',
        phone: '+91-9876543210',
        skills: [{ name: 'tree-plantation', level: 'intermediate', verified: true }],
        interests: ['environment', 'education'],
        languages: ['english', 'hindi'],
      });
      if (!success || !person) throw new Error('Failed to register person');
      personId = person.id;
    });

    await this.test('Verify person', async () => {
      const { success } = await this.people.execute({ action: 'verify', personId });
      if (!success) throw new Error('Failed to verify person');
    });

    await this.test('Assign role', async () => {
      const { success } = await this.people.execute({
        action: 'assign-role',
        personId,
        role: 'volunteer',
      });
      if (!success) throw new Error('Failed to assign role');
    });

    await this.test('Add skill', async () => {
      const { success } = await this.people.execute({
        action: 'add-skill',
        personId,
        skillName: 'first-aid',
        skills: [{ name: 'first-aid', level: 'beginner', verified: false }],
      });
      if (!success) throw new Error('Failed to add skill');
    });

    await this.test('Add certification', async () => {
      const { success } = await this.people.execute({
        action: 'add-certification',
        personId,
        certName: 'Tree Plantation Expert',
        certOrg: 'Bhavya Foundation',
      });
      if (!success) throw new Error('Failed to add certification');
    });

    await this.test('Log training', async () => {
      const { success } = await this.people.execute({
        action: 'log-training',
        personId,
        trainingName: 'Volunteer Orientation',
      });
      if (!success) throw new Error('Failed to log training');
    });

    // Phase 3: Mission Assignment
    let assignmentId = '';
    await this.test('Propose assignment', async () => {
      const { success, assignment } = await this.assignments.execute({
        action: 'propose',
        missionId: 'mission:forest-restoration',
        personId,
        role: 'plantation-lead',
        requiredSkills: ['tree-plantation', 'first-aid'],
      });
      if (!success || !assignment) throw new Error('Failed to propose assignment');
      assignmentId = assignment.id;
    });

    await this.test('Accept assignment', async () => {
      const { success } = await this.assignments.execute({ action: 'accept', assignmentId });
      if (!success) throw new Error('Failed to accept assignment');
    });

    await this.test('Log hours', async () => {
      const { success } = await this.assignments.execute({
        action: 'log-hours',
        assignmentId,
        hours: 8,
      });
      if (!success) throw new Error('Failed to log hours');
    });

    await this.test('Log task completion', async () => {
      const { success } = await this.assignments.execute({ action: 'log-task', assignmentId });
      if (!success) throw new Error('Failed to log task');
    });

    // Phase 4: Recognition
    await this.test('Award hours', async () => {
      const { success } = await this.recognition.execute({
        action: 'award-hours',
        personId,
        missionId: 'mission:forest-restoration',
        hours: 8,
        description: 'Plantation work at Village A',
        publicVisible: true,
      });
      if (!success) throw new Error('Failed to award hours');
    });

    await this.test('Award achievement', async () => {
      const { success } = await this.recognition.execute({
        action: 'award-achievement',
        personId,
        achievementName: 'First 100 Trees Planted',
        description: 'Planted 100 native trees in single session',
        publicVisible: true,
      });
      if (!success) throw new Error('Failed to award achievement');
    });

    await this.test('Award certificate', async () => {
      const { success } = await this.recognition.execute({
        action: 'award-certificate',
        personId,
        certName: 'Forest Guardian Certificate',
        description: 'Awarded for outstanding contribution to forest restoration',
        publicVisible: true,
      });
      if (!success) throw new Error('Failed to award certificate');
    });

    await this.test('Add recommendation', async () => {
      const { success } = await this.recognition.execute({
        action: 'add-recommendation',
        personId,
        recommendedBy: 'project-lead',
        description: 'Priya showed exceptional leadership during plantation drive.',
      });
      if (!success) throw new Error('Failed to add recommendation');
    });

    // Phase 5: Query
    await this.test('Get person profile', async () => {
      const { success, person } = await this.people.execute({ action: 'get', personId });
      if (!success || !person) throw new Error('Failed to get person');
      if (person.status !== 'active') throw new Error(`Wrong status: ${person.status}`);
      if (person.roles.length === 0) throw new Error('No roles');
    });

    await this.test('Search people', async () => {
      const { success, people } = await this.people.execute({ action: 'search', query: 'Priya' });
      if (!success) throw new Error('Failed to search');
      if (people.length === 0) throw new Error('No results');
    });

    await this.test('Get people by skill', async () => {
      const { success, people } = await this.people.execute({ action: 'get-by-skill', skillFilter: 'tree-plantation' });
      if (!success) throw new Error('Failed to get by skill');
    });

    await this.test('Get assignments by person', async () => {
      const { success, assignments } = await this.assignments.execute({ action: 'get-by-person', personId });
      if (!success) throw new Error('Failed to get assignments');
      if (assignments.length === 0) throw new Error('No assignments');
    });

    await this.test('Get recognition stats', async () => {
      const { success, stats } = await this.recognition.execute({ action: 'get-stats', personId });
      if (!success) throw new Error('Failed to get stats');
    });

    await this.test('Get public recognition', async () => {
      const { success, recognitions } = await this.recognition.execute({ action: 'get-public' });
      if (!success) throw new Error('Failed to get public recognition');
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
    console.log(`  People actions: ${this.people.getAuditLog().length}`);
    console.log(`  Assignment actions: ${this.assignments.getAuditLog().length}`);
    console.log(`  Recognition actions: ${this.recognition.getAuditLog().length}`);

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
