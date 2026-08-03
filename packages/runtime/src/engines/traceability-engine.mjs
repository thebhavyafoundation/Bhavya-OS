/**
 * Traceability Engine — bidirectional tracing from any entity.
 * Provides full lineage from institutional capability to source code.
 */
export class TraceabilityEngine {
  #registry;
  #cache = new Map();

  /** @param {import('../registry-loader.mjs').RegistryLoader} registry */
  constructor(registry) {
    this.#registry = registry;
  }

  /**
   * Trace upstream from an entity to its origins.
   * @param {string} id
   * @param {number} [maxDepth=20]
   * @returns {import('../types/core.mjs').TraceResult[]}
   */
  traceUp(id, maxDepth = 20) {
    return this.#trace(id, 'upstream', maxDepth, new Set());
  }

  /**
   * Trace downstream from an entity to all dependents.
   * @param {string} id
   * @param {number} [maxDepth=20]
   * @returns {import('../types/core.mjs').TraceResult[]}
   */
  traceDown(id, maxDepth = 20) {
    return this.#trace(id, 'downstream', maxDepth, new Set());
  }

  /**
   * Full trace: upstream, downstream, and related.
   * @param {string} id
   */
  traceAll(id) {
    return {
      entity: this.#registry.get(id),
      upstream: this.traceUp(id),
      downstream: this.traceDown(id),
      related: this.#getRelated(id),
    };
  }

  /**
   * Trace from a capability to its full execution chain.
   * Institution → Domain → Capability → Workflow → Skill →
   * Agent → Service → Package → Application → UI Surface
   */
  traceExecutionChain(capabilityId) {
    const entity = this.#registry.get(capabilityId);
    if (!entity) return null;

    const chain = {
      institution: 'Bhavya Foundation',
      domain: this.#registry.get(entity.domain),
      capability: entity,
      workflow: null,
      skill: null,
      agent: null,
      service: null,
      package: null,
      application: null,
      uiSurface: null,
    };

    // Find workflow
    const workflows = this.#registry.getByKind('workflow')
      .filter(w => (w.related || []).includes(capabilityId));
    chain.workflow = workflows[0] || null;

    // Find skill
    const skills = this.#registry.getByKind('skill')
      .filter(s => (s.related || []).includes(capabilityId) || s.domain === entity.domain);
    chain.skill = skills[0] || null;

    // Find agent
    const agents = this.#registry.getByKind('agent')
      .filter(a => (a.metadata?.capabilities || []).includes(capabilityId));
    chain.agent = agents[0] || null;

    // Find service
    const services = this.#registry.getByKind('service')
      .filter(s => s.domain === entity.domain || s.metadata?.crossCutting);
    chain.service = services[0] || null;

    // Find package
    if (chain.service) {
      const packages = this.#registry.getByKind('package')
        .filter(p => (p.related || []).includes(chain.service.id) || p.domain === entity.domain);
      chain.package = packages[0] || null;
    }

    // Find application
    if (chain.package) {
      const apps = this.#registry.getByKind('application')
        .filter(a => (a.dependsOn || []).includes(chain.package.id));
      chain.application = apps[0] || null;
    }

    // Find UI surface
    if (chain.application) {
      const surfaces = this.#registry.getByKind('ui-surface')
        .filter(u => u.tags?.some(t => t.startsWith('app:')));
      chain.uiSurface = surfaces[0] || null;
    }

    return chain;
  }

  /**
   * Trace from a React component path back to its capability.
   * @param {string} componentPath - e.g., 'src/app/knowledge/page.tsx'
   */
  traceFromComponent(componentPath) {
    // Find UI surfaces that reference this path
    const surfaces = this.#registry.query(e =>
      e.kind === 'ui-surface' &&
      (e.metadata?.files || []).some(f => componentPath.includes(f))
    );

    if (!surfaces.length) return null;

    const surface = surfaces[0];
    const app = this.#registry.getByKind('application')
      .find(a => surface.tags?.some(t => t.startsWith('app:')));

    return {
      component: componentPath,
      uiSurface: surface,
      application: app || null,
      capability: this.#traceUpToCapability(surface.id),
    };
  }

  /**
   * Trace from an API endpoint to its capability.
   * @param {string} endpoint - e.g., '/api/knowledge'
   */
  traceFromEndpoint(endpoint) {
    // Find services that handle this endpoint
    const services = this.#registry.query(e =>
      e.kind === 'service' && endpoint.includes(`/${e.id}`)
    );

    if (!services.length) return null;

    const service = services[0];
    return {
      endpoint,
      service,
      capability: this.#traceUpToCapability(service.id),
    };
  }

  /**
   * Get the lineage report for an entity.
   * @param {string} id
   */
  getLineage(id) {
    const entity = this.#registry.get(id);
    if (!entity) return null;

    return {
      id: entity.id,
      name: entity.name,
      kind: entity.kind,
      domain: entity.domain,
      sourceAdr: entity.sourceAdr,
      implementation: entity.implementation,
      tests: entity.tests,
      docs: entity.docs,
      release: entity.release,
      upstreamCount: (entity.dependsOn || []).length,
      downstreamCount: (entity.downstream || []).length,
      relatedCount: (entity.related || []).length,
    };
  }

  /**
   * Generate a traceability report for the entire registry.
   */
  generateReport() {
    const stats = {
      totalEntities: this.#registry.allIds().length,
      byKind: {},
      avgUpstream: 0,
      avgDownstream: 0,
      orphaned: 0,
      wellConnected: 0,
    };

    for (const kind of ['domain', 'capability', 'workflow', 'skill', 'agent', 'service', 'package', 'application', 'knowledge-object', 'event', 'permission', 'ui-surface']) {
      stats.byKind[kind] = this.#registry.getByKind(kind).length;
    }

    let totalUp = 0, totalDown = 0, orphans = 0, connected = 0;
    for (const id of this.#registry.allIds()) {
      const entity = this.#registry.get(id);
      const up = (entity.dependsOn || []).length;
      const down = (entity.downstream || []).length;
      totalUp += up;
      totalDown += down;
      if (up === 0 && down === 0) orphans++;
      if (up + down >= 5) connected++;
    }

    stats.avgUpstream = (totalUp / stats.totalEntities).toFixed(1);
    stats.avgDownstream = (totalDown / stats.totalEntities).toFixed(1);
    stats.orphaned = orphans;
    stats.wellConnected = connected;

    return stats;
  }

  // ─── Private ────────────────────────────────────

  #trace(id, direction, maxDepth, visited) {
    if (visited.has(id) || maxDepth <= 0) return [];
    visited.add(id);
    const entity = this.#registry.get(id);
    if (!entity) return [];

    const refIds = direction === 'upstream' ? entity.dependsOn : entity.downstream;
    const results = [];

    for (const refId of (refIds || [])) {
      const ref = this.#registry.get(refId);
      if (ref) {
        results.push({
          id: ref.id,
          name: ref.name,
          kind: ref.kind,
          direction,
          children: this.#trace(refId, direction, maxDepth - 1, new Set(visited)),
        });
      }
    }

    return results;
  }

  #getRelated(id) {
    const entity = this.#registry.get(id);
    if (!entity) return [];
    return (entity.related || [])
      .map(relId => this.#registry.get(relId))
      .filter(Boolean)
      .map(e => ({ id: e.id, name: e.name, kind: e.kind, direction: 'related' }));
  }

  #traceUpToCapability(id) {
    const visited = new Set();
    let current = id;
    while (current && !visited.has(current)) {
      visited.add(current);
      const entity = this.#registry.get(current);
      if (!entity) return null;
      if (entity.kind === 'capability') return entity;
      current = (entity.dependsOn || [])[0];
    }
    return null;
  }
}
