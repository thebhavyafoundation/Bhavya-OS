/**
 * Constitution Indexer — Builds and queries the search index
 * 
 * Creates an inverted index for fast full-text search across all
 * constitutional documents. Supports weighted ranking and faceted search.
 */

import { DOCUMENTS, getDocument } from './registry.mjs';

// Stop words to ignore in indexing
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
  'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can',
  'this', 'that', 'these', 'those', 'it', 'its', 'they', 'them', 'their',
  'we', 'our', 'you', 'your', 'he', 'she', 'his', 'her', 'not', 'no',
  'nor', 'if', 'then', 'else', 'when', 'where', 'how', 'what', 'which',
  'who', 'whom', 'whose', 'there', 'here', 'all', 'each', 'every',
  'both', 'few', 'more', 'most', 'other', 'some', 'such', 'than',
  'too', 'very', 'just', 'about', 'above', 'after', 'again', 'also'
]);

// Index storage
let searchIndex = null;
let documentStore = new Map();

/**
 * Build the search index from all documents
 * @param {Array} documents - Loaded documents with content
 * @returns {Object} Search index
 */
export function buildIndex(documents) {
  const index = {
    terms: new Map(),       // term -> [{docId, field, positions, score}]
    documents: new Map(),   // docId -> {metadata, fieldLengths}
    fields: ['title', 'description', 'content', 'tags', 'keyProvisions', 'definitions'],
    fieldWeights: {
      title: 10,
      description: 5,
      tags: 8,
      keyProvisions: 7,
      definitions: 6,
      content: 1
    },
    totalDocuments: documents.length,
    builtAt: new Date().toISOString()
  };

  for (const doc of documents) {
    indexDocument(index, doc);
  }

  searchIndex = index;
  return index;
}

/**
 * Index a single document
 */
function indexDocument(index, doc) {
  const fieldLengths = {};

  // Store document metadata
  index.documents.set(doc.id, {
    id: doc.id,
    number: doc.number,
    title: doc.title,
    category: doc.category,
    authority: doc.authority,
    authorityLevel: doc.authorityLevel,
    tags: doc.tags || [],
    fieldLengths
  });

  // Index each field
  const fieldsToIndex = {
    title: doc.title || '',
    description: doc.description || '',
    content: doc.content || '',
    tags: (doc.tags || []).join(' '),
    keyProvisions: (doc.keyProvisions || []).join(' '),
    definitions: extractDefinitionTerms(doc.content || '')
  };

  for (const [field, text] of Object.entries(fieldsToIndex)) {
    const terms = tokenize(text);
    fieldLengths[field] = terms.length;

    const termPositions = new Map();
    for (let i = 0; i < terms.length; i++) {
      const term = terms[i];
      if (!termPositions.has(term)) {
        termPositions.set(term, []);
      }
      termPositions.get(term).push(i);
    }

    for (const [term, positions] of termPositions) {
      if (!index.terms.has(term)) {
        index.terms.set(term, []);
      }

      const tf = positions.length / terms.length; // Term frequency
      const weight = index.fieldWeights[field] || 1;

      index.terms.get(term).push({
        docId: doc.id,
        field,
        positions,
        tf,
        weight,
        score: tf * weight
      });
    }
  }
}

/**
 * Extract definition terms from content
 */
function extractDefinitionTerms(content) {
  const terms = [];
  const patterns = [
    /['"]([^'"]+)['"]\s*(?:means|refers to|is defined as)/gi,
    /\*\*([^*]+)\*\*\s*[:—]/g
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      terms.push(match[1]);
    }
  }

  return terms.join(' ');
}

/**
 * Tokenize text into searchable terms
 */
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(term => term.length > 2 && !STOP_WORDS.has(term));
}

/**
 * Search the index
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Array} Search results
 */
export function search(query, options = {}) {
  if (!searchIndex) {
    throw new Error('Search index not built. Call buildIndex() first.');
  }

  const {
    limit = 10,
    offset = 0,
    category = null,
    authority = null,
    minAuthorityLevel = 0,
    fields = null
  } = options;

  const queryTerms = tokenize(query);
  if (queryTerms.length === 0) return [];

  // Score each document
  const docScores = new Map();

  for (const term of queryTerms) {
    const postings = searchIndex.terms.get(term);
    if (!postings) continue;

    for (const posting of postings) {
      // Apply filters
      if (category && posting.docId) {
        const docMeta = searchIndex.documents.get(posting.docId);
        if (docMeta && docMeta.category !== category) continue;
      }
      if (authority && posting.docId) {
        const docMeta = searchIndex.documents.get(posting.docId);
        if (docMeta && docMeta.authority !== authority) continue;
      }
      if (posting.docId) {
        const docMeta = searchIndex.documents.get(posting.docId);
        if (docMeta && docMeta.authorityLevel < minAuthorityLevel) continue;
      }
      if (fields && !fields.includes(posting.field)) continue;

      const currentScore = docScores.get(posting.docId) || 0;
      docScores.set(posting.docId, currentScore + posting.score);
    }
  }

  // Sort by score and apply pagination
  const results = Array.from(docScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(offset, offset + limit)
    .map(([docId, score]) => {
      const meta = searchIndex.documents.get(docId);
      return {
        docId,
        score,
        ...meta
      };
    });

  return results;
}

/**
 * Get index statistics
 */
export function getIndexStats() {
  if (!searchIndex) return null;

  return {
    totalDocuments: searchIndex.totalDocuments,
    totalTerms: searchIndex.terms.size,
    builtAt: searchIndex.builtAt,
    fieldWeights: searchIndex.fieldWeights,
    sampleTerms: Array.from(searchIndex.terms.keys()).slice(0, 20)
  };
}

/**
 * Clear the search index
 */
export function clearIndex() {
  searchIndex = null;
  documentStore.clear();
}

export default {
  buildIndex,
  search,
  getIndexStats,
  clearIndex
};
