// Cache Layer
// Improves performance by caching API responses.

export interface CacheEntry<T = unknown> {
  key: string;
  value: T;
  expiresAt: Date;
}

export class Cache {
  private store = new Map<string, CacheEntry>();
  private defaultTTL: number;

  constructor(defaultTTL = 300) {
    this.defaultTTL = defaultTTL;
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt < new Date()) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  async set<T = unknown>(key: string, value: T, ttl?: number): Promise<void> {
    const expiresAt = new Date(Date.now() + (ttl ?? this.defaultTTL) * 1000);
    this.store.set(key, { key, value, expiresAt });
  }

  async invalidate(key: string): Promise<void> {
    this.store.delete(key);
  }

  async invalidateAll(): Promise<void> {
    this.store.clear();
  }

  getStats(): { size: number; keys: string[] } {
    return { size: this.store.size, keys: Array.from(this.store.keys()) };
  }
}
