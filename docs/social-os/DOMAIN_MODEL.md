# Social OS — Domain Model

## Entities

### Publication

The central entity. Represents a single piece of content to be published across one or more platforms.

```
Publication {
  id: UUID
  title: string
  content: string
  platformContent: Map<Platform, PlatformContent>
  status: PublicationStatus
  priority: Priority
  source: ContentSource
  scheduledAt: DateTime?
  publishedAt: DateTime?
  approval: ApprovalRecord?
  analytics: AnalyticsSnapshot?
  metadata: PublicationMetadata
}
```

### Platform

Represents a social media platform connected through Postiz.

```
Platform {
  id: string (e.g., "linkedin", "x", "github")
  name: string
  integrationId: string (Postiz integration ID)
  constraints: PlatformConstraints
  isActive: boolean
}
```

### PlatformContent

Platform-specific formatting of a publication.

```
PlatformContent {
  platform: Platform
  text: string
  media: MediaAsset[]
  hashtags: string[]
  mentions: string[]
  characterCount: number
  isWithinLimits: boolean
}
```

### ApprovalRecord

Tracks the human approval lifecycle.

```
ApprovalRecord {
  id: UUID
  publicationId: UUID
  requestedBy: string (system)
  requestedAt: DateTime
  reviewedBy: string?
  reviewedAt: DateTime?
  status: ApprovalStatus (pending | approved | rejected | edited)
  notes: string?
}
```

### ContentSource

Traces back to the originating content.

```
ContentSource {
  type: "knowledge_package" | "blog" | "announcement" | "community"
  knowledgePackageId: string?
  version: string?
  reviewStatus: string?
  constitutionCitation: string?
}
```

### AnalyticsSnapshot

Engagement metrics collected after publishing.

```
AnalyticsSnapshot {
  publicationId: UUID
  collectedAt: DateTime
  metrics: Map<Platform, PlatformMetrics>
}
```

### PlatformMetrics

Per-platform engagement data.

```
PlatformMetrics {
  impressions: number
  reach: number
  engagement: number
  clicks: number
  shares: number
  comments: number
  likes: number
}
```

## Enums

### PublicationStatus

```
draft → pending_approval → approved → scheduling → publishing → published → analytics_collected
                       ↘ rejected
                       ↘ edited → pending_approval
```

### Priority

```
low | normal | high | urgent
```

### ApprovalStatus

```
pending | approved | rejected | edited
```

## Value Objects

### MediaAsset

```
MediaAsset {
  url: string
  type: "image" | "video" | "document"
  altText: string?
  platformOptimizations: Map<Platform, MediaOptimization>
}
```

### PublicationMetadata

```
PublicationMetadata {
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: string
  version: number
  tags: string[]
  campaign: string?
}
```

## Relationships

```
Publication 1──* PlatformContent
Publication 1──1 ApprovalRecord
Publication 1──1 ContentSource
Publication 1──1 AnalyticsSnapshot
Platform 1──* PlatformContent
PlatformContent *──1 Platform
```
