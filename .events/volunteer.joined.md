# Event: volunteer.joined

## Description

Triggered when a new volunteer joins.

## Payload

- `volunteerId`: Volunteer identifier
- `name`: Volunteer name
- `skills`: Volunteer skills
- `availability`: Volunteer availability

## Subscribers

- Volunteer Agent (onboard volunteer)
- Founder Agent (welcome)
- Historian Agent (log joining)

## Actions

1. Send welcome email
2. Assign to team
3. Create volunteer profile
4. Log joining
