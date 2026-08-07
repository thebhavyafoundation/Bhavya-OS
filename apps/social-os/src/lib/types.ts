export type PublicationStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "edited"
  | "scheduling"
  | "publishing"
  | "published"
  | "analytics_collected";

export type SocialPriority = "low" | "normal" | "high" | "urgent";

export type ApprovalStatus = "pending" | "approved" | "rejected" | "edited";

export type PlatformType =
  | "linkedin"
  | "x"
  | "github"
  | "youtube"
  | "instagram"
  | "newsletter"
  | "discord"
  | "website";

export type MediaType = "image" | "video" | "document";

export type ContentSourceType =
  | "knowledge_package"
  | "blog"
  | "announcement"
  | "community"
  | "event"
  | "workshop"
  | "hackathon"
  | "mentor_session";

export type CampaignStatus =
  "planning" | "active" | "paused" | "completed" | "retrospective";

export type CampaignType =
  | "knowledge_launch"
  | "community_building"
  | "institution_growth"
  | "educational"
  | "announcement"
  | "ongoing";

export type CalendarEntryType =
  | "knowledge_package"
  | "website_article"
  | "blog"
  | "github_release"
  | "linkedin_post"
  | "x_post"
  | "instagram_post"
  | "youtube_video"
  | "newsletter"
  | "event"
  | "workshop"
  | "hackathon"
  | "mentor_session"
  | "community_discussion";

export type CalendarStatus =
  "draft" | "scheduled" | "in_progress" | "published" | "completed";

export type AudienceType =
  | "students"
  | "mentors"
  | "contributors"
  | "donors"
  | "general"
  | "educators"
  | "institutions";

export type FeedbackSource =
  "website" | "github" | "discord" | "linkedin" | "x" | "email" | "direct";

export type FeedbackClassification =
  | "knowledge_gap"
  | "curriculum_improvement"
  | "product_improvement"
  | "community_request"
  | "research_opportunity"
  | "general";

export type CommunicationChannel =
  | "website"
  | "github"
  | "linkedin"
  | "x"
  | "youtube"
  | "instagram"
  | "newsletter"
  | "discord";

export type AssetType =
  "text" | "image" | "video" | "document" | "link" | "template";

export type ApprovalWorkflowStep =
  | "content_review"
  | "brand_review"
  | "constitutional_review"
  | "final_approval";

// ─── EXISTING (preserved) ────────────────────────────────────

export interface MediaAsset {
  url: string;
  type: MediaType;
  altText?: string;
  platformOptimizations?: Record<PlatformType, MediaOptimization>;
}

export interface MediaOptimization {
  width: number;
  height: number;
  format: string;
  maxFileSize: number;
}

export interface PlatformConstraints {
  maxCharacters: number;
  maxMedia: number;
  supportedMediaTypes: MediaType[];
  hashtagLimit?: number;
  mentionLimit?: number;
}

export interface PlatformContent {
  platform: PlatformType;
  text: string;
  media: MediaAsset[];
  hashtags: string[];
  mentions: string[];
  characterCount: number;
  isWithinLimits: boolean;
}

export interface PlatformMetrics {
  impressions: number;
  reach: number;
  engagement: number;
  clicks: number;
  shares: number;
  comments: number;
  likes: number;
}

export interface AccountMetrics {
  followers: number;
  following: number;
  posts: number;
  engagementRate: number;
  growthRate: number;
}

export interface SocialAccount {
  id: string;
  platform: PlatformType;
  name: string;
  isActive: boolean;
  avatarUrl?: string;
  profileUrl?: string;
}

export interface ContentSource {
  type: ContentSourceType;
  knowledgePackageId?: string;
  version?: string;
  reviewStatus?: string;
  constitutionCitation?: string;
}

export interface PublicationMetadata {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  version: number;
  tags: string[];
  campaignId?: string;
}

export interface Publication {
  id: string;
  title: string;
  content: string;
  platformContent: Record<PlatformType, PlatformContent>;
  status: PublicationStatus;
  priority: SocialPriority;
  source: ContentSource;
  campaignId?: string;
  scheduledAt?: string;
  publishedAt?: string;
  approval?: ApprovalRecord;
  analytics?: AnalyticsSnapshot;
  metadata: PublicationMetadata;
}

export interface ApprovalRecord {
  id: string;
  publicationId: string;
  requestedBy: string;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  status: ApprovalStatus;
  notes?: string;
}

export interface AnalyticsSnapshot {
  publicationId: string;
  collectedAt: string;
  metrics: Record<PlatformType, PlatformMetrics>;
}

export interface CreatePostRequest {
  text: string;
  platformAccountIds: string[];
  scheduledAt?: string;
  media?: MediaAsset[];
}

export interface Post {
  id: string;
  platform: PlatformType;
  content: string;
  scheduledAt?: string;
  publishedAt?: string;
  status: string;
  metrics?: PlatformMetrics;
}

export interface PublishingProvider {
  listAccounts(): Promise<SocialAccount[]>;
  getAccount(id: string): Promise<SocialAccount>;
  createPost(post: CreatePostRequest): Promise<Post>;
  schedulePost(post: CreatePostRequest, scheduledAt: string): Promise<Post>;
  publishPost(post: CreatePostRequest): Promise<Post>;
  getPost(id: string): Promise<Post>;
  deletePost(id: string): Promise<void>;
  uploadMedia(file: Buffer, type: MediaType): Promise<MediaAsset>;
  getPostMetrics(postId: string): Promise<PlatformMetrics>;
  getAccountMetrics(accountId: string): Promise<AccountMetrics>;
  getPlatformLimits(platform: PlatformType): Promise<PlatformConstraints>;
}

// ─── NEW: Campaign ───────────────────────────────────────────

export interface Campaign {
  id: string;
  name: string;
  description: string;
  type: CampaignType;
  status: CampaignStatus;
  knowledgePackageId?: string;
  objectives: CommunicationObjective[];
  audience: AudienceSegment[];
  assets: CommunicationAsset[];
  channels: CommunicationChannel[];
  schedule: EditorialCalendarEntry[];
  approvals: ApprovalWorkflow[];
  publications: string[];
  metrics: CampaignAnalytics;
  retrospective?: CampaignRetrospective;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── NEW: EditorialCalendar ──────────────────────────────────

export interface EditorialCalendarEntry {
  id: string;
  campaignId?: string;
  type: CalendarEntryType;
  title: string;
  description: string;
  platforms: PlatformType[];
  scheduledDate: string;
  status: CalendarStatus;
  publicationId?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── NEW: CommunicationObjective ─────────────────────────────

export interface CommunicationObjective {
  id: string;
  campaignId: string;
  description: string;
  targetMetric: string;
  targetValue: number;
  currentValue: number;
  unit: string;
}

// ─── NEW: AudienceSegment ────────────────────────────────────

export interface AudienceSegment {
  id: string;
  name: string;
  type: AudienceType;
  size: number;
  growthRate: number;
  engagementRate: number;
  channels: CommunicationChannel[];
}

// ─── NEW: PublishingWindow ───────────────────────────────────

export interface PublishingWindow {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  platforms: PlatformType[];
  timezone: string;
}

// ─── NEW: CommunicationAsset ─────────────────────────────────

export interface CommunicationAsset {
  id: string;
  campaignId: string;
  name: string;
  type: AssetType;
  url: string;
  content?: string;
  metadata: Record<string, any>;
  createdAt: string;
}

// ─── NEW: BrandReview ────────────────────────────────────────

export interface BrandReview {
  id: string;
  publicationId: string;
  reviewedAt: string;
  passed: boolean;
  brandNameCorrect: boolean;
  taglinePresent: boolean;
  colorPaletteConsistent: boolean;
  toneConsistent: boolean;
  issues: string[];
}

// ─── NEW: CommunityFeedback ──────────────────────────────────

export interface CommunityFeedback {
  id: string;
  source: FeedbackSource;
  classification: FeedbackClassification;
  content: string;
  author?: string;
  url?: string;
  sentiment: number;
  knowledgePackageId?: string;
  campaignId?: string;
  processedAt?: string;
  createdAt: string;
}

// ─── NEW: CampaignAnalytics ──────────────────────────────────

export interface CampaignAnalytics {
  campaignId: string;
  totalPublications: number;
  publishedCount: number;
  totalImpressions: number;
  totalReach: number;
  totalEngagement: number;
  totalClicks: number;
  platformBreakdown: Record<PlatformType, PlatformMetrics>;
  audienceGrowth: number;
  conversionRate: number;
  collectedAt: string;
}

// ─── NEW: InstitutionMetric ──────────────────────────────────

export interface InstitutionMetric {
  id: string;
  name: string;
  category: "trust" | "participation" | "growth" | "educational" | "mission";
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  changePercent: number;
  period: string;
  collectedAt: string;
}

// ─── NEW: CommunicationStrategy ──────────────────────────────

export interface CommunicationStrategy {
  id: string;
  name: string;
  description: string;
  channels: CommunicationChannel[];
  frequency: string;
  audience: AudienceType[];
  objectives: string[];
  kpis: string[];
  active: boolean;
  createdAt: string;
}

// ─── NEW: ApprovalWorkflow ───────────────────────────────────

export interface ApprovalWorkflow {
  id: string;
  publicationId: string;
  steps: ApprovalWorkflowStep[];
  currentStep: number;
  status: "pending" | "in_progress" | "completed" | "rejected";
  completedSteps: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── NEW: CampaignRetrospective ──────────────────────────────

export interface CampaignRetrospective {
  id: string;
  campaignId: string;
  summary: string;
  whatWorked: string[];
  whatDidntWork: string[];
  lessonsLearned: string[];
  recommendations: string[];
  metrics: CampaignAnalytics;
  createdAt: string;
}
