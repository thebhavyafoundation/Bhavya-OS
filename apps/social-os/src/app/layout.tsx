import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social OS — Bhavya Foundation",
  description:
    "Content publishing and social media management for Bhavya Foundation",
};

export default function SocialOSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{ margin: 0, padding: 0, fontFamily: "system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
