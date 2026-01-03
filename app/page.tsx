'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setStatus('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          source: 'Website',
          utm_source: new URL(window.location.href).searchParams.get('utm_source') || document.referrer,
          utm_medium: new URL(window.location.href).searchParams.get('utm_medium') || 'website',
          utm_campaign: new URL(window.location.href).searchParams.get('utm_campaign') || 'waitlist'
        })
      });

      const responseClone = response.clone();
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        const text = await responseClone.text();
        setIsSubmitting(false);
        setStatus('error');
        return;
      }

      if (response.status === 409) {
        setStatus('duplicate');
        setIsSubmitting(false);
        localStorage.setItem('therma_submitted_email', email);
        localStorage.setItem('therma_is_duplicate', 'true');
        window.location.href = '/already-registered';
        return;
      }

      if (!response.ok) {
        if (result.message && (
          result.message.toLowerCase().includes('already') || 
          result.message.toLowerCase().includes('duplicate') ||
          result.message.toLowerCase().includes('exists')
        )) {
          setStatus('duplicate');
          localStorage.setItem('therma_submitted_email', email);
          localStorage.setItem('therma_is_duplicate', 'true');
          window.location.href = '/already-registered';
          return;
        }
        throw new Error(result.error || result.message || `Server error: ${response.status}`);
      }
      
      if (response.status === 200 || response.status === 201) {
        localStorage.removeItem('therma_is_duplicate');
        localStorage.setItem('therma_submitted_email', email);
        router.push('/thank-you');
      } else {
        setStatus('error');
        setIsSubmitting(false);
      }
      
    } catch (err: any) {
      const errorMsg = err?.message || '';
      if (errorMsg.toLowerCase().includes('already') || 
          errorMsg.toLowerCase().includes('duplicate') ||
          errorMsg.toLowerCase().includes('exists')) {
        setStatus('duplicate');
        localStorage.setItem('therma_submitted_email', email);
        localStorage.setItem('therma_is_duplicate', 'true');
        setTimeout(() => {
          router.push('/already-registered');
        }, 2000);
      } else {
        setStatus('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Original dark gradient background */}
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

      <main className="coming-soon-main">
        <section className="coming-soon-content">
          {/* Centered Logo */}
          <div className="coming-soon-logo">
            <Image
              src="/therma-logo.svg"
              alt="Therma Logo"
              width={120}
              height={120}
              priority
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '120px',
                maxHeight: '120px',
              }}
            />
          </div>

          <div className="sp-48"></div>

          {/* Bold Hook */}
          <h1 className="coming-soon-hook">
            Unlock daily clarity with AI-guided reflections. Join the waitlist for early access to Therma.
          </h1>

          <div className="sp-40"></div>

          {/* Email Signup Form */}
          <form className="coming-soon-form" onSubmit={handleSubmit}>
            <div className="coming-soon-input-wrapper">
              <label htmlFor="email" className="sr-only">Enter your email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="coming-soon-input"
                aria-label="Enter your email"
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="coming-soon-button"
            >
              {isSubmitting ? 'Submitting…' : 'Join Waitlist'}
            </button>
            {status === 'error' && (
              <p className="coming-soon-error" role="alert">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </section>
      </main>

      {/* Preserved Footer - exactly as before */}
      <footer>
        <div className="footerWrap">
          <div className="footerBrand">Therma</div>
          <p className="caption">Therma helps you make space for yourself</p>
          <div className="sp-16"></div>
            <p className="footerLinks caption">
              <a href="/contact">Contact Us</a> · 
              <a href="/faq">FAQ</a> · 
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