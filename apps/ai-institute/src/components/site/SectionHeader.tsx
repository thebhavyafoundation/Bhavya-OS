interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  label,
  title,
  description,
  align = "left",
}: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <div className={`section-header ${centered ? "text-center" : ""}`}>
      <p className="editorial-label">{label}</p>
      <h2
        className="editorial-heading"
        style={{
          fontSize: "var(--text-3xl)",
          marginTop: "var(--space-4)",
        }}
      >
        {title}
      </h2>
      {description ? (
        <p
          className="editorial-lead"
          style={
            centered
              ? {
                  fontSize: "var(--text-lg)",
                  marginTop: "var(--space-4)",
                  maxWidth: "640px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }
              : {
                  fontSize: "var(--text-lg)",
                  marginTop: "var(--space-4)",
                  maxWidth: "720px",
                }
          }
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
