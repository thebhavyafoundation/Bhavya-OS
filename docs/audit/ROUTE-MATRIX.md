# ROUTE-MATRIX — Current Route Inventory

**Date:** 2026-10-12
**Source:** `docs/architecture/CANONICAL_ROUTE_MAP.md` + `apps/ai-institute/src/app/`

---

## Route Summary

| Category                  | Count   | Auth Required       |
| ------------------------- | ------- | ------------------- |
| Public Routes             | 44      | No                  |
| Knowledge Routes          | 13      | Mixed               |
| Authenticated (My Bhavya) | 9       | Yes                 |
| OS Routes (Internal)      | 14      | Yes (Admin/Trustee) |
| **Total**                 | **80+** | —                   |

---

## Public Routes (44)

| Route                           | Purpose                  | Pillar    | Component                               |
| ------------------------------- | ------------------------ | --------- | --------------------------------------- |
| `/`                             | Homepage                 | all       | `page.tsx`                              |
| `/about`                        | Institutional about      | —         | `about/page.tsx`                        |
| `/mission`                      | Constitution & purpose   | —         | `mission/page.tsx`                      |
| `/programs`                     | Active programmes        | —         | `programs/page.tsx`                     |
| `/transparency`                 | Transparency portal      | —         | `transparency/page.tsx`                 |
| `/transparency/financials`      | Financial statements     | —         | `transparency/financials/page.tsx`      |
| `/transparency/governance`      | Governance docs          | —         | `transparency/governance/page.tsx`      |
| `/transparency/projects`        | Project tracking         | —         | `transparency/projects/page.tsx`        |
| `/transparency/policies`        | Institutional policies   | —         | `transparency/policies/page.tsx`        |
| `/transparency/releases`        | Release history          | —         | `transparency/releases/page.tsx`        |
| `/resources`                    | Resource library         | —         | `resources/page.tsx`                    |
| `/resources/documents`          | Document library         | —         | `resources/documents/page.tsx`          |
| `/resources/publications`       | Publications             | knowledge | `resources/publications/page.tsx`       |
| `/resources/videos`             | Video documentation      | —         | `resources/videos/page.tsx`             |
| `/ai-institute`                 | AI Institute hub         | knowledge | `ai-institute/page.tsx`                 |
| `/ai-institute/experiments`     | AI Labs & experiments    | knowledge | `ai-institute/experiments/page.tsx`     |
| `/initiatives`                  | Initiatives portfolio    | —         | `initiatives/page.tsx`                  |
| `/initiatives/school-outreach`  | School outreach          | community | `initiatives/school-outreach/page.tsx`  |
| `/initiatives/rural-innovation` | Rural innovation         | community | `initiatives/rural-innovation/page.tsx` |
| `/governance`                   | Governance hub           | —         | `governance/page.tsx`                   |
| `/governance/founders`          | Founder's Charter        | —         | `governance/founders/page.tsx`          |
| `/governance/board-of-trustees` | Board of Trustees        | —         | `governance/board-of-trustees/page.tsx` |
| `/governance/safeguarding`      | Safeguarding policy      | —         | `governance/safeguarding/page.tsx`      |
| `/governance/ai-ethics`         | AI ethics policy         | knowledge | `governance/ai-ethics/page.tsx`         |
| `/support`                      | Support pathways         | —         | `support/page.tsx`                      |
| `/teachers`                     | For teachers             | knowledge | `teachers/page.tsx`                     |
| `/donate`                       | Donation page            | —         | `donate/page.tsx`                       |
| `/volunteer`                    | Volunteer pathways       | community | `volunteer/page.tsx`                    |
| `/get-involved`                 | Participation paths      | —         | `get-involved/page.tsx`                 |
| `/contact`                      | Institutional contact    | —         | `contact/page.tsx`                      |
| `/forbidden`                    | Not-permitted notice     | —         | `forbidden/page.tsx`                    |
| `/privacy`                      | Privacy policy           | —         | `privacy/page.tsx`                      |
| `/accessibility`                | Accessibility statement  | —         | `accessibility/page.tsx`                |
| `/forest`                       | Forest mission           | forest    | `forest/page.tsx`                       |
| `/knowledge`                    | Knowledge mission        | knowledge | `knowledge/page.tsx`                    |
| `/heritage`                     | Heritage mission         | heritage  | `heritage/page.tsx`                     |
| `/community`                    | Community mission        | community | `community/page.tsx`                    |
| `/nature`                       | Nature (alias → /forest) | forest    | `nature/page.tsx`                       |
| `/missions`                     | Missions overview        | all       | `missions/page.tsx`                     |
| `/missions/forest`              | Forest mission detail    | forest    | `missions/forest/page.tsx`              |
| `/missions/heritage`            | Heritage mission detail  | heritage  | `missions/heritage/page.tsx`            |
| `/missions/nature`              | Nature mission detail    | forest    | `missions/nature/page.tsx`              |
| `/missions/community`           | Community mission detail | community | `missions/community/page.tsx`           |

---

## Knowledge Routes (13)

| Route                                        | Purpose                | Auth          | Parent    |
| -------------------------------------------- | ---------------------- | ------------- | --------- |
| `/knowledge`                                 | Knowledge hub          | No            | —         |
| `/knowledge/academy`                         | Academy overview       | No            | knowledge |
| `/knowledge/courses`                         | **Alias → `/courses`** | —             | —         |
| `/knowledge/courses/[id]`                    | Course detail          | No            | knowledge |
| `/knowledge/courses/[id]/lessons/[lessonId]` | Lesson player          | Yes (Student) | knowledge |
| `/knowledge/library`                         | Library                | No            | knowledge |
| `/knowledge/research`                        | Research hub           | No            | knowledge |
| `/knowledge/ai`                              | AI capabilities        | No            | knowledge |
| `/knowledge/mentor`                          | Mentor system          | No            | knowledge |
| `/knowledge/projects`                        | Projects               | No            | knowledge |
| `/knowledge/credentials`                     | Credentials            | No            | knowledge |
| `/knowledge/graph`                           | Knowledge graph        | No            | knowledge |

---

## Curriculum Routes (Dynamic)

| Route                                                    | Purpose                   | Auth | Parameters                      |
| -------------------------------------------------------- | ------------------------- | ---- | ------------------------------- |
| `/curriculum`                                            | Curriculum hub (4 tracks) | No   | —                               |
| `/curriculum/levels/[level]`                             | Level module list         | No   | `level`: `0-12`, `jr-a`, `jr-b` |
| `/curriculum/levels/[level]/[module]`                    | Module detail             | No   | `level`, `module`               |
| `/curriculum/levels/[level]/[module]/lessons/[lessonId]` | Lesson player             | No   | `level`, `module`, `lessonId`   |

---

## Authenticated Routes — My Bhavya (9)

| Route                | Purpose            | Audience          |
| -------------------- | ------------------ | ----------------- |
| `/app`               | My Bhavya home     | All authenticated |
| `/app/learn`         | Learning dashboard | Student           |
| `/app/community`     | Community          | Volunteer         |
| `/app/knowledge`     | Knowledge          | Researcher        |
| `/app/missions`      | Missions           | All               |
| `/app/projects`      | Projects           | All               |
| `/app/credentials`   | Credentials        | All               |
| `/app/contributions` | Contributions      | All               |
| `/app/profile`       | Profile            | All               |

---

## OS Routes — Internal Operations (14)

| Route                   | Purpose              | Audience  |
| ----------------------- | -------------------- | --------- |
| `/os`                   | OS overview          | Admin     |
| `/os/governance`        | Governance           | Admin     |
| `/os/observability`     | Observability        | Admin     |
| `/os/runtime`           | Runtime              | Admin     |
| `/os/knowledge`         | Knowledge management | Admin     |
| `/os/memory`            | Memory               | Admin     |
| `/os/search`            | Search               | Admin     |
| `/os/videos`            | Video management     | Admin     |
| `/os/student`           | Student workspace    | Student   |
| `/os/volunteer`         | Volunteer workspace  | Volunteer |
| `/os/donor`             | Donor workspace      | Donor     |
| `/os/trustee`           | Trustee workspace    | Trustee   |
| `/os/mission`           | Mission Control      | Admin     |
| `/os/mission/approvals` | Approval review      | Admin     |

---

## Auth Routes

| Route            | Purpose                          |
| ---------------- | -------------------------------- |
| `/login`         | Sign in page                     |
| `/register`      | Registration (with intent param) |
| `/verify`        | Email verification               |
| `/auth/callback` | OAuth callback                   |

---

## Alias Redirects (IA → Canonical)

| Alias                          | Canonical                   |
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

## Legacy Route Redirects

| Old Route     | New Route               | Status    |
| ------------- | ----------------------- | --------- |
| `website/*`   | Canonical public routes | MIGRATING |
| `admin/*`     | `/os/admin`             | MIGRATING |
| `docs/*`      | `/os/docs`              | MIGRATING |
| `github-os/*` | `/os/github`            | MIGRATING |
| `ioc/*`       | `/os/ioc`               | MIGRATING |
| `social-os/*` | `/os/social`            | MIGRATING |

---

## Route Implementation Status

| Route Pattern     | Implemented | Component Location           |
| ----------------- | ----------- | ---------------------------- |
| `/`               | ✅          | `src/app/page.tsx`           |
| `/missions/*`     | ✅          | `src/app/missions/`          |
| `/knowledge/*`    | ✅          | `src/app/knowledge/`         |
| `/curriculum/*`   | ✅          | `src/app/curriculum/`        |
| `/app/*`          | ✅          | `src/app/app/`               |
| `/os/*`           | ✅          | `src/app/os/`                |
| `/ai-institute/*` | ✅          | `src/app/ai-institute/`      |
| `/governance/*`   | ✅          | `src/app/governance/`        |
| `/transparency/*` | ✅          | `src/app/transparency/`      |
| `/resources/*`    | ✅          | `src/app/resources/`         |
| `/initiatives/*`  | ✅          | `src/app/initiatives/`       |
| `/donate`         | ✅          | `src/app/donate/page.tsx`    |
| `/volunteer`      | ✅          | `src/app/volunteer/page.tsx` |
| `/login`          | ✅          | `src/app/login/page.tsx`     |
| `/register`       | ✅          | `src/app/register/page.tsx`  |

---

## Missing / Placeholder Routes

| Route             | Expected                | Status       |
| ----------------- | ----------------------- | ------------ |
| `/learning-paths` | Learning paths overview | ❌ Not found |
| `/schools`        | Schools directory       | ❌ Not found |
| `/projects`       | Projects portfolio      | ❌ Not found |
| `/faq`            | FAQ page                | ❌ Not found |
| `/library`        | Digital library         | ❌ Not found |
| `/research`       | Research hub            | ❌ Not found |
| `/contact`        | Contact form            | ❌ Not found |
| `/support`        | Support pathways        | ❌ Not found |
| `/teachers`       | Teacher resources       | ❌ Not found |
| `/privacy`        | Privacy policy          | ❌ Not found |
| `/accessibility`  | Accessibility statement | ❌ Not found |

> Note: These routes exist in CANONICAL_ROUTE_MAP.md but not in `src/app/` — likely planned or migrated from legacy apps.
