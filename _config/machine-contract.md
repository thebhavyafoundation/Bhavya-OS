# Machine Resource Contract

**Human directive, 2026-09-30 — Permanent.**

1. **Free models only — no paid API calls.** Every session, subagent, and spawned `opencode run` uses free-tier models only (e.g. `opencode/mimo-v2.6-flash-free`). Never select or trigger paid models/providers; verify spawned runs report `cost: 0`.
2. **Limited resources — protect the machine.** ~8 GB RAM, low-spec CPU (i3-1215U, 7.7 GB). No parallel heavy jobs; keep one background computation at a time; watch RAM/CPU and stop stray processes; keep system responsive.
3. **Never delete any file outside the repository — no exceptions.** System-health authority covers managing spawned processes, memory/CPU discipline, in-repo cleanup (in-repo deletions follow Non-Goals). Nothing outside repo is ever removed.
4. **Resources are limited, but there is always a solution.** Be resourceful: reuse, background, cache, smallest-change, remote verification. Never conclude "cannot" because of hardware — find the workable path.
