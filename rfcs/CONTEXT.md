# rfcs — the decision pipeline

The flow in one line: propose it, publish it, approve it, implement it.

| Stage         | Job                | Input                           | Output                                      | Human check                                   |
| ------------- | ------------------ | ------------------------------- | ------------------------------------------- | --------------------------------------------- |
| `draft`       | write the decision | `_templates/rfc-record.md` copy | `rfcs/RFC-NNNN-<slug>.md` (`status: draft`) | proposal states migration steps               |
| `published`   | open for comment   | draft file                      | same file (`status: published`)             | author confirms open questions are answerable |
| `approved`    | accept or reject   | published file + comments       | same file (`status: approved`)              | approver signs migration map                  |
| `implemented` | land the change    | approved file                   | code + `status: implemented`                | change matches the approved migration map     |

Factory (stable, every run): `_templates/rfc-record.md`, `standards/`,
`docs/adr/`, `contracts/<pkg>/CONTRACT.md`
Product (new each run): `rfcs/RFC-NNNN-<slug>.md`

Status is whatever exists: the `status:` frontmatter on each RFC file is the
state surface. Scan frontmatter to report pipeline status — never a separate
tracker. Blank starter lives in `_templates/`; this folder holds filled-in runs.

## Human check (per record)

Nothing moves to the next status until a person has read the current file.
Edit the RFC in place — implementation reads whatever is here.
