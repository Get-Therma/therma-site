import type { Metadata, Viewport } from 'next';
import './globals.css';
import dynamic from 'next/dynamic';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Lazy load non-critical components for better initial page load
const ThermaAssistant = dynamic(() => import('../components/ThermaAssistant'), {
  ssr: false, // Client-side only since it's interactive
  loading: () => null, // No loading indicator needed
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.therma.one'),
  title: {
    default: 'Therma: AI Habit Tracker for Energy & Clarity',
    template: '%s · Therma'
  },
  description:
    'Join the waitlist for Therma – AI-guided reflections to optimize your habits for better energy, clarity, and confidence.',
  keywords: [
    'AI habit tracker',
    'mindful journaling',
    'daily reflections'
  ],
  authors: [{ name: 'Therma' }],
  creator: 'Therma',
  publisher: 'Therma',
  alternates: { canonical: '/' },
  category: 'Health & Wellness',
  classification: 'Mobile Application',
  icons: {
    icon: [
      { url: '/favicon.svg?v=2', type: 'image/svg+xml' },
      { url: '/therma-logo-16.svg?v=2', sizes: '16x16', type: 'image/svg+xml' },
      { url: '/therma-logo-24.svg?v=2', sizes: '24x24', type: 'image/svg+xml' },
      { url: '/therma-logo-32.svg?v=2', sizes: '32x32', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/therma-logo-192x192.png', sizes: '192x192', type: 'image/png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/therma-logo.svg?v=2', color: '#2D5016' }
    ]
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    url: 'https://www.therma.one/',
    title: 'Therma App',
    description:
      'Unlock your patterns with Therma.',
    images: [{ 
      url: 'https://www.therma.one/og-image.png', 
      width: 1200, 
      height: 630, 
      alt: 'Therma App' 
    }],
    siteName: 'Therma',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Therma: AI-Guided Reflections for Daily Clarity',
    description:
      'Join the waitlist for Therma, the mindful habit tracker unlocking patterns in energy and mood.',
    images: ['https://www.therma.one/og-image.png'],
    creator: '@therma',
    site: '@therma'
  },
  robots: { 
    index: true, 
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },
  verification: {
    // Add Google Search Console verification when available
    // google: 'your-verification-code',
  }
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
        
        {/* Performance: DNS prefetch and preconnect */}
        <link rel="dns-prefetch" href="https://www.facebook.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://cdn.beehiiv.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload premium fonts for better performance */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;700;900&display=swap"
          as="style"
        />
        
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/PPPangaia-Medium-BF654c530cc86d5.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
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
        
        {/* Beehiv Analytics Script - Lazy loaded for performance */}
        {process.env.BEEHIIV_PUBLICATION_ID && (
          <script
            defer
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  // Defer loading until page is interactive
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', loadBeehiiv);
                  } else {
                    setTimeout(loadBeehiiv, 1000);
                  }
                  function loadBeehiiv() {
                    var script = document.createElement('script');
                    script.src = 'https://cdn.beehiiv.com/scripts/analytics.js';
                    script.async = true;
                    script.onload = function() {
                      if (window.beehiivAnalytics) {
                        window.beehiivAnalytics.init('${process.env.BEEHIIV_PUBLICATION_ID}');
                      }
                    };
                    document.head.appendChild(script);
                  }
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