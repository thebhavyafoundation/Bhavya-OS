/**
 * Dependency Resolver — resolves and validates dependency graphs.
 * Detects cycles, computes topological order, finds critical paths.
 */
export class DependencyResolver {
  #registry;

  /** @param {import('../registry-loader.mjs').RegistryLoader} registry */
  constructor(registry) {
    this.#registry = registry;
  }

  /**
   * Get topological order of all entities (or a subset).
   * Entities with no dependencies come first.
   * @param {string[]} [ids] - Subset of entity IDs to sort
   * @returns {string[]} Topologically sorted IDs
   */
  topologicalSort(ids) {
    const targetIds = ids || this.#registry.allIds();
    const idSet = new Set(targetIds);
    const visited = new Set();
    const order = [];

    const visit = (id) => {
      if (visited.has(id)) return;
      visited.add(id);
      const entity = this.#registry.get(id);
      if (!entity) return;
      for (const dep of (entity.dependsOn || [])) {
        if (idSet.has(dep)) visit(dep);
      }
      order.push(id);
    };

    for (const id of targetIds) visit(id);
    return order;
  }

  /**
   * Detect cycles in the dependency graph.
   * @returns {{ hasCycle: boolean, cycles: string[][] }}
   */
  detectCycles() {
    const allIds = this.#registry.allIds();
    const visited = new Set();
    const stack = new Set();
    const cycles = [];

    const dfs = (id, path) => {
      if (stack.has(id)) {
        const cycleStart = path.indexOf(id);
        if (cycleStart >= 0) cycles.push(path.slice(cycleStart));
        return;
      }
      if (visited.has(id)) return;
      stack.add(id);
      path.push(id);
      const entity = this.#registry.get(id);
      if (entity) {
        for (const dep of (entity.dependsOn || [])) {
          if (allIds.includes(dep)) dfs(dep, [...path]);
        }
      }
      stack.delete(id);
      visited.add(id);
    };

    for (const id of allIds) dfs(id, []);
    return { hasCycle: cycles.length > 0, cycles };
  }

  /**
   * Find the critical path (longest dependency chain).
   * @returns {{ path: string[], depth: number }}
   */
  findCriticalPath() {
    const allIds = this.#registry.allIds();
    const depths = new Map();
    let maxDepth = 0;
    let deepestId = null;

    const computeDepth = (id, visited = new Set()) => {
      if (depths.has(id)) return depths.get(id);
      if (visited.has(id)) return 0;
      visited.add(id);
      const entity = this.#registry.get(id);
      if (!entity || !entity.dependsOn?.length) {
        depths.set(id, 0);
        return 0;
      }
      let maxDepDepth = 0;
      for (const dep of entity.dependsOn) {
        const d = computeDepth(dep, new Set(visited));
        if (d > maxDepDepth) maxDepDepth = d;
      }
      const depth = maxDepDepth + 1;
      depths.set(id, depth);
      if (depth > maxDepth) { maxDepth = depth; deepestId = id; }
      return depth;
    };

    for (const id of allIds) computeDepth(id);

    // Reconstruct path from deepest
    const path = [];
    let current = deepestId;
    while (current) {
      path.unshift(current);
      const entity = this.#registry.get(current);
      if (!entity?.dependsOn?.length) break;
      // Follow the first dependency (simplified)
      current = entity.dependsOn[0];
      if (path.includes(current)) break; // safety
    }

    return { path, depth: maxDepth };
  }

  /**
   * Get the dependency depth of an entity (how many layers deep).
   * @param {string} id
   */
  getDepth(id) {
    const entity = this.#registry.get(id);
    if (!entity || !entity.dependsOn?.length) return 0;
    let maxDepDepth = 0;
    for (const dep of entity.dependsOn) {
      const d = this.getDepth(dep);
      if (d > maxDepDepth) maxDepDepth = d;
    }
    return maxDepDepth + 1;
  }

  /**
   * Get all entities at a given depth level.
   * @param {number} depth
   */
  getAtDepth(depth) {
    return this.#registry.allIds().filter(id => this.getDepth(id) === depth);
  }

  /**
   * Compute the full dependency depth map.
   * @returns {Map<string, number>}
   */
  depthMap() {
    const map = new Map();
    for (const id of this.#registry.allIds()) {
      map.set(id, this.getDepth(id));
    }
    return map;
  }

  /**
   * Validate that all dependencies exist.
   * @returns {{ valid: boolean, missing: Array<{id: string, missingDep: string}> }}
   */
  validateDependencies() {
    const allIds = new Set(this.#registry.allIds());
    const missing = [];

    for (const id of allIds) {
      const entity = this.#registry.get(id);
      if (!entity) continue;
      for (const dep of (entity.dependsOn || [])) {
        if (!allIds.has(dep)) missing.push({ id, missingDep: dep });
      }
    }

    return { valid: missing.length === 0, missing };
  }

  /**
   * Get the impact analysis: if entity X changes, what is affected?
   * @param {string} id
   * @returns {string[]} All downstream entity IDs
   */
  impactAnalysis(id) {
    const affected = new Set();
    const queue = [id];
    while (queue.length) {
      const current = queue.shift();
      const dependents = this.#registry.getDependents(current);
      for (const d of dependents) {
        if (!affected.has(d.id)) {
          affected.add(d.id);
          queue.push(d.id);
        }
      }
    }
    return [...affected];
  }
}
