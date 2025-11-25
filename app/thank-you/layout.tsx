import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Thank You · Therma',
  description: 'Thanks for joining the Therma waitlist—check your inbox for updates and beta access.'
};

export const viewport: Viewport = {
  themeColor: [
    {
      media: '(prefers-color-scheme: light)',
      color: '#f7f3ff'
    },
    {
      media: '(prefers-color-scheme: dark)',
      color: '#050505'
    }
  ]
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

