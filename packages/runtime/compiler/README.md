# Runtime Compiler

Reads human-editable source files and generates machine-optimized runtime files.

## Source Files (human edit)
- config/apps.json
- config/ports.json
- config/environment.json
- registry/packages.json
- registry/knowledge-graph.json

## Generated Files (compiler output)
- .ai/manifest.yaml
- .ai/runtime.json
- .ai/index.yaml
- .ai/repository-map.md
- .ai/dependencies.yaml
- .ai/graph/graph.json
- .ai/context-loader.md

## Usage
```bash
node .ai/build/compile-runtime.mjs
```

Never edit generated files manually.
