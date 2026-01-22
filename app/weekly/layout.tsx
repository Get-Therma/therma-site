import type { Metadata } from 'next';

const OG_IMAGE = 'https://www.therma.one/og-image.png?v=4';

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
  openGraph: {
    title: 'Therma Weekly - Science-Backed Wellness Rituals',
    description:
      'Discover science-backed wellness rituals, real-world experiments, and thoughtful insights for mindful living.',
    url: 'https://www.therma.one/weekly',
    siteName: 'Therma',
    type: 'website',
    locale: 'en_US',
    images: [{
      url: OG_IMAGE,
      secureUrl: OG_IMAGE,
      width: 1200,
      height: 630,
      alt: 'Therma Weekly - Science-Backed Wellness Rituals & Mindful Living',
      type: 'image/png'
    }],
  },
  // Twitter/X Cards
  twitter: {
    card: 'summary_large_image',
    site: '@gettherma',
    creator: '@gettherma',
    title: 'Therma Weekly - Science-Backed Wellness Rituals',
    description: 'Discover science-backed wellness rituals, real-world experiments, and thoughtful insights for mindful living.',
    images: [{
      url: OG_IMAGE,
      alt: 'Therma Weekly Newsletter'
    }],
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
