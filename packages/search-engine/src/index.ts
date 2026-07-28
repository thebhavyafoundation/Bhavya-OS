// Search Engine
// Full-text search across all content

export interface SearchResult {
  id: string;
  type: string;
  title: string;
  content: string;
  score: number;
  path: string;
}

export interface SearchEngineConfig {
  root: string;
}

export class SearchEngine {
  private config: SearchEngineConfig;
  private index = new Map<string, SearchResult[]>();

  constructor(config: SearchEngineConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Build search index from .memory/, docs/, .agents/, etc.
  }

  async search(query: string, options?: { type?: string; limit?: number }): Promise<SearchResult[]> {
    const lower = query.toLowerCase();
    const results: SearchResult[] = [];

    for (const [type, entries] of this.index) {
      if (options?.type && type !== options.type) continue;
      for (const entry of entries) {
        if (
          entry.title.toLowerCase().includes(lower) ||
          entry.content.toLowerCase().includes(lower)
        ) {
          results.push(entry);
        }
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, options?.limit ?? 10);
  }

  async indexContent(id: string, type: string, title: string, content: string, path: string): Promise<void> {
    const entry: SearchResult = {
      id,
      type,
      title,
      content: content.slice(0, 1000),
      score: 1,
      path,
    };

    const existing = this.index.get(type) ?? [];
    existing.push(entry);
    this.index.set(type, existing);
  }

  async rebuild(): Promise<void> {
    this.index.clear();
    await this.initialize();
  }

  async shutdown(): Promise<void> {
    this.index.clear();
  }
}
