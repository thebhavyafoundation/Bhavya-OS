"use client";

/**
 * @bhavya/platform-ui — Breadcrumb
 *
 * Standardized breadcrumb navigation component.
 */

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav
      className={`flex items-center gap-2 text-xs text-text-muted ${className}`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={item.label}>
            {index > 0 && (
              <ChevronRight size={12} className="text-text-muted" />
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-text-tertiary">{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
