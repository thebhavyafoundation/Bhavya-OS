import { v4 as uuidv4 } from "uuid";
import { getDb } from "../lib/db.js";
import { emitEvent } from "../lib/events.js";
import type {
  CommunityFeedback,
  FeedbackSource,
  FeedbackClassification,
} from "../lib/types.js";

const CLASSIFICATION_KEYWORDS: Record<FeedbackClassification, string[]> = {
  knowledge_gap: [
    "don't understand",
    "confused",
    "unclear",
    "missing",
    "need more",
    "explain",
    "what is",
    "how does",
  ],
  curriculum_improvement: [
    "curriculum",
    "syllabus",
    "course",
    "lesson",
    "module",
    "level",
    "progression",
  ],
  product_improvement: [
    "bug",
    "error",
    "broken",
    "fix",
    "improve",
    "feature",
    "request",
    "UI",
    "UX",
  ],
  community_request: [
    "community",
    "discuss",
    "forum",
    "discord",
    "meetup",
    "event",
    "collaborate",
  ],
  research_opportunity: [
    "research",
    "paper",
    "study",
    "experiment",
    "hypothesis",
    "data",
    "analysis",
  ],
  general: [],
};

function classifyFeedback(content: string): FeedbackClassification {
  const lower = content.toLowerCase();
  let bestMatch: FeedbackClassification = "general";
  let bestScore = 0;

  for (const [classification, keywords] of Object.entries(
    CLASSIFICATION_KEYWORDS,
  )) {
    const score = keywords.filter((kw) =>
      lower.includes(kw.toLowerCase()),
    ).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = classification as FeedbackClassification;
    }
  }

  return bestMatch;
}

function analyzeSentiment(content: string): number {
  const positive = [
    "great",
    "awesome",
    "excellent",
    "love",
    "amazing",
    "helpful",
    "clear",
    "perfect",
    "thank",
  ];
  const negative = [
    "bad",
    "terrible",
    "hate",
    "confusing",
    "unclear",
    "broken",
    "wrong",
    "awful",
    "useless",
  ];

  const lower = content.toLowerCase();
  const posCount = positive.filter((w) => lower.includes(w)).length;
  const negCount = negative.filter((w) => lower.includes(w)).length;

  const total = posCount + negCount;
  if (total === 0) return 0.5;
  return posCount / total;
}

export function submitFeedback(input: {
  source: FeedbackSource;
  content: string;
  author?: string;
  url?: string;
  knowledgePackageId?: string;
  campaignId?: string;
}): CommunityFeedback {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();
  const classification = classifyFeedback(input.content);
  const sentiment = analyzeSentiment(input.content);

  db.prepare(
    `
    INSERT INTO community_feedback (id, source, classification, content, author, url, knowledge_package_id, campaign_id, sentiment, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    id,
    input.source,
    classification,
    input.content,
    input.author || null,
    input.url || null,
    input.knowledgePackageId || null,
    input.campaignId || null,
    sentiment,
    now,
  );

  emitEvent("feedback.submitted", {
    feedbackId: id,
    source: input.source,
    classification,
    sentiment,
  });

  return getFeedback(id)!;
}

export function getFeedback(id: string): CommunityFeedback | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM community_feedback WHERE id = ?")
    .get(id) as any;
  if (!row) return null;
  return mapRowToFeedback(row);
}

export function listFeedback(filter?: {
  source?: FeedbackSource;
  classification?: FeedbackClassification;
  campaignId?: string;
  limit?: number;
}): CommunityFeedback[] {
  const db = getDb();
  let query = "SELECT * FROM community_feedback";
  const params: any[] = [];
  const conditions: string[] = [];

  if (filter?.source) {
    conditions.push("source = ?");
    params.push(filter.source);
  }
  if (filter?.classification) {
    conditions.push("classification = ?");
    params.push(filter.classification);
  }
  if (filter?.campaignId) {
    conditions.push("campaign_id = ?");
    params.push(filter.campaignId);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY created_at DESC";

  if (filter?.limit) {
    query += " LIMIT ?";
    params.push(filter.limit);
  }

  const rows = db.prepare(query).all(...params) as any[];
  return rows.map(mapRowToFeedback);
}

export function processFeedback(id: string): void {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare("UPDATE community_feedback SET processed_at = ? WHERE id = ?").run(
    now,
    id,
  );
  emitEvent("feedback.processed", { feedbackId: id });
}

export function getFeedbackIntelligence(): {
  total: number;
  byClassification: Record<FeedbackClassification, number>;
  bySource: Record<string, number>;
  averageSentiment: number;
  topKnowledgeGaps: { content: string; count: number }[];
} {
  const db = getDb();
  const all = db.prepare("SELECT * FROM community_feedback ORDER BY created_at DESC LIMIT 10000").all() as any[];

  const byClassification: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  let totalSentiment = 0;

  for (const row of all) {
    byClassification[row.classification] =
      (byClassification[row.classification] || 0) + 1;
    bySource[row.source] = (bySource[row.source] || 0) + 1;
    totalSentiment += row.sentiment;
  }

  const knowledgeGaps = db
    .prepare(
      `
    SELECT content, COUNT(*) as count FROM community_feedback
    WHERE classification = 'knowledge_gap'
    GROUP BY content ORDER BY count DESC LIMIT 10
  `,
    )
    .all() as any[];

  return {
    total: all.length,
    byClassification: byClassification as Record<
      FeedbackClassification,
      number
    >,
    bySource,
    averageSentiment: all.length > 0 ? totalSentiment / all.length : 0.5,
    topKnowledgeGaps: knowledgeGaps.map((g) => ({
      content: g.content,
      count: g.count,
    })),
  };
}

function mapRowToFeedback(row: any): CommunityFeedback {
  return {
    id: row.id,
    source: row.source as FeedbackSource,
    classification: row.classification as FeedbackClassification,
    content: row.content,
    author: row.author,
    url: row.url,
    sentiment: row.sentiment,
    knowledgePackageId: row.knowledge_package_id,
    campaignId: row.campaign_id,
    processedAt: row.processed_at,
    createdAt: row.created_at,
  };
}
