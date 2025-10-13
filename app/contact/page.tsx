'use client';

import { useState } from 'react';
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
  const router = useRouter();

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
        <div className="heroBg" aria-hidden="true"></div>

        <header>
          <div className="brand" style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>Therma</div>
        </header>

        <div className="header-spacer"></div>

        <main>
          <section className="container center">
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
                  ? 'Have questions about Therma? We\'re here to support you. Share your experience or ask anything on your mind.'
                  : 'Interested in partnerships or collaborations? Let\'s explore how we can work together and support each other\'s growth.'
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
      <div className="heroBg" aria-hidden="true"></div>

      <header>
        <div className="brand" style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>Therma</div>
      </header>

      <div className="header-spacer"></div>

      <main>
        <section className="container center">
          <div className="stack">
            <h1>We're here to listen.</h1>
            <div className="sp-8"></div>
            <h2 className="muted">Connect in the way that feels right for you.</h2>
            <div className="sp-24"></div>
            
            <div className="contact-options">
              <div className="contact-card" onClick={() => setFormType('general')}>
                <h3>General Contact</h3>
                <p>Have questions about Therma? We're here to support you. Share your experience or ask anything on your mind.</p>
                <button className="btn">Contact Us</button>
              </div>
              
              <div className="contact-card" onClick={() => setFormType('collaboration')}>
                <h3>Collaborations & Business</h3>
                <p>Interested in partnerships or collaborations? Let's explore how we can work together and support each other's growth.</p>
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
