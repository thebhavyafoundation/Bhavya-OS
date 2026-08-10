import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Bhavya Foundation",
  description: "Institutional dashboard for Bhavya Foundation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Inter, system-ui, sans-serif", background: "#0f172a", color: "#f8fafc" }}>
        {children}
      </body>
    </html>
  );
}
