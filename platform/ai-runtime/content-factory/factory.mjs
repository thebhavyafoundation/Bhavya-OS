/**
 * Content Factory
 * Bhavya OS v6.0 — Autonomous Product Studio
 * 
 * Manages:
 * - Articles
 * - Documentation
 * - Blog posts
 * - Tutorials
 * - Social media content
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'content-factory', 'data');

interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'documentation' | 'blog' | 'tutorial' | 'social';
  format: 'markdown' | 'html' | 'mdx';
  content: string;
  appId: string;
  author: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  tags: string[];
  metadata: {
    description: string;
    keywords: string[];
    publishedAt?: string;
    updatedAt: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  social?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
}

export class ContentFactory {
  private content: ContentItem[] = [];
  private dataDir: string;

  constructor() {
    this.dataDir = DATA_DIR;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadContent();
  }

  private loadContent(): void {
    const contentFile = join(this.dataDir, 'content.json');
    if (existsSync(contentFile)) {
      this.content = JSON.parse(readFileSync(contentFile, 'utf-8'));
    }
  }

  private saveContent(): void {
    writeFileSync(
      join(this.dataDir, 'content.json'),
      JSON.stringify(this.content, null, 2)
    );
  }

  /**
   * Create new content item
   */
  createContent(item: Omit<ContentItem, 'id' | 'metadata'>): ContentItem {
    const newItem: ContentItem = {
      id: `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...item,
      metadata: {
        description: item.seo.description,
        keywords: item.seo.keywords,
        updatedAt: new Date().toISOString()
      }
    };

    this.content.push(newItem);
    this.saveContent();
    return newItem;
  }

  /**
   * Update content
   */
  updateContent(id: string, updates: Partial<ContentItem>): void {
    const item = this.content.find(c => c.id === id);
    if (item) {
      Object.assign(item, updates);
      item.metadata.updatedAt = new Date().toISOString();
      this.saveContent();
    }
  }

  /**
   * Publish content
   */
  publishContent(id: string): void {
    const item = this.content.find(c => c.id === id);
    if (item) {
      item.status = 'published';
      item.metadata.publishedAt = new Date().toISOString();
      this.saveContent();
    }
  }

  /**
   * Get all content
   */
  getAllContent(): ContentItem[] {
    return this.content;
  }

  /**
   * Get content by type
   */
  getContentByType(type: ContentItem['type']): ContentItem[] {
    return this.content.filter(c => c.type === type);
  }

  /**
   * Get content by status
   */
  getContentByStatus(status: ContentItem['status']): ContentItem[] {
    return this.content.filter(c => c.status === status);
  }

  /**
   * Get content by app
   */
  getAppContent(appId: string): ContentItem[] {
    return this.content.filter(c => c.appId === appId);
  }

  /**
   * Generate blog post from article
   */
  generateBlogPost(article: ContentItem): ContentItem {
    return this.createContent({
      title: article.title,
      type: 'blog',
      format: 'markdown',
      content: article.content,
      appId: article.appId,
      author: article.author,
      status: 'draft',
      tags: [...article.tags, 'blog'],
      seo: {
        title: article.seo.title,
        description: article.seo.description,
        keywords: [...article.seo.keywords, 'blog']
      }
    });
  }

  /**
   * Generate social content from article
   */
  generateSocialContent(article: ContentItem): { twitter: string; linkedin: string } {
    const description = article.seo.description;
    const keywords = article.seo.keywords.slice(0, 3).map(k => `#${k}`).join(' ');

    return {
      twitter: `${article.title}\n\n${description}\n\n${keywords}`,
      linkedin: `${article.title}\n\n${description}\n\n#BhavyaFoundation #SocialImpact ${keywords}`
    };
  }

  /**
   * Get content summary
   */
  getSummary(): {
    total: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    byApp: Record<string, number>;
  } {
    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    const byApp: Record<string, number> = {};

    for (const item of this.content) {
      byType[item.type] = (byType[item.type] || 0) + 1;
      byStatus[item.status] = (byStatus[item.status] || 0) + 1;
      byApp[item.appId] = (byApp[item.appId] || 0) + 1;
    }

    return {
      total: this.content.length,
      byType,
      byStatus,
      byApp
    };
  }
}

// Singleton instance
let instance: ContentFactory | null = null;

export function getContentFactory(): ContentFactory {
  if (!instance) {
    instance = new ContentFactory();
  }
  return instance;
}
