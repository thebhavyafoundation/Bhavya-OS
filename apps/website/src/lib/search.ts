// Search Page
// Unified search across all content types.

export interface SearchResult {
  id: string;
  title: string;
  type: 'project' | 'document' | 'report' | 'policy' | 'research' | 'news';
  snippet: string;
  url: string;
  relevance: number;
  metadata: Record<string, unknown>;
}

export interface SearchConfig {
  apiClient: {
    get: (service: string, action: string, params?: Record<string, unknown>) => Promise<unknown>;
  };
}

export class SearchEngine {
  private config: SearchConfig;

  constructor(config: SearchConfig) {
    this.config = config;
  }

  // Search across all content types
  async search(query: string): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    // Search projects
    const projects = await this.config.apiClient.get('projects', 'list') as any[];
    if (projects) {
      for (const project of projects) {
        if (this.matchesQuery(project, query)) {
          results.push({
            id: project.id,
            title: project.name,
            type: 'project',
            snippet: project.description,
            url: `/projects/${project.id}`,
            relevance: this.calculateRelevance(project, query),
            metadata: { vertical: project.vertical, status: project.status },
          });
        }
      }
    }

    // Search governance documents
    const governance = await this.config.apiClient.get('governance', 'list') as any[];
    if (governance) {
      for (const doc of governance) {
        if (this.matchesQuery(doc, query)) {
          results.push({
            id: doc.id,
            title: doc.title,
            type: doc.type === 'policy' ? 'policy' : 'document',
            snippet: doc.content.slice(0, 200),
            url: `/governance/${doc.id}`,
            relevance: this.calculateRelevance(doc, query),
            metadata: { status: doc.status },
          });
        }
      }
    }

    // Search knowledge/research
    const research = await this.config.apiClient.get('knowledge', 'search', { query }) as any[];
    if (research) {
      for (const doc of research) {
        results.push({
          id: doc.id,
          title: doc.title,
          type: 'research',
          snippet: doc.summary,
          url: `/research/${doc.id}`,
          relevance: this.calculateRelevance(doc, query),
          metadata: { topic: doc.topic },
        });
      }
    }

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);

    return results;
  }

  private matchesQuery(item: any, query: string): boolean {
    const lower = query.toLowerCase();
    const searchableText = JSON.stringify(item).toLowerCase();
    return searchableText.includes(lower);
  }

  private calculateRelevance(item: any, query: string): number {
    const lower = query.toLowerCase();
    let score = 0;

    if (item.title?.toLowerCase().includes(lower)) score += 10;
    if (item.description?.toLowerCase().includes(lower)) score += 5;
    if (item.content?.toLowerCase().includes(lower)) score += 3;

    return score;
  }
}
