# IOC — Institution Operations Center

## Architecture

IOC owns NO business logic. It orchestrates, visualizes, coordinates, and triggers workflows across every Bhavya system. Executive layer only.

## Domain Model

- **OKR Engine**: Create/list/update objectives, key results, progress tracking
- **Risk Register**: CRUD, severity tracking, summary
- **Action Items**: CRUD, priority, status management
- **System Health**: Real-time health checks across 9 Bhavya systems
- **Institutional Intelligence**: KPIs, opportunities, risks, blocked work analysis
- **Weekly Reviews**: Automated executive summaries and next-week plans
- **Cross-System Events**: Event bus for institutional intelligence
- **CEO Dashboard**: Executive command center with real-time metrics

## API Routes

| Route               | Methods   | Description              |
| ------------------- | --------- | ------------------------ |
| `/api/okr`          | GET, POST | Objectives & Key Results |
| `/api/risks`        | GET, POST | Risk Register            |
| `/api/actions`      | GET, POST | Action Items             |
| `/api/health`       | GET, POST | System Health            |
| `/api/events`       | GET, POST | Institutional Events     |
| `/api/reviews`      | GET, POST | Weekly Reviews           |
| `/api/intelligence` | GET, POST | KPIs & Intelligence      |

## Pages

| Page         | Description              |
| ------------ | ------------------------ |
| `/dashboard` | Executive Command Center |
| `/okr`       | Objectives & Key Results |
| `/risks`     | Risk Register            |
| `/actions`   | Action Items             |
| `/health`    | System Health            |
| `/reviews`   | Weekly Reviews           |
| `/events`    | Institutional Events     |

## Database

14 SQLite tables: institutions, missions, objectives, milestones, risks, decisions, action_items, weekly_reviews, alerts, institution_events, institution_kpis, system_health

## How to Run

```bash
cd apps/ioc
npm install
npm run dev  # Port 3200
```
