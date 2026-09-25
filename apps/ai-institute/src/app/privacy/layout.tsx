import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Bhavya Foundation",
  description: "How Bhavya Foundation collects, uses, and protects data.",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
