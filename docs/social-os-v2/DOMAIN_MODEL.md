# Social OS v2 — Domain Model

## Extended Entities

Social OS v2 extends the v1 domain model with 13 new entities. No existing entities were replaced.

### Existing (preserved)

- Publication
- Platform
- PlatformContent
- ApprovalRecord
- ContentSource
- AnalyticsSnapshot
- MediaAsset
- SocialAccount
- PublishingProvider

### New Entities

#### Campaign

Central operational entity. Every publication belongs to one campaign.

```
Campaign {
  id: UUID
  name: string
  description: string
  type: CampaignType
  status: CampaignStatus
  knowledgePackageId?: string
  objectives: CommunicationObjective[]
  audience: AudienceSegment[]
  assets: CommunicationAsset[]
  channels: CommunicationChannel[]
  schedule: EditorialCalendarEntry[]
  approvals: ApprovalWorkflow[]
  publications: string[]
  metrics: CampaignAnalytics
  retrospective?: CampaignRetrospective
  startDate?: string
  endDate?: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### EditorialCalendarEntry

Canonical publication planner across all channels.

```
EditorialCalendarEntry {
  id: UUID
  campaignId?: string
  type: CalendarEntryType
  title: string
  description: string
  platforms: PlatformType[]
  scheduledDate: DateTime
  status: CalendarStatus
  publicationId?: string
}
```

#### CommunicationObjective

Measurable goals for each campaign.

```
CommunicationObjective {
  id: UUID
  campaignId: string
  description: string
  targetMetric: string
  targetValue: number
  currentValue: number
  unit: string
}
```

#### AudienceSegment

Target audiences for campaigns.

```
AudienceSegment {
  id: UUID
  name: string
  type: AudienceType
  size: number
  growthRate: number
  engagementRate: number
  channels: CommunicationChannel[]
}
```

#### CommunicationAsset

Assets managed within campaigns.

```
CommunicationAsset {
  id: UUID
  campaignId: string
  name: string
  type: AssetType
  url: string
  content?: string
  metadata: Record<string, any>
}
```

#### BrandReview

Automated brand consistency validation.

```
BrandReview {
  id: UUID
  publicationId: string
  reviewedAt: DateTime
  passed: boolean
  brandNameCorrect: boolean
  taglinePresent: boolean
  colorPaletteConsistent: boolean
  toneConsistent: boolean
  issues: string[]
}
```

#### CommunityFeedback

Classified community input from all channels.

```
CommunityFeedback {
  id: UUID
  source: FeedbackSource
  classification: FeedbackClassification
  content: string
  author?: string
  url?: string
  sentiment: number
  knowledgePackageId?: string
  campaignId?: string
  processedAt?: DateTime
}
```

#### CampaignAnalytics

Campaign-level engagement metrics.

```
CampaignAnalytics {
  campaignId: string
  totalPublications: number
  publishedCount: number
  totalImpressions: number
  totalReach: number
  totalEngagement: number
  totalClicks: number
  platformBreakdown: Record<PlatformType, PlatformMetrics>
  audienceGrowth: number
  conversionRate: number
}
```

#### InstitutionMetric

Institutional-level metrics.

```
InstitutionMetric {
  id: UUID
  name: string
  category: 'trust' | 'participation' | 'growth' | 'educational' | 'mission'
  value: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  changePercent: number
  period: string
}
```

#### CommunicationStrategy

Reusable communication patterns.

```
CommunicationStrategy {
  id: UUID
  name: string
  description: string
  channels: CommunicationChannel[]
  frequency: string
  audience: AudienceType[]
  objectives: string[]
  kpis: string[]
  active: boolean
}
```

#### ApprovalWorkflow

Multi-step approval process.

```
ApprovalWorkflow {
  id: UUID
  publicationId: string
  steps: ApprovalWorkflowStep[]
  currentStep: number
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  completedSteps: string[]
}
```

#### CampaignRetrospective

Post-campaign learning capture.

```
CampaignRetrospective {
  id: UUID
  campaignId: string
  summary: string
  whatWorked: string[]
  whatDidntWork: string[]
  lessonsLearned: string[]
  recommendations: string[]
  metrics: CampaignAnalytics
}
```

#### PublishingWindow

Optimal publishing time slots.

```
PublishingWindow {
  id: UUID
  dayOfWeek: number
  startTime: string
  endTime: string
  platforms: PlatformType[]
  timezone: string
}
```

## Relationships

```
Campaign 1──* CommunicationObjective
Campaign 1──* AudienceSegment
Campaign 1──* CommunicationAsset
Campaign 1──* EditorialCalendarEntry
Campaign 1──* ApprovalWorkflow
Campaign 1──* Publication (via campaign_id)
Campaign 1──1 CampaignAnalytics
Campaign 1──1 CampaignRetrospective
Publication 1──* BrandReview
Publication 1──* AnalyticsSnapshot
CommunityFeedback *──1 Campaign (optional)
CommunityFeedback *──1 Publication (optional)
```
