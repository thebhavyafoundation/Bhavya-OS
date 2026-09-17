import { join } from 'path';
import { RegistryLoader, createRegistry } from './registry-loader.mjs';
import { EntityResolver } from './resolvers/entity-resolver.mjs';
import { DependencyResolver } from './resolvers/dependency-resolver.mjs';
import { TraceabilityEngine } from './engines/traceability-engine.mjs';
import { EventDispatcher } from './engines/event-dispatcher.mjs';
import { WorkflowExecutor } from './engines/workflow-executor.mjs';
import { PermissionEngine } from './engines/permission-engine.mjs';
import { ProvenanceEngine } from './engines/provenance-engine.mjs';
import { QueryEngine } from './engines/query-engine.mjs';
import { ConstitutionEngine } from './engines/constitution-engine.mjs';

/**
 * Bhavya Runtime SDK — single entry point for all runtime operations.
 *
 * Usage:
 *   import { createRuntime } from '@bhavya/runtime';
 *   const rt = createRuntime({ barPath: '/path/to/bar' });
 *   rt.load();
 *
 *   // Resolve a capability
 *   const ctx = rt.resolve('D05-C02');
 *
 *   // Execute a workflow
 *   const result = await rt.workflow('WF-001', { koId: 'ko-123' });
 *
 *   // Check permissions
 *   const ok = rt.permit.has('user-1', 'PM-KNOW-READ');
 *
 *   // Trace provenance
 *   const lineage = rt.trace.lineage('artifact-123');
 *
 *   // Constitution queries
 *   const citation = await rt.constitution.generateCitation('constitution');
 */
export class BhavyaRuntime {
  #registry;
  #resolver;
  #deps;
  #trace;
  #events;
  #workflow;
  #permit;
  #provenance;
  #query;
  #constitution;
  #loaded = false;

  /**
   * @param {Object} opts
   * @param {string} opts.barPath - Path to BAR directory
   * @param {string} [opts.provenanceDir] - Path to provenance storage
   * @param {string} [opts.logLevel] - Log level
   */
  constructor(opts = {}) {
    const barPath = opts.barPath || join(process.cwd(), 'bar');
    const provenanceDir = opts.provenanceDir || join(barPath, 'provenance');

    this.#registry = createRegistry({ barPath, log: this.#log.bind(this) });
    this.#resolver = new EntityResolver(this.#registry);
    this.#deps = new DependencyResolver(this.#registry);
    this.#trace = new TraceabilityEngine(this.#registry);
    this.#events = new EventDispatcher(this.#registry);
    this.#workflow = new WorkflowExecutor(this.#registry, this.#events);
    this.#permit = new PermissionEngine(this.#registry);
    this.#provenance = new ProvenanceEngine(this.#registry, provenanceDir);
    this.#query = new QueryEngine(this.#registry);
    this.#constitution = new ConstitutionEngine();
  }

  /** Load the registry and initialize constitution (must be called before any operations) */
  async load() {
    this.#registry.load();
    await this.#constitution.initialize();
    this.#loaded = true;
    return this;
  }

  /** Ensure registry is loaded */
  #ensure() {
    if (!this.#loaded) throw new Error('Runtime not loaded. Call load() first.');
  }

  // ───────────────────────────────────────────────────
  // Public API — the SDK surface
  // ───────────────────────────────────────────────────

  /**
   * Resolve a capability to its full execution context.
   * @param {string} capabilityId
   */
  resolve(capabilityId) {
    this.#ensure();
    return this.#resolver.resolveCapability(capabilityId);
  }

  /**
   * Get the execution chain for a capability.
   * @param {string} capabilityId
   */
  chain(capabilityId) {
    this.#ensure();
    return this.#resolver.getExecutionChain(capabilityId);
  }

  /**
   * Find which agent owns a capability.
   * @param {string} capabilityId
   */
  owner(capabilityId) {
    this.#ensure();
    return this.#resolver.findOwner(capabilityId);
  }

  /**
   * Execute a workflow.
   * @param {string} workflowId
   * @param {Record<string, any>} input
   */
  async workflow(workflowId, input = {}) {
    this.#ensure();
    return this.#workflow.execute(workflowId, input);
  }

  /**
   * Simulate a workflow (dry run).
   * @param {string} workflowId
   * @param {Record<string, any>} input
   */
  async simulate(workflowId, input = {}) {
    this.#ensure();
    return this.#workflow.simulate(workflowId, input);
  }

  /**
   * Get an entity by ID.
   * @param {string} id
   */
  get(id) {
    this.#ensure();
    return this.#registry.get(id);
  }

  /**
   * Search the registry.
   * @param {string} query
   */
  search(query) {
    this.#ensure();
    return this.#registry.search(query);
  }

  /**
   * Query with filters.
   * @param {Object} filter
   */
  query(filter) {
    this.#ensure();
    return this.#query.query(filter);
  }

  /**
   * Get summary statistics.
   */
  summary() {
    this.#ensure();
    return this.#query.summary();
  }

  /**
   * Check implementation completeness for a capability.
   * @param {string} capabilityId
   */
  completeness(capabilityId) {
    this.#ensure();
    return this.#query.completenessCheck(capabilityId);
  }

  /**
   * Get the implementation roadmap.
   */
  roadmap() {
    this.#ensure();
    return this.#query.roadmap();
  }

  /**
   * Dispatch an event.
   * @param {string} eventName
   * @param {Record<string, any>} payload
   */
  async emit(eventName, payload) {
    this.#ensure();
    return this.#events.dispatch(eventName, payload);
  }

  /**
   * Register an event handler.
   * @param {string} eventName
   * @param {Function} handler
   */
  on(eventName, handler) {
    this.#events.on(eventName, handler);
    return this;
  }

  /**
   * Trace upstream from an entity.
   * @param {string} id
   */
  traceUp(id) {
    this.#ensure();
    return this.#trace.traceUp(id);
  }

  /**
   * Trace downstream from an entity.
   * @param {string} id
   */
  traceDown(id) {
    this.#ensure();
    return this.#trace.traceDown(id);
  }

  /**
   * Full trace for an entity.
   * @param {string} id
   */
  traceAll(id) {
    this.#ensure();
    return this.#trace.traceAll(id);
  }

  /**
   * Trace execution chain from a capability.
   * @param {string} capabilityId
   */
  traceChain(capabilityId) {
    this.#ensure();
    return this.#trace.traceExecutionChain(capabilityId);
  }

  /**
   * Record provenance.
   * @param {string} artifactId
   * @param {Object} provenance
   */
  provenance(artifactId, provenance) {
    this.#ensure();
    return this.#provenance.record(artifactId, provenance);
  }

  /**
   * Get provenance for an artifact.
   * @param {string} artifactId
   */
  getProvenance(artifactId) {
    this.#ensure();
    return this.#provenance.get(artifactId);
  }

  /**
   * Detect dependency cycles.
   */
  cycles() {
    this.#ensure();
    return this.#deps.detectCycles();
  }

  /**
   * Get topological order.
   * @param {string[]} [ids]
   */
  topoSort(ids) {
    this.#ensure();
    return this.#deps.topologicalSort(ids);
  }

  /**
   * Impact analysis — what is affected if entity X changes.
   * @param {string} id
   */
  impact(id) {
    this.#ensure();
    return this.#deps.impactAnalysis(id);
  }

  /**
   * Validate dependencies.
   */
  validateDeps() {
    this.#ensure();
    return this.#deps.validateDependencies();
  }

  // ─── Named sub-APIs for convenience ─────────────

  /** Permission sub-API */
  get permit() { return this.#permit; }

  /** Event sub-API */
  get events() { return this.#events; }

  /** Workflow sub-API */
  get workflows() { return this.#workflow; }

  /** Dependency sub-API */
  get dependencies() { return this.#deps; }

  /** Query sub-API */
  get queries() { return this.#query; }

  /** Registry stats */
  get counts() {
    this.#ensure();
    return this.#registry.counts();
  }

  /** Constitution sub-API */
  get constitution() { return this.#constitution; }

  #log(msg) {
    // Quiet by default, can be overridden
  }
}

/**
 * Create a Bhavya Runtime instance.
 * @param {Object} opts
 * @param {string} opts.barPath
 * @param {string} [opts.provenanceDir]
 */
export function createRuntime(opts = {}) {
  return new BhavyaRuntime(opts);
}

// Re-export all types and engines
export { RegistryLoader, createRegistry } from './registry-loader.mjs';
export { EntityResolver } from './resolvers/entity-resolver.mjs';
export { DependencyResolver } from './resolvers/dependency-resolver.mjs';
export { TraceabilityEngine } from './engines/traceability-engine.mjs';
export { EventDispatcher } from './engines/event-dispatcher.mjs';
export { WorkflowExecutor } from './engines/workflow-executor.mjs';
export { PermissionEngine, PermissionError } from './engines/permission-engine.mjs';
export { ProvenanceEngine } from './engines/provenance-engine.mjs';
export { QueryEngine } from './engines/query-engine.mjs';
