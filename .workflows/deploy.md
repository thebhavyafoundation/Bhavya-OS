# Workflow: Deploy

## Trigger

- Code merged to main branch
- Manual deployment request

## Steps

1. **Validate** — Run all tests and checks
2. **Build** — Create production build
3. **Deploy to Staging** — Deploy to staging environment
4. **Test Staging** — Run integration tests
5. **Approve** — Get manual approval
6. **Deploy to Production** — Deploy to production
7. **Monitor** — Monitor for issues
8. **Notify** — Notify stakeholders

## Agents Involved

- QA (testing)
- Release (deployment)
- Security (security checks)
- CTO (approval)

## Output

- Deployed application
- Deployment log
- Release notes
- Updated changelog
