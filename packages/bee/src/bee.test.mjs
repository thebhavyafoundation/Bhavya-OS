import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { ExecutionEngine } from './index.mjs';
import { parseGoal } from './planners/goal-planner.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..', '..', '..');

describe('Bhavya Execution Engine', () => {
  let engine;

  before(() => {
    engine = new ExecutionEngine({
      barPath: join(ROOT, 'bar'),
      stateDir: join(ROOT, 'bar', 'bee-state'),
      log: () => {},
    });
  });

  describe('Goal Parsing', () => {
    it('should parse a create intent', () => {
      const goal = parseGoal('Create a Grade 8 Biology lesson');
      assert.equal(goal.intent, 'create');
      assert.equal(goal.domain, 'academics');
      assert.equal(goal.subject, 'biology');
      assert.equal(goal.gradeLevel, '8');
    });

    it('should parse an ingest intent', () => {
      const goal = parseGoal('Ingest a research paper on machine learning');
      assert.equal(goal.intent, 'ingest');
      assert.equal(goal.domain, 'knowledge');
    });

    it('should parse a publish intent', () => {
      const goal = parseGoal('Publish a newsletter article');
      assert.equal(goal.intent, 'publish');
    });

    it('should extract item counts', () => {
      const goal = parseGoal('Create 15 MCQ questions for Grade 10 Physics');
      assert.equal(goal.params.itemCount, 15);
      assert.equal(goal.params.itemType, 'mcq');
    });
  });

  describe('Planning', () => {
    it('should generate a plan from a natural language goal', () => {
      const plan = engine.plan('Create a Grade 8 Biology lesson');
      assert(plan, 'Should generate a plan');
      assert(plan.id, 'Should have a plan ID');
      assert.equal(plan.goal, 'Create a Grade 8 Biology lesson');
      assert(plan.nodes.length > 0, 'Should have execution nodes');
      assert(plan.layers.length > 0, 'Should have execution layers');
    });

    it('should resolve capabilities from BAR', () => {
      const plan = engine.plan('Create a Grade 8 Biology lesson');
      const capIds = plan.nodes.map(n => n.capabilityId);
      assert(capIds.length > 0, 'Should resolve capabilities');
      // All capability IDs should start with D (domain prefix)
      assert(capIds.every(id => /^D\d{2}-C\d{2,3}$/.test(id)), 'Should have valid capability IDs');
    });

    it('should assign agents to nodes', () => {
      const plan = engine.plan('Create a Grade 8 Biology lesson');
      const agents = plan.nodes.map(n => n.agentId).filter(Boolean);
      assert(agents.length > 0, 'Should assign agents');
    });

    it('should build proper DAG structure', () => {
      const plan = engine.plan('Create a Grade 8 Biology lesson');
      // Each node's dependencies should reference valid node IDs
      const nodeIds = new Set(plan.nodes.map(n => n.id));
      for (const node of plan.nodes) {
        for (const dep of node.dependencies) {
          assert(nodeIds.has(dep), `Dependency ${dep} should be a valid node ID`);
        }
      }
    });

    it('should create a graph text representation', () => {
      const plan = engine.plan('Create a Grade 8 Biology lesson');
      const graph = engine.graph(plan.id);
      assert(graph, 'Should generate graph text');
      assert(graph.includes('Execution Plan:'), 'Should include header');
      assert(graph.includes('Layer'), 'Should include layers');
    });
  });

  describe('Execution', () => {
    it('should execute a plan in dry-run mode', async () => {
      const plan = engine.plan('Create a Grade 8 Biology lesson');
      const result = await engine.execute(plan.id, { dryRun: true });
      assert.equal(result.status, 'completed');
      assert(result.metrics.completed > 0, 'Should have completed nodes');
    });

    it('should persist execution state', async () => {
      const plan = engine.plan('Create a Grade 8 Biology lesson');
      await engine.execute(plan.id, { dryRun: true });
      const info = engine.inspect(plan.id);
      assert(info, 'Should persist state');
      assert.equal(info.status, 'completed');
    });

    it('should emit events during execution', async () => {
      const events = [];
      engine.events.on('plan.started', (e) => events.push(e));
      engine.events.on('plan.completed', (e) => events.push(e));

      const plan = engine.plan('Create a Grade 8 Biology lesson');
      await engine.execute(plan.id, { dryRun: true });

      assert(events.some(e => e.type === 'plan.started'), 'Should emit plan.started');
      assert(events.some(e => e.type === 'plan.completed'), 'Should emit plan.completed');
    });
  });

  describe('Agent Resolution', () => {
    it('should resolve agents for capabilities', () => {
      const plan = engine.plan('Create a Grade 8 Biology lesson');
      const agentInfo = engine.agents();
      assert(agentInfo.length > 0, 'Should have agents');
    });
  });

  describe('Observability', () => {
    it('should record execution trace', async () => {
      const plan = engine.plan('Create a Grade 8 Biology lesson');
      await engine.execute(plan.id, { dryRun: true });
      const trace = engine.trace(plan.id);
      assert(trace.length > 0, 'Should record trace');
    });
  });

  describe('Capability Listing', () => {
    it('should list capabilities from BAR', () => {
      const caps = engine.capabilities();
      assert(caps.length > 0, 'Should list capabilities');
      assert(caps[0].id, 'Should have ID');
      assert(caps[0].name, 'Should have name');
    });
  });

  describe('End-to-End Acceptance', () => {
    it('should execute "Create a Grade 8 Biology lesson" completely', async () => {
      // 1. Plan
      const plan = engine.plan('Create a Grade 8 Biology lesson');
      assert(plan.nodes.length > 0, 'Step 1: Should generate execution plan');

      // 2. Build graph
      const graph = engine.graph(plan.id);
      assert(graph.includes('Layer'), 'Step 2: Should build dependency graph');

      // 3. Execute
      const result = await engine.execute(plan.id, { dryRun: true });
      assert.equal(result.status, 'completed', 'Step 3: Should execute plan');

      // 4. Verify state persisted
      const info = engine.inspect(plan.id);
      assert(info, 'Step 4: Should persist state');
      assert.equal(info.status, 'completed');

      // 5. Verify events emitted
      const events = engine.events.history({ planId: plan.id });
      assert(events.length > 0, 'Step 5: Should emit events');

      // 6. Verify trace
      const trace = engine.trace(plan.id);
      assert(trace.length > 0, 'Step 6: Should produce trace');

      // 7. Verify metrics
      const metrics = engine.metrics(plan.id);
      assert(metrics, 'Step 7: Should produce metrics');
      assert(metrics.completed > 0);

      console.log('\n  Acceptance Test Summary:');
      console.log(`    Plan ID: ${plan.id}`);
      console.log(`    Nodes: ${plan.nodes.length}`);
      console.log(`    Layers: ${plan.layers.length}`);
      console.log(`    Status: ${result.status}`);
      console.log(`    Duration: ${result.metrics?.totalDurationMs || 0}ms`);
      console.log(`    Events: ${events.length}`);
      console.log(`    Trace entries: ${trace.length}`);
    });
  });
});
