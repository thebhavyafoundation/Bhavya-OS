# NN_<stage-name> — <the job in five words>

One job: <the single thing this stage does>.

## Inputs

- Working (this run): <exact path to previous stage output, e.g. `../01_research/output/research.md`>
- Reference (every run): <exact path, e.g. `../../_shared/factory-map.md` → canonical token file>
- Reference (every run): <exact stage guide, e.g. `references/<guide>.md`>

Do NOT load: <what an eager agent would wrongly pull in — other stages'
references, prior runs, the whole `_shared/` folder, the full monorepo>.

## Process

1. <Read the inputs.>
2. <Transform, following the reference constraints.>
3. <Hard limits worth restating: length, count, format.>

## Outputs

- `<artifact>.md` → `output/`

## Human check

<One concrete act a person does before the next stage reads this output.
Edit the output in place — the next stage reads whatever is here.>

---

Copied from `.opencode/skills/icm-architect/assets/templates/stage-CONTEXT.md`.
Constraints live in L3 reference files, never restated here.
