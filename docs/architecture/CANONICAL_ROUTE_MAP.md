# CANONICAL ROUTE MAP

**Date:** 2026-09-06
**Status:** ACTIVE
**Owner:** Bhavya Foundation Architecture
**Last updated:** 2026-09-25
**Applies To:** All routes in `apps/ai-institute`

---

## Rule

One concept → one canonical route. No duplicate URL experiences.

---

## Product Hierarchy

```
BHAVYA FOUNDATION (product)
    │
    ├── FOREST (pillar)
    ├── KNOWLEDGE (pillar)
    │   ├── AI
    │   ├── Academy
    │   ├── Library
    │   └── Research
    ├── HERITAGE (pillar)
    └── COMMUNITY (pillar)
```

---

## Navigation Structure

Public navigation is organized into four institutional groups:

### Explore

- Missions (`/missions`)
- Nature (`/forest`)
- Knowledge (`/knowledge`)
- Heritage (`/heritage`)
- Community (`/community`)
- Initiatives (`/initiatives`)

### Learn

- Open Knowledge (`/knowledge`)
- AI Institute (`/ai-institute`)
- Research (`/research`)
- Library (`/knowledge/library`)
- Public Resources (`/resources`)

### Participate

- Volunteer (`/volunteer`)
- Become a Student (`/register?intent=student`)
- Teach (`/teachers`)
- Research With Us (`/register?intent=researcher`)
- Partner (`/get-involved`)
- Donate (`/donate`)
- Support (`/support`)

### About

- Our Story (`/about`)
- Vision (`/mission`)
- Governance (`/governance`)
- Constitution (`/mission#constitution`)
- Reports (`/transparency`)
- Contact (`/contact`)

---

## Public Routes — Four Pillars

| Route                           | Purpose                    | Audience | Auth | Pillar    |
| ------------------------------- | -------------------------- | -------- | ---- | --------- |
| `/`                             | Bhavya Foundation homepage | Public   | No   | all       |
| `/forest`                       | Forest mission             | Public   | No   | forest    |
| `/knowledge`                    | Knowledge mission          | Public   | No   | knowledge |
| `/heritage`                     | Heritage mission           | Public   | No   | heritage  |
| `/community`                    | Community mission          | Public   | No   | community |
| `/about`                        | Institutional about        | Public   | No   | —         |
| `/mission`                      | Constitution & purpose     | Public   | No   | —         |
| `/programs`                     | Active programmes          | Public   | No   | —         |
| `/transparency`                 | Transparency portal        | Public   | No   | —         |
| `/transparency/financials`      | Financial statements       | Public   | No   | —         |
| `/transparency/governance`      | Governance docs            | Public   | No   | —         |
| `/transparency/projects`        | Project tracking           | Public   | No   | —         |
| `/transparency/policies`        | Institutional policies     | Public   | No   | —         |
| `/transparency/releases`        | Release history            | Public   | No   | —         |
| `/resources`                    | Resource library           | Public   | No   | —         |
| `/resources/documents`          | Document library           | Public   | No   | —         |
| `/resources/publications`       | Publications               | Public   | No   | knowledge |
| `/resources/videos`             | Video documentation        | Public   | No   | —         |
| `/ai-institute`                 | AI Institute hub           | Public   | No   | knowledge |
| `/ai-institute/experiments`     | AI Labs & experiments      | Public   | No   | knowledge |
| `/initiatives`                  | Initiatives portfolio      | Public   | No   | —         |
| `/initiatives/school-outreach`  | School outreach            | Public   | No   | community |
| `/initiatives/rural-innovation` | Rural innovation           | Public   | No   | community |
| `/governance`                   | Governance hub             | Public   | No   | —         |
| `/governance/founders`          | Founder's Charter          | Public   | No   | —         |
| `/governance/board-of-trustees` | Board of Trustees          | Public   | No   | —         |
| `/governance/safeguarding`      | Safeguarding policy        | Public   | No   | —         |
| `/governance/ai-ethics`         | AI ethics policy           | Public   | No   | knowledge |
| `/support`                      | Support pathways           | Public   | No   | —         |
| `/teachers`                     | For teachers               | Public   | No   | knowledge |
| `/donate`                       | Donation page              | Public   | No   | —         |
| `/volunteer`                    | Volunteer pathways         | Public   | No   | community |
| `/get-involved`                 | Participation paths        | Public   | No   | —         |
| `/contact`                      | Institutional contact      | Public   | No   | —         |
| `/forbidden`                    | Not-permitted notice       | Public   | No   | —         |
| `/privacy`                      | Privacy policy             | Public   | No   | —         |
| `/accessibility`                | Accessibility statement    | Public   | No   | —         |

## Knowledge Routes

| Route                                        | Purpose          | Audience | Auth | Parent    |
| -------------------------------------------- | ---------------- | -------- | ---- | --------- |
| `/knowledge`                                 | Knowledge hub    | Public   | No   | —         |
| `/knowledge/academy`                         | Academy overview | Public   | No   | knowledge |
| `/knowledge/courses`                         | Course listing   | Public   | No   | knowledge |
| `/knowledge/courses/[id]`                    | Course detail    | Public   | No   | knowledge |
| `/knowledge/courses/[id]/lessons/[lessonId]` | Lesson player    | Student  | Yes  | knowledge |
| `/knowledge/library`                         | Library          | Public   | No   | knowledge |
| `/knowledge/research`                        | Research hub     | Public   | No   | knowledge |
| `/knowledge/ai`                              | AI capabilities  | Public   | No   | knowledge |
| `/knowledge/mentor`                          | Mentor system    | Public   | No   | knowledge |
| `/knowledge/projects`                        | Projects         | Public   | No   | knowledge |
| `/knowledge/credentials`                     | Credentials      | Public   | No   | knowledge |
| `/knowledge/graph`                           | Knowledge graph  | Public   | No   | knowledge |

## My Bhavya Routes (Authenticated)

| Route                | Purpose            | Audience      | Auth |
| -------------------- | ------------------ | ------------- | ---- |
| `/app`               | My Bhavya home     | Authenticated | Yes  |
| `/app/learn`         | Learning dashboard | Student       | Yes  |
| `/app/community`     | Community          | Volunteer     | Yes  |
| `/app/knowledge`     | Knowledge          | Researcher    | Yes  |
| `/app/missions`      | Missions           | All           | Yes  |
| `/app/projects`      | Projects           | All           | Yes  |
| `/app/credentials`   | Credentials        | All           | Yes  |
| `/app/contributions` | Contributions      | All           | Yes  |
| `/app/profile`       | Profile            | All           | Yes  |

## OS Routes (Internal)

| Route                   | Purpose              | Audience  | Auth |
| ----------------------- | -------------------- | --------- | ---- |
| `/os`                   | OS overview          | Admin     | Yes  |
| `/os/governance`        | Governance           | Admin     | Yes  |
| `/os/observability`     | Observability        | Admin     | Yes  |
| `/os/runtime`           | Runtime              | Admin     | Yes  |
| `/os/knowledge`         | Knowledge management | Admin     | Yes  |
| `/os/memory`            | Memory               | Admin     | Yes  |
| `/os/search`            | Search               | Admin     | Yes  |
| `/os/videos`            | Video management     | Admin     | Yes  |
| `/os/student`           | Student workspace    | Student   | Yes  |
| `/os/volunteer`         | Volunteer workspace  | Volunteer | Yes  |
| `/os/donor`             | Donor workspace      | Donor     | Yes  |
| `/os/trustee`           | Trustee workspace    | Trustee   | Yes  |
| `/os/mission`           | Mission Control      | Admin     | Yes  |
| `/os/mission/approvals` | Approval review      | Admin     | Yes  |

---

## Alias Redirects (IA paths → canonical)

Structural paths from the public website information architecture resolve to
their canonical owner rather than duplicating content:

| Alias Route                    | Canonical Route             |
| ------------------------------ | --------------------------- |
| `/ai-institute/curriculum`     | `/curriculum`               |
| `/ai-institute/community`      | `/community`                |
| `/ai-institute/learning`       | `/learning-paths`           |
| `/ai-institute/schools`        | `/schools`                  |
| `/ai-institute/projects`       | `/projects`                 |
| `/ai-institute/faq`            | `/faq`                      |
| `/ai-institute/responsible-ai` | `/governance/ai-ethics`     |
| `/initiatives/ai-labs`         | `/ai-institute/experiments` |
| `/initiatives/forest-mission`  | `/missions/forest`          |
| `/initiatives/heritage`        | `/heritage`                 |
| `/initiatives/digital-library` | `/library`                  |
| `/initiatives/volunteer-corps` | `/volunteer`                |
| `/initiatives/research`        | `/research`                 |
| `/initiatives/environment`     | `/forest`                   |
| `/governance/constitution`     | `/mission`                  |
| `/governance/policies`         | `/transparency`             |
| `/governance/transparency`     | `/transparency`             |

---

## Legacy Routes → Redirects

After migration, old routes redirect to canonical:

| Old Route     | New Route               | Status    |
| ------------- | ----------------------- | --------- |
| `website/*`   | Canonical public routes | MIGRATING |
| `admin/*`     | `/os/admin`             | MIGRATING |
| `docs/*`      | `/os/docs`              | MIGRATING |
| `github-os/*` | `/os/github`            | MIGRATING |
| `ioc/*`       | `/os/ioc`               | MIGRATING |
| `social-os/*` | `/os/social`            | MIGRATING |
