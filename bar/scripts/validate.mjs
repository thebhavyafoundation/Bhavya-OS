import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const BAR = join(import.meta.dirname, '..');
const errors = [];
const warnings = [];
const stats = {};

function loadIndex(kind) {
  const dir = join(BAR, kind);
  try {
    const idx = JSON.parse(readFileSync(join(dir, 'index.json'), 'utf-8'));
    return idx;
  } catch {
    errors.push(`Missing index for ${kind}`);
    return { total: 0, items: [] };
  }
}

function loadEntity(kind, id) {
  const dir = join(BAR, kind);
  try {
    return JSON.parse(readFileSync(join(dir, `${id}.json`), 'utf-8'));
  } catch {
    return null;
  }
}

function loadAllEntities(kind) {
  const dir = join(BAR, kind);
  try {
    const files = readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'index.json');
    return files.map(f => JSON.parse(readFileSync(join(dir, f), 'utf-8')));
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════════════
// 1. Load all registries
// ═══════════════════════════════════════════════════
const registry = {
  domains: loadAllEntities('domains'),
  capabilities: loadAllEntities('capabilities'),
  workflows: loadAllEntities('workflows'),
  skills: loadAllEntities('skills'),
  agents: loadAllEntities('agents'),
  services: loadAllEntities('services'),
  packages: loadAllEntities('packages'),
  applications: loadAllEntities('applications'),
  events: loadAllEntities('events'),
  permissions: loadAllEntities('permissions'),
  'knowledge-objects': loadAllEntities('knowledge-objects'),
  'ui-surfaces': loadAllEntities('ui-surfaces'),
};

// Build lookup maps
const allIds = new Set();
const byId = {};
for (const [kind, entities] of Object.entries(registry)) {
  stats[kind] = entities.length;
  for (const e of entities) {
    allIds.add(e.id);
    byId[e.id] = { ...e, _kind: kind };
  }
}

console.log('=== BAR Registry Counts ===');
for (const [k, v] of Object.entries(stats)) {
  console.log(`  ${k}: ${v}`);
}
console.log(`  TOTAL: ${Object.values(stats).reduce((a, b) => a + b, 0)}`);
console.log('');

// ═══════════════════════════════════════════════════
// 2. Validate all references
// ═══════════════════════════════════════════════════
console.log('=== Validation Rules ===');

for (const [kind, entities] of Object.entries(registry)) {
  for (const e of entities) {
    // Check dependsOn references
    for (const dep of (e.dependsOn || [])) {
      if (!allIds.has(dep)) {
        errors.push(`[${e.id}] dependsOn unknown entity: ${dep}`);
      }
    }
    // Check upstream references
    for (const up of (e.upstream || [])) {
      if (!allIds.has(up)) {
        errors.push(`[${e.id}] upstream unknown entity: ${up}`);
      }
    }
    // Check downstream references
    for (const down of (e.downstream || [])) {
      if (!allIds.has(down)) {
        errors.push(`[${e.id}] downstream unknown entity: ${down}`);
      }
    }
    // Check related references
    for (const rel of (e.related || [])) {
      if (!allIds.has(rel)) {
        warnings.push(`[${e.id}] related unknown entity: ${rel}`);
      }
    }
  }
}

// ═══════════════════════════════════════════════════
// 3. Orphan detection
// ═══════════════════════════════════════════════════
const referenced = new Set();
for (const [kind, entities] of Object.entries(registry)) {
  for (const e of entities) {
    for (const dep of (e.dependsOn || [])) referenced.add(dep);
    for (const up of (e.upstream || [])) referenced.add(up);
    for (const down of (e.downstream || [])) referenced.add(down);
    for (const rel of (e.related || [])) referenced.add(rel);
  }
}

const orphanKinds = ['capabilities', 'workflows', 'skills', 'agents', 'services', 'packages', 'applications'];
for (const kind of orphanKinds) {
  for (const e of registry[kind]) {
    if (!referenced.has(e.id) && e.id !== 'D05-C01' && e.id !== 'D17-C01') {
      // Only warn if not a root entity
      const isRoot = (e.dependsOn || []).length === 0;
      if (!isRoot) {
        warnings.push(`[${e.id}] ${e.name} — potentially orphaned (no upstream references)`);
      }
    }
  }
}

// ═══════════════════════════════════════════════════
// 4. Capability chain validation
// ═══════════════════════════════════════════════════
console.log('=== Capability Chain Validation ===');

for (const cap of registry.capabilities) {
  const workflows = registry.workflows.filter(w => (w.related || []).includes(cap.id));
  if (workflows.length === 0) {
    warnings.push(`[${cap.id}] ${cap.name} — no linked workflows`);
  }
}

for (const wf of registry.workflows) {
  const skills = registry.skills.filter(s => (s.related || []).includes(wf.id));
  if (skills.length === 0) {
    warnings.push(`[${wf.id}] ${wf.name} — no linked skills`);
  }
}

for (const skill of registry.skills) {
  const agents = registry.agents.filter(a => {
    const caps = a.metadata?.capabilities || [];
    return caps.some(c => c === skill.domain + '-C01' || (skill.related || []).includes(c));
  });
  if (agents.length === 0) {
    warnings.push(`[${skill.id}] ${skill.name} — no owning agent found`);
  }
}

for (const svc of registry.services) {
  const pkgs = registry.packages.filter(p => (p.related || []).includes(svc.id) || svc.domain === p.domain);
  if (pkgs.length === 0 && !svc.metadata?.crossCutting) {
    warnings.push(`[${svc.id}] ${svc.name} — no owning package`);
  }
}

// ═══════════════════════════════════════════════════
// 5. Circular dependency detection (DFS)
// ═══════════════════════════════════════════════════
function detectCycles(kind) {
  const entities = registry[kind];
  const visited = new Set();
  const stack = new Set();

  function dfs(id) {
    if (stack.has(id)) {
      errors.push(`Circular dependency detected in ${kind}: ${id}`);
      return;
    }
    if (visited.has(id)) return;
    stack.add(id);
    const e = byId[id];
    if (e) {
      for (const dep of (e.dependsOn || [])) {
        if (byId[dep]) dfs(dep);
      }
    }
    stack.delete(id);
    visited.add(id);
  }

  for (const e of entities) {
    dfs(e.id);
  }
}

for (const kind of orphanKinds) {
  detectCycles(kind);
}

// ═══════════════════════════════════════════════════
// 6. ADR traceability
// ═══════════════════════════════════════════════════
for (const [kind, entities] of Object.entries(registry)) {
  for (const e of entities) {
    if (!e.sourceAdr) {
      warnings.push(`[${e.id}] missing sourceAdr`);
    }
  }
}

// ═══════════════════════════════════════════════════
// 7. Cross-reference integrity
// ═══════════════════════════════════════════════════
// Every entity referenced in metadata.capabilities should exist
for (const agent of registry.agents) {
  const caps = agent.metadata?.capabilities || [];
  for (const c of caps) {
    if (!allIds.has(c)) {
      errors.push(`[${agent.id}] references non-existent capability: ${c}`);
    }
  }
}

// ═══════════════════════════════════════════════════
// RESULTS
// ═══════════════════════════════════════════════════
console.log('');
console.log('=== VALIDATION RESULTS ===');
console.log(`Errors:   ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);
console.log('');

if (errors.length > 0) {
  console.log('ERRORS:');
  for (const e of errors) console.log(`  ❌ ${e}`);
  console.log('');
}

if (warnings.length > 0) {
  console.log('WARNINGS:');
  for (const w of warnings) console.log(`  ⚠️  ${w}`);
  console.log('');
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All validations passed');
}

// Write validation report
const report = {
  validatedAt: new Date().toISOString(),
  stats,
  errors: errors.length,
  warnings: warnings.length,
  errorDetails: errors,
  warningDetails: warnings
};

import { writeFileSync } from 'fs';
writeFileSync(join(BAR, 'validation-report.json'), JSON.stringify(report, null, 2));

process.exit(errors.length > 0 ? 1 : 0);
