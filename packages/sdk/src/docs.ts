import { SearchService, NavigationService, type SearchResult } from "@bhavya/mission-runtime";

export interface DocPage {
  id: string;
  title: string;
  path: string;
  content: string;
  section: string;
}

export class DocsSDK {
  search: SearchService;
  navigation: NavigationService;

  constructor() {
    this.search = new SearchService();
    this.navigation = new NavigationService();
  }

  async findDocs(query: string): Promise<SearchResult[]> {
    return this.search.search({ q: query, type: "doc", limit: 20 });
  }

  getSections(): { id: string; label: string }[] {
    const nav = this.navigation.get("public");
    return (nav?.items || []).map(i => ({ id: i.id, label: i.label }));
  }
}
