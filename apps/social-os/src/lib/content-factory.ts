import { addToQueue } from "../queue/queue.js";
import { emitEvent } from "../lib/events.js";
import type { PlatformType, ContentSource } from "../lib/types.js";

export interface ContentReadyEvent {
  knowledgePackageId?: string;
  title: string;
  content: string;
  type: "knowledge_package" | "blog" | "announcement" | "community";
  platforms: PlatformType[];
  hashtags?: string[];
  scheduledAt?: string;
}

export function handleContentReady(event: ContentReadyEvent): {
  publicationId: string;
} {
  const source: ContentSource = {
    type: event.type,
    knowledgePackageId: event.knowledgePackageId,
    version: "1.0",
    reviewStatus: "published",
    constitutionCitation: event.knowledgePackageId
      ? `KP-${event.knowledgePackageId}`
      : undefined,
  };

  const item = addToQueue({
    title: event.title,
    content: event.content,
    platforms: event.platforms,
    source,
    hashtags: event.hashtags,
    scheduledAt: event.scheduledAt,
  });

  emitEvent("content.ready", {
    publicationId: item.publicationId,
    knowledgePackageId: event.knowledgePackageId,
    platforms: event.platforms,
  });

  return { publicationId: item.publicationId };
}

export function createKnowledgePackagePublication(kp: {
  id: string;
  title: string;
  summary: string;
  domain: string;
  level: number;
}) {
  return handleContentReady({
    knowledgePackageId: kp.id,
    title: kp.title,
    content: `${kp.summary}\n\nDomain: ${kp.domain} | Level: ${kp.level}`,
    type: "knowledge_package",
    platforms: ["linkedin", "x"],
    hashtags: [kp.domain, "AI", "BhavyaFoundation", "KnowledgePackage"],
  });
}

export function createBlogPublication(blog: {
  title: string;
  content: string;
  tags?: string[];
}) {
  return handleContentReady({
    title: blog.title,
    content: blog.content,
    type: "blog",
    platforms: ["linkedin", "x", "github"],
    hashtags: blog.tags || ["BhavyaFoundation"],
  });
}

export function createAnnouncementPublication(announcement: {
  title: string;
  content: string;
}) {
  return handleContentReady({
    title: announcement.title,
    content: announcement.content,
    type: "announcement",
    platforms: ["linkedin", "x", "instagram"],
    hashtags: ["BhavyaFoundation", "Announcement"],
  });
}
