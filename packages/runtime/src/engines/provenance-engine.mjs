import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

/**
 * Provenance Engine — tracks the origin and lineage of all artifacts.
 * Every artifact carries provenance from capability → release.
 */
export class ProvenanceEngine {
  #registry;
  #provenanceDir;
  #records = new Map();

  /**
   * @param {import('../registry-loader.mjs').RegistryLoader} registry
   * @param {string} provenanceDir - Directory to store provenance records
   */
  constructor(registry, provenanceDir) {
    this.#registry = registry;
    this.#provenanceDir = provenanceDir;
    if (!existsSync(provenanceDir)) mkdirSync(provenanceDir, { recursive: true });
    this.#loadRecords();
  }

  /**
   * Record provenance for an artifact.
   * @param {string} artifactId - Unique artifact identifier
   * @param {Object} provenance
   * @param {string} provenance.capabilityId - Source capability
   * @param {string} provenance.workflowId - Executed workflow
   * @param {string} provenance.skillId - Used skill
   * @param {string} provenance.agentId - Responsible agent
   * @param {string} provenance.serviceId - Produced by service
   * @param {string} provenance.packageId - Belongs to package
   * @param {string} provenance.applicationId - Deployed in application
   * @param {string} provenance.source - Source file or URL
   * @param {string} provenance.actor - Who/what created it
   * @param {Record<string, any>} provenance.metadata - Extra context
   */
  record(artifactId, provenance) {
    const record = {
      artifactId,
      timestamp: new Date().toISOString(),
      ...provenance,
      lineage: this.#buildLineage(provenance),
    };

    this.#records.set(artifactId, record);
    this.#saveRecord(record);
    return record;
  }

  /**
   * Get provenance for an artifact.
   * @param {string} artifactId
   */
  get(artifactId) {
    return this.#records.get(artifactId) || null;
  }

  /**
   * Get the full lineage chain for an artifact.
   * @param {string} artifactId
   */
  getLineage(artifactId) {
    const record = this.#records.get(artifactId);
    if (!record) return null;

    const lineage = {
      institution: 'Bhavya Foundation',
      domain: null,
      capability: null,
      workflow: null,
      skill: null,
      agent: null,
      service: null,
      package: null,
      application: null,
      artifact: artifactId,
      source: record.source,
      actor: record.actor,
      timestamp: record.timestamp,
    };

    // Resolve each entity
    if (record.capabilityId) lineage.capability = this.#registry.get(record.capabilityId);
    if (lineage.capability) lineage.domain = this.#registry.get(lineage.capability.domain);
    if (record.workflowId) lineage.workflow = this.#registry.get(record.workflowId);
    if (record.skillId) lineage.skill = this.#registry.get(record.skillId);
    if (record.agentId) lineage.agent = this.#registry.get(record.agentId);
    if (record.serviceId) lineage.service = this.#registry.get(record.serviceId);
    if (record.packageId) lineage.package = this.#registry.get(record.packageId);
    if (record.applicationId) lineage.application = this.#registry.get(record.applicationId);

    return lineage;
  }

  /**
   * Trace provenance backwards from an artifact to its originating capability.
   * @param {string} artifactId
   */
  traceToCapability(artifactId) {
    const lineage = this.getLineage(artifactId);
    if (!lineage) return null;
    return lineage.capability;
  }

  /**
   * Find all artifacts produced by a capability.
   * @param {string} capabilityId
   */
  findByCapability(capabilityId) {
    const results = [];
    for (const [, record] of this.#records) {
      if (record.capabilityId === capabilityId) results.push(record);
    }
    return results;
  }

  /**
   * Find all artifacts produced by a service.
   * @param {string} serviceId
   */
  findByService(serviceId) {
    const results = [];
    for (const [, record] of this.#records) {
      if (record.serviceId === serviceId) results.push(record);
    }
    return results;
  }

  /**
   * Find all artifacts in a package.
   * @param {string} packageId
   */
  findByPackage(packageId) {
    const results = [];
    for (const [, record] of this.#records) {
      if (record.packageId === packageId) results.push(record);
    }
    return results;
  }

  /**
   * Generate a provenance report.
   */
  report() {
    const byCapability = {};
    const byService = {};
    const byActor = {};

    for (const [, record] of this.#records) {
      const cap = record.capabilityId || 'unknown';
      const svc = record.serviceId || 'unknown';
      const actor = record.actor || 'unknown';
      byCapability[cap] = (byCapability[cap] || 0) + 1;
      byService[svc] = (byService[svc] || 0) + 1;
      byActor[actor] = (byActor[actor] || 0) + 1;
    }

    return {
      total: this.#records.size,
      byCapability,
      byService,
      byActor,
    };
  }

  // ─── Private ────────────────────────────────────

  #buildLineage(provenance) {
    const chain = [];
    if (provenance.capabilityId) {
      const cap = this.#registry.get(provenance.capabilityId);
      if (cap) chain.push({ kind: 'capability', id: cap.id, name: cap.name });
    }
    if (provenance.workflowId) chain.push({ kind: 'workflow', id: provenance.workflowId });
    if (provenance.skillId) chain.push({ kind: 'skill', id: provenance.skillId });
    if (provenance.agentId) chain.push({ kind: 'agent', id: provenance.agentId });
    if (provenance.serviceId) chain.push({ kind: 'service', id: provenance.serviceId });
    if (provenance.packageId) chain.push({ kind: 'package', id: provenance.packageId });
    if (provenance.applicationId) chain.push({ kind: 'application', id: provenance.applicationId });
    return chain;
  }

  #loadRecords() {
    if (!existsSync(this.#provenanceDir)) return;
    try {
      const files = readdirSync(this.#provenanceDir).filter(f => f.endsWith('.json'));
      for (const file of files) {
        try {
          const record = JSON.parse(readFileSync(join(this.#provenanceDir, file), 'utf-8'));
          this.#records.set(record.artifactId, record);
        } catch { /* skip */ }
      }
    } catch { /* ok */ }
  }

  #saveRecord(record) {
    const filename = `${record.artifactId.replace(/[^a-zA-Z0-9]/g, '-')}.json`;
    writeFileSync(join(this.#provenanceDir, filename), JSON.stringify(record, null, 2));
  }
}
