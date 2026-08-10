/**
 * Constitution Engine — Integrates the Constitution SDK with the Bhavya Runtime
 * 
 * Provides constitutional awareness to all runtime operations.
 * Every AI action must retrieve from this layer and cite sources.
 */

import { initialize as initConstitution, search, cite, getConstitutionalDocument, searchDefinitions, searchPolicies, searchResponsibilities, queryKnowledgeGraph, findRelationshipPath, getAllDocumentSummaries, getStats } from '../../constitution/src/sdk.mjs';

export class ConstitutionEngine {
  #initialized = false;
  #initPromise = null;

  /**
   * Initialize the Constitution Engine
   */
  async initialize() {
    if (this.#initialized) return { success: true };
    if (this.#initPromise) return this.#initPromise;

    this.#initPromise = (async () => {
      try {
        const result = await initConstitution();
        this.#initialized = true;
        return result;
      } catch (error) {
        console.error('[ConstitutionEngine] Initialization failed:', error);
        this.#initPromise = null;
        throw error;
      }
    })();

    return this.#initPromise;
  }

  /**
   * Ensure engine is initialized
   */
  #ensure() {
    if (!this.#initialized) {
      throw new Error('Constitution Engine not initialized. Call initialize() first.');
    }
  }

  /**
   * Search constitutional documents
   * @param {string} query - Search query
   * @param {Object} options - Search options
   */
  async searchConstitution(query, options = {}) {
    this.#ensure();
    return search(query, options);
  }

  /**
   * Get a constitutional document
   * @param {string} id - Document ID
   */
  async getDocument(id) {
    this.#ensure();
    return getConstitutionalDocument(id);
  }

  /**
   * Search for definitions
   * @param {string} term - Term to define
   */
  async getDefinition(term) {
    this.#ensure();
    return searchDefinitions(term);
  }

  /**
   * Search for policies
   * @param {string} keyword - Policy keyword
   */
  async getPolicies(keyword) {
    this.#ensure();
    return searchPolicies(keyword);
  }

  /**
   * Search for responsibilities
   * @param {string} role - Role or entity
   */
  async getResponsibilities(role) {
    this.#ensure();
    return searchResponsibilities(role);
  }

  /**
   * Generate a citation for a constitutional reference
   * @param {string} docId - Document ID
   * @param {Object} options - Citation options
   */
  async generateCitation(docId, options = {}) {
    this.#ensure();
    return cite(docId, options);
  }

  /**
   * Query the knowledge graph
   * @param {string} nodeId - Node ID
   * @param {Object} options - Query options
   */
  async queryKnowledgeGraph(nodeId, options = {}) {
    this.#ensure();
    return queryKnowledgeGraph(nodeId, options);
  }

  /**
   * Find relationship path between two elements
   * @param {string} sourceId - Source node ID
   * @param {string} targetId - Target node ID
   */
  async findRelationship(sourceId, targetId) {
    this.#ensure();
    return findRelationshipPath(sourceId, targetId);
  }

  /**
   * Get all document summaries
   */
  async getDocumentSummaries() {
    this.#ensure();
    return getAllDocumentSummaries();
  }

  /**
   * Get engine statistics
   */
  getStats() {
    if (!this.#initialized) return null;
    return getStats();
  }

  /**
   * Validate an action against constitutional requirements
   * @param {string} action - Action to validate
   * @param {Object} context - Action context
   */
  async validateAction(action, context = {}) {
    this.#ensure();

    const violations = [];
    const warnings = [];

    // Search for relevant policies
    const policies = await searchPolicies(action);
    
    for (const policy of policies.slice(0, 5)) {
      if (policy.statement.toLowerCase().includes('prohibited') ||
          policy.statement.toLowerCase().includes('not permitted')) {
        violations.push({
          policy: policy.statement,
          document: policy.documentTitle,
          confidence: policy.confidence
        });
      } else if (policy.statement.toLowerCase().includes('must') ||
                 policy.statement.toLowerCase().includes('shall')) {
        warnings.push({
          requirement: policy.statement,
          document: policy.documentTitle,
          confidence: policy.confidence
        });
      }
    }

    return {
      valid: violations.length === 0,
      violations,
      warnings,
      relevantPolicies: policies.slice(0, 10)
    };
  }

  /**
   * Check if an action requires approval
   * @param {string} action - Action to check
   * @param {Object} context - Action context
   */
  async requiresApproval(action, context = {}) {
    this.#ensure();

    const approvalKeywords = [
      'board approval', 'founder approval', 'trustee approval',
      'financial commitment', 'contract', 'agreement', 'partnership'
    ];

    const lowerAction = action.toLowerCase();
    
    for (const keyword of approvalKeywords) {
      if (lowerAction.includes(keyword)) {
        const policies = await searchPolicies(keyword);
        if (policies.length > 0) {
          return {
            required: true,
            reason: `Action contains "${keyword}" which may require approval`,
            relevantPolicies: policies.slice(0, 3)
          };
        }
      }
    }

    return { required: false };
  }

  /**
   * Get compliance checklist for an action
   * @param {string} action - Action to get checklist for
   */
  async getComplianceChecklist(action) {
    this.#ensure();

    const checklist = [];

    // Check for ethical requirements
    const ethics = await searchPolicies('ethical');
    if (ethics.length > 0) {
      checklist.push({
        category: 'Ethics',
        items: ethics.slice(0, 3).map(p => p.statement)
      });
    }

    // Check for transparency requirements
    const transparency = await searchPolicies('transparency');
    if (transparency.length > 0) {
      checklist.push({
        category: 'Transparency',
        items: transparency.slice(0, 3).map(p => p.statement)
      });
    }

    // Check for accountability requirements
    const accountability = await searchPolicies('accountability');
    if (accountability.length > 0) {
      checklist.push({
        category: 'Accountability',
        items: accountability.slice(0, 3).map(p => p.statement)
      });
    }

    return checklist;
  }
}

export default ConstitutionEngine;
