import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.therma.one'),
  title: {
    default: 'Therma — AI‑Guided Journaling, Pattern Maps & Mood Insights',
    template: '%s · Therma'
  },
  description:
    'Therma turns your journaling and habits into pattern maps—showing bright spots to keep and frictions to tweak—so small changes create steadier weeks.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://www.therma.one/',
    title: 'Therma — AI‑Guided Journaling, Pattern Maps & Mood Insights',
    description:
      'Therma turns your journaling and habits into pattern maps—showing bright spots to keep and frictions to tweak—so small changes create steadier weeks.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Therma pattern maps' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Therma — AI‑Guided Journaling',
    description:
      'Pattern maps, bright spots, and a friction finder to steady your weeks.',
    images: ['/og-image.png']
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
