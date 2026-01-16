'use client';

import { useEffect } from 'react';

type StickyCTAProps = {
  targetInputId?: string;
  buttonLabel?: string;
  helperText?: string;
};

export default function StickyCTA({
  targetInputId = 'waitlist-email',
  buttonLabel = 'Get Early Access',
  helperText = 'Limited beta spots',
}: StickyCTAProps) {
  useEffect(() => {
    document.body.classList.add('has-sticky-cta');
    return () => {
      document.body.classList.remove('has-sticky-cta');
    };
  }, []);

  const handleClick = () => {
    const el = document.getElementById(targetInputId) as HTMLInputElement | null;
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Slight delay so the scroll finishes before focusing on mobile Safari.
    window.setTimeout(() => el.focus(), 150);
  };

  return (
    <div className="stickyCtaBar" role="region" aria-label="Join the waitlist">
      <div className="stickyCtaInner">
        <div className="stickyCtaText">{helperText}</div>
        <button className="btn stickyCtaBtn" type="button" onClick={handleClick}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

