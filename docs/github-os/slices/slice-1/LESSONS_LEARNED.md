# Slice 1 — Lessons Learned

## What Worked

### 1. Vertical Slice Approach

Building the full dashboard first (UI + API + DB) gave immediate visibility. The dashboard is demonstrable from day one.

### 2. SQLite for Local Development

No database server needed. `better-sqlite3` works on Windows. WAL mode handles concurrent reads.

### 3. Component Co-location

Keeping all widgets in `Widgets.tsx` reduced file switching. For a dashboard, this is acceptable.

### 4. Static Seed Data

Having demo data means the dashboard is immediately useful without external dependencies.

### 5. Tailwind CSS 4

Utility classes made styling fast. Dark mode is trivial with CSS variables.

## What Didn't Work

### 1. Build Timeout

`pnpm --filter` build timed out. Running `npx next build` directly from the app directory worked better.

### 2. API Route Organization

Separate files for each API route created many small files. Could consolidate.

### 3. Client-Side Data Fetching

Dashboard uses `useEffect` for data fetching. Could use server components for initial load.

## Decisions Made

1. **Client-side rendering** — Dashboard needs interactivity
2. **No ORM** — SQLite is simple enough
3. **Component co-location** — Widgets in single file
4. **Static seed data** — Demo data for immediate value
5. **Dark mode first** — Industry standard for dev tools

## Patterns Established

1. **Dashboard layout** — Sidebar + main content + widgets
2. **Widget pattern** — Consistent card-based widgets
3. **API pattern** — Simple REST routes with SQLite
4. **Search pattern** — Query across multiple tables
5. **Activity pattern** — Time-sorted event feed

## Recommendations for Next Slices

1. Add authentication early
2. Use server components where possible
3. Add tests from the start
4. Create shared UI components
5. Add error boundaries
