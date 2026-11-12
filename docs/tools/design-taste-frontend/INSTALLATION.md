# Installation — Design Taste OpenCode Skill

## 1. What was installed

| Item                           | Path                                                                                                     |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Upstream skill (vendored copy) | `.opencode/skills/design-taste-frontend/SKILL.md`                                                        |
| Bhavya wrapper                 | `.opencode/skills/bhavya-design-taste/SKILL.md`                                                          |
| Licence / pin record           | `docs/tools/design-taste-frontend/LICENSE-REVIEW.md`, `docs/tools/design-taste-frontend/UPSTREAM-PIN.md` |
| Security review                | `docs/tools/design-taste-frontend/SECURITY-REVIEW.md`                                                    |

Pinned upstream commit:
`3c7017d636c3a4aad378433ea6d0cfa6c921da4a` (MIT).

## 2. Method

The skill was **already installed** in this repository and was reused, not
re-downloaded:

- The copy at `.opencode/skills/design-taste-frontend/SKILL.md` was
  compared byte-for-byte against upstream `skills/taste-skill/SKILL.md` at
  the pinned commit.
- After normalising line endings the two differ by exactly one line: the
  installed copy omits a blank line after the YAML frontmatter.
- The upstream licence was read directly and confirmed as MIT.

Nothing was fetched, overwritten or re-installed. The upstream `install.sh`
was never executed: it is a third-party script that installs Claude Code
plugins, which is not the OpenCode installation structure this repository
uses.

## 3. Verification — OpenCode discovery

OpenCode discovers project skills under `.opencode/skills/`, and the
repository's `skills/` path is a junction to that directory, so the skill is
reachable under both paths.

Discovery was confirmed through the repository's own wrapper gate, which
enumerates every skill wrapper and checks that each upstream skill it names
is present, pinned and reachable:

```bash
node scripts/check-skill-wrappers.mjs
```

Result: `RESULT: PASS — every wrapper is well-formed and no unverified skill
is reachable`.

The wrapper state moved from `DISABLED_LICENSE_UNVERIFIED` to `ENABLED` on
the basis of the licence verification above. The skill is reached only
through the wrapper, which reads `AGENTS.md` and
`docs/architecture/PLATFORM-TRUTH.md` first.

## 4. What was NOT done

- Upstream `install.sh` was not executed.
- The upstream Claude Code plugin marketplace was not added.
- No `@latest` upgrade was performed.
- The newer upstream v2.5 tree (`references/`, `scripts/`, `library/`,
  `assets/`) was **not** installed. It is a different artefact with a
  different licence and runtime surface, and adopting it is a separate
  reviewed decision — see `UPDATE-PROCEDURE.md`.
- No animation, font or component library was added to the application.
  Installing an engineering skill must not add a runtime frontend dependency.
- No file under `apps/`, `packages/` or `docs/constitution/` was modified by
  the installation itself.

## 5. Re-verification command

```bash
# Confirm the installed copy is present and the wrapper is enabled
grep -m1 wrapper_state .opencode/skills/bhavya-design-taste/SKILL.md
grep -m1 upstream_pin   .opencode/skills/bhavya-design-taste/SKILL.md

# Confirm the repository's wrapper validation gate still passes
node scripts/check-skill-wrappers.mjs
```

## 6. Command mapping

The upstream repository ships Claude Code slash commands and plugins. This
repository does **not** mirror them: OpenCode exposes the skill directly,
and the wrapper is the only supported entry point. No historical slash
command name is assumed to be current.
