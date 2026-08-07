"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  School,
  BookOpen,
  Route,
  FlaskConical,
  Network,
  Search,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/schools", label: "Schools", icon: School },
  { href: "/programs", label: "Programs", icon: BookOpen },
  { href: "/learning-paths", label: "Learning Paths", icon: Route },
  { href: "/research", label: "Research", icon: FlaskConical },
  { href: "/knowledge-graph", label: "Knowledge Graph", icon: Network },
];

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/mission", label: "Mission" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contributing", label: "Contributing" },
  { href: "/press", label: "Press" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrolled(currentScrollY > 10);
    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      setNavVisible(false);
    } else {
      setNavVisible(true);
    }
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: navVisible ? 0 : -100 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
          scrolled
            ? "bg-bg-primary/90 backdrop-blur-xl border-b border-border-primary shadow-lg shadow-black/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-gold to-accent-earth flex items-center justify-center">
                <span className="text-white font-bold text-xs tracking-tight">
                  AI
                </span>
              </div>
              <span className="text-sm font-semibold text-text-primary hidden sm:block">
                AI Institute
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                      active
                        ? "text-text-primary"
                        : "text-text-tertiary hover:text-text-secondary"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 bg-accent-gold/10 border border-accent-gold/20 rounded-md"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <link.icon className="w-3.5 h-3.5" />
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border border-border-primary bg-bg-secondary text-text-tertiary text-xs hover:border-border-secondary hover:text-text-secondary transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
                <kbd className="ml-1 px-1 py-0.5 rounded bg-bg-tertiary text-text-muted text-[10px] font-mono border border-border-primary">
                  ⌘K
                </kbd>
              </button>

              <div className="w-8 h-8 rounded-full bg-accent-gold/20 border border-accent-gold/30 flex items-center justify-center text-accent-gold text-xs font-semibold">
                B
              </div>

              <button
                type="button"
                className="md:hidden p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 top-14 z-40 bg-bg-secondary border-b border-border-primary shadow-xl md:hidden"
          >
            <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      active
                        ? "bg-accent-gold/10 text-text-primary border border-accent-gold/20"
                        : "text-text-tertiary hover:bg-bg-tertiary hover:text-text-secondary"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                  </Link>
                );
              })}
              <div className="pt-2 mt-2 border-t border-border-primary">
                <button
                  type="button"
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-text-tertiary hover:bg-bg-tertiary hover:text-text-secondary transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Search
                  <kbd className="ml-auto px-1.5 py-0.5 rounded bg-bg-tertiary text-text-muted text-[10px] font-mono border border-border-primary">
                    ⌘K
                  </kbd>
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-14">{children}</main>

      <footer className="border-t border-border-primary bg-bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-accent-gold to-accent-earth flex items-center justify-center">
                  <span className="text-white font-bold text-[10px]">AI</span>
                </div>
                <span className="text-sm font-semibold text-text-primary">
                  AI Institute
                </span>
              </Link>
              <p className="text-xs text-text-tertiary leading-relaxed max-w-xs">
                Learn AI by building real things. A research-driven, open-source
                institute for the next generation of AI builders.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                Navigate
              </h4>
              <ul className="space-y-2">
                {navLinks.slice(0, 4).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                Resources
              </h4>
              <ul className="space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                Connect
              </h4>
              <div className="flex items-center gap-2">
                {["GitHub", "Twitter", "Discord"].map((platform) => (
                  <span
                    key={platform}
                    className="px-2.5 py-1.5 rounded-md border border-border-primary bg-bg-tertiary text-[11px] text-text-muted cursor-default"
                  >
                    {platform}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-text-muted mt-3">
                Open source under Bhavya Foundation
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border-primary flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-text-muted">
              &copy; {new Date().getFullYear()} Bhavya Foundation. All rights
              reserved.
            </p>
            <div className="flex items-center gap-4">
              {footerLinks.slice(0, 4).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[11px] text-text-muted hover:text-text-tertiary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
