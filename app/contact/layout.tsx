import type { Metadata } from 'next';
import { generatePageMetadata } from '../../lib/seo';

export const metadata: Metadata = generatePageMetadata(
  'Contact Us | Therma',
  "Get in touch with Therma. Have questions, feedback, or interested in partnerships? We're here to listen and help.",
  '/contact',
  {
    image: '/og-image.png',
  }
);

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
