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
  },
  twitter: {
    card: 'summary_large_image',
    site: '@gettherma',
    creator: '@gettherma',
    title: 'FAQ - Frequently Asked Questions | Therma',
    description: 'Get answers to common questions about Therma, the AI habit tracker and guided reflection app.',
  },
  robots: { index: true, follow: true },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
