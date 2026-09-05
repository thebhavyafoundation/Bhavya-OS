/**
 * Constitution Loader — Reads and caches constitutional document content
 *
 * Loads .md files from the archived constitution store and provides access
 * to document content. All content is cached after first load for performance.
 * Store location (ICM migration 2026-09-05): `_archive/constitution-2026-09-05/`
 * — see `_archive/ICM-ARCHIVE-MANIFEST.md` for provenance.
 */

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { DOCUMENTS, getDocument } from './registry.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Document store: archived constitution directory (moved from root 2026-09-05).
// `meta.filename` values in registry.mjs resolve against this directory.
const DOCUMENT_DIR = join(__dirname, '..', '..', '..', '_archive', 'constitution-2026-09-05');

// Cache for loaded documents
const contentCache = new Map();

/**
 * Load a constitutional document by ID
 * @param {string} id - Document ID from registry
 * @returns {Promise<Object>} Document with content
 */
export async function loadDocument(id) {
  if (contentCache.has(id)) {
    return contentCache.get(id);
  }

  const meta = getDocument(id);
  if (!meta) {
    throw new Error(`Document not found in registry: ${id}`);
  }

  const filePath = join(DOCUMENT_DIR, meta.filename);
  
  try {
    const content = await readFile(filePath, 'utf-8');
    const doc = {
      ...meta,
      content,
      loadedAt: new Date().toISOString(),
      wordCount: content.split(/\s+/).length,
      lineCount: content.split('\n').length
    };
    
    contentCache.set(id, doc);
    return doc;
  } catch (error) {
    throw new Error(`Failed to load document ${meta.filename}: ${error.message}`);
  }
}

/**
 * Load all constitutional documents
 * @returns {Promise<Array>} All documents with content
 */
export async function loadAllDocuments() {
  const loadPromises = DOCUMENTS.map(doc => loadDocument(doc.id));
  return Promise.all(loadPromises);
}

/**
 * Get cached document content (synchronous)
 * Returns null if not yet loaded
 */
export function getCachedContent(id) {
  return contentCache.get(id) || null;
}

/**
 * Check if a document is loaded
 */
export function isLoaded(id) {
  return contentCache.has(id);
}

/**
 * Clear the content cache
 */
export function clearCache() {
  contentCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    loaded: contentCache.size,
    total: DOCUMENTS.length,
    documents: Array.from(contentCache.keys())
  };
}

export default {
  loadDocument,
  loadAllDocuments,
  getCachedContent,
  isLoaded,
  clearCache,
  getCacheStats
};
