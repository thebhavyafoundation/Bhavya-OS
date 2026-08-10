# M7: Platform-UI Inventory

**Status:** ✅ Complete
**Date:** 2026-08-08

---

## Summary

AI Institute currently uses **zero platform-ui components**. Only the design tokens CSS is imported (`import "@bhavya/platform-ui"` in layout.tsx). All UI is custom-built with 200+ hardcoded color values.

## Platform-UI Components Available

| Component         | AI Institute Equivalent        | Replacement Priority    |
| ----------------- | ------------------------------ | ----------------------- |
| `Button`          | Custom buttons (inline styles) | High                    |
| `Card`            | Custom card layouts            | High                    |
| `Badge`           | StatusBadge (custom)           | Medium                  |
| `Modal`           | Custom modals                  | Medium                  |
| `SearchBar`       | Custom search                  | Medium                  |
| `Sidebar`         | AppShell nav                   | Low (different pattern) |
| `PageLayout`      | Custom layouts                 | High                    |
| `EmptyState`      | Custom empty states            | High                    |
| `LoadingSpinner`  | Custom skeletons               | Medium                  |
| `LoadingSkeleton` | Custom skeletons               | Medium                  |
| `ErrorState`      | Custom error boundaries        | Medium                  |
| `Tabs`            | Custom tabs                    | Medium                  |
| `DataTable`       | Custom tables                  | Low                     |
| `StatCard`        | Custom stat cards              | High                    |
| `StatusBadge`     | Custom badges                  | Medium                  |
| `Toast`           | No toast system                | High                    |
| `Breadcrumb`      | No breadcrumbs                 | Medium                  |
| `Avatar`          | Custom avatar                  | Low                     |
| `Skeleton`        | Custom skeletons               | Medium                  |
| `AppLayout`       | AppShell                       | Low (different pattern) |

## Hardcoded Colors Found

| Color     | Usage                       | Token Equivalent       |
| --------- | --------------------------- | ---------------------- |
| `#c9a227` | Gold accent, buttons, links | `var(--accent-gold)`   |
| `#8a7359` | Earth tone, gradients       | `var(--accent-earth)`  |
| `#1a3a2a` | Forest dark, backgrounds    | `var(--accent-forest)` |
| `#4ade80` | Green success text          | `var(--accent-green)`  |
| `#0a0f0d` | Near-black text             | `var(--text-primary)`  |
| `#ff4444` | Error red                   | `var(--accent-red)`    |

## Recommendation

**Post-beta:** Systematic migration from hardcoded colors to design tokens. Replace custom components with platform-ui equivalents where patterns match. The AppShell pattern is unique to AI Institute and should remain custom.

**Beta:** No changes needed — current implementation is functional and consistent.
