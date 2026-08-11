import type { Metadata } from "next";
import "@bhavya/platform-ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bhavya OS — Design & Web Intelligence",
  description:
    "Design intelligence, pattern library, and web analysis engine for Bhavya Foundation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-bg-primary text-text-primary antialiased"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {children}
      </body>
    </html>
  );
}
