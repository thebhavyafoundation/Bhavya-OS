// Byte-accurate string helpers.
//
// Upstream trim-1 is Go, where string length and indexing are byte-based.
// JavaScript strings are UTF-16, so every place where that difference can
// change a result goes through this module.
//
// Copyright 2026 the trim-1-ts authors.
// Ported from github.com/caveman-ai/trim-1 (Apache-2.0). See NOTICE.
/* global TextEncoder, TextDecoder */

const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8");

export function isAscii(s) {
  for (let i = 0; i < s.length; i++) {
    if (s.charCodeAt(i) > 0x7f) return false;
  }
  return true;
}

export function byteLen(s) {
  if (isAscii(s)) return s.length;
  return encoder.encode(s).length;
}

export function utf8Bytes(s) {
  return encoder.encode(s);
}

export function fromUtf8(bytes) {
  return decoder.decode(bytes);
}

export function fround32(x) {
  return Math.fround(x);
}
