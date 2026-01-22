import type { Metadata, Viewport } from 'next';
import './globals.css';
import ThermaAssistant from '../components/ThermaAssistant';

const OG_IMAGE_URL = 'https://www.therma.one/og-image.png?v=4';
const ICONS_VERSION = '5';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.therma.one'),
  title: {
    default: 'Therma – A Quieter Place To Check In',
    template: '%s | Therma'
  },
  description:
    'Clarity begins with feeling safe. A minimalist space to spot patterns, name the noise, and find your anchor. Join the waitlist.',
  keywords: [
    'AI habit tracker', 'habit tracking', 'AI reflections', 'mindfulness app',
    'daily reflections', 'AI companion', 'habit optimization', 'self-reflection tool',
    'mental health app', 'journaling app', 'mood tracker', 'wellness app',
    'personal growth app', 'mindful journaling', 'AI journal', 'emotional wellness',
    'daily check-in app', 'self-care app', 'guided meditation', 'stress management app'
  ],
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
  // Open Graph - Used by Facebook, LinkedIn, Discord, Slack, WhatsApp, Telegram
  openGraph: {
    type: 'website',
    url: 'https://www.therma.one/',
    title: 'Therma – A Quieter Place To Check In',
    description:
      'Clarity begins with feeling safe. A minimalist space to spot patterns, name the noise, and find your anchor. Join the waitlist.',
    locale: 'en_US',
    images: [{
      url: OG_IMAGE_URL,
      width: 1200, 
      height: 630, 
      alt: 'Therma – AI habit tracker and guided reflection app for mindful daily check-ins',
      type: 'image/png'
    }],
    siteName: 'Therma',
    countryName: 'United States'
  },
  // Twitter/X Cards
  twitter: {
    card: 'summary_large_image',
    site: '@gettherma',
    title: 'Therma – A Quieter Place To Check In',
    description:
      'Clarity begins with feeling safe. A minimalist space to spot patterns, name the noise, and find your anchor. Join the waitlist.',
    images: [{
      url: OG_IMAGE_URL,
      alt: 'Therma – AI habit tracker and guided reflection app'
    }],
    creator: '@gettherma'
  },
  // Additional metadata for various platforms
  other: {
    // Pinterest Rich Pins
    'pinterest-rich-pin': 'true',
    // LinkedIn specific
    'linkedin:owner': 'get-therma',
    // Author information for article sharing
    'author': 'Therma',
    // App links for mobile deep linking
    'al:ios:app_name': 'Therma',
    'al:android:app_name': 'Therma',
    // Telegram specific
    'telegram:channel': '@gettherma',
    // Article metadata for content sharing
    'article:publisher': 'https://www.facebook.com/gettherma',
    'article:author': 'Therma'
  },
  robots: { index: true, follow: true },
  // App category for better discovery
  category: 'Health & Wellness',
  // Creator attribution
  creator: 'Therma',
  publisher: 'Therma'
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
        
        {/* ===== SOCIAL MEDIA PLATFORM OPTIMIZATIONS ===== */}
        
        {/* Discord Embed Color */}
        <meta name="theme-color" content="#8fbc8f" />
        
        {/* Pinterest Rich Pins & Verification */}
        <meta name="pinterest-rich-pin" content="true" />
        <meta name="p:domain_verify" content="2a46ef06897517c2e71581d857c2d3b6" />
        
        {/* Instagram/Facebook App ID for better sharing */}
        <meta property="fb:app_id" content="833191609467422" />
        <meta property="fb:pages" content="gettherma" />
        
        {/* LinkedIn Article Tags */}
        <meta name="linkedin:card" content="summary_large_image" />
        
        {/* WhatsApp & Telegram Preview Optimization */}
        <meta property="og:image:secure_url" content="https://www.therma.one/og-image.png?v=4" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Slack Unfurl Optimization */}
        <meta name="slack-app-id" content="therma" />
        
        {/* Additional Twitter/X Tags */}
        <meta name="twitter:domain" content="therma.one" />
        <meta name="twitter:url" content="https://www.therma.one" />
        
        {/* Apple Smart Banner (for future iOS app) */}
        <meta name="apple-itunes-app" content="app-id=therma, app-argument=https://www.therma.one" />
        
        {/* Google Play Store (for future Android app) */}
        <meta name="google-play-app" content="app-id=com.gettherma.app" />
        
        {/* ===== SEARCH ENGINE VERIFICATIONS ===== */}
        
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
        
        {/* Yandex Verification (for Russian market) */}
        {process.env.NEXT_PUBLIC_YANDEX_VERIFICATION && (
          <meta
            name="yandex-verification"
            content={process.env.NEXT_PUBLIC_YANDEX_VERIFICATION}
          />
        )}
        
        {/* ===== THIRD-PARTY INTEGRATIONS ===== */}
        
        {/* Beacons.ai Integration */}
        {process.env.NEXT_PUBLIC_BEACONS_ID && (
          <script
            async
            src={`https://beacons.ai/embed.js?id=${process.env.NEXT_PUBLIC_BEACONS_ID}`}
          />
        )}
        
        {/* Structured Data - Organization (Enhanced for Social Media) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Therma",
              "alternateName": ["Get Therma", "Therma App", "gettherma"],
              "url": "https://www.therma.one",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.therma.one/therma-logo.svg",
                "width": 512,
                "height": 512
              },
              "image": "https://www.therma.one/og-image.png",
              "description": "AI habit tracker and guided reflection app that helps you discover patterns and optimize your routine",
              "slogan": "A quieter way to check in.",
              "foundingDate": "2024",
              "sameAs": [
                "https://x.com/gettherma",
                "https://twitter.com/gettherma",
                "https://www.instagram.com/gettherma/",
                "https://www.pinterest.com/gettherma/",
                "https://www.linkedin.com/company/get-therma/",
                "https://www.youtube.com/@gettherma",
                "https://www.facebook.com/gettherma",
                "https://www.tiktok.com/@gettherma",
                "https://www.threads.net/@gettherma"
              ],
              "contactPoint": [{
                "@type": "ContactPoint",
                "email": "support@gettherma.ai",
                "contactType": "Customer Support",
                "availableLanguage": ["English"]
              }],
              "brand": {
                "@type": "Brand",
                "name": "Therma",
                "slogan": "A quieter way to check in."
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
                "priceCurrency": "USD",
                "availability": "https://schema.org/PreOrder"
              },
              "description": "AI habit tracker and guided reflection app that helps you discover patterns in your daily life and optimize your routine for peak energy, clarity, and confidence.",
              "url": "https://www.therma.one"
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