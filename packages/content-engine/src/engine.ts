import { createHash } from "crypto";
import {
  KnowledgePackage,
  PackageMetadata,
  PackageContent,
  PackageAssessment,
  PackageResources,
  QualityMetrics,
  VersionHistory,
} from "./types.js";

export class ContentEngine {
  private packages: Map<string, KnowledgePackage> = new Map();
  private versions: Map<string, VersionHistory[]> = new Map();

  async createPackage(
    metadata: PackageMetadata,
    content: PackageContent,
    assessment: PackageAssessment,
    resources: PackageResources,
  ): Promise<KnowledgePackage> {
    const id = this.generateId();
    const version = "1.0.0";
    const contentHash = this.hashContent(content);

    const pkg: KnowledgePackage = {
      id,
      version,
      status: "draft",
      metadata: {
        ...metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
        contentHash,
      },
      content,
      assessment,
      resources,
      quality: this.calculateQuality(content, assessment),
      history: [
        {
          version,
          date: new Date(),
          author: metadata.authors[0],
          changes: ["Initial creation"],
          contentHash,
        },
      ],
    };

    this.packages.set(id, pkg);
    this.versions.set(id, pkg.history);

    return pkg;
  }

  async updatePackage(
    id: string,
    updates: Partial<KnowledgePackage>,
  ): Promise<KnowledgePackage> {
    const pkg = this.packages.get(id);
    if (!pkg) throw new Error(`Package ${id} not found`);

    const newVersion = this.incrementVersion(pkg.version);
    const contentHash = updates.content
      ? this.hashContent(updates.content)
      : pkg.metadata.contentHash;

    const updatedPkg: KnowledgePackage = {
      ...pkg,
      ...updates,
      version: newVersion,
      metadata: {
        ...pkg.metadata,
        ...updates.metadata,
        updatedAt: new Date(),
        contentHash,
      },
      quality: updates.content
        ? this.calculateQuality(
            updates.content,
            updates.assessment || pkg.assessment,
          )
        : pkg.quality,
      history: [
        ...pkg.history,
        {
          version: newVersion,
          date: new Date(),
          author: updates.metadata?.authors?.[0] || pkg.metadata.authors[0],
          changes: this.detectChanges(pkg, updates),
          contentHash,
        },
      ],
    };

    this.packages.set(id, updatedPkg);
    this.versions.set(id, updatedPkg.history);

    return updatedPkg;
  }

  async getPackage(id: string): Promise<KnowledgePackage | undefined> {
    return this.packages.get(id);
  }

  async listPackages(filters?: {
    school?: string;
    course?: string;
    status?: string;
    difficulty?: string;
  }): Promise<KnowledgePackage[]> {
    let packages = Array.from(this.packages.values());

    if (filters) {
      if (filters.school) {
        packages = packages.filter((p) => p.metadata.school === filters.school);
      }
      if (filters.course) {
        packages = packages.filter((p) => p.metadata.course === filters.course);
      }
      if (filters.status) {
        packages = packages.filter((p) => p.status === filters.status);
      }
      if (filters.difficulty) {
        packages = packages.filter(
          (p) => p.metadata.difficulty === filters.difficulty,
        );
      }
    }

    return packages;
  }

  async approvePackage(
    id: string,
    reviewer: string,
  ): Promise<KnowledgePackage> {
    const pkg = this.packages.get(id);
    if (!pkg) throw new Error(`Package ${id} not found`);

    if (pkg.status !== "review") {
      throw new Error(`Package ${id} is not in review status`);
    }

    return this.updatePackage(id, {
      status: "approved",
      metadata: {
        ...pkg.metadata,
        reviewers: [...pkg.metadata.reviewers, reviewer],
      },
    });
  }

  async publishPackage(id: string): Promise<KnowledgePackage> {
    const pkg = this.packages.get(id);
    if (!pkg) throw new Error(`Package ${id} not found`);

    if (pkg.status !== "approved") {
      throw new Error(`Package ${id} is not approved`);
    }

    return this.updatePackage(id, {
      status: "published",
      metadata: {
        ...pkg.metadata,
        publishedAt: new Date(),
      },
    });
  }

  async getVersionHistory(id: string): Promise<VersionHistory[]> {
    return this.versions.get(id) || [];
  }

  async searchPackages(query: string): Promise<KnowledgePackage[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.packages.values()).filter((pkg) => {
      return (
        pkg.metadata.title.toLowerCase().includes(lowerQuery) ||
        pkg.metadata.description.toLowerCase().includes(lowerQuery) ||
        pkg.metadata.tags.some((tag) =>
          tag.toLowerCase().includes(lowerQuery),
        )
      );
    });
  }

  async getPrerequisites(id: string): Promise<KnowledgePackage[]> {
    const pkg = this.packages.get(id);
    if (!pkg) throw new Error(`Package ${id} not found`);

    const prerequisites: KnowledgePackage[] = [];
    for (const prereqId of pkg.metadata.prerequisites) {
      const prereq = this.packages.get(prereqId);
      if (prereq) prerequisites.push(prereq);
    }

    return prerequisites;
  }

  async getDependents(id: string): Promise<KnowledgePackage[]> {
    return Array.from(this.packages.values()).filter((pkg) =>
      pkg.metadata.prerequisites.includes(id),
    );
  }

  private generateId(): string {
    return `kp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private hashContent(content: PackageContent): string {
    const contentString = JSON.stringify(content);
    return createHash("sha256").update(contentString).digest("hex");
  }

  private incrementVersion(version: string): string {
    const parts = version.split(".").map(Number);
    parts[2] += 1;
    if (parts[2] >= 100) {
      parts[2] = 0;
      parts[1] += 1;
    }
    if (parts[1] >= 100) {
      parts[1] = 0;
      parts[0] += 1;
    }
    return parts.join(".");
  }

  private detectChanges(
    oldPkg: KnowledgePackage,
    updates: Partial<KnowledgePackage>,
  ): string[] {
    const changes: string[] = [];

    if (updates.metadata?.title !== oldPkg.metadata.title) {
      changes.push("Title updated");
    }
    if (updates.content) {
      changes.push("Content updated");
    }
    if (updates.assessment) {
      changes.push("Assessment updated");
    }
    if (updates.resources) {
      changes.push("Resources updated");
    }

    return changes.length > 0 ? changes : ["Minor updates"];
  }

  private calculateQuality(
    content: PackageContent,
    assessment: PackageAssessment,
  ): QualityMetrics {
    let contentAccuracy = 80;
    let educationalEffectiveness = 80;
    let technicalCorrectness = 80;
    let accessibility = 80;

    if (content.sections.length > 0) contentAccuracy += 5;
    if (content.visualExplanations.length > 0) educationalEffectiveness += 5;
    if (content.codeExamples.length > 0) technicalCorrectness += 5;
    if (content.glossary.length > 0) accessibility += 5;

    if (assessment.checkpoints.length > 0) educationalEffectiveness += 5;
    if (assessment.quiz.questions.length > 0) contentAccuracy += 5;
    if (assessment.lab) technicalCorrectness += 5;

    const overallScore = Math.round(
      (contentAccuracy +
        educationalEffectiveness +
        technicalCorrectness +
        accessibility) /
        4,
    );

    return {
      contentAccuracy: Math.min(contentAccuracy, 100),
      educationalEffectiveness: Math.min(educationalEffectiveness, 100),
      technicalCorrectness: Math.min(technicalCorrectness, 100),
      accessibility: Math.min(accessibility, 100),
      overallScore: Math.min(overallScore, 100),
    };
  }
}

export const contentEngine = new ContentEngine();
