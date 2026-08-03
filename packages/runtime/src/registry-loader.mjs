import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

/**
 * Registry Loader — loads BAR into memory as a typed registry.
 * This is the foundation of the entire runtime.
 */
export class RegistryLoader {
  /** @type {Map<string, import('../types/core.mjs').BarEntity[]>} */
  #byKind = new Map();
  /** @type {Map<string, import('../types/core.mjs').BarEntity>} */
  #byId = new Map();
  /** @type {Map<string, import('../types/core.mjs').BarEntity[]>} */
  #byDomain = new Map();
  /** @type {Map<string, import('../types/core.mjs').BarEntity[]>} */
  #byTag = new Map();
  #loaded = false;
  #barPath;
  #log;

  /** Mapping from singular kind name to BAR directory name */
  static DIR_MAP = {
    domain: 'domains', capability: 'capabilities', workflow: 'workflows',
    skill: 'skills', agent: 'agents', service: 'services', package: 'packages',
    application: 'applications', 'knowledge-object': 'knowledge-objects',
    event: 'events', permission: 'permissions', 'ui-surface': 'ui-surfaces',
  };

  /** All singular kind names */
  static KINDS = Object.keys(RegistryLoader.DIR_MAP);

  /**
   * @param {string} barPath - Path to BAR directory
   * @param {{ log?: (msg: string) => void }} [opts]
   */
  constructor(barPath, opts = {}) {
    this.#barPath = barPath;
    this.#log = opts.log || console.log;
  }

  /** Load all registries from BAR */
  load() {
    const start = performance.now();

    for (const kind of RegistryLoader.KINDS) {
      const dir = RegistryLoader.DIR_MAP[kind];
      const entities = this.#loadKind(dir);
      this.#byKind.set(kind, entities);
      for (const e of entities) {
        this.#byId.set(e.id, e);
        if (!this.#byDomain.has(e.domain)) this.#byDomain.set(e.domain, []);
        this.#byDomain.get(e.domain).push(e);
        for (const tag of (e.tags || [])) {
          if (!this.#byTag.has(tag)) this.#byTag.set(tag, []);
          this.#byTag.get(tag).push(e);
        }
      }
    }

    this.#loaded = true;
    const elapsed = (performance.now() - start).toFixed(1);
    this.#log(`Registry loaded: ${this.#byId.size} entities in ${elapsed}ms`);
    return this;
  }

  #loadKind(kind) {
    const dir = join(this.#barPath, kind);
    if (!existsSync(dir)) return [];
    try {
      const files = readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'index.json');
      return files.map(f => {
        try {
          return JSON.parse(readFileSync(join(dir, f), 'utf-8'));
        } catch {
          this.#log(`  WARN: failed to parse ${kind}/${f}`);
          return null;
        }
      }).filter(Boolean);
    } catch {
      return [];
    }
  }

  /** @param {string} id */
  get(id) { return this.#byId.get(id) || null; }

  /** @param {string} kind */
  getByKind(kind) { return this.#byKind.get(kind) || []; }

  /** @param {string} domainId */
  getByDomain(domainId) { return this.#byDomain.get(domainId) || []; }

  /** @param {string} tag */
  getByTag(tag) { return this.#byTag.get(tag) || []; }

  /** @param {(entity: import('../types/core.mjs').BarEntity) => boolean} predicate */
  query(predicate) {
    const results = [];
    for (const entities of this.#byKind.values()) {
      for (const e of entities) {
        if (predicate(e)) results.push(e);
      }
    }
    return results;
  }

  /** Get all unique tags across all entities */
  allTags() { return [...this.#byTag.keys()].sort(); }

  /** Get all unique domains */
  allDomains() { return [...this.#byDomain.keys()].sort(); }

  /** Get count by kind */
  counts() {
    const counts = {};
    for (const [k, v] of this.#byKind) counts[k] = v.length;
    counts.total = this.#byId.size;
    return counts;
  }

  /** Check if entity exists */
  has(id) { return this.#byId.has(id); }

  /** Get all entity IDs */
  allIds() { return [...this.#byId.keys()]; }

  /** Search by name or description */
  search(query) {
    const q = query.toLowerCase();
    return this.query(e =>
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q)
    );
  }

  /** Get the full dependency chain for an entity */
  getDependencyChain(id, depth = 0, visited = new Set()) {
    if (visited.has(id) || depth > 20) return [];
    visited.add(id);
    const entity = this.get(id);
    if (!entity) return [];
    const chain = [{ ...entity, depth }];
    for (const dep of (entity.dependsOn || [])) {
      chain.push(...this.getDependencyChain(dep, depth + 1, visited));
    }
    return chain;
  }

  /** Get all entities that depend on a given entity (reverse dependency) */
  getDependents(id) {
    const results = [];
    for (const entities of this.#byKind.values()) {
      for (const e of entities) {
        if ((e.dependsOn || []).includes(id)) results.push(e);
      }
    }
    return results;
  }

  /** Export registry as a plain object (for serialization) */
  toJSON() {
    const obj = {};
    for (const [k, v] of this.#byKind) obj[k] = v;
    return obj;
  }
}

/**
 * Create a registry loader with default path resolution.
 * Looks for BAR relative to the monorepo root.
 */
export function createRegistry(opts = {}) {
  const root = opts.root || process.cwd();
  const barPath = opts.barPath || join(root, 'bar');
  return new RegistryLoader(barPath, opts);
}
