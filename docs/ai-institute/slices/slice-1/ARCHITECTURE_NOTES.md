# Architecture Notes — Slice 1

## App Structure

```
apps/ai-institute/
├── package.json
├── next.config.mjs
├── postcss.config.mjs
├── tsconfig.json
└── src/
    ├── app/
    │   ├── layout.tsx          # Root layout with dark mode
    │   ├── globals.css         # Tailwind + font styles
    │   ├── page.tsx            # Landing page
    │   ├── assessment/
    │   │   └── page.tsx        # AI Readiness Assessment
    │   ├── dashboard/
    │   │   └── page.tsx        # Student Dashboard
    │   └── courses/
    │       └── foundations/
    │           ├── lessons/
    │           │   └── [id]/
    │           │       └── page.tsx  # Lesson Experience
    │           ├── lab/
    │           │   └── page.tsx      # Prompt Engineering Lab
    │           ├── check/
    │           │   └── page.tsx      # Knowledge Check
    │           └── project/
    │               └── page.tsx      # Mini Project
    └── data/
        ├── course.ts           # Foundation Course data
        └── progress.ts         # Student progress (localStorage)
```

## State Management

- **localStorage** for persistence (Slice 1 MVP)
- **React useState** for local state
- **No global store** — each page manages its own state
- **Progress synced** across pages via localStorage

## Key Decisions

1. **No backend** — All data is static, feedback is simulated
2. **No authentication** — Progress is local to browser
3. **No routing guards** — Pages redirect if not enrolled
4. **Platform-ui integration** — All apps consume shared design system

## Build Configuration

- **Next.js 15.3.3** with App Router
- **Tailwind CSS 4** with PostCSS
- **TypeScript** strict mode
- **transpilePackages** for platform-ui
