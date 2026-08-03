# Technical Debt Registry

## Critical (Must Fix Before Production)

1. **No Redis-backed rate limiting** — Current in-memory rate limiter resets on restart. Production needs `@upstash/ratelimit` or similar.
   - **Impact**: Rate limits ineffective across multiple instances
   - **Effort**: 2-4 hours

2. **No CSRF middleware** — NextAuth provides session tokens but no explicit CSRF protection on non-auth routes.
   - **Impact**: Potential CSRF attacks on state-changing endpoints
   - **Effort**: 4-8 hours

3. **No audit logging** — No structured audit trail for security events (login, data access, mutations).
   - **Impact**: Cannot detect or investigate security incidents
   - **Effort**: 1-2 days

## High (Should Fix Before Launch)

4. **No database migrations** — Indexes added via `CREATE INDEX IF NOT EXISTS` in initSchema. Should use proper migration files.
   - **Impact**: Schema changes harder to track and roll back
   - **Effort**: 4-8 hours

5. **`@prisma/client` in deps but not used** — `better-sqlite3` is the actual ORM. `@prisma/client` and `prisma` are dead dependencies.
   - **Impact**: Unnecessary install size, confusion
   - **Effort**: 10 minutes

6. **`lucide-react` unused** — Listed in dependencies but not imported anywhere in knowledge-studio.
   - **Impact**: Bloat
   - **Effort**: 5 minutes

7. **Empty middleware.ts** — Exists but does nothing (Edge Runtime incompatible with better-sqlite3).
   - **Impact**: Dead code
   - **Effort**: 5 minutes

## Medium (Should Fix Soon)

8. **No penetration testing** — Manual security review not yet performed.
   - **Impact**: Unknown vulnerabilities
   - **Effort**: 1-2 days

9. **No `pnpm audit`** — Dependencies not checked for known vulnerabilities.
   - **Impact**: May have vulnerable dependencies
   - **Effort**: 30 minutes

10. **7 circular dependencies** — kernel↔engines circular imports.
    - **Impact**: Build fragility, potential import ordering issues
    - **Effort**: 1-2 days

## Low (Backlog)

11. **5 "island" apps** — knowledge-studio, lesson-studio, bhavya-ai-lab, transparency, design-system have zero workspace dependencies.
    - **Impact**: Duplication, not using shared packages
    - **Effort**: Days (major refactor)

12. **8 unused packages** — agent-platform, branding, charts, config, docs, icons, bee (used via HTTP), runtime (used via HTTP).
    - **Impact**: Monorepo bloat, confusion
    - **Effort**: 2-4 hours

13. **`@bhavya/ui` is a stub** — 3 lines, version string only.
    - **Impact**: No shared component library
    - **Effort**: Weeks (major effort)
