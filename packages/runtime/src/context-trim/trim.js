// Query-aware context compression.
//
// Copyright 2026 the trim-1-ts authors.
// Ported from github.com/caveman-ai/trim-1 (Apache-2.0). See NOTICE.

import { byteLen } from "./bytes.js";
import { blockHeaders, lineFeatures } from "./features.js";
import { model, probability } from "./model.js";

export const MAX_CONTEXT_BYTES = 8 << 20;
const MAX_CONTEXT_LINES = 200_000;

export const Points = {
  conservative: {
    Floor: 0.0035,
    TopK: 3,
    Context: 1,
    Headers: 1,
    Gap: 2,
    MinChars: 2000,
    MinCut: 0.1,
  },
  balanced: {
    Floor: 0.008,
    TopK: 3,
    Context: 1,
    Headers: 1,
    Gap: 2,
    MinChars: 2000,
    MinCut: 0.1,
  },
  aggressive: {
    Floor: 0.035,
    TopK: 3,
    Context: 1,
    Headers: 1,
    Gap: 2,
    MinChars: 2000,
    MinCut: 0.1,
  },
};

export const DefaultPoint = "balanced";

const SECTION_PREFIXES = [
  "# ",
  "## ",
  "### ",
  "#### ",
  "[start of ",
  "==> ",
  "diff --git ",
  "File: ",
];
const MARKER_LINE = /^[ \t]*… \d+ lines? …[ \t\r]*$/m;

function lineCount(context) {
  const trimmed = context.endsWith("\n") ? context.slice(0, -1) : context;
  return trimmed.split("\n").length;
}

function hasAnyPrefix(s, prefixes) {
  for (const p of prefixes) if (s.startsWith(p)) return true;
  return false;
}

function allBlank(gap) {
  for (const x of gap) if (x) return false;
  return true;
}

function marker(n) {
  if (n === 1) return "… 1 line …";
  return `… ${n} lines …`;
}

function render(lines, keep) {
  const out = [];
  let kept = 0;
  let i = 0;
  while (i < lines.length) {
    if (i > 0) out.push("\n");
    if (keep[i]) {
      out.push(lines[i]);
      kept++;
      i++;
      continue;
    }
    let j = i;
    while (j < lines.length && !keep[j]) j++;
    out.push(marker(j - i));
    i = j;
  }
  return { output: out.join(""), kept };
}

function selectLines(score, blank, indent, section, p) {
  const n = score.length;
  const order = [];
  for (let i = 0; i < n; i++) if (!blank[i]) order.push(i);
  order.sort((a, b) => score[b] - score[a]);

  const best = order.length > 0 ? score[order[0]] : 0;
  const seed = new Uint8Array(n);
  for (let k = 0; k < order.length; k++) {
    const i = order[k];
    seed[i] = k < p.TopK || score[i] >= p.Floor * best ? 1 : 0;
  }

  const keep = Uint8Array.from(seed);
  const headers = blockHeaders(indent, blank);
  for (let i = 0; i < n; i++) {
    if (!seed[i]) continue;
    for (
      let j = Math.max(0, i - p.Context);
      j <= Math.min(n - 1, i + p.Context);
      j++
    )
      keep[j] = 1;
    let h = headers[i];
    let k = 0;
    while (h >= 0 && k < p.Headers) {
      keep[h] = 1;
      h = headers[h];
      k++;
    }
    if (p.Headers > 0 && section[i] >= 0) keep[section[i]] = 1;
  }

  let last = -1;
  for (let i = 0; i < n; i++) {
    if (!keep[i]) continue;
    if (last >= 0) {
      const gap = blank.slice(last + 1, i);
      if (gap.length > 0 && (gap.length <= p.Gap || allBlank(gap))) {
        for (let j = last + 1; j < i; j++) keep[j] = 1;
      }
    }
    last = i;
  }
  return keep;
}

export function applyPolicy(policy, lines, scores) {
  const final = lines.length > 1 && lines[lines.length - 1] === "";
  let work = lines;
  let workScores = scores;
  if (final) {
    work = lines.slice(0, lines.length - 1);
    workScores = scores.slice(0, scores.length - 1);
  }
  const n = work.length;
  const blank = new Uint8Array(n);
  const indent = new Int32Array(n);
  const section = new Int32Array(n);
  let open = -1;
  for (let i = 0; i < n; i++) {
    const trimmed = work[i].trim();
    blank[i] = trimmed === "" ? 1 : 0;
    indent[i] = indentOf(work[i]);
    section[i] = open;
    if (
      hasAnyPrefix(trimmed, SECTION_PREFIXES) ||
      (byteLen(trimmed) < 120 &&
        trimmed.startsWith("[") &&
        trimmed.endsWith("]"))
    ) {
      open = i;
    }
  }
  const keep = selectLines(workScores, blank, indent, section, policy);
  const { output, kept } = render(work, keep);
  return { output: final ? `${output}\n` : output, kept };
}

function indentOf(line) {
  let n = 0;
  for (const ch of line) {
    if (ch === " ") n++;
    else if (ch === "\t") n += 4;
    else return n;
  }
  return n;
}

export function score(context, query) {
  const m = model();
  const { lines, rows } = lineFeatures(context, query);
  const scores = new Float64Array(lines.length);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== "") scores[i] = probability(m, rows[i]);
  }
  return { lines, scores };
}

function unchanged(context, name, policy, reason) {
  return {
    output: context,
    keptLines: lineCount(context),
    removedLines: 0,
    point: name,
    policy,
    unchanged: true,
    reason,
  };
}

export function compress(context, query, options = {}) {
  let name = options.point || "";
  let policy;
  if (options.policy) {
    name = "custom";
    policy = options.policy;
  } else {
    if (name === "") name = DefaultPoint;
    const p = Points[name];
    if (!p) return unchanged(context, name, {}, "unknown operating point");
    policy = p;
  }

  if (query.trim() === "") return unchanged(context, name, policy, "no query");
  if (byteLen(context) < policy.MinChars)
    return unchanged(context, name, policy, "context below the minimum size");
  if (byteLen(context) > MAX_CONTEXT_BYTES)
    return unchanged(context, name, policy, "context over 8 MiB");
  if (lineCount(context) > MAX_CONTEXT_LINES)
    return unchanged(context, name, policy, "context over 200,000 lines");
  if (context.includes("…") && MARKER_LINE.test(context)) {
    return unchanged(
      context,
      name,
      policy,
      "context has a line that reads as an elision marker",
    );
  }

  const { lines, scores } = score(context, query);
  const { output, kept } = applyPolicy(policy, lines, scores);
  if (byteLen(output) > byteLen(context) * (1 - policy.MinCut)) {
    return unchanged(context, name, policy, "cut below the minimum");
  }
  return {
    output,
    keptLines: kept,
    removedLines: lineCount(context) - kept,
    point: name,
    policy,
    unchanged: false,
    reason: "",
  };
}
