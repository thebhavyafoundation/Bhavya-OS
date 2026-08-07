import { randomUUID } from "node:crypto";
import type {
  ContentReview,
  Review,
  ReviewDecision,
  ReviewerRole,
  ReviewStatus,
  AuditEntry,
  EditorialWorkflow,
} from "./types";
import { REVIEW_CHECKLISTS } from "./review-checklists";

const DEFAULT_WORKFLOW: EditorialWorkflow = {
  stages: [
    "draft",
    "submitted",
    "in-review",
    "revision-requested",
    "approved",
    "published",
    "archived",
  ],
  requiredReviews: [
    "technical-accuracy",
    "educational-quality",
    "research-quality",
    "constitutional-compliance",
    "accessibility",
    "writing-quality",
  ],
  approvalThreshold: 1.0,
};

const store = new Map<string, ContentReview>();
const auditLogs = new Map<string, AuditEntry[]>();

function addAuditEntry(
  contentId: string,
  action: string,
  by: string,
  details: string,
): void {
  const log = auditLogs.get(contentId) ?? [];
  log.push({ action, by, at: new Date().toISOString(), details });
  auditLogs.set(contentId, log);
}

export function createReviewRequest(
  content: { id: string; type: ContentReview["contentType"] },
  submittedBy: string,
  workflow: EditorialWorkflow = DEFAULT_WORKFLOW,
): ContentReview {
  const now = new Date().toISOString();
  const reviews: Review[] = workflow.requiredReviews.map((type) => {
    const checklist = REVIEW_CHECKLISTS[type];
    return {
      id: randomUUID(),
      type,
      reviewerRole: checklist.role,
      reviewerName: "",
      status: "pending" as ReviewDecision,
      comments: [],
      timestamp: "",
    };
  });

  const reviewRequest: ContentReview = {
    id: randomUUID(),
    contentId: content.id,
    contentType: content.type,
    status: "submitted",
    reviews,
    submittedBy,
    submittedAt: now,
    publishedAt: null,
  };

  store.set(content.id, reviewRequest);
  addAuditEntry(
    content.id,
    "review-requested",
    submittedBy,
    `Review created for ${content.type} with ${reviews.length} required reviews`,
  );

  return reviewRequest;
}

export function submitReview(
  contentId: string,
  reviewId: string,
  reviewerName: string,
  status: ReviewDecision,
  comments: string[] = [],
): Review {
  const content = store.get(contentId);
  if (!content) throw new Error(`No review found for content: ${contentId}`);

  const review = content.reviews.find((r) => r.id === reviewId);
  if (!review) throw new Error(`No review found with id: ${reviewId}`);

  review.reviewerName = reviewerName;
  review.status = status;
  review.comments = comments;
  review.timestamp = new Date().toISOString();

  const allReviewed = content.reviews.every((r) => r.status !== "pending");
  const anyRejected = content.reviews.some(
    (r) => r.status === "rejected" || r.status === "revision-requested",
  );

  if (allReviewed && !anyRejected) {
    content.status = "approved";
  } else if (anyRejected) {
    content.status = "revision-requested";
  } else {
    content.status = "in-review";
  }

  addAuditEntry(
    contentId,
    "review-submitted",
    reviewerName,
    `${review.type}: ${status}`,
  );
  return { ...review };
}

export function getStatus(contentId: string): ReviewStatus {
  const content = store.get(contentId);
  if (!content) throw new Error(`No review found for content: ${contentId}`);
  return content.status;
}

export function canPublish(contentId: string): boolean {
  const content = store.get(contentId);
  if (!content) return false;
  return content.reviews.every((r) => r.status === "approved");
}

export function publish(contentId: string, publishedBy: string): ContentReview {
  const content = store.get(contentId);
  if (!content) throw new Error(`No review found for content: ${contentId}`);
  if (!canPublish(contentId)) {
    throw new Error("Cannot publish: not all reviews are approved");
  }

  content.status = "published";
  content.publishedAt = new Date().toISOString();
  addAuditEntry(
    contentId,
    "published",
    publishedBy,
    "Content approved and published",
  );

  return { ...content };
}

export function requestRevision(
  contentId: string,
  reviewId: string,
  comments: string[],
): Review {
  const content = store.get(contentId);
  if (!content) throw new Error(`No review found for content: ${contentId}`);

  const review = content.reviews.find((r) => r.id === reviewId);
  if (!review) throw new Error(`No review found with id: ${reviewId}`);

  review.status = "revision-requested";
  review.comments = comments;
  review.timestamp = new Date().toISOString();
  content.status = "revision-requested";

  addAuditEntry(
    contentId,
    "revision-requested",
    review.reviewerName,
    `Revision requested for ${review.type}: ${comments.join("; ")}`,
  );
  return { ...review };
}

export function getReviewerQueue(
  role: ReviewerRole,
): Array<{
  contentId: string;
  contentType: ContentReview["contentType"];
  review: Review;
}> {
  const queue: Array<{
    contentId: string;
    contentType: ContentReview["contentType"];
    review: Review;
  }> = [];

  for (const [_contentId, content] of store) {
    if (
      content.status !== "submitted" &&
      content.status !== "in-review" &&
      content.status !== "revision-requested"
    ) {
      continue;
    }
    for (const review of content.reviews) {
      if (review.reviewerRole === role && review.status === "pending") {
        queue.push({
          contentId: content.contentId,
          contentType: content.contentType,
          review,
        });
      }
    }
  }

  return queue;
}

export function getAuditLog(contentId: string): AuditEntry[] {
  return auditLogs.get(contentId) ?? [];
}

export function getReview(contentId: string): ContentReview | undefined {
  return store.get(contentId)
    ? { ...store.get(contentId)!, reviews: [...store.get(contentId)!.reviews] }
    : undefined;
}

export function listAll(): ContentReview[] {
  return Array.from(store.values()).map((c) => ({
    ...c,
    reviews: [...c.reviews],
  }));
}
