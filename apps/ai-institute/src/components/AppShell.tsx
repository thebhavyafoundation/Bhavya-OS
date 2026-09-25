"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthProvider";
import { AppFooter } from "@bhavya/platform-ui";
import {
  getNavItems,
  getPublicNavGroups,
  getFooterColumns,
  type NavGroup,
} from "@/lib/useNavigation";
import type { Role } from "@/lib/roles";
import {
  BookOpen,
  FlaskConical,
  Search,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  User,
  Home,
  LogIn,
  LogOut,
  TreePine,
  Landmark,
  Brain,
  HeartHandshake,
  GraduationCap,
  Terminal,
  TrendingUp,
  Users,
  Compass,
  Award,
  LayoutDashboard,
  Scale,
  Zap,
  Eye,
  Settings,
  FileText,
  Network,
  Target,
  Library,
  Download,
  Handshake,
  Heart,
  BarChart3,
  Mail,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  TreePine,
  Brain,
  Landmark,
  HeartHandshake,
  GraduationCap,
  FlaskConical,
  TrendingUp,
  BookOpen,
  Users,
  Compass,
  Award,
  User: User,
  LayoutDashboard,
  Scale,
  Zap,
  Eye,
  Settings,
  FileText,
  Network,
  Terminal,
  Target,
  Library,
  Download,
  Handshake,
  Heart,
  BarChart3,
  Mail,
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get nav groups from canonical registry
  const navGroups = getPublicNavGroups();

  // Get footer columns from registry
  const footerColumns = getFooterColumns();

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

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleDropdownEnter = (groupId: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(groupId);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
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
                  BF
                </span>
              </div>
              <span className="text-sm font-semibold text-text-primary hidden sm:block">
                Bhavya Foundation
              </span>
            </Link>

            {/* Desktop Dropdown Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navGroups.map((group) => {
                const Icon = iconMap[group.items[0]?.icon] || Target;
                return (
                  <div
                    key={group.id}
                    className="relative"
                    onMouseEnter={() => handleDropdownEnter(group.id)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      className={`relative min-h-[44px] px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors flex items-center gap-1 ${
                        activeDropdown === group.id
                          ? "text-text-primary"
                          : "text-text-tertiary hover:text-text-secondary"
                      }`}
                    >
                      {group.label}
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-150 ${
                          activeDropdown === group.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {activeDropdown === group.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute top-full left-0 mt-1 w-64 bg-bg-elevated rounded-lg border border-border-primary shadow-lg overflow-hidden z-50"
                        >
                          {group.items.map((item) => {
                            const ItemIcon = iconMap[item.icon] || Target;
                            return (
                              <Link
                                key={item.id}
                                href={item.href}
                                className="flex items-start gap-3 px-4 py-3 hover:bg-bg-hover transition-colors"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <ItemIcon className="w-4 h-4 mt-0.5 text-text-muted shrink-0" />
                                <div>
                                  <div className="text-sm font-medium text-text-primary">
                                    {item.label}
                                  </div>
                                  {item.description && (
                                    <div className="text-xs text-text-muted mt-0.5">
                                      {item.description}
                                    </div>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="hidden sm:flex min-h-[44px] items-center gap-2 px-3 py-1.5 rounded-md border border-border-primary bg-bg-secondary text-text-tertiary text-xs hover:border-border-secondary hover:text-text-secondary transition-colors"
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
                    href="/app"
                    className="hidden sm:flex min-h-[44px] items-center gap-2 px-3 py-1.5 rounded-md border border-border-primary bg-bg-secondary text-text-secondary text-xs hover:border-border-secondary transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent-gold to-accent-earth flex items-center justify-center">
                      <span className="text-[9px] font-bold text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    {user?.name || "My Bhavya"}
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="hidden sm:flex min-h-[44px] items-center gap-1 px-2 py-1.5 rounded-md text-text-tertiary hover:text-text-secondary text-xs transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="flex min-h-[44px] items-center gap-2 px-3 py-1.5 rounded-md text-text-secondary text-xs font-medium hover:text-text-primary transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="flex min-h-[44px] items-center justify-center gap-2 px-4 py-1.5 rounded-md bg-accent-gold text-text-inverse text-xs font-semibold hover:bg-accent-gold-hover transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Create Account
                  </Link>
                </div>
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

      {/* Mobile Menu */}
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
              {navGroups.map((group) => (
                <div key={group.id} className="mb-3">
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-text-muted uppercase tracking-widest">
                    {group.label}
                  </div>
                  {group.items.map((item) => {
                    const ItemIcon = iconMap[item.icon] || Target;
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          isActive(item.href)
                            ? "bg-accent-gold/10 text-text-primary border border-accent-gold/20"
                            : "text-text-tertiary hover:bg-bg-tertiary hover:text-text-secondary"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <ItemIcon className="w-4 h-4" />
                          {item.label}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                      </Link>
                    );
                  })}
                </div>
              ))}

              <div className="pt-2 mt-2 border-t border-border-primary space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/app"
                      className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm bg-accent-green/30 text-forest-400 font-medium hover:bg-accent-green/50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      {user?.name || "My Bhavya"}
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
                  <>
                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm border border-border-primary text-text-secondary font-medium hover:bg-bg-tertiary transition-colors"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm bg-accent-gold text-text-inverse font-semibold hover:bg-accent-gold-hover transition-colors"
                    >
                      Create Account
                    </Link>
                  </>
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
