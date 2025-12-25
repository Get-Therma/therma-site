'use client';

import { useEffect, useState } from 'react';
import '../globals.css';
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

      <div className="header-spacer"></div>

      <main>
        <section className="container center">
          <div className="stack">
            <div className="confirmation-icon">✅</div>
            <h1 style={{ fontSize: '64px', lineHeight: '1.1' }}>
              {isDuplicate ? "You're Already In!" : "You're In."}
            </h1>
            <div className="sp-8"></div>
            {isDuplicate ? (
              <>
                <h2 className="muted" style={{ fontSize: '40px', lineHeight: '1.2' }}>
                  This email address is already on our waitlist.
                </h2>
                <div className="sp-8"></div>
                <p className="muted" style={{ fontSize: '24px', lineHeight: '1.4', opacity: 0.9 }}>
                  You're already signed up! No need to register twice.
                </p>
                <div className="sp-8"></div>
                <p className="muted" style={{ fontSize: '20px', lineHeight: '1.4', opacity: 0.8 }}>
                  We'll be in touch soon with your invite to experience a smarter way to control your climate. 🎉
                </p>
              </>
            ) : (
              <h2 className="muted" style={{ fontSize: '40px', lineHeight: '1.2' }}>
                Thanks for joining the Therma waitlist.
                <br/>
                We'll be in touch soon with your invite to experience a smarter way to control your climate.
              </h2>
            )}
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
              <a href="/terms">Terms of Use</a>
            </p>
          <div className="sp-16"></div>
          <p className="caption">© 2025 Get Therma Inc. All rights reserved</p>
        </div>
      </footer>
    </>
  );
}
