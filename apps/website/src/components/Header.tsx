import { LanguageSwitcher } from "./LanguageSwitcher";
import { ArrowRight } from "lucide-react";
import { ThemeToggle, MobileMenu } from "./HeaderClient";

export function Header({ currentPath = "/" }: { currentPath?: string }) {
  const navItems = [
    { id: "nav-home", label: "Home", href: "/" },
    { id: "nav-mission", label: "Mission", href: "/mission" },
    { id: "nav-programs", label: "Programs", href: "/programs" },
    { id: "nav-knowledge", label: "Knowledge", href: "/knowledge" },
    { id: "nav-heritage", label: "Heritage", href: "/heritage" },
    { id: "nav-community", label: "Community", href: "/community" },
    { id: "nav-transparency", label: "Transparency", href: "/transparency" },
    { id: "nav-about", label: "About", href: "/about" },
  ];

  const isActive = (href: string) => currentPath === href;

  return (
    <>
      <header className="site-header" role="banner">
        <a href="/" className="nav-logo" aria-label="Bhavya Foundation home">
          <img
            src="/brand/icon.svg"
            alt=""
            className="nav-logo-icon"
            width="32"
            height="32"
            aria-hidden="true"
          />
          <span className="nav-logo-text">Bhavya</span>
        </a>

        <nav className="nav-list" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`nav-link${isActive(item.href) ? " active" : ""}`}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <LanguageSwitcher />
          <ThemeToggle />
          <a href="/donate" className="nav-donate">
            Donate
          </a>
          <a href="/knowledge" className="nav-cta">
            Start Learning
            <ArrowRight aria-hidden="true" />
          </a>
          <MobileMenu items={navItems} currentPath={currentPath} />
        </div>
      </header>
    </>
  );
}
