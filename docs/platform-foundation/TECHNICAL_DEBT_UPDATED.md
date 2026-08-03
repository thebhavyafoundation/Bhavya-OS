# TECHNICAL DEBT — Updated

**Date:** 2026-08-03
**Sprint:** Platform Foundation v2.0

---

## Resolved by Platform Foundation v2.0

| Debt                                     | Status                                        |
| ---------------------------------------- | --------------------------------------------- |
| 11 duplicate Sidebar components          | ✅ Resolved — @bhavya/platform-ui/Sidebar     |
| 13 duplicate StatCard components         | ✅ Resolved — @bhavya/platform-ui/StatCard    |
| 15+ duplicate StatusBadge components     | ✅ Resolved — @bhavya/platform-ui/StatusBadge |
| 50+ duplicated type definitions          | ✅ Resolved — @bhavya/types                   |
| 6+ duplicate readJSON/readMD utilities   | ✅ Resolved — @bhavya/platform/fs             |
| 3 duplicate EventBus implementations     | ✅ Resolved — @bhavya/events                  |
| 3 duplicate RateLimiter implementations  | ✅ Resolved — @bhavya/security                |
| 5+ duplicate API clients                 | ✅ Resolved — @bhavya/api                     |
| 4+ duplicate KO CRUD implementations     | ✅ Partially — centralized in @bhavya/types   |
| Broken @bhavya/ui stub                   | ✅ Replaced by @bhavya/platform-ui            |
| 7 circular dependencies (kernel↔engines) | ⚠️ Not addressed (existing code)              |

---

## Remaining Debt

### Critical (Must Fix Before Production)

1. **Existing packages not migrated to new platform.** The 11 new packages are created but existing apps still use their own implementations. Migration needed.
   - **Effort**: Days

2. **@bhavya/ui is still a broken stub.** Should be deprecated or updated to re-export @bhavya/platform-ui.
   - **Effort**: 10 minutes

3. **7 circular dependencies in kernel↔engines.** Not addressed by this sprint.
   - **Effort**: Days

### High

4. **No tests for new packages.** Only @bhavya/security and @bhavya/api have test infrastructure.
   - **Effort**: 1-2 days

5. **No CI for new packages.** The CI pipeline doesn't know about the new packages yet.
   - **Effort**: 1 hour

6. **Existing apps still use inline UI.** Dashboard (12 WidgetCard copies), forest, heritage, etc. still have duplicated components.
   - **Effort**: Days

### Medium

7. **No package publishing setup.** Packages are workspace-only; not configured for npm publishing.
   - **Effort**: 4-8 hours

8. **No Storybook or component documentation.** @bhavya/platform-ui needs visual documentation.
   - **Effort**: 1-2 days

9. **8 unused packages still exist.** agent-platform, bee, cli, branding, icons, maps, charts, ui (stub).
   - **Effort**: 2-4 hours to audit and clean

### Low

10. **No bundle size tracking.** Should add bundle analysis for platform packages.
    - **Effort**: 2-4 hours
