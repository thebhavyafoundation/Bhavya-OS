export type ObjectiveStatus = 'not_started' | 'on_track' | 'at_risk' | 'behind' | 'completed';
export type KeyResultStatus = 'not_started' | 'on_track' | 'at_risk' | 'behind' | 'completed';
export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';
export type RiskStatus = 'open' | 'mitigated' | 'closed' | 'accepted';
export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';
export type DepartmentType = 'engineering' | 'education' | 'content' | 'community' | 'governance' | 'operations';
export type ReviewPeriod = 'weekly' | 'monthly' | 'quarterly';
export type SystemName = 'github_os' | 'knowledge_studio' | 'ai_institute' | 'website' | 'social_os' | 'constitution_sdk' | 'content_factory' | 'curriculum_intelligence' | 'institution_os';
export type HealthStatus = 'healthy' | 'degraded' | 'down' | 'unknown';

// ─── Institution ─────────────────────────────────────────────

export interface Institution {
  id: string;
  name: string;
  mission: string;
  vision: string;
  departments: Department[];
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  type: DepartmentType;
  head?: string;
  objectives: string[];
}

// ─── Mission & Objectives ────────────────────────────────────

export interface Mission {
  id: string;
  statement: string;
  pillars: MissionPillar[];
  active: boolean;
  createdAt: string;
}

export interface MissionPillar {
  id: string;
  name: string;
  description: string;
  targetMetrics: string[];
}

// ─── OKR Engine ──────────────────────────────────────────────

export interface Objective {
  id: string;
  title: string;
  description: string;
  department?: DepartmentType;
  quarter: string;
  status: ObjectiveStatus;
  progress: number;
  keyResults: KeyResult[];
  initiatives: Initiative[];
  createdAt: string;
  updatedAt: string;
}

export interface KeyResult {
  id: string;
  objectiveId: string;
  title: string;
  description: string;
  metric: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  status: KeyResultStatus;
}

export interface Initiative {
  id: string;
  objectiveId: string;
  title: string;
  description: string;
  projects: Project[];
  status: 'planning' | 'active' | 'completed';
}

export interface Project {
  id: string;
  initiativeId: string;
  title: string;
  description: string;
  tasks: Task[];
  status: 'todo' | 'in_progress' | 'done';
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  assignee?: string;
}

// ─── Milestones ──────────────────────────────────────────────

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'upcoming' | 'achieved' | 'missed';
  relatedObjectiveId?: string;
}

// ─── Operational Health ──────────────────────────────────────

export interface SystemHealth {
  system: SystemName;
  status: HealthStatus;
  lastChecked: string;
  apiAvailable: boolean;
  dashboardAvailable: boolean;
  metricsAvailable: boolean;
  eventsProduced: number;
  eventsConsumed: number;
  notes?: string;
}

export interface OperationalHealth {
  overall: HealthStatus;
  systems: SystemHealth[];
  checkedAt: string;
}

// ─── Institution KPI ─────────────────────────────────────────

export interface InstitutionKPI {
  id: string;
  name: string;
  category: 'mission' | 'growth' | 'education' | 'community' | 'technical' | 'financial' | 'risk' | 'operations';
  value: number;
  unit: string;
  target?: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  period: string;
  source: SystemName;
  collectedAt: string;
}

// ─── Risk ────────────────────────────────────────────────────

export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  status: RiskStatus;
  category: string;
  mitigation?: string;
  owner?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Decision ────────────────────────────────────────────────

export interface Decision {
  id: string;
  title: string;
  description: string;
  context: string;
  options: string[];
  selectedOption?: string;
  rationale?: string;
  decidedBy?: string;
  decidedAt?: string;
  status: 'proposed' | 'decided' | 'implemented';
}

// ─── Action Item ─────────────────────────────────────────────

export type ActionPriority = 'low' | 'normal' | 'medium' | 'high' | 'urgent' | 'critical';
export type ActionStatus = 'pending' | 'in-progress' | 'completed';

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  type?: string;
  assignee?: string;
  owner?: string;
  dueDate?: string;
  priority: ActionPriority;
  status: ActionStatus;
  linkedRiskId?: string;
  relatedObjectiveId?: string;
  completedAt?: string;
  result?: string;
  createdAt: string;
}

// ─── Weekly Review ───────────────────────────────────────────

export interface WeeklyReview {
  id: string;
  weekStart: string;
  weekEnd: string;
  period: ReviewPeriod;
  summary: {
    knowledgeProduction: string;
    publishing: string;
    community: string;
    technical: string;
    mission: string;
  };
  metrics: InstitutionKPI[];
  risks: Risk[];
  actionItems: ActionItem[];
  nextWeekPlan: string[];
  status: 'draft' | 'final';
  createdAt: string;
}

// ─── Operational Alert ───────────────────────────────────────

export interface OperationalAlert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
  source: SystemName;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  createdAt: string;
}

// ─── Cross-System Event ──────────────────────────────────────

export interface InstitutionEvent {
  id: string;
  type: string;
  source: SystemName;
  payload: Record<string, any>;
  createdAt: string;
  aggregated: boolean;
}

// ─── Production ───────────────────────────────────────────────

export type KPStatus = 'draft' | 'in-review' | 'approved' | 'published';
export type MediaAssetType = 'article' | 'video' | 'carousel' | 'infographic';
export type ProductionStage = 'research' | 'writing' | 'review' | 'design' | 'media' | 'publishing';

export interface ContentKnowledgePackage {
  id: string;
  title: string;
  level: string;
  domain: string;
  status: KPStatus;
  stage: ProductionStage;
  assignee?: string;
  dueDate?: string;
  publishedAt?: string;
  concepts: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaAsset {
  id: string;
  kpId: string;
  type: MediaAssetType;
  title: string;
  status: KPStatus;
  platform?: string;
  createdAt: string;
}

export interface ProductionMetrics {
  completed: number;
  inReview: number;
  velocity: number;
  byLevel: Record<string, number>;
  byStage: Record<string, number>;
  mediaBreakdown: { articles: number; videos: number; carousels: number };
  publishingQueue: number;
  communityRequests: number;
  studentFeedbackAvg: number;
  upcomingReleases: ContentKnowledgePackage[];
  bottleneck: string;
  missionProgress: number;
}

// ─── Executive Scorecard ─────────────────────────────────────

export interface ExecutiveScorecard {
  institutionHealth: OperationalHealth;
  missionProgress: number;
  okrProgress: { objective: string; progress: number; status: ObjectiveStatus }[];
  systemHealth: SystemHealth[];
  activeAlerts: OperationalAlert[];
  openRisks: Risk[];
  pendingDecisions: Decision[];
  upcomingMilestones: Milestone[];
  weeklyMetrics: InstitutionKPI[];
  overallScore: number;
}
