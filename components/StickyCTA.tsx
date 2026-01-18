'use client';

import { useEffect, useMemo, useState } from 'react';

type StickyCTAProps = {
  targetInputId?: string;
  buttonLabel?: string;
  helperText?: string;
};

export default function StickyCTA({
  targetInputId = 'waitlist-email',
  buttonLabel = 'Get Early Access',
  helperText = 'Priority beta invites',
}: StickyCTAProps) {
  const [isTargetInView, setIsTargetInView] = useState(false);
  const [isFormFocused, setIsFormFocused] = useState(false);

  const hidden = useMemo(() => isTargetInView || isFormFocused, [isTargetInView, isFormFocused]);

  useEffect(() => {
    document.body.classList.add('has-sticky-cta');
    return () => {
      document.body.classList.remove('has-sticky-cta');
    };
  }, []);

  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const tag = t.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || t.isContentEditable) {
        setIsFormFocused(true);
      }
    };
    const onFocusOut = () => {
      // Give iOS a beat to settle focus transitions before showing again.
      window.setTimeout(() => setIsFormFocused(false), 80);
    };
    document.addEventListener('focusin', onFocusIn, { passive: true } as any);
    document.addEventListener('focusout', onFocusOut, { passive: true } as any);
    return () => {
      document.removeEventListener('focusin', onFocusIn as any);
      document.removeEventListener('focusout', onFocusOut as any);
    };
  }, []);

  useEffect(() => {
    const el = document.getElementById(targetInputId);
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsTargetInView(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [targetInputId]);

  const handleClick = () => {
    const el = document.getElementById(targetInputId) as HTMLInputElement | null;
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Slight delay so the scroll finishes before focusing on mobile Safari.
    window.setTimeout(() => el.focus(), 150);
  };

  return (
    <div
      className="stickyCtaBar"
      role="region"
      aria-label="Join the waitlist"
      data-hidden={hidden ? 'true' : 'false'}
      aria-hidden={hidden}
    >
      <div className="stickyCtaInner">
        <div className="stickyCtaText">{helperText}</div>
        <button className="btn stickyCtaBtn" type="button" onClick={handleClick}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

