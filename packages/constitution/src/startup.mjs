/**
 * Constitution Startup — Auto-initialization module
 * 
 * Automatically initializes the Constitution SDK when the server starts.
 * Validates document integrity, builds indices, and caches results.
 */

import { initialize, getStats, isInitialized } from './sdk.mjs';
import { DOCUMENTS, getDocument } from './registry.mjs';
import { loadDocument, isLoaded, getCacheStats } from './loader.mjs';

/**
 * Startup configuration
 */
const CONFIG = {
  validateIntegrity: true,
  buildSearchIndex: true,
  buildKnowledgeGraph: true,
  logLevel: 'info', // 'silent', 'error', 'warn', 'info', 'debug'
  retryOnFailure: true,
  maxRetries: 3,
  retryDelay: 1000
};

/**
 * Initialize the Constitution system
 * @param {Object} options - Configuration options
 * @returns {Object} Initialization result
 */
export async function startup(options = {}) {
  const config = { ...CONFIG, ...options };
  const startTime = Date.now();
  const log = createLogger(config.logLevel);

  log('info', '=== Constitution Startup ===');
  log('info', `Documents to process: ${DOCUMENTS.length}`);

  const result = {
    success: false,
    documentsProcessed: 0,
    documentsFailed: 0,
    indexBuilt: false,
    graphBuilt: false,
    integrityValid: false,
    errors: [],
    warnings: [],
    duration: 0
  };

  try {
    // Phase 1: Validate document integrity
    if (config.validateIntegrity) {
      log('info', 'Phase 1: Validating document integrity...');
      const integrityResult = await validateDocumentIntegrity(config, log);
      result.integrityValid = integrityResult.valid;
      result.warnings.push(...integrityResult.warnings);
      
      if (!integrityResult.valid) {
        result.errors.push(...integrityResult.errors);
        if (!config.retryOnFailure) {
          throw new Error('Document integrity validation failed');
        }
      }
    }

    // Phase 2: Initialize SDK (loads, parses, builds)
    log('info', 'Phase 2: Initializing Constitution SDK...');
    const initResult = await initializeWithRetry(config, log);
    result.documentsProcessed = initResult.documents;
    result.indexBuilt = initResult.indexBuilt;
    result.graphBuilt = initResult.graphBuilt;
    
    if (!initResult.success) {
      result.errors.push(...initResult.errors);
      throw new Error('SDK initialization failed');
    }

    // Phase 3: Post-initialization validation
    log('info', 'Phase 3: Post-initialization validation...');
    const postResult = await postInitializationValidation(config, log);
    result.warnings.push(...postResult.warnings);

    result.success = true;
    log('info', '=== Constitution Startup Complete ===');

  } catch (error) {
    log('error', `Startup failed: ${error.message}`);
    result.errors.push(error.message);
  }

  result.duration = Date.now() - startTime;
  log('info', `Duration: ${result.duration}ms`);

  return result;
}

/**
 * Validate document integrity
 */
async function validateDocumentIntegrity(config, log) {
  const result = { valid: true, errors: [], warnings: [] };

  for (const docMeta of DOCUMENTS) {
    try {
      const doc = await loadDocument(docMeta.id);
      
      // Check content exists
      if (!doc.content || doc.content.length === 0) {
        result.errors.push(`Document ${docMeta.id} has no content`);
        result.valid = false;
        continue;
      }

      // Check minimum length
      if (doc.content.length < 1000) {
        result.warnings.push(`Document ${docMeta.id} is unusually short (${doc.content.length} chars)`);
      }

      // Check for required sections
      const requiredSections = getRequiredSections(docMeta.id);
      for (const section of requiredSections) {
        if (!doc.content.toLowerCase().includes(section.toLowerCase())) {
          result.warnings.push(`Document ${docMeta.id} may be missing section: ${section}`);
        }
      }

      log('debug', `Validated: ${docMeta.id} (${doc.wordCount} words)`);

    } catch (error) {
      result.errors.push(`Failed to load ${docMeta.id}: ${error.message}`);
      result.valid = false;
    }
  }

  return result;
}

/**
 * Get required sections for a document
 */
function getRequiredSections(docId) {
  const required = {
    'constitution': ['Preamble', 'Definitions', 'Vision', 'Mission', 'Governance', 'Financial'],
    'trust-deed': ['Purpose', 'Trustees', 'Property', 'Accounts'],
    'founders-charter': ['Authority', 'Vision', 'Legacy'],
    'board-charter': ['Composition', 'Roles', 'Responsibilities'],
    'code-of-ethics': ['Principles', 'Conduct', 'Enforcement']
  };
  return required[docId] || [];
}

/**
 * Initialize with retry logic
 */
async function initializeWithRetry(config, log) {
  let lastError = null;
  
  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      log('info', `Initialization attempt ${attempt}/${config.maxRetries}`);
      
      const result = await initialize();
      
      return {
        success: true,
        documents: result.documents,
        indexBuilt: true,
        graphBuilt: true,
        errors: []
      };
    } catch (error) {
      lastError = error;
      log('warn', `Attempt ${attempt} failed: ${error.message}`);
      
      if (attempt < config.maxRetries) {
        log('info', `Retrying in ${config.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, config.retryDelay));
      }
    }
  }

  return {
    success: false,
    documents: 0,
    indexBuilt: false,
    graphBuilt: false,
    errors: [lastError?.message || 'Unknown error']
  };
}

/**
 * Post-initialization validation
 */
async function postInitializationValidation(config, log) {
  const result = { warnings: [] };

  const stats = getStats();
  
  if (stats.cache.loaded !== DOCUMENTS.length) {
    result.warnings.push(
      `Expected ${DOCUMENTS.length} documents loaded, got ${stats.cache.loaded}`
    );
  }

  if (stats.index.totalTerms < 100) {
    result.warnings.push('Search index has fewer than 100 terms');
  }

  if (stats.graph.totalNodes < 50) {
    result.warnings.push('Knowledge graph has fewer than 50 nodes');
  }

  log('info', `Stats: ${JSON.stringify(stats, null, 2)}`);

  return result;
}

/**
 * Create a logger function
 */
function createLogger(level) {
  const levels = { silent: 0, error: 1, warn: 2, info: 3, debug: 4 };
  const currentLevel = levels[level] || 3;

  return (msgLevel, message) => {
    if (levels[msgLevel] <= currentLevel) {
      const prefix = {
        error: '[ERROR]',
        warn: '[WARN]',
        info: '[INFO]',
        debug: '[DEBUG]'
      }[msgLevel] || '[LOG]';

      console.log(`[Constitution] ${prefix} ${message}`);
    }
  };
}

/**
 * Get startup status
 */
export async function getStatus() {
  return {
    initialized: isInitialized(),
    stats: getStats(),
    documents: DOCUMENTS.map(doc => ({
      id: doc.id,
      loaded: isLoaded(doc.id)
    }))
  };
}

export default {
  startup,
  getStatus
};
