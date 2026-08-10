/**
 * Citation Middleware — Ensures all AI responses cite constitutional sources
 * 
 * Wraps AI responses to include constitutional citations when relevant.
 * This is the enforcement layer for the "Every AI action must cite sources" rule.
 */

export class CitationMiddleware {
  #constitutionEngine;

  /**
   * @param {Object} constitutionEngine - ConstitutionEngine instance
   */
  constructor(constitutionEngine) {
    this.#constitutionEngine = constitutionEngine;
  }

  /**
   * Process an AI response and add citations if needed
   * @param {string} response - AI response text
   * @param {Object} context - Response context
   * @returns {Object} Response with citations
   */
  async processResponse(response, context = {}) {
    const { query, action, includeCitations = true } = context;

    if (!includeCitations) {
      return { response, citations: [] };
    }

    const citations = [];
    const searchTerms = this.#extractSearchTerms(response, query, action);

    for (const term of searchTerms.slice(0, 3)) {
      try {
        const results = await this.#constitutionEngine.searchConstitution(term, { limit: 2 });
        for (const result of results) {
          const citation = await this.#constitutionEngine.generateCitation(result.docId, {
            format: 'text'
          });
          if (citation) {
            citations.push({
              text: citation.citation,
              document: result.docId,
              relevance: result.score
            });
          }
        }
      } catch (error) {
        // Continue if citation generation fails
      }
    }

    // Deduplicate citations
    const uniqueCitations = this.#deduplicateCitations(citations);

    return {
      response,
      citations: uniqueCitations,
      citationCount: uniqueCitations.length
    };
  }

  /**
   * Extract search terms from response
   */
  #extractSearchTerms(response, query, action) {
    const terms = [];

    // Add terms from query
    if (query) {
      terms.push(...query.split(/\s+/).filter(t => t.length > 3));
    }

    // Add terms from action
    if (action) {
      terms.push(...action.split(/\s+/).filter(t => t.length > 3));
    }

    // Add key terms from response
    const keyTerms = [
      'constitution', 'policy', 'ethics', 'governance', 'compliance',
      'transparency', 'accountability', 'board', 'trustee', 'founder'
    ];

    const lowerResponse = response.toLowerCase();
    for (const term of keyTerms) {
      if (lowerResponse.includes(term)) {
        terms.push(term);
      }
    }

    return [...new Set(terms)];
  }

  /**
   * Deduplicate citations by document
   */
  #deduplicateCitations(citations) {
    const seen = new Set();
    return citations.filter(citation => {
      const key = citation.document;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Format citations for display
   * @param {Array} citations - Citations to format
   * @param {string} format - Display format
   */
  formatCitations(citations, format = 'list') {
    if (format === 'inline') {
      return citations.map(c => `[${c.document}]`).join(', ');
    }

    if (format === 'footnotes') {
      return citations.map((c, i) => `[${i + 1}] ${c.text}`).join('\n');
    }

    // Default: list format
    return citations.map(c => `- ${c.text}`).join('\n');
  }
}

export default CitationMiddleware;
