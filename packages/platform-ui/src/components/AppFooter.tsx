"use client";

import React from "react";
import Link from "next/link";

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface AppFooterProps {
  columns?: FooterColumn[];
  tagline?: string;
  socialLinks?: FooterLink[];
}

const defaultColumns: FooterColumn[] = [
  {
    title: "Missions",
    links: [
      { label: "Forest Restoration", href: "/missions/forest" },
      { label: "Heritage Preservation", href: "/missions/heritage" },
      { label: "Knowledge Mission", href: "/missions/knowledge" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Academy", href: "/courses" },
      { label: "Programs", href: "/programs" },
      { label: "Research", href: "/research" },
      { label: "Library", href: "/library" },
    ],
  },
  {
    title: "Governance",
    links: [
      { label: "About", href: "/about" },
      { label: "Transparency", href: "/transparency" },
      { label: "Contributing", href: "/contributing" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
];

const defaultSocialLinks: FooterLink[] = [
  { label: "GitHub", href: "https://github.com/bhavya-foundation", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/bhavya-ailab", external: true },
];

export function AppFooter({
  columns = defaultColumns,
  tagline = "Restoring nature. Empowering humanity. Building for generations.",
  socialLinks = defaultSocialLinks,
}: AppFooterProps) {
  return (
    <footer className="border-t border-border-primary bg-bg-secondary/50" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-3 no-underline">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-accent-gold to-accent-earth flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">BF</span>
              </div>
              <span className="text-sm font-semibold text-text-primary">
                Bhavya Foundation
              </span>
            </Link>
            <p className="text-xs text-text-tertiary leading-relaxed max-w-xs">
              {tagline}
            </p>
            <div className="flex items-center gap-3 mt-3">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-text-muted hover:text-text-tertiary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2 list-none p-0 m-0">
                {col.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-border-primary flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-text-muted">
            &copy; {new Date().getFullYear()} Bhavya Foundation. All rights reserved.
          </p>
          <p className="text-[11px] text-text-muted">
            Built for Generations &middot; Nature. Knowledge. Heritage.
          </p>
        </div>
      </div>
    </footer>
  );
}
