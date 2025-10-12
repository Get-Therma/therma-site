'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);
  const router = useRouter();

  // Mouse tracking and time-based animations (desktop-optimized)
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
      {/* Ultra-Interactive Background Bubbles - Desktop Optimized */}
      <div 
        className="parallax-bg parallax-layer-1" 
        style={{
          transform: `
            translate(${mousePosition.x * 0.15 + Math.sin(time * 0.3) * 12}px, ${mousePosition.y * 0.12 + Math.cos(time * 0.2) * 10}px) 
            scale(${1 + (mousePosition.x - 50) * 0.002 + Math.sin(time * 0.4) * 0.05})
            rotate(${Math.sin(time * 0.2) * 3 + (mousePosition.x - 50) * 0.2}deg)
          `,
          background: `
            radial-gradient(${70 + Math.sin(time * 0.4) * 25 + mousePosition.x * 0.2}% ${90 + Math.cos(time * 0.3) * 20 + mousePosition.y * 0.15}% at 
            ${10 + mousePosition.x * 0.25 + Math.sin(time * 0.3) * 12}% 
            ${10 + mousePosition.y * 0.2 + Math.cos(time * 0.2) * 10}%, 
            rgba(255, 89, 48, ${0.25 + Math.sin(time * 0.3) * 0.08 + mousePosition.x * 0.001}), transparent 60%),
            radial-gradient(${55 + Math.cos(time * 0.5) * 20 + mousePosition.x * 0.15}% ${75 + Math.sin(time * 0.4) * 15 + mousePosition.y * 0.12}% at 
            ${75 + mousePosition.x * 0.18}% 
            ${25 + mousePosition.y * 0.15}%, 
            rgba(255, 89, 48, ${0.15 + Math.cos(time * 0.4) * 0.05 + mousePosition.y * 0.0008}), transparent 70%),
            radial-gradient(${40 + Math.sin(time * 0.6) * 15 + mousePosition.x * 0.1}% ${60 + Math.cos(time * 0.5) * 12 + mousePosition.y * 0.08}% at 
            ${50 + mousePosition.x * 0.12}% 
            ${60 + mousePosition.y * 0.1}%, 
            rgba(255, 89, 48, ${0.08 + Math.sin(time * 0.5) * 0.03 + (mousePosition.x + mousePosition.y) * 0.0003}), transparent 80%)
          `,
          filter: `saturate(${1.3 + Math.sin(time * 0.2) * 0.2 + mousePosition.x * 0.002}) hue-rotate(${(mousePosition.x - 50) * 0.8}deg) brightness(${1.1 + mousePosition.y * 0.0005})`
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

      {/* Main Background - Ultra-Interactive with Mouse (Desktop) */}
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
          <div className="text-2xl font-semibold text-white">Therma</div>
        </div>
      </header>

      <div className="h-20"></div>

      <main className="mx-auto max-w-screen-xl w-full px-4 safe-px safe-pt safe-pb min-h-screen">
        <section id="hero" className="container mx-auto px-4 py-20 text-center">
          <div className="space-y-6">
            <h1 className="font-semibold leading-tight text-4xl text-white">Your space to slow<br/>down, check in, and<br/>feel supported.</h1>
            <div className="h-4"></div>
            <h2 className="text-xl text-white/80 leading-relaxed">Daily reflections, gentle prompts, and an AI companion that<br/>listens — so you can actually hear yourself.</h2>
            <div className="h-8"></div>
            
            <form className="space-y-3 max-w-md mx-auto" onSubmit={handleSubmit}>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="w-full px-6 py-4 text-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
                />
              </div>
              <p className="text-white/60 text-sm">Join the first 1,000 beta invites</p>
              <div className="h-4"></div>
              <div>
                <button 
                  type="submit" 
                  className="w-full px-8 py-4 text-lg font-medium text-black bg-white hover:bg-white/90 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting…' : 'Join Waitlist'}
                </button>
              </div>
              <div 
                className={`text-center text-sm ${status === 'success' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-transparent'}`}
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
        <section id="why" className="container mx-auto px-4 py-20 text-center">
          <div className="space-y-6">
            <h2 className="font-semibold leading-tight text-3xl text-white">Why Therma?</h2>
            <p className="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">Your space to slow down, check in, and feel supported</p>
            
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="text-4xl mb-4">
                  <span role="img" aria-label="A person in a calm seated pose">🧘</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Daily Reflections</h3>
                <p className="text-white/80 mb-4">Gentle prompts that help you process your day—without judgment.</p>
                <div className="text-sm text-white/60">
                  <span>→</span> Try a 2-minute check-in: inhale 4, hold 4, exhale 6.
                </div>
              </div>
              
              <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="text-4xl mb-4">
                  <span role="img" aria-label="A friendly robot face">🤖</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">AI Companion</h3>
                <p className="text-white/80 mb-4">A kind companion that listens, asks thoughtful questions, and helps you notice patterns.</p>
                <div className="text-sm text-white/60">
                  <span>→</span> Try a 2-minute check-in: inhale 4, hold 4, exhale 6.
                </div>
              </div>
              
              <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="text-4xl mb-4">
                  <span role="img" aria-label="A small, soft cloud">☁️</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Mindful Space</h3>
                <p className="text-white/80 mb-4">A quiet place to slow down, breathe, and actually hear yourself.</p>
                <div className="text-sm text-white/60">
                  <span>→</span> Try a 2-minute check-in: inhale 4, hold 4, exhale 6.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="container center">
          <div className="stack">
            <h2 className="why-section-title">How It Works</h2>
            <p className="why-section-subtitle">Simple steps to a more mindful you</p>
            
            <div className="why-grid">
              <div className="why-tile">
                <div className="why-icon">
                  <span role="img" aria-label="Step one">1️⃣</span>
                </div>
                <h3>Check In Daily</h3>
                <p>Take a few minutes each day to pause and reflect on how you're feeling.</p>
                <div className="why-micro-story">
                  <span>→</span> Start with just 2 minutes of mindful breathing.
                </div>
              </div>
              
              <div className="why-tile">
                <div className="why-icon">
                  <span role="img" aria-label="Step two">2️⃣</span>
                </div>
                <h3>Share Your Thoughts</h3>
                <p>Express what's on your mind through gentle prompts designed to help you process.</p>
                <div className="why-micro-story">
                  <span>→</span> Answer one simple question: "How are you feeling right now?"
                </div>
              </div>
              
              <div className="why-tile">
                <div className="why-icon">
                  <span role="img" aria-label="Step three">3️⃣</span>
                </div>
                <h3>Get Support</h3>
                <p>Receive thoughtful responses and guidance from your AI companion.</p>
                <div className="why-micro-story">
                  <span>→</span> Get personalized insights and gentle encouragement.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who It's For Section */}
        <section id="who-its-for" className="container center">
          <div className="stack">
            <h2 className="why-section-title">Who It's For</h2>
            <p className="why-section-subtitle">Perfect for anyone seeking mindful reflection</p>
            
            <div className="why-grid">
              <div className="why-tile">
                <div className="why-icon">
                  <span role="img" aria-label="Busy professional">💼</span>
                </div>
                <h3>Busy Professionals</h3>
                <p>Find moments of calm in your hectic schedule and process work stress mindfully.</p>
                <div className="why-micro-story">
                  <span>→</span> Take a 5-minute break between meetings to check in with yourself.
                </div>
              </div>
              
              <div className="why-tile">
                <div className="why-icon">
                  <span role="img" aria-label="Student learning">🎓</span>
                </div>
                <h3>Students & Learners</h3>
                <p>Navigate academic pressure and personal growth with supportive daily check-ins.</p>
                <div className="why-micro-story">
                  <span>→</span> Process exam stress and celebrate small wins along the way.
                </div>
              </div>
              
              <div className="why-tile">
                <div className="why-icon">
                  <span role="img" aria-label="Personal growth">🌱</span>
                </div>
                <h3>Anyone Seeking Growth</h3>
                <p>Build self-awareness and emotional intelligence through regular reflection.</p>
                <div className="why-micro-story">
                  <span>→</span> Discover patterns in your thoughts and feelings over time.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Preview Section */}
        <section id="faq-preview" className="container center">
          <div className="stack">
            <h2 className="why-section-title">Common Questions</h2>
            <p className="why-section-subtitle">Everything you need to know about Therma</p>
            
            <div className="why-grid">
              <div className="why-tile">
                <div className="why-icon">
                  <span role="img" aria-label="Question mark">❓</span>
                </div>
                <h3>Is this therapy?</h3>
                <p>No. Therma is a self-reflection tool and isn't medical advice.</p>
                <div className="why-micro-story">
                  <span>→</span> Think of it as a mindful journal with AI support.
                </div>
              </div>
              
              <div className="why-tile">
                <div className="why-icon">
                  <span role="img" aria-label="Free tier">🆓</span>
                </div>
                <h3>Will it be free?</h3>
                <p>We'll offer a free tier; early waitlisters get first beta access and perks.</p>
                <div className="why-micro-story">
                  <span>→</span> Join the waitlist for exclusive early access benefits.
                </div>
              </div>
              
              <div className="why-tile">
                <div className="why-icon">
                  <span role="img" aria-label="Mobile devices">📱</span>
                </div>
                <h3>iOS or Android?</h3>
                <p>iOS first, Android next.</p>
                <div className="why-micro-story">
                  <span>→</span> iPhone users get first access, Android coming soon.
                </div>
              </div>
            </div>
            
            <div className="sp-16"></div>
            <div className="center">
              <a href="/faq" className="btn-secondary">View All FAQs</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-20 py-12 px-4 safe-px">
        <div className="max-w-screen-xl mx-auto text-center space-y-6">
          <div className="text-2xl font-semibold text-white">Therma</div>
          <p className="text-white/60 text-sm">Therma helps you make space for yourself</p>
          <div className="h-8"></div>
          <p className="text-white/60 text-sm space-x-2">
            <a href="/contact" className="hover:text-white transition-colors">Contact Us</a>
            <span>·</span>
            <a href="/faq" className="hover:text-white transition-colors">FAQ</a>
            <span>·</span>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <span>·</span>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Use</a>
          </p>
          <div className="h-8"></div>
          <p className="text-white/40 text-xs">© 2025 Get Therma Inc. All rights reserved</p>
        </div>
      </footer>
    </>
  );
}