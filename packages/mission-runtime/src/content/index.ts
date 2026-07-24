export interface ContentEntry<T = unknown> {
  id: string;
  type: string;
  slug: string;
  title: string;
  body: string;
  metadata: T;
  publishedAt: string;
  updatedAt: string;
  locale: string;
}

export interface ContentQuery {
  type?: string;
  locale?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface ContentProvider {
  get(id: string): Promise<ContentEntry | null>;
  query(query: ContentQuery): Promise<ContentEntry[]>;
  getBySlug(type: string, slug: string): Promise<ContentEntry | null>;
}

export class ContentService implements ContentProvider {
  private store: Map<string, ContentEntry> = new Map();

  register(entry: ContentEntry): void {
    this.store.set(entry.id, entry);
  }

  async get(id: string): Promise<ContentEntry | null> {
    return this.store.get(id) ?? null;
  }

  async query(query: ContentQuery): Promise<ContentEntry[]> {
    let results = [...this.store.values()];
    if (query.type) results = results.filter(e => e.type === query.type);
    if (query.locale) results = results.filter(e => e.locale === query.locale);
    if (query.tags) {
      results = results.filter(e => {
        const meta = e.metadata as Record<string, unknown>;
        const tags = meta?.tags;
        return Array.isArray(tags) && tags.some(t => query.tags!.includes(String(t)));
      });
    }
    const limit = query.limit ?? results.length;
    const offset = query.offset ?? 0;
    return results.slice(offset, offset + limit);
  }

  async getBySlug(type: string, slug: string): Promise<ContentEntry | null> {
    return [...this.store.values()].find(e => e.type === type && e.slug === slug) ?? null;
  }
}
