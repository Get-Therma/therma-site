import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '../legal.module.css';

export const metadata: Metadata = {
  title: 'Terms of Service · Therma',
  description:
    'Terms of Service for Therma: Emotional Wellness by Get Therma Inc.',
  alternates: {
    canonical: 'https://www.therma.one/terms-of-service',
  },
  openGraph: {
    title: 'Terms of Service · Therma',
    description:
      'Terms of Service for Therma: Emotional Wellness by Get Therma Inc.',
    url: 'https://www.therma.one/terms-of-service',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Service · Therma',
    description:
      'Terms of Service for Therma: Emotional Wellness by Get Therma Inc.',
  },
};

export default function TermsOfServicePage() {
  return (
    <>
      <div className="heroBg" aria-hidden="true" style={{ animation: 'none' }} />

      <header>
        <Link href="/" className="brand" style={{ textDecoration: 'none' }}>Therma</Link>
      </header>

      <div className="header-spacer" />

      <main style={{ justifyContent: 'flex-start' }}>
        <div className={styles.wrapper}>
          <div className={styles.hero}>
            <h1>Terms of Service</h1>
            <div className={styles.meta}>
              <strong>Version:</strong> 1.1 &middot; March 2026<br />
              <strong>Contact:</strong>{' '}
              <a href="mailto:support@gettherma.ai">support@gettherma.ai</a>
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.intro}>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the Therma
              mobile application and related services (collectively, the &ldquo;Service&rdquo;) provided
              by Get Therma Inc. (&ldquo;Therma,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
              &ldquo;our&rdquo;). By creating an account or using the Service, you agree to be bound by
              these Terms. If you do not agree, do not use the Service.
            </div>

            <h2>1. Eligibility</h2>
            <p>
              You must be at least 13 years of age to use the Service. By using the Service, you
              represent that you are at least 13 years old and have the legal capacity to enter into a
              binding agreement. If you are between 13 and 18 years old, you represent that you have
              obtained parental or guardian consent to use the Service.
            </p>

            <hr />

            <h2>2. Account Registration</h2>
            <p>
              To access certain features of the Service, you must create an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>
                Notify us immediately of any unauthorised use of your account at{' '}
                <a href="mailto:support@gettherma.ai">support@gettherma.ai</a>
              </li>
              <li>Accept responsibility for all activities that occur under your account</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms or that we
              reasonably believe have been compromised.
            </p>

            <hr />

            <h2>3. The Service</h2>

            <h3>3.1 Description</h3>
            <p>
              Therma: Emotional Wellness is a technology-powered emotional wellness application that
              provides emotional journaling, mood tracking, and guided conversation features to support
              self-reflection and personal wellness. The Service is intended for informational and
              self-improvement purposes only.
            </p>

            <h3>3.2 Not a Medical Service</h3>
            <p>
              <strong>
                THERMA: EMOTIONAL WELLNESS IS NOT A MEDICAL DEVICE, MENTAL HEALTH TREATMENT, THERAPY,
                OR CRISIS SERVICE.
              </strong>{' '}
              The Service does not provide medical advice, diagnosis, or treatment. Content generated
              within the Service is not a substitute for professional medical, psychological, or
              psychiatric care.
            </p>
            <p>
              If you are experiencing a mental health emergency or are in crisis, please contact
              emergency services (911 in the US and Canada), the{' '}
              <strong>988 Suicide and Crisis Lifeline</strong> (call or text 988 — available in both the
              US and Canada), or go to your nearest emergency room. The Therma companion is also
              programmed to surface crisis resources automatically if distress signals are detected in a
              conversation.
            </p>

            <h3>3.3 Automated Content</h3>
            <p>
              The Service uses automated processing to generate responses and insights. Automated content
              may not always be accurate, complete, or appropriate for your specific circumstances. You
              should exercise your own judgement and consult qualified professionals for any medical,
              psychological, legal, or financial decisions.
            </p>

            <hr />

            <h2>4. Subscriptions and Payments</h2>

            <h3>4.1 Subscription Plans</h3>
            <p>
              Therma offers a free trial and paid subscription plans. Subscription pricing and plan
              details are displayed within the app and at{' '}
              <a href="https://gettherma.ai">gettherma.ai</a>. Pricing is subject to change with
              reasonable notice.
            </p>

            <h3>4.2 Billing</h3>
            <p>
              Subscriptions are billed on a recurring basis through the Apple App Store. All billing,
              payment processing, and charge disputes are handled by Apple. By subscribing, you authorise
              Apple to charge your payment method on a recurring basis at the price confirmed at the time
              of purchase.
            </p>

            <h3>4.3 Free Trial</h3>
            <p>
              If we offer a free trial, your subscription will automatically convert to a paid
              subscription at the end of the trial period unless you cancel{' '}
              <strong>at least 24 hours before the end of the trial period</strong>. Any unused portion
              of a free trial period will be forfeited if you purchase a subscription before the trial
              ends. Cancellation instructions are available in your App Store account settings under
              Subscriptions.
            </p>

            <h3>4.4 Auto-Renewal</h3>
            <p>
              Subscriptions automatically renew at the end of each billing period at the same price
              unless cancelled.{' '}
              <strong>
                You must cancel at least 24 hours before the end of the current billing period to avoid
                being charged for the next period.
              </strong>{' '}
              To manage or cancel your subscription, go to your device&rsquo;s App Store account settings
              and tap Subscriptions. Cancellation takes effect at the end of the current billing period
              and you will retain access through that date.
            </p>

            <h3>4.5 Cancellations and Refunds</h3>
            <p>
              You may cancel your subscription at any time through your App Store account settings.
              Refunds are governed by the policies of Apple App Store and applicable law. We do not issue
              refunds directly for App Store purchases.
            </p>

            <hr />

            <h2>5. User Content</h2>

            <h3>5.1 Your Content</h3>
            <p>
              You retain full ownership of all journal entries, mood logs, goals, reflections, and other
              content you create within the Service (&ldquo;User Content&rdquo;). By submitting User
              Content, you grant Therma a limited, non-exclusive, royalty-free licence to store, process,
              and transmit your User Content solely as necessary to provide the Service to you —
              including transmitting relevant context to our AI provider to generate personalised
              responses. We do not use your User Content to train AI models or for any purpose beyond
              providing your personal Service experience.
            </p>

            <h3>5.2 Prohibited Content</h3>
            <p>You agree not to submit User Content that:</p>
            <ul>
              <li>Is unlawful, harassing, abusive, defamatory, or threatening</li>
              <li>Infringes the intellectual property rights of any third party</li>
              <li>Contains viruses, malware, or other harmful code</li>
              <li>Impersonates any person or entity</li>
              <li>Violates the privacy or personal rights of others</li>
            </ul>

            <hr />

            <h2>6. Acceptable Use</h2>
            <p>
              You agree to use the Service only for lawful purposes and in accordance with these Terms.
              You agree not to:
            </p>
            <ul>
              <li>
                Attempt to reverse engineer, decompile, or extract the source code of the Service
              </li>
              <li>
                Use automated tools, bots, or scrapers to access or interact with the Service
              </li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
              <li>Circumvent any security or access controls</li>
              <li>Use the Service to harm, defraud, or mislead others</li>
              <li>Resell or sublicense access to the Service</li>
            </ul>

            <hr />

            <h2>7. Intellectual Property</h2>
            <p>
              All rights, title, and interest in and to the Service — including the app, software,
              design, text, graphics, and branding — are owned by Get Therma Inc. or its licensors.
              These Terms do not grant you any rights to use Therma&rsquo;s trademarks, logos, or other
              brand elements. All rights not expressly granted are reserved.
            </p>

            <hr />

            <h2>8. Privacy</h2>
            <p>
              Your use of the Service is governed by our Privacy Policy, available at{' '}
              <Link href="/privacy-policy">therma.one/privacy-policy</Link>, which is incorporated into
              these Terms by reference. By using the Service, you consent to the data practices described
              in the Privacy Policy.
            </p>
            <p>
              Paid features of the Service are not conditioned on your granting access to health data or
              consenting to companion feature processing. If you decline optional data permissions (such
              as Apple HealthKit access or companion feature data sharing), you will retain access to
              core journaling and mood tracking features.
            </p>

            <hr />

            <h2>9. Third-Party Services</h2>
            <p>
              The Service integrates with third-party services to deliver core functionality, including:
            </p>
            <ul>
              <li>
                <strong>Google Vertex AI / Gemini Flash</strong> — wellness insights (
                <a href="https://cloud.google.com/terms" target="_blank" rel="noopener noreferrer">
                  terms
                </a>{' '}
                /{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                  privacy
                </a>
                )
              </li>
              <li>
                <strong>Google Cloud Platform</strong> — infrastructure and data storage
              </li>
              <li>
                <strong>Apple HealthKit</strong> — optional health data integration (governed by
                Apple&rsquo;s terms)
              </li>
              <li>
                <strong>Apple App Store</strong> — subscription billing and payment processing
              </li>
              <li>
                <strong>Sentry</strong> — crash reporting and error monitoring
              </li>
            </ul>
            <p>
              Your use of those third-party services is governed by their respective terms and privacy
              policies. Therma is not responsible for the content, practices, or policies of third-party
              services.
            </p>

            <hr />

            <h2>10. Disclaimers</h2>
            <div className={styles.capsBlock}>
              THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES
              OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT
              WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL
              COMPONENTS. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THERMA DISCLAIMS ALL
              WARRANTIES RELATED TO AI-GENERATED CONTENT, INCLUDING ITS ACCURACY OR SUITABILITY FOR ANY
              PURPOSE.
            </div>

            <hr />

            <h2>11. Limitation of Liability</h2>
            <div className={styles.capsBlock}>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, GET THERMA INC. AND ITS OFFICERS,
              DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OR
              INABILITY TO USE THE SERVICE.
            </div>
            <div className={styles.capsBlock}>
              IN NO EVENT SHALL THERMA&rsquo;S TOTAL LIABILITY TO YOU EXCEED THE GREATER OF (A) THE
              AMOUNT YOU PAID FOR THE SERVICE IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM OR (B) ONE
              HUNDRED US DOLLARS ($100).
            </div>

            <hr />

            <h2>12. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Get Therma Inc. and its officers,
              directors, employees, and agents from and against any claims, liabilities, damages, losses,
              and expenses (including reasonable attorneys&rsquo; fees) arising out of or in any way
              connected with: (a) your access to or use of the Service; (b) your User Content; (c) your
              violation of these Terms; or (d) your violation of any third-party rights.
            </p>

            <hr />

            <h2>13. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the Service at any time, with
              or without cause and with or without notice, if we believe you have violated these Terms or
              if required by law. You may terminate your account at any time using the account deletion
              feature within the app, or by contacting{' '}
              <a href="mailto:support@gettherma.ai">support@gettherma.ai</a>. Account deletion will
              permanently remove your personal data within 30 days, except where retention is required by
              law.
            </p>
            <p>Sections 7, 10, 11, 12, 14, and 15 survive termination of these Terms.</p>

            <hr />

            <h2>14. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms are governed by the laws of the State of California, United States, without
              regard to its conflict of law provisions. Any dispute arising out of or relating to these
              Terms or the Service shall be resolved exclusively in the state or federal courts located
              in Los Angeles County, California.
            </p>
            <p>
              <strong>Canadian Users:</strong> Notwithstanding the above, if you are a resident of
              Canada, nothing in these Terms limits or excludes any rights you have under applicable
              Canadian federal or provincial consumer protection legislation that cannot be waived by
              contract. Canadian users may also have rights under applicable provincial law that
              supplement or differ from the above. To the extent any provision of these Terms conflicts
              with mandatory Canadian consumer protection law, the applicable law governs.
            </p>
            <div className={styles.capsBlock}>
              YOU AND THERMA AGREE TO BRING ANY DISPUTE ON AN INDIVIDUAL BASIS ONLY, AND NOT AS A
              PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, COLLECTIVE, OR REPRESENTATIVE
              PROCEEDING. NOTE: IN SOME CANADIAN PROVINCES, STATUTORY RIGHTS RELATING TO CONSUMER
              PROTECTION MAY NOT BE SUBJECT TO CLASS ACTION WAIVER. NOTHING IN THIS CLAUSE IS INTENDED
              TO WAIVE THOSE RIGHTS WHERE PROHIBITED BY APPLICABLE LAW.
            </div>

            <hr />

            <h2>15. Changes to These Terms</h2>
            <p>
              We may modify these Terms at any time. We will provide notice of material changes by
              posting the updated Terms within the app or by email. Your continued use of the Service
              after the effective date of the revised Terms constitutes your acceptance. If you do not
              agree to the changes, you must stop using the Service.
            </p>

            <hr />

            <h2>16. General</h2>
            <ul>
              <li>
                <strong>Entire Agreement:</strong> These Terms and our Privacy Policy constitute the
                entire agreement between you and Therma regarding the Service.
              </li>
              <li>
                <strong>Severability:</strong> If any provision is held invalid or unenforceable, the
                remaining provisions remain in full force.
              </li>
              <li>
                <strong>Waiver:</strong> Our failure to enforce any right or provision will not be deemed
                a waiver of that right.
              </li>
              <li>
                <strong>Assignment:</strong> You may not assign or transfer these Terms without our prior
                written consent. We may assign these Terms freely.
              </li>
              <li>
                <strong>No Third-Party Beneficiaries:</strong> These Terms do not confer any rights on
                third parties, except that Apple Inc. is a third-party beneficiary of these Terms as they
                relate to the use of the Service downloaded from the Apple App Store. Upon your
                acceptance of these Terms, Apple will have the right to enforce these Terms against you
                as a third-party beneficiary thereof.
              </li>
              <li>
                <strong>Restore Purchases:</strong> If you believe a subscription you purchased is not
                being recognised, you can restore your purchase through{' '}
                <strong>Settings &rarr; Restore Purchases</strong> within the app or through your App
                Store account settings.
              </li>
              <li>
                <strong>Language (Quebec):</strong> We are working to make these Terms available in
                French for Quebec users. To request a French version, contact{' '}
                <a href="mailto:support@gettherma.ai">support@gettherma.ai</a>.
              </li>
            </ul>

            <hr />

            <h2>17. Contact Us</h2>
            <p>
              <strong>Get Therma Inc. — Therma: Emotional Wellness</strong>
              <br />
              <a href="mailto:support@gettherma.ai">support@gettherma.ai</a> &middot;{' '}
              <a href="https://gettherma.ai">gettherma.ai</a>
            </p>

            <hr />

            <p className={styles.versionNote}>
              Get Therma Inc. &middot; Terms of Service v1.1 &middot; March 2026
            </p>
          </div>
        </div>
      </main>

      <footer>
        <div className="footerWrap">
          <div className="footerBrand">Therma</div>
          <p className="caption">Therma helps you make space for yourself</p>
          <div className="sp-16" />
          <p className="footerLinks caption">
            <Link href="/">Home</Link> &middot;{' '}
            <Link href="/faq">FAQ</Link> &middot;{' '}
            <Link href="/privacy-policy">Privacy</Link> &middot;{' '}
            <Link href="/terms-of-service">Terms of Service</Link>
          </p>
          <div className="sp-16" />
          <p className="caption">&copy; {new Date().getFullYear()} Get Therma Inc. All rights reserved</p>
        </div>
      </footer>
    </>
  );
}
