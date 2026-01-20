import type { Metadata, Viewport } from 'next';
import './globals.css';
import ThermaAssistant from '../components/ThermaAssistant';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const OG_IMAGE_URL = 'https://www.therma.one/og-image.png?v=5';
const ICONS_VERSION = '5';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.therma.one'),
  title: {
    default: 'Therma – AI Habit Tracker & Guided Reflections',
    template: '%s · Therma'
  },
  description:
    'Unlock daily clarity with AI-guided reflections. Therma is an AI habit tracker that helps you discover patterns and optimize your routine. Join the waitlist for early access.',
  keywords: ['AI habit tracker', 'habit tracking', 'AI reflections', 'mindfulness app', 'daily reflections', 'AI companion', 'habit optimization', 'self-reflection tool'],
  alternates: { 
    canonical: 'https://www.therma.one/',
  },
  icons: {
    icon: [
      { url: `/favicon.svg?v=${ICONS_VERSION}`, type: 'image/svg+xml' },
      { url: `/therma-logo-16.svg?v=${ICONS_VERSION}`, sizes: '16x16', type: 'image/svg+xml' },
      { url: `/therma-logo-24.svg?v=${ICONS_VERSION}`, sizes: '24x24', type: 'image/svg+xml' },
      { url: `/therma-logo-32.svg?v=${ICONS_VERSION}`, sizes: '32x32', type: 'image/svg+xml' }
    ],
    apple: [
      { url: `/apple-touch-icon.png?v=${ICONS_VERSION}`, sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'mask-icon', url: `/therma-logo.svg?v=${ICONS_VERSION}`, color: '#2D5016' }
    ]
  },
  manifest: `/site.webmanifest?v=${ICONS_VERSION}`,
  openGraph: {
    type: 'website',
    url: 'https://www.therma.one/',
    title: 'Therma – AI Habit Tracker & Guided Reflections',
    description:
      'Unlock daily clarity with AI-guided reflections. Join the waitlist for early access to Therma, an AI habit tracker that helps you discover patterns and optimize your routine.',
    images: [{
      url: OG_IMAGE_URL,
      width: 1200, 
      height: 630, 
      alt: 'Therma - AI Habit Tracker' 
    }],
    siteName: 'Therma'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Therma – AI Habit Tracker & Guided Reflections',
    description:
      'Unlock daily clarity with AI-guided reflections. Join the waitlist for early access to Therma.',
    images: [OG_IMAGE_URL],
    creator: '@therma'
  },
  robots: { index: true, follow: true }
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Pinterest Domain Verification */}
        {process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION && (
          <meta
            name="p:domain_verify"
            content={process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION}
          />
        )}
        
        {/* Google Search Console Verification */}
        {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
          />
        )}
        
        {/* Bing Webmaster Tools Verification */}
        {process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION && (
          <meta
            name="msvalidate.01"
            content={process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION}
          />
        )}
        
        {/* Beacons.ai Integration */}
        {process.env.NEXT_PUBLIC_BEACONS_ID && (
          <script
            async
            src={`https://beacons.ai/embed.js?id=${process.env.NEXT_PUBLIC_BEACONS_ID}`}
          />
        )}
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Therma",
              "url": "https://www.therma.one",
              "logo": "https://www.therma.one/therma-logo.svg",
              "description": "AI habit tracker and guided reflection app that helps you discover patterns and optimize your routine",
              "sameAs": [
                "https://x.com/gettherma",
                "https://www.instagram.com/gettherma/",
                "https://www.pinterest.com/gettherma/",
                "https://www.linkedin.com/company/get-therma/",
                "https://www.youtube.com/@gettherma"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "support@gettherma.ai",
                "contactType": "Customer Support"
              }
            })
          }}
        />
        
        {/* Structured Data - SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Therma",
              "applicationCategory": "HealthApplication",
              "operatingSystem": "iOS, Android",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1"
              },
              "description": "AI habit tracker and guided reflection app that helps you discover patterns in your daily life and optimize your routine for peak energy, clarity, and confidence."
            })
          }}
        />
        
        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Therma",
              "url": "https://www.therma.one",
              "description": "AI habit tracker and guided reflection app that helps you discover patterns and optimize your routine",
              "publisher": {
                "@type": "Organization",
                "name": "Therma"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://www.therma.one/?s={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '833191609467422');
              fbq('track', 'PageView');
            `
          }}
        />
        <noscript>
          <img 
            height="1" 
            width="1" 
            className="hidden"
            src="https://www.facebook.com/tr?id=833191609467422&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body>
        {children}
        <ThermaAssistant />
        <Analytics />
        <SpeedInsights />
        
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
        
        {/* Keyboard Inset Initialization */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Prefer VirtualKeyboard API when present
                const vk = navigator.virtualKeyboard;
                if (vk && typeof vk.addEventListener === 'function') {
                  vk.overlaysContent = true;
                  const set = () => {
                    const h = (vk.boundingRect?.height ?? 0);
                    document.documentElement.style.setProperty('--vk-height', h + 'px');
                  };
                  vk.addEventListener('geometrychange', set);
                  set();
                  return;
                }

                // Fallback: VisualViewport (widely supported)
                if (window.visualViewport) {
                  const set = () => {
                    const vh = window.visualViewport.height;
                    const dh = window.innerHeight;
                    const keyboard = Math.max(0, dh - vh);
                    document.documentElement.style.setProperty('--vk-height', keyboard + 'px');
                  };
                  window.visualViewport.addEventListener('resize', set);
                  window.visualViewport.addEventListener('scroll', set);
                  set();
                }
              })();
            `
          }}
        />
      </body>
    </html>
  );
}