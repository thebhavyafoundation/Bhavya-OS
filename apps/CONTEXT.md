# apps/ — Application Umbrella

8 applications in the pnpm workspace. One canonical web app, one dev tool, six domain apps migrating into the canonical application.

**Last updated:** 2026-09-17

## Product Model

```text
BHAVYA FOUNDATION
        │
        ├── PUBLIC EXPERIENCE (/)
        │
        └── BHAVYA APPLICATION (/app)
                 │
                 └── ROLE / CAPABILITY ENGINE
                         │
       ┌─────────┬───────┼────────┬─────────┬──────────┐
       │         │       │        │         │          │
    Student  Volunteer  Donor  Researcher Mentor   Educator
```

All apps are migrating into `apps/ai-institute` which serves as the canonical host for all three layers: Public (`/`), Authenticated (`/app`), and Institutional (`/os`).

See `docs/product/DIGITAL_INSTITUTION.md` for the full product definition.

## Route Architecture

| Layer             | Routes                                                                                                                                                                | Purpose                       |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| **Public**        | `/`, `/about`, `/missions`, `/knowledge`, `/academy`, `/research`, `/community`                                                                                       | Editorial entrance            |
| **Authenticated** | `/app`, `/app/learn`, `/app/community`, `/app/knowledge`, `/app/missions`, `/app/research`, `/app/projects`, `/app/credentials`, `/app/contributions`, `/app/profile` | Role-aware institutional home |
| **Institutional** | `/os`, `/os/studio`, `/os/governance`, `/os/admin`                                                                                                                    | Internal operations           |

## Applications

| App                            | Description                                | Classification     | Status | Target Route             |
| ------------------------------ | ------------------------------------------ | ------------------ | ------ | ------------------------ |
| `ai-institute/`                | Bhavya Digital Institution — canonical app | **CANONICAL HOST** | Active | `/` + `/app` + `/os`     |
| `admin/`                       | Founder and operations dashboard           | **MIGRATING**      | Active | `/os/admin`              |
| `design-system/`               | Design system showcase                     | **KEEP**           | Active | `/design-system`         |
| `docs/`                        | Institutional governance dashboard         | **MIGRATING**      | Active | `/os/docs`               |
| `github-os/`                   | GitHub intelligence platform               | **MIGRATING**      | Active | `/os/github`             |
| `ioc/`                         | Institute of Compliance — OKR, risks       | **MIGRATING**      | Active | `/os/ioc`                |
| `social-os/`                   | Communication operations                   | **MIGRATING**      | Active | `/os/social`             |
| `bhavya-intelligence-network/` | Intelligence orchestration engine          | **EXTRACTING**     | Active | Package only (no routes) |

`apps/website/` is archived and no longer in the workspace — see
`docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md`.

## Route by task

| Task                           | Route                | App                    |
| ------------------------------ | -------------------- | ---------------------- |
| Public website / homepage      | `/`                  | `ai-institute/`        |
| My Bhavya (authenticated home) | `/app`               | `ai-institute/`        |
| Learning dashboard             | `/app/learn`         | `ai-institute/`        |
| Community                      | `/app/community`     | `ai-institute/`        |
| Knowledge graph                | `/app/knowledge`     | `ai-institute/`        |
| Missions                       | `/app/missions`      | `ai-institute/`        |
| Research                       | `/app/research`      | `ai-institute/`        |
| Projects                       | `/app/projects`      | `ai-institute/`        |
| Credentials                    | `/app/credentials`   | `ai-institute/`        |
| Contributions                  | `/app/contributions` | `ai-institute/`        |
| Profile                        | `/app/profile`       | `ai-institute/`        |
| Academy / courses              | `/courses`           | `ai-institute/`        |
| Bhavya OS (internal)           | `/os/*`              | `ai-institute/`        |
| Design system showcase         | `/design-system`     | `design-system/`       |
| Repository intelligence        | `/os/github`         | `github-os/` migrating |
| Compliance / OKR               | `/os/ioc`            | `ioc/` migrating       |
| Communication ops              | `/os/social`         | `social-os/` migrating |

## Shared packages

All apps import from `packages/`. See `packages/CONTEXT.md` for available packages.

## Each app

Has its own `package.json`, `src/`, and deployment config. Run `pnpm dev` from the app directory or `pnpm --filter @bhavya/<name> dev` from root.
