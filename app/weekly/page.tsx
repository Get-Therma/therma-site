'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initUtmTracking, getUtmParamsForSubmission } from '../../lib/utm-tracking';

export default function WeeklyPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const router = useRouter();

  // Initialize UTM tracking for Beacons attribution
  useEffect(() => {
    initUtmTracking();
  }, []);

  // Update page metadata
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Therma Weekly - Science-Backed Rituals | Therma';
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Get early access to Therma Weekly—a slow magazine with science-backed rituals, real-world experiments, and thoughtful insights. Try a sample ritual today.');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = 'Get early access to Therma Weekly—a slow magazine with science-backed rituals, real-world experiments, and thoughtful insights. Try a sample ritual today.';
        document.head.appendChild(meta);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setStatus('');

    try {
      // Get UTM parameters using utility function
      const utmParams = typeof window !== 'undefined' ? getUtmParamsForSubmission() : {};
      
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          source: 'Weekly Page',
          utm_source: utmParams.utm_source || 'weekly',
          utm_medium: utmParams.utm_medium || 'website',
          utm_campaign: utmParams.utm_campaign || 'weekly-signup',
          ...utmParams // Include any other UTM params
        })
      });

      // Clone response to avoid consuming the body
      const responseClone = response.clone();
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        // Use cloned response to read text since original body is consumed
        const text = await responseClone.text();
        setIsSubmitting(false);
        setStatus('error');
        return; // Stop here if we can't parse
      }

      // Handle 409 status (duplicate) - MUST return early to stop processing
      if (response.status === 409) {
        // Set duplicate status and stop immediately
        setStatus('duplicate');
        setIsSubmitting(false); // Re-enable form immediately
        localStorage.setItem('therma_submitted_email', email);
        localStorage.setItem('therma_is_duplicate', 'true');
        
        // Redirect immediately to already-registered page
        // Use window.location for immediate redirect
        window.location.href = '/already-registered';
        
        return; // CRITICAL: Stop here, don't continue processing
      }

      if (!response.ok) {
        // Also check if the error message indicates duplicate
        if (result.message && (
          result.message.toLowerCase().includes('already') || 
          result.message.toLowerCase().includes('duplicate') ||
          result.message.toLowerCase().includes('exists')
        )) {
          setStatus('duplicate');
          localStorage.setItem('therma_submitted_email', email);
          localStorage.setItem('therma_is_duplicate', 'true');
          // Redirect immediately
          window.location.href = '/already-registered';
          return;
        }
        throw new Error(result.error || result.message || `Server error: ${response.status}`);
      }
      
      // Only process success if status is 200/201 (not 409)
      if (response.status === 200 || response.status === 201) {
        // Clear duplicate flag for successful new subscriptions
        localStorage.removeItem('therma_is_duplicate');
        
        // Store email for thank you page
        localStorage.setItem('therma_submitted_email', email);
        
        setStatus('success');
        
        // Redirect to thank you page after short delay
        setTimeout(() => {
          router.push('/thank-you');
        }, 1500);
      } else {
        // Unexpected success status
        setStatus('error');
        setIsSubmitting(false);
      }
      
    } catch (err: any) {
      // Check if error message indicates duplicate
      const errorMsg = err?.message || '';
      if (errorMsg.toLowerCase().includes('already') || 
          errorMsg.toLowerCase().includes('duplicate') ||
          errorMsg.toLowerCase().includes('exists')) {
        setStatus('duplicate');
        localStorage.setItem('therma_submitted_email', email);
        localStorage.setItem('therma_is_duplicate', 'true');
        setTimeout(() => {
          window.location.href = '/already-registered';
        }, 500);
      } else {
        setStatus('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="stack" style={{ textAlign: 'center', maxWidth: '700px' }}>
            <h1>Therma Weekly</h1>
            <div className="sp-12"></div>
            <h2 className="muted" style={{ fontSize: '32px', lineHeight: '1.3' }}>
              Science-backed rituals, real-world experiments, and thoughtful insights
            </h2>
            <div className="sp-24"></div>
            
            {/* Sample Ritual */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '32px',
              textAlign: 'left'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧘</div>
              <h3 style={{ fontSize: '24px', marginBottom: '12px', fontWeight: 600 }}>
                Sample Ritual: The 2-Minute Check-In
              </h3>
              <p style={{ fontSize: '16px', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '20px' }}>
                Start your day with intention. Take two minutes to pause, breathe, and check in with yourself. 
                Notice how you're feeling—without judgment. This simple practice helps you tune into your patterns 
                and build self-awareness over time.
              </p>
              <div style={{
                background: 'rgba(255, 89, 48, 0.1)',
                borderLeft: '3px solid rgba(255, 89, 48, 0.5)',
                padding: '16px',
                borderRadius: '8px',
                marginTop: '20px'
              }}>
                <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', fontStyle: 'italic' }}>
                  <strong>Try it:</strong> Inhale for 4 counts, hold for 4, exhale for 6. Repeat 5 times. 
                  Then ask yourself: "How am I feeling right now?"
                </p>
              </div>
            </div>

            <div className="sp-16"></div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: 600 }}>
                Get Early Access
              </h3>
              <p style={{ fontSize: '16px', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '24px' }}>
                Join our waitlist to be the first to receive Therma Weekly when it launches. 
                You'll get weekly rituals, experiments, and insights delivered to your inbox.
              </p>
              
              <form onSubmit={handleSubmit} className="stack" style={{ gap: '12px' }}>
                <div className="pillInput">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    style={{ width: '100%' }}
                  />
                </div>
                <button 
                  className="btn" 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{ width: '100%' }}
                >
                  {isSubmitting ? 'Submitting…' : 'Join Waitlist'}
                </button>
                {status === 'success' && (
                  <p style={{ color: '#4ade80', fontSize: '14px', marginTop: '8px' }}>
                    ✅ Success! Redirecting...
                  </p>
                )}
                {status === 'duplicate' && (
                  <p style={{ color: '#fbbf24', fontSize: '14px', marginTop: '8px' }}>
                    ⚠️ Redirecting...
                  </p>
                )}
                {status === 'error' && (
                  <p style={{ color: '#f87171', fontSize: '14px', marginTop: '8px' }}>
                    ❌ Something went wrong. Please try again.
                  </p>
                )}
              </form>
            </div>

            <div className="sp-24"></div>
            <div>
              <button 
                className="btn-secondary" 
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
