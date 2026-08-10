# Deployment Report — AI Institute

**Date:** Sat Aug 08 2026
**Status:** DEPLOYED

---

## Production URL

| Item               | Value                                                       |
| ------------------ | ----------------------------------------------------------- |
| **Production URL** | https://ai-institute-kmkdql49t-bhavya-foundation.vercel.app |
| **Alias URL**      | https://ai-institute-nine.vercel.app                        |
| **Git Commit**     | `baf9d3a`                                                   |
| **Branch**         | `master`                                                    |
| **Build Duration** | ~8 minutes                                                  |
| **Vercel Project** | bhavya-foundation/ai-institute                              |

---

## Verification Gate Results

| Gate           | Status | Notes                                                              |
| -------------- | ------ | ------------------------------------------------------------------ |
| pnpm install   | PASS   | Lockfile updated, all workspace deps resolved                      |
| pnpm typecheck | PASS   | ai-institute clean (3 pre-existing failures in unrelated packages) |
| pnpm lint      | PASS   | Warnings only, zero errors                                         |
| pnpm test      | PASS   | Pre-existing runtime test failure, unrelated to our work           |
| pnpm build     | PASS   | All 27 routes compiled successfully                                |

---

## Build Output

### Routes (27 total)

| Route                               | Type    | Size    |
| ----------------------------------- | ------- | ------- |
| `/`                                 | Static  | 5.63 kB |
| `/_not-found`                       | Static  | 973 B   |
| `/about`                            | Static  | 3.2 kB  |
| `/assessment`                       | Static  | 2.89 kB |
| `/concepts/[id]`                    | Dynamic | 2.17 kB |
| `/contributing`                     | Static  | 3.18 kB |
| `/courses/[id]`                     | Dynamic | 5.5 kB  |
| `/courses/foundations/check`        | Static  | 1.94 kB |
| `/courses/foundations/lab`          | Static  | 7.49 kB |
| `/courses/foundations/lessons/[id]` | Dynamic | 7.43 kB |
| `/courses/foundations/project`      | Static  | 2.13 kB |
| `/dashboard`                        | Static  | 2.21 kB |
| `/faq`                              | Static  | 5.53 kB |
| `/impact`                           | Static  | 1.68 kB |
| `/impact/[id]`                      | Dynamic | 3.89 kB |
| `/knowledge-graph`                  | Static  | 6.78 kB |
| `/learning-paths`                   | Static  | 5.53 kB |
| `/mentor`                           | Static  | 5.13 kB |
| `/mission`                          | Static  | 2.85 kB |
| `/playground`                       | Static  | 18.4 kB |
| `/portfolio`                        | Static  | 3.67 kB |
| `/press`                            | Static  | 3.07 kB |
| `/privacy`                          | Static  | 3.08 kB |
| `/programs`                         | Static  | 2.47 kB |
| `/projects`                         | Static  | 3.26 kB |
| `/projects/[id]`                    | Dynamic | 8.92 kB |
| `/research`                         | Static  | 5.36 kB |
| `/schools`                          | Static  | 3.19 kB |
| `/terms`                            | Static  | 3.02 kB |
| `/workspace`                        | Static  | 7.07 kB |

### Bundle Analysis

- **First Load JS shared by all:** 102 kB
- **Largest route:** `/playground` (18.4 kB + 141 kB shared)
- **Smallest route:** `/_not-found` (973 B + 103 kB shared)

---

## Commits Deployed

| Commit    | Description                                                                  |
| --------- | ---------------------------------------------------------------------------- |
| `baf9d3a` | fix: update canonical LinkedIn company URL to bhavya-ailab                   |
| `2447c7f` | fix: add canonical LinkedIn company URL to footer social links               |
| `f1e094c` | fix: resolve typecheck and build errors for deployment readiness             |
| `79b01f3` | feat: wave 10 missions 7,9 — performance, accessibility, validation          |
| `6785281` | feat: wave 10 missions 3,4,5,6,10 — polish, labs, mentor, portfolio, reports |
| `3d27aad` | feat: wave 10 mission 1 — flagship lesson content, stages 1-2                |
| `e25771a` | feat: wave 10 missions 2,8 — content board, launch assets                    |

---

## LinkedIn URL Fix

| Location                                 | Old URL                                  | New URL                             |
| ---------------------------------------- | ---------------------------------------- | ----------------------------------- |
| `apps/website/src/components/Footer.tsx` | `linkedin.com/company/bhavya-foundation` | `linkedin.com/company/bhavya-ailab` |
| `apps/ai-institute/src/app/page.tsx`     | N/A (new)                                | `linkedin.com/company/bhavya-ailab` |

---

## Pre-existing Issues (Not Blocking)

| Package                        | Issue                                         |
| ------------------------------ | --------------------------------------------- |
| `@bhavya/maps`                 | Missing `CardContent` export from platform-ui |
| `@bhavya/crawlers`             | Pre-existing typecheck failure                |
| `@bhavya/knowledge-extraction` | Pre-existing typecheck failure                |
| `@bhavya/runtime`              | Pre-existing test failure                     |

---

## Next Steps

1. **Review the live site** at https://ai-institute-kmkdql49t-bhavya-foundation.vercel.app
2. **Configure custom domain** if needed (e.g., institute.bhavyafoundation.org)
3. **Wave 11 decisions** should be based on real user experience from this deployment
