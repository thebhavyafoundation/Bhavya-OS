import { DocumentCategory, DocumentStatus } from "./models";
import { writeJSON, ensureDir } from "./io";

// ── Publication Contract ───────────────────────────────────

export type DocumentType =
  | "field-report"
  | "assessment"
  | "conservation-plan"
  | "impact-report"
  | "survey-result"
  | "monitoring-log"
  | "activity-record"
  | "training-record"
  | "assignment-record"
  | "research Finding"
  | "policy-document"
  | "general";

export type Visibility = "public" | "internal" | "restricted";

export interface PublicationRequest {
  source: string;
  entity: string;
  entityId: string;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  visibility: Visibility;
  documentType: DocumentType;
  metadata?: Record<string, string>;
}

export interface PublicationResult {
  documentId: string;
  path: string;
  created: string;
}

// ── Visibility to Status Mapping ───────────────────────────

const VISIBILITY_MAP: Record<Visibility, DocumentStatus> = {
  public: "published",
  internal: "approved",
  restricted: "draft",
};

// ── Document Type to Category Mapping ──────────────────────

const CATEGORY_MAP: Record<DocumentType, DocumentCategory> = {
  "field-report": "report",
  "assessment": "report",
  "conservation-plan": "report",
  "impact-report": "report",
  "survey-result": "report",
  "monitoring-log": "report",
  "activity-record": "report",
  "training-record": "report",
  "assignment-record": "report",
  "research Finding": "research",
  "policy-document": "policy",
  "general": "content",
};

// ── Core Publication Function ──────────────────────────────

export function publishKnowledge(request: PublicationRequest): PublicationResult {
  const docId = `${request.source}-${request.entity}-${request.entityId}`;
  const now = new Date().toISOString();

  const doc = {
    id: docId,
    title: request.title,
    category: CATEGORY_MAP[request.documentType],
    path: `/documents/${docId}`,
    content: request.content,
    summary: request.summary,
    tags: [request.source, request.entity, ...request.tags],
    status: VISIBILITY_MAP[request.visibility],
    created: now,
    readingTime: Math.max(1, Math.ceil(request.content.split(/\s+/).length / 200)),
    version: 1,
    links: [],
    citations: [],
    entityIds: [],
    metadata: {
      source: request.source,
      sourceEntity: request.entity,
      sourceEntityId: request.entityId,
      documentType: request.documentType,
      visibility: request.visibility,
      ...request.metadata,
    },
  };

  ensureDir("content/knowledge");
  writeJSON("content/knowledge", `${docId}.json`, doc);

  return { documentId: docId, path: `/documents/${docId}`, created: now };
}

// ── Convenience Publishers ─────────────────────────────────

export function publishFieldReport(
  source: string,
  entity: string,
  entityId: string,
  data: {
    title: string;
    content: string;
    summary: string;
    tags?: string[];
    visibility?: Visibility;
    metadata?: Record<string, string>;
  },
): PublicationResult {
  return publishKnowledge({
    source,
    entity,
    entityId,
    title: data.title,
    content: data.content,
    summary: data.summary,
    tags: data.tags || [],
    visibility: data.visibility || "public",
    documentType: "field-report",
    metadata: data.metadata,
  });
}

export function publishImpactReport(
  source: string,
  entity: string,
  entityId: string,
  data: {
    title: string;
    content: string;
    summary: string;
    tags?: string[];
    visibility?: Visibility;
    metadata?: Record<string, string>;
  },
): PublicationResult {
  return publishKnowledge({
    source,
    entity,
    entityId,
    title: data.title,
    content: data.content,
    summary: data.summary,
    tags: data.tags || [],
    visibility: data.visibility || "public",
    documentType: "impact-report",
    metadata: data.metadata,
  });
}

export function publishSurveyResult(
  source: string,
  entity: string,
  entityId: string,
  data: {
    title: string;
    content: string;
    summary: string;
    tags?: string[];
    visibility?: Visibility;
    metadata?: Record<string, string>;
  },
): PublicationResult {
  return publishKnowledge({
    source,
    entity,
    entityId,
    title: data.title,
    content: data.content,
    summary: data.summary,
    tags: data.tags || [],
    visibility: data.visibility || "public",
    documentType: "survey-result",
    metadata: data.metadata,
  });
}

export function publishMonitoringLog(
  source: string,
  entity: string,
  entityId: string,
  data: {
    title: string;
    content: string;
    summary: string;
    tags?: string[];
    visibility?: Visibility;
    metadata?: Record<string, string>;
  },
): PublicationResult {
  return publishKnowledge({
    source,
    entity,
    entityId,
    title: data.title,
    content: data.content,
    summary: data.summary,
    tags: data.tags || [],
    visibility: data.visibility || "internal",
    documentType: "monitoring-log",
    metadata: data.metadata,
  });
}
