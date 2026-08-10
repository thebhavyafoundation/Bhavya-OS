// Architecture Research — Internal module of GitHub Intelligence Lab
// Promotes to packages/architecture-research when GitHub OS consumes it.

export type RepoStructure =
  "monorepo" | "single-package" | "multi-package" | "workspace";

export interface RepositoryAnalysis {
  name: string;
  url: string;
  structure: RepoStructure;
  folderLayout: string[];
  namingConvention: "kebab" | "camel" | "snake" | "pascal" | "mixed";
  documentationLayout: string[];
  testingStructure: string[];
  ciLayout: string[];
  releaseStrategy: "semantic" | "manual" | "continuous" | "calver";
  hasADR: boolean;
  hasRFC: boolean;
  hasContributing: boolean;
  hasChangelog: boolean;
  hasCodeOfConduct: boolean;
  monorepoTool: "turborepo" | "nx" | "lerna" | "pnpm" | "rush" | null;
  packageManager: "pnpm" | "npm" | "yarn" | "bun" | "cargo" | "go" | null;
  qualityScore: number;
  bhavyaScore: number;
}

export interface FolderTemplate {
  id: string;
  name: string;
  description: string;
  structure: string[];
  conventions: Record<string, string>;
  useCase: string;
  sourceRepo: string;
}

export interface DocumentationStandard {
  id: string;
  pattern: string;
  description: string;
  example: string;
  sourceRepos: string[];
  recommended: boolean;
}

export class ArchitectureResearcher {
  private analyses = new Map<string, RepositoryAnalysis>();
  private templates: FolderTemplate[] = [];
  private standards: DocumentationStandard[] = [];

  addAnalysis(analysis: RepositoryAnalysis): void {
    this.analyses.set(analysis.name, analysis);
  }
  getAnalysis(name: string): RepositoryAnalysis | undefined {
    return this.analyses.get(name);
  }
  listAnalyses(filter?: {
    structure?: RepoStructure;
    minScore?: number;
  }): RepositoryAnalysis[] {
    let results = Array.from(this.analyses.values());
    if (filter?.structure)
      results = results.filter((a) => a.structure === filter.structure);
    if (filter?.minScore !== undefined)
      results = results.filter((a) => a.bhavyaScore >= filter.minScore!);
    return results.sort((a, b) => b.bhavyaScore - a.bhavyaScore);
  }

  addTemplate(template: FolderTemplate): void {
    this.templates.push(template);
  }
  listTemplates(): FolderTemplate[] {
    return [...this.templates];
  }

  addStandard(standard: DocumentationStandard): void {
    this.standards.push(standard);
  }
  listStandards(): DocumentationStandard[] {
    return [...this.standards];
  }

  async discover(): Promise<RepositoryAnalysis[]> {
    try {
      const url =
        "https://api.github.com/search/repositories?q=monorepo+turborepo+stars:>1000&sort=stars&order=desc&per_page=15";
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
        }>;
      };
      return data.items.map((r) => ({
        name: r.full_name,
        url: r.html_url,
        structure: "monorepo" as const,
        folderLayout: [],
        namingConvention: "kebab" as const,
        documentationLayout: [],
        testingStructure: [],
        ciLayout: [],
        releaseStrategy: "semantic" as const,
        hasADR: false,
        hasRFC: false,
        hasContributing: true,
        hasChangelog: true,
        hasCodeOfConduct: false,
        monorepoTool: "turborepo",
        packageManager: "pnpm",
        qualityScore: 5,
        bhavyaScore: Math.min(100, Math.floor(r.stargazers_count / 100)),
      }));
    } catch {
      return [];
    }
  }

  extractTemplate(analysis: RepositoryAnalysis): FolderTemplate {
    return {
      id: `tpl-${Date.now()}`,
      name: `${analysis.name} template`,
      description: `Folder structure based on ${analysis.name}`,
      structure: analysis.folderLayout,
      conventions: {
        naming: analysis.namingConvention,
        release: analysis.releaseStrategy,
      },
      useCase: `${analysis.structure} project`,
      sourceRepo: analysis.name,
    };
  }
}
