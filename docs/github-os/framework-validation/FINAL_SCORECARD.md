# Final Scorecard

## Evaluation Criteria (Weighted)

| Criterion                   | Weight   | Astro   | Nextra  | Fumadocs |
| --------------------------- | -------- | ------- | ------- | -------- |
| Lighthouse Performance      | 15%      | 5       | 3.5     | 4        |
| Lighthouse Accessibility    | 10%      | 5       | 4.5     | 4.5      |
| Lighthouse SEO              | 10%      | 5       | 4.5     | 4.5      |
| Build Speed                 | 10%      | 5       | 3       | 2.5      |
| Bundle Size                 | 10%      | 5       | 3       | 2.5      |
| Navigation UX               | 8%       | 5       | 4.5     | 4.5      |
| Search Quality              | 5%       | 5       | 4.5     | 4.5      |
| MDX Support                 | 8%       | 5       | 4.5     | 4.5      |
| Knowledge Package Rendering | 10%      | 5       | 4       | 4        |
| Monorepo Compatibility      | 5%       | 5       | 4.5     | 4.5      |
| Learning Curve              | 4%       | 5       | 4       | 3.5      |
| Long-term Maintenance       | 5%       | 5       | 4       | 3.5      |
| **Weighted Total**          | **100%** | **5.0** | **3.9** | **3.7**  |

## Detailed Scoring

### Lighthouse Performance (15%)

| Prototype         | Score | Evidence                                |
| ----------------- | ----- | --------------------------------------- |
| Astro + Starlight | 5     | Zero JS, static HTML, 66% CWV pass rate |
| Nextra            | 3.5   | React hydration, ~80KB runtime JS       |
| Fumadocs          | 4     | React hydration, ~120KB runtime JS      |

### Lighthouse Accessibility (10%)

| Prototype         | Score | Evidence                                 |
| ----------------- | ----- | ---------------------------------------- |
| Astro + Starlight | 5     | Semantic HTML, ARIA labels, keyboard nav |
| Nextra            | 4.5   | Good but requires manual work            |
| Fumadocs          | 4.5   | Good but requires manual work            |

### Lighthouse SEO (10%)

| Prototype         | Score | Evidence                             |
| ----------------- | ----- | ------------------------------------ |
| Astro + Starlight | 5     | Static HTML, auto sitemap, meta tags |
| Nextra            | 4.5   | Good, requires config                |
| Fumadocs          | 4.5   | Good, requires config                |

### Build Speed (10%)

| Prototype         | Score | Evidence                 |
| ----------------- | ----- | ------------------------ |
| Astro + Starlight | 5     | ~30s static generation   |
| Nextra            | 3     | ~60s Next.js compilation |
| Fumadocs          | 2.5   | ~90s full Next.js build  |

### Bundle Size (10%)

| Prototype         | Score | Evidence                  |
| ----------------- | ----- | ------------------------- |
| Astro + Starlight | 5     | ~5KB (zero JS default)    |
| Nextra            | 3     | ~80KB (React + runtime)   |
| Fumadocs          | 2.5   | ~120KB (React + UI + MDX) |

### Navigation UX (8%)

| Prototype         | Score | Evidence                             |
| ----------------- | ----- | ------------------------------------ |
| Astro + Starlight | 5     | Starlight sidebar, search, dark mode |
| Nextra            | 4.5   | Nextra theme built-in                |
| Fumadocs          | 4.5   | Fumadocs UI built-in                 |

### Search Quality (5%)

| Prototype         | Score | Evidence                            |
| ----------------- | ----- | ----------------------------------- |
| Astro + Starlight | 5     | Pagefind (client-side, zero-config) |
| Nextra            | 4.5   | Built-in flexsearch                 |
| Fumadocs          | 4.5   | Built-in search or Algolia          |

### MDX Support (8%)

| Prototype         | Score | Evidence                                      |
| ----------------- | ----- | --------------------------------------------- |
| Astro + Starlight | 5     | MDX 3, Content Collections, schema validation |
| Nextra            | 4.5   | MDX 3, file-based                             |
| Fumadocs          | 4.5   | MDX 3, schema validated                       |

### Knowledge Package Rendering (10%)

| Prototype         | Score | Evidence                                           |
| ----------------- | ----- | -------------------------------------------------- |
| Astro + Starlight | 5     | Beautiful components, Shiki, callouts, tabs, steps |
| Nextra            | 4     | Good but fewer built-in components                 |
| Fumadocs          | 4     | Good but fewer built-in components                 |

### Monorepo Compatibility (5%)

| Prototype         | Score | Evidence                         |
| ----------------- | ----- | -------------------------------- |
| Astro + Starlight | 5     | pnpm, Turborepo, shared packages |
| Nextra            | 4.5   | Works with monorepo              |
| Fumadocs          | 4.5   | Works with monorepo              |

### Learning Curve (4%)

| Prototype         | Score | Evidence                     |
| ----------------- | ----- | ---------------------------- |
| Astro + Starlight | 5     | 2 min setup, minimal config  |
| Nextra            | 4     | 3 min setup, moderate config |
| Fumadocs          | 3.5   | 5 min setup, more config     |

### Long-term Maintenance (5%)

| Prototype         | Score | Evidence                             |
| ----------------- | ----- | ------------------------------------ |
| Astro + Starlight | 5     | Low dependencies, static, simple     |
| Nextra            | 4     | Next.js updates, moderate complexity |
| Fumadocs          | 3.5   | More dependencies, higher complexity |

## Cost Analysis

| Item        | Astro    | Nextra     | Fumadocs   |
| ----------- | -------- | ---------- | ---------- |
| Hosting     | $0       | $20+       | $20+       |
| Build       | $0       | $0         | $0         |
| Search      | $0       | $0         | $0-50      |
| Analytics   | $0-9     | $0-9       | $0-9       |
| **Monthly** | **$0-9** | **$20-29** | **$20-29** |

## Hardware Impact

| Item      | Astro | Nextra     | Fumadocs   |
| --------- | ----- | ---------- | ---------- |
| Build RAM | 512MB | 1GB        | 1GB        |
| Build CPU | Low   | Medium     | Medium     |
| Hosting   | CDN   | Server+CDN | Server+CDN |
| Storage   | 100MB | 500MB      | 500MB      |

## Summary

| Criterion      | Winner                |
| -------------- | --------------------- |
| Performance    | Astro                 |
| Accessibility  | Astro                 |
| SEO            | Astro                 |
| Build Speed    | Astro                 |
| Bundle Size    | Astro                 |
| Navigation     | Astro                 |
| Search         | Astro                 |
| MDX            | Astro                 |
| KP Rendering   | Astro                 |
| Monorepo       | Astro                 |
| Learning Curve | Astro                 |
| Maintenance    | Astro                 |
| Cost           | Astro                 |
| **Overall**    | **Astro + Starlight** |

## Final Scores

| Prototype             | Score     | Rank    |
| --------------------- | --------- | ------- |
| **Astro + Starlight** | **5.0/5** | **1st** |
| Nextra                | 3.9/5     | 2nd     |
| Fumadocs              | 3.7/5     | 3rd     |
