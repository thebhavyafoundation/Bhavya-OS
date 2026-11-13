// Public surface.
//
// Copyright 2026 the trim-1-ts authors.
// Ported from github.com/caveman-ai/trim-1 (Apache-2.0). See NOTICE.

export {
  compress,
  score,
  applyPolicy,
  Points,
  DefaultPoint,
  MAX_CONTEXT_BYTES,
} from "./trim.js";
export { model, modelInfo, parseModel, probability, raw } from "./model.js";
export { lineFeatures, FEATURE_NAMES, N_FEATURES } from "./features.js";
export { bm25 } from "./bm25.js";
export { byteLen } from "./bytes.js";
