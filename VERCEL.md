# Vercel Deployment

## Setup (5 minutes)

### 1. Create Vercel Account
Go to https://vercel.com and sign up with GitHub.

### 2. Import Repository
Click "Add New Project" → Import `bhavya-foundation/bhavya-os`

### 3. Configure Project
- **Framework Preset:** Next.js
- **Root Directory:** `apps/website`
- **Build Command:** `pnpm install && pnpm run build`
- **Install Command:** `pnpm install`

### 4. Add Environment Variables
Add these in Vercel dashboard:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |

### 5. Deploy
Click "Deploy". Vercel will build and deploy automatically.

### 6. Add Custom Domain
In Vercel dashboard → Settings → Domains → Add `bhavya.foundation`

### 7. Get Tokens for GitHub Actions
Run in terminal:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
cd apps/website
vercel link

# Get org and project IDs
cat .vercel/project.json
```

Add to GitHub secrets:
- `VERCEL_TOKEN`: Get from https://vercel.com/account/tokens
- `VERCEL_ORG_ID`: From `.vercel/project.json`
- `VERCEL_PROJECT_ID`: From `.vercel/project.json`

### 8. Enable Auto-Deploy
Push to `main` to trigger automatic deployment.

## URL Structure

| App | URL |
|-----|-----|
| Website | `https://bhavya.foundation` |
| Admin | `https://bhavya-foundation-admin.vercel.app` |
| Docs | `https://bhavya-foundation-docs.vercel.app` |
| Design System | `https://bhavya-foundation-design-system.vercel.app` |

## How It Works

- Every push to `main` → production deployment
- Every PR → preview deployment
- Automatic HTTPS on all URLs
- Automatic build optimization
- Edge network worldwide

## Cost

**Free tier includes:**
- 100GB bandwidth/month
- 100 builds/day
- Automatic HTTPS
- Custom domains
- Preview deployments

## Removing Old Infrastructure

These files are no longer needed and have been removed:

- `terraform/` — Vercel replaces VM provisioning
- `docker/` — Vercel handles containers
- `scripts/deploy.js` — Vercel handles deployment
- `scripts/backup.js` — Vercel handles versioning
- `scripts/restore.js` — Use Vercel's rollback
- `.github/workflows/ci.yml` — Replaced by `deploy.yml`
- `.env.example` — Use Vercel dashboard
