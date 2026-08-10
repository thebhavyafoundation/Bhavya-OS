# Maturity Matrix

**Generated:** 2026-08-06 02:35 IST

---

## Maturity Levels

| Level | Name                 | Criteria                    |
| ----- | -------------------- | --------------------------- |
| 0     | Idea                 | Notes or placeholder only   |
| 1     | Scaffolded           | Project structure exists    |
| 2     | Functional           | Core functionality works    |
| 3     | Integrated           | Connected with the platform |
| 4     | Production Candidate | Stable and deployable       |
| 5     | Production           | Live and maintained         |

---

## Application Maturity

| App                             | Maturity | Evidence                                                                                                                   |
| ------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| **website**                     | **4**    | v0.9.0, 22 routes, lint+typecheck pass, deployed to Vercel (ERROR state), GSAP animations, trust layer, knowledge packages |
| **dashboard**                   | **4**    | v0.1.0, 16 routes, lint+typecheck pass, deployed to Vercel READY, decision-support/insights/KPIs/trends API routes         |
| **forest**                      | **4**    | v0.7.0, 15 routes, lint+typecheck pass, deployed READY, missions/plantings/sites/monitoring, maps integration              |
| **heritage**                    | **4**    | v0.8.0, 14 routes, lint+typecheck pass, deployed READY, assessments/assets/conservation/missions                           |
| **knowledge**                   | **4**    | v0.6.0, 18 routes, lint+typecheck pass, deployed READY, documents/graph/search/collections                                 |
| **library**                     | **4**    | v0.6.0, 6 routes, lint+typecheck pass, deployed READY, browse/collections/read/search                                      |
| **research**                    | **4**    | v0.6.0, 11 routes, lint+typecheck pass, deployed READY, projects/evidence/reviews                                          |
| **volunteer**                   | **4**    | v0.9.0, 15 routes, lint+typecheck pass, deployed READY, volunteers/skills/training/assignments                             |
| **admin**                       | **3**    | v0.1.0, 8 routes, lint+typecheck pass, deployed READY, audit/content/releases/users API                                    |
| **transparency**                | **3**    | v0.1.0, 7 routes, lint+typecheck pass, deployed READY, ADR/RFC/standards API only                                          |
| **design-system**               | **3**    | v0.9.0, 6 routes, lint pass, deployed READY, components/tokens/playground                                                  |
| **docs**                        | **3**    | v0.9.0, 9 routes, lint+typecheck pass, deployed READY, governance/decisions/search                                         |
| **bhavya-ai-lab**               | **3**    | v0.1.0, 21 routes, lint pass, deployed READY, knowledge/courses/projects runtime                                           |
| **ioc**                         | **3**    | v0.1.0, 20 routes, typecheck pass, NOT deployed, actions/events/OKR/production/risks                                       |
| **github-os**                   | **3**    | v0.1.0, 48 routes, typecheck pass, NOT deployed, repository intelligence + knowledge graph                                 |
| **lesson-studio**               | **3**    | v0.1.0, 36 routes, lint+typecheck pass, NOT deployed, courses/lessons/knowledge/pipeline                                   |
| **social-os**                   | **3**    | v0.1.0, 11 routes, typecheck pass, NOT deployed, campaigns/publications/pulse                                              |
| **knowledge-studio**            | **2**    | v0.1.0, 24 routes, NO lint/typecheck, NOT deployed, artifacts/pipelines/versions                                           |
| **ai-institute**                | **2**    | v0.1.0, 13 routes, NO lint/typecheck, NOT deployed, courses/dashboard/impact                                               |
| **bhavya-intelligence-network** | **2**    | v1.0.0, 3 routes, NO lint/typecheck, NOT deployed, approval/loop API only                                                  |
| **capability-center**           | **1**    | v0.1.0, 1 route, NO lint/typecheck, NOT deployed, root page only                                                           |
| **github-intelligence-lab**     | **1**    | v0.1.0, 1 route, NO lint/typecheck, NOT deployed, root page only                                                           |
| **open-source-intelligence**    | **1**    | v0.1.0, 1 route, NO lint/typecheck, NOT deployed, root page only                                                           |

---

## Package Maturity

| Package                  | Maturity | Evidence                                                          |
| ------------------------ | -------- | ----------------------------------------------------------------- |
| **kernel**               | **4**    | v3.1.0, tsc+jest, README, 7 engine dependencies, core of platform |
| **platform**             | **4**    | v0.1.0, vitest, fs/id/validation/logging/config exports           |
| **types**                | **4**    | v0.1.0, 11 type modules (knowledge, user, workflow, events, etc.) |
| **events**               | **4**    | v0.1.0, vitest, bus export, platform+types deps                   |
| **intelligence**         | **4**    | v1.0.0, tsc, no deps, foundation for 10+ packages                 |
| **capability-registry**  | **4**    | v1.0.0, intelligence+platform deps                                |
| **content-core**         | **4**    | v0.6.0, vitest, README, used by 7 apps                            |
| **constitution**         | **4**    | v1.0.0, node --test, 7 module exports                             |
| **runtime**              | **4**    | v0.1.0, node --test, README, 6 module exports                     |
| **sdk**                  | **4**    | v0.1.0, mission-runtime dep, 6 exports                            |
| **mission-runtime**      | **4**    | v0.6.0, 17 module exports, used by website/admin/docs             |
| **ui**                   | **3**    | v0.1.0, bdl dep, no tests, no build                               |
| **platform-ui**          | **3**    | v0.1.0, components/layouts/hooks/styles exports, no tests         |
| **bdl**                  | **3**    | v0.1.0, entry point exists, no tests                              |
| **branding**             | **3**    | v0.1.0, tsc build, no tests                                       |
| **charts**               | **3**    | v0.1.0, tsc build, ui dep                                         |
| **icons**                | **3**    | v0.1.0, tsc build                                                 |
| **maps**                 | **3**    | v0.1.0, tsc build, ui dep                                         |
| **docs**                 | **3**    | v0.1.0, tsc build, ui dep                                         |
| **config**               | **3**    | v0.1.0, tsc build                                                 |
| **eslint**               | **3**    | v0.1.0, base+next exports                                         |
| **typescript**           | **3**    | v0.1.0, base+next+react-library JSON exports                      |
| **agent-engine**         | **3**    | v0.1.0, tsc, kernel dep                                           |
| **workflow-engine**      | **3**    | v0.1.0, tsc, kernel dep                                           |
| **memory-engine**        | **3**    | v0.1.0, tsc, kernel dep                                           |
| **knowledge-engine**     | **3**    | v0.1.0, tsc, kernel dep                                           |
| **search-engine**        | **3**    | v0.1.0, tsc, kernel dep                                           |
| **planner-engine**       | **3**    | v0.1.0, tsc, kernel dep                                           |
| **scheduler-engine**     | **3**    | v0.1.0, tsc, kernel dep                                           |
| **cli**                  | **3**    | v1.0.0, tsc, kernel dep, bin entry                                |
| **api**                  | **3**    | v0.1.0, vitest, platform+security deps                            |
| **security**             | **3**    | v0.1.0, vitest, auth/rate-limit/crypto exports                    |
| **database**             | **3**    | v0.1.0, vitest, sqlite/migrate/repository exports                 |
| **notifications**        | **3**    | v0.1.0, vitest, manager+channels exports                          |
| **workflows**            | **3**    | v0.1.0, vitest, engine+queue exports                              |
| **ai**                   | **3**    | v0.1.0, vitest, provider+prompt+context exports                   |
| **providers**            | **3**    | v0.1.0, git/storage/email/search exports                          |
| **agent-platform**       | **2**    | v0.1.0, tsc, adapters+research exports                            |
| **analyzers**            | **2**    | v1.0.0, intelligence+capability-registry deps                     |
| **browser-automation**   | **2**    | v1.0.0, intelligence dep                                          |
| **crawlers**             | **2**    | v1.0.0, tsc, intelligence+platform deps                           |
| **github-intelligence**  | **2**    | v1.0.0, intelligence+capability-registry deps                     |
| **knowledge-extraction** | **2**    | v1.0.0, intelligence+platform deps                                |
| **mcp-manager**          | **2**    | v1.0.0, intelligence+capability-registry deps                     |
| **plugin-manager**       | **2**    | v1.0.0, intelligence+capability-registry deps                     |
| **technology-radar**     | **2**    | v1.0.0, intelligence+capability-registry deps                     |
| **impact-runtime**       | **2**    | v0.1.0, no deps, no tests                                         |
| **learning-runtime**     | **2**    | v0.1.0, no deps, no tests                                         |
| **project-runtime**      | **2**    | v0.1.0, no deps, no tests                                         |
| **bee**                  | **2**    | v0.1.0, node --test, runtime dep                                  |

---

## Maturity Distribution

### Applications

| Level                    | Count | Apps                                                                                              |
| ------------------------ | ----- | ------------------------------------------------------------------------------------------------- |
| 5 - Production           | 0     | (none)                                                                                            |
| 4 - Production Candidate | 8     | website, dashboard, forest, heritage, knowledge, library, research, volunteer                     |
| 3 - Integrated           | 7     | admin, transparency, design-system, docs, bhavya-ai-lab, ioc, github-os, lesson-studio, social-os |
| 2 - Functional           | 4     | knowledge-studio, ai-institute, bhavya-intelligence-network                                       |
| 1 - Scaffolded           | 3     | capability-center, github-intelligence-lab, open-source-intelligence                              |
| 0 - Idea                 | 0     | (none)                                                                                            |

### Packages

| Level                    | Count | Packages                                                                                                                                                                                                                                                                      |
| ------------------------ | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5 - Production           | 0     | (none)                                                                                                                                                                                                                                                                        |
| 4 - Production Candidate | 11    | kernel, platform, types, events, intelligence, capability-registry, content-core, constitution, runtime, sdk, mission-runtime                                                                                                                                                 |
| 3 - Integrated           | 27    | ui, platform-ui, bdl, branding, charts, icons, maps, docs, config, eslint, typescript, agent-engine, workflow-engine, memory-engine, knowledge-engine, search-engine, planner-engine, scheduler-engine, cli, api, security, database, notifications, workflows, ai, providers |
| 2 - Functional           | 13    | agent-platform, analyzers, browser-automation, crawlers, github-intelligence, knowledge-extraction, mcp-manager, plugin-manager, technology-radar, impact-runtime, learning-runtime, project-runtime, bee                                                                     |
| 1 - Scaffolded           | 0     | (none)                                                                                                                                                                                                                                                                        |
| 0 - Idea                 | 0     | (none)                                                                                                                                                                                                                                                                        |

---

## Key Gaps

1. **Zero Production-level projects** — Nothing has reached Level 5
2. **8 apps at Level 4 but none deployed to production** — All Vercel deployments are either ERROR or READY but not promoted
3. **10 apps missing lint/typecheck** — ai-institute, bhavya-intelligence-network, capability-center, github-intelligence-lab, knowledge-studio, open-source-intelligence
4. **4 empty package directories** — auth, bar, bdx, bhavya-ai-lab (packages)
5. **3 packages with README** — Only kernel, content-core, runtime have documentation
6. **No test coverage for 37 of 51 packages** — Only 14 packages have test scripts
