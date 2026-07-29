# Documentation Standard

**Status:** published
**Date:** 2026-07-15
**Owner:** Engineering Team

## Purpose

Define documentation standards for the Bhavya Foundation platform.

## Documentation Types

### 1. Code Documentation

**Inline Comments**
- Explain "why", not "what"
- Complex algorithms need explanation
- TODO comments with issue references

**Function Documentation**
```typescript
/**
 * Calculates the total impact score for a mission.
 * 
 * @param metrics - Raw impact metrics
 * @param weight - Weight factor for normalization
 * @returns Normalized impact score between 0-100
 */
function calculateImpact(metrics: ImpactMetrics, weight: number): number
```

### 2. API Documentation

- OpenAPI 3.0 specification
- Request/response examples
- Error code documentation
- Authentication guides

### 3. User Documentation

- Getting started guides
- Feature documentation
- Troubleshooting guides
- FAQ sections

### 4. Architecture Documentation

- System diagrams
- Data flow documentation
- Decision records (ADRs)
- RFCs for major changes

## README Standards

Every package/app must have a README with:
1. Purpose and description
2. Installation instructions
3. Usage examples
4. Configuration options
5. Development guide

## Changelog Standards

- Follow Keep a Changelog format
- Version semantic versioning
- Group by: Added, Changed, Deprecated, Removed, Fixed, Security
