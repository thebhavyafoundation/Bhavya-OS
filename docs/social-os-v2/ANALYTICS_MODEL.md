# Social OS v2 — Analytics Model

## Overview

Social OS v2 tracks institutional metrics across five categories: trust, participation, growth, educational, and mission.

## Metric Categories

### Trust

- Trust Score (0-100)
- Brand Compliance Rate
- Constitutional Compliance Rate
- Community Sentiment

### Participation

- Total Publications
- Published Content
- Community Contributors
- Active Campaigns

### Growth

- Total Impressions
- Total Reach
- GitHub Stars
- Newsletter Subscribers
- Institution Growth

### Educational

- Knowledge Package Views
- Lesson Starts
- Lesson Completion
- Project Starts
- Portfolio Generated
- Student Conversion Rate

### Mission

- Mentors Active
- Volunteers Engaged
- Donors Contributing
- Institutions Reached

## Platform Metrics

Per-platform engagement tracking:

- Impressions
- Reach
- Engagement
- Clicks
- Shares
- Comments
- Likes

## Campaign Analytics

Campaign-level metrics:

- Total Publications
- Published Count
- Total Impressions
- Total Reach
- Total Engagement
- Total Clicks
- Platform Breakdown
- Audience Growth
- Conversion Rate

## API

### Get Institution Pulse

```http
GET /api/pulse
```

### Collect Metrics

```http
POST /api/pulse
{
  "action": "collect-metrics"
}
```

### Get Campaign Analytics

```http
GET /api/campaigns?action=analytics&id=...
```

## Institution Pulse Response

```json
{
  "institutionPulse": {
    "trust": { "score": 75, "trend": "up", "metrics": [] },
    "participation": { "score": 60, "trend": "up", "metrics": [] },
    "growth": { "score": 50, "trend": "stable", "metrics": [] },
    "educational": { "score": 40, "trend": "stable", "metrics": [] },
    "mission": { "score": 55, "trend": "up", "metrics": [] },
    "overall": 56
  }
}
```
