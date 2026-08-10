# CANONICAL API MAP

**Date:** 2026-08-10
**Status:** ACTIVE
**Owner:** Bhavya Foundation Architecture
**Last updated:** 2026-08-10

---

## Rule

No undocumented production API.

---

## AI-Institute API Routes

| Endpoint                     | Domain    | Method         | Auth             | Input           | Output         | Source               |
| ---------------------------- | --------- | -------------- | ---------------- | --------------- | -------------- | -------------------- |
| `/api/auth/login`            | Auth      | POST           | No               | email, password | session        | `api-auth.ts`        |
| `/api/auth/logout`           | Auth      | POST           | Yes              | —               | success        | `api-auth.ts`        |
| `/api/auth/me`               | Auth      | GET            | Yes              | —               | user           | `api-auth.ts`        |
| `/api/academy/published`     | Academy   | GET            | No               | —               | lessons[]      | `academy-lessons.ts` |
| `/api/studio/courses`        | Studio    | GET/POST       | Admin/Instructor | course data     | courses        | `studio/db.ts`       |
| `/api/studio/courses/[id]`   | Studio    | GET/PUT/DELETE | Admin/Instructor | id              | course         | `studio/db.ts`       |
| `/api/studio/lessons`        | Studio    | GET/POST       | Admin/Instructor | lesson data     | lessons        | `studio/db.ts`       |
| `/api/studio/lessons/[id]`   | Studio    | GET/PUT/DELETE | Admin/Instructor | id              | lesson         | `studio/db.ts`       |
| `/api/studio/knowledge`      | Studio    | GET/POST       | Admin/Instructor | KO data         | KOs            | `studio/db.ts`       |
| `/api/studio/knowledge/[id]` | Studio    | GET/PUT/DELETE | Admin/Instructor | id              | KO             | `studio/db.ts`       |
| `/api/studio/publish`        | Studio    | POST           | Admin/Instructor | lessonId        | publish result | `studio/db.ts`       |
| `/api/studio/quality-gates`  | Studio    | POST           | Admin/Instructor | lessonId        | gate results   | `quality-gates.ts`   |
| `/api/knowledge`             | Knowledge | GET/POST       | Admin            | KO data         | KOs            | `studio/db.ts`       |
| `/api/knowledge/[id]`        | Knowledge | GET/PUT/DELETE | Admin            | id              | KO             | `studio/db.ts`       |
| `/api/health`                | System    | GET            | No               | —               | status         | health check         |
| `/api/metrics`               | System    | GET            | No               | —               | metrics        | Prometheus           |
| `/api/ready`                 | System    | GET            | No               | —               | ready          | readiness            |

---

## GitHub-OS API Routes

| Endpoint                         | Domain | Method   | Auth | Input | Output     |
| -------------------------------- | ------ | -------- | ---- | ----- | ---------- |
| `/api/repositories`              | GitHub | GET/POST | No   | query | repos[]    |
| `/api/repositories/[id]`         | GitHub | GET      | No   | id    | repo       |
| `/api/repositories/[id]/health`  | GitHub | GET      | No   | id    | health     |
| `/api/repositories/[id]/fitness` | GitHub | GET      | No   | id    | fitness    |
| `/api/repositories/[id]/debt`    | GitHub | GET      | No   | id    | debt       |
| `/api/repositories/[id]/advisor` | GitHub | GET      | No   | id    | advice     |
| `/api/knowledge`                 | GitHub | GET      | No   | —     | packages[] |
| `/api/knowledge-graph`           | GitHub | GET      | No   | —     | graph      |
| `/api/patterns`                  | GitHub | GET      | No   | —     | patterns[] |
| `/api/recommendations`           | GitHub | GET      | No   | —     | recs[]     |
| `/api/radar`                     | GitHub | GET      | No   | —     | radar      |
| `/api/search`                    | GitHub | GET      | No   | q     | results[]  |
| `/api/activity`                  | GitHub | GET      | No   | —     | events[]   |
| `/api/comparisons`               | GitHub | GET      | No   | ids[] | comparison |
| `/api/educational`               | GitHub | GET      | No   | —     | content[]  |
| `/api/elite`                     | GitHub | GET      | No   | —     | repos[]    |

---

## IOC API Routes

| Endpoint            | Domain | Method   | Auth  | Input       | Output    |
| ------------------- | ------ | -------- | ----- | ----------- | --------- |
| `/api/okr`          | IOC    | GET/POST | Admin | OKR data    | OKRs[]    |
| `/api/risks`        | IOC    | GET/POST | Admin | risk data   | risks[]   |
| `/api/actions`      | IOC    | GET/POST | Admin | action data | actions[] |
| `/api/production`   | IOC    | GET      | Admin | —           | KPIs      |
| `/api/events`       | IOC    | GET      | Admin | —           | events[]  |
| `/api/systems`      | IOC    | GET      | Admin | —           | systems[] |
| `/api/reviews`      | IOC    | GET      | Admin | —           | reviews[] |
| `/api/intelligence` | IOC    | GET      | Admin | —           | intel     |

---

## Social-OS API Routes

| Endpoint            | Domain | Method   | Auth  | Input         | Output         |
| ------------------- | ------ | -------- | ----- | ------------- | -------------- |
| `/api/campaigns`    | Social | GET/POST | Admin | campaign data | campaigns[]    |
| `/api/calendar`     | Social | GET      | Admin | —             | events[]       |
| `/api/publications` | Social | GET/POST | Admin | pub data      | publications[] |
| `/api/pulse`        | Social | GET      | Admin | —             | pulse          |
| `/api/feedback`     | Social | GET      | Admin | —             | feedback[]     |
| `/api/loop`         | Social | GET      | Admin | —             | loop status    |
| `/api/integrations` | Social | GET      | Admin | —             | integrations[] |

---

## Intelligence API Routes

| Endpoint        | Domain       | Method | Auth  | Input              | Output     |
| --------------- | ------------ | ------ | ----- | ------------------ | ---------- |
| `/api/loop`     | Intelligence | POST   | Admin | —                  | run result |
| `/api/approval` | Intelligence | POST   | Admin | action, approvedBy | result     |

---

## Health Endpoints (All Apps)

| Endpoint       | Method | Output                        |
| -------------- | ------ | ----------------------------- |
| `/api/health`  | GET    | `{ status: "ok", timestamp }` |
| `/api/ready`   | GET    | `{ ready: true }`             |
| `/api/metrics` | GET    | Prometheus-format metrics     |

---

## Authentication

| Mechanism     | Used By                   | Implementation                     |
| ------------- | ------------------------- | ---------------------------------- |
| Session-based | ai-institute              | `api-auth.ts` + bcryptjs + cookies |
| None          | github-os, ioc, social-os | Headers only (internal)            |
| None          | intelligence              | Headers only (internal)            |

**Target:** All `/os/*` routes require admin authentication via `requireAuth()`.
