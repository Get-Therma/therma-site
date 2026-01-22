'use client';

import { useEffect, useState } from 'react';
import '../globals.css';
import { useRouter } from 'next/navigation';

export default function AlreadyRegisteredPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  // Update page metadata
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Already Registered · Therma';
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'This email address is already on the Therma waitlist. No need to sign up twice!');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = 'This email address is already on the Therma waitlist. No need to sign up twice!';
        document.head.appendChild(meta);
      }
      // Add noindex meta tag
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (!robotsMeta) {
        const robots = document.createElement('meta');
        robots.name = 'robots';
        robots.content = 'noindex, follow';
        document.head.appendChild(robots);
      }
    }
  }, []);

  useEffect(() => {
    // Get email from localStorage or URL params
    const storedEmail = localStorage.getItem('therma_submitted_email');
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    
    setEmail(storedEmail || emailParam || '');
  }, []);

  return (
    <>
      <div className="heroBg" aria-hidden="true"></div>

      <header>
        <div className="brand" style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>Therma</div>
      </header>

      <div className="header-spacer"></div>

      <main>
        <section className="container center">
          <div className="stack">
            <div className="confirmation-icon" style={{ fontSize: '64px' }}>✅</div>
            <h1 style={{ fontSize: '64px', lineHeight: '1.1' }}>
              You're Already In!
            </h1>
            <div className="sp-8"></div>
            <h2 className="muted" style={{ fontSize: '40px', lineHeight: '1.2' }}>
              This email address is already on our waitlist.
            </h2>
            <div className="sp-8"></div>
            <p className="muted" style={{ fontSize: '24px', lineHeight: '1.4', opacity: 0.9 }}>
              {email && (
                <>
                  <strong>{email}</strong> is already registered.
                  <br />
                  <br />
                </>
              )}
              No need to sign up twice—you're all set.
            </p>
            <div className="sp-8"></div>
            <p className="muted" style={{ fontSize: '20px', lineHeight: '1.4', opacity: 0.8 }}>
              We'll be in touch soon with your invite to start discovering patterns and optimizing your routine.
            </p>
            <div className="sp-16"></div>
            <h3 className="muted" style={{ fontSize: '28px', lineHeight: '1.3' }}>
              In the meantime, follow us for sneak peeks and launch updates:
            </h3>
            <div className="sp-8"></div>
            <div className="social-links" style={{ fontSize: '20px' }}>
              <a href="https://www.instagram.com/gettherma/" className="social-link" target="_blank" rel="noopener noreferrer" style={{ fontSize: '20px' }}>
                <span className="social-icon">📷</span>
                Follow on Instagram
              </a>
              <a href="https://x.com/gettherma" className="social-link" target="_blank" rel="noopener noreferrer" style={{ fontSize: '20px' }}>
                <span className="social-icon">🐦</span>
                Join us on X
              </a>
            </div>
            <div className="sp-16"></div>
            <button className="btn" onClick={() => router.push('/')}>
              Back to Home
            </button>
          </div>
        </section>
      </main>

      <footer>
        <div className="footerWrap">
          <div className="footerBrand">Therma</div>
          <p className="caption">Therma helps you make space for yourself</p>
          <div className="sp-16"></div>
            <p className="footerLinks caption">
              <a href="/contact">Contact Us</a> · 
              <a href="/faq">FAQ</a> · 
              <a href="/privacy">Privacy</a> · 
              <a href="/beta-terms">Terms of Use</a>
            </p>
          <div className="sp-16"></div>
          <p className="caption">© {new Date().getFullYear()} Get Therma Inc. All rights reserved</p>
        </div>
      </footer>
    </>
  );
}

