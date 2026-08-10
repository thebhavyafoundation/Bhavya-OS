"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  group?: string;
}

interface AppSidebarProps {
  brand?: string;
  brandIcon?: React.ReactNode;
  items: SidebarItem[];
  footer?: React.ReactNode;
  width?: number;
}

export function AppSidebar({
  brand = "Bhavya Foundation",
  brandIcon,
  items,
  footer,
  width = 240,
}: AppSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const grouped = items.reduce<Record<string, SidebarItem[]>>((acc, item) => {
    const group = item.group || "";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  return (
    <aside
      className="flex flex-col bg-bg-secondary border-r border-border-primary h-screen overflow-y-auto"
      style={{ width }}
    >
      <div className="px-5 py-4 border-b border-border-primary">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          {brandIcon || (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-gold to-accent-earth flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xs tracking-tight">BF</span>
            </div>
          )}
          <span className="text-sm font-semibold text-text-primary truncate">
            {brand}
          </span>
        </Link>
      </div>

      <nav className="flex-1 py-2">
        {Object.entries(grouped).map(([group, groupItems]) => (
          <div key={group}>
            {group && (
              <div className="px-5 pt-4 pb-1.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                {group}
              </div>
            )}
            {groupItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 mx-2 px-3 py-2 rounded-md text-[13px] font-medium transition-colors no-underline ${
                    active
                      ? "bg-accent-gold/10 text-accent-gold border border-accent-gold/20"
                      : "text-text-tertiary hover:text-text-secondary hover:bg-bg-tertiary border border-transparent"
                  }`}
                >
                  {item.icon && (
                    <span className="w-4 h-4 shrink-0">{item.icon}</span>
                  )}
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-accent-gold/15 text-accent-gold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {footer && (
        <div className="px-4 py-3 border-t border-border-primary">
          {footer}
        </div>
      )}
    </aside>
  );
}
