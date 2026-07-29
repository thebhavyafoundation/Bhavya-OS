# Git Standard

**Status:** published
**Date:** 2026-07-15
**Owner:** Engineering Team

## Purpose

Define Git workflow and commit standards for the Bhavya Foundation platform.

## Branch Strategy

### Main Branches

- `main`: Production-ready code
- `develop`: Integration branch (if needed)

### Feature Branches

- `feature/description`: New features
- `bugfix/description`: Bug fixes
- `hotfix/description`: Critical production fixes
- `docs/description`: Documentation updates

## Commit Messages

### Format

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

### Examples

```
feat(volunteer): add skill certification tracking

- Add certification model
- Implement skill verification workflow
- Add certification badges

Closes #123
```

```
fix(forest): correct planting survival rate calculation

The formula was using total plants instead of surviving plants.
```

## Pull Requests

### Requirements

1. Descriptive title and description
2. Link to related issues
3. Screenshots for UI changes
4. Tests for new functionality
5. Code review required

### Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Security considerations addressed
