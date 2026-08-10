// UI Research — Internal module of GitHub Intelligence Lab
// Promotes to packages/ui-research when Website OS consumes it.

export type UIPattern =
  | "navigation"
  | "layout"
  | "animation"
  | "typography"
  | "spacing"
  | "accessibility"
  | "command_palette"
  | "keyboard_shortcuts"
  | "empty_state"
  | "loading_state"
  | "error_handling"
  | "form"
  | "modal"
  | "sidebar"
  | "dashboard"
  | "data_table"
  | "search";

export type UISource =
  | "awwwards"
  | "mobbin"
  | "godly"
  | "landing_love"
  | "github"
  | "dribbble"
  | "vercel_showcase";

export interface UIRepository {
  name: string;
  url: string;
  description: string;
  stars: number;
  language: string;
  tags: string[];
  screenshots: string[];
  patterns: UIPattern[];
  designSystem: DesignSystemAnalysis | null;
  accessibility: AccessibilityAnalysis | null;
  performance: number;
  codeQuality: number;
  bhavyaScore: number;
  lastAnalyzed: string;
}

export interface DesignSystemAnalysis {
  hasDesignTokens: boolean;
  colorSystem: "primitive" | "semantic" | "component";
  typographyScale: string[];
  spacingScale: string[];
  componentCount: number;
  darkMode: boolean;
  responsive: boolean;
  rtlSupport: boolean;
}

export interface AccessibilityAnalysis {
  wcagLevel: "A" | "AA" | "AAA" | "unknown";
  keyboardNavigation: boolean;
  screenReaderSupport: boolean;
  colorContrast: boolean;
  focusManagement: boolean;
  ariaLabels: boolean;
  score: number;
}

export interface UIKnowledgePackage {
  id: string;
  repository: string;
  patterns: UIPattern[];
  extractableIdeas: string[];
  reusableComponents: string[];
  designPrinciples: string[];
  implementationNotes: string;
  bhavyaScore: number;
  extractedAt: string;
}

export class UIResearcher {
  private repos = new Map<string, UIRepository>();

  add(repo: UIRepository): void {
    this.repos.set(repo.name, repo);
  }
  get(name: string): UIRepository | undefined {
    return this.repos.get(name);
  }
  list(filter?: { pattern?: UIPattern; minScore?: number }): UIRepository[] {
    let results = Array.from(this.repos.values());
    if (filter?.pattern)
      results = results.filter((r) => r.patterns.includes(filter.pattern!));
    if (filter?.minScore !== undefined)
      results = results.filter((r) => r.bhavyaScore >= filter.minScore!);
    return results.sort((a, b) => b.bhavyaScore - a.bhavyaScore);
  }

  async discover(): Promise<UIRepository[]> {
    try {
      const url =
        "https://api.github.com/search/repositories?q=ui+design+system+stars:>500&sort=stars&order=desc&per_page=20";
      const res = await fetch(url, {
        headers: {
          "User-Agent": "BhavyaOS-GIL/1.0",
          Accept: "application/vnd.github+json",
        },
      });
      if (!res.ok) return [];
      const data = (await res.json()) as {
        items: Array<{
          full_name: string;
          description: string;
          html_url: string;
          stargazers_count: number;
          language: string;
          topics: string[];
        }>;
      };
      return data.items.map((r) => ({
        name: r.full_name,
        url: r.html_url,
        description: r.description || "",
        stars: r.stargazers_count,
        language: r.language || "",
        tags: r.topics || [],
        screenshots: [],
        patterns: [],
        designSystem: null,
        accessibility: null,
        performance: 5,
        codeQuality: 5,
        bhavyaScore: Math.min(100, Math.floor(r.stargazers_count / 100)),
        lastAnalyzed: new Date().toISOString(),
      }));
    } catch {
      return [];
    }
  }

  extractKP(repo: UIRepository): UIKnowledgePackage {
    return {
      id: `ui-kp-${Date.now()}`,
      repository: repo.name,
      patterns: repo.patterns,
      extractableIdeas: [],
      reusableComponents: [],
      designPrinciples: [],
      implementationNotes: `Analyze ${repo.name} for UI patterns`,
      bhavyaScore: repo.bhavyaScore,
      extractedAt: new Date().toISOString(),
    };
  }
}
