# Updating the Permanent Operating Contract

**Authority:** `AGENTS.md` (L0 router) and `docs/architecture/PLATFORM-TRUTH.md` (platform facts).

These two files are **permanent and binding**. Everything in this repository —
every skill, command, workflow, agent and human contributor — is subordinate to
them. This document describes how they may be changed, and by whom.

---

## 1. Default: do not change them

The contract exists to stop well-meaning changes from quietly violating the
zero-budget model. Most tasks need no contract change at all.

If your task can be completed by following the contract, follow it. A contract
amendment is a **separate, deliberate act** — never a side effect of feature work.

---

## 2. Who may change the contract

| Role                | May propose  | May merge                                |
| ------------------- | ------------ | ---------------------------------------- |
| AI agent / subagent | Yes, as a PR | **No — never**                           |
| Human maintainer    | Yes          | Yes                                      |
| Project owner       | Yes          | Yes, and is the tie-breaker on conflicts |

An agent may draft a contract change when a task is genuinely blocked by it. It
must open a PR, explain exactly which invariant changes and why, and stop there.
Merging is always a human action.

---

## 3. Amendment procedure

1. **Open an RFC** in `rfcs/` if the change is architectural or platform-wide.
   Use `rfc/<nnnn>-<slug>`.
2. **Amend the minimum.** Change only what must change. An amendment that also
   tidies unrelated lines hides the real diff and is not acceptable.
3. **State the before/after** explicitly for each invariant affected, and the
   operational consequence (cost, vendor, migration, compliance).
4. **Run the zero-budget decision test** (contract §23) and record the answers.
   If payment information would be required, the amendment is prohibited unless
   the owner has explicitly approved it in writing.
5. **Update `scripts/validate-platform-contract.mjs`** if the change adds or alters
   an invariant. `TRUTH_INVARIANTS` in that file is the machine-checked subset of
   the contract; a contract change that is not reflected there is unenforced.
6. **Update every skill, wrapper and command** whose guidance the change
   invalidates. A stale skill that contradicts the contract is worse than no skill.
7. **Verify locally**, then let CI run:
   ```
   node scripts/validate-platform-contract.mjs
   pnpm antislop && pnpm tokens:check && pnpm file-map:check && pnpm drift:check
   ```
8. **Open the PR** using the zero-budget checklist in
   `.github/pull_request_template.md`.
9. **Human merges.** Deployment, if triggered, is a separate human decision.

---

## 4. Precedence and conflicts

Precedence is defined in `AGENTS.md` §1. In short:

```
docs/constitution/ (00 is supreme; lower number wins)
  > AGENTS.md
    > CONTEXT.md chain
      > docs/architecture/ (incl. PLATFORM-TRUTH.md)
        > contracts/, standards/, _shared/
          > .opencode/skills/
            > implementation code
```

If two authorities conflict and this order does not resolve it:
**stop, record the conflict, escalate to a human.** Never silently rewrite
either authority to make the conflict disappear.

---

## 5. Enforcement

`scripts/validate-platform-contract.mjs` runs in CI as the **Platform contract**
job and locally as `pnpm platform:check`. It enforces four things:

1. Both permanent files exist, and `PLATFORM-TRUTH.md` still contains its core invariants.
2. Cloudflare R2 is not used anywhere.
3. Privileged Backblaze B2 variables never appear in a Client Component.
4. No paid-service or payment-method-requiring configuration.

The checker is a **floor, not a ceiling**. It catches mechanical violations. It
cannot judge intent, licence compatibility, factual accuracy of content, or
whether a change is worth making. Those remain human judgement, and a green
checker is never an argument for merging.

---

## 6. Third-party skills and tools

Third-party upstream skill files are **never edited in place**. A pinned tool has
integrity records under `docs/tools/<tool>/` (`UPSTREAM-AUDIT.md`,
`LICENSE-REVIEW.md`, `SECURITY-REVIEW.md`, `INSTALLATION.md`, `UPDATE.md`,
`UNINSTALL.md`); a direct edit invalidates them.

To govern a third-party skill, create a Bhavya wrapper skill that:

1. Reads `AGENTS.md` and `docs/architecture/PLATFORM-TRUTH.md` first.
2. Only then loads the external skill.
3. States the upstream repository, pinned version, licence (or records it as
   unverified) and modification policy.

Current wrappers: `bhavya-impeccable`, `bhavya-apple-design`,
`bhavya-design-taste`, `bhavya-diagram-design`.

---

## 7. Contract change checklist

- [ ] RFC opened (`rfcs/`) if architectural
- [ ] Minimum possible diff
- [ ] Before/after invariants stated, with operational consequence
- [ ] Zero-budget decision test answered and recorded
- [ ] `validate-platform-contract.mjs` `TRUTH_INVARIANTS` updated to match
- [ ] Affected skills / wrappers / commands updated
- [ ] `pnpm platform:check` green
- [ ] Existing gates green (`antislop`, `tokens:check`, `file-map:check`, `drift:check`)
- [ ] PR opened with the zero-budget checklist
- [ ] **Human merged** — agent did not merge
- [ ] Any resulting deploy confirmed as a separate human decision
