'use client';

import { useEffect, useMemo, useState } from 'react';

type FigmaHeroProps = {
  email: string;
  setEmail: (v: string) => void;
  isSubmitting: boolean;
  status: '' | 'success' | 'error' | 'duplicate' | string;
  onSubmit: (e: React.FormEvent) => void;
  styles: Record<string, string>;
};

function useViewportWidth() {
  const [width, setWidth] = useState<number>(() => {
    // Default to desktop on first client render to avoid layout jump.
    if (typeof window === 'undefined') return 1920;
    return window.innerWidth || 1920;
  });

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth || 1920);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return width;
}

function Wordmark({ className }: { className?: string }) {
  // NOTE: Your Figma export references `svgPaths` (a separate generated file).
  // If you paste that file contents, we can replace this with the exact wordmark.
  return (
    <div className={className} aria-label="Therma">
      Therma
    </div>
  );
}

export default function FigmaHero({ email, setEmail, isSubmitting, status, onSubmit, styles }: FigmaHeroProps) {
  const width = useViewportWidth();
  const isMobile = width < 1440;

  const statusText = useMemo(() => {
    if (!status) return '';
    if (status === 'success') return "You're in. Redirecting…";
    if (status === 'duplicate') return 'This email is already registered. Redirecting…';
    if (status === 'error') return 'Something went wrong. Please try again.';
    return String(status);
  }, [status]);

  if (isMobile) {
    return (
      <section className={styles.figmaHeroWrap} aria-label="Hero">
        <div className={styles.figmaHeroMobile}>
          <div className={styles.figmaBgMobile} aria-hidden="true">
            <img className={styles.figmaBgImg} src="/images/landing/hero-bg-mobile.png" alt="" />
          </div>

          <div className={styles.figmaNavMobile} aria-label="Site navigation">
            <Wordmark className={styles.figmaWordmark} />
            <a className={styles.figmaDownloadBtn} href="#waitlist">
              Waitlist
            </a>
          </div>

          <div className={styles.figmaCopyMobile}>
            <p className={styles.figmaHeroHeadline}>Your space to slow down, check in, and feel supported.</p>
            <p className={styles.figmaHeroSubcopy}>
              Daily reflections, gentle prompts, and an AI companion that listens — so you can actually hear yourself.
            </p>

            <form id="waitlist" className={styles.figmaForm} onSubmit={onSubmit}>
              <div className={styles.figmaFormRow}>
                <input
                  id="waitlist-email"
                  className={styles.figmaEmail}
                  type="email"
                  placeholder="Leave your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button className={styles.figmaJoinBtn} type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting…' : 'Join Waitlist'}
                </button>
              </div>
              <p className={styles.figmaSocialProof}>Loved by 10,000+ people building healthier habits</p>
              {statusText && (
                <p className={styles.figmaStatus} role="status">
                  {statusText}
                </p>
              )}
            </form>
          </div>

          <div className={styles.figmaPhoneMobile} aria-hidden="true">
            <img className={styles.figmaPhoneImg} src="/images/landing/hero-phone.png" alt="" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.figmaHeroWrap} aria-label="Hero">
      <div className={styles.figmaHeroDesktop}>
        <div className={styles.figmaBgDesktop} aria-hidden="true">
          <img className={styles.figmaBgImg} src="/images/landing/hero-bg-desktop.png" alt="" />
        </div>

        <div className={styles.figmaNavDesktop} aria-label="Site navigation">
          <Wordmark className={styles.figmaWordmark} />
          <a className={styles.figmaAboutLink} href="#about">
            About
          </a>
          <a className={styles.figmaDownloadBtn} href="#waitlist">
            Waitlist
          </a>
        </div>

        <div className={styles.figmaCopyDesktop}>
          <p className={styles.figmaHeroHeadline}>Your space to slow down, check in, and feel supported.</p>
          <p className={styles.figmaHeroSubcopy}>
            Daily reflections, gentle prompts, and an AI companion that listens — so you can actually hear yourself.
          </p>

          <form id="waitlist" className={styles.figmaForm} onSubmit={onSubmit}>
            <div className={styles.figmaFormRow}>
              <input
                id="waitlist-email"
                className={styles.figmaEmail}
                type="email"
                placeholder="Leave your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className={styles.figmaJoinBtn} type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting…' : 'Join Waitlist'}
              </button>
            </div>
            <p className={styles.figmaSocialProof}>Loved by 10,000+ people building healthier habits</p>
            {statusText && (
              <p className={styles.figmaStatus} role="status">
                {statusText}
              </p>
            )}
          </form>
        </div>

        <div className={styles.figmaPhoneDesktop} aria-hidden="true">
          <img className={styles.figmaPhoneImg} src="/images/landing/hero-phone.png" alt="" />
        </div>
      </div>
    </section>
  );
}

