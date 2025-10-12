'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FAQPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
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

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "Is this therapy?",
      answer: "No. Therma is a self-reflection tool and isn't medical advice."
    },
    {
      question: "Will it be free?",
      answer: "We'll offer a free tier; early waitlisters get first beta access and perks."
    },
    {
      question: "iOS or Android?",
      answer: "iOS first, Android next."
    },
    {
      question: "Privacy?",
      answer: "We don't sell data. Therma is built on a HIPAA compliant basis."
    },
    {
      question: "How is Therma different from journaling apps?",
      answer: "Unlike traditional journaling apps, Therma combines daily reflections with an AI companion that listens and responds thoughtfully. It's designed to help you actually hear yourself through gentle prompts and meaningful conversations."
    },
    {
      question: "When will Therma launch?",
      answer: "We're working hard to bring Therma to you soon! Join our waitlist to be among the first to experience it when we launch. We'll keep you updated on our progress."
    }
  ];

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
      
      <div 
        className="parallax-bg parallax-layer-2" 
        style={{
          transform: `
            translate(${mousePosition.x * -0.04 + Math.cos(time * 0.4) * 12}px, ${mousePosition.y * 0.04 + Math.sin(time * 0.6) * 10}px) 
            rotate(${Math.cos(time * 0.3) * 3}deg) 
            scale(${1 + Math.cos(time * 0.5) * 0.08})
          `,
          background: `
            radial-gradient(${50 + Math.sin(time * 0.7) * 25}% ${70 + Math.cos(time * 0.5) * 20}% at 
            ${90 - mousePosition.x * 0.12 + Math.sin(time * 0.4) * 8}% 
            ${20 + mousePosition.y * 0.15 + Math.cos(time * 0.6) * 6}%, 
            rgba(252, 178, 0, ${0.12 + Math.sin(time * 0.8) * 0.04}), transparent 60%),
            radial-gradient(${35 + Math.cos(time * 0.9) * 20}% ${45 + Math.sin(time * 0.7) * 15}% at 
            ${20 + mousePosition.x * 0.08}% 
            ${80 - mousePosition.y * 0.1}%, 
            rgba(252, 178, 0, ${0.06 + Math.cos(time * 0.6) * 0.02}), transparent 75%)
          `,
          filter: `hue-rotate(${Math.cos(time * 0.15) * 15}deg) saturate(${1.1 + Math.cos(time * 0.4) * 0.2})`
        }}
      ></div>
      
      <div 
        className="parallax-bg parallax-layer-3" 
        style={{
          transform: `
            translate(${mousePosition.x * 0.035 + Math.sin(time * 0.6) * 15}px, ${mousePosition.y * -0.035 + Math.cos(time * 0.4) * 12}px) 
            rotate(${Math.sin(time * 0.4) * 4}deg) 
            scale(${1 + Math.sin(time * 0.6) * 0.06})
          `,
          background: `
            radial-gradient(${60 + Math.cos(time * 0.8) * 30}% ${80 + Math.sin(time * 0.6) * 25}% at 
            ${20 + mousePosition.x * 0.18 + Math.cos(time * 0.5) * 7}% 
            ${80 - mousePosition.y * 0.14 + Math.sin(time * 0.7) * 8}%, 
            rgba(131, 6, 152, ${0.08 + Math.sin(time * 0.9) * 0.03}), transparent 70%),
            radial-gradient(${40 + Math.sin(time * 0.7) * 20}% ${60 + Math.cos(time * 0.5) * 18}% at 
            ${80 + mousePosition.x * 0.06}% 
            ${40 - mousePosition.y * 0.08}%, 
            rgba(131, 6, 152, ${0.04 + Math.cos(time * 0.8) * 0.02}), transparent 80%)
          `,
          filter: `hue-rotate(${Math.sin(time * 0.2) * 20}deg) saturate(${1.3 + Math.sin(time * 0.5) * 0.4})`
        }}
      ></div>
      
      <div 
        className="parallax-bg parallax-layer-4" 
        style={{
          transform: `
            translate(${mousePosition.x * -0.03 + Math.cos(time * 0.5) * 18}px, ${mousePosition.y * -0.03 + Math.sin(time * 0.7) * 14}px) 
            rotate(${Math.cos(time * 0.6) * 5}deg) 
            scale(${1 + Math.cos(time * 0.7) * 0.07})
          `,
          background: `
            radial-gradient(${45 + Math.sin(time * 0.9) * 25}% ${65 + Math.cos(time * 0.7) * 20}% at 
            ${80 - mousePosition.x * 0.14 + Math.sin(time * 0.6) * 9}% 
            ${70 - mousePosition.y * 0.12 + Math.cos(time * 0.8) * 7}%, 
            rgba(124, 162, 253, ${0.1 + Math.sin(time * 0.6) * 0.04}), transparent 70%),
            radial-gradient(${30 + Math.cos(time * 0.8) * 18}% ${50 + Math.sin(time * 0.6) * 15}% at 
            ${30 + mousePosition.x * 0.1}% 
            ${20 + mousePosition.y * 0.09}%, 
            rgba(124, 162, 253, ${0.05 + Math.cos(time * 0.7) * 0.02}), transparent 85%)
          `,
          filter: `hue-rotate(${Math.cos(time * 0.25) * 25}deg) saturate(${1.4 + Math.cos(time * 0.6) * 0.5})`
        }}
      ></div>

      {/* Additional Creative Layers */}
      <div 
        className="parallax-bg creative-layer-1" 
        style={{
          transform: `
            translate(${mousePosition.x * 0.02 + Math.sin(time * 0.8) * 20}px, ${mousePosition.y * 0.02 + Math.cos(time * 0.9) * 16}px) 
            rotate(${Math.sin(time * 0.7) * 6}deg)
          `,
          background: `
            conic-gradient(from ${time * 10}deg at ${50 + Math.sin(time * 0.3) * 10}% ${50 + Math.cos(time * 0.4) * 10}%, 
            rgba(172, 223, 127, 0.1), 
            rgba(255, 89, 48, 0.05), 
            rgba(252, 178, 0, 0.08), 
            rgba(131, 6, 152, 0.06), 
            rgba(124, 162, 253, 0.07), 
            rgba(172, 223, 127, 0.1))
          `,
          opacity: 0.6 + Math.sin(time * 0.4) * 0.2
        }}
      ></div>
      
      <div 
        className="parallax-bg creative-layer-2" 
        style={{
          transform: `
            translate(${mousePosition.x * -0.015 + Math.cos(time * 0.9) * 25}px, ${mousePosition.y * 0.015 + Math.sin(time * 0.8) * 20}px) 
            rotate(${Math.cos(time * 0.8) * 8}deg)
          `,
          background: `
            radial-gradient(ellipse at ${30 + Math.sin(time * 0.5) * 15}% ${70 + Math.cos(time * 0.6) * 12}%, 
            rgba(255, 89, 48, ${0.03 + Math.sin(time * 0.7) * 0.02}), 
            transparent 40%),
            radial-gradient(ellipse at ${70 + Math.cos(time * 0.7) * 18}% ${30 + Math.sin(time * 0.5) * 15}%, 
            rgba(124, 162, 253, ${0.04 + Math.cos(time * 0.8) * 0.02}), 
            transparent 50%)
          `,
          opacity: 0.4 + Math.cos(time * 0.6) * 0.3
        }}
      ></div>

      {/* Main Background */}
      <div 
        className="heroBg" 
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          background: `
            radial-gradient(${60 + Math.sin(time * 0.2) * 15}% ${80 + Math.cos(time * 0.3) * 10}% at 
            ${20 + Math.sin(time * 0.1) * 3}% ${20 + Math.cos(time * 0.15) * 2}%, 
            rgba(255, 89, 48, ${0.3 + Math.sin(time * 0.4) * 0.05}), transparent 50%),
            radial-gradient(${50 + Math.cos(time * 0.25) * 12}% ${70 + Math.sin(time * 0.2) * 8}% at 
            ${80 + Math.cos(time * 0.12) * 2}% ${30 + Math.sin(time * 0.18) * 3}%, 
            rgba(252, 178, 0, ${0.25 + Math.cos(time * 0.35) * 0.04}), transparent 50%),
            radial-gradient(${60 + Math.sin(time * 0.3) * 18}% ${90 + Math.cos(time * 0.25) * 12}% at 
            ${30 + Math.sin(time * 0.14) * 4}% ${70 + Math.cos(time * 0.16) * 3}%, 
            rgba(131, 6, 152, ${0.2 + Math.sin(time * 0.45) * 0.03}), transparent 60%),
            radial-gradient(${50 + Math.cos(time * 0.28) * 15}% ${80 + Math.sin(time * 0.22) * 10}% at 
            ${70 + Math.cos(time * 0.13) * 3}% ${80 + Math.sin(time * 0.17) * 4}%, 
            rgba(124, 162, 253, ${0.25 + Math.cos(time * 0.38) * 0.04}), transparent 60%),
            radial-gradient(${40 + Math.sin(time * 0.32) * 10}% ${60 + Math.cos(time * 0.26) * 8}% at 
            ${50 + Math.sin(time * 0.11) * 2}% ${50 + Math.cos(time * 0.19) * 2}%, 
            rgba(172, 223, 127, ${0.15 + Math.sin(time * 0.42) * 0.03}), transparent 70%),
            linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)
          `,
          filter: `saturate(${0.8 + Math.sin(time * 0.3) * 0.1}) brightness(${1.05 + Math.cos(time * 0.2) * 0.05})`,
          animation: 'breathe 6s ease-in-out infinite',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      ></div>

      <header>
        <div className="brand" onClick={() => router.push('/')}>Therma</div>
      </header>

      <main className="mx-auto max-w-screen-xl w-full px-4 safe-px safe-pt safe-pb min-h-[100svh] md:min-h-[100dvh]">
        <a href="/" className="back-link">Back to Home</a>
        
        <section className="faq-section safe-px">
          <div className="container mx-auto px-4 py-20 text-center">
            <div className="stack">
              <h1 className="faq-title">Frequently Asked Questions</h1>
              <div className="sp-8"></div>
              <h2 className="muted">Everything you need to know about Therma</h2>
              <div className="sp-24"></div>
              
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <div key={index} className={`faq-item ${activeFAQ === index ? 'active' : ''}`}>
                    <button 
                      className="faq-question" 
                      onClick={() => toggleFAQ(index)}
                    >
                      <span>{faq.question}</span>
                      <span className="faq-icon">+</span>
                    </button>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
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
            <a href="/contact">Contact Us</a> · 
            <a href="/">Home</a> · 
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
