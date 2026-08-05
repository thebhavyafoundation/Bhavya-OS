# IOC Integration — Production Era v1.0

**Document:** IOC-INT-001
**Version:** 1.0
**Status:** Active
**Effective:** 2026-08-05
**Authority:** IOC Architecture

---

## 1. Overview

The Institution Operations Center (IOC) is the executive command center for Bhavya Foundation. This document defines how IOC integrates with the production pipeline, including dashboards, tracking, quality gates, metrics collection, event integration, health checks, and API endpoints.

**Core Principle:** IOC owns NO business logic. It orchestrates, visualizes, coordinates, and triggers workflows across every Bhavya system. Executive layer only.

---

## 2. Production Dashboard in IOC

### 2.1 Dashboard Location

```
/dashboard/production
```

### 2.2 Dashboard Structure

```
Production Dashboard (Primary)
├── Overview Panel (top row)
│   ├── Total Assets This Week (big number, trend arrow)
│   ├── KP Quality Score (gauge chart)
│   ├── Production Velocity (sparkline)
│   └── Active Alerts (count, severity colors)
│
├── Production Panel (left column)
│   ├── Weekly Production Trend (line chart, 12 weeks)
│   ├── Asset Type Breakdown (stacked bar)
│   ├── Curriculum Progress (by-level heatmap)
│   └── Domain Distribution (pie chart)
│
├── Quality Panel (center column)
│   ├── Quality Score Trend (line chart, 12 weeks)
│   ├── Gate Pass Funnel (funnel chart)
│   ├── Revision/Rejection Rates (bar chart)
│   └── Review Time by Stage (box plot)
│
├── Velocity Panel (right column)
│   ├── Velocity Trend (line chart, 12 weeks)
│   ├── Cycle Time Distribution (histogram)
│   ├── Bottleneck Analysis (horizontal bar)
│   └── Throughput Trend (line chart)
│
└── Impact Panel (bottom row)
    ├── Student Readiness (by-level bars)
    ├── Industry Coverage (grid)
    ├── Mission Progress (milestone timeline)
    ├── Community Requests (backlog chart)
    └── Student Feedback (satisfaction trend)
```

### 2.3 Dashboard Panels

#### Overview Panel

| Metric | Display | Refresh |
|--------|---------|---------|
| Total Assets This Week | Big number with trend arrow | Real-time (5s) |
| KP Quality Score | Gauge chart (0-5) | Per KP review |
| Production Velocity | Sparkline (12 weeks) | Daily |
| Active Alerts | Count with severity colors | Real-time (event) |

#### Production Panel

| Metric | Display | Refresh |
|--------|---------|---------|
| Weekly Production Trend | Line chart (12 weeks) | Daily |
| Asset Type Breakdown | Stacked bar | Daily |
| Curriculum Progress | By-level heatmap | Weekly |
| Domain Distribution | Pie chart | Weekly |

#### Quality Panel

| Metric | Display | Refresh |
|--------|---------|---------|
| Quality Score Trend | Line chart (12 weeks) | Per review |
| Gate Pass Funnel | Funnel chart | Per KP |
| Revision/Rejection Rates | Bar chart | Weekly |
| Review Time by Stage | Box plot | Per review |

#### Velocity Panel

| Metric | Display | Refresh |
|--------|---------|---------|
| Velocity Trend | Line chart (12 weeks) | Weekly |
| Cycle Time Distribution | Histogram | Per KP |
| Bottleneck Analysis | Horizontal bar | Weekly |
| Throughput Trend | Line chart | Weekly |

#### Impact Panel

| Metric | Display | Refresh |
|--------|---------|---------|
| Student Readiness | By-level bars | Weekly |
| Industry Coverage | Grid | Monthly |
| Mission Progress | Milestone timeline | Monthly |
| Community Requests | Backlog chart | Weekly |
| Student Feedback | Satisfaction trend | Monthly |

### 2.4 Filter Controls

- **Time Range:** Last 7 days | Last 30 days | Last quarter | Last year | Custom
- **Domain:** All | AI | Data Science | Web Dev | Cybersecurity | Cloud
- **Level:** All | L0 | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8
- **Metric Category:** All | Production | Quality | Impact | Velocity

---

## 3. KP Tracking in IOC

### 3.1 KP Status Tracking

IOC tracks the status of every Knowledge Package through the production pipeline:

| Status | Description | IOC Display |
|--------|-------------|-------------|
| `draft` | KP being authored | Yellow dot |
| `structural-review` | Automated validation running | Blue dot |
| `content-review` | Human content review | Blue dot |
| `domain-review` | Domain expert review | Blue dot |
| `founder-review` | Founder approval pending | Orange dot |
| `published` | KP live in production | Green dot |
| `archived` | KP retired/removed | Gray dot |

### 3.2 KP Lifecycle Dashboard

```
KP Lifecycle (/dashboard/production/kp-lifecycle)
├── Pipeline Status
│   ├── Draft: [count]
│   ├── In Review: [count]
│   ├── Published: [count]
│   └── Archived: [count]
│
├── KP Details
│   ├── KP ID
│   ├── Title
│   ├── Domain
│   ├── Level
│   ├── Quality Score
│   ├── Gate Status (all 10 gates)
│   └── Timeline (created → published)
│
└── KP Analytics
    ├── Views
    ├── Downloads
    ├── Engagement
    └── Feedback
```

### 3.3 KP Pipeline Visualization

```
KP Pipeline (/dashboard/production/kp-pipeline)
├── Stage 1: Research
│   ├── Input: Topic assignment
│   ├── Output: Research report
│   ├── Status: [count] pending, [count] complete
│   └── Avg Duration: [hours]
│
├── Stage 2: Authoring
│   ├── Input: Research report
│   ├── Output: Draft KP
│   ├── Status: [count] pending, [count] complete
│   └── Avg Duration: [hours]
│
├── Stage 3: Technical Review
│   ├── Input: Draft KP
│   ├── Output: Technical review report
│   ├── Status: [count] pending, [count] complete
│   └── Avg Duration: [hours]
│
├── Stage 4: Educational Review
│   ├── Input: Technically-reviewed KP
│   ├── Output: Educational review report
│   ├── Status: [count] pending, [count] complete
│   └── Avg Duration: [hours]
│
├── Stage 5: Founder Review
│   ├── Input: Educationally-reviewed KP
│   ├── Output: Approval/rejection
│   ├── Status: [count] pending, [count] complete
│   └── Avg Duration: [hours]
│
├── Stage 6: Publication
│   ├── Input: Approved KP
│   ├── Output: Published KP
│   ├── Status: [count] pending, [count] complete
│   └── Avg Duration: [hours]
│
└── Stage 7: Distribution
    ├── Input: Published KP
    ├── Output: Multi-channel distribution
    ├── Status: [count] pending, [count] complete
    └── Avg Duration: [hours]
```

---

## 4. Quality Gates in IOC

### 4.1 Gate Status Dashboard

```
Quality Gates (/dashboard/quality/gates)
├── Gate Overview
│   ├── Gate 1: Educational Quality [pass/fail, score]
│   ├── Gate 2: Technical Accuracy [pass/fail, score]
│   ├── Gate 3: Constitution Compliance [pass/fail, score]
│   ├── Gate 4: BEE 2.0 Compliance [pass/fail, score]
│   ├── Gate 5: Citation Quality [pass/fail, score]
│   ├── Gate 6: Learning Outcomes [pass/fail, score]
│   ├── Gate 7: Project Quality [pass/fail, score]
│   ├── Gate 8: Assessment Quality [pass/fail, score]
│   ├── Gate 9: Portfolio Value [pass/fail, score]
│   └── Gate 10: Media Completeness [pass/fail, score]
│
├── Composite Score
│   ├── Current: [score]/10
│   ├── Target: >= 7.0
│   └── Trend: [up/down/stable]
│
└── Gate History
    ├── First-pass rate: [percentage]
    ├── Average attempts: [number]
    └── Common failures: [list]
```

### 4.2 Gate Alert Rules

| Gate | Alert Condition | Severity | Notification |
|------|----------------|----------|-------------|
| Any mandatory gate (1-5) fails | Score < 6.0 | CRITICAL | Slack + Email |
| Composite score < 7.0 | Score below threshold | WARNING | Slack |
| First-pass rate < 70% | Below target | WARNING | Slack |
| Review time exceeds target | Stage > 1.5x target | WARNING | Slack |
| Gate failure rate > 30% | High failure rate | CRITICAL | Slack + Email |

### 4.3 Gate Metrics in IOC

| Metric | IOC Endpoint | Refresh |
|--------|-------------|---------|
| Gate pass rate (first attempt) | `/api/quality/gates/pass-rate` | Per KP |
| Average composite score | `/api/quality/gates/composite-score` | Per KP |
| Gate failure distribution | `/api/quality/gates/failure-dist` | Weekly |
| Review time by stage | `/api/quality/gates/review-time` | Per review |
| Remediation success rate | `/api/quality/gates/remediation` | Monthly |

---

## 5. Metrics Collection in IOC

### 5.1 Production Metrics

| Metric ID | Metric | IOC Endpoint | Collection |
|-----------|--------|-------------|------------|
| PROD-001 | Curriculum Completion % | `/api/production/curriculum` | Daily |
| PROD-002 | KPs Produced | `/api/production/kps` | Daily |
| PROD-003 | Lessons Produced | `/api/production/lessons` | Daily |
| PROD-004 | Labs Produced | `/api/production/labs` | Daily |
| PROD-005 | Projects Produced | `/api/production/projects` | Daily |
| PROD-006 | Assessments Produced | `/api/production/assessments` | Daily |
| PROD-007 | Articles Produced | `/api/production/articles` | Daily |
| PROD-008 | Videos Produced | `/api/production/videos` | Daily |
| PROD-009 | Carousels Produced | `/api/production/carousels` | Daily |
| PROD-010 | Newsletter Editions | `/api/production/newsletter` | Weekly |
| PROD-011 | Portfolio Artifacts | `/api/production/portfolios` | Daily |
| PROD-012 | Open Source Projects | `/api/production/opensource` | Weekly |

### 5.2 Quality Metrics

| Metric ID | Metric | IOC Endpoint | Collection |
|-----------|--------|-------------|------------|
| QUAL-001 | KP Quality Score | `/api/quality/kp-score` | Per review |
| QUAL-002 | Gate Pass Rate | `/api/quality/gate-pass` | Per KP |
| QUAL-003 | Revision Rate | `/api/quality/revisions` | Weekly |
| QUAL-004 | Rejection Rate | `/api/quality/rejections` | Monthly |
| QUAL-005 | Average Review Time | `/api/quality/review-time` | Per review |

### 5.3 Impact Metrics

| Metric ID | Metric | IOC Endpoint | Collection |
|-----------|--------|-------------|------------|
| IMPACT-001 | Student Readiness | `/api/impact/readiness` | Weekly |
| IMPACT-002 | Industry Coverage | `/api/impact/industry` | Monthly |
| IMPACT-003 | Mission Progress | `/api/impact/mission` | Monthly |
| IMPACT-004 | Community Requests | `/api/impact/community` | Weekly |
| IMPACT-005 | Student Feedback | `/api/impact/feedback` | Monthly |

### 5.4 Velocity Metrics

| Metric ID | Metric | IOC Endpoint | Collection |
|-----------|--------|-------------|------------|
| VEL-001 | Production Velocity | `/api/velocity/production` | Weekly |
| VEL-002 | Cycle Time | `/api/velocity/cycle-time` | Per KP |
| VEL-003 | Bottleneck Analysis | `/api/velocity/bottlenecks` | Weekly |
| VEL-004 | Throughput | `/api/velocity/throughput` | Weekly |

### 5.5 Metrics Data Flow

```
Production Pipeline
    ↓ (events)
IOC Event Bus
    ↓ (processing)
Metrics Storage (SQLite)
    ↓ (query)
IOC Dashboard
    ↓ (alerts)
Notification Engine (Slack, Email)
```

---

## 6. Event Integration with Social OS

### 6.1 Event Types

| Event | Source | IOC Handler | Action |
|-------|--------|-------------|--------|
| `kp.created` | Content Factory | Update KP tracking | Update dashboard |
| `kp.review.started` | Quality Gates | Track review start | Start timer |
| `kp.review.completed` | Quality Gates | Record review result | Update metrics |
| `kp.published` | Content Factory | Record publication | Update production count |
| `kp.distributed` | Social OS | Record distribution | Update distribution metrics |
| `kp.feedback.received` | Social OS | Record feedback | Update impact metrics |
| `alert.triggered` | Quality Gates | Display alert | Notify team |
| `milestone.reached` | IOC | Record milestone | Update mission progress |

### 6.2 Event Flow

```
Content Factory → kp.created → IOC Event Bus → KP Tracking Dashboard
                    ↓
              Quality Gates → kp.review.started → IOC Review Timer
                    ↓
              Quality Gates → kp.review.completed → IOC Quality Metrics
                    ↓
              Content Factory → kp.published → IOC Production Metrics
                    ↓
              Social OS → kp.distributed → IOC Distribution Metrics
                    ↓
              Social OS → kp.feedback.received → IOC Impact Metrics
                    ↓
              IOC → alert.triggered → Notification Engine
```

### 6.3 Event Schema

```json
{
  "eventId": "uuid",
  "type": "kp.created|kp.review.started|kp.review.completed|kp.published|kp.distributed|kp.feedback.received|alert.triggered|milestone.reached",
  "source": "content-factory|quality-gates|social-os|ioc",
  "timestamp": "ISO-8601",
  "data": {
    "kpId": "ko-ai-what-is-ai",
    "domain": "ai",
    "level": 0,
    "status": "draft",
    "qualityScore": null,
    "gateStatus": null
  },
  "metadata": {
    "author": "content-lead",
    "reviewer": "tech-reviewer",
    "pipeline": "production-v1"
  }
}
```

---

## 7. Health Checks for Production Pipeline

### 7.1 System Health Dashboard

```
Health Dashboard (/dashboard/health)
├── Production Pipeline
│   ├── KP Factory: [healthy/degraded/down]
│   ├── Quality Gates: [healthy/degraded/down]
│   ├── Content Factory: [healthy/degraded/down]
│   ├── Social OS: [healthy/degraded/down]
│   └── Knowledge Studio: [healthy/degraded/down]
│
├── Platform Systems
│   ├── IOC API: [healthy/degraded/down]
│   ├── Runtime API: [healthy/degraded/down]
│   ├── GitHub OS: [healthy/degraded/down]
│   └── Constitution SDK: [healthy/degraded/down]
│
└── External Dependencies
    ├── GitHub API: [healthy/degraded/down]
    ├── Newsletter Service: [healthy/degraded/down]
    └── CDN: [healthy/degraded/down]
```

### 7.2 Health Check Endpoints

| System | Endpoint | Expected Response |
|--------|----------|-------------------|
| IOC API | `GET /api/health` | `{"status": "ok", "uptime": "..."}` |
| Runtime API | `GET http://localhost:3100/health` | `{"status": "ok"}` |
| Knowledge Studio | `GET /api/health` | `{"status": "ok"}` |
| Social OS | `GET /api/health` | `{"status": "ok"}` |
| GitHub OS | `GET /api/health` | `{"status": "ok"}` |

### 7.3 Health Check Schedule

| Check | Frequency | Owner | Alert on Failure |
|-------|-----------|-------|-----------------|
| Production Pipeline | Real-time (5s) | IOC | CRITICAL |
| Platform Systems | Every 60s | IOC | WARNING |
| External Dependencies | Every 300s | IOC | WARNING |
| Database | Every 60s | IOC | CRITICAL |
| File System | Every 300s | IOC | WARNING |

### 7.4 Health Check Alerts

| Severity | Condition | Notification | Response Time |
|----------|-----------|-------------|---------------|
| CRITICAL | Production pipeline down | Slack + Email | Within 1 hour |
| WARNING | System degraded | Slack | Within 4 hours |
| INFO | External dependency slow | Dashboard | Next review |

### 7.5 Pipeline Health Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Pipeline uptime | 99.9% | < 99.5% |
| Average KP processing time | < 5 minutes | > 10 minutes |
| Quality gate execution time | < 5 minutes | > 10 minutes |
| Publication success rate | 100% | < 95% |
| Distribution success rate | 100% | < 95% |

---

## 8. API Endpoints for Production Data

### 8.1 Production API Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/production/kps` | GET, POST | Knowledge Package tracking |
| `/api/production/pipeline` | GET | Pipeline status and metrics |
| `/api/production/curriculum` | GET | Curriculum completion |
| `/api/production/assets` | GET | Asset production counts |
| `/api/quality/gates` | GET | Quality gate status |
| `/api/quality/scores` | GET | Quality scores |
| `/api/quality/reviews` | GET | Review history |
| `/api/velocity/metrics` | GET | Velocity metrics |
| `/api/impact/metrics` | GET | Impact metrics |
| `/api/health/production` | GET | Production health checks |

### 8.2 API Request/Response Examples

#### Get KP Status

```http
GET /api/production/kps?status=published&domain=ai
```

Response:
```json
{
  "kps": [
    {
      "id": "ko-ai-what-is-ai",
      "title": "What is Artificial Intelligence?",
      "domain": "ai",
      "level": 0,
      "status": "published",
      "qualityScore": 4.2,
      "publishedAt": "2026-08-05T10:00:00Z",
      "assets": {
        "lesson": true,
        "lab": true,
        "assessment": true,
        "article": true,
        "video": true,
        "carousel": true,
        "newsletter": true
      }
    }
  ],
  "total": 1,
  "page": 1,
  "perPage": 20
}
```

#### Get Pipeline Status

```http
GET /api/production/pipeline
```

Response:
```json
{
  "stages": {
    "research": { "pending": 0, "complete": 48, "avgDuration": "2.5 hours" },
    "authoring": { "pending": 1, "complete": 47, "avgDuration": "6 hours" },
    "technical-review": { "pending": 0, "complete": 48, "avgDuration": "3 hours" },
    "educational-review": { "pending": 0, "complete": 48, "avgDuration": "4 hours" },
    "founder-review": { "pending": 0, "complete": 48, "avgDuration": "2 hours" },
    "publication": { "pending": 0, "complete": 48, "avgDuration": "1 hour" },
    "distribution": { "pending": 1, "complete": 47, "avgDuration": "6 hours" }
  },
  "currentWeek": {
    "kp": "ko-ai-mcp",
    "stage": "authoring",
    "progress": 75
  }
}
```

#### Get Quality Gate Status

```http
GET /api/quality/gates?kpId=ko-ai-what-is-ai
```

Response:
```json
{
  "kpId": "ko-ai-what-is-ai",
  "gates": [
    { "gate": 1, "name": "Educational Quality", "status": "pass", "score": 8.5 },
    { "gate": 2, "name": "Technical Accuracy", "status": "pass", "score": 9.0 },
    { "gate": 3, "name": "Constitution Compliance", "status": "pass", "score": 8.0 },
    { "gate": 4, "name": "BEE 2.0 Compliance", "status": "pass", "score": 7.5 },
    { "gate": 5, "name": "Citation Quality", "status": "pass", "score": 8.0 },
    { "gate": 6, "name": "Learning Outcomes", "status": "pass", "score": 8.5 },
    { "gate": 7, "name": "Project Quality", "status": "pass", "score": 7.0 },
    { "gate": 8, "name": "Assessment Quality", "status": "pass", "score": 8.0 },
    { "gate": 9, "name": "Portfolio Value", "status": "pass", "score": 7.5 },
    { "gate": 10, "name": "Media Completeness", "status": "pass", "score": 8.0 }
  ],
  "compositeScore": 8.0,
  "mandatoryGatesPass": true,
  "overallStatus": "pass"
}
```

#### Get Production Metrics

```http
GET /api/production/assets?period=week
```

Response:
```json
{
  "period": "2026-W32",
  "assets": {
    "kps": 1,
    "lessons": 1,
    "labs": 1,
    "assessments": 1,
    "articles": 1,
    "videos": 1,
    "carousels": 1,
    "newsletters": 1,
    "repositories": 1,
    "portfolios": 1,
    "guides": 1,
    "workbooks": 1,
    "blogs": 1
  },
  "total": 13,
  "target": 13,
  "onTrack": true
}
```

### 8.3 API Authentication

All production API endpoints require authentication via:
- API key in `Authorization` header
- Session cookie from IOC dashboard
- GitHub OAuth token (for GitHub OS integration)

### 8.4 API Rate Limits

| Endpoint Group | Rate Limit | Window |
|----------------|------------|--------|
| Production metrics | 100 requests | 1 minute |
| Quality gates | 50 requests | 1 minute |
| KP tracking | 100 requests | 1 minute |
| Health checks | 1000 requests | 1 minute |

---

## 9. IOC Database Schema for Production

### 9.1 Production Tables

```sql
-- KP tracking
CREATE TABLE production_kps (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  level INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  quality_score DECIMAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  author TEXT,
  reviewer TEXT
);

-- Pipeline stage tracking
CREATE TABLE production_pipeline (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kp_id TEXT NOT NULL,
  stage TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  duration_ms INTEGER,
  FOREIGN KEY (kp_id) REFERENCES production_kps(id)
);

-- Quality gate results
CREATE TABLE quality_gates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kp_id TEXT NOT NULL,
  gate_number INTEGER NOT NULL,
  gate_name TEXT NOT NULL,
  status TEXT NOT NULL,
  score DECIMAL,
  reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewer TEXT,
  notes TEXT,
  FOREIGN KEY (kp_id) REFERENCES production_kps(id)
);

-- Production metrics
CREATE TABLE production_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  metric_id TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  value DECIMAL NOT NULL,
  dimensions JSONB,
  metadata JSONB
);

-- Production alerts
CREATE TABLE production_alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  metric_id TEXT NOT NULL,
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  acknowledged_by TEXT
);
```

---

## 10. IOC Alert Rules for Production

### 10.1 Alert Definitions

| Alert | Condition | Severity | Response |
|-------|-----------|----------|----------|
| KP Quality Drop | Score < 3.5 | CRITICAL | Immediate review |
| Velocity Below Target | < 3 KPs/week x 2 weeks | WARNING | Velocity review |
| Gate Pass Rate Low | < 60% | WARNING | Process review |
| Pipeline Bottleneck | Stage > 50% cycle time | WARNING | Optimization |
| Publication Missed | Friday PM deadline missed | WARNING | Schedule review |
| Community Backlog | > 50 unanswered requests | WARNING | Community sprint |
| Student Feedback Low | < 4.0 satisfaction | CRITICAL | Content review |
| System Health Down | Production pipeline down | CRITICAL | Immediate fix |

### 10.2 Alert Escalation

```
Alert fires
    ↓
Production Lead notified (Slack + Email)
    ↓ (4 hours unacknowledged)
Content Lead notified
    ↓ (24 hours unresolved)
Founder notified
    ↓ (48 hours critical)
Emergency review meeting
```

---

## Appendix: IOC Production Integration Map

```
┌─────────────────────────────────────────────────────────────┐
│                    IOC — Production Integration              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐│
│  │   KP Factory │────▶│ Quality Gates│────▶│ Content      ││
│  │              │     │              │     │ Factory      ││
│  └──────┬───────┘     └──────┬───────┘     └──────┬───────┘│
│         │                    │                     │        │
│         ▼                    ▼                     ▼        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    IOC Event Bus                     │   │
│  └──────────────────────────┬──────────────────────────┘   │
│                              │                              │
│         ┌────────────────────┼────────────────────┐        │
│         ▼                    ▼                    ▼        │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐│
│  │  KP Tracking │     │   Quality    │     │   Metrics    ││
│  │  Dashboard   │     │   Dashboard  │     │   Dashboard  ││
│  └──────────────┘     └──────────────┘     └──────────────┘│
│         │                    │                    │        │
│         └────────────────────┼────────────────────┘        │
│                              ▼                              │
│                    ┌──────────────────┐                    │
│                    │  Alert Engine    │                    │
│                    │  (Slack + Email) │                    │
│                    └──────────────────┘                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

*This document is the single source of truth for IOC-production integration. All production monitoring must route through IOC.*
