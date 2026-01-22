import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Therma Weekly - Science-Backed Wellness Rituals & Mindful Living',
  description:
    'Discover science-backed wellness rituals, real-world experiments, and thoughtful insights. Therma Weekly explores sleep, energy, mindfulness, and personal growth with evidence-based approaches.',
  alternates: {
    canonical: 'https://www.therma.one/weekly',
  },
  keywords: [
    'wellness newsletter', 'mindfulness rituals', 'science-backed wellness',
    'sleep optimization', 'daily rituals', 'personal growth', 'mental wellness',
    'habit building', 'self-improvement', 'mindful living'
  ],
  openGraph: {
    title: 'Therma Weekly - Science-Backed Wellness Rituals',
    description:
      'Discover science-backed wellness rituals, real-world experiments, and thoughtful insights for mindful living.',
    url: 'https://www.therma.one/weekly',
    siteName: 'Therma',
    type: 'website',
    images: [{
      url: 'https://www.therma.one/og-image.png?v=4',
      width: 1200,
      height: 630,
      alt: 'Therma Weekly - Science-Backed Wellness Rituals'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@gettherma',
    creator: '@gettherma',
    title: 'Therma Weekly - Science-Backed Wellness Rituals',
    description: 'Discover science-backed wellness rituals, real-world experiments, and thoughtful insights for mindful living.',
    images: ['https://www.therma.one/og-image.png?v=4'],
  },
  robots: { index: true, follow: true },
};

export default function WeeklyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
