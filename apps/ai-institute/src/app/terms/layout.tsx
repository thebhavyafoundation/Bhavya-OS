import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Bhavya Foundation",
  description: "Terms governing use of Bhavya Foundation services.",
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
