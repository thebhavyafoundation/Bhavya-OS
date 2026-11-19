# trim-1-ts

TypeScript port of [caveman-ai/trim-1](https://github.com/caveman-ai/trim-1): query-aware, deterministic, extractive context compression for AI agent contexts.

Give it a context (a tool result, a file, a log, a long chat) and the current ask. It returns the context's own lines, in their original order, with a short marker wherever lines were removed. It never rewrites or summarizes a line, so identifiers, paths and error text come through exactly as they were.

- **1.2 MB model.** 712 gradient-boosted trees, not a neural network. No GPU, no network call, no extra model request.
- **Milliseconds on one CPU core.** Deterministic — same context and query give the same output.
- **Fails closed.** Blank query, tiny/oversized input, or a cut below 10% returns the context unchanged.
- **Zero dependencies.** Pure ES modules; runs in Node, Bun and Cloudflare Workers.

## Install

```bash
npm i -g D:\trim-1-ts          # or npm i -g github:yourname/trim-1-ts once published
```

Or vendor it into a project:

```bash
npm i D:\trim-1-ts             # file: dependency
```

## Use

From the command line:

```bash
trim --query "why does the build fail" build.log > build.trimmed.log
cat long-document.md | trim --query "what is the refund policy" --point balanced
```

The trimmed context goes to stdout; a one-line summary goes to stderr:

```
trim: kept 246 lines, removed 189, 47831 -> 36344 bytes
```

From JavaScript:

```js
import { compress } from "trim-1-ts";

const res = compress(context, query, { point: "balanced" });
console.log(res.output);
```

`compress` returns `{ output, keptLines, removedLines, point, policy, unchanged, reason }`.

## Operating points

| point                | floor (share of best line's score) | use                                |
| -------------------- | ---------------------------------: | ---------------------------------- |
| `conservative`       |                             0.0035 | cut least                          |
| `balanced` (default) |                              0.008 | default; coding-agent tool outputs |
| `aggressive`         |                              0.035 | cut most                           |

On long documents `balanced` typically removes ~89% of tokens while keeping supporting evidence in 94% of cases; on short, dense coding-agent tool outputs it saves little by design — keep it at `balanced` or `conservative`.

## Verification

The port is checked against upstream's own artifacts:

- `test/golden.txt` — upstream's pinned output on its sample log, byte-identical (`npm test`).
- `test/parity.bin` — LightGBM's exported feature rows + raw scores; `raw()` matches bit for bit.

```bash
npm test
```

## License

Apache-2.0. See `LICENSE` and `NOTICE` for upstream attribution (trim-1 code + model, Go `math.Exp` BSD note).
