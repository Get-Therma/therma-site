'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MobilePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);
  const [isMobile, setIsMobile] = useState(true); // Always true for mobile route
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setStatus('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          utm_source: new URL(window.location.href).searchParams.get('utm_source') || document.referrer,
          utm_medium: new URL(window.location.href).searchParams.get('utm_medium') || 'website',
          utm_campaign: new URL(window.location.href).searchParams.get('utm_campaign') || 'waitlist'
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Waitlist submission successful:', result);
      
      // Store email for thank you page
      localStorage.setItem('therma_submitted_email', email);
      
      // Redirect to thank you page using Next.js router
      router.push('/thank-you');
      
    } catch (err) {
      console.error('Form submission error:', err);
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
            translate(${mousePosition.x * 0.08 + Math.sin(time * 0.3) * 8}px, ${mousePosition.y * 0.06 + Math.cos(time * 0.2) * 6}px) 
            scale(${1 + (mousePosition.x - 50) * 0.001 + Math.sin(time * 0.4) * 0.03})
            rotate(${Math.sin(time * 0.2) * 2 + (mousePosition.x - 50) * 0.1}deg)
          `,
          background: `
            radial-gradient(${70 + Math.sin(time * 0.4) * 20 + mousePosition.x * 0.15}% ${90 + Math.cos(time * 0.3) * 15 + mousePosition.y * 0.12}% at 
            ${10 + mousePosition.x * 0.2 + Math.sin(time * 0.3) * 8}% 
            ${10 + mousePosition.y * 0.15 + Math.cos(time * 0.2) * 6}%, 
            rgba(255, 89, 48, ${0.25 + Math.sin(time * 0.3) * 0.08 + mousePosition.x * 0.001}), transparent 60%),
            radial-gradient(${55 + Math.cos(time * 0.5) * 15 + mousePosition.x * 0.12}% ${75 + Math.sin(time * 0.4) * 12 + mousePosition.y * 0.1}% at 
            ${75 + mousePosition.x * 0.15}% 
            ${25 + mousePosition.y * 0.12}%, 
            rgba(255, 89, 48, ${0.15 + Math.cos(time * 0.4) * 0.05 + mousePosition.y * 0.0008}), transparent 70%),
            radial-gradient(${40 + Math.sin(time * 0.6) * 12 + mousePosition.x * 0.08}% ${60 + Math.cos(time * 0.5) * 10 + mousePosition.y * 0.06}% at 
            ${50 + mousePosition.x * 0.1}% 
            ${60 + mousePosition.y * 0.08}%, 
            rgba(255, 89, 48, ${0.08 + Math.sin(time * 0.5) * 0.03 + (mousePosition.x + mousePosition.y) * 0.0003}), transparent 80%)
          `,
          filter: `saturate(${1.3 + Math.sin(time * 0.2) * 0.2 + mousePosition.x * 0.002}) hue-rotate(${(mousePosition.x - 50) * 0.4}deg) brightness(${1.1 + mousePosition.y * 0.0005})`
        }}
      ></div>
      
      <div 
        className="parallax-bg parallax-layer-2" 
        style={{
          transform: `
            translate(${mousePosition.x * -0.12 + Math.cos(time * 0.25) * 15}px, ${mousePosition.y * 0.1 + Math.sin(time * 0.3) * 12}px) 
            scale(${1 + (mousePosition.y - 50) * 0.002 + Math.cos(time * 0.5) * 0.06})
            rotate(${Math.cos(time * 0.3) * 4 + (mousePosition.y - 50) * 0.2}deg)
          `,
          background: `
            radial-gradient(${80 + Math.sin(time * 0.5) * 30 + mousePosition.x * 0.18}% ${95 + Math.cos(time * 0.4) * 25 + mousePosition.y * 0.15}% at 
            ${80 - mousePosition.x * 0.18 + Math.sin(time * 0.4) * 15}% 
            ${20 + mousePosition.y * 0.2 + Math.cos(time * 0.3) * 12}%, 
            rgba(252, 178, 0, ${0.2 + Math.sin(time * 0.4) * 0.06 + mousePosition.x * 0.0008}), transparent 60%),
            radial-gradient(${60 + Math.cos(time * 0.6) * 25 + mousePosition.x * 0.12}% ${70 + Math.sin(time * 0.5) * 18 + mousePosition.y * 0.12}% at 
            ${20 + mousePosition.x * 0.15}% 
            ${70 - mousePosition.y * 0.18}%, 
            rgba(252, 178, 0, ${0.12 + Math.cos(time * 0.5) * 0.04 + mousePosition.y * 0.0006}), transparent 75%),
            radial-gradient(${45 + Math.sin(time * 0.7) * 18 + mousePosition.x * 0.08}% ${55 + Math.cos(time * 0.6) * 15 + mousePosition.y * 0.1}% at 
            ${60 + mousePosition.x * 0.1}% 
            ${40 + mousePosition.y * 0.12}%, 
            rgba(252, 178, 0, ${0.06 + Math.sin(time * 0.6) * 0.02 + Math.abs(mousePosition.x - mousePosition.y) * 0.0002}), transparent 85%)
          `,
          filter: `saturate(${1.25 + Math.cos(time * 0.25) * 0.18 + mousePosition.y * 0.002}) hue-rotate(${(mousePosition.y - 50) * 0.6}deg) brightness(${1.05 + mousePosition.x * 0.0003})`
        }}
      ></div>
      
      <div 
        className="parallax-bg parallax-layer-3" 
        style={{
          transform: `
            translate(${mousePosition.x * 0.1 + Math.sin(time * 0.35) * 18}px, ${mousePosition.y * -0.08 + Math.cos(time * 0.25) * 15}px) 
            scale(${1 + Math.sqrt((mousePosition.x - 50) ** 2 + (mousePosition.y - 50) ** 2) * 0.0008 + Math.sin(time * 0.6) * 0.08})
            rotate(${Math.sin(time * 0.4) * 5 + (mousePosition.x + mousePosition.y - 100) * 0.1}deg)
          `,
          background: `
            radial-gradient(${90 + Math.cos(time * 0.6) * 35 + mousePosition.x * 0.22}% ${110 + Math.sin(time * 0.5) * 30 + mousePosition.y * 0.18}% at 
            ${20 + mousePosition.x * 0.25 + Math.cos(time * 0.4) * 15}% 
            ${70 - mousePosition.y * 0.2 + Math.sin(time * 0.5) * 15}%, 
            rgba(131, 6, 152, ${0.18 + Math.sin(time * 0.5) * 0.05 + mousePosition.x * 0.0006}), transparent 70%),
            radial-gradient(${65 + Math.sin(time * 0.6) * 25 + mousePosition.x * 0.15}% ${85 + Math.cos(time * 0.4) * 22 + mousePosition.y * 0.15}% at 
            ${70 + mousePosition.x * 0.12}% 
            ${40 - mousePosition.y * 0.15}%, 
            rgba(131, 6, 152, ${0.1 + Math.cos(time * 0.6) * 0.03 + mousePosition.y * 0.0004}), transparent 80%),
            radial-gradient(${50 + Math.cos(time * 0.7) * 20 + mousePosition.x * 0.1}% ${70 + Math.sin(time * 0.5) * 18 + mousePosition.y * 0.12}% at 
            ${45 + mousePosition.x * 0.08}% 
            ${85 + mousePosition.y * 0.1}%, 
            rgba(131, 6, 152, ${0.05 + Math.sin(time * 0.7) * 0.02 + (mousePosition.x * mousePosition.y) * 0.00001}), transparent 90%)
          `,
          filter: `saturate(${1.3 + Math.sin(time * 0.3) * 0.25 + mousePosition.x * 0.0015}) hue-rotate(${(mousePosition.x + mousePosition.y - 100) * 0.4}deg) brightness(${1.08 + Math.sqrt(mousePosition.x * mousePosition.y) * 0.0001})`
        }}
      ></div>
      
      <div 
        className="parallax-bg parallax-layer-4" 
        style={{
          transform: `
            translate(${mousePosition.x * -0.08 + Math.cos(time * 0.3) * 20}px, ${mousePosition.y * -0.08 + Math.sin(time * 0.4) * 18}px) 
            scale(${1 + Math.abs(mousePosition.x - mousePosition.y) * 0.0005 + Math.cos(time * 0.7) * 0.07})
            rotate(${Math.cos(time * 0.6) * 6 + (mousePosition.x - mousePosition.y) * 0.15}deg)
          `,
          background: `
            radial-gradient(${75 + Math.sin(time * 0.7) * 30 + mousePosition.x * 0.2}% ${90 + Math.cos(time * 0.6) * 25 + mousePosition.y * 0.15}% at 
            ${70 - mousePosition.x * 0.2 + Math.sin(time * 0.5) * 18}% 
            ${60 - mousePosition.y * 0.18 + Math.cos(time * 0.6) * 12}%, 
            rgba(124, 162, 253, ${0.2 + Math.sin(time * 0.5) * 0.06 + mousePosition.x * 0.0008}), transparent 70%),
            radial-gradient(${55 + Math.cos(time * 0.7) * 22 + mousePosition.x * 0.15}% ${75 + Math.sin(time * 0.5) * 18 + mousePosition.y * 0.12}% at 
            ${25 + mousePosition.x * 0.18}% 
            ${20 + mousePosition.y * 0.15}%, 
            rgba(124, 162, 253, ${0.12 + Math.cos(time * 0.6) * 0.04 + mousePosition.y * 0.0006}), transparent 85%),
            radial-gradient(${40 + Math.sin(time * 0.8) * 20 + mousePosition.x * 0.1}% ${60 + Math.cos(time * 0.6) * 15 + mousePosition.y * 0.1}% at 
            ${85 + mousePosition.x * 0.08}% 
            ${80 + mousePosition.y * 0.08}%, 
            rgba(124, 162, 253, ${0.06 + Math.sin(time * 0.8) * 0.02 + Math.max(mousePosition.x, mousePosition.y) * 0.0002}), transparent 95%)
          `,
          filter: `saturate(${1.28 + Math.cos(time * 0.35) * 0.22 + mousePosition.y * 0.0012}) hue-rotate(${(mousePosition.x - mousePosition.y) * 0.7}deg) brightness(${1.06 + Math.min(mousePosition.x, mousePosition.y) * 0.0002})`
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

      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 safe-pt">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="text-xl font-semibold text-white">Therma</div>
        </div>
      </header>

      <div className="h-16"></div>

      <main className="mx-auto max-w-screen-xl w-full px-4 safe-px safe-pt safe-pb min-h-screen">
        <section id="hero" className="container mx-auto px-4 py-16 text-center">
          <div className="space-y-4">
            <h1 className="font-semibold leading-tight text-2xl text-white">Your space to slow<br/>down, check in, and<br/>feel supported.</h1>
            <div className="h-3"></div>
            <h2 className="text-lg text-white/80 leading-relaxed">Daily reflections, gentle prompts, and an AI companion that<br/>listens — so you can actually hear yourself.</h2>
            <div className="h-6"></div>
            
            <form className="space-y-3 max-w-sm mx-auto" onSubmit={handleSubmit}>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="w-full px-4 py-3 text-base bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
                />
              </div>
              <p className="text-white/60 text-xs">Join the first 1,000 beta invites</p>
              <div className="h-3"></div>
              <div>
                <button 
                  type="submit" 
                  className="w-full px-6 py-3 text-base font-medium text-black bg-white hover:bg-white/90 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting…' : 'Join Waitlist'}
                </button>
              </div>
              <div 
                className={`text-center text-xs ${status === 'success' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-transparent'}`}
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
        <section id="why" className="container mx-auto px-4 py-16 text-center">
          <div className="space-y-4">
            <h2 className="font-semibold leading-tight text-2xl text-white">Why Therma?</h2>
            <p className="text-base text-white/80 leading-relaxed max-w-sm mx-auto">Your space to slow down, check in, and feel supported</p>
            
            <div className="mt-8 grid grid-cols-1 gap-4 max-w-sm mx-auto">
              <div className="rounded-2xl p-4 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="text-3xl mb-3">
                  <span role="img" aria-label="A person in a calm seated pose">🧘</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Daily Reflections</h3>
                <p className="text-white/80 mb-3 text-sm">Gentle prompts that help you process your day—without judgment.</p>
                <div className="text-xs text-white/60">
                  <span>→</span> Try a 2-minute check-in: inhale 4, hold 4, exhale 6.
                </div>
              </div>
              
              <div className="rounded-2xl p-4 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="text-3xl mb-3">
                  <span role="img" aria-label="A friendly robot face">🤖</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">AI Companion</h3>
                <p className="text-white/80 mb-3 text-sm">A kind companion that listens, asks thoughtful questions, and helps you notice patterns.</p>
                <div className="text-xs text-white/60">
                  <span>→</span> Try a 2-minute check-in: inhale 4, hold 4, exhale 6.
                </div>
              </div>
              
              <div className="rounded-2xl p-4 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="text-3xl mb-3">
                  <span role="img" aria-label="A small, soft cloud">☁️</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Mindful Space</h3>
                <p className="text-white/80 mb-3 text-sm">A quiet place to slow down, breathe, and actually hear yourself.</p>
                <div className="text-xs text-white/60">
                  <span>→</span> Try a 2-minute check-in: inhale 4, hold 4, exhale 6.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-16 py-8 px-4 safe-px">
        <div className="max-w-screen-xl mx-auto text-center space-y-4">
          <div className="text-xl font-semibold text-white">Therma</div>
          <p className="text-white/60 text-xs">Therma helps you make space for yourself</p>
          <div className="h-4"></div>
          <p className="text-white/60 text-xs space-x-2">
            <a href="/contact" className="hover:text-white transition-colors">Contact Us</a>
            <span>·</span>
            <a href="/faq" className="hover:text-white transition-colors">FAQ</a>
            <span>·</span>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <span>·</span>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Use</a>
          </p>
          <div className="h-4"></div>
          <p className="text-white/40 text-xs">© 2025 Get Therma Inc. All rights reserved</p>
        </div>
      </footer>
    </>
  );
}
