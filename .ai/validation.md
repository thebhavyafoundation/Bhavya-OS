id: RUNTIME-015
owner: Engineering

# Validation Rules — Definition of Done

Every completed task must satisfy:

## Required Checks
- [ ] Build passes (`pnpm build`)
- [ ] TypeScript clean (`pnpm typecheck`)
- [ ] Lint clean (`pnpm lint`)
- [ ] No duplicated code
- [ ] Uses existing packages (no reimplementing what exists)
- [ ] Follows design system (design tokens, not ad-hoc values)
- [ ] Accessible (WCAG AA — keyboard nav, ARIA, semantic HTML)
- [ ] Responsive (mobile-first breakpoints tested)
- [ ] Documentation updated (decision-log.md if architecture change)

## Code Quality
- [ ] Small functions, meaningful names, early returns
- [ ] Strong typing, no `any`
- [ ] Minimal nesting
- [ ] Server Component by default, client only when necessary

## Packaging
- [ ] Works within existing monorepo structure
- [ ] No circular dependencies
- [ ] No new unnecessary dependencies
- [ ] Uses dependency injection / configuration over hardcoding

## Security
- [ ] No secrets in code
- [ ] Input validation on user-facing endpoints
- [ ] Follows least privilege principle
