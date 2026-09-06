---
name: bhavya-route-audit
description: Audit routes, navigation, and links for completeness. Use when adding/modifying routes, navigation, CTAs, or redirects.
compatibility: opencode
---

# Bhavya Route Audit Skill

## Purpose

Ensure no dead navigation, orphan pages, broken links, or fake buttons exist in the Bhavya web experience.

## Canonical Route Map

All routes are defined in `docs/architecture/CANONICAL_ROUTE_MAP.md`.

Three route layers:
1. **Public** — `/`, `/forest`, `/knowledge`, `/heritage`, `/community`, `/about`, etc.
2. **Authenticated** — `/app/*` (learning dashboard, community, missions, etc.)
3. **Internal** — `/os/*` (governance, observability, runtime, etc.)

## Audit Checklist

When UI navigation changes:

### 1. Enumerate Routes
- List all routes in the affected section
- Check `apps/ai-institute/src/app/` for actual route directories

### 2. Inspect Route Definitions
- Verify each route has a `page.tsx` or `layout.tsx`
- Check for proper metadata exports
- Verify loading and error states

### 3. Check Internal Links
- Search for `href=` attributes pointing to modified routes
- Check navigation components in `packages/platform-ui/`
- Verify breadcrumb links
- Check footer links

### 4. Check CTA Destinations
- Verify all buttons with `href` point to valid routes
- Check that action buttons trigger correct behavior
- Verify modal/overlay triggers

### 5. Check Redirects
- Check `next.config.js` or middleware for redirects
- Verify old routes redirect to new locations
- Check for redirect chains

### 6. Check 404 Behavior
- Verify custom 404 page exists
- Check that invalid routes show 404, not blank pages
- Verify 404 page has navigation back to valid routes

### 7. Check Mobile Navigation
- Verify mobile menu includes all routes
- Check hamburger menu links
- Verify bottom navigation if applicable

### 8. Verify Protected Routes
- Check middleware enforces auth on `/app/*` and `/os/*`
- Verify unauthenticated users redirect to login
- Check role-based access on `/os/*` routes

## Report Format

```markdown
## Route Audit — [date]

### Routes Checked
| Route | Status | Links In | Issues |
|-------|--------|----------|--------|
| / | OK | nav, footer | — |
| /forest | OK | nav, homepage | — |

### Issues Found
| # | Severity | Route | Issue | Fix |
|---|----------|-------|-------|-----|

### Navigation Coverage
- Total routes: N
- Routes with inbound links: N
- Orphan routes: N
- Dead links: N
```
