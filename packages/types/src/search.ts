/**
 * @bhavya/types — Search Types
 *
 * Canonical search result and query types.
 */

/** A search result */
export interface SearchResult {
  id: string;
  type: string;
  title: string;
  content: string;
  excerpt?: string;
  url?: string;
  path?: string;
  score: number;
  highlights?: SearchHighlight[];
  metadata?: Record<string, unknown>;
}

/** A highlight within a search result */
export interface SearchHighlight {
  field: string;
  fragment: string;
}

/** Search query */
export interface SearchQuery {
  q: string;
  type?: string;
  domain?: string;
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/** Search response */
export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  took: number;
}
