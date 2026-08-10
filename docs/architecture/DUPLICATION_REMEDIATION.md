# DUPLICATION REMEDIATION TRACKER

**Date:** 2026-08-09
**Status:** IN PROGRESS

---

## TOKEN ARCHITECTURE

| Item               | Before                                     | After                                      | Status       |
| ------------------ | ------------------------------------------ | ------------------------------------------ | ------------ |
| Token distribution | 22 independent CSS files                   | 1 canonical source + auto-generated copies | **FIXED**    |
| Canonical source   | packages/platform-ui/src/styles/tokens.css | Same                                       | **VERIFIED** |
| Sync mechanism     | None                                       | scripts/sync-tokens.mjs + postinstall      | **FIXED**    |
| Enforcement        | None                                       | tokens:check CI script                     | **FIXED**    |

---

## COMPONENT REMEDIATION

### Sidebar (12 duplicates → 1 canonical)

| App              | Old File                   | Status     | Action                  |
| ---------------- | -------------------------- | ---------- | ----------------------- |
| ioc              | src/components/Sidebar.tsx | TO MIGRATE | Replace with AppSidebar |
| forest           | src/components/Sidebar.tsx | TO MIGRATE | Replace with AppSidebar |
| volunteer        | src/components/Sidebar.tsx | TO MIGRATE | Replace with AppSidebar |
| heritage         | src/components/Sidebar.tsx | TO MIGRATE | Replace with AppSidebar |
| research         | src/components/Sidebar.tsx | TO MIGRATE | Replace with AppSidebar |
| library          | src/components/Sidebar.tsx | TO MIGRATE | Replace with AppSidebar |
| knowledge        | src/components/Sidebar.tsx | TO MIGRATE | Replace with AppSidebar |
| bhavya-ai-lab    | src/components/sidebar.tsx | TO MIGRATE | Replace with AppSidebar |
| lesson-studio    | src/components/sidebar.tsx | TO MIGRATE | Replace with AppSidebar |
| knowledge-studio | src/components/sidebar.tsx | TO MIGRATE | Replace with AppSidebar |
| design-system    | src/components/Sidebar.tsx | TO MIGRATE | Replace with AppSidebar |
| github-os        | src/components/Sidebar.tsx | TO MIGRATE | Replace with AppSidebar |

### SearchClient (3 duplicates → 1 canonical)

| App       | Old File                        | Status     | Action                 |
| --------- | ------------------------------- | ---------- | ---------------------- |
| docs      | src/components/SearchClient.tsx | TO MIGRATE | Replace with SearchBar |
| library   | src/components/SearchClient.tsx | TO MIGRATE | Replace with SearchBar |
| knowledge | src/components/SearchClient.tsx | TO MIGRATE | Replace with SearchBar |

### Button (1 duplicate → 1 canonical)

| App     | Old File                     | Status     | Action              |
| ------- | ---------------------------- | ---------- | ------------------- |
| website | src/components/ui/Button.tsx | TO MIGRATE | Replace with Button |

### Badge (1 duplicate → 1 canonical)

| App     | Old File                    | Status     | Action             |
| ------- | --------------------------- | ---------- | ------------------ |
| website | src/components/ui/Badge.tsx | TO MIGRATE | Replace with Badge |

### EmptyState (1 duplicate → 1 canonical)

| App           | Old File                       | Status     | Action                  |
| ------------- | ------------------------------ | ---------- | ----------------------- |
| bhavya-ai-lab | src/components/empty-state.tsx | TO MIGRATE | Replace with EmptyState |

### StatCard (2 duplicates → 1 canonical)

| App           | Old File                                      | Status     | Action                |
| ------------- | --------------------------------------------- | ---------- | --------------------- |
| bhavya-ai-lab | src/components/stat-card.tsx                  | TO MIGRATE | Replace with StatCard |
| github-os     | src/components/Widgets.tsx (StatCard portion) | TO MIGRATE | Extract to StatCard   |

### Header/Nav (2 duplicates → 1 canonical)

| App     | Old File                       | Status     | Action                 |
| ------- | ------------------------------ | ---------- | ---------------------- |
| website | src/components/Header.tsx      | TO MIGRATE | Replace with BhavyaNav |
| admin   | src/components/AdminHeader.tsx | TO MIGRATE | Replace with BhavyaNav |

### Footer (1 duplicate → 1 canonical)

| App     | Old File                  | Status     | Action                 |
| ------- | ------------------------- | ---------- | ---------------------- |
| website | src/components/Footer.tsx | TO MIGRATE | Replace with AppFooter |

---

## SUMMARY

| Category                   | Before | After | Eliminated |
| -------------------------- | ------ | ----- | ---------- |
| Token systems              | 22     | 1     | 21         |
| Sidebar implementations    | 14     | 1     | 13         |
| Search implementations     | 4      | 1     | 3          |
| Button implementations     | 2      | 1     | 1          |
| Badge implementations      | 2      | 1     | 1          |
| EmptyState implementations | 2      | 1     | 1          |
| StatCard implementations   | 3      | 1     | 2          |
| Header/Nav implementations | 3      | 1     | 2          |
| Footer implementations     | 2      | 1     | 1          |
| **Total duplicates**       | **54** | **9** | **45**     |
