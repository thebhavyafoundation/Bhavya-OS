# Licence Review — Design Taste (taste-skill)

## 1. Skill licence

| Field         | Value                                                  |
| ------------- | ------------------------------------------------------ |
| Upstream      | https://github.com/Leonxlnx/taste-skill                |
| Pinned commit | `3c7017d636c3a4aad378433ea6d0cfa6c921da4a`             |
| Licence       | MIT                                                    |
| Copyright     | Copyright (c) 2026 Leonxlnx                            |
| Licence file  | `LICENSE` at the upstream repository root              |
| Verified      | 2026-11-12, read directly from the upstream repository |

The upstream licence was read from the repository rather than inferred from
a badge or a package listing. It is the standard MIT text, including the
requirement that the copyright notice and permission notice accompany copies
and substantial portions of the software.

## 2. Third-party components bundled by the skill

**None at the pinned version.** The pinned artefact is one Markdown file
containing design instructions. It contains no bundled fonts, icons,
templates, scripts or binary assets, and it declares no third-party
dependencies.

This is materially different from upstream `main` (v2.5.x), which adds
`references/`, `scripts/`, `library/` and `assets/` trees, including a
1 MB `scripts/consistency.mjs`. Those are **not** the pinned version and are
not installed. See `UPSTREAM-PIN.md` for the pin and its rationale.

## 3. Trade marks

The upstream repository name and the phrase "tasteskill" are the upstream
author's marks. Bhavya does not redistribute them as its own brand and does
not present work produced under the skill as a Bhavya product line.

## 4. Generated output

The skill produces design direction and code. Where that output is derived
from the skill's own example material, Bhavya's own rules govern: original
diagrams are authored in-repo under `content/diagrams/` with a recorded
licence, and no third-party marketplace asset is assumed reusable. The
`design-integration-plan.md` §6 asset policy remains the authority.

## 5. Conditions for Bhavya use

1. The MIT notice travels with the vendored copy. It is recorded here and in
   `UPSTREAM-PIN.md`.
2. The skill is subordinate to Bhavya authority: `AGENTS.md`,
   `docs/architecture/PLATFORM-TRUTH.md`, `_config/design-gate.md` and
   `docs/constitution/`.
3. The documented adaptations in `UPSTREAM-PIN.md` (F1–F4) apply. The
   upstream rules they override are recorded, not hidden.
4. No runtime dependency is added to the application.
5. The skill is never permitted to invent institutional facts, impact
   figures, partnerships, accreditation or curriculum counts.

## 6. Sign-off

Licence verified on 2026-11-12 against the upstream repository. The wrapper
was moved from `DISABLED_LICENSE_UNVERIFIED` to `ENABLED` on the same basis.
No other authority was changed.
