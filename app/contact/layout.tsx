import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Therma',
  description: "Get in touch with Therma. Have questions, feedback, or interested in partnerships? We're here to listen and help.",
  alternates: {
    canonical: 'https://www.therma.one/contact',
  },
  openGraph: {
    title: 'Contact Us | Therma',
    description: "Get in touch with Therma. Have questions, feedback, or interested in partnerships? We're here to listen and help.",
    url: 'https://www.therma.one/contact',
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
    title: 'Contact Us | Therma',
    description: "Get in touch with Therma. Have questions, feedback, or interested in partnerships? We're here to listen and help.",
    images: ['https://www.therma.one/og-image.png?v=4'],
  },
  robots: { index: true, follow: true },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
