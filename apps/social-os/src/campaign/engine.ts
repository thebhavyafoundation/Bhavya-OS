import { v4 as uuidv4 } from "uuid";
import { getDb } from "../lib/db.js";
import { emitEvent } from "../lib/events.js";
import type {
  Campaign,
  CampaignStatus,
  CampaignType,
  CampaignAnalytics,
  CommunicationObjective,
  AudienceSegment,
  CommunicationAsset,
  CommunicationChannel,
  PlatformType,
} from "../lib/types.js";

export function createCampaign(input: {
  name: string;
  description?: string;
  type?: CampaignType;
  knowledgePackageId?: string;
  channels?: CommunicationChannel[];
  startDate?: string;
  endDate?: string;
}): Campaign {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(
    `
    INSERT INTO campaigns (id, name, description, type, status, knowledge_package_id, channels, start_date, end_date, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'planning', ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    id,
    input.name,
    input.description || "",
    input.type || "ongoing",
    input.knowledgePackageId || null,
    JSON.stringify(input.channels || []),
    input.startDate || null,
    input.endDate || null,
    now,
    now,
  );

  emitEvent("campaign.created", { campaignId: id, name: input.name });
  return getCampaign(id)!;
}

export function getCampaign(id: string): Campaign | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM campaigns WHERE id = ?").get(id) as any;
  if (!row) return null;
  return mapRowToCampaign(row);
}

export function listCampaigns(filter?: {
  status?: CampaignStatus;
  type?: CampaignType;
  limit?: number;
}): Campaign[] {
  const db = getDb();
  let query = "SELECT * FROM campaigns";
  const params: any[] = [];
  const conditions: string[] = [];

  if (filter?.status) {
    conditions.push("status = ?");
    params.push(filter.status);
  }
  if (filter?.type) {
    conditions.push("type = ?");
    params.push(filter.type);
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
  return rows.map(mapRowToCampaign);
}

export function updateCampaignStatus(
  id: string,
  status: CampaignStatus,
): Campaign | null {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(
    "UPDATE campaigns SET status = ?, updated_at = ? WHERE id = ?",
  ).run(status, now, id);
  return getCampaign(id);
}

export function addCampaignObjective(
  campaignId: string,
  objective: {
    description: string;
    targetMetric: string;
    targetValue: number;
    unit: string;
  },
): CommunicationObjective {
  const db = getDb();
  const campaign = getCampaign(campaignId);
  if (!campaign) throw new Error("Campaign not found");

  const newObjective: CommunicationObjective = {
    id: uuidv4(),
    campaignId,
    description: objective.description,
    targetMetric: objective.targetMetric,
    targetValue: objective.targetValue,
    currentValue: 0,
    unit: objective.unit,
  };

  const objectives = [...campaign.objectives, newObjective];
  db.prepare(
    "UPDATE campaigns SET objectives = ?, updated_at = ? WHERE id = ?",
  ).run(JSON.stringify(objectives), new Date().toISOString(), campaignId);

  return newObjective;
}

export function addCampaignAudience(
  campaignId: string,
  audience: {
    name: string;
    type: AudienceSegment["type"];
    size: number;
    channels: CommunicationChannel[];
  },
): AudienceSegment {
  const db = getDb();
  const campaign = getCampaign(campaignId);
  if (!campaign) throw new Error("Campaign not found");

  const newSegment: AudienceSegment = {
    id: uuidv4(),
    name: audience.name,
    type: audience.type,
    size: audience.size,
    growthRate: 0,
    engagementRate: 0,
    channels: audience.channels,
  };

  const audienceList = [...campaign.audience, newSegment];
  db.prepare(
    "UPDATE campaigns SET audience = ?, updated_at = ? WHERE id = ?",
  ).run(JSON.stringify(audienceList), new Date().toISOString(), campaignId);

  return newSegment;
}

export function linkPublicationToCampaign(
  campaignId: string,
  publicationId: string,
): void {
  const db = getDb();
  const campaign = getCampaign(campaignId);
  if (!campaign) return;

  const publications = [...campaign.publications, publicationId];
  db.prepare(
    "UPDATE campaigns SET publications = ?, updated_at = ? WHERE id = ?",
  ).run(JSON.stringify(publications), new Date().toISOString(), campaignId);

  db.prepare(
    "UPDATE publications SET campaign_id = ?, updated_at = ? WHERE id = ?",
  ).run(campaignId, new Date().toISOString(), publicationId);
}

export function getCampaignAnalytics(
  campaignId: string,
): CampaignAnalytics | null {
  const db = getDb();
  const campaign = getCampaign(campaignId);
  if (!campaign) return null;

  const publications = campaign.publications;
  let totalImpressions = 0;
  let totalReach = 0;
  let totalEngagement = 0;
  let totalClicks = 0;
  let publishedCount = 0;
  const platformBreakdown: Record<string, any> = {};

  for (const pubId of publications) {
    const pub = db
      .prepare("SELECT * FROM publications WHERE id = ?")
      .get(pubId) as any;
    if (pub && pub.status === "published") publishedCount++;

    const analytics = db
      .prepare(
        "SELECT metrics FROM analytics_snapshots WHERE publication_id = ?",
      )
      .get(pubId) as any;
    if (analytics) {
      const metrics = JSON.parse(analytics.metrics || "{}");
      for (const [platform, m] of Object.entries(metrics) as any) {
        totalImpressions += m.impressions || 0;
        totalReach += m.reach || 0;
        totalEngagement += m.engagement || 0;
        totalClicks += m.clicks || 0;
        if (!platformBreakdown[platform]) {
          platformBreakdown[platform] = {
            impressions: 0,
            reach: 0,
            engagement: 0,
            clicks: 0,
            shares: 0,
            comments: 0,
            likes: 0,
          };
        }
        platformBreakdown[platform].impressions += m.impressions || 0;
        platformBreakdown[platform].reach += m.reach || 0;
        platformBreakdown[platform].engagement += m.engagement || 0;
        platformBreakdown[platform].clicks += m.clicks || 0;
        platformBreakdown[platform].shares += m.shares || 0;
        platformBreakdown[platform].comments += m.comments || 0;
        platformBreakdown[platform].likes += m.likes || 0;
      }
    }
  }

  return {
    campaignId,
    totalPublications: publications.length,
    publishedCount,
    totalImpressions,
    totalReach,
    totalEngagement,
    totalClicks,
    platformBreakdown: platformBreakdown as any,
    audienceGrowth: 0,
    conversionRate: 0,
    collectedAt: new Date().toISOString(),
  };
}

function mapRowToCampaign(row: any): Campaign {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    type: row.type as CampaignType,
    status: row.status as CampaignStatus,
    knowledgePackageId: row.knowledge_package_id,
    objectives: JSON.parse(row.objectives || "[]"),
    audience: JSON.parse(row.audience || "[]"),
    assets: JSON.parse(row.assets || "[]"),
    channels: JSON.parse(row.channels || "[]"),
    schedule: [],
    approvals: [],
    publications: JSON.parse(row.publications || "[]"),
    metrics: JSON.parse(row.metrics || "{}"),
    retrospective: row.retrospective
      ? JSON.parse(row.retrospective)
      : undefined,
    startDate: row.start_date,
    endDate: row.end_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
