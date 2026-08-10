# DUPLICATION AUDIT

**Date:** 2026-08-09
**Last updated:** 2026-08-10
**Purpose:** Identify duplicate components across apps to eliminate during consolidation
**Scope:** 9 current apps + 14 archived apps (archived apps listed for historical reference)

---

## DUPLICATE SIDEBAR COMPONENTS (12 total)

| App              | File                                             | Lines | Uses platform-ui?  |
| ---------------- | ------------------------------------------------ | ----- | ------------------ |
| github-os        | `src/components/Sidebar.tsx`                     | 276   | **YES** (only one) |
| admin            | `src/components/AppShell.tsx` (includes sidebar) | 350+  | No                 |
| knowledge-studio | `src/components/AppShell.tsx`                    | 400+  | No                 |
| lesson-studio    | `src/components/AppShell.tsx`                    | 350+  | No                 |
| dashboard        | `src/components/AppShell.tsx`                    | 300+  | No                 |
| bhavya-ai-lab    | `src/components/Sidebar.tsx`                     | 250+  | No                 |
| forest           | `src/components/Sidebar.tsx`                     | 200+  | No                 |
| heritage         | `src/components/Sidebar.tsx`                     | 200+  | No                 |
| research         | `src/components/Sidebar.tsx`                     | 180+  | No                 |
| library          | `src/components/Sidebar.tsx`                     | 180+  | No                 |
| volunteer        | `src/components/Sidebar.tsx`                     | 180+  | No                 |
| ai-institute     | `src/components/AppShell.tsx` (header-based)     | 446   | No (uses its own)  |

**Resolution:** Replace ALL with `@bhavya/platform-ui` Sidebar + AppLayout. ai-institute's AppShell becomes the canonical shell.

---

## DUPLICATE SEARCH COMPONENTS (4 total)

| App              | File                              | Notes            |
| ---------------- | --------------------------------- | ---------------- |
| knowledge-studio | `src/components/SearchClient.tsx` | Full-text search |
| lesson-studio    | `src/components/SearchClient.tsx` | KO search        |
| bhavya-ai-lab    | `src/components/SearchClient.tsx` | Global search    |
| **platform-ui**  | `src/components/SearchBar.tsx`    | **CANONICAL**    |

**Resolution:** Replace all with `@bhavya/platform-ui` SearchBar.

---

## DUPLICATE HEADER/NAV COMPONENTS (3 total)

| App              | File                        | Notes      |
| ---------------- | --------------------------- | ---------- |
| admin            | `src/components/Header.tsx` | Admin nav  |
| knowledge-studio | `src/components/Header.tsx` | Studio nav |
| lesson-studio    | `src/components/Header.tsx` | Studio nav |

**Resolution:** Replace with `@bhavya/platform-ui` BhavyaNav or canonical AppShell header.

---

## DUPLICATE FOOTER COMPONENTS (2 total)

| App     | File                        | Notes                          |
| ------- | --------------------------- | ------------------------------ |
| admin   | `src/components/Footer.tsx` | Admin footer                   |
| website | `src/components/Footer.tsx` | Website footer (most complete) |

**Resolution:** Create canonical Footer in platform-ui, based on website's footer.

---

## DUPLICATE BUTTON IMPLEMENTATIONS (5 total)

| App             | File                           | Hardcoded Colors     |
| --------------- | ------------------------------ | -------------------- |
| ai-institute    | `src/components/ui/button.tsx` | `#1a3a2a`, `#c9a227` |
| forest          | `src/components/ui/button.tsx` | `#1a3a2a`, `#c9a227` |
| heritage        | `src/components/ui/button.tsx` | `#1a3a2a`, `#c9a227` |
| volunteer       | `src/components/ui/button.tsx` | `#1a3a2a`, `#c9a227` |
| **platform-ui** | `src/components/Button.tsx`    | Uses CSS variables   |

**Resolution:** Replace all with `@bhavya/platform-ui` Button.

---

## DUPLICATE CARD IMPLEMENTATIONS (4 total)

| App             | File                         |
| --------------- | ---------------------------- |
| ai-institute    | `src/components/ui/card.tsx` |
| forest          | `src/components/ui/card.tsx` |
| heritage        | `src/components/ui/card.tsx` |
| **platform-ui** | `src/components/Card.tsx`    |

**Resolution:** Replace all with `@bhavya/platform-ui` Card.

---

## DUPLICATE LOADING/SKELETON COMPONENTS (4 total)

| App             | File                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------- |
| ai-institute    | `src/components/ui/skeleton.tsx`                                                         |
| forest          | `src/components/ui/skeleton.tsx`                                                         |
| heritage        | `src/components/ui/skeleton.tsx`                                                         |
| **platform-ui** | `src/components/Skeleton.tsx` (+ CardSkeleton, ListSkeleton, TableSkeleton, TabSkeleton) |

**Resolution:** Replace all with `@bhavya/platform-ui` Skeleton variants.

---

## DUPLICATE MODAL/DIALOG COMPONENTS (3 total)

| App             | File                           |
| --------------- | ------------------------------ |
| ai-institute    | `src/components/ui/dialog.tsx` |
| forest          | `src/components/ui/dialog.tsx` |
| **platform-ui** | `src/components/Modal.tsx`     |

**Resolution:** Replace all with `@bhavya/platform-ui` Modal.

---

## DUPLICATE BADGE COMPONENTS (3 total)

| App             | File                                           |
| --------------- | ---------------------------------------------- |
| ai-institute    | `src/components/ui/badge.tsx`                  |
| forest          | `src/components/ui/badge.tsx`                  |
| **platform-ui** | `src/components/Badge.tsx` + `StatusBadge.tsx` |

**Resolution:** Replace all with `@bhavya/platform-ui` Badge/StatusBadge.

---

## DUPLICATE AVATAR COMPONENTS (2 total)

| App             | File                           |
| --------------- | ------------------------------ |
| ai-institute    | `src/components/ui/avatar.tsx` |
| **platform-ui** | `src/components/Avatar.tsx`    |

**Resolution:** Replace with `@bhavya/platform-ui` Avatar.

---

## DESIGN TOKEN CONFLICTS (6 competing systems)

| System        | Location                                     | Primary Color          | Tailwind Version |
| ------------- | -------------------------------------------- | ---------------------- | ---------------- |
| platform-ui   | `packages/platform-ui/src/styles/tokens.css` | `#3b82f6` (blue)       | v4               |
| ai-institute  | `apps/ai-institute/src/app/globals.css`      | `#1a3a2a` (forest)     | v4               |
| website       | `apps/website/src/app/globals.css`           | `#15803d` (forest-700) | None (vanilla)   |
| design-system | `apps/design-system/src/app/globals.css`     | `#1a56db` (BLUE!)      | v3               |
| github-os     | `apps/github-os/src/app/globals.css`         | Tailwind defaults      | v4               |
| transparency  | `apps/transparency/src/app/globals.css`      | `#15803d`              | None (vanilla)   |

**Resolution:** Adopt ai-institute's tokens as canonical. Rebuild platform-ui tokens.css.

---

## AUTH SYSTEM CONFLICTS (2 systems)

| System           | Location              | Type                 |
| ---------------- | --------------------- | -------------------- |
| ai-institute     | `src/lib/api-auth.ts` | Custom session-based |
| knowledge-studio | `next-auth` + Prisma  | NextAuth.js          |

**Resolution:** Unify into single auth system (decision pending).

---

## DUPLICATE API ROUTES

| Route Pattern | Apps                                 |
| ------------- | ------------------------------------ |
| `/api/health` | ioc, github-os, social-os            |
| `/api/stats`  | ioc, dashboard, github-os            |
| `/api/search` | knowledge, knowledge-studio, library |

**Resolution:** Consolidate into canonical API routes in ai-institute.

---

## SUMMARY

| Category             | Duplicate Count | Resolution                     |
| -------------------- | --------------- | ------------------------------ |
| Sidebars             | 12              | → platform-ui Sidebar          |
| Search components    | 4               | → platform-ui SearchBar        |
| Headers/Nav          | 3               | → platform-ui BhavyaNav        |
| Footers              | 2               | → platform-ui Footer (new)     |
| Buttons              | 5               | → platform-ui Button           |
| Cards                | 4               | → platform-ui Card             |
| Loading/Skeleton     | 4               | → platform-ui Skeleton         |
| Modals               | 3               | → platform-ui Modal            |
| Badges               | 3               | → platform-ui Badge            |
| Avatars              | 2               | → platform-ui Avatar           |
| Design token systems | 6               | → platform-ui tokens (rebuilt) |
| Auth systems         | 2               | → unified auth                 |
| API route patterns   | 3+              | → consolidated routes          |
| **Total duplicates** | **46+**         | **→ platform-ui**              |
