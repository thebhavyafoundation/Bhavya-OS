/**
 * @bhavya/providers — Search Provider Interface
 *
 * Abstract interface for search engines (Algolia, Meilisearch, Elasticsearch, in-memory).
 */

export interface SearchProvider {
  id: string;
  name: string;
  type: "algolia" | "meilisearch" | "elasticsearch" | "memory" | "typesense";

  index(collection: string, document: SearchDocument): Promise<void>;
  indexBatch(collection: string, documents: SearchDocument[]): Promise<void>;
  search(
    collection: string,
    query: string,
    options?: SearchOptions,
  ): Promise<SearchResults>;
  delete(collection: string, id: string): Promise<void>;
  deleteCollection(collection: string): Promise<void>;
  health(): Promise<{ status: string; latencyMs: number }>;
}

export interface SearchDocument {
  id: string;
  [key: string]: unknown;
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
  filter?: Record<string, unknown>;
  highlightFields?: string[];
}

export interface SearchResults {
  hits: SearchResultHit[];
  total: number;
  took: number;
}

export interface SearchResultHit {
  id: string;
  score: number;
  highlights: Record<string, string>;
  data: Record<string, unknown>;
}
