import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Volunteer | Bhavya Foundation",
  description: "Volunteer management for Bhavya Foundation missions",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
