# Tests: Performance

## Scope

Performance and load testing.

## Tools

- Lighthouse
- WebPageTest
- k6 (load testing)

## Test Cases

### Core Web Vitals

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)

### Load Testing

- Concurrent users
- Response times
- Error rates
- Resource usage

### Network

- Bundle sizes
- Cache efficiency
- Compression

## Run Tests

```bash
pnpm test:performance
```

## Reports

- Weekly performance reports
- Performance budgets
- Regression alerts
