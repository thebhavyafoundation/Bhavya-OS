# Event: research.finished

## Description

Triggered when a research project is completed.

## Payload

- `researchId`: Research identifier
- `topic`: Research topic
- `findings`: Research findings
- `recommendations`: Recommendations
- `researcher`: Researcher agent

## Subscribers

- Writer Agent (create summary)
- Historian Agent (log completion)
- Founder Agent (notify)

## Actions

1. Create research summary
2. Add to knowledge base
3. Log completion
4. Notify stakeholders
