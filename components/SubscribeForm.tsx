'use client';

import { useState } from 'react';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle');
  const [message, setMessage] = useState<string>('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'Landing hero',
          utm_source: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_source') : undefined,
          utm_medium: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_medium') : undefined,
          utm_campaign: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') : undefined
        })
      });
      const data = await res.json();
      console.log('SubscribeForm response:', data);
      console.log('Response status:', res.status);
      console.log('Is duplicate?', data.duplicate);
      
      if (!res.ok) {
        // Handle duplicate email error specifically
        if (res.status === 409 && data.duplicate) {
          console.log('✅ Duplicate detected in SubscribeForm');
          // Show duplicate message first
          setStatus('error');
          setMessage('This email is already on our waitlist. Redirecting...');
          // Store email and duplicate flag, then redirect to thank-you page
          if (typeof window !== 'undefined') {
            localStorage.setItem('therma_submitted_email', email);
            localStorage.setItem('therma_is_duplicate', 'true');
            setTimeout(() => {
              window.location.href = '/already-registered';
            }, 2000);
          }
          return;
        }
        // Also check if the error message indicates duplicate
        const errorMsg = data?.error || data?.message || '';
        if (errorMsg.toLowerCase().includes('already') || 
            errorMsg.toLowerCase().includes('duplicate') ||
            errorMsg.toLowerCase().includes('exists')) {
          console.log('✅ Duplicate detected via error message:', errorMsg);
          setStatus('error');
          setMessage('This email is already on our waitlist. Redirecting...');
          if (typeof window !== 'undefined') {
            localStorage.setItem('therma_submitted_email', email);
            localStorage.setItem('therma_is_duplicate', 'true');
            setTimeout(() => {
              window.location.href = '/already-registered';
            }, 2000);
          }
          return;
        }
        throw new Error(errorMsg || 'Something went wrong');
      }
      
      // Clear duplicate flag for successful new subscriptions
      if (typeof window !== 'undefined') {
        localStorage.removeItem('therma_is_duplicate');
      }
      
      setStatus('ok');
      setEmail('');
      setMessage('Check your inbox to confirm your subscription.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong');
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '.5rem' }}>
      <label htmlFor="email" style={{ position: 'absolute', left: '-9999px' }}>Email</label>
      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@domain.com"
        autoComplete="email"
        style={{ padding: '0.9rem', borderRadius: 8, border: '1px solid #ddd' }}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        style={{ padding: '0.9rem 1rem', borderRadius: 8, border: '1px solid #000' }}
      >
        {status === 'loading' ? 'Joining…' : 'Get early access'}
      </button>
      {message && (
        <p style={{ gridColumn: '1 / -1', fontSize: '.9rem', margin: 0, color: status === 'error' ? '#b00020' : 'inherit' }}>
          {message}
        </p>
      )}
      <p style={{ gridColumn: '1 / -1', fontSize: '.8rem', opacity: .8, margin: 0 }}>
        By subscribing, you agree to our <a href="/(legal)/privacy">Privacy Policy</a> and <a href="/(legal)/beta-terms">Beta Terms</a>.
      </p>
    </form>
  );
}
