import type { ReactNode } from "react";

interface PageHeroProps {
  label: string;
  title: string;
  lead?: ReactNode;
  children?: ReactNode;
  align?: "center" | "left";
}

export function PageHero({
  label,
  title,
  lead,
  children,
  align = "center",
}: PageHeroProps) {
  const centered = align === "center";
  return (
    <section className="px-6 pb-20 pt-32">
      <div className={`mx-auto max-w-4xl ${centered ? "text-center" : ""}`}>
        <p className="editorial-label">{label}</p>
        <h1
          className="editorial-heading"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
            marginTop: "var(--space-4)",
            marginBottom: lead || children ? "var(--space-6)" : undefined,
          }}
        >
          {title}
        </h1>
        {lead ? (
          <p
            className="editorial-lead"
            style={
              centered
                ? { maxWidth: "640px", margin: "0 auto" }
                : { maxWidth: "640px" }
            }
          >
            {lead}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
