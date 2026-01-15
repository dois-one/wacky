// Main application layout

import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wacky - Capture, Organize, and Refine Ideas',
  description: 'A platform to capture, organize, and refine ideas visually with automated organization and AI-driven tools.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
