import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface EditorialLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

/** Quiet text link with gold rule — one meaningful action. */
export function EditorialLink({
  href,
  children,
  className = "",
  ariaLabel,
}: EditorialLinkProps) {
  return (
    <a
      href={href}
      className={`editorial-link ${className}`.trim()}
      aria-label={ariaLabel}
    >
      {children} <ArrowRight size={15} aria-hidden="true" />
    </a>
  );
}
