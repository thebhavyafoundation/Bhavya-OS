# Installation — Diagram Design OpenCode Skill

**Stage:** 2 — Install for OpenCode  
**Status:** COMPLETE  
**OS:** Windows (Developer Mode unavailable → controlled copy, not symlink)

---

## 1. What was installed

| Item                       | Value                                                                            |
| -------------------------- | -------------------------------------------------------------------------------- |
| Upstream repository        | https://github.com/cathrynlavery/diagram-design                                  |
| Pinned commit SHA          | `b46c9701f035844a20b13ab0551315977188933b`                                       |
| Pinned checkout (external) | `C:\Users\kanta\.local\share\bhavya-tools\diagram-design\skills\diagram-design\` |
| OpenCode skill install     | `C:\Users\kanta\.config\opencode\skills\diagram-design\`                         |
| Repo junction view         | `skills/diagram-design` → `.opencode/skills` (junction already present)          |

The install contains only `skills/diagram-design/` from the upstream checkout (SKILL.md, references/, scripts/, assets/). No other upstream files were brought into Bhavya.

## 2. Method (Windows)

1. Detected OS: Windows 11 (PowerShell 5.1), git 2.53.0 available.
2. Cloned upstream to a temp directory outside the monorepo: `...\Temp\opencode\diagram-design-upstream`.
3. Checked out verified commit `b46c9701f035844a20b13ab0551315977188933b` (HEAD of `main`; repository publishes no versioned releases).
4. Copied only `skills/diagram-design/` to the pinned checkout at `~/.local/share/bhavya-tools/diagram-design/skills/diagram-design/`.
5. Attempted symlink `~/.config/opencode/skills/diagram-design` → pinned checkout: **blocked** (requires administrator / Developer Mode).
6. Controlled copy instead: `~/.config/opencode/skills/diagram-design/` contains a verbatim copy of the pinned skill.
7. External checkout left in temp (not committed, not in the monorepo).
8. No existing Bhavya skill overwritten; root `AGENTS.md` untouched.

## 3. Verification — OpenCode discovery

```
$ Get-ChildItem ~/.config/opencode/skills | Select-Object Name
...
diagram-design
...
```

`skills/diagram-design` is also visible through the repo's existing `skills/` junction (mount point to `.opencode/skills`). OpenCode discovers the skill from its installed skill directory on session start; `SKILL.md` (name: `diagram-design`, license: MIT) is the entry point.

## 4. What was NOT done

- Did not clone the complete upstream repository into the Bhavya monorepo.
- Did not add Diagram Design as a production runtime dependency.
- Did not modify `AGENTS.md`.
- Did not overwrite any existing skill under `skills/` or `.opencode/skills/`.
- Did not enable automatic unpinned updates.

## 5. Re-verification command

```powershell
# Confirm installed path, copy state, and required files
Test-Path "$HOME\.config\opencode\skills\diagram-design\SKILL.md"
Get-ChildItem "$HOME\.config\opencode\skills\diagram-design" | Select-Object Name
# Confirm pinned commit recorded
Get-Content "D:\Bhavya OS\docs\tools\diagram-design\UPSTREAM-AUDIT.md" | Select-String "b46c970"
```
