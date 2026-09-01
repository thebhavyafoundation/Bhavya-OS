import type {
  KnowledgePackage,
  NormalizedItem,
  KnowledgeCategory,
  GraphNode,
  GraphEdge,
  KnowledgeGraph,
} from "@bhavya/intelligence";
import { generateId } from "@bhavya/platform";

// ─── Knowledge Package Generator ───────────────────────────────────────────
// Converts normalized items into structured Knowledge Packages.

export class KnowledgeExtractor {
  private packages = new Map<string, KnowledgePackage>();

  extract(item: NormalizedItem): KnowledgePackage {
    const id = generateId("kp");
    const category = this.classifyCategory(item);

    const pkg: KnowledgePackage = {
      id,
      sourceId: item.sourceId,
      sourceKind: item.sourceKind,
      externalId: item.externalId,
      category,
      title: item.title,
      description: item.description,
      url: item.url,
      tags: item.tags,
      metadata: item.metadata,
      analysis: null,
      recommendation: null,
      radarClassification: null,
      relatedIds: [],
      dependsOnIds: [],
      usedByIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };

    this.packages.set(id, pkg);
    return pkg;
  }

  extractBatch(items: NormalizedItem[]): KnowledgePackage[] {
    return items.map((item) => this.extract(item));
  }

  get(id: string): KnowledgePackage | undefined {
    return this.packages.get(id);
  }
  list(): KnowledgePackage[] {
    return Array.from(this.packages.values());
  }

  findRelated(pkg: KnowledgePackage): KnowledgePackage[] {
    return Array.from(this.packages.values()).filter(
      (p) =>
        p.id !== pkg.id &&
        (p.tags.some((t: string) => pkg.tags.includes(t)) ||
          p.sourceKind === pkg.sourceKind),
    );
  }

  buildGraph(): KnowledgeGraph {
    const packages = Array.from(this.packages.values());
    const nodes: GraphNode[] = packages.map((p) => ({
      id: p.id,
      type: p.category,
      label: p.title,
      metadata: p.metadata,
    }));

    const edges: GraphEdge[] = [];
    for (const pkg of packages) {
      for (const relId of pkg.relatedIds) {
        if (this.packages.has(relId)) {
          edges.push({
            source: pkg.id,
            target: relId,
            relationship: "related_to",
            weight: 1,
          });
        }
      }
      for (const depId of pkg.dependsOnIds) {
        if (this.packages.has(depId)) {
          edges.push({
            source: pkg.id,
            target: depId,
            relationship: "depends_on",
            weight: 1,
          });
        }
      }
    }

    return { nodes, edges };
  }

  private classifyCategory(item: NormalizedItem): KnowledgeCategory {
    const meta = item.metadata as Record<string, unknown>;
    if (item.sourceKind === "github") {
      if (meta.type === "repository") return "repository";
      if (meta.type === "release") return "repository";
    }
    if (item.sourceKind === "mcp_registry") return "mcp_server";
    if (item.sourceKind === "ai_framework") return "framework";
    if (item.sourceKind === "education") return "course";
    if (item.sourceKind === "research") return "research_paper";
    if (item.sourceKind === "ui_inspiration") return "ui_pattern";
    if (item.sourceKind === "website") return "website";
    if (item.sourceKind === "youtube") return "video";
    if (item.sourceKind === "blog") return "article";
    return "repository";
  }
}
