import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const BAR = join(import.meta.dirname, '..');

function loadAll(kind) {
  const dir = join(BAR, kind);
  try {
    const files = readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'index.json');
    return files.map(f => JSON.parse(readFileSync(join(dir, f), 'utf-8')));
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════════════
// Load all entities
// ═══════════════════════════════════════════════════
const allEntities = {};
const kindMap = {};
const byId = {};

const kinds = [
  'domains', 'capabilities', 'workflows', 'skills', 'agents',
  'services', 'packages', 'applications', 'knowledge-objects',
  'events', 'permissions', 'ui-surfaces'
];

for (const kind of kinds) {
  const entities = loadAll(kind);
  allEntities[kind] = entities;
  for (const e of entities) {
    byId[e.id] = { ...e, _kind: kind };
    kindMap[e.id] = kind;
  }
}

// ═══════════════════════════════════════════════════
// Build bidirectional links
// ═══════════════════════════════════════════════════
const links = {}; // id -> { upstream: [], downstream: [], related: [] }

for (const [kind, entities] of Object.entries(allEntities)) {
  for (const e of entities) {
    if (!links[e.id]) links[e.id] = { upstream: [], downstream: [], related: [] };
    for (const dep of (e.dependsOn || [])) {
      if (!links[dep]) links[dep] = { upstream: [], downstream: [], related: [] };
      links[e.id].upstream.push(dep);
      links[dep].downstream.push(e.id);
    }
    for (const rel of (e.related || [])) {
      if (!links[rel]) links[rel] = { upstream: [], downstream: [], related: [] };
      links[e.id].related.push(rel);
      links[rel].related.push(e.id);
    }
  }
}

// ═══════════════════════════════════════════════════
// Traceability Engine
// ═══════════════════════════════════════════════════
function traceUp(id, visited = new Set()) {
  if (visited.has(id)) return [];
  visited.add(id);
  const node = links[id];
  if (!node) return [];
  const result = [];
  for (const up of node.upstream) {
    const entity = byId[up];
    if (entity) {
      result.push({ id: up, name: entity.name, kind: entity.kind || entity._kind, direction: 'upstream' });
      result.push(...traceUp(up, visited));
    }
  }
  return result;
}

function traceDown(id, visited = new Set()) {
  if (visited.has(id)) return [];
  visited.add(id);
  const node = links[id];
  if (!node) return [];
  const result = [];
  for (const down of node.downstream) {
    const entity = byId[down];
    if (entity) {
      result.push({ id: down, name: entity.name, kind: entity.kind || entity._kind, direction: 'downstream' });
      result.push(...traceDown(down, visited));
    }
  }
  return result;
}

function traceAll(id) {
  const upstream = traceUp(id);
  const downstream = traceDown(id);
  const related = (links[id]?.related || []).map(rel => {
    const entity = byId[rel];
    return entity ? { id: rel, name: entity.name, kind: entity.kind || entity._kind, direction: 'related' } : null;
  }).filter(Boolean);

  return { id, upstream, downstream, related };
}

// ═══════════════════════════════════════════════════
// Generate traceability report for each capability
// ═══════════════════════════════════════════════════
const report = {
  generatedAt: new Date().toISOString(),
  totalEntities: Object.keys(byId).length,
  traces: {}
};

for (const cap of allEntities.capabilities || []) {
  const trace = traceAll(cap.id);
  report.traces[cap.id] = {
    name: cap.name,
    domain: cap.domain,
    upstream: trace.upstream.length,
    downstream: trace.downstream.length,
    related: trace.related.length,
    totalLinks: trace.upstream.length + trace.downstream.length + trace.related.length,
    chain: {
      upstream: trace.upstream.map(u => `${u.id} (${u.name}) [${u.kind}]`),
      downstream: trace.downstream.map(d => `${d.id} (${d.name}) [${d.kind}]`),
      related: trace.related.map(r => `${r.id} (${r.name}) [${r.kind}]`),
    }
  };
}

writeFileSync(join(BAR, 'traceability-report.json'), JSON.stringify(report, null, 2));
console.log(`Traceability report generated for ${Object.keys(report.traces).length} capabilities`);

// ═══════════════════════════════════════════════════
// Generate traceability TypeScript
// ═══════════════════════════════════════════════════
const traceTypes = `// ═══════════════════════════════════════════════════
// BAR Generated Traceability System
// Generated: ${new Date().toISOString()}
// ═══════════════════════════════════════════════════

export interface TraceResult {
  id: string;
  name: string;
  kind: string;
  direction: 'upstream' | 'downstream' | 'related';
}

export interface FullTrace {
  id: string;
  upstream: TraceResult[];
  downstream: TraceResult[];
  related: TraceResult[];
}

// ─── Trace Chain ─────────────────────────────────
// From any implementation artifact, trace back to the
// institutional capability that justified its existence:
//
// Institution → Domain → Capability → Workflow → Skill →
// Agent → Service → Package → Application → UI Surface →
// Source Code → Test → Release
//
// Starting from a React component:
//   UI Surface → Application → Package → Service → Agent →
//   Skill → Workflow → Capability → Domain → Institution
//
// Starting from a capability:
//   Capability → Workflow → Skill → Agent → Service →
//   Package → Application → UI Surface

export const TRACE_CHAIN = [
  'institution',
  'domain',
  'capability',
  'workflow',
  'skill',
  'agent',
  'service',
  'package',
  'application',
  'ui-surface',
  'source-code',
  'test',
  'release',
] as const;

export type TraceChainLevel = typeof TRACE_CHAIN[number];

// ─── Cross-reference map ─────────────────────────
// Maps each entity kind to the kinds it references
export const CROSS_REFERENCES: Record<string, string[]> = {
  domain: ['capability'],
  capability: ['workflow', 'skill', 'event', 'permission'],
  workflow: ['skill', 'event'],
  skill: ['agent', 'service'],
  agent: ['capability', 'service'],
  service: ['package', 'event'],
  package: ['application', 'service'],
  application: ['ui-surface', 'package'],
  'ui-surface': ['application', 'capability'],
  event: ['capability', 'domain'],
  permission: ['capability', 'domain'],
};

// ─── Reverse cross-reference map ─────────────────
export const REVERSE_REFERENCES: Record<string, string[]> = {};
for (const [from, tos] of Object.entries(CROSS_REFERENCES)) {
  for (const to of tos) {
    if (!REVERSE_REFERENCES[to]) REVERSE_REFERENCES[to] = [];
    REVERSE_REFERENCES[to].push(from);
  }
}

// ─── Trace functions ─────────────────────────────

export function traceFromCapability(capabilityId: string): FullTrace {
  // This would be populated from the traceability report
  // In production, this would query the registry
  return { id: capabilityId, upstream: [], downstream: [], related: [] };
}

export function traceFromComponent(componentPath: string): FullTrace {
  // Trace from a React component back to its originating capability
  // 1. Find the UI Surface that owns this component
  // 2. Trace UI Surface → Application → Package → Service → Agent → Skill → Workflow → Capability
  return { id: componentPath, upstream: [], downstream: [], related: [] };
}

export function traceFromEndpoint(endpointPath: string): FullTrace {
  // Trace from an API endpoint back to its service and capability
  return { id: endpointPath, upstream: [], downstream: [], related: [] };
}

export function traceFromEvent(eventName: string): FullTrace {
  // Trace from an event to all capabilities that produce/consume it
  return { id: eventName, upstream: [], downstream: [], related: [] };
}

export function getCapabilityChain(capabilityId: string): TraceChainLevel[] {
  // Returns the full chain for a capability
  return ['institution', 'domain', 'capability', 'workflow', 'skill', 'agent', 'service', 'package', 'application', 'ui-surface'];
}
`;

writeFileSync(join(BAR, 'generated', 'types', 'traceability.ts'), traceTypes);
console.log('Generated traceability types');

// ═══════════════════════════════════════════════════
// Summary
// ═══════════════════════════════════════════════════
console.log('\n=== Traceability Summary ===');
console.log(`Total entities: ${Object.keys(byId).length}`);
console.log(`Total links: ${Object.values(links).reduce((sum, l) => sum + l.upstream.length + l.downstream.length + l.related.length, 0) / 2}`);
console.log(`Capabilities traced: ${Object.keys(report.traces).length}`);

// Top 10 most connected entities
const connectivity = Object.entries(links).map(([id, l]) => ({
  id,
  connections: l.upstream.length + l.downstream.length + l.related.length,
})).sort((a, b) => b.connections - a.connections).slice(0, 10);

console.log('\nTop 10 most connected entities:');
for (const c of connectivity) {
  const entity = byId[c.id];
  console.log(`  ${c.id} (${entity?.name || 'unknown'}): ${c.connections} connections`);
}
