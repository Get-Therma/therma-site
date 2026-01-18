import type { Metadata } from 'next';
import { generatePageMetadata } from '../../lib/seo';

export const metadata: Metadata = generatePageMetadata(
  'Already Registered · Therma',
  'This email address is already on the Therma waitlist. No need to sign up twice!',
  '/already-registered',
  {
    noindex: true,
  }
);

export default function AlreadyRegisteredLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
