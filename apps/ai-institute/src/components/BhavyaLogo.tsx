import Link from "next/link";

interface BhavyaLogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  /** "dark" wraps the transparent logo in an ivory chip for dark surfaces. */
  variant?: "light" | "dark";
}

const sizes = {
  sm: { width: 48 },
  md: { width: 72 },
  lg: { width: 120 },
};

export function BhavyaLogo({
  size = "md",
  href = "/",
  variant = "light",
}: BhavyaLogoProps) {
  const s = sizes[size];
  const img = (
    <img
      src="/brand/logo-full.png"
      alt="Bhavya Foundation"
      width={s.width}
      height={Math.round(s.width * 0.98)}
      style={{
        width: s.width,
        height: "auto",
        display: "block",
      }}
    />
  );
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        textDecoration: "none",
        flexShrink: 0,
      }}
      aria-label="Bhavya Foundation home"
    >
      {variant === "dark" ? (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "var(--color-brand-ivory)",
            borderRadius: 10,
            padding: "6px 8px",
          }}
        >
          {img}
        </span>
      ) : (
        img
      )}
    </Link>
  );
}
