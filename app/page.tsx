'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import StickyCTA from '../components/StickyCTA';

const BENEFITS = [
  {
    icon: '/images/landing/benefit-streaks.svg',
    title: 'Streaks & Wins',
    desc: 'Tiny sparks to keep you moving\u2014never spammy, always skippable.',
  },
  {
    icon: '/images/landing/benefit-integrations.svg',
    title: 'Integrations',
    desc: 'Sync sleep and activity data from Oura and Apple Health to see what shapes your mood.',
  },
  {
    icon: '/images/landing/benefit-privacy.svg',
    title: 'Privacy First',
    desc: "End\u2011to\u2011end security, full export/delete controls. We don\u2019t sell your data. Ever.",
  },
  {
    icon: '/images/landing/benefit-reflection.svg',
    title: 'Daily Reflection Time',
    desc: 'A gentle, configurable reminder. Write as little or as much as you like.',
  },
  {
    icon: '/images/landing/benefit-quotes.svg',
    title: 'Quotes & Nudges',
    desc: 'Tiny sparks to keep you moving\u2014never spammy, always skippable.',
  },
];

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setStatus('');

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

      const responseClone = response.clone();
      let result;
      try {
        result = await response.json();
      } catch {
        await responseClone.text();
        setIsSubmitting(false);
        setStatus('error');
        return;
      }

      if (response.status === 409) {
        setStatus('duplicate');
        setIsSubmitting(false);
        localStorage.setItem('therma_submitted_email', email);
        localStorage.setItem('therma_is_duplicate', 'true');
        window.location.href = '/already-registered';
        return;
      }

      if (!response.ok) {
        if (
          result.message &&
          (result.message.toLowerCase().includes('already') ||
            result.message.toLowerCase().includes('duplicate') ||
            result.message.toLowerCase().includes('exists'))
        ) {
          setStatus('duplicate');
          localStorage.setItem('therma_submitted_email', email);
          localStorage.setItem('therma_is_duplicate', 'true');
          window.location.href = '/already-registered';
          return;
        }
        throw new Error(result.error || result.message || `Server error: ${response.status}`);
      }

      if (response.status === 200 || response.status === 201) {
        localStorage.removeItem('therma_is_duplicate');
        localStorage.setItem('therma_submitted_email', email);
        router.push('/thank-you');
      } else {
        setStatus('error');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      const errorMsg = err?.message || '';
      if (
        errorMsg.toLowerCase().includes('already') ||
        errorMsg.toLowerCase().includes('duplicate') ||
        errorMsg.toLowerCase().includes('exists')
      ) {
        setStatus('duplicate');
        localStorage.setItem('therma_submitted_email', email);
        localStorage.setItem('therma_is_duplicate', 'true');
        setTimeout(() => router.push('/already-registered'), 2000);
      } else {
        setStatus('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusText =
    status === 'success'
      ? "You\u2019re in. Redirecting\u2026"
      : status === 'duplicate'
        ? 'This email is already registered. Redirecting\u2026'
        : status === 'error'
          ? 'Something went wrong. Please try again.'
          : '';

  return (
    <div className={styles.page}>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.therma.one/' }],
          }),
        }}
      />

      {/* ==================== HERO ==================== */}
      <section className={styles.hero} aria-label="Hero">
        <div className={styles.heroDark} aria-hidden="true" />
        <nav className={styles.nav}>
          <img src="/images/landing/therma-wordmark.svg" alt="Therma" className={styles.wordmark} />
          <span className={styles.navLink}>Manifesto</span>
          <a href="#waitlist" className={styles.navBtn}>Download App</a>
        </nav>

        <div className={styles.heroContent}>
          <div className={styles.heroCopy}>
            <h1 className={styles.heroHeadline}>
              Your space to slow down, check in, and feel supported.
            </h1>
            <p className={styles.heroSub}>
              Daily reflections, gentle prompts, and an AI companion that listens &mdash; so you can actually hear yourself.
            </p>

            <form id="waitlist" className={styles.heroForm} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <input
                  id="waitlist-email"
                  className={styles.emailInput}
                  type="email"
                  placeholder="Leave your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button className={styles.joinBtn} type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting\u2026' : 'Join Waitlist'}
                </button>
              </div>
              <p className={styles.socialProof}>Loved by 10,000+ people building healthier habits</p>
              {statusText && (
                <p className={styles.statusMsg} role="status">
                  {statusText}
                </p>
              )}
            </form>
          </div>

          <div className={styles.heroPhone} aria-hidden="true">
            <img src="/images/landing/hero-phone.png" alt="" />
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className={styles.features} aria-label="Features">
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Where Therma meets your day</h2>

          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <span className={styles.featureLabel}>Check in</span>
              <p className={styles.featureDesc}>A 10&#x2011;second mood ring</p>
              <div className={styles.featureImgWrap}>
                <img src="/images/landing/feature-checkin.png" alt="Check in screen" />
              </div>
            </div>

            <div className={styles.featureCard}>
              <span className={styles.featureLabel}>Reflect</span>
              <p className={styles.featureDesc}>Guided prompts and a private journaling space to untangle thoughts</p>
              <div className={styles.featureImgWrap}>
                <img src="/images/landing/feature-reflect.png" alt="Reflect screen" />
              </div>
            </div>

            <div className={styles.featureCard}>
              <span className={styles.featureLabel}>Feel Supported</span>
              <p className={styles.featureDesc}>Chat with the Companion when you need a nudge, idea, or just someone to listen.</p>
              <div className={styles.featureImgWrap}>
                <img src="/images/landing/feature-supported.png" alt="Companion chat screen" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== BENEFITS ==================== */}
      <section className={styles.benefits} aria-label="Benefits">
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Our benefits</h2>

          <div className={styles.benefitGrid}>
            {BENEFITS.map((b) => (
              <div key={b.title} className={styles.benefitCard}>
                <img src={b.icon} alt="" className={styles.benefitIcon} />
                <h3 className={styles.benefitTitle}>{b.title}</h3>
                <p className={styles.benefitDesc}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PROBLEM / APPROACH / RESULT ==================== */}
      <section className={styles.approach} aria-label="Our approach">
        <div className={styles.sectionInner}>
          <div className={styles.approachPhoto}>
            <img src="/images/landing/section-photo.png" alt="Person reflecting" />
          </div>

          <div className={styles.approachGrid}>
            <div>
              <h3 className={styles.approachLabel}>The problem</h3>
              <p className={styles.approachText}>
                We live in a world that moves too fast. Stress, endless notifications, and constant pressure leave little
                space to pause. Many of us fall into patterns &mdash; overthinking, spiraling, or ignoring our emotions
                &mdash; without even noticing.
              </p>
            </div>
            <div>
              <h3 className={styles.approachLabel}>Our approach</h3>
              <p className={styles.approachText}>
                Therma creates a pocket of calm in your day. With gentle prompts, guided reflections, and an empathetic
                AI companion, you&apos;re encouraged to slow down, check in, and give yourself a moment of clarity.
                It&apos;s not about doing more &mdash; it&apos;s about noticing more.
              </p>
            </div>
            <div>
              <h3 className={styles.approachLabel}>The result</h3>
              <p className={styles.approachText}>
                A simple daily practice that actually sticks. Over time, small check-ins add up to meaningful change:
                better self-awareness, healthier habits, and a steadier mind. With Therma, you don&apos;t just reflect
                &mdash; you reset.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className={styles.finalCta} aria-label="Call to action">
        <div className={styles.sectionInner}>
          <p className={styles.ctaKicker}>Join 1,000+ already checking in daily</p>
          <h2 className={styles.ctaTitle}>Ready for a gentler way to check in?</h2>
          <p className={styles.ctaSub}>
            End&#x2011;to&#x2011;end security, full export/delete controls. We don&apos;t sell your data. Ever.
          </p>
          <a href="#waitlist" className={styles.ctaBtn}>Join Waitlist</a>

          <div className={styles.ctaPhone} aria-hidden="true">
            <img src="/images/landing/cta-phone.png" alt="" />
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <img src="/images/landing/footer-logo.svg" alt="Therma" className={styles.footerLogo} />
          <p className={styles.footerTagline}>Therma helps you make space for yourself</p>
          <div className={styles.footerLinks}>
            <a href="/privacy">Privacy</a>
            <span className={styles.footerDot}>&middot;</span>
            <a href="/beta-terms">Terms of Use</a>
          </div>
          <p className={styles.footerCopy}>&copy; {new Date().getFullYear()} All rights reserved</p>
        </div>
      </footer>

      <StickyCTA targetInputId="waitlist-email" buttonLabel="Join Waitlist" helperText="Priority beta invites" />
    </div>
  );
}
