"use client";

import type { WidgetSpec } from "@/data/curriculum";
import { TapMatch } from "./TapMatch";
import { SortBasket } from "./SortBasket";
import { PredictReveal } from "./PredictReveal";
import { StoryScene } from "./StoryScene";
import { SimControls } from "./SimControls";
import { Investigate } from "./Investigate";

export function WidgetRenderer({ spec }: { spec: WidgetSpec }) {
  switch (spec.id) {
    case "tap-match":
      return <TapMatch {...spec.config} />;
    case "sort-basket":
      return <SortBasket {...spec.config} />;
    case "predict-reveal":
      return <PredictReveal {...spec.config} />;
    case "story-scene":
      return <StoryScene {...spec.config} />;
    case "sim-controls":
      return <SimControls {...spec.config} />;
    case "investigate":
      return <Investigate {...spec.config} />;
    case "tokenize-explorer":
      return (
        <div
          style={{
            padding: "var(--space-4)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border-primary)",
            background: "var(--color-bg-primary)",
            color: "var(--color-text-secondary)",
          }}
        >
          Tokenizer Explorer — requires @bhavya/interactive-components
        </div>
      );
    case "attention-play":
      return (
        <div
          style={{
            padding: "var(--space-4)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border-primary)",
            background: "var(--color-bg-primary)",
            color: "var(--color-text-secondary)",
          }}
        >
          Attention Play — requires @bhavya/interactive-components
        </div>
      );
  }
}
