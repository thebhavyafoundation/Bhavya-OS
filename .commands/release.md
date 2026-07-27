# Command: /release

## Description

Create a new release.

## Usage

```
/release [version] [description]
```

## Examples

```
/release v0.2.0 "Added volunteer portal"
/release v0.3.0 "Forest GIS integration"
```

## Process

1. Update version
2. Update changelog
3. Run tests
4. Build project
5. Deploy to production
6. Create release notes
7. Announce release

## Agents Involved

- Release (deployment)
- QA (testing)
- Writer (release notes)
- SocialMedia (announcement)
