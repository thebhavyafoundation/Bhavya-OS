# Framework Comparison

## Evaluation Criteria

| Criterion     | Weight | Description                               |
| ------------- | ------ | ----------------------------------------- |
| Performance   | 25%    | Core Web Vitals, build speed, page load   |
| Content-first | 20%    | Native content support, MDX, collections  |
| MDX Support   | 15%    | Rich content authoring, components in MDX |
| SEO           | 15%    | Sitemap, structured data, meta tags       |
| Community     | 10%    | Ecosystem, plugins, adoption              |
| Maintenance   | 10%    | Build complexity, hosting, updates        |
| Bhavya Fit    | 5%     | Alignment with KP model                   |

## Framework Profiles

### 1. Astro + Starlight

**Overview:** Static site generator optimized for content. Starlight provides docs theme.

**GitHub Stars:** 50k+ (Astro) / 10k+ (Starlight)
**License:** MIT
**Created:** 2021 (Astro) / 2023 (Starlight)

**Strengths:**

- Best-in-class performance (66% CWV pass rate)
- Islands architecture for interactive components
- Zero JS by default
- Content Collections with TypeScript validation
- Built-in image optimization
- View Transitions API
- Markdown + MDX native
- Starlight: docs, search, i18n, dark mode out of the box

**Weaknesses:**

- Newer ecosystem (smaller plugin library)
- No built-in CMS integration
- Learning curve for Astro components

**Used By:** Anthropic, Google, Netlify, Cloudflare

**Evidence:**

- 66% CWV pass rate (highest of any framework)
- 50k+ GitHub stars
- Used by major tech companies for docs

**Scoring:**

| Criterion     | Score   | Rationale                                        |
| ------------- | ------- | ------------------------------------------------ |
| Performance   | 5       | Best-in-class SSG, zero JS default               |
| Content-first | 5       | Content Collections, MDX native                  |
| MDX Support   | 5       | First-class MDX with component embedding         |
| SEO           | 5       | Static generation, auto sitemap, structured data |
| Community     | 5       | 50k+ stars, strong ecosystem                     |
| Maintenance   | 5       | Static hosting, minimal complexity               |
| Bhavya Fit    | 5       | Content-first matches KP model                   |
| **Total**     | **5.0** |                                                  |

### 2. Next.js + Nextra

**Overview:** React framework with Nextra for docs.

**GitHub Stars:** 130k+ (Next.js) / 11k+ (Nextra)
**License:** MIT
**Created:** 2016 (Next.js) / 2020 (Nextra)

**Strengths:**

- Largest React ecosystem
- Full-stack capabilities (API routes, server components)
- Nextra provides docs, blog, search
- Great for complex web apps
- Strong Vercel support

**Weaknesses:**

- Heavier than SSG for content-only sites
- 30% CWV pass rate (lowest of frameworks)
- More complex deployment
- Server costs for dynamic features
- Nextra smaller community than Astro

**Used By:** Vercel, Lee Robinson, shadcn/ui

**Evidence:**

- 130k+ stars but primarily for web apps
- 30% CWV pass rate (performance concern)
- Overkill for content-only sites

**Scoring:**

| Criterion     | Score   | Rationale                                     |
| ------------- | ------- | --------------------------------------------- |
| Performance   | 3       | 30% CWV, server rendering overhead            |
| Content-first | 3       | Nextra adds content, but Next.js is app-first |
| MDX Support   | 4       | Good MDX support via Nextra                   |
| SEO           | 4       | Good, but requires more config                |
| Community     | 5       | Largest React ecosystem                       |
| Maintenance   | 3       | Complex deployment, server costs              |
| Bhavya Fit    | 4       | Good but heavier than needed                  |
| **Total**     | **3.5** |                                               |

### 3. Docusaurus

**Overview:** Documentation framework by Meta.

**GitHub Stars:** 55k+
**License:** MIT
**Created:** 2017

**Strengths:**

- Battle-tested by Meta, React, Redux
- Versioning built-in
- i18n support
- MDX native
- Algolia search integration
- Blog plugin

**Weaknesses:**

- React-based (heavier than Astro)
- Less performant than Astro
- Older architecture
- Limited to docs/blog pattern
- Less flexible for custom pages

**Used By:** React, Redux, Jest, Supabase

**Evidence:**

- 55k+ stars, proven at scale
- Great for docs, limited for custom pages
- Older architecture shows in performance

**Scoring:**

| Criterion     | Score   | Rationale                               |
| ------------- | ------- | --------------------------------------- |
| Performance   | 4       | Good but not best-in-class              |
| Content-first | 5       | Built for docs                          |
| MDX Support   | 5       | First-class MDX                         |
| SEO           | 4       | Good, requires config                   |
| Community     | 5       | Large, proven ecosystem                 |
| Maintenance   | 4       | Simple docs hosting                     |
| Bhavya Fit    | 4       | Good for docs, limited for custom pages |
| **Total**     | **4.5** |                                         |

### 4. Fumadocs

**Overview:** Beautiful docs framework for React.

**GitHub Stars:** 8k+
**License:** MIT
**Created:** 2023

**Strengths:**

- Beautiful default design
- Highly composable
- MDX native
- Multiple framework support (Next.js, React Router, Waku)
- OpenAPI integration
- CLI for customization

**Weaknesses:**

- Smaller community
- Newer, less proven
- Limited to docs pattern
- No standalone SSG

**Used By:** Unkey, Vercel, Orama

**Evidence:**

- Beautiful design praised by shadcn creator
- Growing adoption
- Limited to docs use case

**Scoring:**

| Criterion     | Score   | Rationale                                |
| ------------- | ------- | ---------------------------------------- |
| Performance   | 4       | Good, depends on host framework          |
| Content-first | 5       | Built for docs                           |
| MDX Support   | 5       | First-class MDX                          |
| SEO           | 4       | Good, requires host framework SEO        |
| Community     | 3       | Smaller, newer ecosystem                 |
| Maintenance   | 4       | Simple if using supported framework      |
| Bhavya Fit    | 4       | Great for docs, limited for custom pages |
| **Total**     | **4.4** |                                          |

## Decision

### Winner: Astro + Starlight

**Why:**

1. **Performance:** 66% CWV pass rate (vs 30% for Next.js)
2. **Content-first:** Native content collections, MDX
3. **Flexibility:** Can build full website, not just docs
4. **Static generation:** Zero server costs
5. **Islands:** Interactive components when needed
6. **Starlight:** Docs, search, dark mode, i18n out of the box

### Implementation Plan

**Phase 1: Foundation (Week 1-2)**

- Initialize Astro project
- Install Starlight theme
- Configure design tokens
- Set up content collections

**Phase 2: Core Pages (Week 3-4)**

- Homepage with hero
- Learning Hub with sidebar
- Knowledge Package template
- Blog template

**Phase 3: Features (Week 5-6)**

- Search integration (Algolia/FlexSearch)
- Dark mode toggle
- Progress tracking
- Social sharing

**Phase 4: Content (Week 7-8)**

- Migrate KP-001 to MDX
- Create module pages
- Set up publishing pipeline
- RSS feed

**Phase 5: Polish (Week 9-10)**

- Performance optimization
- SEO audit
- Accessibility testing
- Analytics integration

## Maintenance Cost

| Framework         | Hosting                    | Build Time | Monthly Cost |
| ----------------- | -------------------------- | ---------- | ------------ |
| Astro + Starlight | Vercel/Netlify (free tier) | 30s        | $0           |
| Next.js + Nextra  | Vercel ($20/mo)            | 2-5min     | $20+         |
| Docusaurus        | Netlify (free tier)        | 1-2min     | $0           |
| Fumadocs          | Vercel ($20/mo)            | 2-5min     | $20+         |

## Hardware Impact

| Framework         | Build CPU | Build RAM | Hosting      |
| ----------------- | --------- | --------- | ------------ |
| Astro + Starlight | Low       | 512MB     | CDN (edge)   |
| Next.js + Nextra  | Medium    | 1GB       | Server + CDN |
| Docusaurus        | Low       | 512MB     | CDN (edge)   |
| Fumadocs          | Medium    | 1GB       | Server + CDN |

## License

All frameworks: **MIT** — no vendor lock-in, no restrictions.
