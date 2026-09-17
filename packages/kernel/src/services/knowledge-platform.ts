// Knowledge Platform Service
// Complete end-to-end application exercising the full runtime.
// Upload, classify, index, search, summarize, track provenance, audit.

import { resolve } from "node:path";
import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  readdirSync,
} from "node:fs";
import type { InstitutionService } from "../services/index.js";
import type { Artifact } from "../types/index.js";

export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  format: "markdown" | "pdf" | "html" | "text" | "json";
  topic: string;
  type: string;
  relevance: "high" | "medium" | "low";
  language: string;
  summary: string;
  keyPoints: string[];
  entities: Entity[];
  tags: string[];
  source: {
    url?: string;
    author: string;
    uploadedBy: string;
    uploadedAt: Date;
  };
  provenance: {
    version: number;
    history: ProvenanceEntry[];
  };
  metadata: Record<string, unknown>;
}

export interface Entity {
  name: string;
  type: "person" | "organization" | "location" | "project";
  relations: Relation[];
}

export interface Relation {
  type: string;
  target: string;
}

export interface ProvenanceEntry {
  action: string;
  agent: string;
  timestamp: Date;
  details: Record<string, unknown>;
}

export interface KnowledgeInput {
  action: "upload" | "search" | "update" | "archive" | "related" | "summary";
  title?: string;
  content?: string;
  format?: KnowledgeDocument["format"];
  topic?: string;
  type?: string;
  documentId?: string;
  query?: string;
  updates?: Partial<KnowledgeDocument>;
}

export class KnowledgePlatformService implements InstitutionService {
  name = "knowledge-platform";
  description =
    "Upload, classify, index, search, summarize, track provenance, audit";
  capabilities = [
    "upload-document",
    "classify-content",
    "extract-entities",
    "generate-summary",
    "index-for-search",
    "search-documents",
    "find-related",
    "track-provenance",
    "audit-changes",
  ];

  private root: string;
  private documents = new Map<string, KnowledgeDocument>();
  private searchIndex = new Map<string, string[]>(); // word -> document ids
  private entityIndex = new Map<string, string[]>(); // entity name -> document ids
  private auditLog: Array<{
    action: string;
    documentId: string;
    agent: string;
    timestamp: Date;
  }> = [];

  constructor(root: string) {
    this.root = root;
  }

  async initialize(): Promise<void> {
    // Load existing documents from memory
    const knowledgeDir = resolve(this.root, "docs/research");
    if (existsSync(knowledgeDir)) {
      const files = readdirSync(knowledgeDir).filter((f: string) =>
        f.endsWith(".md"),
      );
      for (const file of files) {
        const content = readFileSync(resolve(knowledgeDir, file), "utf-8");
        const doc = this.parseMarkdown(file, content);
        this.documents.set(doc.id, doc);
        this.indexDocument(doc);
      }
    }
  }

  async execute(
    input: KnowledgeInput,
  ): Promise<{ artifacts: Artifact[]; success: boolean; result?: unknown }> {
    const artifacts: Artifact[] = [];

    switch (input.action) {
      case "upload":
        return this.upload(input, artifacts);
      case "search":
        return this.search(input, artifacts);
      case "update":
        return this.update(input, artifacts);
      case "archive":
        return this.archive(input, artifacts);
      case "related":
        return this.findRelated(input, artifacts);
      case "summary":
        return this.summarize(input, artifacts);
    }
  }

  // Upload and classify a document
  private async upload(
    input: KnowledgeInput,
    artifacts: Artifact[],
  ): Promise<{
    artifacts: Artifact[];
    success: boolean;
    document?: KnowledgeDocument;
  }> {
    if (!input.title || !input.content) {
      return { artifacts, success: false };
    }

    const doc: KnowledgeDocument = {
      id: `doc:${crypto.randomUUID()}`,
      title: input.title,
      content: input.content,
      format: input.format ?? "markdown",
      topic: input.topic ?? this.classifyTopic(input.content),
      type: input.type ?? this.classifyType(input.content),
      relevance: this.classifyRelevance(input.content),
      language: "english",
      summary: this.generateSummary(input.content),
      keyPoints: this.extractKeyPoints(input.content),
      entities: this.extractEntities(input.content),
      tags: this.extractTags(input.content),
      source: {
        author: "unknown",
        uploadedBy: "system",
        uploadedAt: new Date(),
      },
      provenance: {
        version: 1,
        history: [
          {
            action: "upload",
            agent: "knowledge-platform",
            timestamp: new Date(),
            details: { title: input.title },
          },
        ],
      },
      metadata: {},
    };

    // Store
    this.documents.set(doc.id, doc);

    // Index
    this.indexDocument(doc);

    // Create artifact
    const dir = resolve(this.root, "docs/research");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const filename = doc.title.toLowerCase().replace(/\s+/g, "-") + ".md";
    const content = `# ${doc.title}\n\n**Topic:** ${doc.topic}\n**Type:** ${doc.type}\n**Relevance:** ${doc.relevance}\n**Summary:** ${doc.summary}\n\n---\n\n${doc.content}`;
    writeFileSync(resolve(dir, filename), content);
    artifacts.push({
      path: `docs/research/${filename}`,
      action: "created",
      content,
      metadata: {},
    });

    // Audit
    this.audit("upload", doc.id, "knowledge-platform");

    return { artifacts, success: true, document: doc };
  }

  // Search documents
  private async search(
    input: KnowledgeInput,
    artifacts: Artifact[],
  ): Promise<{
    artifacts: Artifact[];
    success: boolean;
    results: KnowledgeDocument[];
  }> {
    const query = input.query?.toLowerCase() ?? "";
    const queryWords = query.split(/\s+/).filter((w) => w.length > 2);

    // Find documents matching query words
    const matchingIds = new Set<string>();
    for (const word of queryWords) {
      const ids = this.searchIndex.get(word) ?? [];
      ids.forEach((id) => matchingIds.add(id));
    }

    // If no matches, return all documents (fallback)
    const results =
      matchingIds.size > 0
        ? Array.from(matchingIds)
            .map((id) => this.documents.get(id)!)
            .filter(Boolean)
        : Array.from(this.documents.values());

    // Audit
    this.audit("search", "multiple", "knowledge-platform");

    return { artifacts, success: true, results };
  }

  // Update a document
  private async update(
    input: KnowledgeInput,
    artifacts: Artifact[],
  ): Promise<{
    artifacts: Artifact[];
    success: boolean;
    document?: KnowledgeDocument;
  }> {
    if (!input.documentId || !input.updates) {
      return { artifacts, success: false };
    }

    const doc = this.documents.get(input.documentId);
    if (!doc) return { artifacts, success: false };

    // Apply updates
    Object.assign(doc, input.updates);
    doc.provenance.version++;
    doc.provenance.history.push({
      action: "update",
      agent: "knowledge-platform",
      timestamp: new Date(),
      details: { changes: Object.keys(input.updates) },
    });

    // Re-index
    this.indexDocument(doc);

    // Audit
    this.audit("update", doc.id, "knowledge-platform");

    return { artifacts, success: true, document: doc };
  }

  // Archive a document
  private async archive(
    input: KnowledgeInput,
    artifacts: Artifact[],
  ): Promise<{ artifacts: Artifact[]; success: boolean }> {
    if (!input.documentId) return { artifacts, success: false };

    const doc = this.documents.get(input.documentId);
    if (!doc) return { artifacts, success: false };

    doc.provenance.history.push({
      action: "archive",
      agent: "knowledge-platform",
      timestamp: new Date(),
      details: {},
    });

    // Remove from search index
    this.removeFromIndex(doc);

    // Remove from documents
    this.documents.delete(doc.id);

    // Audit
    this.audit("archive", doc.id, "knowledge-platform");

    return { artifacts, success: true };
  }

  // Find related documents
  private async findRelated(
    input: KnowledgeInput,
    artifacts: Artifact[],
  ): Promise<{
    artifacts: Artifact[];
    success: boolean;
    related: KnowledgeDocument[];
  }> {
    if (!input.documentId) return { artifacts, success: false, related: [] };

    const doc = this.documents.get(input.documentId);
    if (!doc) return { artifacts, success: false, related: [] };

    // Find documents with shared entities or tags
    const relatedIds = new Set<string>();

    for (const entity of doc.entities) {
      const ids = this.entityIndex.get(entity.name.toLowerCase()) ?? [];
      ids.forEach((id) => {
        if (id !== doc.id) relatedIds.add(id);
      });
    }

    const related = Array.from(relatedIds)
      .map((id) => this.documents.get(id)!)
      .filter(Boolean);

    return { artifacts, success: true, related };
  }

  // Generate summary
  private async summarize(
    input: KnowledgeInput,
    artifacts: Artifact[],
  ): Promise<{
    artifacts: Artifact[];
    success: boolean;
    summary: string;
    keyPoints: string[];
  }> {
    if (!input.content)
      return { artifacts, success: false, summary: "", keyPoints: [] };

    const summary = this.generateSummary(input.content);
    const keyPoints = this.extractKeyPoints(input.content);

    return { artifacts, success: true, summary, keyPoints };
  }

  // --- Classification Helpers ---

  private classifyTopic(content: string): string {
    const lower = content.toLowerCase();
    if (
      lower.includes("forest") ||
      lower.includes("nature") ||
      lower.includes("environment")
    )
      return "environment";
    if (
      lower.includes("school") ||
      lower.includes("education") ||
      lower.includes("student")
    )
      return "education";
    if (
      lower.includes("heritage") ||
      lower.includes("temple") ||
      lower.includes("culture")
    )
      return "heritage";
    if (
      lower.includes("policy") ||
      lower.includes("governance") ||
      lower.includes("compliance")
    )
      return "governance";
    return "general";
  }

  private classifyType(content: string): string {
    const lower = content.toLowerCase();
    if (lower.includes("report") || lower.includes("findings")) return "report";
    if (lower.includes("policy") || lower.includes("guideline"))
      return "policy";
    if (lower.includes("research") || lower.includes("study"))
      return "research";
    if (lower.includes("guide") || lower.includes("how to")) return "guide";
    return "document";
  }

  private classifyRelevance(content: string): "high" | "medium" | "low" {
    const wordCount = content.split(/\s+/).length;
    if (wordCount > 1000) return "high";
    if (wordCount > 200) return "medium";
    return "low";
  }

  private generateSummary(content: string): string {
    const sentences = content
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 10);
    return sentences.slice(0, 3).join(". ").trim() + ".";
  }

  private extractKeyPoints(content: string): string[] {
    const lines = content.split("\n").filter((l) => l.trim().length > 0);
    const keyPoints: string[] = [];

    for (const line of lines) {
      if (
        line.startsWith("- ") ||
        line.startsWith("* ") ||
        line.startsWith("1. ")
      ) {
        keyPoints.push(line.replace(/^[-*\d.]+\s*/, ""));
      }
    }

    return keyPoints.slice(0, 10);
  }

  private extractEntities(content: string): Entity[] {
    const entities: Entity[] = [];
    const words = content.split(/\s+/);

    // Simple entity extraction (capitalized words)
    const seen = new Set<string>();
    for (const word of words) {
      if (
        word.length > 2 &&
        word[0] === word[0].toUpperCase() &&
        !seen.has(word)
      ) {
        seen.add(word);
        entities.push({
          name: word,
          type: "organization",
          relations: [],
        });
      }
    }

    return entities.slice(0, 20);
  }

  private extractTags(content: string): string[] {
    const tags: string[] = [];
    const lower = content.toLowerCase();

    const keywords = [
      "environment",
      "education",
      "heritage",
      "governance",
      "research",
      "volunteer",
      "donation",
      "forest",
      "school",
      "temple",
    ];
    for (const keyword of keywords) {
      if (lower.includes(keyword)) tags.push(keyword);
    }

    return tags;
  }

  // --- Indexing Helpers ---

  private indexDocument(doc: KnowledgeDocument): void {
    const words = doc.title
      .toLowerCase()
      .split(/\s+/)
      .concat(doc.content.toLowerCase().split(/\s+/));
    const uniqueWords = [...new Set(words)].filter((w) => w.length > 3);

    for (const word of uniqueWords) {
      const ids = this.searchIndex.get(word) ?? [];
      if (!ids.includes(doc.id)) {
        ids.push(doc.id);
        this.searchIndex.set(word, ids);
      }
    }

    for (const entity of doc.entities) {
      const ids = this.entityIndex.get(entity.name.toLowerCase()) ?? [];
      if (!ids.includes(doc.id)) {
        ids.push(doc.id);
        this.entityIndex.set(entity.name.toLowerCase(), ids);
      }
    }
  }

  private removeFromIndex(doc: KnowledgeDocument): void {
    for (const [_word, ids] of this.searchIndex) {
      const idx = ids.indexOf(doc.id);
      if (idx >= 0) ids.splice(idx, 1);
    }
    for (const [_entity, ids] of this.entityIndex) {
      const idx = ids.indexOf(doc.id);
      if (idx >= 0) ids.splice(idx, 1);
    }
  }

  private parseMarkdown(filename: string, content: string): KnowledgeDocument {
    const title = content.split("\n")[0]?.replace(/^#\s*/, "") ?? filename;
    return {
      id: `doc:${crypto.randomUUID()}`,
      title,
      content,
      format: "markdown",
      topic: this.classifyTopic(content),
      type: this.classifyType(content),
      relevance: this.classifyRelevance(content),
      language: "english",
      summary: this.generateSummary(content),
      keyPoints: this.extractKeyPoints(content),
      entities: this.extractEntities(content),
      tags: this.extractTags(content),
      source: {
        author: "unknown",
        uploadedBy: "system",
        uploadedAt: new Date(),
      },
      provenance: { version: 1, history: [] },
      metadata: {},
    };
  }

  private audit(action: string, documentId: string, agent: string): void {
    this.auditLog.push({ action, documentId, agent, timestamp: new Date() });
  }

  // Public API
  getDocument(id: string): KnowledgeDocument | undefined {
    return this.documents.get(id);
  }

  getAllDocuments(): KnowledgeDocument[] {
    return Array.from(this.documents.values());
  }

  getAuditLog(): Array<{
    action: string;
    documentId: string;
    agent: string;
    timestamp: Date;
  }> {
    return [...this.auditLog];
  }

  async shutdown(): Promise<void> {
    this.documents.clear();
    this.searchIndex.clear();
    this.entityIndex.clear();
    this.auditLog = [];
  }
}
