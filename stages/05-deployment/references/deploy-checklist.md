# Deploy Checklist — Bhavya Foundation

**For Stage 05: Deployment — Pre-deploy verification.**

---

## Pre-Deploy Checklist

Run after Stage 04 verification PASS, before merging to `main`.

### Verification Gates

- [ ] Stage 04 overall: **PASS**
- [ ] All 9 gates: **PASS**
- [ ] Production verification: **PASS** (security, performance, a11y, routes)

### Code Quality

- [ ] No `pnpm antislop` violations
- [ ] No `pnpm tokens:check` violations
- [ ] No `pnpm drift:check` violations
- [ ] `git diff` reviewed (R-A7)

### Git State

- [ ] On feature branch (not `main`/`master`)
- [ ] Branch up to date with `master`
- [ ] Conventional commits
- [ ] PR approved (1 review min, 2 for architectural)
- [ ] PR linked to RFC (if architectural)

### Documentation

- [ ] CHANGELOG updated (if user-facing)
- [ ] REASONS Canvas status: `implemented`
- [ ] Spec updated (if applicable)
- [ ] Architecture docs updated (if canonical sources changed)

### Deployment Config

- [ ] Vercel project linked
- [ ] Environment variables set in Vercel
- [ ] Custom domains configured
- [ ] Preview deployments working

---

## Deploy Process

### 1. Merge to Main

```bash
# Via GitHub PR UI: "Squash and merge"
# Or CLI:
git checkout main
git pull origin main
git merge --squash feat/<branch>
git commit
git push origin main
```

### 2. Monitor Vercel Deployment

- Watch `.github/workflows/deploy.yml` run
- Verify Vercel build starts
- Wait for "Ready" status

### 3. Verify Deployment URL

- Get deployment URL from Vercel
- Run post-deploy checks (below)

---

## Post-Deploy Verification

Run within 10 minutes of deployment.

### Visual Verification (Playwright MCP)

```bash
# Automated via .playwright-mcp/
# Checks:
# - Homepage loads
- Key routes render
- No console errors
- Visual regression vs baseline
```

### Smoke Tests

| Route         | Expected | Check           |
| ------------- | -------- | --------------- |
| `/`           | 200      | Homepage        |
| `/academy`    | 200      | Academy landing |
| `/os/admin`   | 200/401  | Admin (auth)    |
| `/os/github`  | 200/401  | GitHub OS       |
| `/api/health` | 200      | Health endpoint |

### Error Rate

- Check Vercel logs / Sentry
- Target: < 0.1% error rate
- Alert if: 5xx > 0, 4xx spike

### Performance

- Lighthouse CI on deployed URL
- Targets: Perf ≥ 90, A11y ≥ 90, Best Practices ≥ 90, SEO ≥ 90

---

## Rollback Procedure

### When to Rollback

- Error rate > 1%
- Critical route broken (homepage, academy, admin)
- Performance regression > 20%
- Security issue detected

### Rollback Commands

```bash
# Option 1: Vercel rollback (instant)
vercel rollback <deployment-id> --scope <team>

# Option 2: Git revert (2-3 min)
git checkout main
git revert <merge-commit-sha>
git push origin main
# Triggers new deployment

# Option 3: Vercel CLI promote previous
vercel promote <previous-deployment-url> --scope <team>
```

### Post-Rollback

- [ ] Verify rollback deployment healthy
- [ ] Run smoke tests
- [ ] Document incident
- [ ] Create fix branch

---

## Deployment Record

Save to `output/[topic-slug]-deployment-record.md`:

```markdown
---
topic: [topic-slug]
stage: 05-deployment
date: [ISO timestamp]
verification: [path to verification report]
deploymentId: [Vercel ID]
url: [production URL]
commit: [git SHA]
branch: main
status: SUCCESS
---

## Deployment Details

- **Deployment ID**: [Vercel ID]
- **URL**: [https://...]
- **Commit**: [SHA]
- **Branch**: main
- **Duration**: Xm Ys

## Post-Deploy Verification

| Check               | Status    | Details           |
| ------------------- | --------- | ----------------- |
| Visual (Playwright) | PASS/FAIL | ...               |
| Smoke Tests         | PASS/FAIL | ...               |
| Error Rate          | PASS/FAIL | < 0.1%            |
| Performance         | PASS/FAIL | Lighthouse scores |

## Notes

[Observations, follow-ups]
```

---

## References

- `.github/workflows/deploy.yml` — Deploy pipeline
- `vercel` CLI docs — `vercel rollback`, `vercel promote`
- `bhavya-github-workflow` skill — Git workflow
- `bhavya-production-verification` skill — Production readiness
- `stages/05-deployment/references/rollback-procedure.md` — Detailed rollback
