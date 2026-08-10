# Social OS — Analytics Model

## Analytics Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    ANALYTICS PIPELINE                     │
│                                                          │
│  Postiz API ──► Social OS ──► Analytics Store ──► GitHub OS│
│                                                          │
│  Collection points:                                      │
│  • 24 hours after publish                                │
│  • 7 days after publish                                  │
│  • 30 days after publish                                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Metrics Schema

### Publication Metrics

```typescript
interface PublicationMetrics {
  publicationId: string;
  collectedAt: DateTime;
  platformMetrics: Map<Platform, PlatformMetrics>;
  aggregatedMetrics: AggregatedMetrics;
}
```

### Platform Metrics

```typescript
interface PlatformMetrics {
  platform: string;
  impressions: number;
  reach: number;
  engagement: number;
  engagementRate: number;
  clicks: number;
  shares: number;
  comments: number;
  likes: number;
  saves: number;
  videoViews?: number;
  videoWatchTime?: number;
}
```

### Aggregated Metrics

```typescript
interface AggregatedMetrics {
  totalImpressions: number;
  totalReach: number;
  totalEngagement: number;
  averageEngagementRate: number;
  topPlatform: string;
  topContent: string;
  bestPerformingFormat: string;
}
```

## Analytics Dimensions

### By Platform

| Platform  | Key Metrics                                            |
| --------- | ------------------------------------------------------ |
| LinkedIn  | Impressions, clicks, shares, comments, follower growth |
| X         | Impressions, engagements, retweets, likes, replies     |
| GitHub    | Stars, forks, views, clones, issues                    |
| YouTube   | Views, watch time, subscribers, likes, comments        |
| Instagram | Reach, saves, shares, comments, profile visits         |
| Facebook  | Reach, reactions, shares, comments, clicks             |

### By Content Type

| Content Type      | Metrics                                  |
| ----------------- | ---------------------------------------- |
| Knowledge Package | Downloads, engagement, educator adoption |
| Blog Post         | Views, read time, shares, comments       |
| Announcement      | Reach, engagement, click-through         |
| Carousel          | Swipes, saves, shares                    |
| Video             | Views, watch time, completion rate       |

### By Time

| Time Dimension | Analysis           |
| -------------- | ------------------ |
| Hour of day    | Best posting times |
| Day of week    | Best posting days  |
| Month          | Seasonal trends    |
| Quarter        | Long-term growth   |

## Analytics Feedback to GitHub OS

### Social Intelligence Domain

GitHub OS maintains a Social Intelligence research domain:

```json
{
  "domain": "social-intelligence",
  "data": {
    "bestPostingTimes": {
      "linkedin": { "best": "Tue-Thu 8-10 AM", "avoid": "Weekends" },
      "x": { "best": "Mon-Fri 9 AM, 12 PM", "avoid": "Late night" },
      "instagram": { "best": "Mon-Fri 11 AM-1 PM", "avoid": "Sunday" }
    },
    "contentPerformance": {
      "educational": { "avgEngagement": 4.2, "bestPlatform": "linkedin" },
      "announcement": { "avgEngagement": 2.8, "bestPlatform": "x" },
      "visual": { "avgEngagement": 5.1, "bestPlatform": "instagram" }
    },
    "audienceInsights": {
      "peakActivityHours": [9, 12, 17],
      "preferredContentTypes": ["educational", "behind-the-scenes"],
      "engagementPatterns": { ... }
    }
  }
}
```

## Weekly Analytics Report

Every Monday, Social OS generates a weekly report:

```markdown
# Social OS Weekly Report — Week 32, 2026

## Summary

- Total posts published: 12
- Total impressions: 45,230
- Total engagement: 1,847
- Average engagement rate: 4.1%

## Top Performing Posts

1. "KP-001: How LLMs Work" (LinkedIn) — 12,450 impressions, 5.2% engagement
2. "Forest Mission Update" (X) — 8,320 impressions, 4.8% engagement

## Platform Breakdown

| Platform | Posts | Impressions | Engagement |
| -------- | ----- | ----------- | ---------- |
| LinkedIn | 4     | 22,100      | 890        |
| X        | 5     | 15,330      | 612        |
| GitHub   | 3     | 7,800       | 345        |

## Recommendations

1. Post more educational content on LinkedIn (highest engagement)
2. Increase X posting frequency (good engagement, low volume)
3. Add Instagram carousel format (visual content performs well)

## Feedback to GitHub OS

- Best posting time: Tuesday 9 AM
- Top content type: Educational (5.2% avg engagement)
- Audience prefers: Long-form LinkedIn articles
```

## Data Retention

| Data                 | Retention  |
| -------------------- | ---------- |
| Publication metrics  | 2 years    |
| Aggregated analytics | 5 years    |
| Raw API responses    | 30 days    |
| Weekly reports       | Indefinite |
| Trend data           | 1 year     |
