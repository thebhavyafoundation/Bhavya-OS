import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join } from 'path';

const BAR = join(import.meta.dirname, '..');
const GEN = join(BAR, 'generated');
const TYPES = join(GEN, 'types');
const SCHEMAS = join(GEN, 'schemas');

mkdirSync(TYPES, { recursive: true });
mkdirSync(SCHEMAS, { recursive: true });

function loadAll(kind) {
  const dir = join(BAR, kind);
  try {
    const files = readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'index.json');
    return files.map(f => JSON.parse(readFileSync(join(dir, f), 'utf-8')));
  } catch {
    return [];
  }
}

function toPascalCase(str) {
  return str.replace(/(^|[-_.])(\w)/g, (_, __, c) => c.toUpperCase());
}

// ═══════════════════════════════════════════════════
// 1. Generate TypeScript Types
// ═══════════════════════════════════════════════════
const domains = loadAll('domains');
const capabilities = loadAll('capabilities');
const workflows = loadAll('workflows');
const skills = loadAll('skills');
const agents = loadAll('agents');
const services = loadAll('services');
const packages = loadAll('packages');
const applications = loadAll('applications');
const events = loadAll('events');
const permissions = loadAll('permissions');
const koTypes = loadAll('knowledge-objects');
const uiSurfaces = loadAll('ui-surfaces');

// Domain enum
const domainEnum = domains.map(d => `  ${d.id} = '${d.id}', // ${d.name}`).join('\n');
const domainNames = domains.map(d => `  '${d.id}': '${d.name}',`).join('\n');

// Status enum
const statusEnum = `  Proposed = 'proposed',
  Active = 'active',
  Deprecated = 'deprecated',
  Archived = 'archived'`;

// Capability kind enum
const entityKinds = `  Domain = 'domain',
  Capability = 'capability',
  Workflow = 'workflow',
  Skill = 'skill',
  Agent = 'agent',
  Service = 'service',
  Package = 'package',
  Application = 'application',
  KnowledgeObject = 'knowledge-object',
  Event = 'event',
  Permission = 'permission',
  UiSurface = 'ui-surface'`;

const implStatusEnum = `  NotStarted = 'not-started',
  InProgress = 'in-progress',
  Implemented = 'implemented',
  Partial = 'partial'`;

const automationEnum = `  Manual = 'manual',
  Assisted = 'assisted',
  SemiAuto = 'semi-auto',
  Autonomous = 'autonomous'`;

// Capability IDs by domain
const capIdsByDomain = {};
for (const c of capabilities) {
  if (!capIdsByDomain[c.domain]) capIdsByDomain[c.domain] = [];
  capIdsByDomain[c.domain].push(c.id);
}

// Generate capability ID types per domain
let capIdTypes = '';
for (const [domain, ids] of Object.entries(capIdsByDomain)) {
  const typeName = `${domain}CapabilityId`;
  capIdTypes += `export type ${typeName} = ${ids.map(id => `'${id}'`).join(' | ')};\n\n`;
}

// Event names by domain
const eventNamesByDomain = {};
for (const e of events) {
  if (!eventNamesByDomain[e.domain]) eventNamesByDomain[e.domain] = [];
  eventNamesByDomain[e.domain].push(e.name);
}

let eventTypeDefs = '';
for (const [domain, names] of Object.entries(eventNamesByDomain)) {
  const typeName = `${domain}EventName`;
  eventTypeDefs += `export type ${typeName} = ${names.map(n => `'${n}'`).join(' | ')};\n\n`;
}

// Permission IDs
const permIds = permissions.map(p => p.id);
const permissionGroupEnum = [...new Set(permissions.map(p => p.metadata?.group))].map(g => `  ${toPascalCase(g)} = '${g}',`).join('\n');

const tsContent = `// ═══════════════════════════════════════════════════
// BAR Generated Types — Do not edit manually
// Generated: ${new Date().toISOString()}
// Source: bar/registries
// ═══════════════════════════════════════════════════

// ─── Enums ───────────────────────────────────────

export enum Domain {
${domainEnum}
}

export enum EntityKind {
${entityKinds}
}

export enum EntityStatus {
${statusEnum}
}

export enum ImplementationStatus {
${implStatusEnum}
}

export enum AutomationLevel {
${automationEnum}
}

export enum PermissionGroup {
${permissionGroupEnum}
}

// ─── Constants ────────────────────────────────────

export const DOMAIN_NAMES: Record<Domain, string> = {
${domainNames}
};

// ─── Base Entity ──────────────────────────────────

export interface BarEntity {
  id: string;
  name: string;
  kind: EntityKind;
  version: string;
  status: EntityStatus;
  owner: string;
  description: string;
  domain: string;
  sourceAdr: string;
  dependsOn: string[];
  upstream: string[];
  downstream: string[];
  related: string[];
  implementation: {
    status: ImplementationStatus;
    location: string;
    files: string[];
  };
  tests: {
    status: 'none' | 'planned' | 'written' | 'passing';
    location?: string;
  };
  docs: {
    status: 'none' | 'planned' | 'written' | 'published';
    location?: string;
  };
  release: string;
  automation: AutomationLevel;
  tags: string[];
  metadata: Record<string, unknown>;
}

// ─── Capability ID Types ─────────────────────────

${capIdTypes}
// ─── Event Name Types ────────────────────────────

${eventTypeDefs}
// ─── Specific Entity Types ───────────────────────

export interface DomainEntity extends BarEntity {
  kind: EntityKind.Domain;
  metadata: {
    capabilityCount: number;
    depth: number;
  };
}

export interface CapabilityEntity extends BarEntity {
  kind: EntityKind.Capability;
}

export interface WorkflowEntity extends BarEntity {
  kind: EntityKind.Workflow;
}

export interface SkillEntity extends BarEntity {
  kind: EntityKind.Skill;
}

export interface AgentEntity extends BarEntity {
  kind: EntityKind.Agent;
  metadata: {
    capabilities: string[];
  };
}

export interface ServiceEntity extends BarEntity {
  kind: EntityKind.Service;
  metadata: {
    crossCutting: boolean;
    usedBy?: number;
  };
}

export interface PackageEntity extends BarEntity {
  kind: EntityKind.Package;
}

export interface ApplicationEntity extends BarEntity {
  kind: EntityKind.Application;
}

export interface KnowledgeObjectEntity extends BarEntity {
  kind: EntityKind.KnowledgeObject;
}

export interface EventEntity extends BarEntity {
  kind: EntityKind.Event;
}

export interface PermissionEntity extends BarEntity {
  kind: EntityKind.Permission;
  metadata: {
    group: string;
    action: string;
  };
}

export interface UiSurfaceEntity extends BarEntity {
  kind: EntityKind.UiSurface;
}

// ─── Registry Index ──────────────────────────────

export interface RegistryIndex {
  registryVersion: string;
  generatedAt: string;
  total: number;
  items: Array<{
    id: string;
    name: string;
    domain: string;
    status: string;
    impl: string;
  }>;
}

// ─── Type Helpers ────────────────────────────────

export type CapabilityId = ${capabilities.map(c => `'${c.id}'`).join(' | ')};
export type WorkflowId = ${workflows.map(w => `'${w.id}'`).join(' | ')};
export type SkillId = ${skills.map(s => `'${s.id}'`).join(' | ')};
export type AgentId = ${agents.map(a => `'${a.id}'`).join(' | ')};
export type ServiceId = ${services.map(s => `'${s.id}'`).join(' | ')};
export type PackageId = ${packages.map(p => `'${p.id}'`).join(' | ')};
export type ApplicationId = ${applications.map(a => `'${a.id}'`).join(' | ')};
export type EventName = ${events.map(e => `'${e.name}'`).join(' | ')};
export type PermissionId = ${permissions.map(p => `'${p.id}'`).join(' | ')};
export type KoTypeId = ${koTypes.map(k => `'${k.id}'`).join(' | ')};
export type UiSurfaceId = ${uiSurfaces.map(u => `'${u.id}'`).join(' | ')};
`;

writeFileSync(join(TYPES, 'bar.ts'), tsContent);
console.log(`Generated TypeScript types: ${TYPES}/bar.ts`);

// ═══════════════════════════════════════════════════
// 2. Generate Zod Schemas
// ═══════════════════════════════════════════════════
const domainLiterals = domains.map(d => `'${d.id}'`).join(', ');
const statusLiterals = `'proposed', 'active', 'deprecated', 'archived'`;
const implLiterals = `'not-started', 'in-progress', 'implemented', 'partial'`;

const zodContent = `// ═══════════════════════════════════════════════════
// BAR Generated Zod Schemas — Do not edit manually
// Generated: ${new Date().toISOString()}
// ═══════════════════════════════════════════════════

import { z } from 'zod';

// ─── Enums ───────────────────────────────────────

export const DomainEnum = z.enum([${domainLiterals}]);
export const EntityStatusEnum = z.enum([${statusLiterals}]);
export const ImplementationStatusEnum = z.enum([${implLiterals}]);
export const AutomationLevelEnum = z.enum(['manual', 'assisted', 'semi-auto', 'autonomous']);

// ─── Base Entity Schema ──────────────────────────

export const BarEntitySchema = z.object({
  id: z.string().regex(/^[A-Z]{2,4}-[A-Z0-9]{2,6}(-[a-z0-9-]+)?$/),
  name: z.string().min(3).max(120),
  kind: z.enum(['domain', 'capability', 'workflow', 'skill', 'agent', 'service', 'package', 'application', 'knowledge-object', 'event', 'permission', 'ui-surface']),
  version: z.string().regex(/^\\d+\\.\\d+\\.\\d+$/),
  status: EntityStatusEnum,
  owner: z.string(),
  description: z.string().max(500),
  domain: z.string(),
  sourceAdr: z.string(),
  dependsOn: z.array(z.string()),
  upstream: z.array(z.string()),
  downstream: z.array(z.string()),
  related: z.array(z.string()),
  implementation: z.object({
    status: ImplementationStatusEnum,
    location: z.string(),
    files: z.array(z.string()),
  }),
  tests: z.object({
    status: z.enum(['none', 'planned', 'written', 'passing']),
    location: z.string().optional(),
  }),
  docs: z.object({
    status: z.enum(['none', 'planned', 'written', 'published']),
    location: z.string().optional(),
  }),
  release: z.string(),
  automation: AutomationLevelEnum,
  tags: z.array(z.string()),
  metadata: z.record(z.unknown()),
});

// ─── Capability Schema ───────────────────────────

export const CapabilityEntitySchema = BarEntitySchema.extend({
  kind: z.literal('capability'),
});

// ─── Workflow Schema ─────────────────────────────

export const WorkflowEntitySchema = BarEntitySchema.extend({
  kind: z.literal('workflow'),
});

// ─── Skill Schema ────────────────────────────────

export const SkillEntitySchema = BarEntitySchema.extend({
  kind: z.literal('skill'),
});

// ─── Agent Schema ────────────────────────────────

export const AgentEntitySchema = BarEntitySchema.extend({
  kind: z.literal('agent'),
  metadata: z.object({
    capabilities: z.array(z.string()),
  }),
});

// ─── Service Schema ──────────────────────────────

export const ServiceEntitySchema = BarEntitySchema.extend({
  kind: z.literal('service'),
  metadata: z.object({
    crossCutting: z.boolean(),
    usedBy: z.number().optional(),
  }),
});

// ─── Package Schema ──────────────────────────────

export const PackageEntitySchema = BarEntitySchema.extend({
  kind: z.literal('package'),
});

// ─── Application Schema ──────────────────────────

export const ApplicationEntitySchema = BarEntitySchema.extend({
  kind: z.literal('application'),
});

// ─── Event Schema ────────────────────────────────

export const EventEntitySchema = BarEntitySchema.extend({
  kind: z.literal('event'),
});

// ─── Permission Schema ───────────────────────────

export const PermissionEntitySchema = BarEntitySchema.extend({
  kind: z.literal('permission'),
  metadata: z.object({
    group: z.string(),
    action: z.string(),
  }),
});

// ─── Knowledge Object Schema ─────────────────────

export const KnowledgeObjectEntitySchema = BarEntitySchema.extend({
  kind: z.literal('knowledge-object'),
});

// ─── UI Surface Schema ───────────────────────────

export const UiSurfaceEntitySchema = BarEntitySchema.extend({
  kind: z.literal('ui-surface'),
});

// ─── Validation Helpers ──────────────────────────

export function validateEntity(data: unknown) {
  return BarEntitySchema.safeParse(data);
}

export function validateCapability(data: unknown) {
  return CapabilityEntitySchema.safeParse(data);
}

export function validateAgent(data: unknown) {
  return AgentEntitySchema.safeParse(data);
}

export function validateService(data: unknown) {
  return ServiceEntitySchema.safeParse(data);
}

export function validateWorkflow(data: unknown) {
  return WorkflowEntitySchema.safeParse(data);
}
`;

writeFileSync(join(SCHEMAS, 'bar.ts'), zodContent);
console.log(`Generated Zod schemas: ${SCHEMAS}/bar.ts`);

// ═══════════════════════════════════════════════════
// 3. Generate JSON Schema (validation for CI)
// ═══════════════════════════════════════════════════
const jsonSchema = JSON.parse(readFileSync(join(BAR, 'schema.json'), 'utf-8'));
writeFileSync(join(SCHEMAS, 'bar-schema.json'), JSON.stringify(jsonSchema, null, 2));
console.log(`Generated JSON Schema: ${SCHEMAS}/bar-schema.json`);

// ═══════════════════════════════════════════════════
// 4. Generate OpenAPI Spec
// ═══════════════════════════════════════════════════
const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'Bhavya Architecture Registry API',
    description: 'Machine-readable API for the Bhavya Architecture Registry',
    version: '1.0.0',
  },
  servers: [
    { url: 'http://localhost:3100', description: 'Local development' },
    { url: 'https://api.bhavya.org', description: 'Production' },
  ],
  paths: {},
  components: {
    schemas: {
      Domain: { type: 'string', enum: domains.map(d => d.id) },
      EntityStatus: { type: 'string', enum: ['proposed', 'active', 'deprecated', 'archived'] },
      ImplementationStatus: { type: 'string', enum: ['not-started', 'in-progress', 'implemented', 'partial'] },
      BarEntity: { $ref: '#/components/schemas/BarEntity' },
    },
  },
};

// Generate paths for each registry kind
const kinds = ['domains', 'capabilities', 'workflows', 'skills', 'agents', 'services', 'packages', 'applications', 'events', 'permissions', 'knowledge-objects', 'ui-surfaces'];

for (const kind of kinds) {
  const singular = kind.endsWith('s') ? kind.slice(0, -1) : kind;
  openapi.paths[`/${kind}`] = {
    get: {
      summary: `List all ${kind}`,
      operationId: `list${toPascalCase(kind)}`,
      responses: {
        '200': { description: 'Success' },
      },
    },
  };
  openapi.paths[`/${kind}/{id}`] = {
    get: {
      summary: `Get ${singular} by ID`,
      operationId: `get${toPascalCase(singular)}`,
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: {
        '200': { description: 'Success' },
        '404': { description: 'Not found' },
      },
    },
  };
}

// Add validation endpoint
openapi.paths['/validate'] = {
  post: {
    summary: 'Validate registry integrity',
    operationId: 'validateRegistry',
    requestBody: {
      content: {
        'application/json': {
          schema: { type: 'object' },
        },
      },
    },
    responses: {
      '200': { description: 'Validation passed' },
      '400': { description: 'Validation errors' },
    },
  },
};

writeFileSync(join(GEN, 'openapi', 'bar-api.json'), JSON.stringify(openapi, null, 2));
console.log(`Generated OpenAPI spec: ${GEN}/openapi/bar-api.json`);

// ═══════════════════════════════════════════════════
// 5. Generate Event Definitions
// ═══════════════════════════════════════════════════
const eventTypes = events.map(e => {
  const parts = e.name.split('.');
  return {
    name: e.name,
    namespace: parts[0],
    action: parts.slice(1).join('.'),
    domain: e.domain,
    description: e.description,
    entity: e.id,
  };
});

const eventDefs = `// ═══════════════════════════════════════════════════
// BAR Generated Event Definitions
// Generated: ${new Date().toISOString()}
// ═══════════════════════════════════════════════════

export interface BarEvent {
  name: string;
  namespace: string;
  action: string;
  domain: string;
  description: string;
  entity: string;
  timestamp: string;
  payload: Record<string, unknown>;
}

export const EVENT_REGISTRY: Record<string, Omit<BarEvent, 'timestamp' | 'payload'>> = {
${events.map(e => `  '${e.name}': {
    name: '${e.name}',
    namespace: '${e.name.split('.')[0]}',
    action: '${e.name.split('.').slice(1).join('.')}',
    domain: '${e.domain}',
    description: '${e.description.replace(/'/g, "\\'")}',
    entity: '${e.id}',
  },`).join('\n')}
};

export function createEvent(name: string, payload: Record<string, unknown>): BarEvent | null {
  const template = EVENT_REGISTRY[name];
  if (!template) return null;
  return {
    ...template,
    timestamp: new Date().toISOString(),
    payload,
  };
}
`;

writeFileSync(join(GEN, 'types', 'events.ts'), eventDefs);
console.log(`Generated event definitions: ${GEN}/types/events.ts`);

// ═══════════════════════════════════════════════════
// 6. Generate Permission Manifest
// ═══════════════════════════════════════════════════
const permManifest = `// ═══════════════════════════════════════════════════
// BAR Generated Permission Manifest
// Generated: ${new Date().toISOString()}
// ═══════════════════════════════════════════════════

export interface Permission {
  id: string;
  name: string;
  group: string;
  action: string;
  domain: string;
  description: string;
}

export const PERMISSION_REGISTRY: Record<string, Permission> = {
${permissions.map(p => `  '${p.id}': {
    id: '${p.id}',
    name: '${p.name}',
    group: '${p.metadata?.group || ''}',
    action: '${p.metadata?.action || ''}',
    domain: '${p.domain}',
    description: '${p.description.replace(/'/g, "\\'")}',
  },`).join('\n')}
};

export const PERMISSION_GROUPS: Record<string, string[]> = {
${Object.entries(
  permissions.reduce((acc, p) => {
    const g = p.metadata?.group || 'unknown';
    if (!acc[g]) acc[g] = [];
    acc[g].push(p.id);
    return acc;
  }, {})
).map(([g, ids]) => `  '${g}': [${ids.map(id => `'${id}'`).join(', ')}],`).join('\n')}
};

export function hasPermission(userPermissions: string[], required: string): boolean {
  return userPermissions.includes(required) || userPermissions.includes('system.admin');
}

export function requirePermission(userPermissions: string[], required: string): void {
  if (!hasPermission(userPermissions, required)) {
    throw new Error(\`Permission denied: \${required}\`);
  }
}
`;

writeFileSync(join(GEN, 'types', 'permissions.ts'), permManifest);
console.log(`Generated permission manifest: ${GEN}/types/permissions.ts`);

// ═══════════════════════════════════════════════════
// 7. Generate Navigation Map
// ═══════════════════════════════════════════════════
const navMap = `// ═══════════════════════════════════════════════════
// BAR Generated Navigation Map
// Generated: ${new Date().toISOString()}
// ═══════════════════════════════════════════════════

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: NavItem[];
}

export const NAVIGATION: NavItem[] = [
  {
    id: 'knowledge',
    label: 'Knowledge',
    path: '/knowledge',
    children: [
${uiSurfaces.filter(u => u.tags?.includes('knowledge')).map(u => `      { id: '${u.id}', label: '${u.name}', path: '/knowledge/${u.name.toLowerCase().replace(/\s+/g, '-')}' },`).join('\n')}
    ],
  },
  {
    id: 'education',
    label: 'Education',
    path: '/education',
    children: [
${uiSurfaces.filter(u => u.tags?.includes('education')).map(u => `      { id: '${u.id}', label: '${u.name}', path: '/education/${u.name.toLowerCase().replace(/\s+/g, '-')}' },`).join('\n')}
    ],
  },
  {
    id: 'media',
    label: 'Media',
    path: '/media',
    children: [
${uiSurfaces.filter(u => u.tags?.includes('media') && !u.tags?.includes('education')).map(u => `      { id: '${u.id}', label: '${u.name}', path: '/media/${u.name.toLowerCase().replace(/\s+/g, '-')}' },`).join('\n')}
    ],
  },
  {
    id: 'admin',
    label: 'Administration',
    path: '/admin',
    children: [
${uiSurfaces.filter(u => u.tags?.includes('admin')).map(u => `      { id: '${u.id}', label: '${u.name}', path: '/admin/${u.name.toLowerCase().replace(/\s+/g, '-')}' },`).join('\n')}
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    path: '/finance',
    children: [
${uiSurfaces.filter(u => u.tags?.includes('finance')).map(u => `      { id: '${u.id}', label: '${u.name}', path: '/finance/${u.name.toLowerCase().replace(/\s+/g, '-')}' },`).join('\n')}
    ],
  },
  {
    id: 'community',
    label: 'Community',
    path: '/community',
    children: [
${uiSurfaces.filter(u => u.tags?.includes('community')).map(u => `      { id: '${u.id}', label: '${u.name}', path: '/community/${u.name.toLowerCase().replace(/\s+/g, '-')}' },`).join('\n')}
    ],
  },
  {
    id: 'engineering',
    label: 'Engineering',
    path: '/engineering',
    children: [
${uiSurfaces.filter(u => u.tags?.includes('engineering')).map(u => `      { id: '${u.id}', label: '${u.name}', path: '/engineering/${u.name.toLowerCase().replace(/\s+/g, '-')}' },`).join('\n')}
    ],
  },
  {
    id: 'compliance',
    label: 'Compliance',
    path: '/compliance',
    children: [
${uiSurfaces.filter(u => u.tags?.includes('compliance') || u.tags?.includes('governance')).map(u => `      { id: '${u.id}', label: '${u.name}', path: '/compliance/${u.name.toLowerCase().replace(/\s+/g, '-')}' },`).join('\n')}
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    children: [
${uiSurfaces.filter(u => u.tags?.includes('analytics')).map(u => `      { id: '${u.id}', label: '${u.name}', path: '/analytics/${u.name.toLowerCase().replace(/\s+/g, '-')}' },`).join('\n')}
    ],
  },
  {
    id: 'design',
    label: 'Design System',
    path: '/design',
    children: [
${uiSurfaces.filter(u => u.tags?.includes('design') || u.tags?.includes('ds')).map(u => `      { id: '${u.id}', label: '${u.name}', path: '/design/${u.name.toLowerCase().replace(/\s+/g, '-')}' },`).join('\n')}
    ],
  },
];

export function findNavItem(items: NavItem[], id: string): NavItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findNavItem(item.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function getBreadcrumb(id: string): string[] {
  const parts: string[] = [];
  function search(items: NavItem[], path: string[]): boolean {
    for (const item of items) {
      const currentPath = [...path, item.label];
      if (item.id === id) { parts.push(...currentPath); return true; }
      if (item.children && search(item.children, currentPath)) return true;
    }
    return false;
  }
  search(NAVIGATION, []);
  return parts;
}
`;

writeFileSync(join(GEN, 'types', 'navigation.ts'), navMap);
console.log(`Generated navigation map: ${GEN}/types/navigation.ts`);

// ═══════════════════════════════════════════════════
// 8. Generate Dependency Graph
// ═══════════════════════════════════════════════════
const depGraph = `// ═══════════════════════════════════════════════════
// BAR Generated Dependency Graph
// Generated: ${new Date().toISOString()}
// ═══════════════════════════════════════════════════

export interface DependencyNode {
  id: string;
  name: string;
  kind: string;
  domain: string;
  dependsOn: string[];
  downstream: string[];
}

export const DEPENDENCY_GRAPH: Record<string, DependencyNode> = {
${[...capabilities, ...workflows, ...skills, ...agents, ...services, ...packages, ...applications].map(e => `  '${e.id}': {
    id: '${e.id}',
    name: '${e.name.replace(/'/g, "\\'")}',
    kind: '${e.kind}',
    domain: '${e.domain}',
    dependsOn: [${(e.dependsOn || []).map(d => `'${d}'`).join(', ')}],
    downstream: [${(e.downstream || []).map(d => `'${d}'`).join(', ')}],
  },`).join('\n')}
};

export function getDependencies(id: string): DependencyNode[] {
  const node = DEPENDENCY_GRAPH[id];
  if (!node) return [];
  return node.dependsOn.map(depId => DEPENDENCY_GRAPH[depId]).filter(Boolean);
}

export function getDependents(id: string): DependencyNode[] {
  const node = DEPENDENCY_GRAPH[id];
  if (!node) return [];
  return node.downstream.map(downId => DEPENDENCY_GRAPH[downId]).filter(Boolean);
}

export function getTransitiveDependencies(id: string, visited = new Set<string>()): DependencyNode[] {
  if (visited.has(id)) return [];
  visited.add(id);
  const node = DEPENDENCY_GRAPH[id];
  if (!node) return [];
  const deps = [node];
  for (const depId of node.dependsOn) {
    deps.push(...getTransitiveDependencies(depId, visited));
  }
  return deps;
}

export function findCycle(): string[] | null {
  const visited = new Set<string>();
  const stack = new Set<string>();
  const path: string[] = [];

  function dfs(id: string): boolean {
    if (stack.has(id)) {
      path.push(id);
      return true;
    }
    if (visited.has(id)) return false;
    stack.add(id);
    path.push(id);
    const node = DEPENDENCY_GRAPH[id];
    if (node) {
      for (const dep of node.dependsOn) {
        if (dfs(dep)) return true;
      }
    }
    path.pop();
    stack.delete(id);
    visited.add(id);
    return false;
  }

  for (const id of Object.keys(DEPENDENCY_GRAPH)) {
    if (dfs(id)) return path;
  }
  return null;
}
`;

writeFileSync(join(GEN, 'types', 'dependencies.ts'), depGraph);
console.log(`Generated dependency graph: ${GEN}/types/dependencies.ts`);

console.log('\n=== Code Generation Complete ===');
console.log(`Types: ${TYPES}/bar.ts`);
console.log(`Zod: ${SCHEMAS}/bar.ts`);
console.log(`JSON Schema: ${SCHEMAS}/bar-schema.json`);
console.log(`OpenAPI: ${GEN}/openapi/bar-api.json`);
console.log(`Events: ${GEN}/types/events.ts`);
console.log(`Permissions: ${GEN}/types/permissions.ts`);
console.log(`Navigation: ${GEN}/types/navigation.ts`);
console.log(`Dependencies: ${GEN}/types/dependencies.ts`);
