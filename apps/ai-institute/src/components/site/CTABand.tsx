import Link from "next/link";

export interface CTAction {
  href: string;
  label: string;
  variant?: "gold" | "primary" | "secondary" | "ghost";
}

interface CTABandProps {
  title: string;
  text?: string;
  actions: CTAction[];
}

const VARIANT_CLASS: Record<NonNullable<CTAction["variant"]>, string> = {
  gold: "btn-gold",
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
};

export function CTABand({ title, text, actions }: CTABandProps) {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2
          className="editorial-heading"
          style={{
            fontSize: "var(--text-4xl)",
            marginBottom: "var(--space-6)",
          }}
        >
          {title}
        </h2>
        {text ? (
          <p
            className="editorial-lead"
            style={{
              fontSize: "var(--text-lg)",
              marginBottom: "var(--space-10)",
            }}
          >
            {text}
          </p>
        ) : (
          <div style={{ marginBottom: "var(--space-10)" }} />
        )}
        <div
          style={{
            display: "flex",
            gap: "var(--space-4)",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {actions.map((action) => (
            <Link
              key={action.href + action.label}
              href={action.href}
              className={`btn ${VARIANT_CLASS[action.variant ?? "gold"]}`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
