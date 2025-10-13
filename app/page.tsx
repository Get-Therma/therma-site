'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [time, setTime] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Mobile detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mouse tracking and time updates
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateTime = () => {
      setTime(Date.now() * 0.001);
      requestAnimationFrame(updateTime);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        setMousePosition({
          x: (touch.clientX / window.innerWidth) * 100,
          y: (touch.clientY / window.innerHeight) * 100,
        });
      }
    };

    updateTime();
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

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
          source: 'Landing hero',
          utm_source: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_source') : undefined,
          utm_medium: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_medium') : undefined,
          utm_campaign: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') : undefined
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Waitlist submission successful:', result);
      localStorage.setItem('therma_submitted_email', email);
      setStatus('success');
      router.push('/thank-you');
    } catch (err) {
      console.error('Waitlist submission failed:', err);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Ultra-Interactive Background Bubbles - Mobile Optimized */}
      <div 
        className="parallax-bg parallax-layer-1" 
        style={{
          transform: `
            translate(${mousePosition.x * (isMobile ? 0.08 : 0.15) + Math.sin(time * 0.3) * (isMobile ? 8 : 12)}px, ${mousePosition.y * (isMobile ? 0.06 : 0.12) + Math.cos(time * 0.2) * (isMobile ? 6 : 10)}px) 
            scale(${1 + (mousePosition.x - 50) * (isMobile ? 0.001 : 0.002) + Math.sin(time * 0.4) * (isMobile ? 0.03 : 0.05)})
            rotate(${Math.sin(time * 0.2) * (isMobile ? 2 : 3) + (mousePosition.x - 50) * (isMobile ? 0.1 : 0.2)}deg)
          `,
          background: `
            radial-gradient(${70 + Math.sin(time * 0.4) * (isMobile ? 20 : 25) + mousePosition.x * (isMobile ? 0.15 : 0.2)}% ${90 + Math.cos(time * 0.3) * (isMobile ? 15 : 20) + mousePosition.y * (isMobile ? 0.12 : 0.15)}% at 
            ${10 + mousePosition.x * (isMobile ? 0.2 : 0.25) + Math.sin(time * 0.3) * (isMobile ? 8 : 12)}% 
            ${10 + mousePosition.y * (isMobile ? 0.15 : 0.2) + Math.cos(time * 0.2) * (isMobile ? 6 : 10)}%, 
            rgba(255, 89, 48, ${0.25 + Math.sin(time * 0.3) * 0.08 + mousePosition.x * 0.001}), transparent 60%),
            radial-gradient(${55 + Math.cos(time * 0.5) * (isMobile ? 15 : 20) + mousePosition.x * (isMobile ? 0.12 : 0.15)}% ${75 + Math.sin(time * 0.4) * (isMobile ? 12 : 15) + mousePosition.y * (isMobile ? 0.1 : 0.12)}% at 
            ${75 + mousePosition.x * (isMobile ? 0.15 : 0.18)}% 
            ${25 + mousePosition.y * (isMobile ? 0.12 : 0.15)}%, 
            rgba(255, 89, 48, ${0.15 + Math.cos(time * 0.4) * 0.05 + mousePosition.y * 0.0008}), transparent 70%),
            radial-gradient(${40 + Math.sin(time * 0.6) * (isMobile ? 12 : 15) + mousePosition.x * (isMobile ? 0.08 : 0.1)}% ${60 + Math.cos(time * 0.5) * (isMobile ? 10 : 12) + mousePosition.y * (isMobile ? 0.06 : 0.08)}% at 
            ${50 + mousePosition.x * (isMobile ? 0.1 : 0.12)}% 
            ${60 + mousePosition.y * (isMobile ? 0.08 : 0.1)}%, 
            rgba(255, 89, 48, ${0.08 + Math.sin(time * 0.5) * 0.03 + (mousePosition.x + mousePosition.y) * 0.0003}), transparent 80%)
          `,
          filter: `saturate(${1.3 + Math.sin(time * 0.2) * 0.2 + mousePosition.x * 0.002}) hue-rotate(${(mousePosition.x - 50) * (isMobile ? 0.4 : 0.8)}deg) brightness(${1.1 + mousePosition.y * 0.0005})`
        }}
      ></div>
      
      <div 
        className="parallax-bg parallax-layer-2" 
        style={{
          transform: `
            translate(${mousePosition.x * (isMobile ? -0.06 : -0.12) + Math.cos(time * 0.25) * (isMobile ? 8 : 15)}px, ${mousePosition.y * (isMobile ? 0.05 : 0.1) + Math.sin(time * 0.3) * (isMobile ? 7 : 12)}px) 
            scale(${1 + (mousePosition.y - 50) * (isMobile ? 0.001 : 0.002) + Math.cos(time * 0.5) * (isMobile ? 0.04 : 0.06)})
            rotate(${Math.cos(time * 0.3) * (isMobile ? 3 : 4) + (mousePosition.y - 50) * (isMobile ? 0.1 : 0.2)}deg)
          `,
          background: `
            radial-gradient(${80 + Math.sin(time * 0.5) * (isMobile ? 25 : 30) + mousePosition.x * (isMobile ? 0.15 : 0.18)}% ${95 + Math.cos(time * 0.4) * (isMobile ? 20 : 25) + mousePosition.y * (isMobile ? 0.12 : 0.15)}% at 
            ${80 - mousePosition.x * (isMobile ? 0.15 : 0.18) + Math.sin(time * 0.4) * (isMobile ? 10 : 15)}% 
            ${20 + mousePosition.y * (isMobile ? 0.15 : 0.2) + Math.cos(time * 0.3) * (isMobile ? 8 : 12)}%, 
            rgba(252, 178, 0, ${0.2 + Math.sin(time * 0.4) * 0.06 + mousePosition.x * 0.0008}), transparent 60%),
            radial-gradient(${60 + Math.cos(time * 0.6) * (isMobile ? 20 : 25) + mousePosition.x * (isMobile ? 0.1 : 0.12)}% ${70 + Math.sin(time * 0.5) * (isMobile ? 15 : 18) + mousePosition.y * (isMobile ? 0.1 : 0.12)}% at 
            ${20 + mousePosition.x * (isMobile ? 0.12 : 0.15)}% 
            ${70 - mousePosition.y * (isMobile ? 0.15 : 0.18)}%, 
            rgba(252, 178, 0, ${0.12 + Math.cos(time * 0.5) * 0.04 + mousePosition.y * 0.0006}), transparent 75%),
            radial-gradient(${45 + Math.sin(time * 0.7) * (isMobile ? 15 : 18) + mousePosition.x * (isMobile ? 0.08 : 0.1)}% ${55 + Math.cos(time * 0.6) * (isMobile ? 12 : 15) + mousePosition.y * (isMobile ? 0.08 : 0.1)}% at 
            ${60 + mousePosition.x * (isMobile ? 0.1 : 0.12)}% 
            ${40 + mousePosition.y * (isMobile ? 0.1 : 0.12)}%, 
            rgba(252, 178, 0, ${0.06 + Math.sin(time * 0.6) * 0.02 + Math.abs(mousePosition.x - mousePosition.y) * 0.0002}), transparent 85%)
          `,
          filter: `saturate(${1.25 + Math.cos(time * 0.25) * 0.18 + mousePosition.y * 0.002}) hue-rotate(${(mousePosition.y - 50) * (isMobile ? 0.3 : 0.6)}deg) brightness(${1.05 + mousePosition.x * 0.0003})`
        }}
      ></div>
      
      <div 
        className="parallax-bg parallax-layer-3" 
        style={{
          transform: `
            translate(${mousePosition.x * (isMobile ? 0.05 : 0.1) + Math.sin(time * 0.35) * (isMobile ? 10 : 18)}px, ${mousePosition.y * (isMobile ? -0.04 : -0.08) + Math.cos(time * 0.25) * (isMobile ? 8 : 15)}px) 
            scale(${1 + Math.sqrt((mousePosition.x - 50) ** 2 + (mousePosition.y - 50) ** 2) * (isMobile ? 0.0004 : 0.0008) + Math.sin(time * 0.6) * (isMobile ? 0.05 : 0.08)})
            rotate(${Math.sin(time * 0.4) * (isMobile ? 4 : 5) + (mousePosition.x + mousePosition.y - 100) * (isMobile ? 0.05 : 0.1)}deg)
          `,
          background: `
            radial-gradient(${90 + Math.cos(time * 0.6) * (isMobile ? 30 : 35) + mousePosition.x * (isMobile ? 0.18 : 0.22)}% ${110 + Math.sin(time * 0.5) * (isMobile ? 25 : 30) + mousePosition.y * (isMobile ? 0.15 : 0.18)}% at 
            ${20 + mousePosition.x * (isMobile ? 0.2 : 0.25) + Math.cos(time * 0.4) * (isMobile ? 10 : 15)}% 
            ${70 - mousePosition.y * (isMobile ? 0.15 : 0.2) + Math.sin(time * 0.5) * (isMobile ? 10 : 15)}%, 
            rgba(131, 6, 152, ${0.18 + Math.sin(time * 0.5) * 0.05 + mousePosition.x * 0.0006}), transparent 70%),
            radial-gradient(${65 + Math.sin(time * 0.6) * (isMobile ? 20 : 25) + mousePosition.x * (isMobile ? 0.12 : 0.15)}% ${85 + Math.cos(time * 0.4) * (isMobile ? 18 : 22) + mousePosition.y * (isMobile ? 0.12 : 0.15)}% at 
            ${70 + mousePosition.x * (isMobile ? 0.1 : 0.12)}% 
            ${40 - mousePosition.y * (isMobile ? 0.12 : 0.15)}%, 
            rgba(131, 6, 152, ${0.1 + Math.cos(time * 0.6) * 0.03 + mousePosition.y * 0.0004}), transparent 80%),
            radial-gradient(${50 + Math.cos(time * 0.7) * (isMobile ? 15 : 20) + mousePosition.x * (isMobile ? 0.08 : 0.1)}% ${70 + Math.sin(time * 0.5) * (isMobile ? 15 : 18) + mousePosition.y * (isMobile ? 0.1 : 0.12)}% at 
            ${45 + mousePosition.x * (isMobile ? 0.06 : 0.08)}% 
            ${85 + mousePosition.y * (isMobile ? 0.08 : 0.1)}%, 
            rgba(131, 6, 152, ${0.05 + Math.sin(time * 0.7) * 0.02 + (mousePosition.x * mousePosition.y) * 0.00001}), transparent 90%)
          `,
          filter: `saturate(${1.3 + Math.sin(time * 0.3) * 0.25 + mousePosition.x * 0.0015}) hue-rotate(${(mousePosition.x + mousePosition.y - 100) * (isMobile ? 0.2 : 0.4)}deg) brightness(${1.08 + Math.sqrt(mousePosition.x * mousePosition.y) * 0.0001})`
        }}
      ></div>
      
      <div 
        className="parallax-bg parallax-layer-4" 
        style={{
          transform: `
            translate(${mousePosition.x * (isMobile ? -0.04 : -0.08) + Math.cos(time * 0.3) * (isMobile ? 12 : 20)}px, ${mousePosition.y * (isMobile ? -0.04 : -0.08) + Math.sin(time * 0.4) * (isMobile ? 10 : 18)}px) 
            scale(${1 + Math.abs(mousePosition.x - mousePosition.y) * (isMobile ? 0.0003 : 0.0005) + Math.cos(time * 0.7) * (isMobile ? 0.05 : 0.07)})
            rotate(${Math.cos(time * 0.6) * (isMobile ? 5 : 6) + (mousePosition.x - mousePosition.y) * (isMobile ? 0.08 : 0.15)}deg)
          `,
          background: `
            radial-gradient(${75 + Math.sin(time * 0.7) * (isMobile ? 25 : 30) + mousePosition.x * (isMobile ? 0.15 : 0.2)}% ${90 + Math.cos(time * 0.6) * (isMobile ? 20 : 25) + mousePosition.y * (isMobile ? 0.12 : 0.15)}% at 
            ${70 - mousePosition.x * (isMobile ? 0.15 : 0.2) + Math.sin(time * 0.5) * (isMobile ? 12 : 18)}% 
            ${60 - mousePosition.y * (isMobile ? 0.15 : 0.18) + Math.cos(time * 0.6) * (isMobile ? 9 : 12)}%, 
            rgba(124, 162, 253, ${0.2 + Math.sin(time * 0.5) * 0.06 + mousePosition.x * 0.0008}), transparent 70%),
            radial-gradient(${55 + Math.cos(time * 0.7) * (isMobile ? 18 : 22) + mousePosition.x * (isMobile ? 0.12 : 0.15)}% ${75 + Math.sin(time * 0.5) * (isMobile ? 15 : 18) + mousePosition.y * (isMobile ? 0.1 : 0.12)}% at 
            ${25 + mousePosition.x * (isMobile ? 0.15 : 0.18)}% 
            ${20 + mousePosition.y * (isMobile ? 0.12 : 0.15)}%, 
            rgba(124, 162, 253, ${0.12 + Math.cos(time * 0.6) * 0.04 + mousePosition.y * 0.0006}), transparent 85%),
            radial-gradient(${40 + Math.sin(time * 0.8) * (isMobile ? 15 : 20) + mousePosition.x * (isMobile ? 0.08 : 0.1)}% ${60 + Math.cos(time * 0.6) * (isMobile ? 12 : 15) + mousePosition.y * (isMobile ? 0.08 : 0.1)}% at 
            ${85 + mousePosition.x * (isMobile ? 0.06 : 0.08)}% 
            ${80 + mousePosition.y * (isMobile ? 0.06 : 0.08)}%, 
            rgba(124, 162, 253, ${0.06 + Math.sin(time * 0.8) * 0.02 + Math.max(mousePosition.x, mousePosition.y) * 0.0002}), transparent 95%)
          `,
          filter: `saturate(${1.28 + Math.cos(time * 0.35) * 0.22 + mousePosition.y * 0.0012}) hue-rotate(${(mousePosition.x - mousePosition.y) * (isMobile ? 0.4 : 0.7)}deg) brightness(${1.06 + Math.min(mousePosition.x, mousePosition.y) * 0.0002})`
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
        <div className="brand">Therma</div>
      </header>

      <div className="header-spacer"></div>

      <main>
        <section id="hero" className="container center">
          <div className="stack">
            <h1>See your patterns. Keep what works. Steady your days.</h1>
            <div className="sp-8"></div>
            <h2 className="muted">Therma is a private, AI‑guided journaling app that turns your check‑ins, habits, and notes into pattern maps—highlighting bright spots to keep and frictions to tweak—so small changes add up to steadier weeks.</h2>
            <div className="sp-16"></div>
            
            <form className="stack" style={{ gap: '12px' }} onSubmit={handleSubmit}>
              <div className="pillInput">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <p className="social-proof">Early access — first 1,000 spots.<br/>No spam. Unsubscribe anytime.</p>
              <div className="sp-8"></div>
              <div>
                <button 
                  className="btn" 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting…' : 'Get early access'}
                </button>
              </div>
              <div 
                className={`status-message ${status === 'success' ? 'success' : status === 'error' ? 'error' : ''}`}
                role="status"
              >
                {status === 'success' && 'Thank you! You\'ve been added to the waitlist.'}
                {status === 'error' && 'Something went wrong. Please try again.'}
              </div>
            </form>
          </div>
        </section>
        
        {/* Breathing Divider */}
        <div className="breathing-divider" aria-hidden="true"></div>
        
        {/* Why Therma Section */}
        <section id="why" className="container center">
          <div className="stack">
            <h2 className="why-section-title">Why Therma?</h2>
            <p className="why-section-subtitle">Your private journal—with a gentle, research‑informed guide.</p>
            
            <div className="why-grid">
              <div className="why-tile">
                <div className="why-icon">
                  <span role="img" aria-label="Pattern maps">🗺️</span>
                </div>
                <h3>Pattern Maps</h3>
                <p>Your entries, habits, sleep, and mood are organized into weekly views that surface repeating contexts—days, times, people, or routines—linked with steadier or shakier moods.</p>
              </div>
              
              <div className="why-tile">
                <div className="why-icon">
                  <span role="img" aria-label="Bright spots">✨</span>
                </div>
                <h3>Bright Spots (what's already working)</h3>
                <p>See the routines that steady you (e.g., walk + 6‑bpm breathing before meetings). Mark them as "Keep" habits to reinforce wins.</p>
              </div>
              
              <div className="why-tile">
                <div className="why-icon">
                  <span role="img" aria-label="Friction finder">🔍</span>
                </div>
                <h3>Friction Finder (what to adjust)</h3>
                <p>Therma flags conditions that nudge you off course (e.g., late caffeine + short sleep). Turn them into if‑then plans so change sticks.</p>
              </div>
              
              <div className="why-tile">
                <div className="why-icon">
                  <span role="img" aria-label="Gentle prompts">💭</span>
                </div>
                <h3>Gentle, research‑informed prompts</h3>
                <p>Low‑effort prompts reduce decision fatigue and help you reflect consistently.</p>
              </div>
              
              <div className="why-tile">
                <div className="why-icon">
                  <span role="img" aria-label="Breath tools">🫁</span>
                </div>
                <h3>Breath tools for regulation</h3>
                <p>Quick, paced‑breathing guides to downshift stress and support HRV over time.</p>
              </div>
              
              <div className="why-tile">
                <div className="why-icon">
                  <span role="img" aria-label="Private by design">🔒</span>
                </div>
                <h3>Private by design</h3>
                <p>Your entries stay yours. We use strong safeguards and HIPAA‑eligible services; details in our Privacy Policy.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="container center">
          <div className="stack">
            <h2 className="why-section-title">How it works</h2>
            <p className="why-section-subtitle">Three simple steps to steadier days.</p>
            
            <div className="why-grid">
              <div className="why-tile">
                <div className="why-icon">
                  <span role="img" aria-label="Step one">1️⃣</span>
                </div>
                <h3>Check in</h3>
                <p>60–120 seconds of paced breathing plus a simple mood check.</p>
              </div>
              
              <div className="why-tile">
                <div className="why-icon">
                  <span role="img" aria-label="Step two">2️⃣</span>
                </div>
                <h3>Journal</h3>
                <p>Answer one or two gentle prompts; add any habit tags.</p>
              </div>
              
              <div className="why-tile">
                <div className="why-icon">
                  <span role="img" aria-label="Step three">3️⃣</span>
                </div>
                <h3>See patterns</h3>
                <p>Your Weekly Pattern Map highlights bright spots and frictions with simple next steps.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footerWrap">
          <div className="footerBrand">Therma</div>
          <p className="caption">Therma helps you make space for yourself.</p>
          <div className="sp-16"></div>
            <p className="footerLinks caption">
              <a href="/contact">Contact Us</a> · 
              <a href="/faq">FAQ</a> · 
              <a href="/privacy">Privacy</a> · 
              <a href="/beta-terms">Beta Terms</a>
            </p>
          <div className="sp-16"></div>
          <p className="caption">© 2025 Get Therma Inc. All rights reserved</p>
        </div>
      </footer>
    </>
  );
}