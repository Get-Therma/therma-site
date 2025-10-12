'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
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
        <div className="brand" onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>Therma</div>
      </header>

      <main className="safe-py" style={{ minHeight: '100svh' }}>
        <div className="container safe-px" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            backdropFilter: 'blur(20px)', 
            borderRadius: '16px', 
            padding: '40px', 
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}>
            <h1 style={{ 
              fontFamily: 'PPPangaia, serif', 
              fontSize: '36px', 
              fontWeight: '400', 
              color: '#FFFFFF', 
              marginBottom: '32px',
              textAlign: 'center'
            }}>
              Privacy Policy
            </h1>
            
            <p style={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontSize: '16px', 
              lineHeight: '1.6', 
              marginBottom: '24px',
              fontFamily: 'PPPangaia, serif'
            }}>
              <strong>Last updated:</strong> January 2025
            </p>

            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', lineHeight: '1.6', fontFamily: 'PPPangaia, serif' }}>
              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>1. Introduction</h2>
              <p style={{ marginBottom: '16px' }}>
                Get Therma Inc. ("we," "our," or "us") operates the Therma mobile application and website (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
              </p>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>2. Information We Collect</h2>
              
              <h3 style={{ color: '#FFFFFF', fontSize: '20px', marginTop: '24px', marginBottom: '12px' }}>Personal Information</h3>
              <p style={{ marginBottom: '16px' }}>
                We collect information you provide directly to us, such as:
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li>Email address (for waitlist and account creation)</li>
                <li>Name and contact information</li>
                <li>Reflection entries and journal content</li>
                <li>AI conversation history</li>
                <li>App usage patterns and preferences</li>
              </ul>

              <h3 style={{ color: '#FFFFFF', fontSize: '20px', marginTop: '24px', marginBottom: '12px' }}>Usage Information</h3>
              <p style={{ marginBottom: '16px' }}>
                We automatically collect certain information about your use of the Service:
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li>Device information (device type, operating system, unique device identifiers)</li>
                <li>Log information (access times, pages viewed, IP address)</li>
                <li>App performance data and crash reports</li>
                <li>Analytics data to improve our Service</li>
              </ul>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>3. How We Use Your Information</h2>
              <p style={{ marginBottom: '16px' }}>
                We use the information we collect to:
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li>Provide, maintain, and improve our Service</li>
                <li>Process your waitlist registration and account creation</li>
                <li>Enable AI-powered reflection guidance and conversations</li>
                <li>Personalize your experience and content</li>
                <li>Send you important updates about the Service</li>
                <li>Analyze usage patterns to enhance functionality</li>
                <li>Ensure security and prevent fraud</li>
              </ul>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>4. Information Sharing and Disclosure</h2>
              <p style={{ marginBottom: '16px' }}>
                We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li><strong>Service Providers:</strong> We may share information with trusted third parties who assist us in operating our Service</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In the event of a merger or acquisition, user information may be transferred</li>
                <li><strong>Consent:</strong> We may share information with your explicit consent</li>
              </ul>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>5. Data Security</h2>
              <p style={{ marginBottom: '16px' }}>
                We implement appropriate security measures to protect your personal information:
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li>End-to-end encryption for sensitive data</li>
                <li>Secure data storage with industry-standard protocols</li>
                <li>Regular security audits and updates</li>
                <li>HIPAA-compliant infrastructure for health-related data</li>
                <li>Access controls and authentication measures</li>
              </ul>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>6. Your Rights and Choices</h2>
              <p style={{ marginBottom: '16px' }}>
                You have the following rights regarding your personal information:
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              </ul>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>7. Data Retention</h2>
              <p style={{ marginBottom: '16px' }}>
                We retain your personal information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy. We will delete your information when:
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li>You request account deletion</li>
                <li>The information is no longer necessary for our Service</li>
                <li>Legal retention periods expire</li>
              </ul>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>8. Children's Privacy</h2>
              <p style={{ marginBottom: '16px' }}>
                Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>9. International Users</h2>
              <p style={{ marginBottom: '16px' }}>
                If you are accessing our Service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located.
              </p>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>10. Changes to This Privacy Policy</h2>
              <p style={{ marginBottom: '16px' }}>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
              </p>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>11. Contact Us</h2>
              <p style={{ marginBottom: '16px' }}>
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div style={{ 
                background: 'rgba(255,255,255,0.05)', 
                padding: '20px', 
                borderRadius: '8px', 
                marginTop: '16px' 
              }}>
                <p style={{ marginBottom: '8px' }}><strong>Email:</strong> privacy@gettherma.ai</p>
                <p style={{ marginBottom: '8px' }}><strong>Support:</strong> support@gettherma.ai</p>
                <p style={{ marginBottom: '0' }}><strong>Company:</strong> Get Therma Inc.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ 
        background: 'rgba(0,0,0,0.3)', 
        backdropFilter: 'blur(20px)', 
        padding: '40px 20px 24px',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="footerWrap" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div className="footerBrand" style={{ 
              fontFamily: 'PPPangaia, serif', 
              fontSize: '24px', 
              fontWeight: '400', 
              color: '#FFFFFF' 
            }}>
              Therma
            </div>
            <div className="footerLinks" style={{ 
              display: 'flex', 
              gap: '32px',
              flexWrap: 'wrap'
            }}>
              <a href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Home</a>
              <a href="/contact" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Contact</a>
              <a href="/faq" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>FAQ</a>
              <a href="/terms" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Terms</a>
            </div>
          </div>
          <div className="caption" style={{ 
            textAlign: 'center', 
            marginTop: '24px', 
            color: 'rgba(255,255,255,0.5)', 
            fontSize: '12px',
            fontFamily: 'PPPangaia, serif'
          }}>
            © 2025 Get Therma Inc. All rights reserved
          </div>
        </div>
      </footer>
    </>
  );
}
