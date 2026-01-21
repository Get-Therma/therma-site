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
  const [width, setWidth] = useState<number>(() => (typeof window === 'undefined' ? 1920 : window.innerWidth || 1920));

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth || 1920);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return width;
}

function Wordmark({ className }: { className?: string }) {
  // If you paste the Figma-generated svgPaths file, we can replace this with the exact vector wordmark.
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

  // NOTE: we reference SVG placeholders so you don't get broken images before you export real PNGs from Figma.
  const bgSrc = isMobile ? '/images/landing/hero-bg-mobile.svg' : '/images/landing/hero-bg-desktop.svg';

  return (
    <section className={styles.figmaHeroWrap} aria-label="Hero">
      <div className={isMobile ? styles.figmaHeroMobile : styles.figmaHeroDesktop}>
        <div className={isMobile ? styles.figmaBgMobile : styles.figmaBgDesktop} aria-hidden="true">
          <img className={styles.figmaBgImg} src={bgSrc} alt="" />
        </div>

        <div className={isMobile ? styles.figmaNavMobile : styles.figmaNavDesktop} aria-label="Site navigation">
          <Wordmark className={styles.figmaWordmark} />
          {!isMobile && (
            <a className={styles.figmaAboutLink} href="#about">
              About
            </a>
          )}
          <a className={styles.figmaDownloadBtn} href="#waitlist">
            Waitlist
          </a>
        </div>

        <div className={isMobile ? styles.figmaCopyMobile : styles.figmaCopyDesktop}>
          <h1 className={styles.figmaHeroHeadline}>Your space to slow down, check in, and feel supported.</h1>
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

        <div className={isMobile ? styles.figmaPhoneMobile : styles.figmaPhoneDesktop} aria-hidden="true">
          <img className={styles.figmaPhoneImg} src="/images/landing/hero-phone.svg" alt="" />
        </div>
      </div>
    </section>
  );
}