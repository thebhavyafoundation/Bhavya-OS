# Ruflo — Update Procedure

Ruflo is pinned deliberately. Do not run unattended `latest` upgrades.

## Preconditions

- Upstream reviewed at a specific commit.
- Licence re-verified (currently MIT).
- The candidate version's `scripts/`, dependencies and install scripts reviewed.
- A fresh remote sandbox is used for the trial — never the current one.

## 1. Identify the candidate

```bash
npm view ruflo versions --json | tail -20
npm view ruflo@<candidate> license dependencies dist.tarball
```

Record the upstream commit that the candidate corresponds to:

```bash
git ls-remote https://github.com/ruvnet/ruflo.git refs/heads/main
```

## 2. Trial in a throwaway remote sandbox

```bash
sandbox create --scope bhavya-foundation --project bhavya-os \
  --name ruflo-upgrade-trial --timeout 30m --vcpus 2 --publish-port 3000 \
  --network-policy allow-all --region iad1

# inside the sandbox
WORKDIR=/vercel/sandbox/ruflo-trial PORT=3000 sh scripts/ruflo/bootstrap-remote.sh
```

Adjust `RUFLO_VERSION` in the bootstrap script for the trial, then revert.

## 3. Re-run the acceptance gate

```bash
sh scripts/ruflo/check-remote.sh /vercel/sandbox/Bhavya-OS
```

Expected: `RESULT: 13 passed, 0 failed`. Any regression in discovery,
execution, cancellation or permissions is a **blocker**, not a warning.

## 4. Re-verify the provider constraint

`agent_execute` must still refuse to run without an explicitly configured
provider, and the approved path must still be the free local model. If a new
version defaults to a paid provider, that is a blocker.

## 5. Update the records

- `docs/tools/ruflo/UPSTREAM-PIN.md` — new upstream commit, npm version, MCP
  package version, verification date.
- `scripts/ruflo/bootstrap-remote.sh` — the pinned `RUFLO_VERSION`.
- `docs/tools/ruflo/SECURITY-REVIEW.md` — re-review install scripts and
  dependencies if the dependency set changed.

## 6. Rollback

The previous pinned version remains recorded in git history. Reverting the
`RUFLO_VERSION` line and re-running the bootstrap restores the previous state.
The application is never affected by a Ruflo version change.
