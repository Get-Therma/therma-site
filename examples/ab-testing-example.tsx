// Example: How to integrate A/B testing into your main page
// This shows the pattern - you can apply this to your actual page.tsx

'use client';

import { useState, useEffect } from 'react';
import ABTestHeadline from '../components/ABTestHeadline';

export default function HomePageWithABTesting() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [currentVariant, setCurrentVariant] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (data.ok) {
        setStatus('success');
        // Track conversion for A/B test
        if (currentVariant) {
          // You can track this conversion back to your A/B test
          console.log(`Conversion for variant: ${currentVariant}`);
        }
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
      <section id="hero" className="container center">
        <div className="stack">
          {/* Replace the static h1 with A/B tested headline */}
          <ABTestHeadline 
            className="hero-title"
          />
          
          <div className="sp-8"></div>
          <h2 className="muted">
            Therma is a private, AI‑guided journaling app that turns your check‑ins, habits, and notes into pattern maps—highlighting bright spots to keep and frictions to tweak—so small changes add up to steadier weeks.
          </h2>
          
          {/* Rest of your form and content */}
          <form onSubmit={handleSubmit}>
            {/* Your form content */}
          </form>
        </div>
      </section>
    </main>
  );
}
