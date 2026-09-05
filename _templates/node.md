---
type: process
team: { team-slug }
owner: { name }
ai-level: L0
frequency: { daily|weekly|monthly|ad-hoc }
value: 3
pain: 3
consumes: ["[[data-{input-asset}]]"]
produces: ["[[data-{output-asset}]]"]
governance: internal
---

# {Process name}

## Input → Movement → Output

{What comes in, what the team does to it, what goes out. Three sentences.}

## Now

{How it actually runs today, at the ai-level declared above.}

## What is working / not working

{Honest, from the people who run it.}

## If we structure this

{What the AI-assisted version looks like — left as a stub until it is real.}

## What the human keeps checking

{The judgment that stays with a person no matter how automated this gets.}

---

Copied from `.opencode/skills/icm-architect/assets/templates/node.md`.
Node types and labels are closed by `_system/schema.md` — do not invent new
`type:` values without updating the schema the same day.
