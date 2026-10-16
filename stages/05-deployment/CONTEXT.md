# Stage 05: Deployment

**Purpose:** Deploy verified build to production, monitor, record deployment.
**Input:** Verification report from stage 04 (must be PASS).
**Output:** `output/[topic-slug]-deployment-record.md`

---

## Inputs

| Source         | File/Location                                   | Section/Scope                   | Why                |
| -------------- | ----------------------------------------------- | ------------------------------- | ------------------ |
| Previous stage | `../04-verification/output/`                    | Full file (verification report) | Gate results       |
| Canvas         | `../../specs/[topic-slug]-reasons-canvas.md`    | A (Architecture Impact)         | Deployment scope   |
| Deploy config  | `../../_config/build-conventions.md`            | Deployment section              | Deploy pipeline    |
| Platform truth | `../../docs/architecture/PLATFORM-TRUTH.md`     | Full file                       | Canonical host     |
| Deploy skill   | `../../skills/bhavya-github-workflow/SKILL.md`  | Deploy workflow                 | GitHub deploy      |
| Rollback       | `../../_config/build-conventions.md`            | Rollback procedure              | Emergency rollback |
| CI/CD          | `../../.github/workflows/deploy-cloudflare.yml` | Full file                       | Deploy automation  |

---

## Process

1. **Read verification report** — Confirm overall PASS; no unresolved failures
2. **Verify deploy prerequisites** — All gates PASS, no open security issues
3. **Execute deployment**:
   - Canonical production is **Cloudflare via OpenNext** (`PLATFORM-TRUTH.md`)
   - Trigger: merge to `master`, or dispatch `deploy-cloudflare.yml` manually
   - Vercel is preview-only and must not be treated as the production result
   - Monitor the Cloudflare Workers deploy to completion
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
worker: bhavya-foundation
deploymentId: [Cloudflare Worker version ID]
url: [production URL]
commit: [git SHA]
branch: master
status: SUCCESS/FAILED
---

## Deployment Details

- **Host**: Cloudflare (OpenNext)
- **Worker**: `bhavya-foundation`
- **Version ID**: [Cloudflare version ID]
- **URL**: [https://...]
- **Commit**: [SHA]
- **Branch**: master
- **Trigger**: Merge to master / workflow_dispatch
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
- **Command**: revert the merge on `master` and let `deploy-cloudflare.yml` redeploy the previous known-good commit; Cloudflare retains prior Worker versions for direct version rollback
- **Verification**: Post-rollback checks

## Notes

[Any observations, follow-ups]
```

---

## Checkpoints

| After Step               | Agent Presents                                                  | Human Decides                                               |
| ------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------- |
| 3 (deployment complete)  | Production URL, Cloudflare deploy status, initial health checks | Confirm deployment / Initiate rollback / Investigate issues |
| 4 (post-deploy verified) | Visual verification results, smoke test results, error rates    | Mark deployment SUCCESS / Initiate rollback                 |

---

## Audits

| Check                          | Pass Condition                                      |
| ------------------------------ | --------------------------------------------------- |
| Verification report PASS       | Stage 04 overall status is PASS                     |
| Production host respected      | Deployed to Cloudflare, not Vercel production       |
| Deployment triggered correctly | Cloudflare deploy ran from `master`                 |
| Post-deploy checks run         | Visual, smoke, error rate, performance all executed |
| Deployment recorded            | Worker version, URL, commit, timestamp all captured |
| Rollback plan documented       | Clear trigger, command, verification steps          |

---

## References (in `references/`)

- `deploy-checklist.md` — Pre-deploy verification checklist
- `rollback-procedure.md` — Emergency rollback steps
