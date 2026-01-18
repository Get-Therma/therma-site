import type { Metadata } from 'next';
import { generatePageMetadata } from '../../lib/seo';

export const metadata: Metadata = generatePageMetadata(
  'Test Duplicate · Therma',
  'Internal testing page for duplicate detection.',
  '/test-duplicate',
  {
    noindex: true,
  }
);

export default function TestDuplicateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
