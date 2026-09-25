import type { ReactNode } from "react";

export type SectionVariant =
  "default" | "ivory" | "cream" | "forest" | "forest-dark" | "gold";

export type SectionSize = "narrow" | "default" | "wide";

interface SectionProps {
  variant?: SectionVariant;
  size?: SectionSize;
  id?: string;
  className?: string;
  children: ReactNode;
}

const VARIANT_CLASS: Record<SectionVariant, string> = {
  default: "",
  ivory: "section-ivory",
  cream: "section-cream",
  forest: "section-forest",
  "forest-dark": "section-forest-dark",
  gold: "section-gold",
};

const SIZE_CLASS: Record<SectionSize, string> = {
  narrow: "container-narrow",
  default: "container",
  wide: "container-wide",
};

export function Section({
  variant = "default",
  size = "default",
  id,
  className = "",
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`py-20 ${VARIANT_CLASS[variant]} ${className}`.trim()}
    >
      <div className={SIZE_CLASS[size]}>{children}</div>
    </section>
  );
}
