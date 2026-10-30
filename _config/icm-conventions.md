# ICM Conventions (Binding)

All workflows follow the 15 patterns from ICM `_core/CONVENTIONS.md`:

| #   | Pattern                       | Requirement                                                        |
| --- | ----------------------------- | ------------------------------------------------------------------ |
| 1   | **Stage contracts**           | Every stage `CONTEXT.md` has Inputs, Process, Outputs tables       |
| 2   | **Stage handoffs**            | `output/` folders connect stages; human can edit before next stage |
| 3   | **One-way references**        | If A references B, B never references A                            |
| 4   | **Selective section routing** | Inputs tables specify exact sections to load (not whole files)     |
| 5   | **Canonical sources**         | Every rule has one home; others point there                        |
| 6   | **CONTEXT.md = routing**      | Never contains content; only routing tables                        |
| 7   | **Tool prerequisites**        | In stage `references/` folders                                     |
| 8   | **Questionnaire design**      | Flat, all-at-once, system-level only (`setup/questionnaire.md`)    |
| 9   | **Bundled skills**            | Skills in `skills/` (junction to `.opencode/skills/`)              |
| 10  | **Specs as contracts**        | Define WHAT/WHEN, not HOW (`specs/` via `bhavya-reasons-canvas`)   |
| 11  | **Checkpoints**               | Creative stages pause for human steering                           |
| 12  | **Stage audits**              | Quality checklists before writing output                           |
| 13  | **Value validation**          | Agree on value types at checkpoints                                |
| 14  | **Docs over outputs**         | Reference docs authoritative; outputs are artifacts                |
| 15  | **Shared constants**          | Configurable values in `shared/constants/`                         |
