import Link from "next/link";
import { StatusLabel, type StatusValue } from "./StatusLabel";

interface HubCardProps {
  href: string;
  title: string;
  description: string;
  eyebrow?: string;
  status?: StatusValue;
}

export function HubCard({
  href,
  title,
  description,
  eyebrow,
  status,
}: HubCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-border bg-bg-raised p-6 transition-colors hover:border-accent-gold/30"
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          {eyebrow ? (
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-accent-gold">
              {eyebrow}
            </span>
          ) : null}
          <h3
            className="editorial-tile-title"
            style={{ fontSize: "var(--text-xl)" }}
          >
            {title}
          </h3>
        </div>
        <span
          aria-hidden="true"
          className="editorial-tile-arrow transition-transform group-hover:translate-x-1"
        >
          →
        </span>
      </div>
      <p className="editorial-tile-desc">{description}</p>
      {status ? (
        <span className="mt-4 block">
          <StatusLabel status={status} />
        </span>
      ) : null}
    </Link>
  );
}
