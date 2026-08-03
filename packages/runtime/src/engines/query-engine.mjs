/**
 * Registry Query Engine — advanced querying over the registry.
 * Supports filters, aggregations, and complex queries.
 */
export class QueryEngine {
  #registry;

  /** @param {import('../registry-loader.mjs').RegistryLoader} registry */
  constructor(registry) {
    this.#registry = registry;
  }

  /**
   * Query entities with a filter object.
   * @param {Object} filter
   * @param {string} [filter.kind]
   * @param {string} [filter.domain]
   * @param {string} [filter.status]
   * @param {string} [filter.impl]
   * @param {string} [filter.tag]
   * @param {string} [filter.search]
   * @param {string} [filter.owner]
   * @param {string} [filter.adr]
   * @param {string[]} [filter.dependsOn]
   * @param {string[]} [filter.related]
   * @param {{ field: string, order?: 'asc'|'desc' }} [filter.sort]
   * @param {number} [filter.limit]
   * @param {number} [filter.offset]
   */
  query(filter = {}) {
    let results = this.#registry.query(() => true); // start with all

    if (filter.kind) results = results.filter(e => e.kind === filter.kind);
    if (filter.domain) results = results.filter(e => e.domain === filter.domain);
    if (filter.status) results = results.filter(e => e.status === filter.status);
    if (filter.impl) results = results.filter(e => e.implementation?.status === filter.impl);
    if (filter.owner) results = results.filter(e => e.owner === filter.owner);
    if (filter.adr) results = results.filter(e => e.sourceAdr === filter.adr);
    if (filter.tag) results = results.filter(e => (e.tags || []).includes(filter.tag));

    if (filter.search) {
      const q = filter.search.toLowerCase();
      results = results.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q)
      );
    }

    if (filter.dependsOn) {
      results = results.filter(e =>
        filter.dependsOn.every(dep => (e.dependsOn || []).includes(dep))
      );
    }

    if (filter.related) {
      results = results.filter(e =>
        filter.related.every(rel => (e.related || []).includes(rel))
      );
    }

    // Sort
    if (filter.sort) {
      const dir = filter.sort.order === 'desc' ? -1 : 1;
      results.sort((a, b) => {
        const aVal = a[filter.sort.field] || '';
        const bVal = b[filter.sort.field] || '';
        return aVal.localeCompare(bVal) * dir;
      });
    }

    // Pagination
    const total = results.length;
    if (filter.offset) results = results.slice(filter.offset);
    if (filter.limit) results = results.slice(0, filter.limit);

    return { results, total, limit: filter.limit, offset: filter.offset || 0 };
  }

  /**
   * Aggregate entities by a field.
   * @param {string} field - 'kind', 'domain', 'status', 'implementation.status'
   */
  aggregateBy(field) {
    const all = this.#registry.query(() => true);
    const groups = {};
    for (const e of all) {
      let value;
      if (field === 'implementation.status') value = e.implementation?.status || 'unknown';
      else value = e[field] || 'unknown';
      if (!groups[value]) groups[value] = 0;
      groups[value]++;
    }
    return groups;
  }

  /**
   * Get summary statistics.
   */
  summary() {
    const all = this.#registry.query(() => true);
    const byKind = this.aggregateBy('kind');
    const byStatus = this.aggregateBy('status');
    const byImpl = this.aggregateBy('implementation.status');

    const implemented = all.filter(e => e.implementation?.status === 'implemented').length;
    const partial = all.filter(e => e.implementation?.status === 'partial').length;
    const notStarted = all.filter(e => e.implementation?.status === 'not-started').length;

    return {
      total: all.length,
      byKind,
      byStatus,
      byImpl,
      implementation: {
        implemented,
        partial,
        notStarted,
        percentComplete: ((implemented / all.length) * 100).toFixed(1) + '%',
      },
    };
  }

  /**
   * Find entities by multiple IDs.
   * @param {string[]} ids
   */
  getByIds(ids) {
    return ids.map(id => this.#registry.get(id)).filter(Boolean);
  }

  /**
   * Find entities that match a complex predicate.
   * @param {(entity: import('../types/core.mjs').BarEntity) => boolean} predicate
   */
  find(predicate) {
    return this.#registry.query(predicate);
  }

  /**
   * Find one entity matching a predicate.
   * @param {(entity: import('../types/core.mjs').BarEntity) => boolean} predicate
   */
  findOne(predicate) {
    return this.#registry.query(predicate)[0] || null;
  }

  /**
   * Count entities matching a filter.
   * @param {Object} filter - Same as query filter
   */
  count(filter) {
    return this.query(filter).total;
  }

  /**
   * Check if a capability has all required supporting entities.
   * @param {string} capabilityId
   */
  completenessCheck(capabilityId) {
    const cap = this.#registry.get(capabilityId);
    if (!cap) return null;

    const has = {
      workflow: this.#registry.getByKind('workflow')
        .some(w => (w.related || []).includes(capabilityId)),
      skill: this.#registry.getByKind('skill')
        .some(s => s.domain === cap.domain),
      agent: this.#registry.getByKind('agent')
        .some(a => (a.metadata?.capabilities || []).includes(capabilityId)),
      service: this.#registry.getByKind('service')
        .some(s => s.domain === cap.domain || s.metadata?.crossCutting),
      event: this.#registry.getByKind('event')
        .some(e => (e.related || []).includes(capabilityId)),
      permission: this.#registry.getByKind('permission')
        .some(p => p.domain === cap.domain),
      uiSurface: this.#registry.getByKind('ui-surface')
        .some(u => u.domain === cap.domain),
    };

    const score = Object.values(has).filter(Boolean).length;
    const total = Object.keys(has).length;

    return {
      capabilityId,
      capability: cap.name,
      has,
      score,
      total,
      percent: ((score / total) * 100).toFixed(0) + '%',
      missing: Object.entries(has).filter(([, v]) => !v).map(([k]) => k),
    };
  }

  /**
   * Get the implementation roadmap (entities sorted by dependency depth and priority).
   */
  roadmap() {
    const deps = new Map();
    const computeDepth = (id, visited = new Set()) => {
      if (deps.has(id)) return deps.get(id);
      if (visited.has(id)) return 0;
      visited.add(id);
      const e = this.#registry.get(id);
      if (!e?.dependsOn?.length) { deps.set(id, 0); return 0; }
      let max = 0;
      for (const dep of e.dependsOn) {
        const d = computeDepth(dep, new Set(visited));
        if (d > max) max = d;
      }
      const depth = max + 1;
      deps.set(id, depth);
      return depth;
    };

    const entities = this.#registry.query(() => true);
    for (const e of entities) computeDepth(e.id);

    return entities
      .sort((a, b) => {
        const da = deps.get(a.id) || 0;
        const db = deps.get(b.id) || 0;
        return da - db;
      })
      .map(e => ({
        id: e.id,
        name: e.name,
        kind: e.kind,
        domain: e.domain,
        depth: deps.get(e.id) || 0,
        impl: e.implementation?.status || 'not-started',
      }));
  }
}
