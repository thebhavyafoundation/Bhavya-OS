# Event: release.created

## Description

Triggered when a new release is created.

## Payload

- `releaseId`: Release identifier
- `version`: Release version
- `changes`: List of changes
- `releaseDate`: Release date

## Subscribers

- Historian Agent (log release)
- SocialMedia Agent (announce release)
- Writer Agent (create release notes)

## Actions

1. Log release
2. Create release notes
3. Announce release
4. Update changelog
