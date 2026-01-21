'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StickyCTA from '../components/StickyCTA';
import styles from './page.module.css';
import FigmaHero from '../components/landing/FigmaHero';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);
    setStatus('');
    let isRedirectingAfterSuccess = false;

    try {
      console.log('📧 Submitting email:', email);
      
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          source: 'Website',
          utm_source: new URL(window.location.href).searchParams.get('utm_source') || document.referrer,
          utm_medium: new URL(window.location.href).searchParams.get('utm_medium') || 'website',
          utm_campaign: new URL(window.location.href).searchParams.get('utm_campaign') || 'waitlist'
        })
      });

      console.log('📡 Response status:', response.status);
      
      // Clone response to avoid consuming the body
      const responseClone = response.clone();
      let result;
      try {
        result = await response.json();
        console.log('📦 Response data:', result);
        console.log('🔍 Is duplicate?', result.duplicate);
      } catch (parseError) {
        console.error('❌ Failed to parse response:', parseError);
        // Use cloned response to read text since original body is consumed
        const text = await responseClone.text();
        console.error('Raw response:', text);
        setIsSubmitting(false);
        setStatus('error');
        return; // Stop here if we can't parse
      }

      // Handle 409 status (duplicate) - MUST return early to stop processing
      if (response.status === 409) {
        console.log('🚫 DUPLICATE DETECTED - Stopping submission immediately');
        console.log('   Status: 409 Conflict');
        console.log('   Duplicate flag:', result.duplicate);
        console.log('   Response data:', result);
        
        // Set duplicate status and stop immediately
        setStatus('duplicate');
        setIsSubmitting(false); // Re-enable form immediately
        localStorage.setItem('therma_submitted_email', email);
        localStorage.setItem('therma_is_duplicate', 'true');
        
        // Redirect immediately to already-registered page
        console.log('🔄 Redirecting to /already-registered page');
        // Use window.location for immediate redirect
        window.location.href = '/already-registered';
        
        return; // CRITICAL: Stop here, don't continue processing
      }

      if (!response.ok) {
        // Also check if the error message indicates duplicate
        if (result.message && (
          result.message.toLowerCase().includes('already') || 
          result.message.toLowerCase().includes('duplicate') ||
          result.message.toLowerCase().includes('exists')
        )) {
          console.log('✅ Duplicate detected via error message:', result.message);
          setStatus('duplicate');
          localStorage.setItem('therma_submitted_email', email);
          localStorage.setItem('therma_is_duplicate', 'true');
          // Redirect immediately
          window.location.href = '/already-registered';
          return;
        }
        throw new Error(result.error || result.message || `Server error: ${response.status}`);
      }
      
      // Only process success if status is 200/201 (not 409)
      if (response.status === 200 || response.status === 201) {
        // Show success state briefly so the user gets immediate feedback before redirect.
        setStatus('success');
        // Keep the submit button disabled until navigation happens.
        isRedirectingAfterSuccess = true;

        // Clear duplicate flag for successful new subscriptions
        localStorage.removeItem('therma_is_duplicate');
        
        // Store email for thank you page
        localStorage.setItem('therma_submitted_email', email);
        
        // Redirect to thank you page using Next.js router (small delay so success message can render)
        window.setTimeout(() => {
          router.push('/thank-you');
        }, 350);
      } else {
        // Unexpected success status - log it
        console.warn('⚠️ Unexpected success status:', response.status);
        setStatus('error');
        setIsSubmitting(false);
      }
      
    } catch (err: any) {
      console.error('Form submission error:', err);
      console.error('Error message:', err?.message);
      // Check if error message indicates duplicate
      const errorMsg = err?.message || '';
      if (errorMsg.toLowerCase().includes('already') || 
          errorMsg.toLowerCase().includes('duplicate') ||
          errorMsg.toLowerCase().includes('exists')) {
        console.log('✅ Duplicate detected via catch block:', errorMsg);
        setStatus('duplicate');
        localStorage.setItem('therma_submitted_email', email);
        localStorage.setItem('therma_is_duplicate', 'true');
        setTimeout(() => {
          router.push('/already-registered');
        }, 2000);
      } else {
        setStatus('error');
      }
    } finally {
      if (!isRedirectingAfterSuccess) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className={styles.page}>
      <main>
        {/* Breadcrumb Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://www.therma.one/"
                }
              ]
            })
          }}
        />

        <FigmaHero
          email={email}
          setEmail={setEmail}
          isSubmitting={isSubmitting}
          status={status as any}
          onSubmit={handleSubmit}
          styles={styles as any}
        />

        <section className={styles.section} aria-label="Where Therma meets your day">
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Where Therma meets your day</h2>
            <p className={styles.sectionLead}>
              Quick check-ins, gentle prompts, and simple patterns—built to help you notice what you feel.
            </p>

            <div className={styles.cards2}>
              <div className={styles.softCard}>
                <h3 className={styles.softCardTitle}>Check in</h3>
                <p className={styles.softCardText}>A 15-second mood ring to name what’s present.</p>
                <div className={styles.miniShot}>
                  <img src="/images/landing/check-in.svg" alt="Check in screen preview" />
                </div>
              </div>

              <div className={styles.softCard}>
                <h3 className={styles.softCardTitle}>Reflect</h3>
                <p className={styles.softCardText}>Guided prompts to process your day and spot patterns.</p>
                <div className={styles.miniShot}>
                  <img src="/images/landing/reflect.svg" alt="Reflect screen preview" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionAlt}`} aria-label="Testimonials">
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>What others say</h2>
            <p className={styles.sectionLead}>A few early reactions from people who’ve tried the flow.</p>

            <div className={styles.testimonials}>
              {[
                { quote: '“It helped me name what I was feeling without spiraling.”', meta: 'Early user' },
                { quote: '“The prompts are gentle but surprisingly clarifying.”', meta: 'Beta tester' },
                { quote: '“I finally have a simple way to check in daily.”', meta: 'Early user' },
                { quote: '“The pattern view made my weeks make sense.”', meta: 'Beta tester' },
                { quote: '“It feels supportive, not clinical.”', meta: 'Early user' },
                { quote: '“I use it at night—two minutes, done.”', meta: 'Beta tester' },
              ].map((t, idx) => (
                <div key={idx} className={styles.quoteCard}>
                  <p className={styles.quoteText}>{t.quote}</p>
                  <div className={styles.quoteMeta}>{t.meta}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} aria-label="Benefits">
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Our benefits</h2>
            <p className={styles.sectionLead}>Small, steady support you can actually stick with.</p>

            <div className={styles.benefits}>
              {[
                { title: 'Streaks & Wins', text: 'Tiny momentum that feels good.', color: 'rgba(124, 162, 253, 0.65)' },
                { title: 'Integration', text: 'Bring your notes together.', color: 'rgba(172, 223, 127, 0.65)' },
                { title: 'Personalize', text: 'Make it yours over time.', color: 'rgba(255, 200, 140, 0.65)' },
                { title: 'Daily Reflection Time', text: 'A calm ritual you can keep.', color: 'rgba(255, 110, 56, 0.60)' },
                { title: 'Quotes & Nudges', text: 'Gentle reminders, not pressure.', color: 'rgba(131, 6, 152, 0.45)' },
                { title: 'Privacy-first', text: 'Your space stays yours.', color: 'rgba(20, 20, 20, 0.16)' },
              ].map((b, idx) => (
                <div key={idx} className={styles.benefitItem}>
                  <div className={styles.benefitDot} style={{ background: b.color }} aria-hidden="true" />
                  <h3 className={styles.benefitTitle}>{b.title}</h3>
                  <p className={styles.benefitText}>{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.photoBand} aria-label="Story">
          <div className={styles.container}>
            <div className={styles.heroPhoto}>
              <img src="/images/landing/community.svg" alt="People connecting" />
            </div>

            <div className={styles.trio} id="about">
              <div>
                <h3>The problem</h3>
                <p>Most tools try to “fix” emotions. You don’t need fixing—you need clarity.</p>
              </div>
              <div>
                <h3>Our approach</h3>
                <p>Quick check-ins and guided prompts that help you observe without judgment.</p>
              </div>
              <div>
                <h3>The result</h3>
                <p>Better self-awareness, calmer decisions, and patterns you can act on.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.finalCtaBand} aria-label="Final call to action">
          <div className={styles.container}>
            <div className={styles.finalCard}>
              <h2>Ready for a gentler way to check in?</h2>
              <p>Join the waitlist for early access, product walkthroughs, and reflection tools.</p>
              <div className={styles.finalBtnRow}>
                <a className={styles.finalBtn} href="#waitlist">
                  Join the Waitlist
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerBrand}>Therma</div>
          <div className={styles.footerLinks}>
            <a href="/contact">Contact</a>
            <a href="/faq">FAQ</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="https://x.com/gettherma" target="_blank" rel="noopener noreferrer">
              X
            </a>
            <a href="https://www.instagram.com/gettherma/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
          <div className={styles.footerCopy}>© {new Date().getFullYear()} Therma. All rights reserved.</div>
        </div>
      </footer>

      <StickyCTA targetInputId="waitlist-email" />
    </div>
  );
}