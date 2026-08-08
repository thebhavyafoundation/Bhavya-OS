"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthProvider";
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
  User,
  FolderOpen,
  BarChart3,
  MessageSquare,
  Home,
  LogIn,
  LogOut,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/schools", label: "Schools", icon: School },
  { href: "/learning-paths", label: "Learning Paths", icon: Route },
  { href: "/courses/foundations/lessons/1", label: "Courses", icon: BookOpen },
  { href: "/lab", label: "Lab", icon: FlaskConical },
  { href: "/knowledge-graph", label: "Knowledge Graph", icon: Network },
  { href: "/mentor", label: "Mentor", icon: MessageSquare },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/research", label: "Research", icon: FlaskConical },
  { href: "/portfolio", label: "Portfolio", icon: BarChart3 },
];

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/mission", label: "Mission" },
  { href: "/programs", label: "Programs" },
  { href: "/assessment", label: "Assessment" },
  { href: "/faq", label: "FAQ" },
  { href: "/contributing", label: "Contributing" },
  { href: "/press", label: "Press" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/login", label: "Sign In" },
  { href: "/register", label: "Register" },
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c9a227] to-[#8a7359] flex items-center justify-center">
                <span className="text-white font-bold text-xs tracking-tight">
                  AI
                </span>
              </div>
              <span className="text-sm font-semibold text-text-primary hidden sm:block">
                Bhavya AI Institute
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
                        className="absolute inset-0 bg-[#c9a227]/10 border border-[#c9a227]/20 rounded-md"
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
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#c9a227] to-[#8a7359] flex items-center justify-center">
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
                  className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-md bg-[#c9a227] text-[#0a0f0d] text-xs font-semibold hover:bg-[#c9a227]/90 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Link>
              )}

              <button
                type="button"
                className="lg:hidden p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
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
                        ? "bg-[#c9a227]/10 text-text-primary border border-[#c9a227]/20"
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
                      className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm bg-[#1a3a2a]/30 text-[#4ade80] font-medium hover:bg-[#1a3a2a]/50 transition-colors"
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
                    className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm bg-[#c9a227] text-[#0a0f0d] font-semibold hover:bg-[#c9a227]/90 transition-colors"
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

      <footer className="border-t border-border-primary bg-bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#c9a227] to-[#8a7359] flex items-center justify-center">
                  <span className="text-white font-bold text-[10px]">AI</span>
                </div>
                <span className="text-sm font-semibold text-text-primary">
                  Bhavya AI Institute
                </span>
              </Link>
              <p className="text-xs text-text-tertiary leading-relaxed max-w-xs">
                Learn AI by building real things. A research-driven, open-source
                institute for the next generation of AI builders.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                Learn
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/schools"
                    className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
                  >
                    Schools
                  </Link>
                </li>
                <li>
                  <Link
                    href="/learning-paths"
                    className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
                  >
                    Learning Paths
                  </Link>
                </li>
                <li>
                  <Link
                    href="/courses/foundations/lessons/1"
                    className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
                  >
                    Courses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/lab"
                    className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
                  >
                    Lab
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mentor"
                    className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
                  >
                    Mentor
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                Build
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/projects"
                    className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/portfolio"
                    className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
                  >
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/research"
                    className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
                  >
                    Research
                  </Link>
                </li>
                <li>
                  <Link
                    href="/knowledge-graph"
                    className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
                  >
                    Knowledge Graph
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                Institution
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
          </div>

          <div className="mt-8 pt-6 border-t border-border-primary flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-text-muted">
              &copy; {new Date().getFullYear()} Bhavya Foundation. All rights
              reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/bhavya-foundation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-text-muted hover:text-text-tertiary transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/company/bhavya-ailab"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-text-muted hover:text-text-tertiary transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
