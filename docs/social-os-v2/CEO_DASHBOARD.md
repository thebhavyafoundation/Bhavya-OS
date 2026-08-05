# Social OS v2 — CEO Dashboard

## Overview

The CEO Dashboard is the institutional command center for Bhavya Foundation. It provides a single view of all communication activities, campaign performance, community intelligence, and mission metrics.

## Dashboard Sections

### 1. Institution Pulse

Five-category health score:

- **Overall** — Aggregate score (0-100)
- **Trust** — Brand compliance, sentiment, community trust
- **Participation** — Publications, contributors, active campaigns
- **Growth** — Impressions, reach, subscribers, GitHub stars
- **Educational** — KP views, lesson starts, completion rates
- **Mission** — Mentors, volunteers, donors, institutional reach

### 2. Mission Metrics

Key institutional indicators:

- Trust Score
- Community Contributors
- Mentors Active
- Institution Growth

### 3. Platform Analytics

Cross-platform engagement:

- Total Publications
- Published Content
- Total Impressions
- Total Engagement

### 4. Active Campaigns

Currently running campaigns with status badges.

### 5. Editorial Calendar

Upcoming scheduled content:

- Draft count
- Scheduled count
- Published count
- This week / This month

### 6. Pending Approvals

Publications awaiting human review.

### 7. Constitution Compliance

Brand review results and compliance status.

### 8. Community Intelligence

Feedback analytics:

- Total Feedback
- Average Sentiment
- Knowledge Gaps
- Product Requests

### 9. GitHub OS Insights

Repository social impact metrics.

### 10. Communication Loop

Loop status:

- Active Campaigns
- Pending Publications
- Pending Approvals
- Unprocessed Events

### 11. Recent Publications

Latest published content with status.

### 12. Recent Events

Latest system events.

## Access

```
GET /ceo
```

## Architecture

The CEO Dashboard is a server-rendered Next.js page that:

1. Queries all data sources in parallel
2. Renders with inline styles (no external dependencies)
3. Uses Bhavya Foundation brand colors
4. Provides real-time institutional intelligence
