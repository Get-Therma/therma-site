'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ThankYouPage() {
  const [email, setEmail] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get email from localStorage or URL params
    const storedEmail = localStorage.getItem('therma_submitted_email');
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    
    setEmail(storedEmail || emailParam || '');
    
    // Check if this is a duplicate submission
    const duplicateFlag = localStorage.getItem('therma_is_duplicate');
    const duplicateParam = urlParams.get('duplicate');
    setIsDuplicate(duplicateFlag === 'true' || duplicateParam === 'true');
  }, []);

  return (
    <>
      <div className="heroBg" aria-hidden="true"></div>

      <header>
        <div className="brand" style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>Therma</div>
      </header>

      <main>
        <section className="container center">
          <div className="stack">
            <div className="confirmation-icon">✅</div>
            <h1 style={{ fontSize: 'clamp(36px, 7vw, 64px)', lineHeight: '1.1' }}>
              {isDuplicate ? "You're Already In!" : "You're In."}
            </h1>
            <div className="sp-8"></div>
            {isDuplicate ? (
              <>
                <h2 className="muted" style={{ fontSize: 'clamp(18px, 4.5vw, 32px)', lineHeight: '1.25' }}>
                  This email address is already on our waitlist.
                </h2>
                <div className="sp-8"></div>
                <p className="muted" style={{ fontSize: 'clamp(16px, 3.5vw, 20px)', lineHeight: '1.5', opacity: 0.9 }}>
                  You're already signed up! No need to register twice.
                </p>
                <div className="sp-8"></div>
                <p className="muted" style={{ fontSize: 'clamp(14px, 3.2vw, 18px)', lineHeight: '1.5', opacity: 0.8 }}>
                  Next: keep an eye on your inbox—we’ll email when your invite is ready.
                </p>
              </>
            ) : (
              <>
                <h2 className="muted" style={{ fontSize: 'clamp(18px, 4.5vw, 32px)', lineHeight: '1.25' }}>
                  Thanks for joining the Therma waitlist.
                </h2>
                <p className="muted" style={{ fontSize: 'clamp(14px, 3.2vw, 18px)', lineHeight: '1.5', opacity: 0.85, margin: 0 }}>
                  Next: check your inbox. If you don’t see it, check spam/promotions—then whitelist us so you don’t miss your invite.
                </p>
              </>
            )}
            <div className="sp-16"></div>
            <h3 className="muted" style={{ fontSize: 'clamp(16px, 3.8vw, 22px)', lineHeight: '1.3' }}>
              In the meantime, follow us for sneak peeks and launch updates:
            </h3>
            <div className="sp-8"></div>
            <div className="social-links">
              <a href="https://www.instagram.com/gettherma/" className="social-link" target="_blank" rel="noopener noreferrer">
                <span className="social-icon">📷</span>
                Follow on Instagram
              </a>
              <a href="https://x.com/gettherma" className="social-link" target="_blank" rel="noopener noreferrer">
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
          <p className="caption">© 2025 Get Therma Inc. All rights reserved</p>
        </div>
      </footer>
    </>
  );
}
