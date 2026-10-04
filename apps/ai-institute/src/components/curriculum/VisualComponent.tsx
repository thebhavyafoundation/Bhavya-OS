"use client";

import { Suspense, type ReactNode } from "react";
import dynamic from "next/dynamic";

const Model3D = dynamic(
  () => import("@/components/three/Model3D").then((mod) => mod.Model3D),
  {
    ssr: false,
    loading: () => <VisualFallback type="3d" />,
  }
);

const LottieLoader = dynamic(
  () => import("@/components/motion/LottieLoader").then((mod) => mod.LottieLoader),
  {
    ssr: false,
    loading: () => <VisualFallback type="animation" />,
  }
);

interface VisualFallbackProps {
  type: "3d" | "2d" | "animation" | "infographic";
}

function VisualFallback({ type }: VisualFallbackProps) {
  const labels: Record<string, string> = {
    "3d": "Loading 3D model...",
    "2d": "Loading diagram...",
    animation: "Loading animation...",
    infographic: "Loading infographic...",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px",
        background: "var(--color-surface)",
        borderRadius: "var(--radius-lg)",
        color: "var(--color-text-secondary)",
        fontSize: "var(--text-sm)",
      }}
    >
      {labels[type] || "Loading..."}
    </div>
  );
}

interface VisualComponentProps {
  assetUrl: string;
  type: "3d" | "2d" | "animation" | "infographic";
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function VisualComponent({
  assetUrl,
  type,
  alt = "",
  className,
  style,
}: VisualComponentProps) {
  if (assetUrl.includes("[to-be-downloaded]")) {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "200px",
          background: "var(--color-surface-forest-light)",
          borderRadius: "var(--radius-lg)",
          color: "var(--color-text-secondary)",
          fontSize: "var(--text-sm)",
          ...style,
        }}
      >
        Asset pending download
      </div>
    );
  }

  if (type === "3d" && (assetUrl.endsWith(".glb") || assetUrl.endsWith(".gltf"))) {
    return (
      <Suspense fallback={<VisualFallback type="3d" />}>
        <Model3D src={assetUrl} />
      </Suspense>
    );
  }

  if (type === "animation" && assetUrl.endsWith(".json")) {
    return (
      <Suspense fallback={<VisualFallback type="animation" />}>
        <LottieLoader src={assetUrl} />
      </Suspense>
    );
  }

  if (type === "2d" || type === "infographic") {
    if (assetUrl.endsWith(".svg")) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={assetUrl}
          alt={alt}
          className={className}
          style={{ maxWidth: "100%", height: "auto", ...style }}
          loading="lazy"
        />
      );
    }

    return (
      <Suspense fallback={<VisualFallback type={type} />}>
        <div className={className} style={style}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetUrl}
            alt={alt}
            style={{ maxWidth: "100%", height: "auto" }}
            loading="lazy"
          />
        </div>
      </Suspense>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px",
        background: "var(--color-surface)",
        borderRadius: "var(--radius-lg)",
        color: "var(--color-text-secondary)",
        fontSize: "var(--text-sm)",
        ...style,
      }}
    >
      Unsupported visual type: {type}
    </div>
  );
}

export function VisualSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={className}
      style={{
        padding: "var(--space-16) 0",
        background: "var(--color-ivory-200)",
      }}
    >
      <div className="container">{children}</div>
    </section>
  );
}
