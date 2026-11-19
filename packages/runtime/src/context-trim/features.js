// Per-line features.
//
// Copyright 2026 the trim-1-ts authors.
// Ported from github.com/caveman-ai/trim-1 (Apache-2.0). See NOTICE.

import { bm25 } from "./bm25.js";
import { byteLen, fromUtf8, isAscii, utf8Bytes } from "./bytes.js";

export const FEATURE_NAMES = [
  "bm25",
  "bm25_norm",
  "bm25_rank",
  "bm25_win_sum",
  "cover_win_sum",
  "bm25_tail_norm",
  "cover",
  "cover_idf",
  "cover_n",
  "cover_maxidf",
  "cover_rank",
  "cover_tail",
  "compound_hits",
  "compound_maxlen",
  "bigram_hits",
  "trigram_hits",
  "idf_mean",
  "idf_max",
  "uniq_frac",
  "k_error",
  "k_test",
  "k_path",
  "k_pathline",
  "k_heading",
  "k_diff",
  "k_section",
  "k_signature",
  "k_jsonkey",
  "k_separator",
  "k_frame",
  "k_kv",
  "k_bullet",
  "dup",
  "tmpl",
  "tmpl_first",
  "pos_rel",
  "pos_head",
  "pos_tail",
  "n_lines",
  "ctx_chars",
  "len_chars",
  "len_words",
  "alnum_frac",
  "upper_frac",
  "digit_frac",
  "indent",
  "indent_delta",
  "block_start",
  "header_dist",
  "header_bm25",
  "header_cover",
  "nb_bm25_max",
  "nb_bm25_mean",
  "nb_cover_max",
  "nb_compound_max",
  "prev_bm25",
  "next_bm25",
  "prev_blank",
  "next_blank",
  "q_words",
  "q_terms",
  "q_found",
  "ctx_bm25_max",
  "para_cover_max",
  "sec_cover",
  "prf_cover",
  "prf_compound",
];

export const N_FEATURES = FEATURE_NAMES.length;

const F = Object.create(null);
FEATURE_NAMES.forEach((name, i) => {
  F[name] = i;
});

const NEIGHBOUR_SPAN = 3;
const COMPOUND_SPAN = 5;
const MAX_COMPOUNDS = 64;
export const MAX_QUERY_BYTES = 8 << 10;

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "how",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "this",
  "to",
  "was",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "with",
]);

const LETTER = /\p{L}/u;
const DIGIT = /\p{Nd}/u;
const UPPER = /\p{Lu}/u;
const LOWER = /\p{Ll}/u;
const SPACE = /\s/u;

const isLetter = (ch) => LETTER.test(ch);
const isDigit = (ch) => DIGIT.test(ch);
const isUpper = (ch) => UPPER.test(ch);
const isLower = (ch) => LOWER.test(ch);
const isSpace = (ch) => SPACE.test(ch);

const f = (x) => Math.fround(x);

function ratio(a, b) {
  if (b <= 0) return 0;
  return a / b;
}

function maxOf(v) {
  let m = 0;
  for (const x of v) if (x > m) m = x;
  return m;
}

function rankFrac(v) {
  const n = v.length;
  const order = Array.from({ length: n }, (_, i) => i);
  order.sort((a, b) => v[b] - v[a]);
  const out = new Float64Array(n);
  let greater = 0;
  for (let k = 0; k < n; k++) {
    const i = order[k];
    if (k > 0 && v[i] < v[order[k - 1]]) greater = k;
    out[i] = greater / Math.max(1, n);
  }
  return out;
}

function queryTail(s) {
  const lines = s.trim().split("\n");
  const tail = [];
  for (let i = lines.length - 1; i >= 0 && tail.length < 3; i--) {
    const t = lines[i].trim();
    if (t !== "") tail.push(t);
  }
  tail.reverse();
  return tail.join("\n");
}

function tokenize(s) {
  const words = [];
  const terms = [];
  let startByte = -1;
  let startJs = -1;
  const flush = (endByte, endJs) => {
    if (startByte < 0) return;
    const raw = s.slice(startJs, endJs);
    startByte = -1;
    startJs = -1;
    const word = raw.toLowerCase();
    if (byteLen(word) < 2 || STOPWORDS.has(word)) return;
    words.push(word);
    terms.push(word);
    if (!mayHaveParts(raw)) return;
    const parts = splitIdent(Array.from(raw));
    if (parts.length > 1) {
      for (const p of parts) {
        if (byteLen(p) >= 2 && !STOPWORDS.has(p)) terms.push(p);
      }
    }
  };
  let byteOff = 0;
  let jsOff = 0;
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    const bl = cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4;
    if (isLetter(ch) || isDigit(ch) || ch === "_") {
      if (startByte < 0) {
        startByte = byteOff;
        startJs = jsOff;
      }
    } else {
      flush(byteOff, jsOff);
    }
    byteOff += bl;
    jsOff += ch.length;
  }
  flush(byteOff, jsOff);
  return { words, terms };
}

function mayHaveParts(w) {
  let digits = false;
  let others = false;
  for (let i = 0; i < w.length; i++) {
    const c = w.charCodeAt(i);
    if (c >= 0x80 || c === 0x5f || (c >= 0x41 && c <= 0x5a)) return true;
    if (c >= 0x30 && c <= 0x39) digits = true;
    else others = true;
  }
  return digits && others;
}

function splitIdent(w) {
  const parts = [];
  let start = 0;
  const cut = (end) => {
    if (end > start) parts.push(w.slice(start, end).join("").toLowerCase());
    start = end;
  };
  for (let i = 0; i < w.length; i++) {
    if (w[i] === "_") {
      cut(i);
      start = i + 1;
      continue;
    }
    if (i === start || i === 0) continue;
    const prev = w[i - 1];
    const r = w[i];
    if (isLower(prev) && isUpper(r)) {
      cut(i);
    } else if (
      isUpper(prev) &&
      isUpper(r) &&
      i + 1 < w.length &&
      isLower(w[i + 1])
    ) {
      cut(i);
    } else if (isDigit(prev) !== isDigit(r) && prev !== "_") {
      cut(i);
    }
  }
  cut(w.length);
  return parts;
}

function dedupe(list) {
  const seen = new Set();
  const out = [];
  for (const x of list) {
    if (!seen.has(x)) {
      seen.add(x);
      out.push(x);
    }
  }
  return out;
}

function ngrams(words) {
  const bi = new Set();
  const tri = new Set();
  for (let j = 0; j + 1 < words.length; j++) {
    bi.add(`${words[j]} ${words[j + 1]}`);
    if (j + 2 < words.length)
      tri.add(`${words[j]} ${words[j + 1]} ${words[j + 2]}`);
  }
  return { bi, tri };
}

function compoundTerms(query) {
  const fields = query.split(/[\s"'`()[\]{}<>,;=|]+/u).filter((x) => x !== "");
  const out = [];
  const seen = new Set();
  for (let fld of fields) {
    fld = trimChars(fld, ".:!?*#");
    if (byteLen(fld) < 4 || seen.has(fld)) continue;
    let structured = /[._/:\-\\]/u.test(fld);
    for (let i = 1; i < fld.length && !structured; i++) {
      structured =
        fld.charCodeAt(i - 1) >= 0x61 &&
        fld.charCodeAt(i - 1) <= 0x7a &&
        fld.charCodeAt(i) >= 0x41 &&
        fld.charCodeAt(i) <= 0x5a;
    }
    if (!structured) continue;
    seen.add(fld);
    out.push(fld.toLowerCase());
    if (out.length === MAX_COMPOUNDS) break;
  }
  return out;
}

function trimChars(s, chars) {
  let start = 0;
  let end = s.length;
  while (start < end && chars.includes(s[start])) start++;
  while (end > start && chars.includes(s[end - 1])) end--;
  return s.slice(start, end);
}

function template(s) {
  if (!isAscii(s)) return templateBytes(s);
  let out = "";
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c >= "0" && c <= "9") {
      while (i < s.length && (isHex(s[i]) || s[i] === "." || s[i] === ":")) i++;
      out += "0";
      continue;
    }
    if (isHex(c)) {
      let j = i;
      while (j < s.length && isHex(s[j])) j++;
      if (j - i >= 8) {
        out += "0";
        i = j;
        continue;
      }
    }
    out += lowerAscii(c);
    i++;
  }
  return out;
}

function templateBytes(s) {
  const src = utf8Bytes(s);
  const out = new Uint8Array(src.length);
  let w = 0;
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c >= 0x30 && c <= 0x39) {
      while (
        i < src.length &&
        (isHexByte(src[i]) || src[i] === 0x2e || src[i] === 0x3a)
      )
        i++;
      out[w++] = 0x30;
      continue;
    }
    if (isHexByte(c)) {
      let j = i;
      while (j < src.length && isHexByte(src[j])) j++;
      if (j - i >= 8) {
        out[w++] = 0x30;
        i = j;
        continue;
      }
    }
    out[w++] = c >= 0x41 && c <= 0x5a ? c + 0x20 : c;
    i++;
  }
  return fromUtf8(out.subarray(0, w));
}

function isHex(c) {
  return (
    (c >= "0" && c <= "9") || (c >= "a" && c <= "f") || (c >= "A" && c <= "F")
  );
}

function isHexByte(c) {
  return (
    (c >= 0x30 && c <= 0x39) ||
    (c >= 0x61 && c <= 0x66) ||
    (c >= 0x41 && c <= 0x46)
  );
}

function lowerAscii(c) {
  return c >= "A" && c <= "Z" ? String.fromCharCode(c.charCodeAt(0) + 0x20) : c;
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

function nonBlankNeighbours(blank) {
  const n = blank.length;
  const prev = new Int32Array(n);
  const next = new Int32Array(n);
  let last = -1;
  for (let i = 0; i < n; i++) {
    prev[i] = last;
    if (!blank[i]) last = i;
  }
  last = -1;
  for (let i = n - 1; i >= 0; i--) {
    next[i] = last;
    if (!blank[i]) last = i;
  }
  return { prev, next };
}

export function blockHeaders(indent, blank) {
  const out = new Int32Array(indent.length);
  const stack = [];
  for (let i = 0; i < indent.length; i++) {
    out[i] = -1;
    if (blank[i]) continue;
    while (stack.length > 0 && indent[stack[stack.length - 1]] >= indent[i])
      stack.pop();
    if (stack.length > 0) out[i] = stack[stack.length - 1];
    stack.push(i);
  }
  return out;
}

function charMix(s) {
  let alnum = 0;
  let upper = 0;
  let digit = 0;
  let total = 0;
  for (const ch of s) {
    if (isSpace(ch)) continue;
    total++;
    if (isLetter(ch) || isDigit(ch)) alnum++;
    if (isUpper(ch)) upper++;
    if (isDigit(ch)) digit++;
  }
  return { alnum, upper, digit, total };
}

const ERROR_WORDS = [
  "error",
  "exception",
  "traceback",
  "fatal",
  "panic",
  "fail",
  "assert",
  "warning",
  "denied",
  "refused",
  "not found",
  "cannot",
  "unable to",
  "invalid",
  "segmentation",
  "undefined",
  "unexpected",
  "errno",
  "critical",
];
const TEST_WORDS = [
  " passed",
  " failed",
  " skipped",
  "xfail",
  "test session",
  "test summary",
];
const TEST_PREFIXES = [
  "ok ",
  "fail",
  "pass",
  "=== run",
  "--- pass",
  "--- fail",
  "ran ",
];
const SIG_WORDS = [
  "def ",
  "async def ",
  "class ",
  "func ",
  "function ",
  "fn ",
  "pub ",
  "struct ",
  "interface ",
  "type ",
  "impl ",
  "public ",
  "private ",
  "protected ",
  "static ",
  "export ",
  "module ",
  "package ",
  "import ",
  "from ",
  "#include",
  "const ",
  "var ",
  "let ",
  "@",
];

function lineKinds(trimmed, lower) {
  const k = new Float32Array(13);
  const set = (i, ok) => {
    if (ok) k[i - F.k_error] = 1;
  };
  if (trimmed === "") return k;
  const body = stripLineNumber(lower);
  set(F.k_error, containsAny(lower, ERROR_WORDS));
  set(
    F.k_test,
    containsAny(body, TEST_WORDS) || hasAnyPrefix(body, TEST_PREFIXES),
  );
  set(F.k_path, hasPath(trimmed));
  set(F.k_pathline, hasPathLine(trimmed));
  set(
    F.k_heading,
    body.startsWith("#") && body.replace(/^#+/, "").startsWith(" "),
  );
  set(
    F.k_diff,
    body.startsWith("diff --git") ||
      body.startsWith("@@") ||
      body.startsWith("+++ ") ||
      body.startsWith("--- a/") ||
      body.startsWith("index "),
  );
  set(F.k_section, isSection(body, trimmed));
  set(F.k_signature, hasAnyPrefix(body, SIG_WORDS));
  set(F.k_jsonkey, body.startsWith('"') && body.includes('":'));
  set(
    F.k_separator,
    byteLen(body) >= 3 && !LETTER_ANY.test(body) && !DIGIT_ANY.test(body),
  );
  set(
    F.k_frame,
    (lower.includes('file "') && lower.includes(", line ")) ||
      (body.startsWith("at ") && body.includes("(")) ||
      body.startsWith("goroutine "),
  );
  set(F.k_kv, isKeyValue(body));
  set(
    F.k_bullet,
    hasAnyPrefix(body, ["- ", "* ", "• ", "+ "]) || numbered(body),
  );
  return k;
}

const LETTER_ANY = /\p{L}/u;
const DIGIT_ANY = /\p{Nd}/u;

function stripLineNumber(s) {
  let i = 0;
  while (i < s.length && s[i] >= "0" && s[i] <= "9") i++;
  if (i === 0 || i === s.length || !" \t:|".includes(s[i])) return s;
  return s.slice(i + 1).trim();
}

function containsAny(s, words) {
  for (const w of words) if (s.includes(w)) return true;
  return false;
}

function hasAnyPrefix(s, prefixes) {
  for (const p of prefixes) if (s.startsWith(p)) return true;
  return false;
}

function hasPath(s) {
  if (!s.includes("/") && !s.includes("\\")) return false;
  for (const raw of s.split(/\s+/u)) {
    if (raw === "") continue;
    const fld = trimChars(raw, "\"'`(),;:[]");
    const slash = Math.max(fld.lastIndexOf("/"), fld.lastIndexOf("\\"));
    if (
      slash >= 0 &&
      slash < fld.length - 1 &&
      fld.slice(slash).includes(".") &&
      LETTER_ANY.test(fld)
    )
      return true;
  }
  return false;
}

function hasPathLine(s) {
  for (let i = 1; i + 1 < s.length; i++) {
    if (s[i] !== ":" || s[i + 1] < "0" || s[i + 1] > "9") continue;
    let j = i;
    while (
      j > 0 &&
      i - j < 6 &&
      ((s[j - 1] >= "a" && s[j - 1] <= "z") ||
        (s[j - 1] >= "A" && s[j - 1] <= "Z"))
    )
      j--;
    if (
      j < i &&
      j >= 2 &&
      s[j - 1] === "." &&
      s[j - 2] !== "." &&
      s[j - 2] !== " "
    )
      return true;
  }
  return false;
}

function isSection(body, trimmed) {
  if (
    (body.startsWith("[") && body.endsWith("]")) ||
    body.startsWith("==>") ||
    body.startsWith("file:")
  )
    return true;
  if (byteLen(body) < 80 && body.endsWith(":") && !/[(){}=]/u.test(body))
    return true;
  let letters = 0;
  let uppers = 0;
  for (const ch of trimmed) {
    if (isLetter(ch)) {
      letters++;
      if (isUpper(ch)) uppers++;
    }
  }
  return letters >= 4 && letters === uppers && byteLen(trimmed) < 60;
}

function isKeyValue(body) {
  let i = 0;
  while (i < body.length) {
    const c = body.charCodeAt(i);
    const ok =
      c === 0x5f ||
      c === 0x2e ||
      c === 0x2d ||
      (c >= 0x61 && c <= 0x7a) ||
      (c >= 0x30 && c <= 0x39);
    if (!ok) break;
    i++;
  }
  if (i === 0) return false;
  while (i < body.length && body[i] === " ") i++;
  return (
    i + 1 < body.length &&
    (body[i] === ":" || body[i] === "=") &&
    body[i + 1] !== "="
  );
}

function numbered(body) {
  let i = 0;
  while (i < body.length && body[i] >= "0" && body[i] <= "9") i++;
  return (
    i > 0 &&
    i + 1 < body.length &&
    (body[i] === "." || body[i] === ")") &&
    body[i + 1] === " "
  );
}

function capQuery(query) {
  if (byteLen(query) <= MAX_QUERY_BYTES) return query;
  if (isAscii(query)) return query.slice(query.length - MAX_QUERY_BYTES);
  const bytes = utf8Bytes(query);
  const sliced = bytes.subarray(bytes.length - MAX_QUERY_BYTES);
  let start = 0;
  while (start < sliced.length && (sliced[start] & 0xc0) === 0x80) start++;
  return fromUtf8(sliced.subarray(start));
}

export function lineFeatures(context, query) {
  const q = capQuery(query);
  const lines = context.split("\n");
  const n = lines.length;
  const rows = new Array(n);
  for (let i = 0; i < n; i++) rows[i] = new Float32Array(N_FEATURES);

  const bm = bm25(q, lines);
  const tail = queryTail(q);
  const trimmedQuery = q.trim();
  const bmTail = tail === trimmedQuery ? bm : bm25(tail, lines);
  const bmMax = maxOf(bm);
  const tailMax = maxOf(bmTail);

  const ids = new Map();
  const df = [];
  const lineTerms = new Array(n);
  const lineWords = new Array(n);
  for (let i = 0; i < n; i++) {
    const { words, terms } = tokenize(lines[i]);
    lineWords[i] = words;
    const set = [];
    for (const t of terms) {
      let id = ids.get(t);
      if (id === undefined) {
        id = df.length;
        ids.set(t, id);
        df.push(0);
      }
      set.push(id);
    }
    set.sort((a, b) => a - b);
    const uniq = [];
    for (const id of set)
      if (uniq.length === 0 || uniq[uniq.length - 1] !== id) uniq.push(id);
    for (const id of uniq) df[id]++;
    lineTerms[i] = uniq;
  }

  const idf = new Float64Array(df.length);
  for (let id = 0; id < df.length; id++) {
    idf[id] = Math.log(1 + (n - df[id] + 0.5) / (df[id] + 0.5));
  }

  const { words: qWords, terms: qTermsRaw } = tokenize(q);
  const qTerms = dedupe(qTermsRaw);
  const inQuery = new Uint8Array(df.length);
  let qIDFSum = 0;
  let found = 0;
  for (const t of qTerms) {
    const id = ids.get(t);
    if (id !== undefined) {
      inQuery[id] = 1;
      qIDFSum += idf[id];
      found++;
    }
  }
  const { terms: tailTermsRaw } = tokenize(tail);
  const tailTerms = dedupe(tailTermsRaw);
  const inTail = new Uint8Array(df.length);
  let tailIDFSum = 0;
  for (const t of tailTerms) {
    const id = ids.get(t);
    if (id !== undefined) {
      inTail[id] = 1;
      tailIDFSum += idf[id];
    }
  }
  const { bi: bigrams, tri: trigrams } = ngrams(qWords);
  const compounds = compoundTerms(q);

  const blank = new Uint8Array(n);
  const indent = new Int32Array(n);
  const tmplKeys = new Array(n);
  const dupCount = new Map();
  const tmplCount = new Map();
  for (let i = 0; i < n; i++) {
    const trimmed = lines[i].trim();
    blank[i] = trimmed === "" ? 1 : 0;
    indent[i] = indentOf(lines[i]);
    dupCount.set(trimmed, (dupCount.get(trimmed) || 0) + 1);
    const key = template(trimmed);
    tmplKeys[i] = key;
    tmplCount.set(key, (tmplCount.get(key) || 0) + 1);
  }
  const { prev: prevNB, next: nextNB } = nonBlankNeighbours(blank);
  const headers = blockHeaders(indent, blank);
  const tmplSeen = new Set();
  const cover = new Float64Array(n);
  const compound = new Float64Array(n);

  for (let i = 0; i < n; i++) {
    const r = rows[i];
    const line = lines[i];
    const trimmed = line.trim();
    const lower = trimmed.toLowerCase();
    const set = lineTerms[i];

    let cov = 0;
    let covIDF = 0;
    let covMax = 0;
    let idfSum = 0;
    let idfMax = 0;
    let uniq = 0;
    let tailIDF = 0;
    for (const id of set) {
      if (inTail[id]) tailIDF += idf[id];
      idfSum += idf[id];
      if (idf[id] > idfMax) idfMax = idf[id];
      if (df[id] === 1) uniq++;
      if (inQuery[id]) {
        cov++;
        covIDF += idf[id];
        if (idf[id] > covMax) covMax = idf[id];
      }
    }
    let hits = 0;
    let longest = 0;
    for (const c of compounds) {
      if (lower.includes(c)) {
        hits++;
        if (c.length > longest) longest = c.length;
      }
    }
    let bi = 0;
    let tri = 0;
    const w = lineWords[i];
    for (let j = 0; j + 1 < w.length; j++) {
      if (bigrams.has(`${w[j]} ${w[j + 1]}`)) bi++;
      if (j + 2 < w.length && trigrams.has(`${w[j]} ${w[j + 1]} ${w[j + 2]}`))
        tri++;
    }
    cover[i] = ratio(covIDF, qIDFSum);
    compound[i] = hits;

    r[F.bm25] = f(bm[i]);
    r[F.bm25_norm] = f(ratio(bm[i], bmMax));
    r[F.cover_tail] = f(ratio(tailIDF, tailIDFSum));
    r[F.bm25_tail_norm] = f(ratio(bmTail[i], tailMax));
    r[F.cover] = f(ratio(cov, found));
    r[F.cover_idf] = f(cover[i]);
    r[F.cover_n] = f(cov);
    r[F.cover_maxidf] = f(covMax);
    r[F.compound_hits] = f(hits);
    r[F.compound_maxlen] = f(Math.log1p(longest));
    r[F.bigram_hits] = f(bi);
    r[F.trigram_hits] = f(tri);
    if (set.length > 0) {
      r[F.idf_mean] = f(idfSum / set.length);
      r[F.uniq_frac] = f(uniq / set.length);
    }
    r[F.idf_max] = f(idfMax);
    const kinds = lineKinds(trimmed, lower);
    for (let k = 0; k < kinds.length; k++) r[F.k_error + k] = kinds[k];
    r[F.dup] = f(Math.log1p(dupCount.get(trimmed) - 1));
    r[F.tmpl] = f(Math.log1p(tmplCount.get(tmplKeys[i]) - 1));
    if (!tmplSeen.has(tmplKeys[i])) {
      tmplSeen.add(tmplKeys[i]);
      r[F.tmpl_first] = 1;
    }
    if (n > 1) r[F.pos_rel] = f(i / (n - 1));
    r[F.pos_head] = f(Math.log1p(i));
    r[F.pos_tail] = f(Math.log1p(n - 1 - i));
    r[F.n_lines] = f(Math.log1p(n));
    r[F.ctx_chars] = f(Math.log1p(byteLen(context)));
    r[F.len_chars] = f(Math.log1p(byteLen(line)));
    r[F.len_words] = f(
      Math.log1p(
        line
          .trim()
          .split(/\s+/u)
          .filter((x) => x !== "").length,
      ),
    );
    const { alnum, upper, digit, total } = charMix(trimmed);
    if (total > 0) {
      r[F.alnum_frac] = f(alnum / total);
      r[F.upper_frac] = f(upper / total);
      r[F.digit_frac] = f(digit / total);
    }
    r[F.indent] = f(Math.log1p(indent[i]));
    const p = prevNB[i];
    if (p >= 0 && !blank[i]) r[F.indent_delta] = f(indent[i] - indent[p]);
    const nx = nextNB[i];
    if (nx >= 0 && !blank[i] && indent[nx] > indent[i]) r[F.block_start] = 1;
    r[F.q_words] = f(Math.log1p(qWords.length));
    r[F.q_terms] = f(Math.log1p(qTerms.length));
    r[F.q_found] = f(ratio(found, qTerms.length));
    r[F.ctx_bm25_max] = f(bmMax);
  }

  const paraMax = new Float64Array(n);
  let i = 0;
  while (i < n) {
    let j = i;
    let best = 0;
    while (j < n && !blank[j]) {
      if (cover[j] > best) best = cover[j];
      j++;
    }
    for (let k = i; k < j; k++) paraMax[k] = best;
    i = Math.max(j, i + 1);
  }

  const byCover = Array.from({ length: n }, (_, k) => k);
  byCover.sort((a, b) => cover[b] - cover[a]);
  const topK = Math.min(3, n);

  const feedback = new Uint8Array(df.length);
  let fbSum = 0;
  for (let t = 0; t < topK; t++) {
    const idx = byCover[t];
    if (cover[idx] === 0) break;
    for (const id of lineTerms[idx]) {
      if (
        !inQuery[id] &&
        !feedback[id] &&
        df[id] <= Math.max(2, Math.floor(n / 50))
      ) {
        feedback[id] = 1;
        fbSum += idf[id];
      }
    }
  }

  const inCompounds = new Set(compounds);
  const hops = [];
  for (let t = 0; t < topK; t++) {
    const idx = byCover[t];
    if (cover[idx] === 0) break;
    for (const c of compoundTerms(lines[idx])) {
      if (!inCompounds.has(c) && hops.length < MAX_COMPOUNDS) {
        inCompounds.add(c);
        hops.push(c);
      }
    }
  }

  let heading = -1;
  for (let k = 0; k < n; k++) {
    const r = rows[k];
    r[F.para_cover_max] = f(paraMax[k]);
    if (heading >= 0) r[F.sec_cover] = f(cover[heading]);
    if (rows[k][F.k_heading] === 1) heading = k;
    let fb = 0;
    for (const id of lineTerms[k]) if (feedback[id]) fb += idf[id];
    r[F.prf_cover] = f(ratio(fb, fbSum));
    if (hops.length > 0) {
      const lower = lines[k].toLowerCase();
      let hits = 0;
      for (const c of hops) if (lower.includes(c)) hits++;
      r[F.prf_compound] = f(hits);
    }
  }

  const bmRank = rankFrac(bm);
  const covRank = rankFrac(cover);
  for (let k = 0; k < n; k++) {
    const r = rows[k];
    r[F.bm25_rank] = f(bmRank[k]);
    r[F.cover_rank] = f(covRank[k]);
    const h = headers[k];
    if (h >= 0) {
      r[F.header_dist] = f(Math.log1p(k - h));
      r[F.header_bm25] = f(ratio(bm[h], bmMax));
      r[F.header_cover] = f(cover[h]);
    }
    let winBM = 0;
    let winCov = 0;
    for (let j = Math.max(0, k - 2); j <= Math.min(n - 1, k + 2); j++) {
      winBM += ratio(bm[j], bmMax);
      winCov += cover[j];
    }
    r[F.bm25_win_sum] = f(winBM);
    r[F.cover_win_sum] = f(winCov);
    let nbMax = 0;
    let nbSum = 0;
    let covNb = 0;
    let compNb = 0;
    let cnt = 0;
    for (
      let j = Math.max(0, k - NEIGHBOUR_SPAN);
      j <= Math.min(n - 1, k + NEIGHBOUR_SPAN);
      j++
    ) {
      if (j === k) continue;
      const v = ratio(bm[j], bmMax);
      if (v > nbMax) nbMax = v;
      nbSum += v;
      if (cover[j] > covNb) covNb = cover[j];
      cnt++;
    }
    for (
      let j = Math.max(0, k - COMPOUND_SPAN);
      j <= Math.min(n - 1, k + COMPOUND_SPAN);
      j++
    ) {
      if (j !== k && compound[j] > compNb) compNb = compound[j];
    }
    r[F.nb_bm25_max] = f(nbMax);
    if (cnt > 0) r[F.nb_bm25_mean] = f(nbSum / cnt);
    r[F.nb_cover_max] = f(covNb);
    r[F.nb_compound_max] = f(compNb);
    if (k > 0) {
      r[F.prev_bm25] = f(ratio(bm[k - 1], bmMax));
      if (blank[k - 1]) r[F.prev_blank] = 1;
    }
    if (k + 1 < n) {
      r[F.next_bm25] = f(ratio(bm[k + 1], bmMax));
      if (blank[k + 1]) r[F.next_blank] = 1;
    }
  }

  return { lines, rows };
}
