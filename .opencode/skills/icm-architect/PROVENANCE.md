# Provenance — icm-architect (vendored third-party skill)

| Field          | Value                                                                                                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Upstream       | https://github.com/RinDig/icm-architect                                                                                                                                    |
| Pinned commit  | `8bc2f5610d3843b3ffa31a142effe6b6337fef3c` — "Make the skill work in any agent or harness" (2026-10-24, GitHub-verified signature)                                          |
| Methodology    | https://github.com/RinDig/Interpretable-Context-Methodology (paper: arXiv:2603.16021, Van Clief & McDermott)                                                                 |
| Retrieved      | 2026-10-29 — commit tarball, byte-identical vendored copy                                                                                                                   |
| License        | MIT — © 2026 Jake Van Clief (full text in `LICENSE` in this folder; required notice preserved)                                                                              |
| Local changes  | None. This folder is an unmodified copy of the pinned commit, plus this provenance record.                                                                                  |
| Script review  | 2026-10-29: `scripts/{links,index,quotes,viz}.py` reviewed — Python standard library only, local filesystem reads, opt-in outputs (`_index.md`, `viz.html`); no network calls, no data exfiltration. Safe to run. |

## Update policy

- Pinned on purpose. No unattended tracking of upstream `main`.
- To upgrade: fetch the new commit, diff against this folder, re-review `scripts/`, replace the
  files, and update this table. Root `AGENTS.md` §8 points here; it does not carry the commit SHA.

## Authority (subordination)

This skill's instructions are third-party external material. They are subordinate to root
`AGENTS.md` §1–§7 (constitution, brand, tokens, security, human gates). Load it only when
designing or restructuring ICM workspace structure — not for ordinary code edits.
