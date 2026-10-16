# Production Trigger Verification

**Date:** 2026-10-16
**Verified against:** `master` @ `3a3cbd22d17af124a837e9591c1bc0c8abb658c8`
**Method:** direct inspection of the workflow file as it exists on `master`, plus GitHub Settings inspection.
**No workflow was triggered by this verification.**

---

# ⚠️ HEADLINE WARNING

> **On `master` today, EVERY push to `master` triggers a Cloudflare production deployment.**
>
> There are **no path filters**, **no `workflow_dispatch`**, **no concurrency control**, and
> **no environment approval gate**. `master` is **not protected** — no classic branch
> protection and no rulesets.
>
> **Every one of PRs #27, #28, #29 and #30 will deploy to production when merged.**

---

## 1. The workflow that is actually on `master`

`git show origin/master:.github/workflows/deploy-cloudflare.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [master] # <-- no `paths:` filter

jobs:
  build-and-deploy:
    name: Build and Deploy to Cloudflare
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@... # pinned
      - uses: pnpm/action-setup@... # pinned
      - uses: actions/setup-node@... # pinned
      - run: pnpm install --frozen-lockfile
      - name: Build for Cloudflare
        working-directory: apps/ai-institute
        run: npx opennextjs-cloudflare build
      - name: Deploy to Cloudflare Workers
        working-directory: apps/ai-institute
        run: npx opennextjs-cloudflare deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

Note there is **no `environment:` key** on the job. That is the reason no approval gate exists.

## 2. Answers, with evidence

| #   | Question                                                              | Answer                                | Evidence                                                                                                         |
| --- | --------------------------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1   | Does every qualifying push to `master` trigger Cloudflare deployment? | **YES — unconditionally**             | `on.push.branches: [master]` with no `paths:`/`paths-ignore:`                                                    |
| 2   | Are path filters already active on `master`?                          | **NO**                                | No `paths:` key in the file                                                                                      |
| 3   | Would merging #27 trigger production?                                 | **YES**                               | Any merge to master deploys, regardless of paths                                                                 |
| 4   | Would merging #28 trigger production?                                 | **YES**                               | Same                                                                                                             |
| 5   | Would merging #30 trigger production?                                 | **YES**                               | Same                                                                                                             |
| 6   | Would merging #29 trigger production?                                 | **YES**                               | See note below                                                                                                   |
| 7   | Does `workflow_dispatch` exist on `master` or only in #29?            | **Only in #29**                       | `master` file has no `workflow_dispatch` key                                                                     |
| 8   | Is a protected GitHub production environment configured?              | **NO**                                | No `environment:` key in the job; environment list shows `Production*` entries all with `protection_rules: none` |
| 9   | Does deployment require human environment approval?                   | **NO**                                | No environment is declared, so no approval gate can apply                                                        |
| 10  | What exact paths trigger deployment?                                  | **ANY path.** There is no path filter | See §1                                                                                                           |

### Note on #29 (Q6)

GitHub evaluates the workflow definition **as it exists at the merged commit**. After #29 merges,
`master` would carry #29's hardened `deploy-cloudflare.yml`, whose filter is:

```yaml
paths:
  - "apps/ai-institute/**"
  - "packages/**"
  - "content/**"
  - "package.json"
  - "pnpm-lock.yaml"
  - "turbo.json"
  - ".github/workflows/deploy-cloudflare.yml"
```

#29 itself modifies `.github/workflows/deploy-cloudflare.yml`, which **is** in that list — so the
#29 merge itself **would still trigger a deploy**, even under the hardened filter. The hardening
reduces accidental deploys from unrelated merges; it does not make #29 a no-deploy merge.

## 3. Branch protection state

| Control                   | State              | Evidence                                                                   |
| ------------------------- | ------------------ | -------------------------------------------------------------------------- |
| Classic branch protection | **Not configured** | Settings → Branches: "Classic branch protections have not been configured" |
| Rulesets                  | **None**           | Settings → Rules: "You haven't created any rulesets"                       |
| Force-push prevention     | **No**             | No rule of any kind exists                                                 |
| Required pull requests    | **No**             | —                                                                          |
| Required status checks    | **No**             | —                                                                          |
| Review requirement        | **No**             | —                                                                          |

**Consequence:** any collaborator with write access can push directly to `master` and thereby
trigger a production deployment. The CI checks are informative, not gating.

## 4. Effective safety posture on `master`

| Control                                 | Present on master | Present in #29                   | Present in #30 |
| --------------------------------------- | ----------------- | -------------------------------- | -------------- |
| Path filters on deploy                  | ❌                | ✅                               | n/a            |
| `workflow_dispatch` (deliberate deploy) | ❌                | ✅                               | n/a            |
| Concurrency (no interrupted deploys)    | ❌                | ✅ (`cancel-in-progress: false`) | n/a            |
| Platform contract gate in CI            | ❌                | n/a                              | ✅             |
| Branch protection / required checks     | ❌                | ❌                               | ❌             |
| Production environment approval         | ❌                | ❌                               | ❌             |

## 5. Recommendations (require human action — not performed here)

These are **not** implemented by this document. They are recorded so the human can decide.

1. **Merge #29 before any other merge.** It is the only change that adds path filters and a
   deliberate `workflow_dispatch`. Merging it first means subsequent merges only deploy when
   they genuinely change the app.
2. **Add branch protection on `master`**: require PR, require the `Platform contract` and
   `build` checks, require one approving review, block force-push. The `Platform contract` job
   arrives with #30 and becomes the first machine-enforced policy gate.
3. **Consider a `Production` environment with a required reviewer** on the deploy job. This
   would make every production deploy an explicit human approval, matching the contract's
   "production actions require human approval".
4. **Prefer `workflow_dispatch` over merge-triggered deploys** once #29 lands, so shipping docs
   does not redeploy the Worker.

## 6. Verification commands used

```bash
git show origin/master:.github/workflows/deploy-cloudflare.yml
git show origin/master:.github/workflows/deploy-cloudflare.yml | grep -c workflow_dispatch   # 0
git show origin/master:.github/workflows/deploy-cloudflare.yml | grep -c 'paths:'            # 0
git show origin/master:.github/workflows/deploy-cloudflare.yml | grep -c concurrency          # 0
git show origin/master:.github/workflows/deploy-cloudflare.yml | grep -c 'environment:'       # 0
```

GitHub Settings inspected at `settings/branches` and `settings/rules` (authenticated browser).
Environments enumerated via the repository environments API.
