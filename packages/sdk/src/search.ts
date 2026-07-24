import { SearchService, type SearchResult, type SearchQuery } from "@bhavya/mission-runtime";

export class SearchSDK {
  private searchService: SearchService;

  constructor() {
    this.searchService = new SearchService();
  }

  async search(query: string, type?: string, limit = 10): Promise<SearchResult[]> {
    return this.searchService.search({ q: query, type, limit } satisfies SearchQuery);
  }

  async indexResults(results: SearchResult[]): Promise<void> {
    await this.searchService.index(results);
  }

  async clearIndex(): Promise<void> {
    await this.searchService.clear();
  }
}
