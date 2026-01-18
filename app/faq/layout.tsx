import type { Metadata } from 'next';
import { generatePageMetadata } from '../../lib/seo';

export const metadata: Metadata = generatePageMetadata(
  'FAQ - Frequently Asked Questions | Therma',
  'Get answers to common questions about Therma, the AI habit tracker and guided reflection app. Learn about features, privacy, pricing, and more.',
  '/faq',
  {
    image: '/og-image.png',
  }
);

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
