'use client';

import { useEffect, useState } from 'react';
import '../globals.css';

export default function ThankYouPage() {
  const [email, setEmail] = useState('');

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
        <div className="brand">Therma</div>
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
            <a href="/" className="btn">
              Back to Home
            </a>
          </div>
        </section>
      </main>

      <footer>
        <div className="footerWrap">
          <div className="footerBrand">Therma</div>
          <p className="caption">Therma helps you make space for yourself</p>
          <div className="sp-16"></div>
          <p className="footerLinks caption">
            <a href="contact.html">Contact Us</a> · 
            <a href="faq.html">FAQ</a> · 
            <a href="#">Privacy</a> · 
            <a href="#">Terms of Use</a>
          </p>
          <div className="sp-16"></div>
          <p className="caption">2025. All rights reserved</p>
        </div>
      </footer>
    </>
  );
}
