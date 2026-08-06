"use client";

export function SkipNavigation() {
  return (
    <a
      href="#main-content"
      className="skip-navigation"
      style={{
        position: "absolute",
        top: "-40px",
        left: 0,
        background: "var(--primary)",
        color: "white",
        padding: "8px 16px",
        zIndex: 100,
        transition: "top 0.3s",
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = "0";
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = "-40px";
      }}
    >
      Skip to main content
    </a>
  );
}
