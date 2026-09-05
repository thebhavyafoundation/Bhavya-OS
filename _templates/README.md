# _templates — blank starters

New unit of work = copy a template, not a blank page. (ICM invariant 10.)

| Template           | Produces                                             | Copy to                                                                |
| ------------------ | ---------------------------------------------------- | ---------------------------------------------------------------------- |
| `stage-CONTEXT.md` | a new pipeline stage contract                        | `rfcs/stages/NN_<name>/CONTEXT.md` or any new `stages/NN_*/CONTEXT.md` |
| `rfc-record.md`    | a new RFC run record                                 | `rfcs/RFC-NNNN-<slug>.md`                                              |
| `node.md`          | a new context-map node (team / process / data-asset) | per `_system/schema.md` placement                                      |

Source: adapted from `.opencode/skills/icm-architect/assets/templates/`
(Method: Van Clief & McDermott, arXiv:2603.16021, MIT.)
Method lives here; instances live in the product folders above. Never edit a
template to record a run — copy it first.
