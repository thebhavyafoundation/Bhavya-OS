// Page Renderer
// Reads the schema and composes the page from components.
// Every page is declarative. The renderer just assembles it.

import type { PageSchema, SectionSchema, DataSource, PageMetadata } from './schemas.js';

export interface RenderedPage {
  id: string;
  title: string;
  sections: RenderedSection[];
  metadata: PageMetadata;
}

export interface RenderedSection {
  type: string;
  title?: string;
  data: unknown;
  config?: Record<string, unknown>;
}

export interface PageRendererConfig {
  apiClient: {
    get: (service: string, action: string, params?: Record<string, unknown>) => Promise<unknown>;
  };
  cache?: {
    get: (key: string) => Promise<unknown | null>;
    set: (key: string, value: unknown, ttl?: number) => Promise<void>;
  };
}

export class PageRenderer {
  private config: PageRendererConfig;

  constructor(config: PageRendererConfig) {
    this.config = config;
  }

  // Render a page from schema
  async render(schema: PageSchema): Promise<RenderedPage> {
    const sections = await Promise.all(
      schema.sections.map((section) => this.renderSection(section)),
    );

    return {
      id: schema.id,
      title: schema.title,
      sections,
      metadata: schema.metadata,
    };
  }

  // Render a single section
  private async renderSection(section: SectionSchema): Promise<RenderedSection> {
    let data: unknown = null;

    if (section.source) {
      data = await this.fetchData(section.source);
    }

    return {
      type: section.type,
      title: section.title,
      data,
      config: section.config,
    };
  }

  // Fetch data from API
  private async fetchData(source: DataSource): Promise<unknown> {
    // Check cache first
    const cacheKey = `${source.service}:${source.action}:${JSON.stringify(source.params)}`;
    if (this.config.cache) {
      const cached = await this.config.cache.get(cacheKey);
      if (cached) return cached;
    }

    // Fetch from API
    const data = await this.config.apiClient.get(source.service, source.action, source.params);

    // Cache result
    if (this.config.cache) {
      await this.config.cache.set(cacheKey, data, 300); // 5 min TTL
    }

    return data;
  }

  // Render all pages
  async renderAll(schemas: PageSchema[]): Promise<RenderedPage[]> {
    return Promise.all(schemas.map((s) => this.render(s)));
  }
}
