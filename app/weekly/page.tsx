'use client';

import { useRouter } from 'next/navigation';
import type { Metadata } from 'next';

export default function WeeklyComingSoonPage() {
  const router = useRouter();

  return (
    <>
      <div 
        className="heroBg" 
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          background: `
            radial-gradient(60% 80% at 20% 20%, rgba(255, 89, 48, 0.8), rgba(255, 89, 48, 0.3) 30%, transparent 60%),
            radial-gradient(50% 70% at 80% 30%, rgba(252, 178, 0, 0.7), rgba(252, 178, 0, 0.2) 30%, transparent 60%),
            radial-gradient(60% 90% at 30% 70%, rgba(131, 6, 152, 0.6), rgba(131, 6, 152, 0.2) 30%, transparent 60%),
            radial-gradient(50% 80% at 70% 80%, rgba(124, 162, 253, 0.7), rgba(124, 162, 253, 0.2) 30%, transparent 60%),
            radial-gradient(40% 60% at 50% 50%, rgba(172, 223, 127, 0.5), rgba(172, 223, 127, 0.1) 30%, transparent 60%),
            linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)
          `,
          filter: 'saturate(2.0) brightness(1.3)',
          animation: 'breathe 6s ease-in-out infinite',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      ></div>

      <header>
        <div className="brand" style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>Therma</div>
      </header>

      <div className="header-spacer"></div>

      <main>
        <section className="container center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="stack" style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h1>Therma Weekly</h1>
            <div className="sp-16"></div>
            <h2 className="muted">
              Coming Soon
            </h2>
            <div className="sp-24"></div>
            <p style={{ fontSize: '18px', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.7)' }}>
              We're crafting something special—a slow magazine with science-backed rituals, 
              real-world experiments, and thoughtful insights from the Therma community.
            </p>
            <div className="sp-32"></div>
            <div>
              <button 
                className="btn" 
                onClick={() => router.push('/')}
                style={{ cursor: 'pointer' }}
              >
                Back to Home
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footerWrap">
          <div className="footerBrand">Therma</div>
          <p className="caption">Therma helps you make space for yourself</p>
          <div className="sp-16"></div>
          <p className="footerLinks caption">
            <a href="/">Home</a> · 
            <a href="/contact">Contact Us</a> · 
            <a href="/faq">FAQ</a> · 
            <a href="/privacy">Privacy</a> · 
            <a href="/beta-terms">Terms of Use</a>
          </p>
          <div className="sp-16"></div>
          <p className="caption">2025. All rights reserved</p>
        </div>
      </footer>
    </>
  );
}
