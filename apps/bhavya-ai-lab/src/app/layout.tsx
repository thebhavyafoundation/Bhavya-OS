import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bhavya AI Lab — Free AI Education Platform",
  description:
    "Free, offline-first AI education for children in rural Himachal Pradesh and beyond. Learn AI, programming, robotics, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          background: "#0f172a",
          color: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
