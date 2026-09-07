import {
  emitEvent,
  getUnprocessedEvents,
  markEventProcessed,
} from "../lib/events.js";
import {
  createCampaign,
  getCampaign,
  updateCampaignStatus,
  linkPublicationToCampaign,
} from "./engine.js";
import { createCalendarEntry, updateCalendarEntryStatus } from "./calendar.js";
import { addToQueue, getQueue } from "../queue/queue.js";
import {
  validateConstitutionalCompliance,
  createBrandReview,
} from "../lib/constitution-integration.js";
import {
  getPublication,
  updatePublicationStatus,
} from "../lib/publications.js";
import { saveInstitutionMetric } from "../analytics/institution.js";
import {
  submitFeedback,
  processFeedback,
  getFeedbackIntelligence,
} from "./community-intelligence.js";
import type {
  CampaignType,
  CommunicationChannel,
  PlatformType,
  CalendarEntryType,
  ContentSource,
} from "../lib/types.js";

export interface CommunicationLoopResult {
  campaignId: string;
  calendarEntries: number;
  publicationsCreated: number;
  constitutionalChecks: number;
  brandReviews: number;
  status: string;
}

export function runCommunicationLoop(input: {
  knowledgePackageId: string;
  title: string;
  summary: string;
  domain: string;
  level: number;
  channels?: CommunicationChannel[];
}): CommunicationLoopResult {
  const channels = input.channels || ["linkedin", "x", "website", "github"];

  // 1. Create campaign
  const campaign = createCampaign({
    name: `${input.title} Launch`,
    description: input.summary,
    type: "knowledge_launch",
    knowledgePackageId: input.knowledgePackageId,
    channels,
    startDate: new Date().toISOString(),
  });

  // 2. Create editorial calendar entries for each channel
  const calendarEntries: CalendarEntryType[] = [];
  const platformMap: Record<string, CalendarEntryType> = {
    website: "website_article",
    github: "github_release",
    linkedin: "linkedin_post",
    x: "x_post",
    youtube: "youtube_video",
    instagram: "instagram_post",
    newsletter: "newsletter",
    discord: "community_discussion",
  };

  let entryCount = 0;
  for (const channel of channels) {
    const entryType = platformMap[channel] || "blog";
    const scheduledDate = new Date(
      Date.now() + entryCount * 86400000,
    ).toISOString();

    createCalendarEntry({
      campaignId: campaign.id,
      type: entryType as CalendarEntryType,
      title: `${input.title} — ${channel}`,
      description: `${input.summary} (via ${channel})`,
      platforms: [channel as PlatformType],
      scheduledDate,
    });
    entryCount++;
  }

  // 3. Create publications for each platform
  const platforms = channels.filter((c) =>
    ["linkedin", "x", "github", "youtube", "instagram"].includes(c),
  ) as PlatformType[];
  const source: ContentSource = {
    type: "knowledge_package",
    knowledgePackageId: input.knowledgePackageId,
    version: "1.0",
    reviewStatus: "published",
    constitutionCitation: `KP-${input.knowledgePackageId}`,
  };

  const pubItem = addToQueue({
    title: input.title,
    content: `${input.summary}\n\nDomain: ${input.domain} | Level: ${input.level}`,
    platforms,
    source,
    hashtags: [input.domain, "AI", "BhavyaFoundation", "KnowledgePackage"],
  });

  linkPublicationToCampaign(campaign.id, pubItem.publicationId);

  // 4. Constitutional validation
  const publication = getPublication(pubItem.publicationId);
  let constitutionalChecks = 0;
  if (publication) {
    const check = validateConstitutionalCompliance(publication);
    constitutionalChecks = check.checks.length;

    const brandReview = createBrandReview(publication.id, publication.content);

    // Auto-approve if constitutional check passes
    if (check.passed) {
      updatePublicationStatus(publication.id, "approved");
    }
  }

  // 5. Activate campaign
  updateCampaignStatus(campaign.id, "active");

  // 6. Emit loop completion event
  emitEvent("communication.loop_completed", {
    campaignId: campaign.id,
    knowledgePackageId: input.knowledgePackageId,
    publications: platforms.length,
    calendarEntries: entryCount,
  });

  return {
    campaignId: campaign.id,
    calendarEntries: entryCount,
    publicationsCreated: 1,
    constitutionalChecks,
    brandReviews: 1,
    status: "active",
  };
}

export function processEvents(): {
  eventsProcessed: number;
  campaignsUpdated: number;
  calendarUpdated: number;
} {
  const events = getUnprocessedEvents();
  let eventsProcessed = 0;
  let campaignsUpdated = 0;
  let calendarUpdated = 0;

  for (const event of events) {
    switch (event.type) {
      case "publication.published": {
        const { publicationId } = event.payload;
        const pub = getPublication(publicationId);
        if (pub?.campaignId) {
          const campaign = getCampaign(pub.campaignId);
          if (campaign) {
            updateCampaignStatus(campaign.id, "active");
            campaignsUpdated++;
          }
        }
        break;
      }

      case "feedback.submitted": {
        const { feedbackId } = event.payload;
        processFeedback(feedbackId);
        break;
      }

      case "campaign.completed": {
        const { campaignId } = event.payload;
        updateCampaignStatus(campaignId, "completed");
        campaignsUpdated++;
        break;
      }
    }

    markEventProcessed(event.id);
    eventsProcessed++;
  }

  return { eventsProcessed, campaignsUpdated, calendarUpdated };
}

export function getCommunicationLoopStatus(): {
  activeCampaigns: number;
  pendingPublications: number;
  pendingApprovals: number;
  recentEvents: number;
  feedbackIntelligence: ReturnType<typeof getFeedbackIntelligence>;
} {
  const campaigns = getQueue(undefined, 100);
  const pending = campaigns.filter((c) => c.status === "pending_approval");
  const events = getUnprocessedEvents();

  return {
    activeCampaigns: campaigns.length,
    pendingPublications: campaigns.filter((c) => c.status === "draft").length,
    pendingApprovals: pending.length,
    recentEvents: events.length,
    feedbackIntelligence: getFeedbackIntelligence(),
  };
}
