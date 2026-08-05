# Social OS v2 — Campaign Engine

## Overview

The Campaign Engine is the primary operational entity of Social OS v2. Every publication belongs to a campaign. Campaigns own objectives, audience, assets, schedule, approvals, publishing, metrics, and retrospective.

## Campaign Lifecycle

```
planning → active → completed → retrospective
         ↘ paused
```

## Campaign Types

| Type               | Description                    |
| ------------------ | ------------------------------ |
| knowledge_launch   | Launch a new Knowledge Package |
| community_building | Build community engagement     |
| institution_growth | Grow institutional presence    |
| educational        | Educational content campaigns  |
| announcement       | Official announcements         |
| ongoing            | Continuous content streams     |

## Campaign Structure

Each campaign owns:

- **Objectives** — Measurable goals with target metrics
- **Audience** — Target segments with size and engagement
- **Assets** — Communication assets (text, image, video, document)
- **Schedule** — Editorial calendar entries
- **Approvals** — Multi-step approval workflows
- **Publications** — Linked publications
- **Metrics** — Campaign-level analytics
- **Retrospective** — Post-campaign learning

## Example: KP-001 Launch Campaign

```
Campaign: KP-001 Launch
  Type: knowledge_launch
  Knowledge Package: KP-001-How-Large-Language-Models-Work

  Objectives:
    - Reach 1000 impressions on LinkedIn
    - Get 50 engagement interactions
    - Achieve 100 website visits

  Audience:
    - Students (size: 500, channels: [linkedin, x])
    - Mentors (size: 50, channels: [linkedin])
    - Contributors (size: 20, channels: [github])

  Channels:
    - Website article
    - GitHub release
    - LinkedIn post
    - X post
    - YouTube video
    - Instagram post
    - Newsletter
    - Discord discussion

  Publications:
    - pub_001 (LinkedIn)
    - pub_002 (X)
    - pub_003 (Website)
    - ...

  Metrics:
    - Total Impressions: 1,234
    - Total Engagement: 89
    - Total Clicks: 45
```

## API

### Create Campaign

```http
POST /api/campaigns
{
  "action": "create",
  "name": "KP-001 Launch",
  "type": "knowledge_launch",
  "knowledgePackageId": "kp-001",
  "channels": ["linkedin", "x", "website", "github"]
}
```

### Add Objective

```http
POST /api/campaigns
{
  "action": "add-objective",
  "campaignId": "...",
  "description": "Reach 1000 impressions",
  "targetMetric": "impressions",
  "targetValue": 1000,
  "unit": "impressions"
}
```

### Add Audience

```http
POST /api/campaigns
{
  "action": "add-audience",
  "campaignId": "...",
  "name": "Students",
  "type": "students",
  "size": 500,
  "channels": ["linkedin", "x"]
}
```

### Get Campaign Analytics

```http
GET /api/campaigns?action=analytics&id=...
```
