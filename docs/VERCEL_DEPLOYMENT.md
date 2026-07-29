# Bhavya Foundation — Vercel Deployment Guide

## Overview

This guide covers deploying all 12 Bhavya Foundation apps to Vercel with separate subdomains.

### Target URLs

| App | URL |
|-----|-----|
| website | `bhavyafoundation.org` (apex domain) |
| dashboard | `dashboard.bhavyafoundation.org` |
| forest | `forest.bhavyafoundation.org` |
| heritage | `heritage.bhavyafoundation.org` |
| research | `research.bhavyafoundation.org` |
| volunteer | `volunteer.bhavyafoundation.org` |
| knowledge | `knowledge.bhavyafoundation.org` |
| library | `library.bhavyafoundation.org` |
| admin | `admin.bhavyafoundation.org` |
| docs | `docs.bhavyafoundation.org` |
| transparency | `transparency.bhavyafoundation.org` |
| design-system | `design-system.bhavyafoundation.org` |

---

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Access**: Connect your GitHub account to Vercel
3. **Node.js >= 20.9.0**: Required for building
4. **pnpm**: Package manager (Vercel auto-detects from `packageManager` field)

---

## Step 1: Import Repository to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select `thebhavyafoundation/Bhavya-OS`
4. Vercel will detect it's a monorepo

---

## Step 2: Configure Each App as a Separate Vercel Project

For each app, create a new Vercel project with these settings:

### General Settings

| Setting | Value |
|---------|-------|
| **Project Name** | `bhavya-<app-name>` (e.g., `bhavya-website`) |
| **Framework Preset** | Next.js |
| **Root Directory** | `.` (monorepo root) |
| **Node.js Version** | 20.x |

### Build & Development Settings

| Setting | Value |
|---------|-------|
| **Install Command** | `pnpm install` |
| **Build Command** | `pnpm --filter @bhavya/<package-name> build` |
| **Output Directory** | `apps/<app-name>/.next` |
| **Development Command** | `pnpm --filter @bhavya/<package-name> dev` |

### Environment Variables

No environment variables are required for basic deployment.

---

## Step 3: App-Specific Configuration

### Website (bhavyafoundation.org)

```yaml
Project Name: bhavya-website
Root Directory: .
Install Command: pnpm install
Build Command: pnpm --filter @bhavya/website build
Output Directory: apps/website/.next
```

**Special Notes:**
- Uses GSAP for animations
- Has CSP headers configured
- Deploy to apex domain (not subdomain)

### Dashboard (dashboard.bhavyafoundation.org)

```yaml
Project Name: bhavya-dashboard
Root Directory: .
Install Command: pnpm install
Build Command: pnpm --filter @bhavya/dashboard build
Output Directory: apps/dashboard/.next
```

**Special Notes:**
- Custom webpack config for module resolution
- Transpiles `@bhavya/content-core`, `@bhavya/intelligence`, `@bhavya/ui`

### Forest (forest.bhavyafoundation.org)

```yaml
Project Name: bhavya-forest
Root Directory: .
Install Command: pnpm install
Build Command: pnpm --filter @bhavya/forest build
Output Directory: apps/forest/.next
```

**Special Notes:**
- Uses `@bhavya/maps` (MapLibre GL)
- Transpiles 6 packages

### Heritage (heritage.bhavyafoundation.org)

```yaml
Project Name: bhavya-heritage
Root Directory: .
Install Command: pnpm install
Build Command: pnpm --filter @bhavya/heritage build
Output Directory: apps/heritage/.next
```

### Research (research.bhavyafoundation.org)

```yaml
Project Name: bhavya-research
Root Directory: .
Install Command: pnpm install
Build Command: pnpm --filter @bhavya/research build
Output Directory: apps/research/.next
```

### Volunteer (volunteer.bhavyafoundation.org)

```yaml
Project Name: bhavya-volunteer
Root Directory: .
Install Command: pnpm install
Build Command: pnpm --filter @bhavya/volunteer build
Output Directory: apps/volunteer/.next
```

### Knowledge (knowledge.bhavyafoundation.org)

```yaml
Project Name: bhavya-knowledge
Root Directory: .
Install Command: pnpm install
Build Command: pnpm --filter @bhavya/knowledge build
Output Directory: apps/knowledge/.next
```

**Special Notes:**
- Uses `@bhavya/intelligence` package

### Library (library.bhavyafoundation.org)

```yaml
Project Name: bhavya-library
Root Directory: .
Install Command: pnpm install
Build Command: pnpm --filter @bhavya/library build
Output Directory: apps/library/.next
```

### Admin (admin.bhavyafoundation.org)

```yaml
Project Name: bhavya-admin
Root Directory: .
Install Command: pnpm install
Build Command: pnpm --filter @bhavya/admin-app build
Output Directory: apps/admin/.next
```

**Special Notes:**
- Package name is `@bhavya/admin-app`

### Docs (docs.bhavyafoundation.org)

```yaml
Project Name: bhavya-docs
Root Directory: .
Install Command: pnpm install
Build Command: pnpm --filter @bhavya/docs-app build
Output Directory: apps/docs/.next
```

**Special Notes:**
- Package name is `@bhavya/docs-app`

### Transparency (transparency.bhavyafoundation.org)

```yaml
Project Name: bhavya-transparency
Root Directory: .
Install Command: pnpm install
Build Command: pnpm --filter @bhavya/transparency build
Output Directory: apps/transparency/.next
```

**Special Notes:**
- Zero workspace dependencies (simplest deployment)

### Design System (design-system.bhavyafoundation.org)

```yaml
Project Name: bhavya-design-system
Root Directory: .
Install Command: pnpm install
Build Command: pnpm --filter @bhavya/design-system build
Output Directory: apps/design-system/.next
```

---

## Step 4: Configure Custom Domains

After deploying each app:

1. Go to the Vercel project's **Settings → Domains**
2. Add the custom domain:
   - Website: `bhavyafoundation.org` and `www.bhavyafoundation.org`
   - Others: `<subdomain>.bhavyafoundation.org`
3. Configure DNS records as instructed by Vercel:

### DNS Configuration

Add these DNS records to your domain registrar:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |
| CNAME | `dashboard` | `cname.vercel-dns.com` |
| CNAME | `forest` | `cname.vercel-dns.com` |
| CNAME | `heritage` | `cname.vercel-dns.com` |
| CNAME | `research` | `cname.vercel-dns.com` |
| CNAME | `volunteer` | `cname.vercel-dns.com` |
| CNAME | `knowledge` | `cname.vercel-dns.com` |
| CNAME | `library` | `cname.vercel-dns.com` |
| CNAME | `admin` | `cname.vercel-dns.com` |
| CNAME | `docs` | `cname.vercel-dns.com` |
| CNAME | `transparency` | `cname.vercel-dns.com` |
| CNAME | `design-system` | `cname.vercel-dns.com` |

---

## Step 5: Deploy via CLI (Alternative)

You can also deploy using the Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy a specific app
cd apps/website
vercel --prod

# Or use the deployment script
./scripts/deploy-vercel.sh website
```

---

## Troubleshooting

### Build Failures

1. **Workspace dependencies not found**
   - Ensure `pnpm install` runs at the monorepo root
   - Check that `pnpm-workspace.yaml` includes the app

2. **TypeScript errors**
   - Run `pnpm typecheck` locally before deploying
   - Fix all type errors before deploying

3. **Module resolution errors**
   - Check `next.config.ts` for correct `transpilePackages`
   - Ensure shared packages are built first

### Common Issues

| Issue | Solution |
|-------|----------|
| `Module not found` | Run `pnpm install` and ensure workspace links are correct |
| `Type error` | Run `pnpm typecheck` and fix errors |
| `Build timeout` | Increase Vercel build timeout in project settings |
| `Memory exceeded` | Upgrade Vercel plan or optimize build |

---

## Monitoring

After deployment, monitor each app:

1. **Vercel Dashboard**: Check build logs and deployment status
2. **Analytics**: Enable Vercel Analytics for performance monitoring
3. **Logs**: Check function logs for runtime errors

---

## Rollback

To rollback a deployment:

1. Go to the Vercel project's **Deployments** tab
2. Find the previous successful deployment
3. Click **...** → **Promote to Production**

---

## Support

For issues with deployment:
- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Contact the development team
- Open an issue on GitHub
