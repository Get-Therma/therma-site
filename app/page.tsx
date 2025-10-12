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

  // Mouse tracking and time-based animations (optimized)
  useEffect(() => {
    let animationFrame: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    const updateTime = () => {
      setTime(Date.now() * 0.001);
      animationFrame = requestAnimationFrame(updateTime);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrame = requestAnimationFrame(updateTime);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
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
      {/* Optimized Interactive Background Layers */}
      <div 
        className="parallax-bg parallax-layer-1" 
        style={{
          transform: `translate(${mousePosition.x * 0.03 + Math.sin(time * 0.3) * 5}px, ${mousePosition.y * 0.02 + Math.cos(time * 0.2) * 4}px)`,
          background: `
            radial-gradient(50% 70% at ${15 + mousePosition.x * 0.1}% ${15 + mousePosition.y * 0.08}%, 
            rgba(255, 89, 48, 0.15), transparent 60%),
            radial-gradient(40% 60% at ${70 + mousePosition.x * 0.08}% ${30 + mousePosition.y * 0.06}%, 
            rgba(255, 89, 48, 0.08), transparent 70%)
          `,
          filter: `saturate(${1.1 + Math.sin(time * 0.2) * 0.1})`
        }}
      ></div>
      
      <div 
        className="parallax-bg parallax-layer-2" 
        style={{
          transform: `translate(${mousePosition.x * -0.025 + Math.cos(time * 0.25) * 6}px, ${mousePosition.y * 0.025 + Math.sin(time * 0.3) * 5}px)`,
          background: `
            radial-gradient(60% 80% at ${85 - mousePosition.x * 0.08}% ${25 + mousePosition.y * 0.1}%, 
            rgba(252, 178, 0, 0.12), transparent 60%),
            radial-gradient(45% 65% at ${25 + mousePosition.x * 0.06}% ${75 - mousePosition.y * 0.08}%, 
            rgba(252, 178, 0, 0.06), transparent 75%)
          `,
          filter: `saturate(${1.05 + Math.cos(time * 0.25) * 0.1})`
        }}
      ></div>
      
      <div 
        className="parallax-bg parallax-layer-3" 
        style={{
          transform: `translate(${mousePosition.x * 0.02 + Math.sin(time * 0.35) * 7}px, ${mousePosition.y * -0.02 + Math.cos(time * 0.25) * 6}px)`,
          background: `
            radial-gradient(70% 90% at ${25 + mousePosition.x * 0.12}% ${75 - mousePosition.y * 0.1}%, 
            rgba(131, 6, 152, 0.08), transparent 70%),
            radial-gradient(50% 70% at ${75 + mousePosition.x * 0.05}% ${45 - mousePosition.y * 0.06}%, 
            rgba(131, 6, 152, 0.04), transparent 80%)
          `,
          filter: `saturate(${1.1 + Math.sin(time * 0.3) * 0.15})`
        }}
      ></div>
      
      <div 
        className="parallax-bg parallax-layer-4" 
        style={{
          transform: `translate(${mousePosition.x * -0.02 + Math.cos(time * 0.3) * 8}px, ${mousePosition.y * -0.02 + Math.sin(time * 0.4) * 7}px)`,
          background: `
            radial-gradient(55% 75% at ${75 - mousePosition.x * 0.1}% ${65 - mousePosition.y * 0.08}%, 
            rgba(124, 162, 253, 0.1), transparent 70%),
            radial-gradient(40% 60% at ${35 + mousePosition.x * 0.08}% ${25 + mousePosition.y * 0.07}%, 
            rgba(124, 162, 253, 0.05), transparent 85%)
          `,
          filter: `saturate(${1.08 + Math.cos(time * 0.35) * 0.12})`
        }}
      ></div>

      {/* Main Background - Brighter with Enhanced Breathing */}
      <div 
        className="heroBg" 
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          background: `
            radial-gradient(${70 + Math.sin(time * 0.3) * 20}% ${90 + Math.cos(time * 0.4) * 15}% at 
            ${20 + Math.sin(time * 0.2) * 5}% ${20 + Math.cos(time * 0.25) * 4}%, 
            rgba(255, 89, 48, ${0.5 + Math.sin(time * 0.5) * 0.1}), transparent 50%),
            radial-gradient(${60 + Math.cos(time * 0.35) * 18}% ${80 + Math.sin(time * 0.3) * 12}% at 
            ${80 + Math.cos(time * 0.15) * 4}% ${30 + Math.sin(time * 0.2) * 5}%, 
            rgba(252, 178, 0, ${0.4 + Math.cos(time * 0.45) * 0.08}), transparent 50%),
            radial-gradient(${70 + Math.sin(time * 0.4) * 25}% ${100 + Math.cos(time * 0.35) * 18}% at 
            ${30 + Math.sin(time * 0.18) * 6}% ${70 + Math.cos(time * 0.22) * 5}%, 
            rgba(131, 6, 152, ${0.35 + Math.sin(time * 0.55) * 0.06}), transparent 60%),
            radial-gradient(${60 + Math.cos(time * 0.38) * 20}% ${90 + Math.sin(time * 0.32) * 15}% at 
            ${70 + Math.cos(time * 0.18) * 5}% ${80 + Math.sin(time * 0.25) * 6}%, 
            rgba(124, 162, 253, ${0.4 + Math.cos(time * 0.48) * 0.08}), transparent 60%),
            radial-gradient(${50 + Math.sin(time * 0.42) * 15}% ${70 + Math.cos(time * 0.36) * 12}% at 
            ${50 + Math.sin(time * 0.15) * 4}% ${50 + Math.cos(time * 0.28) * 4}%, 
            rgba(172, 223, 127, ${0.25 + Math.sin(time * 0.52) * 0.05}), transparent 70%),
            linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)
          `,
          filter: `saturate(${1.1 + Math.sin(time * 0.4) * 0.15}) brightness(${1.15 + Math.cos(time * 0.3) * 0.1})`,
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
            <h1>Your space to slow<br/>down, check in, and<br/>feel supported.</h1>
            <div className="sp-8"></div>
            <h2 className="muted">Daily reflections, gentle prompts, and an AI companion that<br/>listens — so you can actually hear yourself.</h2>
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
              <p className="social-proof">Join the first 1,000 beta invites</p>
              <div className="sp-8"></div>
              <div>
                <button 
                  className="btn" 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting…' : 'Join Waitlist'}
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
            <p className="why-section-subtitle">Your space to slow down, check in, and feel supported</p>
            
            <div className="why-grid">
              <div className="why-tile">
                <div className="why-icon">
                  <span role="img" aria-label="A person in a calm seated pose">🧘</span>
                </div>
                <h3>Daily Reflections</h3>
                <p>Gentle prompts that help you process your day—without judgment.</p>
                <div className="why-micro-story">
                  <span>→</span> Try a 2-minute check-in: inhale 4, hold 4, exhale 6.
                </div>
              </div>
              
              <div className="why-tile">
                <div className="why-icon">
                  <span role="img" aria-label="A friendly robot face">🤖</span>
                </div>
                <h3>AI Companion</h3>
                <p>A kind companion that listens, asks thoughtful questions, and helps you notice patterns.</p>
                <div className="why-micro-story">
                  <span>→</span> Try a 2-minute check-in: inhale 4, hold 4, exhale 6.
                </div>
              </div>
              
              <div className="why-tile">
                <div className="why-icon">
                  <span role="img" aria-label="A small, soft cloud">☁️</span>
                </div>
                <h3>Mindful Space</h3>
                <p>A quiet place to slow down, breathe, and actually hear yourself.</p>
                <div className="why-micro-story">
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
          <p className="caption">© 2025 Get Therma Inc. All rights reserved</p>
        </div>
      </footer>
    </>
  );
}