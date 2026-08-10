import Link from "next/link";

interface BhavyaLogoProps {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  href?: string;
}

const sizes = {
  sm: { icon: 20, text: "var(--text-sm)" },
  md: { icon: 28, text: "var(--text-lg)" },
  lg: { icon: 36, text: "var(--text-2xl)" },
};

export function BhavyaLogo({
  size = "md",
  showWordmark = true,
  href = "/",
}: BhavyaLogoProps) {
  const s = sizes[size];
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        textDecoration: "none",
      }}
      aria-label="Bhavya Foundation home"
    >
      <img
        src="/brand/icon.svg"
        alt=""
        width={s.icon}
        height={s.icon}
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      />
      {showWordmark && (
        <span
          style={{
            fontSize: s.text,
            fontWeight: 800,
            color: "var(--color-text-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          Bhavya
        </span>
      )}
    </Link>
  );
}
