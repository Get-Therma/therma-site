import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Therma Weekly – Coming Soon',
  description:
    'Therma Weekly is coming soon—a slow magazine with science-backed rituals, real-world experiments, and thoughtful insights from the Therma community.',
  alternates: {
    canonical: 'https://www.therma.one/weekly',
  },
  openGraph: {
    title: 'Therma Weekly – Coming Soon',
    description:
      'Therma Weekly is coming soon—a slow magazine with science-backed rituals, real-world experiments, and thoughtful insights from the Therma community.',
    url: 'https://www.therma.one/weekly',
    images: ['https://www.therma.one/og-image.png'],
  },
};

export default function WeeklyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

