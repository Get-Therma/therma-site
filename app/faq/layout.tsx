import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | Therma',
  description: 'Get answers to common questions about Therma, the AI habit tracker and guided reflection app. Learn about features, privacy, pricing, and more.',
  alternates: {
    canonical: 'https://www.therma.one/faq',
  },
  openGraph: {
    title: 'FAQ - Frequently Asked Questions | Therma',
    description: 'Get answers to common questions about Therma, the AI habit tracker and guided reflection app. Learn about features, privacy, pricing, and more.',
    url: 'https://www.therma.one/faq',
    siteName: 'Therma',
    type: 'website',
    images: [{
      url: 'https://www.therma.one/og-image.png?v=4',
      width: 1200,
      height: 630,
      alt: 'Therma | A quieter way to check in.'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@gettherma',
    creator: '@gettherma',
    title: 'FAQ - Frequently Asked Questions | Therma',
    description: 'Get answers to common questions about Therma, the AI habit tracker and guided reflection app.',
    images: ['https://www.therma.one/og-image.png?v=4'],
  },
  robots: { index: true, follow: true },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
