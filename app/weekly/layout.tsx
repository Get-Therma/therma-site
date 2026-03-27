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
  // Open Graph - Facebook, LinkedIn, Discord, Slack, WhatsApp, Telegram
  // Note: og:image inherited from root opengraph-image.tsx
  openGraph: {
    title: 'Therma Weekly - Science-Backed Wellness Rituals',
    description:
      'Discover science-backed wellness rituals, real-world experiments, and thoughtful insights for mindful living.',
    url: 'https://www.therma.one/weekly',
    siteName: 'Therma',
    type: 'website',
    locale: 'en_US',
  },
  // Twitter/X Cards
  twitter: {
    card: 'summary_large_image',
    site: '@gettherma',
    creator: '@gettherma',
    title: 'Therma Weekly - Science-Backed Wellness Rituals',
    description: 'Discover science-backed wellness rituals, real-world experiments, and thoughtful insights for mindful living.',
  },
  // Additional social metadata
  other: {
    // Pinterest
    'pinterest-rich-pin': 'true',
    // LinkedIn
    'linkedin:owner': 'get-therma',
    // Author info
    'author': 'Therma',
    'article:publisher': 'https://www.facebook.com/gettherma'
  },
  robots: { index: true, follow: true },
  creator: 'Therma',
  publisher: 'Therma'
};

export default function WeeklyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
