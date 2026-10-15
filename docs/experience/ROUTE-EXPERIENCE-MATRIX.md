# ROUTE-EXPERIENCE-MATRIX — Route Tier Classification & Experience Spec

**Date:** 2026-10-15  
**Source:** `docs/audit/ROUTE-MATRIX.md` + canonical route map  
**Total Routes:** 80+  
**Classification:** Tier A (Cinematic Flagship) / Tier B (Interactive Explanatory) / Tier C (Functional Learning) / Tier D (Operational)

---

## Classification Rules

| Tier                        | Visual Budget  | Motion           | 3D Allowed           | Scroll          | Example                         |
| --------------------------- | -------------- | ---------------- | -------------------- | --------------- | ------------------------------- |
| A — Cinematic Flagship      | Full editorial | Cinematic        | Full scenes, cameras | Pinned chapters | Homepage, mission, pillars      |
| B — Interactive Explanatory | Lightweight    | Scroll reveals   | Object explorers     | Selected pinned | Programme pages, course landing |
| C — Functional Learning     | Minimal        | Calm transitions | Optional explorers   | None            | Lesson pages, quizzes           |
| D — Operational             | None           | Micro only       | No                   | Native          | Auth, admin, settings           |

---

## Route Tier Assignments

### TIER A — CINEMATIC FLAGSHIP (8 routes)

| Route                 | Audience | Objective                | Tier | Principal Action  | Story Purpose                         | Recommended Visuals                                      | Motion Level | Fallback           | Accessibility    | Perf Budget        |
| --------------------- | -------- | ------------------------ | ---- | ----------------- | ------------------------------------- | -------------------------------------------------------- | ------------ | ------------------ | ---------------- | ------------------ |
| `/`                   | All      | Institutional entrance   | A    | Explore missions  | First impression: credibility + scope | Four-pillar 3D system, scroll chapters, documentary hero | Cinematic    | Poster image       | Full WCAG 2.2 AA | JS ≤350KB, 3D ≤4MB |
| `/mission`            | All      | Constitution & purpose   | A    | Read governance   | Institutional credibility             | Animated four-pillar diagram, scroll-linked 3D           | Cinematic    | Static diagram     | Full WCAG 2.2 AA | JS ≤350KB, 3D ≤4MB |
| `/missions`           | All      | Mission overview         | A    | Choose mission    | Connect public to four pillars        | Interactive pillar cards, hover 3D previews              | High         | Static cards       | Full WCAG 2.2 AA | JS ≤350KB          |
| `/missions/forest`    | All      | Forest mission detail    | A    | Learn + volunteer | Nature restoration narrative          | Terrain 3D, scroll-driven camera, before/after           | Cinematic    | Image sequence     | Full WCAG 2.2 AA | JS ≤350KB, 3D ≤4MB |
| `/missions/knowledge` | All      | Knowledge mission detail | A    | Explore academy   | Educational excellence narrative      | 3D neural network, scroll-linked data viz                | Cinematic    | Static infographic | Full WCAG 2.2 AA | JS ≤350KB, 3D ≤4MB |
| `/missions/heritage`  | All      | Heritage mission detail  | A    | Explore + support | Cultural preservation narrative       | 3D heritage sites, interactive map                       | Cinematic    | Image gallery      | Full WCAG 2.2 AA | JS ≤350KB, 3D ≤4MB |
| `/missions/community` | All      | Community mission detail | A    | Join + contribute | Local leadership narrative            | Network visualization, scroll timeline                   | High         | Static timeline    | Full WCAG 2.2 AA | JS ≤350KB          |
| `/knowledge`          | All      | Knowledge hub            | A    | Enter academy     | Educational mission entrance          | 3D concept network, animated pathway                     | High         | Static diagram     | Full WCAG 2.2 AA | JS ≤350KB          |

---

### TIER B — INTERACTIVE EXPLANATORY (22 routes)

| Route                       | Audience   | Objective              | Tier | Principal Action      | Purpose                       | Recommended Visuals                       | Motion Level | Fallback         | Accessibility    | Perf Budget |
| --------------------------- | ---------- | ---------------------- | ---- | --------------------- | ----------------------------- | ----------------------------------------- | ------------ | ---------------- | ---------------- | ----------- |
| `/programs`                 | Public     | Programme catalogue    | B    | Browse programmes     | Show active programmes        | Filterable cards, hover 3D previews       | Medium       | Static cards     | Full WCAG 2.2 AA | JS ≤250KB   |
| `/initiatives`              | Public     | Initiative portfolio   | B    | Explore initiatives   | Show on-ground work           | Map + cards, hover details                | Medium       | Static map       | Full WCAG 2.2 AA | JS ≤250KB   |
| `/initiatives/*` (4)        | Public     | Individual initiatives | B    | Learn + join          | Specific programme detail     | Location map, impact viz, scroll timeline | Medium       | Static cards     | Full WCAG 2.2 AA | JS ≤250KB   |
| `/governance`               | Public     | Governance hub         | B    | Understand governance | Transparency entrance         | Org chart, policy hierarchy               | Medium       | Static org chart | Full WCAG 2.2 AA | JS ≤250KB   |
| `/governance/*` (4)         | Public     | Governance details     | B    | Read policy           | Specific governance doc       | Process timeline, hierarchy viz           | Medium       | Static doc       | Full WCAG 2.2 AA | JS ≤250KB   |
| `/transparency`             | Public     | Transparency portal    | B    | Access reports        | Financial + governance access | Interactive charts, filterable tables     | Medium       | Static tables    | Full WCAG 2.2 AA | JS ≤250KB   |
| `/transparency/*` (5)       | Public     | Transparency sections  | B    | View reports          | Specific transparency area    | Charts, document viewers                  | Medium       | Static tables    | Full WCAG 2.2 AA | JS ≤250KB   |
| `/resources`                | Public     | Resource library       | B    | Browse resources      | Document/video access         | Filterable grid, preview cards            | Medium       | Static grid      | Full WCAG 2.2 AA | JS ≤250KB   |
| `/resources/*` (3)          | Public     | Resource categories    | B    | Browse by type        | Specific resource type        | Filterable lists                          | Medium       | Static lists     | Full WCAG 2.2 AA | JS ≤250KB   |
| `/ai-institute`             | Public     | AI Institute hub       | B    | Enter AI Institute    | Institute overview            | Animated pathway, hover 3D                | Medium       | Static cards     | Full WCAG 2.2 AA | JS ≤250KB   |
| `/ai-institute/experiments` | Public     | AI Labs                | B    | Explore experiments   | Show R&D work                 | Interactive demos, code snippets          | Medium       | Static cards     | Full WCAG 2.2 AA | JS ≤250KB   |
| `/knowledge/academy`        | Public     | Academy overview       | B    | Enter curriculum      | Curriculum entrance           | Animated pathway, band filter             | Medium       | Static pathway   | Full WCAG 2.2 AA | JS ≤250KB   |
| `/knowledge/courses`        | Public     | Course catalogue       | B    | Browse courses        | Course discovery              | Filterable grid, hover details            | Medium       | Static grid      | Full WCAG 2.2 AA | JS ≤250KB   |
| `/knowledge/courses/[id]`   | Public     | Course detail          | B    | Enroll/preview        | Course landing                | Animated syllabus, 3D module preview      | Medium       | Static syllabus  | Full WCAG 2.2 AA | JS ≤250KB   |
| `/knowledge/library`        | Public     | Digital library        | B    | Browse library        | Document/video access         | Searchable, filterable                    | Low          | Static list      | Full WCAG 2.2 AA | JS ≤250KB   |
| `/knowledge/research`       | Public     | Research hub           | B    | Browse research       | Publication access            | Network viz, filterable                   | Medium       | Static list      | Full WCAG 2.2 AA | JS ≤250KB   |
| `/knowledge/ai`             | Public     | AI capabilities        | B    | Explore AI            | AI system demos               | Interactive model explorer                | Medium       | Static demo      | Full WCAG 2.2 AA | JS ≤250KB   |
| `/support`                  | Public     | Support pathways       | B    | Get help              | Support options               | Contact form, FAQ accordion               | Low          | Static form      | Full WCAG 2.2 AA | JS ≤150KB   |
| `/teachers`                 | Teachers   | Teacher resources      | B    | Access resources      | Lesson plans, guides          | Filterable resource cards                 | Low          | Static cards     | Full WCAG 2.2 AA | JS ≤150KB   |
| `/donate`                   | Donors     | Donation page          | B    | Donate                | Donation flow                 | Progress bar, impact calculator           | Low          | Static form      | Full WCAG 2.2 AA | JS ≤150KB   |
| `/volunteer`                | Volunteers | Volunteer pathways     | B    | Sign up               | Volunteer flow                | Role cards, impact viz                    | Low          | Static cards     | Full WCAG 2.2 AA | JS ≤150KB   |
| `/get-involved`             | Public     | Participation paths    | B    | Choose path           | Participation overview        | Path cards, role filter                   | Low          | Static cards     | Full WCAG 2.2 AA | JS ≤150KB   |

---

### TIER C — FUNCTIONAL LEARNING (4 patterns + authenticated)

| Route Pattern                                            | Audience      | Objective          | Tier | Principal Action    | Purpose               | Recommended Visuals                        | Motion Level | Fallback | Accessibility    | Perf Budget |
| -------------------------------------------------------- | ------------- | ------------------ | ---- | ------------------- | --------------------- | ------------------------------------------ | ------------ | -------- | ---------------- | ----------- |
| `/curriculum`                                            | Learners      | Curriculum hub     | C    | Choose track        | Band/level overview   | Static band cards, progress                | Calm         | Static   | Full WCAG 2.2 AA | JS ≤200KB   |
| `/curriculum/levels/[level]`                             | Learners      | Level modules      | C    | Choose module       | Module list per level | Static module cards, progress              | Calm         | Static   | Full WCAG 2.2 AA | JS ≤200KB   |
| `/curriculum/levels/[level]/[module]`                    | Learners      | Module detail      | C    | Start module        | Module landing        | Static syllabus, optional 3D explorer      | Calm         | Static   | Full WCAG 2.2 AA | JS ≤200KB   |
| `/curriculum/levels/[level]/[module]/lessons/[lessonId]` | Learners      | Lesson player      | C    | Complete lesson     | Learning content      | Infographics, simulations, worked examples | Calm         | Static   | Full WCAG 2.2 AA | JS ≤200KB   |
| `/app`                                                   | Authenticated | My Bhavya home     | C    | Dashboard           | Personal overview     | Progress rings, upcoming                   | Calm         | Static   | Full WCAG 2.2 AA | JS ≤200KB   |
| `/app/learn`                                             | Students      | Learning dashboard | C    | Continue learning   | Course progress       | Progress rings, module list                | Calm         | Static   | Full WCAG 2.2 AA | JS ≤200KB   |
| `/app/community`                                         | Volunteers    | Community          | C    | Connect             | Community feed        | Simple feed                                | Calm         | Static   | Full WCAG 2.2 AA | JS ≤200KB   |
| `/app/knowledge`                                         | Researchers   | Knowledge          | C    | Research tools      | Search, graph         | Simple interface                           | Calm         | Static   | Full WCAG 2.2 AA | JS ≤200KB   |
| `/app/missions`                                          | All           | Missions           | C    | Track missions      | Personal mission view | Simple cards                               | Calm         | Static   | Full WCAG 2.2 AA | JS ≤200KB   |
| `/app/projects`                                          | All           | Projects           | C    | Manage projects     | Project list          | Simple cards                               | Calm         | Static   | Full WCAG 2.2 AA | JS ≤200KB   |
| `/app/credentials`                                       | All           | Credentials        | C    | View credentials    | Badges, certificates  | Simple grid                                | Calm         | Static   | Full WCAG 2.2 AA | JS ≤200KB   |
| `/app/contributions`                                     | All           | Contributions      | C    | Track contributions | Contribution log      | Simple list                                | Calm         | Static   | Full WCAG 2.2 AA | JS ≤200KB   |
| `/app/profile`                                           | All           | Profile            | C    | Manage profile      | Settings form         | Simple form                                | Calm         | Static   | Full WCAG 2.2 AA | JS ≤200KB   |

---

### TIER D — OPERATIONAL (19 routes)

| Route            | Audience | Objective      | Tier | Principal Action | Purpose            | Visuals         | Motion | Fallback | Accessibility    | Perf Budget |
| ---------------- | -------- | -------------- | ---- | ---------------- | ------------------ | --------------- | ------ | -------- | ---------------- | ----------- |
| `/login`         | All      | Sign in        | D    | Authenticate     | Auth form          | None            | Micro  | Static   | Full WCAG 2.2 AA | JS ≤100KB   |
| `/register`      | All      | Register       | D    | Create account   | Registration form  | None            | Micro  | Static   | Full WCAG 2.2 AA | JS ≤100KB   |
| `/verify`        | All      | Email verify   | D    | Verify email     | Verify page        | None            | Micro  | Static   | Full WCAG 2.2 AA | JS ≤100KB   |
| `/auth/callback` | All      | OAuth          | D    | Complete OAuth   | Callback           | None            | None   | Static   | Full WCAG 2.2 AA | JS ≤50KB    |
| `/forbidden`     | All      | Not permitted  | D    | Show notice      | Permission notice  | None            | None   | Static   | Full WCAG 2.2 AA | JS ≤50KB    |
| `/privacy`       | All      | Privacy policy | D    | Read policy      | Legal text         | None            | None   | Static   | Full WCAG 2.2 AA | JS ≤50KB    |
| `/accessibility` | All      | Accessibility  | D    | Read statement   | Accessibility info | None            | None   | Static   | Full WCAG 2.2 AA | JS ≤50KB    |
| `/os` (14)       | Admin    | Internal ops   | D    | Admin tasks      | Admin interface    | Functional only | Micro  | Static   | Full WCAG 2.2 AA | JS ≤200KB   |

---

## Missing Routes (Canonical → Not Implemented)

| Route             | Expected Tier | Status       | Priority |
| ----------------- | ------------- | ------------ | -------- |
| `/learning-paths` | B             | ❌ Not found | High     |
| `/schools`        | B             | ❌ Not found | High     |
| `/projects`       | B             | ❌ Not found | High     |
| `/faq`            | B             | ❌ Not found | Medium   |
| `/library`        | B             | ❌ Not found | High     |
| `/research`       | B             | ❌ Not found | High     |
| `/contact`        | B             | ❌ Not found | Medium   |
| `/support`        | B             | ❌ Not found | Medium   |
| `/teachers`       | B             | ❌ Not found | Medium   |
| `/privacy`        | D             | ❌ Not found | Required |
| `/accessibility`  | D             | ❌ Not found | Required |

---

## Implementation Status Legend

| Symbol | Meaning                           |
| ------ | --------------------------------- |
| ✅     | Implemented, matches tier spec    |
| ⚠️     | Implemented, needs tier alignment |
| 🔄     | In progress                       |
| ❌     | Not implemented                   |
| 📝     | Planned, spec ready               |

---

## Next: Create DESIGN-DIRECTION.md
