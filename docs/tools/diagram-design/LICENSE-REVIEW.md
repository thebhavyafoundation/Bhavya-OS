# Licence Review — Diagram Design

**Stage:** 1 — Upstream due diligence  
**Verdict:** COMPATIBLE — proceed

---

## 1. Skill licence

| Field            | Value                                                                           |
| ---------------- | ------------------------------------------------------------------------------- |
| Licence          | MIT License                                                                     |
| Copyright holder | Cathryn Lavery (LittleMight), 2025                                              |
| Source           | `LICENSE` at repository root, commit `b46c9701f035844a20b13ab0551315977188933b` |
| Upstream URL     | https://github.com/cathrynlavery/diagram-design                                 |

MIT is permissive, copyleft-free, and compatible with Bhavya's repository use. No notice requirements beyond retaining the copyright and permission notice in copies/substantial portions of the skill — satisfied by retaining `LICENSE` and the audit record here. No patent, trademark, or use restrictions relevant to an internal authoring skill.

## 2. Third-party components bundled by the skill

| Component                      | Upstream                             | Licence             | Bhavya obligation                                                                         |
| ------------------------------ | ------------------------------------ | ------------------- | ----------------------------------------------------------------------------------------- |
| Tabler Icons                   | github.com/tabler/tabler-icons       | MIT                 | Retain licence notice if redistributed; icons not redistributed by Bhavya (skill-only)    |
| Simple Icons                   | github.com/simple-icons/simple-icons | CC0 1.0             | Public domain dedication; no notice required                                              |
| log-z/logos                    | github.com/log-z/logos               | MIT                 | Same as Tabler                                                                            |
| Devicon                        | github.com/devicons/devicon          | MIT                 | Same as Tabler                                                                            |
| Instrument Serif               | github.com/google/fonts              | SIL OFL 1.1         | Logo outline only; no font file bundled by the skill; Bhavya does not embed any font file |
| Wikimedia Commons (SAS logo)   | commons.wikimedia.org                | Public domain       | No obligation                                                                             |
| IcePanel techicons.dev (Stata) | icon.icepanel.io                     | techicons.dev terms | One-off illustrative icon; no redistribution by Bhavya                                    |

## 3. Fonts (network behaviour, not a licence blocker)

Default skin references Instrument Serif, Geist, and Geist Mono via one Google Fonts stylesheet (`fonts.googleapis.com/css2`). Bhavya sets font source to `system`, so **no font request is made in production diagrams** and no font file is bundled or redistributed. This is a behaviour configuration, not a licence issue.

## 4. Trade marks

Brand marks in the icon set (Docker, Kubernetes, AWS, Azure, GitHub, PostgreSQL, Redis, MySQL, etc.) remain the trade marks of their owners. Their inclusion upstream is for documentation/illustrative use only. Bhavya diagrams use at most the Simple Icons / Tabler set as diagrammatic marks and do not imply endorsement, sponsorship, or affiliation.

## 5. Generated diagram outputs

The MIT licence governs the skill, not diagrams it produces. Bhavya-owned diagram sources (HTML), manifests (YAML), and exported assets (SVG/PNG) are Bhavya Foundation material. No upstream licence condition attaches to generated output.

## 6. Conditions for Bhavya use

1. Do not clone the upstream repository into the monorepo (Stage 2 constraint) — the skill is installed into OpenCode's user skill directory only.
2. Do not modify `docs/constitution/` or brand meaning as part of this integration.
3. If the upstream licence ever changes to an incompatible licence, re-run this review before re-pinning.

## 7. Sign-off

- Licence read: MIT (compatible) ✓
- Third-party licences recorded ✓
- No copyleft, no proprietary, no payment-gated components ✓
- Outputs carry no additional conditions ✓

**Verdict: COMPATIBLE. Integration unblocked.**
