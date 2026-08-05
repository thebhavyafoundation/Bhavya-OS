# Social OS v2 — Editorial Calendar

## Overview

The Editorial Calendar is the canonical publication planner for Bhavya Foundation. It manages scheduling across all channels.

## Supported Entry Types

| Type                 | Description               |
| -------------------- | ------------------------- |
| knowledge_package    | Knowledge Package content |
| website_article      | Website articles          |
| blog                 | Blog posts                |
| github_release       | GitHub releases           |
| linkedin_post        | LinkedIn posts            |
| x_post               | X (Twitter) posts         |
| instagram_post       | Instagram posts           |
| youtube_video        | YouTube videos            |
| newsletter           | Newsletter editions       |
| event                | Events                    |
| workshop             | Workshops                 |
| hackathon            | Hackathons                |
| mentor_session       | Mentor sessions           |
| community_discussion | Community discussions     |

## Calendar Status Flow

```
draft → scheduled → in_progress → published → completed
```

## API

### Create Entry

```http
POST /api/calendar
{
  "action": "create",
  "campaignId": "...",
  "type": "linkedin_post",
  "title": "KP-001 Launch — LinkedIn",
  "platforms": ["linkedin"],
  "scheduledDate": "2026-08-10T10:00:00Z"
}
```

### Get Upcoming

```http
GET /api/calendar?action=upcoming&days=7
```

### Get Stats

```http
GET /api/calendar?action=stats
```

## Stats Response

```json
{
  "total": 15,
  "draft": 3,
  "scheduled": 5,
  "published": 5,
  "completed": 2,
  "thisWeek": 4,
  "thisMonth": 12
}
```
