interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
  subtitle?: string;
}

export function StatCard({
  label,
  value,
  icon,
  color = "#22c55e",
  subtitle,
}: StatCardProps) {
  return (
    <div
      style={{
        background: "#18181b",
        border: "1px solid #27272a",
        borderRadius: 12,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3f3f46")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#27272a")}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 13, color: "#a1a1aa", fontWeight: 500 }}>
          {label}
        </span>
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: 12, color: "#52525b" }}>{subtitle}</div>
      )}
    </div>
  );
}
