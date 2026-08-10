"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthProvider";
import { AppFooter } from "@bhavya/platform-ui";
import {
  School,
  BookOpen,
  FlaskConical,
  Network,
  Search,
  Menu,
  X,
  ChevronRight,
  User,
  Home,
  LogIn,
  LogOut,
  TreePine,
  Landmark,
  Terminal,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/schools", label: "Schools", icon: School },
  { href: "/courses", label: "Academy", icon: BookOpen },
  { href: "/courses/foundations/lab", label: "Lab", icon: FlaskConical },
  { href: "/knowledge-graph", label: "Knowledge", icon: Network },
  { href: "/missions/forest", label: "Forest", icon: TreePine },
  { href: "/missions/heritage", label: "Heritage", icon: Landmark },
  { href: "/os", label: "OS", icon: Terminal },
];

const footerColumns = [
  {
    title: "Missions",
    links: [
      { label: "Forest Restoration", href: "/missions/forest" },
      { label: "Heritage Preservation", href: "/missions/heritage" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Academy", href: "/courses" },
      { label: "Programs", href: "/programs" },
      { label: "Research", href: "/research" },
      { label: "Library", href: "/library" },
      { label: "Schools", href: "/schools" },
    ],
  },
  {
    title: "Governance",
    links: [
      { label: "About", href: "/about" },
      { label: "OS Governance", href: "/os/governance" },
      { label: "Transparency", href: "/transparency" },
      { label: "Contributing", href: "/contributing" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Institutional OS", href: "/os" },
      { label: "Observability", href: "/os/observability" },
      { label: "Runtime", href: "/os/runtime" },
      { label: "API Explorer", href: "/os/api-explorer" },
      { label: "Sign In", href: "/login" },
    ],
  },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
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
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-md focus:bg-accent-green focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg focus:outline-none"
      >
        Skip to content
      </a>

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
                  BF
                </span>
              </div>
              <span className="text-sm font-semibold text-text-primary hidden sm:block">
                Bhavya Foundation
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.slice(0, 7).map((link) => {
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

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border border-border-primary bg-bg-secondary text-text-secondary text-xs hover:border-border-secondary transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent-gold to-accent-earth flex items-center justify-center">
                      <span className="text-[9px] font-bold text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    {user?.name || "Dashboard"}
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-md text-text-tertiary hover:text-text-secondary text-xs transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-md bg-accent-gold text-text-inverse text-xs font-semibold hover:bg-accent-gold-hover transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Link>
              )}

              <button
                type="button"
                className="lg:hidden p-2.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
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
            className="fixed inset-x-0 top-14 z-40 bg-bg-secondary border-b border-border-primary shadow-xl lg:hidden"
          >
            <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
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
              <div className="pt-2 mt-2 border-t border-border-primary space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm bg-accent-green/30 text-forest-400 font-medium hover:bg-accent-green/50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      {user?.name || "Dashboard"}
                    </Link>
                    <button
                      type="button"
                      onClick={logout}
                      className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm bg-accent-gold text-text-inverse font-semibold hover:bg-accent-gold-hover transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content" className="flex-1 pt-14">
        {children}
      </main>

      <AppFooter columns={footerColumns} />
    </div>
  );
}
