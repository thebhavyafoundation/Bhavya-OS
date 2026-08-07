import { KnowledgePackage } from "./types.js";

export interface ContentCatalogItem {
  packageId: string;
  title: string;
  school: string;
  course: string;
  module: string;
  lesson: string;
  difficulty: string;
  tags: string[];
  learningOutcomes: string[];
  estimatedDuration: string;
  prerequisites: string[];
  qualityScore: number;
  popularityScore: number;
  lastUpdated: Date;
}

export interface SearchResult {
  item: ContentCatalogItem;
  score: number;
  matchType: "title" | "tag" | "outcome" | "content" | "prerequisite";
  highlights: string[];
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  school: string;
  packages: string[];
  totalDuration: string;
  difficulty: string;
  learningOutcomes: string[];
  prerequisites: string[];
  careerRelevance: string[];
}

export class ContentCatalog {
  private catalog: Map<string, ContentCatalogItem> = new Map();
  private learningPaths: Map<string, LearningPath> = new Map();

  async indexPackage(pkg: KnowledgePackage): Promise<ContentCatalogItem> {
    const item: ContentCatalogItem = {
      packageId: pkg.id,
      title: pkg.metadata.title,
      school: pkg.metadata.school,
      course: pkg.metadata.course,
      module: pkg.metadata.module,
      lesson: pkg.metadata.lesson,
      difficulty: pkg.metadata.difficulty,
      tags: pkg.metadata.tags,
      learningOutcomes: pkg.metadata.learningOutcomes,
      estimatedDuration: pkg.metadata.duration,
      prerequisites: pkg.metadata.prerequisites,
      qualityScore: pkg.quality.overallScore,
      popularityScore: 0,
      lastUpdated: pkg.metadata.updatedAt,
    };

    this.catalog.set(pkg.id, item);
    return item;
  }

  async search(
    query: string,
    options?: {
      school?: string;
      course?: string;
      difficulty?: string;
      tags?: string[];
      minQuality?: number;
      limit?: number;
    },
  ): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    for (const item of this.catalog.values()) {
      let score = 0;
      let matchType: SearchResult["matchType"] = "content";
      const highlights: string[] = [];

      if (item.title.toLowerCase().includes(lowerQuery)) {
        score += 100;
        matchType = "title";
        highlights.push(item.title);
      }

      if (item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))) {
        score += 80;
        matchType = "tag";
        highlights.push(
          ...item.tags.filter((tag) => tag.toLowerCase().includes(lowerQuery)),
        );
      }

      if (
        item.learningOutcomes.some((outcome) =>
          outcome.toLowerCase().includes(lowerQuery),
        )
      ) {
        score += 60;
        matchType = "outcome";
        highlights.push(
          ...item.learningOutcomes.filter((outcome) =>
            outcome.toLowerCase().includes(lowerQuery),
          ),
        );
      }

      if (score > 0) {
        if (options?.school && item.school !== options.school) continue;
        if (options?.course && item.course !== options.course) continue;
        if (options?.difficulty && item.difficulty !== options.difficulty)
          continue;
        if (
          options?.tags &&
          !options.tags.some((tag) => item.tags.includes(tag))
        )
          continue;
        if (options?.minQuality && item.qualityScore < options.minQuality)
          continue;

        results.push({
          item,
          score,
          matchType,
          highlights,
        });
      }
    }

    results.sort((a, b) => b.score - a.score);

    if (options?.limit) {
      return results.slice(0, options.limit);
    }

    return results;
  }

  async getRecommendations(
    packageId: string,
    limit: number = 5,
  ): Promise<ContentCatalogItem[]> {
    const pkg = this.catalog.get(packageId);
    if (!pkg) return [];

    const recommendations: ContentCatalogItem[] = [];

    for (const item of this.catalog.values()) {
      if (item.packageId === packageId) continue;

      let score = 0;

      if (item.school === pkg.school) score += 30;
      if (item.course === pkg.course) score += 20;
      if (item.difficulty === pkg.difficulty) score += 10;

      const commonTags = item.tags.filter((tag) => pkg.tags.includes(tag));
      score += commonTags.length * 15;

      const commonOutcomes = item.learningOutcomes.filter((outcome) =>
        pkg.learningOutcomes.includes(outcome),
      );
      score += commonOutcomes.length * 10;

      if (score > 0) {
        recommendations.push({ ...item, popularityScore: score });
      }
    }

    recommendations.sort((a, b) => b.popularityScore - a.popularityScore);
    return recommendations.slice(0, limit);
  }

  async getPrerequisiteChain(packageId: string): Promise<ContentCatalogItem[]> {
    const chain: ContentCatalogItem[] = [];
    const visited = new Set<string>();

    const traverse = async (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);

      const item = this.catalog.get(id);
      if (!item) return;

      for (const prereqId of item.prerequisites) {
        await traverse(prereqId);
      }

      chain.push(item);
    };

    await traverse(packageId);
    return chain;
  }

  async getLearningPath(
    school: string,
    difficulty: string,
  ): Promise<ContentCatalogItem[]> {
    return Array.from(this.catalog.values())
      .filter(
        (item) => item.school === school && item.difficulty === difficulty,
      )
      .sort((a, b) => a.title.localeCompare(b.title));
  }

  async createLearningPath(
    id: string,
    name: string,
    description: string,
    school: string,
    packageIds: string[],
  ): Promise<LearningPath> {
    const packages = packageIds
      .map((id) => this.catalog.get(id))
      .filter((item): item is ContentCatalogItem => item !== undefined);

    const totalDuration = this.calculateTotalDuration(packages);
    const learningOutcomes = this.collectLearningOutcomes(packages);
    const prerequisites = this.collectPrerequisites(packages);
    const careerRelevance = this.collectCareerRelevance(packages);

    const path: LearningPath = {
      id,
      name,
      description,
      school,
      packages: packageIds,
      totalDuration,
      difficulty: packages[0]?.difficulty || "beginner",
      learningOutcomes,
      prerequisites,
      careerRelevance,
    };

    this.learningPaths.set(id, path);
    return path;
  }

  async getLearningPathById(id: string): Promise<LearningPath | undefined> {
    return this.learningPaths.get(id);
  }

  async listLearningPaths(school?: string): Promise<LearningPath[]> {
    let paths = Array.from(this.learningPaths.values());
    if (school) {
      paths = paths.filter((p) => p.school === school);
    }
    return paths;
  }

  async getCatalogStats(): Promise<{
    totalPackages: number;
    bySchool: Record<string, number>;
    byDifficulty: Record<string, number>;
    averageQuality: number;
  }> {
    const items = Array.from(this.catalog.values());

    const bySchool: Record<string, number> = {};
    const byDifficulty: Record<string, number> = {};
    let totalQuality = 0;

    for (const item of items) {
      bySchool[item.school] = (bySchool[item.school] || 0) + 1;
      byDifficulty[item.difficulty] = (byDifficulty[item.difficulty] || 0) + 1;
      totalQuality += item.qualityScore;
    }

    return {
      totalPackages: items.length,
      bySchool,
      byDifficulty,
      averageQuality:
        items.length > 0 ? Math.round(totalQuality / items.length) : 0,
    };
  }

  private calculateTotalDuration(packages: ContentCatalogItem[]): string {
    let totalMinutes = 0;

    for (const pkg of packages) {
      const duration = pkg.estimatedDuration;
      if (duration.includes("hour")) {
        const hours = parseInt(duration.match(/\d+/)?.[0] || "0");
        totalMinutes += hours * 60;
      } else if (duration.includes("minute")) {
        const minutes = parseInt(duration.match(/\d+/)?.[0] || "0");
        totalMinutes += minutes;
      }
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  private collectLearningOutcomes(packages: ContentCatalogItem[]): string[] {
    const outcomes = new Set<string>();
    for (const pkg of packages) {
      for (const outcome of pkg.learningOutcomes) {
        outcomes.add(outcome);
      }
    }
    return Array.from(outcomes);
  }

  private collectPrerequisites(packages: ContentCatalogItem[]): string[] {
    const prereqs = new Set<string>();
    for (const pkg of packages) {
      for (const prereq of pkg.prerequisites) {
        prereqs.add(prereq);
      }
    }
    return Array.from(prereqs);
  }

  private collectCareerRelevance(packages: ContentCatalogItem[]): string[] {
    const relevance = new Set<string>();
    for (const pkg of packages) {
      for (const tag of pkg.tags) {
        if (
          tag.includes("career") ||
          tag.includes("industry") ||
          tag.includes("job")
        ) {
          relevance.add(tag);
        }
      }
    }
    return Array.from(relevance);
  }
}

export const contentCatalog = new ContentCatalog();
