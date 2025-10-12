'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
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

      <main style={{ padding: '120px 0 80px', minHeight: '100vh' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
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
              Terms & Conditions
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
              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>1. Acceptance of Terms</h2>
              <p style={{ marginBottom: '16px' }}>
                By accessing and using the Therma mobile application and website (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this Service.
              </p>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>2. Description of Service</h2>
              <p style={{ marginBottom: '16px' }}>
                Therma is a self-reflection and personal growth application that provides:
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li>Daily reflection prompts and guided exercises</li>
                <li>AI-powered conversation companion for personal insights</li>
                <li>Journaling tools and mood tracking</li>
                <li>Personalized recommendations for mental wellness</li>
                <li>Community features and sharing capabilities</li>
              </ul>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>3. User Accounts and Registration</h2>
              <p style={{ marginBottom: '16px' }}>
                To access certain features of the Service, you may be required to create an account. You agree to:
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>4. Acceptable Use</h2>
              <p style={{ marginBottom: '16px' }}>
                You agree not to use the Service to:
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Transmit harmful, threatening, or offensive content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the Service</li>
                <li>Use the Service for commercial purposes without permission</li>
              </ul>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>5. Content and Intellectual Property</h2>
              
              <h3 style={{ color: '#FFFFFF', fontSize: '20px', marginTop: '24px', marginBottom: '12px' }}>Your Content</h3>
              <p style={{ marginBottom: '16px' }}>
                You retain ownership of all content you create, upload, or share through the Service. By using the Service, you grant us a limited license to use, store, and process your content to provide the Service.
              </p>

              <h3 style={{ color: '#FFFFFF', fontSize: '20px', marginTop: '24px', marginBottom: '12px' }}>Our Content</h3>
              <p style={{ marginBottom: '16px' }}>
                The Service and its original content, features, and functionality are owned by Get Therma Inc. and are protected by international copyright, trademark, and other intellectual property laws.
              </p>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>6. Privacy and Data Protection</h2>
              <p style={{ marginBottom: '16px' }}>
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. We are committed to protecting your data and maintaining HIPAA-compliant practices.
              </p>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>7. Medical Disclaimer</h2>
              <p style={{ marginBottom: '16px' }}>
                <strong>Important:</strong> Therma is not a medical device or therapy service. The Service is designed for self-reflection and personal growth purposes only. It is not intended to:
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li>Diagnose, treat, cure, or prevent any medical condition</li>
                <li>Replace professional medical advice, diagnosis, or treatment</li>
                <li>Provide emergency mental health services</li>
              </ul>
              <p style={{ marginBottom: '16px' }}>
                If you are experiencing a mental health emergency, please contact your local emergency services or a mental health professional immediately.
              </p>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>8. Subscription and Payment</h2>
              <p style={{ marginBottom: '16px' }}>
                Some features of the Service may require a paid subscription. By subscribing, you agree to:
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li>Pay all applicable fees as described in the Service</li>
                <li>Provide accurate billing information</li>
                <li>Authorize us to charge your payment method</li>
                <li>Understand that subscriptions auto-renew unless cancelled</li>
              </ul>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>9. Service Availability</h2>
              <p style={{ marginBottom: '16px' }}>
                We strive to maintain the Service's availability but cannot guarantee uninterrupted access. We may:
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li>Perform scheduled maintenance</li>
                <li>Update or modify the Service</li>
                <li>Suspend access for technical reasons</li>
                <li>Discontinue features or the entire Service</li>
              </ul>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>10. Limitation of Liability</h2>
              <p style={{ marginBottom: '16px' }}>
                To the maximum extent permitted by law, Get Therma Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of the Service.
              </p>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>11. Indemnification</h2>
              <p style={{ marginBottom: '16px' }}>
                You agree to defend, indemnify, and hold harmless Get Therma Inc. and its officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the Service or violation of these Terms.
              </p>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>12. Termination</h2>
              <p style={{ marginBottom: '16px' }}>
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will cease immediately.
              </p>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>13. Governing Law</h2>
              <p style={{ marginBottom: '16px' }}>
                These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved in the courts of California.
              </p>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>14. Changes to Terms</h2>
              <p style={{ marginBottom: '16px' }}>
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
              </p>

              <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>15. Contact Information</h2>
              <p style={{ marginBottom: '16px' }}>
                If you have any questions about these Terms & Conditions, please contact us at:
              </p>
              <div style={{ 
                background: 'rgba(255,255,255,0.05)', 
                padding: '20px', 
                borderRadius: '8px', 
                marginTop: '16px' 
              }}>
                <p style={{ marginBottom: '8px' }}><strong>Email:</strong> legal@gettherma.ai</p>
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
              <a href="/privacy" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Privacy</a>
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
