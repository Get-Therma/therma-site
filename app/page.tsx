'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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
          source: 'Website',
          utm_source: new URL(window.location.href).searchParams.get('utm_source') || document.referrer,
          utm_medium: new URL(window.location.href).searchParams.get('utm_medium') || 'website',
          utm_campaign: new URL(window.location.href).searchParams.get('utm_campaign') || 'waitlist'
        })
      });

      const result = await response.json();
      console.log('Subscription response:', result);

      if (!response.ok) {
        if (response.status === 409 && result.duplicate) {
          // Handle duplicate email gracefully
          console.log('Email already exists:', result.message);
          localStorage.setItem('therma_submitted_email', email);
          router.push('/thank-you');
          return;
        }
        throw new Error(result.error || `Server error: ${response.status}`);
      }
      
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
        {/* Logo moved to center of hero section */}
      </header>

      <div className="header-spacer"></div>

      <main>
        <section id="hero" className="container center">
          <div className="stack">
            <div className="heroLogo">Therma</div>
            <div className="sp-16"></div>
            <h1>Discover Your Patterns.<br/>Optimize Your Routine.</h1>
            <div className="sp-8"></div>
            <h2 className="muted">Therma finds the hidden patterns in your daily life<br/>and turns them into clear, actionable insights.<br/>Fine-tune your habits for peak energy, clarity, and confidence—<br/>making every week better than the last.</h2>
            <div className="sp-16"></div>
            <div>
              <a href="/weekly" className="btn-secondary">Explore Therma Weekly ⟶</a>
            </div>
            
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
          <p className="caption">2025. All rights reserved</p>
        </div>
      </footer>
    </>
  );
}