#!/usr/bin/env node

/**
 * BAR CLI — validate, query, and inspect the registry from the command line.
 *
 * Usage:
 *   node packages/runtime/src/cli/validate.mjs
 *   node packages/runtime/src/cli/validate.mjs --summary
 *   node packages/runtime/src/cli/validate.mjs --query D05-C02
 *   node packages/runtime/src/cli/validate.mjs --chain D05-C02
 *   node packages/runtime/src/cli/validate.mjs --roadmap
 */

import { join } from 'path';
import { fileURLToPath } from 'url';
import { createRuntime } from '../index.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..', '..', '..', '..');

const args = process.argv.slice(2);
const flag = args[0];

const rt = createRuntime({
  barPath: join(ROOT, 'bar'),
  provenanceDir: join(ROOT, 'bar', 'provenance'),
});

rt.load();

function print(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

switch (flag) {
  case '--summary':
    print(rt.summary());
    break;

  case '--query': {
    const id = args[1];
    if (!id) { console.error('Usage: --query <entity-id>'); process.exit(1); }
    const entity = rt.get(id);
    if (entity) print(entity);
    else { console.error(`Entity not found: ${id}`); process.exit(1); }
    break;
  }

  case '--resolve': {
    const id = args[1];
    if (!id) { console.error('Usage: --resolve <capability-id>'); process.exit(1); }
    const ctx = rt.resolve(id);
    if (ctx) {
      console.log(`Capability: ${ctx.entity.name}`);
      console.log(`Domain: ${ctx.entity.domain}`);
      console.log(`Upstream: ${ctx.upstream.length}`);
      console.log(`Downstream: ${ctx.downstream.length}`);
      console.log(`Skills: ${ctx.skills.length}`);
      console.log(`Agents: ${ctx.agents.map(a => a.name).join(', ')}`);
      console.log(`Services: ${ctx.services.length}`);
      console.log(`Events: ${ctx.events.length}`);
      console.log(`Permissions: ${ctx.permissions.length}`);
    } else {
      console.error(`Capability not found: ${id}`);
    }
    break;
  }

  case '--chain': {
    const id = args[1];
    if (!id) { console.error('Usage: --chain <capability-id>'); process.exit(1); }
    const chain = rt.chain(id);
    if (chain) {
      console.log('Execution Chain:');
      for (const e of chain) {
        console.log(`  ${e.kind}: ${e.id} — ${e.name}`);
      }
    } else {
      console.error(`Capability not found: ${id}`);
    }
    break;
  }

  case '--impact': {
    const id = args[1];
    if (!id) { console.error('Usage: --impact <entity-id>'); process.exit(1); }
    const affected = rt.impact(id);
    console.log(`Impact of changing ${id}: ${affected.length} entities affected`);
    for (const a of affected.slice(0, 20)) {
      const e = rt.get(a);
      console.log(`  ${a} — ${e?.name || 'unknown'}`);
    }
    break;
  }

  case '--cycles': {
    const result = rt.cycles();
    if (result.hasCycle) {
      console.log(`Found ${result.cycles.length} cycles:`);
      for (const cycle of result.cycles) {
        console.log(`  ${cycle.join(' → ')}`);
      }
    } else {
      console.log('No cycles detected');
    }
    break;
  }

  case '--roadmap': {
    const roadmap = rt.roadmap();
    console.log('Implementation Roadmap:');
    for (const item of roadmap.filter(r => r.impl !== 'implemented').slice(0, 30)) {
      console.log(`  [${item.depth}] ${item.id} — ${item.name} (${item.impl})`);
    }
    break;
  }

  case '--completeness': {
    const id = args[1];
    if (!id) { console.error('Usage: --completeness <capability-id>'); process.exit(1); }
    const result = rt.completeness(id);
    if (result) {
      console.log(`${result.capability}: ${result.percent} complete`);
      console.log(`Missing: ${result.missing.join(', ') || 'none'}`);
    }
    break;
  }

  case '--toposort': {
    const order = rt.topoSort();
    console.log(`Topological order (${order.length} entities):`);
    for (let i = 0; i < Math.min(order.length, 30); i++) {
      console.log(`  ${i + 1}. ${order[i]}`);
    }
    if (order.length > 30) console.log(`  ... and ${order.length - 30} more`);
    break;
  }

  case '--search': {
    const query = args[1];
    if (!query) { console.error('Usage: --search <query>'); process.exit(1); }
    const results = rt.search(query);
    console.log(`Search "${query}": ${results.length} results`);
    for (const r of results.slice(0, 20)) {
      console.log(`  ${r.id} — ${r.name} [${r.kind}]`);
    }
    break;
  }

  default:
    console.log('BAR CLI');
    console.log('------');
    console.log('Commands:');
    console.log('  --summary              Registry summary statistics');
    console.log('  --query <id>           Get entity by ID');
    console.log('  --resolve <cap-id>     Resolve capability context');
    console.log('  --chain <cap-id>       Show execution chain');
    console.log('  --impact <id>          Impact analysis');
    console.log('  --cycles               Detect dependency cycles');
    console.log('  --roadmap              Implementation roadmap');
    console.log('  --completeness <id>    Check capability completeness');
    console.log('  --toposort             Topological sort');
    console.log('  --search <query>       Search registry');
    break;
}
