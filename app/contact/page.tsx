'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../globals.css';

export default function ContactPage() {
  const [formType, setFormType] = useState<'general' | 'collaboration' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    if (formType === 'collaboration' && !formData.company) return;

    setIsSubmitting(true);
    setStatus('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          type: formType
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Contact submission successful:', result);
      
      // Redirect to thank you page or show success
      setStatus('success');
      setTimeout(() => {
        router.push('/');
      }, 2000);
      
    } catch (err) {
      console.error('Form submission error:', err);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (formType) {
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

        <main className="mx-auto max-w-screen-xl w-full px-4 safe-px safe-pt safe-pb min-h-[100svh] md:min-h-[100dvh]">
          <section className="container mx-auto px-4 py-20 text-center">
            <div className="stack">
              <button 
                className="back-link" 
                onClick={() => setFormType(null)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'rgba(255,255,255,0.7)', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginBottom: '24px'
                }}
              >
                ← Back to Contact Options
              </button>
              
              <h1>
                {formType === 'general' ? 'General Contact' : 'Collaboration & Business'}
              </h1>
              <div className="sp-8"></div>
              <h2 className="muted">
                {formType === 'general' 
                  ? 'Have questions about Therma? We\'re here to support you and listen to your thoughts.'
                  : 'Interested in partnerships or collaborations? We\'d love to explore meaningful connections.'
                }
              </h2>
              <div className="sp-24"></div>
              
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                
                {formType === 'collaboration' && (
                  <div className="form-group">
                    <input
                      type="text"
                      name="company"
                      placeholder="Company Name"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                )}
                
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="form-textarea"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                
                <div className={`status-message ${status}`} role="status">
                  {status === 'success' && 'Thank you! Your message has been sent. We\'ll get back to you soon.'}
                  {status === 'error' && 'Something went wrong. Please try again.'}
                </div>
              </form>
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
              <a href="/faq">FAQ</a> · 
              <a href="/privacy">Privacy</a> · 
              <a href="/terms">Terms of Use</a>
            </p>
            <div className="sp-16"></div>
            <p className="caption">2025. All rights reserved</p>
          </div>
        </footer>
      </>
    );
  }

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

      <main className="mx-auto max-w-screen-xl w-full px-4 safe-px safe-pt safe-pb min-h-[100svh] md:min-h-[100dvh]">
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="stack">
            <h1>We're here to listen</h1>
            <div className="sp-8"></div>
            <h2 className="muted">Let's connect in a way that feels right for you</h2>
            <div className="sp-24"></div>
            
            <div className="contact-options">
              <div className="contact-card" onClick={() => setFormType('general')}>
                <h3>General Contact</h3>
                <p>Have questions about Therma? We're here to support you and listen to your thoughts. Share your experience or ask anything that's on your mind.</p>
                <button className="btn">Contact Us</button>
              </div>
              
              <div className="contact-card" onClick={() => setFormType('collaboration')}>
                <h3>Collaborations & Business</h3>
                <p>Interested in partnerships or collaborations? We'd love to explore meaningful connections and see how we can support each other's growth.</p>
                <button className="btn">Start Partnership</button>
              </div>
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
