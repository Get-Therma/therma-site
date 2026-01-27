import type { Metadata } from 'next';
import { generatePageMetadata } from '../../lib/seo';

export const metadata: Metadata = generatePageMetadata(
  'Admin Dashboard · Therma',
  'Therma internal admin dashboard.',
  '/admin',
  {
    noindex: true,
  }
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
