#!/usr/bin/env node

/**
 * BEE CLI — Bhavya Execution Engine command line interface.
 *
 * Usage:
 *   bee plan "Create a Grade 8 Biology lesson"
 *   bee execute <planId>
 *   bee resume <planId>
 *   bee cancel <planId>
 *   bee inspect <planId>
 *   bee graph <planId>
 *   bee trace <planId>
 *   bee replay <planId>
 *   bee list
 *   bee capabilities
 *   bee agents
 */

import { join } from 'path';
import { fileURLToPath } from 'url';
import { ExecutionEngine } from '../index.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..', '..', '..', '..');

const args = process.argv.slice(2);
const command = args[0];
const arg1 = args[1];

const engine = new ExecutionEngine({
  barPath: join(ROOT, 'bar'),
  stateDir: join(ROOT, 'bar', 'bee-state'),
  log: (msg) => process.stderr.write(`[bee] ${msg}\n`),
});

function print(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

function printTable(items, columns) {
  if (items.length === 0) { console.log('No items.'); return; }
  const widths = {};
  for (const col of columns) {
    widths[col] = Math.max(col.length, ...items.map(i => String(i[col] || '').length));
  }
  const header = columns.map(c => c.padEnd(widths[c])).join('  ');
  console.log(header);
  console.log(header.split('').map(() => '-').join(''));
  for (const item of items) {
    console.log(columns.map(c => String(item[c] || '').padEnd(widths[c])).join('  '));
  }
}

try {
  switch (command) {
    case 'plan': {
      if (!arg1) { console.error('Usage: bee plan "<goal>"'); process.exit(1); }
      const goal = args.slice(1).join(' ');
      const plan = engine.plan(goal);
      console.log(`\nExecution Plan: ${plan.id}`);
      console.log(`Goal: ${plan.goal}`);
      console.log(`Nodes: ${plan.nodes.length}`);
      console.log(`Layers: ${plan.layers.length} (max parallelism: ${Math.max(...plan.layers.map(l => l.length))})`);
      console.log(`\nDAG:`);
      console.log(engine.graph(plan.id));
      console.log(`\nPlan saved. Run: bee execute ${plan.id}`);
      break;
    }

    case 'execute': {
      if (!arg1) { console.error('Usage: bee execute <planId>'); process.exit(1); }
      console.log(`Executing plan ${arg1}...`);
      const plan = await engine.execute(arg1);
      console.log(`\nPlan ${plan.status}`);
      console.log(`Duration: ${plan.metrics?.totalDurationMs || 0}ms`);
      console.log(`Completed: ${plan.metrics?.completed || 0}/${plan.metrics?.totalNodes || 0}`);
      if (plan.metrics?.failed > 0) console.log(`Failed: ${plan.metrics.failed}`);
      break;
    }

    case 'resume': {
      if (!arg1) { console.error('Usage: bee resume <planId>'); process.exit(1); }
      console.log(`Resuming plan ${arg1}...`);
      const plan = await engine.resume(arg1);
      console.log(`Plan ${plan.status}`);
      break;
    }

    case 'cancel': {
      if (!arg1) { console.error('Usage: bee cancel <planId>'); process.exit(1); }
      await engine.cancel(arg1);
      console.log(`Plan ${arg1} cancelled.`);
      break;
    }

    case 'inspect': {
      if (!arg1) { console.error('Usage: bee inspect <planId>'); process.exit(1); }
      const info = engine.inspect(arg1);
      if (!info) { console.error('Plan not found.'); process.exit(1); }
      print(info);
      break;
    }

    case 'graph': {
      if (!arg1) { console.error('Usage: bee graph <planId>'); process.exit(1); }
      const graph = engine.graph(arg1);
      if (!graph) { console.error('Plan not found.'); process.exit(1); }
      console.log(graph);
      break;
    }

    case 'trace': {
      if (!arg1) { console.error('Usage: bee trace <planId>'); process.exit(1); }
      const trace = engine.trace(arg1);
      if (trace.length === 0) { console.log('No trace data.'); break; }
      printTable(trace, ['nodeId', 'operation', 'status', 'durationMs']);
      break;
    }

    case 'waterfall': {
      if (!arg1) { console.error('Usage: bee waterfall <planId>'); process.exit(1); }
      const wf = engine.waterfall(arg1);
      if (wf.length === 0) { console.log('No waterfall data.'); break; }
      printTable(wf, ['nodeId', 'operation', 'status', 'offsetMs', 'barWidthMs']);
      break;
    }

    case 'replay': {
      if (!arg1) { console.error('Usage: bee replay <planId>'); process.exit(1); }
      console.log(`Replaying plan ${arg1}...`);
      const plan = await engine.execute(arg1, { dryRun: true });
      console.log(`Replay ${plan.status}`);
      break;
    }

    case 'list': {
      const plans = engine.listPlans();
      if (plans.length === 0) { console.log('No plans.'); break; }
      printTable(plans, ['planId', 'goal', 'status', 'totalNodes', 'completed', 'lastCheckpoint']);
      break;
    }

    case 'capabilities': {
      const caps = engine.capabilities();
      printTable(caps, ['id', 'name', 'domain', 'status']);
      break;
    }

    case 'agents': {
      const agents = engine.agents();
      printTable(agents, ['agentId', 'name', 'domain', 'currentLoad', 'capabilityCount']);
      break;
    }

    case 'events': {
      const events = engine.events.history({ planId: arg1, limit: 50 });
      printTable(events.map(e => ({ ...e, data: JSON.stringify(e.data).slice(0, 60) })), ['type', 'planId', 'nodeId', 'timestamp']);
      break;
    }

    default:
      console.log(`
BEE — Bhavya Execution Engine

Commands:
  plan "<goal>"          Plan a goal (parse → resolve → build DAG)
  execute <planId>       Execute a plan
  resume <planId>        Resume a paused/failed plan
  cancel <planId>        Cancel a running plan
  inspect <planId>       Inspect plan state
  graph <planId>         Show execution graph
  trace <planId>         Show execution trace
  waterfall <planId>     Show waterfall view
  replay <planId>        Dry-run replay a plan
  list                   List all plans
  capabilities           List BAR capabilities
  agents                 List BAR agents
  events [planId]        Show execution events
`);
  }
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}
