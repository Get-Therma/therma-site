import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy · Therma',
  description:
    "How Therma collects, uses, and protects your data. We don't sell data and use strong safeguards and HIPAA-eligible cloud services."
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

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

