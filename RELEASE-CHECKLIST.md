# Release Checklist

## Pre-Release Gate

### Build & Type Checks
- [ ] `pnpm build` — production build succeeds
- [ ] `pnpm typecheck` — TypeScript passes with 0 errors
- [ ] `pnpm lint` — ESLint passes with 0 errors

### Runtime Validation
- [ ] `node .ai/build/compile-runtime.mjs` — compiles without errors
- [ ] `node .ai/build/validate-runtime.mjs` — 0 errors, acceptable warnings
- [ ] `node .ai/build/generate-snapshot.mjs` — snapshot generated

### Website Verification
- [ ] All static pages render (22 routes)
- [ ] Transparency Portal sub-pages resolve (governance, financials, audit, policies, projects, releases)
- [ ] 404 page returns correct status
- [ ] 500 error page renders gracefully
- [ ] Custom error page does not leak stack traces

### Structured Data & SEO
- [ ] JSON-LD in root layout validates at schema.org
- [ ] Sitemap.xml returns 200 with all URLs
- [ ] Robots.txt returns 200 with correct rules
- [ ] All pages have unique title and meta description
- [ ] Canonical URLs are set on all pages

### Accessibility
- [ ] Skip-to-content link present on every page
- [ ] All images have alt text or `aria-hidden="true"`
- [ ] Color contrast meets WCAG AA (4.5:1 text)
- [ ] Keyboard navigation works for all interactive elements
- [ ] `prefers-reduced-motion` supported
- [ ] Semantic HTML landmarks used (header, nav, main, footer)

### Performance
- [ ] Static assets have immutable cache headers
- [ ] Compression enabled
- [ ] Shared JS bundle < 120 kB
- [ ] No render-blocking resources in critical path

### Security
- [ ] `X-Frame-Options: DENY` on all responses
- [ ] `X-Content-Type-Options: nosniff` on all responses
- [ ] `Referrer-Policy: strict-origin-when-cross-origin` set
- [ ] `Permissions-Policy` restricts camera, microphone, geolocation
- [ ] No sensitive data in client-side code
- [ ] `poweredByHeader: false` configured

### Content
- [ ] Governance documents populated in `content/governance/`
- [ ] Financial statements in `content/financials/`
- [ ] Active projects in `content/projects/`
- [ ] Release records in `content/releases/`
- [ ] Institutional policies in `content/policies/`
- [ ] Privacy policy page published
- [ ] All content has version/last-updated indicators

### Operational
- [ ] Locale detection via middleware working
- [ ] Language persistence via cookie working
- [ ] Custom 404 and 500 error pages tested
- [ ] Rollback procedure documented
- [ ] Monitoring endpoint accessible

---

## Release Process

1. Bump version in `apps/website/package.json`
2. Run pre-release gate checklist
3. Generate new runtime snapshot
4. Tag release in git
5. Deploy to staging
6. Run Lighthouse audit
7. Fix any regressions
8. Deploy to production
9. Verify live URLs
10. Update `current-release.md`
