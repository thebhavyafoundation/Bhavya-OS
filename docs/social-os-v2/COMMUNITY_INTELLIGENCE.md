# Social OS v2 — Community Intelligence

## Overview

Community Intelligence collects and classifies feedback from all channels into actionable institutional intelligence.

## Feedback Sources

| Source   | Description                |
| -------- | -------------------------- |
| website  | Website feedback           |
| github   | GitHub issues, discussions |
| discord  | Discord discussions        |
| linkedin | LinkedIn comments          |
| x        | X replies and mentions     |
| email    | Email feedback             |
| direct   | Direct communication       |

## Classification Categories

| Category               | Description                  | Keywords                                  |
| ---------------------- | ---------------------------- | ----------------------------------------- |
| knowledge_gap          | Missing or unclear content   | "don't understand", "confused", "unclear" |
| curriculum_improvement | Curriculum suggestions       | "curriculum", "syllabus", "course"        |
| product_improvement    | Product bug/feature requests | "bug", "error", "fix", "feature"          |
| community_request      | Community engagement ideas   | "community", "discuss", "meetup"          |
| research_opportunity   | Research directions          | "research", "paper", "study"              |
| general                | Unclassified feedback        | —                                         |

## Sentiment Analysis

Each feedback item receives a sentiment score from 0 (negative) to 1 (positive):

- Positive keywords: great, awesome, excellent, love, helpful
- Negative keywords: bad, terrible, hate, confusing, broken

## API

### Submit Feedback

```http
POST /api/feedback
{
  "action": "submit",
  "source": "github",
  "content": "The KP-001 lesson on transformers was unclear",
  "author": "student123"
}
```

### Get Intelligence

```http
GET /api/feedback?action=intelligence
```

### Response

```json
{
  "total": 45,
  "byClassification": {
    "knowledge_gap": 12,
    "curriculum_improvement": 8,
    "product_improvement": 15,
    "community_request": 5,
    "research_opportunity": 3,
    "general": 2
  },
  "bySource": {
    "github": 20,
    "discord": 15,
    "linkedin": 10
  },
  "averageSentiment": 0.72,
  "topKnowledgeGaps": [
    { "content": "Transformer attention mechanism unclear", "count": 5 }
  ]
}
```

## Intelligence Feed

All classified intelligence is fed into GitHub OS for institutional learning.
