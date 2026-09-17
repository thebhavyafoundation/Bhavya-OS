import type { Metadata } from "next";
import "@bhavya/platform-ui";
import "./globals.css";
import { AdminHeader } from "../components/AdminHeader";
import { AdminSidebar } from "../components/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin — Bhavya Platform",
  description: "Internal administration and operations dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="min-h-screen flex">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <AdminHeader />
            <main
              id="main-content"
              className="flex-1 p-6"
              role="main"
              aria-label="Admin dashboard"
            >
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
