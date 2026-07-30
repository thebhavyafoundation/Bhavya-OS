import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lesson Studio — Bhavya AI Lab OS',
  description: 'Transform Knowledge Objects into complete educational experiences for rural Himachal Pradesh',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
