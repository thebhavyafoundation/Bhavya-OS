import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { createRuntime } from './index.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..', '..', '..');

describe('Bhavya Runtime', () => {
  let rt;

  before(async () => {
    rt = createRuntime({ barPath: join(ROOT, 'bar') });
    await rt.load();
  });

  describe('Registry Loading', () => {
    it('should load all entities', () => {
      const counts = rt.counts;
      assert(counts.total > 0, 'Should have entities');
      assert(counts.capability > 100, 'Should have 100+ capabilities');
      assert(counts.workflow > 10, 'Should have 10+ workflows');
      assert(counts.agent > 10, 'Should have 10+ agents');
    });

    it('should get entity by ID', () => {
      const entity = rt.get('D05-C01');
      assert(entity, 'Should find D05-C01');
      assert.equal(entity.name, 'Knowledge Repository');
      assert.equal(entity.kind, 'capability');
    });

    it('should search registry', () => {
      const results = rt.search('lesson');
      assert(results.length > 0, 'Should find lesson-related entities');
    });
  });

  describe('Entity Resolution', () => {
    it('should resolve a capability', () => {
      const ctx = rt.resolve('D03-C02');
      assert(ctx, 'Should resolve D03-C02');
      assert.equal(ctx.entity.name, 'Lesson Planning');
      assert(ctx.agents.length > 0, 'Should find owning agent');
    });

    it('should return null for unknown capability', () => {
      const ctx = rt.resolve('XX-99');
      assert.equal(ctx, null);
    });

    it('should find owner agent', () => {
      const agent = rt.owner('D05-C01');
      assert(agent, 'Should find owner of D05-C01');
      assert.equal(agent.kind, 'agent');
    });
  });

  describe('Dependency Resolution', () => {
    it('should detect no cycles', () => {
      const result = rt.cycles();
      assert.equal(result.hasCycle, false, 'Should have no cycles');
    });

    it('should validate dependencies', () => {
      const result = rt.validateDeps();
      assert(result.valid, 'All dependencies should exist');
    });

    it('should compute topological order', () => {
      const order = rt.topoSort();
      assert(order.length > 0, 'Should have topological order');
      // D05-C01 (Knowledge Repository) should come before D03-C02 (Lesson Planning)
      const d05Idx = order.indexOf('D05-C01');
      const d03Idx = order.indexOf('D03-C02');
      if (d05Idx >= 0 && d03Idx >= 0) {
        assert(d05Idx < d03Idx, 'D05-C01 should come before D03-C02');
      }
    });

    it('should do impact analysis', () => {
      const affected = rt.impact('D05-C01');
      assert(affected.length > 0, 'D05-C01 should have downstream impact');
    });
  });

  describe('Traceability', () => {
    it('should trace upstream', () => {
      const upstream = rt.traceUp('D03-C02');
      assert(Array.isArray(upstream), 'Should return array');
    });

    it('should trace downstream', () => {
      const downstream = rt.traceDown('D05-C01');
      assert(downstream.length > 0, 'D05-C01 should have downstream entities');
    });

    it('should trace full chain', () => {
      const chain = rt.traceChain('D03-C02');
      assert(chain, 'Should return chain');
      assert.equal(chain.capability.name, 'Lesson Planning');
    });
  });

  describe('Events', () => {
    it('should dispatch an event', async () => {
      const result = await rt.emit('ko.created', { id: 'test-ko' });
      assert.equal(result.dispatched, true);
    });

    it('should register and call handler', async () => {
      let called = false;
      rt.on('ko.created', () => { called = true; });
      await rt.emit('ko.created', {});
      assert.equal(called, true);
    });
  });

  describe('Permissions', () => {
    it('should assign and check permissions', () => {
      rt.permit.assign('user-1', ['PM-KNOW-READ', 'PM-KNOW-CREATE']);
      assert.equal(rt.permit.has('user-1', 'PM-KNOW-READ'), true);
      assert.equal(rt.permit.has('user-1', 'PM-KNOW-DELETE'), false);
    });

    it('should grant admin all permissions', () => {
      rt.permit.assign('admin-1', ['PM-SYST-ADMIN']);
      assert.equal(rt.permit.has('admin-1', 'PM-KNOW-READ'), true);
      assert.equal(rt.permit.has('admin-1', 'PM-FINA-DELETE'), true);
    });

    it('should get role policies', () => {
      const teacherPerms = rt.permit.getPolicyForRole('teacher');
      assert(teacherPerms.length > 0, 'Teacher should have permissions');
    });
  });

  describe('Query Engine', () => {
    it('should query by kind', () => {
      const result = rt.query({ kind: 'capability', limit: 5 });
      assert(result.results.length === 5, 'Should return 5 capabilities');
      assert(result.total > 100, 'Total should be 100+');
    });

    it('should query by domain', () => {
      const result = rt.query({ domain: 'D05' });
      assert(result.results.length > 0, 'Should find D05 entities');
    });

    it('should aggregate by kind', () => {
      const agg = rt.summary();
      assert(agg.total > 0, 'Should have total');
      assert(agg.byKind.capability > 0, 'Should count capabilities');
    });

    it('should check completeness', () => {
      const result = rt.completeness('D03-C02');
      assert(result, 'Should return completeness');
      assert(typeof result.percent === 'string', 'Should have percent');
    });
  });

  describe('Workflow Execution', () => {
    it('should list workflows', () => {
      const workflows = rt.workflows.listWorkflows();
      assert(workflows.length > 0, 'Should have workflows');
    });

    it('should simulate a workflow', async () => {
      const result = await rt.simulate('WF-001', { koId: 'test' });
      assert.equal(result.status, 'completed', 'Simulation should complete');
    });
  });

  describe('Summary', () => {
    it('should generate summary', () => {
      const summary = rt.summary();
      assert(summary.total > 0, 'Should have total');
      assert(summary.implementation, 'Should have implementation stats');
      console.log(`\nRegistry Summary:`);
      console.log(`  Total: ${summary.total}`);
      console.log(`  Implemented: ${summary.implementation.implemented}`);
      console.log(`  Partial: ${summary.implementation.partial}`);
      console.log(`  Not Started: ${summary.implementation.notStarted}`);
      console.log(`  Complete: ${summary.implementation.percentComplete}`);
    });
  });
});
