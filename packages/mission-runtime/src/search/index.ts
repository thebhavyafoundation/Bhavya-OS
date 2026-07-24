export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  type: string;
  score: number;
}

export interface SearchQuery {
  q: string;
  type?: string;
  limit?: number;
  filters?: Record<string, string>;
}

export interface SearchProvider {
  search(query: SearchQuery): Promise<SearchResult[]>;
  index(items: SearchResult[]): Promise<void>;
  clear(): Promise<void>;
}

export class SearchService implements SearchProvider {
  private entries: SearchResult[] = [];

  async search(query: SearchQuery): Promise<SearchResult[]> {
    const q = query.q.toLowerCase();
    const limit = query.limit ?? 10;
    let results = this.entries.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.excerpt.toLowerCase().includes(q)
    );
    if (query.type) results = results.filter(r => r.type === query.type);
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  }

  async index(items: SearchResult[]): Promise<void> {
    this.entries.push(...items);
  }

  async clear(): Promise<void> {
    this.entries = [];
  }
}
