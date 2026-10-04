export const WIDGET_IDS = [
  "tap-match",
  "sort-basket",
  "predict-reveal",
  "story-scene",
  "sim-controls",
  "investigate",
  "tokenize-explorer",
  "attention-play",
] as const;
export type WidgetId = (typeof WIDGET_IDS)[number];
