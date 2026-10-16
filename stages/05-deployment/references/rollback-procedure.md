# Rollback Procedure — Bhavya Foundation

**For Stage 05: Deployment — Emergency rollback steps.**

---

## Rollback Triggers

Initiate rollback immediately if ANY:

| Metric                 | Threshold           | Action                 |
| ---------------------- | ------------------- | ---------------------- |
| Error rate             | > 1%                | Rollback               |
| Homepage down          | 5xx / timeout       | Rollback               |
| Critical route broken  | Academy, Admin, API | Rollback               |
| Performance regression | > 20% slower        | Investigate → Rollback |
| Security issue         | Any critical        | Rollback + Incident    |
| Data corruption        | Any report          | Rollback + Incident    |

---

## Rollback Methods (Priority Order)

### Method 1: Vercel Instant Rollback (Preferred)

**Time:** ~30 seconds
**Use when:** Deployment just completed, previous deployment healthy

```bash
# List recent deployments
vercel ls --scope <team>

# Rollback to specific deployment
vercel rollback <deployment-id> --scope <team>

# Or promote previous
vercel promote <previous-deployment-url> --scope <team>
```

**Verification:** Check Vercel dashboard → "Promoted to production"

---

### Method 2: Git Revert (If Vercel Fails)

**Time:** 2-3 minutes (new build)
**Use when:** Vercel rollback unavailable, or need code revert

```bash
# 1. Identify merge commit
git log --oneline -10

# 2. Revert merge commit (preserves history)
git checkout main
git pull origin main
git revert -m 1 <merge-commit-sha>

# 3. Push triggers new deployment
git push origin main
```

**Note:** `-m 1` selects first parent (main branch) for merge commits

---

### Method 3: Vercel CLI Promote Previous

**Time:** ~1 minute
**Use when:** Know previous good deployment URL

```bash
# Get previous deployment URL from Vercel dashboard or `vercel ls`
vercel promote https://<project>-<hash>.vercel.app --scope <team>
```

---

## Post-Rollback Verification

**Must complete within 5 minutes of rollback:**

| Check             | Command/Tool         | Pass Criteria |
| ----------------- | -------------------- | ------------- |
| Deployment status | Vercel dashboard     | "Ready"       |
| Homepage          | `curl -I <url>`      | 200 OK        |
| Critical routes   | Playwright smoke     | All 200       |
| Error rate        | Vercel logs / Sentry | < 0.1%        |
| Console errors    | Browser devtools     | None          |

---

## Incident Documentation

After rollback, create incident record:

```markdown
---
type: incident
date: [ISO timestamp]
deployment: [failed deployment ID]
rollback: [method used]
rollbackTime: [ISO timestamp]
---

## Incident: [Brief title]

### Trigger

[What alert/metric triggered rollback]

### Impact

- Users affected: [estimate]
- Routes affected: [list]
- Duration: [X minutes]

### Root Cause

[Preliminary — update after investigation]

### Rollback

- Method: [Vercel rollback / Git revert / Promote]
- Time to recover: [X minutes]
- Verification: [checks passed]

### Follow-up

- [ ] Create fix branch
- [ ] Root cause analysis
- [ ] Preventive measures
- [ ] Post-mortem scheduled
```

Save to `.ai/events/` or incident tracking system.

---

## Rollback Decision Matrix

| Scenario                    | Method                   | Rationale                  |
| --------------------------- | ------------------------ | -------------------------- |
| Just deployed, prev healthy | Vercel rollback          | Fastest, zero build        |
| Vercel issues               | Git revert               | Reliable, triggers rebuild |
| Know good URL               | Promote previous         | Fast, explicit             |
| Multiple bad deploys        | Git revert to known good | Clean history              |
| Database migration          | **DO NOT ROLLBACK**      | Data loss risk — escalate  |

---

## Critical: Database Migrations

**NEVER rollback if deployment included database migration.**

### If Migration Deployed:

1. **STOP** — Do not rollback code
2. Assess: Can migration be reversed safely?
3. If reversible: Run down migration, then rollback code
4. If NOT reversible: Forward fix only — escalate to architecture

### Migration Safety

- All migrations in `packages/*/migrations/` must have `down` function
- Test `down` in staging before production deploy
- Tag migration deployments: `migration-<description>`

---

## Communication

### Internal

- Post to `#incidents` Slack/Discord
- Tag `@oncall` and `@architecture`
- Include: trigger, impact, rollback method, status

### External (if user-facing)

- Status page update
- Support team notification
- Estimated resolution time

---

## References

- `stages/05-deployment/references/deploy-checklist.md` — Pre-deploy checks
- `vercel` CLI: `vercel rollback`, `vercel promote`, `vercel ls`
- `.github/workflows/deploy.yml` — Deploy pipeline
- `bhavya-github-workflow` skill — Git revert process
- `.ai/events/` — Incident records
