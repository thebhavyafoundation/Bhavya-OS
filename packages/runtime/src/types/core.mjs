// ───────────────────────────────────────────────────
// Bhavya Runtime Core Types
// ───────────────────────────────────────────────────

export const Domain = /** @type {const} */ ({
  D01: 'Governance', D02: 'Administration', D03: 'Academics',
  D04: 'Research', D05: 'Knowledge Management', D06: 'Library',
  D07: 'Publications', D08: 'Media Production', D09: 'Community',
  D10: 'Volunteers', D11: 'Finance', D12: 'Legal',
  D13: 'Compliance', D14: 'Operations', D15: 'Infrastructure',
  D16: 'AI & Intelligence', D17: 'Engineering', D18: 'Analytics',
  D19: 'Outreach', D20: 'Partnerships', D21: 'Sustainability',
});

export const EntityKind = /** @type {const} */ ({
  Domain: 'domain', Capability: 'capability', Workflow: 'workflow',
  Skill: 'skill', Agent: 'agent', Service: 'service',
  Package: 'package', Application: 'application',
  KnowledgeObject: 'knowledge-object', Event: 'event',
  Permission: 'permission', UiSurface: 'ui-surface',
});

export const EntityStatus = /** @type {const} */ ({
  Proposed: 'proposed', Active: 'active',
  Deprecated: 'deprecated', Archived: 'archived',
});

export const ImplStatus = /** @type {const} */ ({
  NotStarted: 'not-started', InProgress: 'in-progress',
  Implemented: 'implemented', Partial: 'partial',
});

/**
 * @typedef {Object} BarEntity
 * @property {string} id
 * @property {string} name
 * @property {string} kind
 * @property {string} version
 * @property {string} status
 * @property {string} owner
 * @property {string} description
 * @property {string} domain
 * @property {string} sourceAdr
 * @property {string[]} dependsOn
 * @property {string[]} upstream
 * @property {string[]} downstream
 * @property {string[]} related
 * @property {{ status: string, location: string, files: string[] }} implementation
 * @property {{ status: string, location?: string }} tests
 * @property {{ status: string, location?: string }} docs
 * @property {string} release
 * @property {string} automation
 * @property {string[]} tags
 * @property {Record<string, any>} metadata
 */

/**
 * @typedef {Object} TraceResult
 * @property {string} id
 * @property {string} name
 * @property {string} kind
 * @property {'upstream'|'downstream'|'related'} direction
 * @property {TraceResult[]} [children]
 */

/**
 * @typedef {Object} ValidationReport
 * @property {string} timestamp
 * @property {number} errors
 * @property {number} warnings
 * @property {string[]} errorDetails
 * @property {string[]} warningDetails
 * @property {Record<string, number>} stats
 */

/**
 * @typedef {Object} RuntimeConfig
 * @property {string} barPath - Path to BAR directory
 * @property {string} logLevel - Log level (fatal, error, warn, info, debug, trace)
 * @property {boolean} strict - Enable strict validation
 * @property {number} cacheTimeout - Cache timeout in ms
 */

/**
 * @typedef {Object} ResolveResult
 * @property {BarEntity} entity
 * @property {BarEntity[]} upstream
 * @property {BarEntity[]} downstream
 * @property {BarEntity[]} skills
 * @property {BarEntity[]} agents
 * @property {BarEntity[]} services
 * @property {BarEntity[]} events
 * @property {BarEntity[]} permissions
 */
