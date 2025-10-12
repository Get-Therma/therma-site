'use client';

import { useEffect, useState } from 'react';
import '../globals.css';
import { useRouter } from 'next/navigation';

export default function ThankYouPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

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
            <div className="confirmation-icon">✅</div>
            <h1>You're In.</h1>
            <div className="sp-8"></div>
            <p className="muted thank-you-text">
              Thanks for joining the Therma waitlist.
              <br/>
              We'll be in touch soon with your invite to experience a smarter way to control your climate.
            </p>
            <div className="sp-16"></div>
            <p className="muted thank-you-text">
              In the meantime, follow us for sneak peeks and launch updates:
            </p>
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
              <a href="/terms">Terms of Use</a>
            </p>
          <div className="sp-16"></div>
          <p className="caption">© 2025 Get Therma Inc. All rights reserved</p>
        </div>
      </footer>
    </>
  );
}
