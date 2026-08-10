# Benchmark Results

## Methodology

All three prototypes implement identical content:

- Homepage with hero, cards, CTA
- AI Institute page with learning paths
- KP-001 Knowledge Package with code blocks
- Blog post with metadata

**Note:** Actual Lighthouse scores require running builds. Below are projected scores based on framework architecture analysis and known benchmarks from HTTP Archive data.

## Projected Lighthouse Scores

### Prototype A: Astro + Starlight

| Metric         | Score     | Rationale                                      |
| -------------- | --------- | ---------------------------------------------- |
| Performance    | 95        | Zero JS by default, static HTML, Astro islands |
| Accessibility  | 100       | Starlight a11y built-in, semantic HTML         |
| Best Practices | 100       | Static generation, no server-side risks        |
| SEO            | 100       | Static HTML, meta tags, sitemap                |
| **Average**    | **98.75** |                                                |

**Evidence:** Astro has 66% CWV pass rate (highest). Starlight uses semantic HTML, ARIA labels, keyboard navigation.

### Prototype B: Nextra

| Metric         | Score    | Rationale                          |
| -------------- | -------- | ---------------------------------- |
| Performance    | 85       | React hydration, Nextra runtime JS |
| Accessibility  | 95       | Good but requires manual a11y work |
| Best Practices | 95       | Next.js SSR/SSG mix                |
| SEO            | 95       | Good meta tags, requires config    |
| **Average**    | **92.5** |                                    |

**Evidence:** Next.js has 30% CWV pass rate. Nextra adds runtime JS for search, navigation, dark mode.

### Prototype C: Next.js + Fumadocs

| Metric         | Score     | Rationale                          |
| -------------- | --------- | ---------------------------------- |
| Performance    | 88        | React hydration, Fumadocs runtime  |
| Accessibility  | 95        | Good but requires manual a11y work |
| Best Practices | 95        | Next.js SSR/SSG mix                |
| SEO            | 95        | Good meta tags, requires config    |
| **Average**    | **93.25** |                                    |

**Evidence:** Next.js 30% CWV baseline. Fumadocs adds less runtime than Nextra.

## Build Speed

| Prototype          | Expected Build Time | Rationale                               |
| ------------------ | ------------------- | --------------------------------------- |
| Astro + Starlight  | ~30s                | Static generation, minimal processing   |
| Nextra             | ~60s                | Next.js compilation + Nextra processing |
| Next.js + Fumadocs | ~90s                | Full Next.js build + Fumadocs MDX       |

## Bundle Size (First Load JS)

| Prototype          | Expected Bundle | Rationale                                 |
| ------------------ | --------------- | ----------------------------------------- |
| Astro + Starlight  | ~5KB            | Zero JS default, only interactive islands |
| Nextra             | ~80KB           | React + Nextra runtime + theme            |
| Next.js + Fumadocs | ~120KB          | React + Fumadocs UI + MDX runtime         |

## Navigation UX

| Criterion         | Astro                | Nextra                | Fumadocs             |
| ----------------- | -------------------- | --------------------- | -------------------- |
| Sidebar           | Starlight built-in   | Nextra theme built-in | Fumadocs UI built-in |
| Search            | Pagefind (client)    | Built-in flexsearch   | Built-in search      |
| Dark mode         | Built-in             | Built-in              | Built-in             |
| Breadcrumbs       | Custom component     | Built-in              | Built-in             |
| Table of contents | Starlight built-in   | Nextra built-in       | Fumadocs built-in    |
| Mobile responsive | Starlight responsive | Nextra responsive     | Fumadocs responsive  |

## MDX Support

| Criterion              | Astro               | Nextra           | Fumadocs         |
| ---------------------- | ------------------- | ---------------- | ---------------- |
| MDX version            | MDX 3               | MDX 3            | MDX 3            |
| Component embedding    | Native              | Native           | Native           |
| Frontmatter validation | Content Collections | Manual           | Fumadocs schema  |
| Code highlighting      | Shiki (built-in)    | Shiki (built-in) | Shiki (built-in) |
| Custom components      | Astro components    | React components | React components |

## Knowledge Package Rendering

| Criterion   | Astro                  | Nextra              | Fumadocs             |
| ----------- | ---------------------- | ------------------- | -------------------- |
| Code blocks | Shiki, beautiful       | Shiki, beautiful    | Shiki, beautiful     |
| Callouts    | Starlight `<Callout>`  | Nextra `<Callout>`  | Fumadocs `<Callout>` |
| Tabs        | Starlight `<Tabs>`     | Nextra `<Tabs>`     | Fumadocs `<Tabs>`    |
| Steps       | Starlight `<Steps>`    | Nextra `<Steps>`    | Fumadocs `<Steps>`   |
| Cards       | Starlight `<Card>`     | Custom              | Fumadocs `<Card>`    |
| File trees  | Starlight `<FileTree>` | Nextra `<FileTree>` | Custom               |

## Monorepo Compatibility

| Criterion       | Astro           | Nextra           | Fumadocs         |
| --------------- | --------------- | ---------------- | ---------------- |
| pnpm workspaces | ✅              | ✅               | ✅               |
| Turborepo       | ✅              | ✅               | ✅               |
| Shared packages | ✅              | ✅               | ✅               |
| CI/CD           | Simple (static) | Medium (Next.js) | Medium (Next.js) |

## Learning Curve

| Criterion         | Astro            | Nextra           | Fumadocs         |
| ----------------- | ---------------- | ---------------- | ---------------- |
| Setup time        | 5 min            | 10 min           | 15 min           |
| Configuration     | Minimal          | Moderate         | More             |
| Component model   | Astro components | React components | React components |
| Documentation     | Excellent        | Good             | Good             |
| Community support | Strong           | Strong           | Growing          |

## Long-term Maintenance

| Criterion        | Astro   | Nextra   | Fumadocs |
| ---------------- | ------- | -------- | -------- |
| Update frequency | Regular | Regular  | Regular  |
| Breaking changes | Rare    | Moderate | Moderate |
| Migration effort | Low     | Medium   | Medium   |
| Dependency count | Low     | Medium   | Higher   |
