// Model loading and tree inference.
//
// model.bin holds LightGBM gradient-boosted trees. Layout, little endian:
// "KEEP", version uint32 (1), features, trees, nodes, leaves (uint32 each);
// then each feature name as uint16 length + bytes; tree roots []int32; node
// feature []int32, threshold []float64, left []int32, right []int32; leaf
// values []float64. A child or root below zero is the leaf ^index. A node
// sends a row left when row[feature] <= threshold, as LightGBM does with no
// missing values.
//
// Copyright 2026 the trim-1-ts authors.
// Ported from github.com/caveman-ai/trim-1 (Apache-2.0). See NOTICE.
/* global TextDecoder */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { FEATURE_NAMES } from "./features.js";

const here = dirname(fileURLToPath(import.meta.url));

export const MODEL_PATH = join(here, "assets", "model.bin");

const N_FEATURES = FEATURE_NAMES.length;

const f32buf = new Float32Array(1);
const i32buf = new Int32Array(f32buf.buffer);

function nextafter32Down(x) {
  if (Number.isNaN(x)) return x;
  f32buf[0] = x;
  let bits = i32buf[0];
  if (bits === 0) {
    i32buf[0] = -2147483647;
    return f32buf[0];
  }
  if (bits < 0) bits += 1;
  else bits -= 1;
  i32buf[0] = bits;
  return f32buf[0];
}

export function parseModel(buf) {
  if (buf.byteLength < 24) throw new Error("trim model header: too short");
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const magic = String.fromCharCode(buf[0], buf[1], buf[2], buf[3]);
  const version = dv.getUint32(4, true);
  const features = dv.getUint32(8, true);
  const trees = dv.getUint32(12, true);
  const nodes = dv.getUint32(16, true);
  const leaves = dv.getUint32(20, true);

  if (magic !== "KEEP" || version !== 1) {
    throw new Error("trim model: bad magic or version");
  }
  if (
    features !== N_FEATURES ||
    trees === 0 ||
    nodes > 1 << 24 ||
    leaves > 1 << 24
  ) {
    throw new Error(
      `trim model: ${features} features, ${trees} trees, ${nodes} nodes, ${leaves} leaves (package computes ${N_FEATURES} features)`,
    );
  }

  let size = 24 + 4 * trees + 20 * nodes + 8 * leaves;
  for (const name of FEATURE_NAMES) size += 2 + name.length;
  if (size !== buf.byteLength) {
    throw new Error(
      `trim model: header implies ${size} bytes, model has ${buf.byteLength}`,
    );
  }

  let off = 24;
  for (let i = 0; i < N_FEATURES; i++) {
    const n = dv.getUint16(off, true);
    off += 2;
    const name = new TextDecoder().decode(buf.subarray(off, off + n));
    off += n;
    if (name !== FEATURE_NAMES[i]) {
      throw new Error(
        `trim model feature ${i} is ${JSON.stringify(name)}, package has ${JSON.stringify(FEATURE_NAMES[i])}`,
      );
    }
  }

  const roots = new Int32Array(trees);
  for (let i = 0; i < trees; i++) {
    roots[i] = dv.getInt32(off, true);
    off += 4;
  }
  const feature = new Int32Array(nodes);
  for (let i = 0; i < nodes; i++) {
    feature[i] = dv.getInt32(off, true);
    off += 4;
  }
  const threshold = new Float64Array(nodes);
  for (let i = 0; i < nodes; i++) {
    threshold[i] = dv.getFloat64(off, true);
    off += 8;
  }
  const left = new Int32Array(nodes);
  for (let i = 0; i < nodes; i++) {
    left[i] = dv.getInt32(off, true);
    off += 4;
  }
  const right = new Int32Array(nodes);
  for (let i = 0; i < nodes; i++) {
    right[i] = dv.getInt32(off, true);
    off += 4;
  }
  const leaf = new Float64Array(leaves);
  for (let i = 0; i < leaves; i++) {
    leaf[i] = dv.getFloat64(off, true);
    off += 8;
  }
  if (off !== buf.byteLength) {
    throw new Error(`trim model: ${buf.byteLength - off} trailing bytes`);
  }

  const valid = (c) => (c >= 0 && c < nodes) || (c < 0 && ~c < leaves);
  for (const c of roots) {
    if (!valid(c)) throw new Error("trim model: root out of range");
  }

  const nodeFeature = new Int32Array(nodes);
  const nodeThreshold = new Float32Array(nodes);
  const nodeLeft = new Int32Array(nodes);
  const nodeRight = new Int32Array(nodes);
  for (let i = 0; i < nodes; i++) {
    if (
      feature[i] < 0 ||
      feature[i] >= N_FEATURES ||
      !valid(left[i]) ||
      !valid(right[i]) ||
      (left[i] >= 0 && left[i] <= i) ||
      (right[i] >= 0 && right[i] <= i) ||
      Number.isNaN(threshold[i])
    ) {
      throw new Error(`trim model: node ${i} out of range`);
    }
    let t = Math.fround(threshold[i]);
    if (t > threshold[i]) t = nextafter32Down(t);
    nodeFeature[i] = feature[i];
    nodeThreshold[i] = t;
    nodeLeft[i] = left[i];
    nodeRight[i] = right[i];
  }

  return {
    roots,
    nodeFeature,
    nodeThreshold,
    nodeLeft,
    nodeRight,
    leaf,
    bytes: buf.byteLength,
  };
}

export function raw(model, row) {
  let sum = 0;
  for (let t = 0; t < model.roots.length; t++) {
    let i = model.roots[t];
    while (i >= 0) {
      if (row[model.nodeFeature[i]] <= model.nodeThreshold[i])
        i = model.nodeLeft[i];
      else i = model.nodeRight[i];
    }
    sum += model.leaf[~i];
  }
  return sum;
}

const Ln2Hi = 6.9314718036912381649e-1;
const Ln2Lo = 1.90821492927058770002e-10;
const Log2e = 1.442695040888963387;
const Overflow = 7.09782712893383973096e2;
const Underflow = -7.4513321910194110842e2;
const NearZero = 1 / (1 << 28);

// Portable exp, matching upstream's Go implementation so results agree
// bit for bit across platforms.
//
// Copyright 2009 The Go Authors. BSD-style license; see upstream LICENSE-go.
// From FreeBSD's e_exp.c: Copyright (C) 2004 by Sun Microsystems, Inc.
// All rights reserved. Permission to use, copy, modify, and distribute this
// software is freely granted, provided that this notice is preserved.
export function exp(x) {
  if (Number.isNaN(x)) return x;
  if (x > Overflow) return Infinity;
  if (x < Underflow) return 0;
  if (-NearZero < x && x < NearZero) return 1 + x;

  let k = 0;
  if (x < 0) k = Math.trunc(Log2e * x - 0.5);
  else if (x > 0) k = Math.trunc(Log2e * x + 0.5);
  const hi = x - k * Ln2Hi;
  const lo = k * Ln2Lo;
  return expmulti(hi, lo, k);
}

function expmulti(hi, lo, k) {
  const P1 = 1.66666666666666657415e-1;
  const P2 = -2.77777777770155933842e-3;
  const P3 = 6.61375632143793436117e-5;
  const P4 = -1.6533902205465251539e-6;
  const P5 = 4.13813679705723846039e-8;

  const r = hi - lo;
  const t = r * r;
  const c = r - t * (P1 + t * (P2 + t * (P3 + t * (P4 + t * P5))));
  const y = 1 - (lo - (r * c) / (2 - c) - hi);
  return y * Math.pow(2, k);
}

export function probability(model, row) {
  return 1 / (1 + exp(-raw(model, row)));
}

let cached = null;

export function model() {
  if (!cached) cached = parseModel(new Uint8Array(readFileSync(MODEL_PATH)));
  return cached;
}

export function modelInfo() {
  const m = model();
  return `${m.roots.length} trees, ${m.nodeFeature.length} nodes, ${N_FEATURES} features, ${m.bytes} bytes`;
}
