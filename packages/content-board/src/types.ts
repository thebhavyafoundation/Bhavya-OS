export type ReviewStatus =
  | "draft"
  | "submitted"
  | "in-review"
  | "revision-requested"
  | "approved"
  | "published"
  | "archived";

export type ReviewType =
  | "technical-accuracy"
  | "educational-quality"
  | "research-quality"
  | "constitutional-compliance"
  | "accessibility"
  | "writing-quality";

export type ReviewerRole =
  | "subject-matter-expert"
  | "curriculum-designer"
  | "research-librarian"
  | "accessibility-auditor"
  | "editor";

export type ReviewDecision =
  "pending" | "approved" | "rejected" | "revision-requested";

export interface Review {
  id: string;
  type: ReviewType;
  reviewerRole: ReviewerRole;
  reviewerName: string;
  status: ReviewDecision;
  comments: string[];
  timestamp: string;
}

export interface ContentReview {
  id: string;
  contentId: string;
  contentType:
    "lesson" | "assessment" | "teacher-guide" | "workbook" | "knowledge-object";
  status: ReviewStatus;
  reviews: Review[];
  submittedBy: string;
  submittedAt: string;
  publishedAt: string | null;
}

export interface EditorialWorkflow {
  stages: string[];
  requiredReviews: ReviewType[];
  approvalThreshold: number;
}

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
}

export interface ReviewChecklist {
  type: ReviewType;
  role: ReviewerRole;
  items: ChecklistItem[];
}

export interface AuditEntry {
  action: string;
  by: string;
  at: string;
  details: string;
}
