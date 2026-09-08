# Phase 1C — Unified Bhavya Navigation & Cross-App Experience

**Date:** 2026-09-08
**Status:** COMPLETE
**Commit:** (pending)

---

## Navigation Systems Inventory

### Canonical (Source of Truth)

| File                                                 | Purpose                                                                                |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `apps/ai-institute/src/lib/navigation-registry.json` | v2.1.0 — 3 layers (public, app, os), 534 lines                                         |
| `apps/ai-institute/src/lib/useNavigation.ts`         | Hook: `getNavItems()`, `getPublicNavGroups()`, `getOsSections()`, `getFooterColumns()` |
| `apps/ai-institute/src/lib/roles.ts`                 | 11 roles, 30+ permissions, `filterByRoles()`                                           |
| `apps/ai-institute/src/lib/route-policy.ts`          | `ROUTE_POLICIES` — server-side access control                                          |
| `apps/ai-institute/src/components/SiteHeader.tsx`    | Public header with "Enter Bhavya OS" CTA                                               |
| `apps/ai-institute/src/components/OsSidebar.tsx`     | OS sidebar with role-filtered sections                                                 |
| `apps/ai-institute/src/components/AppLayout.tsx`     | App sidebar with role-filtered nav items                                               |

### Migrating Apps (Before Phase 1C)

| App       | Navigation                           | Cross-App Links               | Role Filtering |
| --------- | ------------------------------------ | ----------------------------- | -------------- |
| github-os | Hardcoded `navGroups` in Sidebar.tsx | None                          | None           |
| ioc       | Hardcoded `NAV_ITEMS` in Sidebar.tsx | None                          | None           |
| social-os | None (bare shell)                    | None                          | None           |
| website   | Hardcoded `navItems` in Header.tsx   | None (1 external AI Lab link) | N/A            |
| admin     | Hardcoded sidebar in layout.tsx      | None                          | None           |

---

## Changes Made

### 1. github-os — Institutional Return Path

**File:** `apps/github-os/src/components/Sidebar.tsx`

**Before:** Footer showed "Bhavya Foundation" with "Admin" label (static text, no links).

**After:** Footer now provides two institutional return paths:

- "Bhavya OS" link → `/os` (with Home icon)
- "Bhavya Foundation" link → `/`

**Rationale:** Users of GitHub OS can now navigate back to Bhavya OS and the public Foundation.

### 2. ioc — Institutional Return Path

**File:** `apps/ioc/src/components/Sidebar.tsx`

**Before:** Sidebar had no links to other apps or back to Bhavya OS.

**After:**

- Added `flex flex-col` to aside for proper footer positioning
- Added institutional return path at bottom of sidebar:
  - "Bhavya OS" link → `/os`
  - "Bhavya Foundation" link → `/`

**Rationale:** IOC users can now return to the institutional hub.

### 3. social-os — Navigation Shell

**File:** `apps/social-os/src/app/layout.tsx`

**Before:** Bare `<html><body>{children}</body></html>` with no navigation.

**After:** Added minimal institutional sidebar:

- Brand: "Social OS" with "Communication Operations" subtitle
- Navigation: Home, Dashboard, CEO View
- Institutional return path: "Bhavya OS" → `/os`, "Bhavya Foundation" → `/`
- Uses Bhavya brand colors (#0a1f1a, #D4AF37, #8A9A8B)

**Rationale:** Social OS was the only app with zero navigation. Users were trapped with no way to navigate between pages or return to the institution.

### 4. website — Public → OS Transition

**File:** `apps/website/src/components/Footer.tsx`

**Before:** Footer "Learn" section had external AI Lab link (`https://bhavya-foundation-bhavya-ai-lab.vercel.app`).

**After:** Replaced with "Bhavya OS" link → `/os`.

**Rationale:** The public Foundation website now provides a clear transition into Bhavya OS. The external AI Lab link was redundant since AI Institute is part of Bhavya OS.

---

## Navigation Flow Verification

### Public → OS Transition

```
Public Foundation (/)
  └── Footer "Learn" section → "Bhavya OS" → /os
```

### OS → Application Transition

```
Bhavya OS (/os)
  └── OsSidebar → /os/github, /os/ioc, /os/social
```

### Application → OS Return Path

```
github-os (/) → Sidebar footer → "Bhavya OS" → /os
ioc (/dashboard) → Sidebar footer → "Bhavya OS" → /os
social-os (/) → Sidebar → "Bhavya OS" → /os
```

### Application → Foundation Return Path

```
github-os (/) → Sidebar footer → "Bhavya Foundation" → /
ioc (/dashboard) → Sidebar footer → "Bhavya Foundation" → /
social-os (/) → Sidebar → "Bhavya Foundation" → /
```

---

## What Was NOT Changed

- **Canonical navigation registry** — untouched (v2.1.0)
- **ai-institute navigation components** — untouched (SiteHeader, OsSidebar, AppLayout)
- **Role-based filtering** — untouched (canonical system already works)
- **Server-side authorization** — untouched (Phase 1B established this)
- **Admin app** — internal tool, low priority for cross-app links
- **No new navigation system created** — adapted existing surfaces
- **No apps merged** — each app remains a separate technical application

---

## Architecture Decision

The canonical registry remains the single source of truth. Migrating apps do NOT get their own registries. Instead, they get:

1. **Institutional return paths** — links back to `/os` and `/`
2. **Minimal navigation shells** — where none existed (social-os)
3. **Consistent branding** — Bhavya Foundation identity in all apps

The architecture is:

```
Canonical Registry (navigation-registry.json)
        │
        ├── Public Navigation (SiteHeader, SiteFooter)
        ├── OS Navigation (OsSidebar)
        ├── App Navigation (AppLayout)
        │
        └── Migrating App Navigation (adapted with return paths)
            ├── github-os (Sidebar + return path)
            ├── ioc (Sidebar + return path)
            └── social-os (new sidebar + return path)
```

---

## Remaining Navigation Defects

| Defect                                                      | Severity | Status                            |
| ----------------------------------------------------------- | -------- | --------------------------------- |
| github-os sidebar items redundant (6 items → /repositories) | Medium   | Deferred                          |
| github-os CommandPalette non-functional                     | Low      | Deferred                          |
| ioc sidebar uses emoji icons (not Lucide)                   | Low      | Deferred                          |
| social-os pages not responsive to sidebar width             | Low      | Deferred                          |
| admin app has no cross-app links                            | Low      | Deferred                          |
| No mobile navigation in migrating apps                      | Medium   | Deferred                          |
| website header has no "Enter Bhavya OS" CTA                 | Medium   | Deferred (header is more complex) |

---

## Safety Verification

```
No databases were merged.
No active applications were deleted.
No new frontend was created.
No new design system was created.
No Vercel operation was performed.
No heavy local build was run.
No unrelated working-tree files were staged.
```
