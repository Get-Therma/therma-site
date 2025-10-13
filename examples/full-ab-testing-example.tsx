// Example: How to integrate both headline and subheadline A/B testing
// This shows the pattern - you can apply this to your actual page.tsx

'use client';

import { useState, useEffect } from 'react';
import { ABTestHeadline, ABTestSubheadline } from '../components/ABTestText';

export default function HomePageWithFullABTesting() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [currentHeadlineVariant, setCurrentHeadlineVariant] = useState('');
  const [currentSubheadlineVariant, setCurrentSubheadlineVariant] = useState('');

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
        // Track conversion for both A/B tests
        console.log(`Conversion - Headline: ${currentHeadlineVariant}, Subheadline: ${currentSubheadlineVariant}`);
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
          {/* A/B Tested Headline */}
          <ABTestHeadline 
            className="hero-title"
            onVariantChange={setCurrentHeadlineVariant}
          />
          
          <div className="sp-8"></div>
          
          {/* A/B Tested Subheadline */}
          <ABTestSubheadline 
            className="muted"
            onVariantChange={setCurrentSubheadlineVariant}
          />
          
          <div className="sp-16"></div>
          
          {/* Rest of your form and content */}
          <form onSubmit={handleSubmit}>
            {/* Your form content */}
          </form>
        </div>
      </section>
    </main>
  );
}

// Alternative: Using the generic ABTestText component
export function AlternativeImplementation() {
  return (
    <main>
      <section id="hero" className="container center">
        <div className="stack">
          {/* Generic A/B Tested Text */}
          <ABTestText 
            testType="headline"
            tag="h1"
            className="hero-title"
          />
          
          <div className="sp-8"></div>
          
          <ABTestText 
            testType="subheadline"
            tag="h2"
            className="muted"
          />
          
          {/* Rest of your content */}
        </div>
      </section>
    </main>
  );
}
