'use client';

import { useEffect, useState } from 'react';
import '../globals.css';
import { useRouter } from 'next/navigation';

export default function ThankYouPage() {
  const [email, setEmail] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Mobile detection and event listeners
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth <= 768);
      
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Mouse tracking and time-based animations (optimized for mobile)
  useEffect(() => {
    let animationFrame: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        setMousePosition({
          x: (touch.clientX / window.innerWidth) * 100,
          y: (touch.clientY / window.innerHeight) * 100
        });
      }
    };

    const updateTime = () => {
      setTime(Date.now() * 0.001);
      animationFrame = requestAnimationFrame(updateTime);
    };

    // Only add event listeners on client side
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      animationFrame = requestAnimationFrame(updateTime);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        cancelAnimationFrame(animationFrame);
      }
    };
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
      {/* Ultra-Interactive Background Bubbles - Mobile Optimized */}
      <div 
        className="parallax-bg parallax-layer-1" 
        style={{
          transform: `
            translate(${mousePosition.x * (isMobile ? 0.05 : 0.08) + Math.sin(time * 0.3) * (isMobile ? 6 : 10)}px, ${mousePosition.y * (isMobile ? 0.03 : 0.06) + Math.cos(time * 0.2) * (isMobile ? 5 : 8)}px) 
            rotate(${Math.sin(time * 0.2) * (isMobile ? 1.5 : 2)}deg) 
            scale(${1 + Math.sin(time * 0.4) * (isMobile ? 0.03 : 0.05)})
          `,
          background: `
            radial-gradient(${40 + Math.sin(time * 0.6) * (isMobile ? 15 : 20)}% ${60 + Math.cos(time * 0.4) * (isMobile ? 12 : 15)}% at 
            ${10 + mousePosition.x * (isMobile ? 0.12 : 0.15) + Math.sin(time * 0.3) * (isMobile ? 4 : 5)}% 
            ${10 + mousePosition.y * (isMobile ? 0.1 : 0.12) + Math.cos(time * 0.5) * (isMobile ? 4 : 5)}%, 
            rgba(255, 89, 48, ${0.15 + Math.sin(time * 0.7) * 0.05}), transparent 60%),
            radial-gradient(${30 + Math.cos(time * 0.8) * (isMobile ? 12 : 15)}% ${50 + Math.sin(time * 0.6) * (isMobile ? 8 : 10)}% at 
            ${70 + mousePosition.x * (isMobile ? 0.08 : 0.1)}% 
            ${30 + mousePosition.y * (isMobile ? 0.06 : 0.08)}%, 
            rgba(255, 89, 48, ${0.08 + Math.cos(time * 0.9) * 0.03}), transparent 70%)
          `,
          filter: `hue-rotate(${Math.sin(time * 0.1) * (isMobile ? 5 : 10)}deg) saturate(${1.2 + Math.sin(time * 0.3) * (isMobile ? 0.2 : 0.3)})`
        }}
      ></div>

      {/* Main Background - Ultra-Interactive with Mouse */}
      <div 
        className="heroBg" 
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          background: `
            radial-gradient(${75 + Math.sin(time * 0.3) * 25 + mousePosition.x * 0.15}% ${95 + Math.cos(time * 0.4) * 20 + mousePosition.y * 0.12}% at 
            ${15 + Math.sin(time * 0.2) * 8 + mousePosition.x * 0.1}% ${15 + Math.cos(time * 0.25) * 6 + mousePosition.y * 0.08}%, 
            rgba(255, 89, 48, ${0.55 + Math.sin(time * 0.5) * 0.12 + mousePosition.x * 0.0008}), transparent 50%),
            radial-gradient(${65 + Math.cos(time * 0.35) * 22 + mousePosition.x * 0.12}% ${85 + Math.sin(time * 0.3) * 15 + mousePosition.y * 0.1}% at 
            ${75 + Math.cos(time * 0.15) * 6 + mousePosition.x * 0.08}% ${25 + Math.sin(time * 0.2) * 7 + mousePosition.y * 0.06}%, 
            rgba(252, 178, 0, ${0.45 + Math.cos(time * 0.45) * 0.1 + mousePosition.y * 0.0006}), transparent 50%),
            radial-gradient(${75 + Math.sin(time * 0.4) * 30 + mousePosition.x * 0.18}% ${105 + Math.cos(time * 0.35) * 22 + mousePosition.y * 0.15}% at 
            ${25 + Math.sin(time * 0.18) * 10 + mousePosition.x * 0.1}% ${65 + Math.cos(time * 0.22) * 8 + mousePosition.y * 0.08}%, 
            rgba(131, 6, 152, ${0.4 + Math.sin(time * 0.55) * 0.08 + mousePosition.x * 0.0004}), transparent 60%),
            radial-gradient(${65 + Math.cos(time * 0.38) * 25 + mousePosition.x * 0.15}% ${95 + Math.sin(time * 0.32) * 18 + mousePosition.y * 0.12}% at 
            ${65 + Math.cos(time * 0.18) * 8 + mousePosition.x * 0.08}% ${75 + Math.sin(time * 0.25) * 9 + mousePosition.y * 0.06}%, 
            rgba(124, 162, 253, ${0.45 + Math.cos(time * 0.48) * 0.1 + mousePosition.y * 0.0005}), transparent 60%),
            radial-gradient(${55 + Math.sin(time * 0.42) * 18 + mousePosition.x * 0.1}% ${75 + Math.cos(time * 0.36) * 15 + mousePosition.y * 0.08}% at 
            ${45 + Math.sin(time * 0.15) * 6 + mousePosition.x * 0.06}% ${45 + Math.cos(time * 0.28) * 6 + mousePosition.y * 0.05}%, 
            rgba(172, 223, 127, ${0.3 + Math.sin(time * 0.52) * 0.06 + (mousePosition.x + mousePosition.y) * 0.0002}), transparent 70%),
            linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)
          `,
          filter: `saturate(${1.15 + Math.sin(time * 0.4) * 0.2 + mousePosition.x * 0.0008}) brightness(${1.2 + Math.cos(time * 0.3) * 0.12 + mousePosition.y * 0.0005}) hue-rotate(${(mousePosition.x + mousePosition.y - 100) * 0.15}deg)`,
          animation: 'breathe 6s ease-in-out infinite',
          transform: 'translateZ(0)',
          willChange: 'transform, filter'
        }}
      ></div>

      <header>
        <div className="brand" style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>Therma</div>
      </header>

      <div className="header-spacer"></div>

      <main className="safe-py">
        <section className="container center safe-px">
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
