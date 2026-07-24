# Runtime Validator

Self-validation of AI runtime integrity.

## Checks
- Broken IDs and missing references
- Orphan packages
- Duplicate IDs
- Invalid dependencies
- Circular dependencies
- Missing owners
- Invalid releases
- Missing generated files

## Usage
```bash
node .ai/build/validate-runtime.mjs
```

Run before every commit that touches .ai/ or config/.
