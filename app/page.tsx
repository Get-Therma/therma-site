'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StickyCTA from '../components/StickyCTA';
import ABTestHeadline from '../components/ABTestHeadline';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);
    setStatus('');

    try {
      console.log('📧 Submitting email:', email);
      
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

      console.log('📡 Response status:', response.status);
      
      // Clone response to avoid consuming the body
      const responseClone = response.clone();
      let result;
      try {
        result = await response.json();
        console.log('📦 Response data:', result);
        console.log('🔍 Is duplicate?', result.duplicate);
      } catch (parseError) {
        console.error('❌ Failed to parse response:', parseError);
        // Use cloned response to read text since original body is consumed
        const text = await responseClone.text();
        console.error('Raw response:', text);
        setIsSubmitting(false);
        setStatus('error');
        return; // Stop here if we can't parse
      }

      // Handle 409 status (duplicate) - MUST return early to stop processing
      if (response.status === 409) {
        console.log('🚫 DUPLICATE DETECTED - Stopping submission immediately');
        console.log('   Status: 409 Conflict');
        console.log('   Duplicate flag:', result.duplicate);
        console.log('   Response data:', result);
        
        // Set duplicate status and stop immediately
        setStatus('duplicate');
        setIsSubmitting(false); // Re-enable form immediately
        localStorage.setItem('therma_submitted_email', email);
        localStorage.setItem('therma_is_duplicate', 'true');
        
        // Redirect immediately to already-registered page
        console.log('🔄 Redirecting to /already-registered page');
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
          console.log('✅ Duplicate detected via error message:', result.message);
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
        
        // Redirect to thank you page using Next.js router
        router.push('/thank-you');
      } else {
        // Unexpected success status - log it
        console.warn('⚠️ Unexpected success status:', response.status);
        setStatus('error');
        setIsSubmitting(false);
      }
      
    } catch (err: any) {
      console.error('Form submission error:', err);
      console.error('Error message:', err?.message);
      // Check if error message indicates duplicate
      const errorMsg = err?.message || '';
      if (errorMsg.toLowerCase().includes('already') || 
          errorMsg.toLowerCase().includes('duplicate') ||
          errorMsg.toLowerCase().includes('exists')) {
        console.log('✅ Duplicate detected via catch block:', errorMsg);
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

      <header className="header-centered">
        <div style={{ flex: 1 }}></div>
        <div className="brand">Therma</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
          <a
            href="https://x.com/gettherma"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-link twitter-link"
            aria-label="Follow us on Twitter"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/gettherma/"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-link"
            aria-label="Follow us on Instagram"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </a>
          <a
            href="https://www.pinterest.com/gettherma/"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-link"
            aria-label="Follow us on Pinterest"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/company/gettherma/"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-link"
            aria-label="Follow us on LinkedIn"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </a>
          <a
            href="https://www.youtube.com/@gettherma"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-link"
            aria-label="Follow us on YouTube"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </a>
        </div>
      </header>

      <div className="header-spacer"></div>

      <main>
        {/* Breadcrumb Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://www.therma.one/"
                }
              ]
            })
          }}
        />
        
        <section id="hero" className="container center" aria-label="Hero section">
          <div className="stack">
            <ABTestHeadline />
            <div className="sp-12"></div>
            <div>
              <a href="/weekly" className="btn-secondary">Explore Therma Weekly ⟶</a>
            </div>
            
            <form className="stack" style={{ gap: '12px' }} onSubmit={handleSubmit}>
              <div className="pillInput">
                <input 
                  id="waitlist-email"
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <p className="social-proof">
                Get priority beta access (rolling invites) + early perks + Therma Weekly
              </p>
              <p className="trust-note">
                No spam. Unsubscribe anytime. We don&apos;t sell your data.{' '}
                <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a>
              </p>
              <div className="sp-8"></div>
              <div>
                <button 
                  className="btn" 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting…' : 'Get Early Access'}
                </button>
              </div>
              {(status === 'success' || status === 'error' || status === 'duplicate') && (
                <div 
                  className={`status-message ${status === 'success' ? 'success' : status === 'error' ? 'error' : status === 'duplicate' ? 'duplicate' : ''}`}
                  role="status"
                  style={{ 
                    marginTop: '12px',
                    padding: '16px',
                    borderRadius: '8px',
                    backgroundColor: status === 'duplicate' ? 'rgba(251, 191, 36, 0.15)' : 'transparent',
                    border: status === 'duplicate' ? '2px solid #fbbf24' : 'none',
                    fontSize: '16px',
                    fontWeight: status === 'duplicate' ? '500' : 'normal'
                  }}
                >
                  {status === 'success' && '✅ Thank you! You\'ve been added to the waitlist.'}
                  {status === 'error' && '❌ Something went wrong. Please try again.'}
                  {status === 'duplicate' && '⚠️ This email is already registered. Redirecting...'}
                </div>
              )}
            </form>
          </div>
        </section>
        
        {/* Breathing Divider */}
        <div className="breathing-divider" aria-hidden="true"></div>
        
        {/* Why Therma Section */}
        <section id="why" className="container center" aria-label="Why Therma section">
          <div className="stack">
            <h2 className="why-section-title">Why Therma?</h2>
            <p className="why-section-subtitle">Therma finds the hidden patterns in your daily life and turns them into clear, actionable insights</p>
            
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
        <section id="how-it-works" className="container center" aria-label="How it works section">
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
        <section id="who-its-for" className="container center" aria-label="Who it's for section">
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
        <section id="faq-preview" className="container center" aria-label="FAQ preview section">
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
              <a href="/privacy">Privacy</a> · 
              <a href="/terms">Terms of Use</a>
            </p>
          <div className="sp-16"></div>
          <p className="caption">2025. All rights reserved</p>
        </div>
      </footer>

      <StickyCTA targetInputId="waitlist-email" />
    </>
  );
}