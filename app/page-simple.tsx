'use client';

import { useState } from 'react';
import ABTestHeadline from '../components/ABTestHeadline';
import ABTestSubheadline from '../components/ABTestSubheadline';
import ScrollIndicator from '../components/ScrollIndicator';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setStatus('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 409 && data.duplicate) {
          // Handle duplicate - show message then redirect to thank you page
          setStatus('duplicate');
          if (typeof window !== 'undefined') {
            localStorage.setItem('therma_submitted_email', email);
            localStorage.setItem('therma_is_duplicate', 'true');
            setTimeout(() => {
              window.location.href = '/already-registered';
            }, 2000);
          }
          return;
        }
        setStatus('error');
        return;
      }
      
      if (data.ok) {
        // Clear duplicate flag for successful new subscriptions
        if (typeof window !== 'undefined') {
          localStorage.removeItem('therma_is_duplicate');
        }
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <div id="hero" className="container">
        <div className="stack">
          <ABTestHeadline />
          <ABTestSubheadline />
          
          <form onSubmit={handleSubmit} style={{ gap: '12px' }}>
            <div className="pillInput">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isSubmitting}
              />
              <button type="submit" className="btn" disabled={isSubmitting}>
                {isSubmitting ? 'Joining...' : 'Join the Waitlist'}
              </button>
            </div>
          </form>
          
          <ScrollIndicator />
          
          {status === 'success' && (
            <p style={{ color: 'green', marginTop: '16px' }}>
              ✅ Successfully joined the waitlist!
            </p>
          )}
          
          {status === 'duplicate' && (
            <p style={{ color: '#fbbf24', marginTop: '16px', fontWeight: 500 }}>
              ⚠️ This email is already on our waitlist. Redirecting...
            </p>
          )}
          
          {status === 'error' && (
            <p style={{ color: 'red', marginTop: '16px' }}>
              ❌ Something went wrong. Please try again.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
