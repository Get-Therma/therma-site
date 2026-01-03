'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Therma',
            applicationCategory: 'HealthApplication',
            operatingSystem: 'iOS, Android',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD'
            },
            description: 'Join the waitlist for Therma, the mindful habit tracker unlocking patterns in energy and mood. Discover daily clarity with AI-guided reflections and optimize your routine.',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '1'
            },
            featureList: [
              'AI habit tracker',
              'Daily reflections',
              'Pattern recognition',
              'Energy and mood tracking',
              'AI-guided mindfulness'
            ],
            screenshot: 'https://www.therma.one/og-image.png',
            author: {
              '@type': 'Organization',
              name: 'Therma'
            }
          })
        }}
      />
      
      {/* Skip to main content link for screen readers */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Original dark gradient background - optimized with CSS class */}
      <div 
        className="heroBg coming-soon-hero-bg" 
        aria-hidden="true"
      ></div>

      <main id="main-content" className="coming-soon-main" role="main">
        <article className="coming-soon-content" aria-labelledby="therma-logo">
          {/* Centered Logo - Main Focal Point */}
          <header className="coming-soon-logo">
            <h1 id="therma-logo" className="therma-logo-text">Therma</h1>
            <p className="sr-only">AI-Guided Reflections for Daily Clarity - Join the waitlist for the mindful habit tracker that unlocks patterns in energy and mood</p>
          </header>

          {/* Hook Text - Vertically Centered */}
          <div className="coming-soon-hook-container">
            <h2 className="coming-soon-hook-main">
              Discover patterns in your energy.
            </h2>
            <p className="coming-soon-hook-sub">
              <span className="ai-emphasis">AI-guided reflections</span> for lasting clarity—join the waitlist.
            </p>
          </div>

          <div className="sp-40" style={{ margin: '2em 0' }}></div>

          {/* Email Signup Form */}
          <form className="coming-soon-form" onSubmit={handleSubmit} aria-label="Join Therma waitlist">
            <div className="coming-soon-input-wrapper">
              <label htmlFor="email" className="coming-soon-label">
                <span className="sr-only">Enter your email address</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="coming-soon-input"
                aria-label="Enter your email address"
                aria-required="true"
                aria-describedby={status === 'error' ? 'email-error' : undefined}
                autoComplete="email"
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="coming-soon-button"
              aria-label="Join Therma waitlist for AI-guided habit tracking"
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Submitting…' : 'Join Waitlist'}
            </button>
            
            {/* FOMO Line */}
            <p className="coming-soon-fomo">
              Be among the first 1,000 for exclusive beta perks.
            </p>
            
            {status === 'error' && (
              <p className="coming-soon-error" role="alert" id="email-error" aria-live="polite">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </article>
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