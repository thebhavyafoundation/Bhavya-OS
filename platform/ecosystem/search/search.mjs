/**
 * Search Platform
 * Bhavya Ecosystem v1.0
 * 
 * Unified search index across:
 * - Knowledge
 * - Documentation
 * - Projects
 * - Policies
 * - Research
 * - Media
 * - Applications
 * - Engineering Docs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'ecosystem', 'search', 'data');

interface SearchIndex {
  id: string;
  collection: string;
  title: string;
  content: string;
  tags: string[];
  metadata: Record<string, any>;
  timestamp: string;
}

interface SearchResult {
  id: string;
  collection: string;
  title: string;
  excerpt: string;
  score: number;
  url?: string;
}

export class SearchPlatform {
  private index: SearchIndex[] = [];
  private dataDir: string;

  constructor() {
    this.dataDir = DATA_DIR;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadIndex();
  }

  private loadIndex(): void {
    const indexFile = join(this.dataDir, 'index.json');
    if (existsSync(indexFile)) {
      this.index = JSON.parse(readFileSync(indexFile, 'utf-8'));
    }
  }

  private saveIndex(): void {
    writeFileSync(
      join(this.dataDir, 'index.json'),
      JSON.stringify(this.index, null, 2)
    );
  }

  /**
   * Add item to search index
   */
  addToIndex(item: Omit<SearchIndex, 'id' | 'timestamp'>): SearchIndex {
    const newItem: SearchIndex = {
      id: `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...item,
      timestamp: new Date().toISOString()
    };

    this.index.push(newItem);
    this.saveIndex();
    return newItem;
  }

  /**
   * Remove item from search index
   */
  removeFromIndex(id: string): void {
    this.index = this.index.filter(item => item.id !== id);
    this.saveIndex();
  }

  /**
   * Search across all indexed content
   */
  search(query: string, options: {
    collection?: string;
    limit?: number;
    offset?: number;
  } = {}): SearchResult[] {
    const lowerQuery = query.toLowerCase();
    const limit = options.limit || 10;
    const offset = options.offset || 0;

    let results = this.index
      .filter(item => {
        if (options.collection && item.collection !== options.collection) {
          return false;
        }

        const titleMatch = item.title.toLowerCase().includes(lowerQuery);
        const contentMatch = item.content.toLowerCase().includes(lowerQuery);
        const tagMatch = item.tags.some(tag => tag.toLowerCase().includes(lowerQuery));

        return titleMatch || contentMatch || tagMatch;
      })
      .map(item => {
        const titleMatch = item.title.toLowerCase().includes(lowerQuery);
        const contentMatch = item.content.toLowerCase().includes(lowerQuery);
        const tagMatch = item.tags.some(tag => tag.toLowerCase().includes(lowerQuery));

        let score = 0;
        if (titleMatch) score += 10;
        if (contentMatch) score += 5;
        if (tagMatch) score += 3;

        const excerpt = this.generateExcerpt(item.content, lowerQuery);

        return {
          id: item.id,
          collection: item.collection,
          title: item.title,
          excerpt,
          score,
          url: item.metadata?.url
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(offset, offset + limit);

    return results;
  }

  /**
   * Generate excerpt around match
   */
  private generateExcerpt(content: string, query: string): string {
    const lowerContent = content.toLowerCase();
    const index = lowerContent.indexOf(query);

    if (index === -1) {
      return content.substring(0, 200) + (content.length > 200 ? '...' : '');
    }

    const start = Math.max(0, index - 100);
    const end = Math.min(content.length, index + query.length + 100);
    const excerpt = content.substring(start, end);

    return (start > 0 ? '...' : '') + excerpt + (end < content.length ? '...' : '');
  }

  /**
   * Get search suggestions
   */
  getSuggestions(query: string, limit: number = 5): string[] {
    const lowerQuery = query.toLowerCase();
    const suggestions = new Set<string>();

    for (const item of this.index) {
      const words = item.title.split(/\s+/);
      for (const word of words) {
        if (word.toLowerCase().startsWith(lowerQuery)) {
          suggestions.add(word);
        }
      }
    }

    return Array.from(suggestions).slice(0, limit);
  }

  /**
   * Get index statistics
   */
  getStats(): {
    totalItems: number;
    byCollection: Record<string, number>;
    lastUpdated: string | null;
  } {
    const byCollection: Record<string, number> = {};
    for (const item of this.index) {
      byCollection[item.collection] = (byCollection[item.collection] || 0) + 1;
    }

    const lastUpdated = this.index.length > 0
      ? this.index.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0].timestamp
      : null;

    return {
      totalItems: this.index.length,
      byCollection,
      lastUpdated
    };
  }

  /**
   * Clear index
   */
  clearIndex(): void {
    this.index = [];
    this.saveIndex();
  }
}

// Singleton instance
let instance: SearchPlatform | null = null;

export function getSearchPlatform(): SearchPlatform {
  if (!instance) {
    instance = new SearchPlatform();
  }
  return instance;
}
