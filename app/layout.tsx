import type { Metadata } from 'next';
import './globals.css';
import ThermaAssistant from '../components/ThermaAssistant';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.therma.one'),
  title: {
    default: 'Therma – Habit Tracker for Energy, Clarity & Confidence',
    template: '%s · Therma'
  },
  description:
    'Therma turns your daily habits into actionable insights to optimize your routine for more energy, clarity & confidence. Join our waitlist for early access.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://www.therma.one/',
    title: 'Therma – Habit Tracker for Energy, Clarity & Confidence',
    description:
      'Therma turns your daily habits into actionable insights to optimize your routine for more energy, clarity & confidence. Join our waitlist for early access.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Therma pattern maps' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Therma – Habit Tracker for Energy, Clarity & Confidence',
    description:
      'Therma turns your daily habits into actionable insights to optimize your routine for more energy, clarity & confidence.',
    images: ['/og-image.png']
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ThermaAssistant />
        
        {/* Beehiv Analytics Script */}
        {process.env.BEEHIIV_PUBLICATION_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  var script = document.createElement('script');
                  script.src = 'https://cdn.beehiiv.com/scripts/analytics.js';
                  script.async = true;
                  script.onload = function() {
                    if (window.beehiivAnalytics) {
                      window.beehiivAnalytics.init('${process.env.BEEHIIV_PUBLICATION_ID}');
                    }
                  };
                  document.head.appendChild(script);
                })();
              `
            }}
          />
        )}
      </body>
    </html>
  );
}