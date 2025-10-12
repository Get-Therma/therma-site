'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setStatus('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          utm_source: new URL(window.location.href).searchParams.get('utm_source') || document.referrer,
          utm_medium: new URL(window.location.href).searchParams.get('utm_medium') || 'website',
          utm_campaign: new URL(window.location.href).searchParams.get('utm_campaign') || 'waitlist'
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Waitlist submission successful:', result);
      localStorage.setItem('therma_submitted_email', email);
      setStatus('success');
      router.push('/thank-you');
    } catch (err) {
      console.error('Waitlist submission failed:', err);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        style={{
          padding: '0.75rem 1rem',
          border: '1px solid #ccc',
          borderRadius: '0.5rem',
          fontSize: '1rem',
          minWidth: '200px',
          flex: '1',
          maxWidth: '300px'
        }}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '0.5rem',
          fontSize: '1rem',
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}
      >
        {isSubmitting ? 'Joining...' : 'Get Early Access'}
      </button>
    </form>
  );
}
