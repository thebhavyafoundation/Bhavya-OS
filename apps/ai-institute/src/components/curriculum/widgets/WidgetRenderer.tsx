"use client";

import type { WidgetSpec } from "@/types/curriculum";
import { Investigate } from "./Investigate";
import { PredictReveal } from "./PredictReveal";
import { SortBasket } from "./SortBasket";
import { TapMatch } from "./TapMatch";

export function WidgetRenderer({ widget }: { widget: WidgetSpec }) {
  switch (widget.id) {
    case "tap-match":
      return <TapMatch pairs={widget.config.pairs} />;
    case "sort-basket":
      return <SortBasket {...widget.config} />;
    case "predict-reveal":
      return <PredictReveal {...widget.config} />;
    case "investigate":
      return <Investigate {...widget.config} />;
  }
}
