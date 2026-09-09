import type { Metadata } from "next";
import "@bhavya/platform-ui";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "IOC — Institution Operations Center",
  description: "Executive command center for Bhavya Foundation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          .skip-link {
            position: absolute;
            left: -10000px;
            top: auto;
            width: 1px;
            height: 1px;
            overflow: hidden;
            z-index: 10000;
          }
          .skip-link:focus {
            position: fixed;
            top: 12px;
            left: 12px;
            width: auto;
            height: auto;
            padding: 8px 16px;
            background: #d4af37;
            color: #0e382e;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            z-index: 10000;
          }
          .ioc-mobile-toggle {
            display: none;
            position: fixed;
            top: 12px;
            left: 12px;
            z-index: 1001;
            background: #0a0a0a;
            border: 1px solid #333;
            border-radius: 6px;
            padding: 8px 12px;
            color: white;
            cursor: pointer;
            font-size: 18;
          }
          .ioc-sidebar-overlay {
            display: none;
          }
          @media (max-width: 768px) {
            .ioc-mobile-toggle {
              display: block;
            }
            .ioc-sidebar {
              position: fixed;
              left: 0;
              top: 0;
              bottom: 0;
              z-index: 1000;
              transform: translateX(-100%);
              transition: transform 0.2s ease;
            }
            .ioc-sidebar-open {
              transform: translateX(0);
            }
            .ioc-sidebar-overlay {
              display: block;
              position: fixed;
              inset: 0;
              background: rgba(0, 0, 0, 0.5);
              z-index: 999;
            }
          }
        `}</style>
      </head>
      <body className="bg-black text-white">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <div className="flex min-h-screen">
          <Sidebar />
          <main id="main-content" className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
