// BM25 scoring.
//
// Copyright 2026 the trim-1-ts authors.
// Ported from github.com/caveman-ai/trim-1 (Apache-2.0). See NOTICE.

import { byteLen } from "./bytes.js";

const bm25K1 = 1.5;
const bm25B = 0.75;

const BM25_STOPWORDS = new Set([
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

export function bm25TermFreq(text) {
  const freq = new Map();
  let current = "";
  const flush = () => {
    if (byteLen(current) >= 2 && !BM25_STOPWORDS.has(current)) {
      freq.set(current, (freq.get(current) || 0) + 1);
    }
    current = "";
  };
  const lower = text.toLowerCase();
  for (const ch of lower) {
    if (isLetter(ch) || isDigit(ch) || ch === "_") current += ch;
    else flush();
  }
  flush();
  return freq;
}

export function bm25(query, docs) {
  const queryTerms = bm25TermFreq(query);
  const out = new Float64Array(docs.length);
  if (queryTerms.size === 0 || docs.length === 0) return out;

  const tfs = [];
  const docLen = new Float64Array(docs.length);
  const df = new Map();
  let totalLen = 0;
  for (let i = 0; i < docs.length; i++) {
    const tf = bm25TermFreq(docs[i]);
    tfs.push(tf);
    for (const count of tf.values()) docLen[i] += count;
    totalLen += docLen[i];
    for (const term of tf.keys()) df.set(term, (df.get(term) || 0) + 1);
  }

  const avgdl = totalLen > 0 ? totalLen / docs.length : 1.0;
  const terms = Array.from(queryTerms.keys()).sort();
  for (let i = 0; i < docs.length; i++) {
    for (const term of terms) {
      const tf = tfs[i].get(term) || 0;
      if (tf === 0) continue;
      const d = df.get(term) || 0;
      const idf = Math.log(1 + (docs.length - d + 0.5) / (d + 0.5));
      const denom = tf + bm25K1 * (1 - bm25B + (bm25B * docLen[i]) / avgdl);
      out[i] += (idf * (tf * (bm25K1 + 1))) / denom;
    }
  }
  return out;
}

const LETTER = /\p{L}/u;
const DIGIT = /\p{Nd}/u;

export function isLetter(ch) {
  return LETTER.test(ch);
}

export function isDigit(ch) {
  return DIGIT.test(ch);
}
