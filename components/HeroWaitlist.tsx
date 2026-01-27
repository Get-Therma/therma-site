'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ABTestHeadline from './ABTestHeadline';

type Status = 'idle' | 'submitting' | 'error' | 'duplicate';

export default function HeroWaitlist() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement | null>(null);

  const onFocusEmail = () => {
    // On iOS, focusing inputs can shift the viewport; keep the form centered.
    window.setTimeout(() => {
      emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'submitting') return;

    setStatus('submitting');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'Website',
          utm_source: new URL(window.location.href).searchParams.get('utm_source') || document.referrer,
          utm_medium: new URL(window.location.href).searchParams.get('utm_medium') || 'website',
          utm_campaign: new URL(window.location.href).searchParams.get('utm_campaign') || 'waitlist',
        }),
      });

      const data = await response.json().catch(() => ({} as any));
      const msg = String(data?.message || data?.error || '');

      if (response.status === 409 || data?.duplicate || msg.toLowerCase().includes('already') || msg.toLowerCase().includes('duplicate')) {
        localStorage.setItem('therma_submitted_email', email);
        localStorage.setItem('therma_is_duplicate', 'true');
        setStatus('duplicate');
        setMessage("You're already on the waitlist — redirecting…");
        window.location.href = '/already-registered';
        return;
      }

      if (!response.ok) {
        throw new Error(msg || `Server error: ${response.status}`);
      }

      localStorage.removeItem('therma_is_duplicate');
      localStorage.setItem('therma_submitted_email', email);
      router.push('/thank-you');
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setStatus((prev) => (prev === 'submitting' ? 'idle' : prev));
    }
  };

  return (
    <div className="stack">
      <ABTestHeadline className="hero-headline" />

      <form className="stack heroWaitlistForm" onSubmit={handleSubmit}>
        <div className="pillInput">
          <input
            ref={emailRef}
            id="waitlist-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={onFocusEmail}
            autoComplete="email"
            inputMode="email"
            required
          />
        </div>

        <p className="social-proof">Get priority beta access (rolling invites) + early perks + Therma Weekly</p>
        <p className="trust-note">
          No spam. Unsubscribe anytime. We don&apos;t sell your data. Export/delete on request. <a href="/privacy">Privacy</a> ·{' '}
          <a href="/terms">Terms</a>
        </p>

        <div className="heroWaitlistCtas">
          <button className="btn" type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Submitting…' : 'Join the Waitlist'}
          </button>
          <a href="/weekly" className="btn-secondary" aria-label="Explore Therma Weekly">
            Explore Therma Weekly ⟶
          </a>
        </div>

        {message && (
          <div
            className={`status-message ${status === 'error' ? 'error' : status === 'duplicate' ? 'duplicate' : ''}`}
            role="status"
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

