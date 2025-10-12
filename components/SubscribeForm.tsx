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
      if (!res.ok) throw new Error(data?.error || 'Something went wrong');
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
