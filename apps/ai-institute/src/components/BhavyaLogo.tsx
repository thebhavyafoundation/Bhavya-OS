import Link from "next/link";

interface BhavyaLogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
}

const sizes = {
  sm: { width: 48 },
  md: { width: 72 },
  lg: { width: 120 },
};

export function BhavyaLogo({ size = "md", href = "/" }: BhavyaLogoProps) {
  const s = sizes[size];
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
      <img
        src="/brand/logo.svg"
        alt="Bhavya Foundation"
        width={s.width}
        height={Math.round(s.width * 1.2)}
        style={{
          width: s.width,
          height: "auto",
          display: "block",
        }}
      />
    </Link>
  );
}
