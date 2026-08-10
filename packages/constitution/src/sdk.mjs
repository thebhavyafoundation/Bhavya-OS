/**
 * Constitution SDK — Public API for Bhavya Foundation's Constitutional Documents
 * 
 * Provides a unified interface for querying, searching, and retrieving
 * information from all 15 Constitutional Documents.
 */

import { DOCUMENTS, getDocument, getDocumentByNumber, getDocumentsByCategory, getDependencies, getDependents, searchDocuments, getGovernanceHierarchy } from './registry.mjs';
import { loadDocument, loadAllDocuments, isLoaded, getCacheStats } from './loader.mjs';
import { parseDocument, extractSections, extractArticles, extractDefinitions, extractPolicies, extractResponsibilities, extractPrinciples, generateSummary } from './parser.mjs';
import { buildIndex, search as indexSearch, getIndexStats } from './indexer.mjs';
import { buildKnowledgeGraph, queryGraph, findPath, getGraphStats } from './knowledge-graph.mjs';

// State
let initialized = false;
let initializationPromise = null;

/**
 * Initialize the Constitution SDK
 * Loads all documents, builds index and knowledge graph
 */
export async function initialize() {
  if (initialized) return { success: true, alreadyInitialized: true };
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    try {
      console.log('[Constitution] Initializing SDK...');
      
      // Load all documents
      const documents = await loadAllDocuments();
      console.log(`[Constitution] Loaded ${documents.length} documents`);

      // Parse all documents
      for (const doc of documents) {
        doc.parsed = parseDocument(doc.content);
      }
      console.log('[Constitution] Parsed all documents');

      // Build search index
      buildIndex(documents);
      console.log('[Constitution] Built search index');

      // Build knowledge graph
      buildKnowledgeGraph(documents);
      console.log('[Constitution] Built knowledge graph');

      initialized = true;
      console.log('[Constitution] SDK initialized successfully');

      return { 
        success: true, 
        documents: documents.length,
        stats: getStats()
      };
    } catch (error) {
      console.error('[Constitution] Initialization failed:', error);
      initializationPromise = null;
      throw error;
    }
  })();

  return initializationPromise;
}

/**
 * Get SDK statistics
 */
export function getStats() {
  return {
    initialized,
    cache: getCacheStats(),
    index: getIndexStats(),
    graph: getGraphStats()
  };
}

// ============================================================
// Document Retrieval
// ============================================================

/**
 * Get a constitutional document by ID
 * @param {string} id - Document ID (e.g., 'constitution', 'trust-deed')
 * @returns {Object} Document with full content
 */
export async function getConstitutionalDocument(id) {
  await ensureInitialized();
  const doc = getDocument(id);
  if (!doc) return null;
  if (!isLoaded(id)) {
    await loadDocument(id);
  }
  return doc;
}

/**
 * Get all constitutional documents
 * @returns {Array} All 15 documents
 */
export async function getAllDocuments() {
  await ensureInitialized();
  return DOCUMENTS.map(doc => ({
    id: doc.id,
    number: doc.number,
    title: doc.title,
    category: doc.category,
    authority: doc.authority,
    authorityLevel: doc.authorityLevel,
    description: doc.description,
    tags: doc.tags
  }));
}

/**
 * Get document by number
 * @param {string} number - Document number (e.g., '01', '15')
 */
export async function getDocumentByNumberQuery(number) {
  await ensureInitialized();
  return getDocumentByNumber(number);
}

/**
 * Get documents by category
 * @param {string} category - Category name
 */
export async function getDocumentsByCategoryQuery(category) {
  await ensureInitialized();
  return getDocumentsByCategory(category);
}

// ============================================================
// Article Retrieval
// ============================================================

/**
 * Get all articles from a document
 * @param {string} docId - Document ID
 */
export async function getArticles(docId) {
  await ensureInitialized();
  const doc = await loadDocument(docId);
  if (!doc || !doc.parsed) return [];
  return doc.parsed.articles;
}

/**
 * Get a specific article
 * @param {string} docId - Document ID
 * @param {string} articleNumber - Article number
 */
export async function getArticle(docId, articleNumber) {
  await ensureInitialized();
  const articles = await getArticles(docId);
  return articles.find(a => a.number === articleNumber) || null;
}

// ============================================================
// Definition Retrieval
// ============================================================

/**
 * Get all defined terms from a document
 * @param {string} docId - Document ID
 */
export async function getDefinitions(docId) {
  await ensureInitialized();
  const doc = await loadDocument(docId);
  if (!doc || !doc.parsed) return [];
  return doc.parsed.definitions;
}

/**
 * Search for a term definition across all documents
 * @param {string} term - Term to define
 */
export async function searchDefinitions(term) {
  await ensureInitialized();
  const results = [];
  
  for (const doc of DOCUMENTS) {
    const loadedDoc = await loadDocument(doc.id);
    if (!loadedDoc || !loadedDoc.parsed) continue;
    
    const matchingDefs = loadedDoc.parsed.definitions.filter(d =>
      d.term.toLowerCase().includes(term.toLowerCase()) ||
      d.definition.toLowerCase().includes(term.toLowerCase())
    );
    
    for (const def of matchingDefs) {
      results.push({
        ...def,
        documentId: doc.id,
        documentTitle: doc.title,
        documentNumber: doc.number
      });
    }
  }
  
  return results;
}

// ============================================================
// Policy Retrieval
// ============================================================

/**
 * Get all policies from a document
 * @param {string} docId - Document ID
 */
export async function getPolicies(docId) {
  await ensureInitialized();
  const doc = await loadDocument(docId);
  if (!doc || !doc.parsed) return [];
  return doc.parsed.policies;
}

/**
 * Search policies across all documents
 * @param {string} keyword - Policy keyword
 */
export async function searchPolicies(keyword) {
  await ensureInitialized();
  const results = [];
  
  for (const doc of DOCUMENTS) {
    const loadedDoc = await loadDocument(doc.id);
    if (!loadedDoc || !loadedDoc.parsed) continue;
    
    const matchingPolicies = loadedDoc.parsed.policies.filter(p =>
      p.statement.toLowerCase().includes(keyword.toLowerCase()) ||
      p.keyword.toLowerCase().includes(keyword.toLowerCase())
    );
    
    for (const policy of matchingPolicies) {
      results.push({
        ...policy,
        documentId: doc.id,
        documentTitle: doc.title,
        documentNumber: doc.number
      });
    }
  }
  
  return results.sort((a, b) => b.confidence - a.confidence);
}

// ============================================================
// Responsibility Retrieval
// ============================================================

/**
 * Get all responsibilities from a document
 * @param {string} docId - Document ID
 */
export async function getResponsibilities(docId) {
  await ensureInitialized();
  const doc = await loadDocument(docId);
  if (!doc || !doc.parsed) return [];
  return doc.parsed.responsibilities;
}

/**
 * Search responsibilities across all documents
 * @param {string} role - Role or entity
 */
export async function searchResponsibilities(role) {
  await ensureInitialized();
  const results = [];
  
  for (const doc of DOCUMENTS) {
    const loadedDoc = await loadDocument(doc.id);
    if (!loadedDoc || !loadedDoc.parsed) continue;
    
    const matchingResp = loadedDoc.parsed.responsibilities.filter(r =>
      r.statement.toLowerCase().includes(role.toLowerCase())
    );
    
    for (const resp of matchingResp) {
      results.push({
        ...resp,
        documentId: doc.id,
        documentTitle: doc.title,
        documentNumber: doc.number
      });
    }
  }
  
  return results;
}

// ============================================================
// Principle Retrieval
// ============================================================

/**
 * Get all principles from a document
 * @param {string} docId - Document ID
 */
export async function getPrinciples(docId) {
  await ensureInitialized();
  const doc = await loadDocument(docId);
  if (!doc || !doc.parsed) return [];
  return doc.parsed.principles;
}

// ============================================================
// Governance Retrieval
// ============================================================

/**
 * Get governance hierarchy
 */
export async function getGovernanceHierarchyQuery() {
  await ensureInitialized();
  return getGovernanceHierarchy();
}

/**
 * Get document dependencies
 * @param {string} docId - Document ID
 */
export async function getDocumentDependencies(docId) {
  await ensureInitialized();
  return getDependencies(docId);
}

/**
 * Get documents that depend on a given document
 * @param {string} docId - Document ID
 */
export async function getDocumentDependents(docId) {
  await ensureInitialized();
  return getDependents(docId);
}

// ============================================================
// Search
// ============================================================

/**
 * Full-text search across all documents
 * @param {string} query - Search query
 * @param {Object} options - Search options
 */
export async function search(query, options = {}) {
  await ensureInitialized();
  return indexSearch(query, options);
}

/**
 * Search by keyword in document titles and descriptions
 * @param {string} keyword - Search keyword
 */
export async function searchByKeyword(keyword) {
  await ensureInitialized();
  return searchDocuments(keyword);
}

// ============================================================
// Knowledge Graph
// ============================================================

/**
 * Query the knowledge graph around a node
 * @param {string} nodeId - Node ID
 * @param {Object} options - Query options
 */
export async function queryKnowledgeGraph(nodeId, options = {}) {
  await ensureInitialized();
  return queryGraph(nodeId, options);
}

/**
 * Find path between two constitutional elements
 * @param {string} sourceId - Source node ID
 * @param {string} targetId - Target node ID
 */
export async function findRelationshipPath(sourceId, targetId) {
  await ensureInitialized();
  return findPath(sourceId, targetId);
}

// ============================================================
// Citation
// ============================================================

/**
 * Generate a citation for a constitutional reference
 * @param {string} docId - Document ID
 * @param {Object} options - Citation options
 */
export async function cite(docId, options = {}) {
  await ensureInitialized();
  const doc = getDocument(docId);
  if (!doc) return null;

  const { format = 'text', includeArticle = false, articleNumber = null } = options;

  let citation = '';

  if (format === 'text') {
    citation = `Bhavya Foundation, "${doc.title}" (${doc.number}), Article ${doc.number}`;
    if (includeArticle && articleNumber) {
      citation += `, Article ${articleNumber}`;
    }
    citation += ` (effective ${doc.effectiveDate})`;
  } else if (format === 'apa') {
    citation = `Bhavya Foundation. (${doc.effectiveDate.slice(0, 4)}). ${doc.title}. Bhavya Foundation.`;
  } else if (format === 'markdown') {
    citation = `**${doc.title}** (${doc.number}), Article ${doc.number}`;
    if (includeArticle && articleNumber) {
      citation += `, Article ${articleNumber}`;
    }
  }

  return {
    citation,
    document: {
      id: doc.id,
      number: doc.number,
      title: doc.title,
      authority: doc.authority,
      authorityLevel: doc.authorityLevel
    },
    source: doc.filename,
    retrievedAt: new Date().toISOString()
  };
}

// ============================================================
// Document Summary
// ============================================================

/**
 * Get a summary of a constitutional document
 * @param {string} docId - Document ID
 */
export async function getDocumentSummary(docId) {
  await ensureInitialized();
  const doc = await loadDocument(docId);
  if (!doc || !doc.parsed) return null;

  return {
    id: doc.id,
    number: doc.number,
    title: doc.title,
    category: doc.category,
    authority: doc.authority,
    authorityLevel: doc.authorityLevel,
    wordCount: doc.wordCount,
    lineCount: doc.lineCount,
    summary: generateSummary(doc.parsed)
  };
}

/**
 * Get summary of all documents
 */
export async function getAllDocumentSummaries() {
  await ensureInitialized();
  const summaries = [];
  
  for (const doc of DOCUMENTS) {
    const summary = await getDocumentSummary(doc.id);
    if (summary) summaries.push(summary);
  }
  
  return summaries;
}

// ============================================================
// Utility
// ============================================================

/**
 * Ensure SDK is initialized
 */
async function ensureInitialized() {
  if (!initialized) {
    await initialize();
  }
}

/**
 * Check if SDK is initialized
 */
export function isInitialized() {
  return initialized;
}

/**
 * Reset SDK state
 */
export function reset() {
  initialized = false;
  initializationPromise = null;
}

export default {
  initialize,
  getStats,
  getConstitutionalDocument,
  getAllDocuments,
  getDocumentByNumberQuery,
  getDocumentsByCategoryQuery,
  getArticles,
  getArticle,
  getDefinitions,
  searchDefinitions,
  getPolicies,
  searchPolicies,
  getResponsibilities,
  searchResponsibilities,
  getPrinciples,
  getGovernanceHierarchyQuery,
  getDocumentDependencies,
  getDocumentDependents,
  search,
  searchByKeyword,
  queryKnowledgeGraph,
  findRelationshipPath,
  cite,
  getDocumentSummary,
  getAllDocumentSummaries,
  isInitialized,
  reset
};
