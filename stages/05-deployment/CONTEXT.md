# Stage 05: Deployment

**Purpose:** Deploy verified build to production, monitor, record deployment.
**Input:** Verification report from stage 04 (must be PASS).
**Output:** `output/[topic-slug]-deployment-record.md`

---

## Inputs

| Source         | File/Location                                  | Section/Scope                   | Why                |
| -------------- | ---------------------------------------------- | ------------------------------- | ------------------ |
| Previous stage | `../04-verification/output/`                   | Full file (verification report) | Gate results       |
| Canvas         | `../../specs/[topic-slug]-reasons-canvas.md`   | A (Architecture Impact)         | Deployment scope   |
| Deploy config  | `../../_config/build-conventions.md`           | Deployment section              | Deploy pipeline    |
| Deploy skill   | `../../skills/bhavya-github-workflow/SKILL.md` | Deploy workflow                 | GitHub deploy      |
| Rollback       | `../../_config/build-conventions.md`           | Rollback procedure              | Emergency rollback |
| CI/CD          | `../../.github/workflows/deploy.yml`           | Full file                       | Deploy automation  |

---

## Process

1. **Read verification report** — Confirm overall PASS; no unresolved failures
2. **Verify deploy prerequisites** — All gates PASS, no open security issues
3. **Execute deployment**:
   - Merge to `main` branch (triggers `.github/workflows/deploy.yml`)
   - Monitor Vercel deployment
   - Wait for deployment completion
4. **Run post-deploy verification**:
   - Visual verification on deployed URL (Playwright MCP)
   - Smoke test critical routes
   - Check error rates / performance
5. **Run checkpoint** — Present deployment status to human (see Checkpoints)
6. **Record deployment** — Deployment ID, URL, timestamp, commit SHA
7. **Save to output/** — Write deployment record

---

## Outputs

| Artifact          | Location                                   | Format                            |
| ----------------- | ------------------------------------------ | --------------------------------- |
| Deployment record | `output/[topic-slug]-deployment-record.md` | Markdown with deployment metadata |

### Deployment Record Structure

```markdown
---
topic: [topic-slug]
stage: 05-deployment
date: [ISO timestamp]
verification: [path to verification report]
deploymentId: [Vercel deployment ID]
url: [production URL]
commit: [git SHA]
branch: main
status: SUCCESS/FAILED
---

## Deployment Details

- **Deployment ID**: [Vercel ID]
- **URL**: [https://...]
- **Commit**: [SHA]
- **Branch**: main
- **Trigger**: Merge to main
- **Duration**: Xm Ys

## Post-Deploy Verification

| Check               | Status    | Details               |
| ------------------- | --------- | --------------------- |
| Visual (Playwright) | PASS/FAIL | Screenshot comparison |
| Smoke Tests         | PASS/FAIL | Critical routes       |
| Error Rate          | PASS/FAIL | < 0.1%                |
| Performance         | PASS/FAIL | Lighthouse scores     |

## Rollback Plan (if needed)

- **Trigger**: [Condition]
- **Command**: `vercel rollback [deploymentId]` or revert merge
- **Verification**: Post-rollback checks

## Notes

[Any observations, follow-ups]
```

---

## Checkpoints

| After Step               | Agent Presents                                               | Human Decides                                               |
| ------------------------ | ------------------------------------------------------------ | ----------------------------------------------------------- |
| 3 (deployment complete)  | Deployment URL, Vercel status, initial health checks         | Confirm deployment / Initiate rollback / Investigate issues |
| 4 (post-deploy verified) | Visual verification results, smoke test results, error rates | Mark deployment SUCCESS / Initiate rollback                 |

---

## Audits

| Check                          | Pass Condition                                      |
| ------------------------------ | --------------------------------------------------- |
| Verification report PASS       | Stage 04 overall status is PASS                     |
| Deployment triggered correctly | Merge to `main` triggered Vercel deploy             |
| Post-deploy checks run         | Visual, smoke, error rate, performance all executed |
| Deployment recorded            | Deployment ID, URL, commit, timestamp all captured  |
| Rollback plan documented       | Clear trigger, command, verification steps          |

---

## References (in `references/`)

- `deploy-checklist.md` — Pre-deploy verification checklist
- `rollback-procedure.md` — Emergency rollback steps
