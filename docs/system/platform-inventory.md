# Platform Inventory

**Generated:** 2026-08-06 02:30 IST

---

## Applications (23)

| #   | Name                        | Package                     | Version | Port | Routes | Workspace Deps                                                 | Lint | Typecheck | Vercel    |
| --- | --------------------------- | --------------------------- | ------- | ---- | ------ | -------------------------------------------------------------- | ---- | --------- | --------- |
| 1   | website                     | @bhavya/website             | 0.9.0   | 3000 | 22     | mission-runtime, sdk, ui                                       | YES  | YES       | DUPLICATE |
| 2   | admin                       | @bhavya/admin-app           | 0.1.0   | 3003 | 8      | mission-runtime, sdk                                           | YES  | YES       | YES       |
| 3   | ai-institute                | @bhavya/ai-institute        | 0.1.0   | 3030 | 13     | platform-ui, learning-runtime, project-runtime, impact-runtime | NO   | NO        | NO        |
| 4   | bhavya-ai-lab               | @bhavya/bhavya-ai-lab       | 0.1.0   | 3012 | 21     | (none)                                                         | YES  | NO        | YES       |
| 5   | bhavya-intelligence-network | bhavya-intelligence-network | 1.0.0   | 3050 | 3      | 14 packages                                                    | NO   | NO        | NO        |
| 6   | capability-center           | capability-center           | 0.1.0   | 3041 | 1      | 6 packages                                                     | NO   | NO        | NO        |
| 7   | dashboard                   | @bhavya/dashboard           | 0.1.0   | 3010 | 16     | content-core, intelligence, ui                                 | YES  | YES       | YES       |
| 8   | design-system               | @bhavya/design-system       | 0.9.0   | 3010 | 6      | (none)                                                         | YES  | NO        | YES       |
| 9   | docs                        | @bhavya/docs-app            | 0.9.0   | 3002 | 9      | mission-runtime, sdk                                           | YES  | YES       | YES       |
| 10  | forest                      | @bhavya/forest              | 0.7.0   | 3004 | 15     | content-core, maps, mission-runtime, ui                        | YES  | YES       | YES       |
| 11  | github-intelligence-lab     | github-intelligence-lab     | 0.1.0   | 3060 | 1      | 9 packages                                                     | NO   | NO        | NO        |
| 12  | github-os                   | @bhavya/github-os           | 0.1.0   | 3070 | 48     | events, platform, platform-ui, types                           | NO   | YES       | NO        |
| 13  | heritage                    | @bhavya/heritage            | 0.8.0   | 3005 | 14     | content-core, ui                                               | YES  | YES       | YES       |
| 14  | ioc                         | @bhavya/ioc                 | 0.1.0   | 3090 | 20     | (none)                                                         | NO   | YES       | NO        |
| 15  | knowledge                   | @bhavya/knowledge           | 0.6.0   | 3007 | 18     | content-core, intelligence, mission-runtime, ui                | YES  | YES       | YES       |
| 16  | knowledge-studio            | knowledge-studio            | 0.1.0   | 3030 | 24     | (none)                                                         | NO   | NO        | NO        |
| 17  | lesson-studio               | @bhavya/lesson-studio       | 0.1.0   | 3020 | 36     | (none)                                                         | YES  | YES       | NO        |
| 18  | library                     | @bhavya/library             | 0.6.0   | 3008 | 6      | content-core                                                   | YES  | YES       | YES       |
| 19  | open-source-intelligence    | open-source-intelligence    | 0.1.0   | 3040 | 1      | 11 packages                                                    | NO   | NO        | NO        |
| 20  | research                    | @bhavya/research            | 0.6.0   | 3009 | 11     | content-core                                                   | YES  | YES       | YES       |
| 21  | social-os                   | @bhavya/social-os           | 0.1.0   | 3080 | 11     | events, platform, platform-ui, types                           | NO   | YES       | NO        |
| 22  | transparency                | @bhavya/transparency        | 0.1.0   | 3003 | 7      | (none)                                                         | YES  | YES       | YES       |
| 23  | volunteer                   | @bhavya/volunteer           | 0.9.0   | 3006 | 15     | content-core, ui                                               | YES  | YES       | YES       |

---

## Packages (51 with package.json, 4 empty directories)

| #   | Name                 | Package                      | Version | Private | Has Entry | Has Build | Has Test    | Workspace Deps                    |
| --- | -------------------- | ---------------------------- | ------- | ------- | --------- | --------- | ----------- | --------------------------------- |
| 1   | agent-engine         | @bhavya/agent-engine         | 0.1.0   | NO      | YES       | tsc       | NO          | kernel                            |
| 2   | agent-platform       | @bhavya/agent-platform       | 0.1.0   | YES     | YES       | tsc       | NO          | (none)                            |
| 3   | ai                   | @bhavya/ai                   | 0.1.0   | NO      | YES       | NO        | vitest      | platform, types                   |
| 4   | analyzers            | @bhavya/analyzers            | 1.0.0   | NO      | YES       | NO        | NO          | intelligence, capability-registry |
| 5   | api                  | @bhavya/api                  | 0.1.0   | NO      | YES       | NO        | vitest      | platform, security                |
| 6   | auth                 | (empty directory)            | -       | -       | -         | -         | -           | -                                 |
| 7   | bar                  | (empty directory)            | -       | -       | -         | -         | -           | -                                 |
| 8   | bdl                  | @bhavya/bdl                  | 0.1.0   | YES     | YES       | NO        | NO          | (none)                            |
| 9   | bdx                  | (empty directory)            | -       | -       | -         | -         | -           | -                                 |
| 10  | bee                  | @bhavya/bee                  | 0.1.0   | NO      | YES       | NO        | node --test | runtime                           |
| 11  | bhavya-ai-lab        | (empty directory)            | -       | -       | -         | -         | -           | -                                 |
| 12  | branding             | @bhavya/branding             | 0.1.0   | YES     | YES       | tsc       | NO          | (none)                            |
| 13  | browser-automation   | @bhavya/browser-automation   | 1.0.0   | NO      | YES       | NO        | NO          | intelligence                      |
| 14  | capability-registry  | @bhavya/capability-registry  | 1.0.0   | NO      | YES       | NO        | NO          | intelligence, platform            |
| 15  | charts               | @bhavya/charts               | 0.1.0   | YES     | YES       | tsc       | NO          | ui                                |
| 16  | cli                  | @bhavya/cli                  | 1.0.0   | NO      | YES       | tsc       | NO          | kernel                            |
| 17  | config               | @bhavya/config               | 0.1.0   | YES     | YES       | tsc       | NO          | (none)                            |
| 18  | constitution         | @bhavya/constitution         | 1.0.0   | NO      | YES       | NO        | node --test | (none)                            |
| 19  | content-core         | @bhavya/content-core         | 0.6.0   | YES     | YES       | NO        | vitest      | (none)                            |
| 20  | crawlers             | @bhavya/crawlers             | 1.0.0   | NO      | YES       | tsc       | NO          | intelligence, platform            |
| 21  | database             | @bhavya/database             | 0.1.0   | NO      | YES       | NO        | vitest      | (none)                            |
| 22  | docs                 | @bhavya/docs                 | 0.1.0   | YES     | YES       | tsc       | NO          | ui                                |
| 23  | eslint               | @bhavya/eslint               | 0.1.0   | YES     | NO        | NO        | NO          | (none)                            |
| 24  | events               | @bhavya/events               | 0.1.0   | NO      | YES       | NO        | vitest      | platform, types                   |
| 25  | github-intelligence  | @bhavya/github-intelligence  | 1.0.0   | NO      | YES       | NO        | NO          | intelligence, capability-registry |
| 26  | icons                | @bhavya/icons                | 0.1.0   | YES     | YES       | tsc       | NO          | (none)                            |
| 27  | impact-runtime       | @bhavya/impact-runtime       | 0.1.0   | NO      | YES       | NO        | NO          | (none)                            |
| 28  | intelligence         | @bhavya/intelligence         | 1.0.0   | NO      | YES       | tsc       | NO          | (none)                            |
| 29  | kernel               | @bhavya/kernel               | 3.1.0   | NO      | YES       | tsc       | jest        | 7 engines                         |
| 30  | knowledge-engine     | @bhavya/knowledge-engine     | 0.1.0   | NO      | YES       | tsc       | NO          | kernel                            |
| 31  | knowledge-extraction | @bhavya/knowledge-extraction | 1.0.0   | NO      | YES       | NO        | NO          | intelligence, platform            |
| 32  | learning-runtime     | @bhavya/learning-runtime     | 0.1.0   | NO      | YES       | NO        | NO          | (none)                            |
| 33  | maps                 | @bhavya/maps                 | 0.1.0   | YES     | YES       | tsc       | NO          | ui                                |
| 34  | mcp-manager          | @bhavya/mcp-manager          | 1.0.0   | NO      | YES       | NO        | NO          | intelligence, capability-registry |
| 35  | memory-engine        | @bhavya/memory-engine        | 0.1.0   | NO      | YES       | tsc       | NO          | kernel                            |
| 36  | mission-runtime      | @bhavya/mission-runtime      | 0.6.0   | YES     | YES       | NO        | NO          | (none)                            |
| 37  | notifications        | @bhavya/notifications        | 0.1.0   | NO      | YES       | NO        | vitest      | platform, types                   |
| 38  | planner-engine       | @bhavya/planner-engine       | 0.1.0   | NO      | YES       | tsc       | NO          | kernel                            |
| 39  | platform             | @bhavya/platform             | 0.1.0   | NO      | YES       | NO        | vitest      | (none)                            |
| 40  | platform-ui          | @bhavya/platform-ui          | 0.1.0   | NO      | YES       | NO        | NO          | (none)                            |
| 41  | plugin-manager       | @bhavya/plugin-manager       | 1.0.0   | NO      | YES       | NO        | NO          | intelligence, capability-registry |
| 42  | project-runtime      | @bhavya/project-runtime      | 0.1.0   | NO      | YES       | NO        | NO          | (none)                            |
| 43  | providers            | @bhavya/providers            | 0.1.0   | NO      | YES       | NO        | NO          | types                             |
| 44  | runtime              | @bhavya/runtime              | 0.1.0   | NO      | YES       | NO        | node --test | (none)                            |
| 45  | scheduler-engine     | @bhavya/scheduler-engine     | 0.1.0   | NO      | YES       | tsc       | NO          | kernel                            |
| 46  | sdk                  | @bhavya/sdk                  | 0.1.0   | YES     | YES       | NO        | NO          | mission-runtime                   |
| 47  | search-engine        | @bhavya/search-engine        | 0.1.0   | NO      | YES       | tsc       | NO          | kernel                            |
| 48  | security             | @bhavya/security             | 0.1.0   | NO      | YES       | NO        | vitest      | (none)                            |
| 49  | technology-radar     | @bhavya/technology-radar     | 1.0.0   | NO      | YES       | NO        | NO          | intelligence, capability-registry |
| 50  | types                | @bhavya/types                | 0.1.0   | NO      | YES       | NO        | NO          | (none)                            |
| 51  | typescript           | @bhavya/typescript           | 0.1.0   | YES     | NO        | NO        | NO          | (none)                            |
| 52  | ui                   | @bhavya/ui                   | 0.1.0   | YES     | YES       | NO        | NO          | bdl                               |
| 53  | workflow-engine      | @bhavya/workflow-engine      | 0.1.0   | NO      | YES       | tsc       | NO          | kernel                            |
| 54  | workflows            | @bhavya/workflows            | 0.1.0   | NO      | YES       | NO        | vitest      | platform, types, events           |

---

## Root-Level Non-Workspace Projects

| Directory      | Type                         | Standalone | Has package.json | Has .git |
| -------------- | ---------------------------- | ---------- | ---------------- | -------- |
| bhavya-ai-lab/ | Node.js monorepo (npm)       | YES        | YES              | NO       |
| openhuman/     | Rust+React desktop app       | YES        | YES              | YES      |
| website/       | Astro documentation site     | YES        | YES              | YES      |
| prototypes/    | Reference/evaluation         | NO         | Sub-dirs only    | NO       |
| docs/          | Documentation directory      | NO         | NO               | NO       |
| scripts/       | Deployment utilities         | NO         | NO               | NO       |
| bar/           | Architecture registry (JSON) | NO         | NO               | NO       |
| specs/         | Product specifications       | NO         | NO               | NO       |
| .ai/           | AI runtime context system    | NO         | NO               | NO       |

---

## Statistics

| Metric                             | Count                             |
| ---------------------------------- | --------------------------------- |
| Total apps                         | 23                                |
| Total packages (with package.json) | 51                                |
| Empty package directories          | 4 (auth, bar, bdx, bhavya-ai-lab) |
| Root-level standalone projects     | 3                                 |
| Total routes across all apps       | 336                               |
| Apps with lint script              | 12                                |
| Apps with typecheck script         | 15                                |
| Apps with vercel.json              | 12                                |
| Packages with build script         | 18                                |
| Packages with test script          | 14                                |
| Packages with README               | 3                                 |
