# Update Procedure — Design Taste OpenCode Skill

## 1. Policy

The skill is **pinned on purpose**. There is no unattended tracking of
upstream `main`, and no `npx skills update` / `@latest` install is run on
any job.

Upstream changed the shape of this skill between major versions: at the
pinned commit it is a single instruction file, and at `main` it is a v2.5
tree with reference documents, executable scripts and bundled assets. An
unattended upgrade would therefore change the licence surface, the runtime
behaviour and the amount of material the Bhavya licence review covers,
without anyone deciding to accept that change.

Upgrading is a **human decision**. It is not part of a routine build, a
routine dependency bump or a routine job.

## 2. Update steps

1. **Read the upstream licence again.** If it is no longer MIT, or if the
   upstream repository's licence, owner or terms change, stop. The wrapper
   returns to `DISABLED_LICENSE_UNVERIFIED` and the skill is not used.
2. **Choose a commit explicitly.** Record the full 40-character SHA. Never
   record a branch name.
3. **Review the upstream tree at that commit**, not just the `SKILL.md`:
   list every file the skill brings with it, and read the licence of each
   bundled asset, font, icon or script.
4. **Review any new executable code** before it is installed. The pinned
   version contains none. A version with scripts needs a fresh
   `SECURITY-REVIEW.md`: what it executes, what it reads, what it fetches,
   what it writes.
5. **Install by copying files into `.opencode/skills/design-taste-frontend/`**,
   never by running an upstream installer script. Use the current supported
   OpenCode skill structure: a skill directory containing `SKILL.md` with
   YAML frontmatter (`name`, `description`), plus any supporting
   `references/` or `scripts/` the skill actually references.
6. **Update the wrapper** `.opencode/skills/bhavya-design-taste/SKILL.md`:
   `upstream_pin`, `upstream_license`, `update_procedure`,
   `uninstall_procedure`, and the `description` if the upstream
   description changed. Keep `wrapper_state: ENABLED` only if the licence
   review still supports it.
7. **Update the records**: `UPSTREAM-PIN.md` (pin, verification method,
   findings), `LICENSE-REVIEW.md`, `SECURITY-REVIEW.md`,
   `INSTALLATION.md`, `UPDATE-PROCEDURE.md`, `UNINSTALL-PROCEDURE.md`.
8. **Re-verify**:
   ```bash
   node scripts/check-skill-wrappers.mjs
   pnpm antislop
   pnpm tokens:check
   ```
9. **Open a PR.** The change is committed like any other, and reviewed
   before it reaches `master`.

## 3. Rollback

The pinned commit and the exact file listing are recorded in
`UPSTREAM-PIN.md`. To roll back:

1. Restore `.opencode/skills/design-taste-frontend/` to the file listing
   recorded for the previous pin.
2. Restore the previous `upstream_pin` and `upstream_license` values in the
   wrapper.
3. Re-run `node scripts/check-skill-wrappers.mjs`.
4. If the skill cannot be restored safely, set
   `wrapper_state: DISABLED_LICENSE_UNVERIFIED` in the wrapper. The gate
   refuses the skill; nothing else in the repository depends on it.

Rollback is a local file operation. It does not require a release, and it
does not affect the application bundle.
