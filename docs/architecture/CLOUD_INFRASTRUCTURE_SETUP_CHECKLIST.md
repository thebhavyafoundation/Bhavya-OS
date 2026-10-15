# Bhavya OS — Cloud Infrastructure Setup Checklist

**Purpose**: Complete reference for any AI agent (or human) to verify, configure, and maintain the cloud infrastructure for Bhavya OS. Run this checklist on every new session, after credential rotation, or when onboarding new team members.

---

## 📋 Executive Summary

| Service                    | Provider           | Purpose                           | Status         | Verified             |
| -------------------------- | ------------------ | --------------------------------- | -------------- | -------------------- |
| **Git/Version Control**    | GitHub             | Repository, CI/CD, secrets        | ✅ Active      | ✅                   |
| **Authentication**         | Supabase           | User auth, sessions               | ✅ Code Ready  | ⚠️ Needs Credentials |
| **Primary Deployment**     | Cloudflare Workers | Production hosting                | ✅ Deployed    | ✅                   |
| **Alternative Deployment** | Vercel             | Preview/staging                   | ✅ Configured  | ⚠️ Needs Credentials |
| **Asset Storage**          | Backblaze B2       | 3D models, textures, heavy assets | ✅ Implemented | ⚠️ Needs Credentials |
| **Database (Prod)**        | Turso (libSQL)     | Session/user data                 | ✅ Code Ready  | ⚠️ Needs Credentials |
| **Database (Local)**       | better-sqlite3     | Development                       | ✅ Working     | ✅                   |

---

## 1. GitHub Repository Verification

### Repository Details

- **Owner**: `thebhavyafoundation`
- **Repo**: `Bhavya-OS`
- **Default Branch**: `master`
- **Visibility**: Public

### Required GitHub Secrets (Settings → Secrets and Variables → Actions)

| Secret Name             | Purpose                       | Workflow                | Status    |
| ----------------------- | ----------------------------- | ----------------------- | --------- |
| `CLOUDFLARE_API_TOKEN`  | Deploy to Cloudflare Workers  | `deploy-cloudflare.yml` | ⚠️ Verify |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account identifier | `deploy-cloudflare.yml` | ⚠️ Verify |
| `VERCEL_TOKEN`          | Deploy to Vercel              | `deploy.yml`            | ⚠️ Verify |
| `VERCEL_ORG_ID`         | Vercel organization ID        | `deploy.yml`            | ⚠️ Verify |
| `VERCEL_PROJECT_ID`     | Vercel project ID             | `deploy.yml`            | ⚠️ Verify |
| `GITHUB_TOKEN`          | Built-in (auto-provided)      | All workflows           | ✅ Auto   |

### Workflow Files (`.github/workflows/`)

| File                    | Trigger                                         | Purpose                                   | Status    |
| ----------------------- | ----------------------------------------------- | ----------------------------------------- | --------- |
| `ci.yml`                | Push/PR to `master`                             | Lint, typecheck, secret-scan, test, build | ✅ Active |
| `deploy-cloudflare.yml` | Push to `master`                                | Build & deploy to Cloudflare Workers      | ✅ Active |
| `deploy.yml`            | Push/PR to `main`                               | Deploy to Vercel                          | ✅ Active |
| `pages.yml`             | Push to `main`/`feat/immersive-hero-background` | Deploy static assets to GitHub Pages      | ✅ Active |

### Branch Protection Rules (Required)

- [ ] Require PR reviews before merge
- [ ] Require status checks: `lint-and-typecheck`, `secret-scan`, `test`, `build`
- [ ] Require branches to be up to date
- [ ] No force pushes to `master`/`main`

---

## 2. Supabase Authentication Setup

### Project Creation (if not exists)

1. Go to https://supabase.com/dashboard
2. Create project: `bhavya-foundation-auth`
3. Region: Choose closest to users (e.g., `us-east-1`)
4. Save **Project URL** and **Anon Key**

### Required Environment Variables

**Production (GitHub Secrets / Cloudflare / Vercel):**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Local Development (`.env.local` in `apps/ai-institute/`):**

```bash
# Copy from .env.example and fill in real values
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Auth Configuration

- [ ] Enable Email/Password provider
- [ ] Configure redirect URLs: `https://your-domain.com/auth/callback`
- [ ] Set JWT expiry (recommended: 1 hour)
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Create `users` and `sessions` tables via migration

### Verification Commands

```bash
# Test Supabase connection locally
pnpm --filter @bhavya/ai-institute dev
# Visit http://localhost:3030/auth/login - should redirect to Supabase
```

---

## 3. Cloudflare Workers Deployment

### Prerequisites

- [ ] Cloudflare account: `thebhavyafoundation@gmail.com`
- [ ] API Token with Workers script edit permissions
- [ ] Account ID from dashboard

### Worker Configuration (`apps/ai-institute/wrangler.json`)

```json
{
  "name": "bhavya-foundation",
  "main": ".open-next/worker.js",
  "compatibility_date": "2024-09-23",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  }
}
```

### Required GitHub Secrets

| Secret                  | Value Source                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------ |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare Dashboard → My Profile → API Tokens → Create Token (Workers Scripts:Edit) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard → Workers & Pages → Right sidebar → Account ID                  |

### Runtime Secrets (Set via Wrangler CLI - NOT in GitHub)

```bash
# These are Worker runtime secrets, set manually:
npx wrangler secret put TURSO_DATABASE_URL --env production
npx wrangler secret put TURSO_AUTH_TOKEN --env production
```

### Deploy Commands

```bash
# Local build test
cd apps/ai-institute
pnpm build:cloudflare

# Local preview
pnpm preview

# Manual deploy (if needed)
pnpm deploy
```

### Verification

- [ ] Worker appears in Cloudflare Dashboard: `bhavya-foundation`
- [ ] Custom domain configured: `bhavya.foundation` (or subdomain)
- [ ] HTTPS/SSL active
- [ ] Health check endpoint responds: `GET /api/health`

---

## 4. Vercel Deployment (Alternative/Preview)

### Prerequisites

- [ ] Vercel account linked to GitHub
- [ ] Project imported from `thebhavyafoundation/Bhavya-OS`

### Required GitHub Secrets

| Secret              | Value Source                                  |
| ------------------- | --------------------------------------------- |
| `VERCEL_TOKEN`      | Vercel Settings → Tokens → Create             |
| `VERCEL_ORG_ID`     | Vercel CLI: `vercel inspect` or dashboard URL |
| `VERCEL_PROJECT_ID` | Vercel CLI: `vercel inspect` or dashboard URL |

### Configuration (`vercel.json`)

```json
{
  "installCommand": "corepack enable && pnpm install --no-frozen-lockfile --ignore-scripts",
  "buildCommand": "npx turbo run build --filter=@bhavya/ai-institute...",
  "framework": "nextjs",
  "outputDirectory": "apps/ai-institute/.next"
}
```

### Verification

- [ ] Preview deployments work on PRs
- [ ] Production deployment on `main` branch
- [ ] Environment variables synced from GitHub Secrets

---

## 5. Backblaze B2 Asset Storage

### Bucket Setup

1. Create bucket: `bhavya-ai-assets` (or your chosen name)
2. Region: `us-east-005` (or closest)
3. Public access: Enabled for CDN delivery
4. CORS configuration for web uploads

### Application Key Creation

1. Create Application Key with permissions:
   - `read` + `write` + `delete` + `list` on bucket
2. Save: `keyID`, `applicationKey`

### Two Configuration Sets (Code Uses Both)

**Client-side (`apps/ai-institute/src/lib/b2/client.ts`):**

```bash
S3_ENDPOINT=https://backblazeb2.com
S3_ACCESS_KEY_ID=your_key_id
S3_SECRET_ACCESS_KEY=your_app_key
S3_BUCKET_NAME=bhavya-ai-assets
S3_REGION=us-east-0
```

**Server-side (`apps/ai-institute/src/lib/b2/server.ts`):**

```bash
B2_ENDPOINT=https://s3.us-east-005.backblazeb2.com
B2_BUCKET=bhavya-ai-assets
B2_KEY_ID=your_key_id
B2_APP_KEY=your_app_key
B2_PUBLIC_URL_BASE=https://f002.backblazeb2.com/file/bhavya-ai-assets
```

### Bucket Structure (Enforced by Code)

```
bhavya-ai-assets/
├── 3d-models/
│   ├── modules/
│   ├── characters/
│   └── environments/
├── textures/
│   ├── hdri/
│   └── pbr/
├── animations/
├── datasets/
├── backups/
└── pipeline/
```

### Verification

```bash
# Test B2 connection
node -e "
const { checkB2Health } = require('./apps/ai-institute/src/lib/b2/client.ts');
checkB2Health().then(console.log);
"
```

---

## 6. Turso Database (Production)

### Database Creation

1. Go to https://turso.tech
2. Create database: `bhavya-foundation`
3. Generate auth token

### Required Secrets (Cloudflare Worker Runtime)

```bash
# Set via wrangler CLI (never in GitHub Secrets)
npx wrangler secret put TURSO_DATABASE_URL --env production
# Value: libsql://bhavya-foundation-yourorg.turso.io

npx wrangler secret put TURSO_AUTH_TOKEN --env production
# Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Local Development Override

```bash
# In apps/ai-institute/.env.local
TURSO_DATABASE_URL=libsql://bhavya-foundation-yourorg.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Migration Commands

```bash
# Run migrations locally
cd apps/ai-institute
pnpm db:migrate

# Check migration status
pnpm --filter @bhavya/database test
```

### Verification

- [ ] Tables created: `users`, `sessions`, `curriculum_progress`, `certificates`, `gallery_photos`
- [ ] RLS policies active (via Turso dashboard)
- [ ] Connection works from Cloudflare Worker

---

## 7. Local Development Environment

### Prerequisites

- Node.js ≥ 20.9.0
- pnpm 10.17.1 (`corepack enable`)
- Git

### Setup Commands

```bash
# Clone repo
git clone https://github.com/thebhavyafoundation/Bhavya-OS.git
cd Bhavya-OS

# Install dependencies
corepack enable
pnpm install --frozen-lockfile

# Copy environment template
cp apps/ai-institute/.env.example apps/ai-institute/.env.local
# Edit .env.local with real values

# Run database migrations
pnpm --filter @bhavya/ai-institute db:migrate

# Start development server
pnpm dev
# or for specific app:
pnpm --filter @bhavya/ai-institute dev
```

### Verification Checklist

- [ ] `pnpm antislop` — PASS
- [ ] `pnpm tokens:check` — PASS
- [ ] `pnpm typecheck` — Note: Currently has known TS errors in 3D components (see TypeScript Errors section)
- [ ] `pnpm test` — 283 tests passing in ai-institute
- [ ] `pnpm build` — Should complete (runs in CI)
- [ ] Dev server starts at `http://localhost:3030`
- [ ] Homepage loads without errors
- [ ] Authentication flow works (redirects to Supabase)

---

## 8. Known TypeScript Errors (Documented)

The following TypeScript errors exist in the codebase but **do not block runtime behavior** (tests pass). These are tracked for future resolution:

| File                                                         | Error Type                                 | Impact                         |
| ------------------------------------------------------------ | ------------------------------------------ | ------------------------------ |
| `src/components/three/*.tsx`                                 | Missing three.js types, JSX element issues | 3D components - visual only    |
| `src/lib/b2/client.ts` + `server.ts`                         | @aws-sdk/client-s3 version mismatch        | B2 upload - works at runtime   |
| `src/data/curriculum/*.ts`                                   | Type mismatches between `AIBand`/`AgeBand` | Curriculum data - tests pass   |
| `src/components/curriculum/KnowledgeAlignedLessonPlayer.tsx` | Missing imports, duplicate identifiers     | Lesson player - needs refactor |

**Action**: Do not block deployment on these. They are documented in `.ai/PHASE_2I_DATABASE_REMEDIATION_REPORT.md`.

---

## 9. CI/CD Pipeline Verification

### Expected Pipeline Flow

```
Push to master
    │
    ├─→ ci.yml (lint-and-typecheck, secret-scan, test, build)
    │       │
    │       └─→ All must pass (green checkmarks)
    │
    └─→ deploy-cloudflare.yml
            │
            ├─→ Build with opennextjs-cloudflare
            └─→ Deploy to Cloudflare Workers
                    │
                    └─→ Runtime secrets (Turso) already set via wrangler
```

### Quick CI Status Check

```bash
# View latest workflow runs
gh run list --repo thebhavyafoundation/Bhavya-OS --limit 5

# Check specific run
gh run view <run-id> --repo thebhavyafoundation/Bhavya-OS
```

### Common Failure Points

| Failure                   | Cause                    | Resolution                                     |
| ------------------------- | ------------------------ | ---------------------------------------------- |
| `secret-scan` fails       | Real secret committed    | Remove secret, rotate, force push              |
| `typecheck` fails         | New TS errors introduced | Fix or document in Known Errors                |
| `deploy-cloudflare` fails | Missing secrets / quota  | Verify GitHub secrets, check Cloudflare limits |
| `test` fails              | Flaky test / env missing | Check test logs, verify env vars               |

---

## 10. Credential Rotation Checklist

Run this **quarterly** or when team members change:

### GitHub Secrets

- [ ] Rotate `CLOUDFLARE_API_TOKEN`
- [ ] Rotate `VERCEL_TOKEN`
- [ ] Verify `CLOUDFLARE_ACCOUNT_ID`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` unchanged

### Supabase

- [ ] Rotate JWT secret (Dashboard → Settings → API)
- [ ] Update `NEXT_PUBLIC_SUPABASE_ANON_KEY` in all environments
- [ ] Verify RLS policies still work

### Cloudflare

- [ ] Rotate API Token (create new, delete old)
- [ ] Update GitHub secret
- [ ] Verify Worker still deploys

### Backblaze B2

- [ ] Create new Application Key
- [ ] Update both client/server environment variables
- [ ] Verify upload/download works

### Turso

- [ ] Rotate auth token (Turso Dashboard → Database → Generate Token)
- [ ] Update via `wrangler secret put`
- [ ] Verify Worker connects

---

## 11. Emergency Procedures

### Worker Down / 500 Errors

```bash
# Check Worker logs
npx wrangler tail bhavya-foundation --env production

# Check recent deployments
gh run list --repo thebhavyafoundation/Bhavya-OS --workflow deploy-cloudflare.yml

# Rollback to previous deployment
gh run view <previous-successful-run-id> --repo thebhavyafoundation/Bhavya-OS
# Re-deploy that commit SHA manually if needed
```

### Database Connection Issues

```bash
# Test Turso connection locally
npx wrangler d1 execute bhavya-foundation --command "SELECT 1" --remote

# Check Worker can reach Turso
# Add temporary logging to Worker code, redeploy
```

### Asset Upload Failures

```bash
# Verify B2 credentials
node -e "
const { checkB2Health } = require('./apps/ai-institute/src/lib/b2/client.ts');
checkB2Health().then(r => console.log(r));
"

# Check bucket permissions in Backblaze dashboard
```

---

## 12. Quick Reference Commands

```bash
# Full local verification suite
pnpm antislop && pnpm tokens:check && pnpm test

# Typecheck (note: known errors exist)
pnpm typecheck

# Build for Cloudflare
cd apps/ai-institute && pnpm build:cloudflare

# Deploy to Cloudflare (requires secrets)
cd apps/ai-institute && pnpm deploy

# Run database migrations
cd apps/ai-institute && pnpm db:migrate

# Check migration status
pnpm --filter @bhavya/database test

# View GitHub Actions
gh run list --repo thebhavyafoundation/Bhavya-OS

# View Cloudflare Worker logs
npx wrangler tail bhavya-foundation --env production

# Set Worker runtime secrets
npx wrangler secret put SECRET_NAME --env production
```

---

## 13. Contacts & Resources

| Service      | Dashboard                                           | Support |
| ------------ | --------------------------------------------------- | ------- |
| GitHub       | https://github.com/thebhavyafoundation/Bhavya-OS    | -       |
| Supabase     | https://supabase.com/dashboard/project/<project-id> | -       |
| Cloudflare   | https://dash.cloudflare.com/                        | -       |
| Vercel       | https://vercel.com/dashboard                        | -       |
| Backblaze B2 | https://secure.backblaze.com/buckets/               | -       |
| Turso        | https://turso.tech/dashboard                        | -       |

---

## 14. Onboarding New AI Agent (This Session Protocol)

When a new AI agent starts a session on this repo, they **MUST**:

1. [ ] Read `AGENTS.md` (this file) — workspace identity & ICM architecture
2. [ ] Read `CONTEXT.md` — task routing & hub navigation
3. [ ] Read this checklist (`docs/architecture/CLOUD_INFRASTRUCTURE_SETUP_CHECKLIST.md`)
4. [ ] Run verification: `pnpm antislop && pnpm tokens:check && pnpm test`
5. [ ] Check GitHub Actions status: `gh run list --repo thebhavyafoundation/Bhavya-OS`
6. [ ] Verify Cloudflare Worker: `npx wrangler tail bhavya-foundation --env production` (if needed)
7. [ ] Confirm all required environment variables are set in respective platforms
8. [ ] **Stop and ask human** if any credentials are missing or any check fails

---

## 15. Last Verified

| Check                | Date       | Status          | Notes                             |
| -------------------- | ---------- | --------------- | --------------------------------- |
| GitHub Secrets       | 2026-10-10 | ⚠️ Verify       | Check in Settings → Secrets       |
| Supabase Credentials | 2026-10-10 | ⚠️ Needs Setup  | Add to env / secrets              |
| Cloudflare Worker    | 2026-10-10 | ✅ Deployed     | Worker `bhavya-foundation` active |
| Vercel Project       | 2026-10-10 | ⚠️ Verify       | Check project linked              |
| B2 Bucket            | 2026-10-10 | ✅ Created      | Bucket `bhavya-ai-assets` exists  |
| Turso Database       | 2026-10-10 | ⚠️ Needs Setup  | Create DB, add secrets            |
| Local Typecheck      | 2026-10-10 | ❌ Known Errors | 50+ TS errors (documented)        |
| Local Tests          | 2026-10-10 | ✅ 283 Pass     | ai-institute test suite green     |
| Antislop Gate        | 2026-10-10 | ✅ PASS         | No AI slop detected               |
| Tokens Check         | 2026-10-10 | ✅ PASS         | All apps in sync                  |

---

**Document Version**: 1.0
**Last Updated**: 2026-10-10
**Next Review**: 2026-11-10 (or on credential rotation)

> **Note**: This checklist is part of the ICM Layer 3 (factory) configuration. It persists across runs and should be updated whenever infrastructure changes.
