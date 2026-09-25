import type { ReactNode } from "react";

export type PhotoPlateVariant =
  | "landscape"
  | "forest"
  | "knowledge"
  | "heritage"
  | "community"
  | "people"
  | "watershed"
  | "generations";

interface PhotoPlateProps {
  /** Editorial plate number, e.g. "Plate 01" */
  index: string;
  /** Short subject line shown on the plate */
  label: string;
  /** Optional caption under the plate */
  caption?: string;
  variant?: PhotoPlateVariant;
  /** Real documentary photograph path — only when a rights-cleared JPEG exists */
  photo?: string;
  /** Meaningful alt when photo is present; reserved plates use role=img + aria-label */
  alt?: string;
  className?: string;
  /** Absolute priority only for the true hero plate */
  priority?: boolean;
  children?: ReactNode;
  style?: React.CSSProperties;
}

type PlateMotifName = "mountain" | "botanical" | "linework" | "contour";

const variantArt: Record<PhotoPlateVariant, { motif: PlateMotifName }> = {
  landscape: { motif: "mountain" },
  forest: { motif: "botanical" },
  knowledge: { motif: "linework" },
  heritage: { motif: "linework" },
  community: { motif: "contour" },
  people: { motif: "contour" },
  watershed: { motif: "mountain" },
  generations: { motif: "mountain" },
};

function PlateMotif({ motif }: { motif: PlateMotifName }) {
  if (motif === "mountain") {
    return (
      <img
        src="/brand/svg/mountain-layer.svg"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="photo-plate-motif photo-plate-motif-mountain"
      />
    );
  }
  if (motif === "botanical") {
    return (
      <img
        src="/brand/svg/leaf-pattern.svg"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="photo-plate-motif photo-plate-motif-botanical"
      />
    );
  }
  if (motif === "contour") {
    return (
      <img
        src="/brand/svg/topographic-pattern.svg"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="photo-plate-motif photo-plate-motif-contour"
      />
    );
  }
  return (
    <img
      src="/brand/svg/sun.svg"
      alt=""
      aria-hidden="true"
      draggable={false}
      className="photo-plate-motif photo-plate-motif-linework"
    />
  );
}

/**
 * PhotoPlate — intentional editorial image slot.
 *
 * Two modes:
 * 1. photo: rights-cleared documentary JPEG (future drop-in).
 * 2. reserved: brand illustrative composition + ASSET REQUIRED treatment.
 *    Never ships SVG/CSS as fake photography; never fabricates field evidence.
 */
export function PhotoPlate({
  index,
  label,
  caption,
  variant = "landscape",
  photo,
  alt,
  className = "",
  priority = false,
  children,
  style,
}: PhotoPlateProps) {
  const art = variantArt[variant];

  if (photo) {
    return (
      <figure
        className={`photo-plate photo-plate-has-photo ${className}`.trim()}
        style={style}
      >
        <div className="photo-plate-field photo-plate-field-photo">
          <img
            src={photo}
            alt={alt ?? label}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="photo-plate-img"
          />
          <div className="photo-plate-veil" aria-hidden="true" />
          <div className="photo-plate-meta">
            <span className="photo-plate-index">{index}</span>
            <span className="photo-plate-rule" aria-hidden="true" />
            <span className="photo-plate-label">{label}</span>
          </div>
        </div>
        {caption ? (
          <figcaption className="photo-plate-caption">{caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure
      className={`photo-plate photo-plate-reserved ${className}`.trim()}
      style={style}
    >
      <div
        className="photo-plate-field"
        role="img"
        aria-label={`${label}. Documentary photograph reserved for this plate.`}
      >
        <PlateMotif motif={art.motif} />
        <div className="photo-plate-meta">
          <span className="photo-plate-index">{index}</span>
          <span className="photo-plate-rule" aria-hidden="true" />
          <span className="photo-plate-label">{label}</span>
          <span className="photo-plate-status" aria-hidden="true">
            Documentary frame reserved
          </span>
        </div>
        {children}
      </div>
      {caption ? (
        <figcaption className="photo-plate-caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
