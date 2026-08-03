/**
 * Entity Resolver — resolves capabilities and their full execution context.
 * Given a capability ID, returns everything needed to execute it.
 */
export class EntityResolver {
  #registry;

  /** @param {import('../registry-loader.mjs').RegistryLoader} registry */
  constructor(registry) {
    this.#registry = registry;
  }

  /**
   * Resolve a capability to its full execution context.
   * @param {string} capabilityId - e.g., 'D05-C02'
   * @returns {import('../types/core.mjs').ResolveResult | null}
   */
  resolveCapability(capabilityId) {
    const entity = this.#registry.get(capabilityId);
    if (!entity || entity.kind !== 'capability') return null;

    return {
      entity,
      upstream: this.#resolveRefs(entity.dependsOn),
      downstream: this.#resolveRefs(entity.downstream),
      skills: this.#findSkillsForCapability(capabilityId),
      agents: this.#findAgentsForCapability(capabilityId),
      services: this.#findServicesForCapability(capabilityId),
      events: this.#findEventsForCapability(capabilityId),
      permissions: this.#findPermissionsForCapability(capabilityId),
    };
  }

  /**
   * Resolve a workflow to its execution chain.
   * @param {string} workflowId
   */
  resolveWorkflow(workflowId) {
    const entity = this.#registry.get(workflowId);
    if (!entity || entity.kind !== 'workflow') return null;

    return {
      entity,
      skills: this.#resolveRefs(entity.related).filter(e => e.kind === 'skill'),
      upstream: this.#resolveRefs(entity.dependsOn),
      downstream: this.#resolveRefs(entity.downstream),
    };
  }

  /**
   * Resolve an agent to its capabilities and services.
   * @param {string} agentId
   */
  resolveAgent(agentId) {
    const entity = this.#registry.get(agentId);
    if (!entity || entity.kind !== 'agent') return null;

    const capIds = entity.metadata?.capabilities || [];
    const capabilities = capIds.map(id => this.#registry.get(id)).filter(Boolean);

    return {
      entity,
      capabilities,
      services: this.#findServicesForAgent(agentId),
      skills: this.#findSkillsForAgent(agentId),
    };
  }

  /**
   * Resolve a package to its services and applications.
   * @param {string} packageId
   */
  resolvePackage(packageId) {
    const entity = this.#registry.get(packageId);
    if (!entity || entity.kind !== 'package') return null;

    return {
      entity,
      services: this.#findServicesInPackage(packageId),
      applications: this.#findApplicationsForPackage(packageId),
      dependencies: this.#resolveRefs(entity.dependsOn),
    };
  }

  /**
   * Find which agent owns a given capability.
   * @param {string} capabilityId
   */
  findOwner(capabilityId) {
    const agents = this.#registry.getByKind('agent');
    for (const agent of agents) {
      const caps = agent.metadata?.capabilities || [];
      if (caps.includes(capabilityId)) return agent;
    }
    return null;
  }

  /**
   * Find which package contains a given service.
   * @param {string} serviceId
   */
  findPackage(serviceId) {
    const packages = this.#registry.getByKind('package');
    for (const pkg of packages) {
      if ((pkg.related || []).includes(serviceId)) return pkg;
    }
    return null;
  }

  /**
   * Get the full execution chain for a capability.
   * Capability → Workflow → Skill → Agent → Service → Package → Application
   */
  getExecutionChain(capabilityId) {
    const resolved = this.resolveCapability(capabilityId);
    if (!resolved) return null;

    const chain = [resolved.entity];

    // Find workflows
    const workflows = this.#registry.getByKind('workflow')
      .filter(w => (w.related || []).includes(capabilityId));
    chain.push(...workflows);

    // Find skills
    chain.push(...resolved.skills);

    // Find agents
    chain.push(...resolved.agents);

    // Find services
    chain.push(...resolved.services);

    // Find packages (via services)
    const packageIds = new Set();
    for (const svc of resolved.services) {
      const pkg = this.findPackage(svc.id);
      if (pkg && !packageIds.has(pkg.id)) {
        packageIds.add(pkg.id);
        chain.push(pkg);
      }
    }

    // Find applications (via packages)
    const appIds = new Set();
    for (const pkgId of packageIds) {
      const apps = this.#registry.getByKind('application')
        .filter(a => (a.dependsOn || []).includes(pkgId));
      for (const app of apps) {
        if (!appIds.has(app.id)) {
          appIds.add(app.id);
          chain.push(app);
        }
      }
    }

    return chain;
  }

  // ─── Private helpers ────────────────────────────

  #resolveRefs(ids) {
    if (!ids) return [];
    return ids.map(id => this.#registry.get(id)).filter(Boolean);
  }

  #findSkillsForCapability(capabilityId) {
    return this.#registry.getByKind('skill').filter(s =>
      (s.related || []).includes(capabilityId) ||
      s.domain === this.#registry.get(capabilityId)?.domain
    );
  }

  #findAgentsForCapability(capabilityId) {
    return this.#registry.getByKind('agent').filter(a => {
      const caps = a.metadata?.capabilities || [];
      return caps.includes(capabilityId);
    });
  }

  #findServicesForCapability(capabilityId) {
    const entity = this.#registry.get(capabilityId);
    if (!entity) return [];
    return this.#registry.getByKind('service').filter(s =>
      s.domain === entity.domain || s.metadata?.crossCutting
    );
  }

  #findEventsForCapability(capabilityId) {
    return this.#registry.getByKind('event').filter(e =>
      (e.related || []).includes(capabilityId)
    );
  }

  #findPermissionsForCapability(capabilityId) {
    return this.#registry.getByKind('permission').filter(p =>
      (p.related || []).includes(capabilityId)
    );
  }

  #findServicesForAgent(agentId) {
    const agent = this.#registry.get(agentId);
    if (!agent) return [];
    return this.#registry.getByKind('service').filter(s =>
      s.domain === agent.domain || s.metadata?.crossCutting
    );
  }

  #findSkillsForAgent(agentId) {
    const agent = this.#registry.get(agentId);
    if (!agent) return [];
    return this.#registry.getByKind('skill').filter(s =>
      s.domain === agent.domain
    );
  }

  #findServicesInPackage(packageId) {
    const pkg = this.#registry.get(packageId);
    if (!pkg) return [];
    return this.#registry.getByKind('service').filter(s =>
      (pkg.related || []).includes(s.id) || s.domain === pkg.domain
    );
  }

  #findApplicationsForPackage(packageId) {
    return this.#registry.getByKind('application').filter(a =>
      (a.dependsOn || []).includes(packageId)
    );
  }
}
