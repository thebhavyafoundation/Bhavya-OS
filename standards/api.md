# API Standard

**Status:** published
**Date:** 2026-07-15
**Owner:** Engineering Team

## Purpose

Define API design standards for the Bhavya Foundation platform to ensure consistency, reliability, and maintainability.

## REST API Standards

### URL Structure

- Use nouns, not verbs: `/api/documents`, `/api/entities`
- Version endpoints: `/api/v1/documents`
- Use plural nouns: `/api/volunteers` not `/api/volunteer`

### HTTP Methods

- **GET**: Retrieve resources
- **POST**: Create resources
- **PUT**: Update resources (full replacement)
- **PATCH**: Partial updates
- **DELETE**: Remove resources

### Response Format

```json
{
  "success": true,
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### Error Handling

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": []
  }
}
```

## Authentication

- JWT tokens for API authentication
- Environment variables for API keys
- Rate limiting for public endpoints

## Documentation

- OpenAPI 3.0 specification
- Interactive API documentation
- Example requests and responses
