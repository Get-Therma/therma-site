import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '../legal.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy · Therma',
  description:
    'Privacy Policy for Therma: Emotional Wellness by Get Therma Inc. How we collect, use, store, and share your information.',
  alternates: {
    canonical: 'https://www.therma.one/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy · Therma',
    description:
      'Privacy Policy for Therma: Emotional Wellness by Get Therma Inc.',
    url: 'https://www.therma.one/privacy-policy',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy · Therma',
    description:
      'Privacy Policy for Therma: Emotional Wellness by Get Therma Inc.',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Privacy Policy</h1>
        <div className={styles.meta}>
          <strong>Version:</strong> 1.1 &middot; March 2026<br />
          <strong>Contact:</strong>{' '}
          <a href="mailto:support@gettherma.ai">support@gettherma.ai</a>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.intro}>
          This Privacy Policy describes how Get Therma Inc. (&ldquo;Therma,&rdquo; &ldquo;we,&rdquo;
          &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, stores, and shares your information
          when you use the Therma mobile application and related services (collectively, the
          &ldquo;Service&rdquo;). By using the Service, you agree to the practices described in this
          Policy.
        </div>

        <h2>1. Information We Collect</h2>

        <h3>1.1 Information You Provide</h3>
        <p>When you create an account and use the Service, you may provide:</p>
        <ul>
          <li><strong>Account information:</strong> name, email address, and password</li>
          <li><strong>Profile information:</strong> age range, wellness goals, and preferences set during onboarding</li>
          <li><strong>Journal entries and mood logs:</strong> text or other content you submit through the app</li>
          <li><strong>Conversation data:</strong> messages exchanged with Therma&rsquo;s wellness companion</li>
          <li><strong>Payment information:</strong> processed by our third-party payment provider (we do not store full card details)</li>
        </ul>

        <h3>1.2 Information Collected Automatically</h3>
        <p>When you use the Service, we may automatically collect:</p>
        <ul>
          <li>Device identifiers, operating system version, and app version</li>
          <li>Usage data: features accessed, session duration, and interaction patterns</li>
          <li>Crash reports and diagnostic logs (anonymised where possible)</li>
          <li>IP address and approximate location (country/region level only)</li>
        </ul>

        <h3>1.3 Health and Wellness Data</h3>
        <p>
          Therma is designed as a personal emotional wellness tool. The emotional and mood data you
          enter is treated with the highest level of privacy protection. We do not sell, rent, or
          monetise your personal health or wellness data. If you choose to connect Apple Health or
          other integrations, that data is processed locally to generate insights and is not shared
          with third parties.
        </p>
        <p>
          If you choose to connect Apple Health, Therma syncs relevant health data automatically in
          the background on a daily basis — no manual action is required from you. We access only the
          specific HealthKit data types necessary for the features you use (such as sleep data, heart
          rate, or mindful minutes) and do not request access to unrelated data types.{' '}
          <strong>
            HealthKit data is never used for marketing, advertising, or data mining, and is never
            shared with third parties for these purposes.
          </strong>{' '}
          Your health data is stored on HIPAA-eligible Google Cloud Platform servers and is not stored
          in iCloud or Apple&rsquo;s iCloud backup. Any third party that receives HealthKit data does so
          only to provide health or fitness services and is subject to equivalent data protection
          obligations.
        </p>

        <h3>1.4 Companion Feature Data Processing</h3>
        <p>
          When you use Therma&rsquo;s companion features — including mood check-ins, journaling, and
          guided conversations — the content of your interactions is transmitted to{' '}
          <strong>Google Vertex AI (Gemini)</strong>, a third-party cloud processing service operated
          by Google LLC. This transmission is necessary to generate personalised responses and
          insights. Specifically, the following data types may be sent:
        </p>
        <ul>
          <li>Your journal entries and mood logs (when you engage with companion features)</li>
          <li>Messages you send within the companion experience</li>
          <li>Contextual mood and wellness patterns used to personalise responses</li>
        </ul>
        <p>
          Google processes this data solely to generate your responses and does not use it to train
          general models or for advertising purposes, pursuant to our Data Processing Agreement with
          Google. For more information, see Google&rsquo;s Privacy Policy at{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            policies.google.com/privacy
          </a>.
        </p>
        <p>
          <strong>
            Before your data is first transmitted, we will ask for your explicit consent within the
            app.
          </strong>{' '}
          You may withdraw this consent at any time through your in-app privacy settings. Withdrawing
          consent will disable companion features but will not affect your ability to use journaling
          and mood tracking independently.
        </p>

        <hr />

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, operate, and improve the Therma Service</li>
          <li>Personalise your experience and deliver insights through the companion features</li>
          <li>Send you notifications and reminders you have opted into</li>
          <li>Respond to your support requests and enquiries</li>
          <li>Analyse usage trends to improve app performance and features</li>
          <li>Comply with legal obligations and enforce our Terms of Service</li>
          <li>Detect and prevent fraud, abuse, or unauthorised access</li>
        </ul>
        <p>
          We do not use your journal entries or mood data to train general language models or sell
          insights to third parties.
        </p>

        <hr />

        <h2>3. How We Share Your Information</h2>
        <p>
          We do not sell your personal information. We may share your information only in the
          following limited circumstances:
        </p>

        <h3>3.1 Service Providers</h3>
        <p>
          We work with trusted third-party service providers who assist in operating the Service,
          including:
        </p>
        <ul>
          <li>Cloud infrastructure and data storage (Google Cloud Platform)</li>
          <li>Cloud processing services powering the in-app companion (Google Vertex AI / Gemini)</li>
          <li>Payment processing (Apple App Store)</li>
          <li>Anonymised analytics and crash reporting</li>
          <li>Email and notification delivery</li>
        </ul>
        <p>
          These providers are contractually required to use your information only to provide services
          to us, to maintain appropriate security measures, and to provide the same or equivalent
          level of protection for your personal data as described in this Privacy Policy.
        </p>

        <h3>3.2 Legal Requirements</h3>
        <p>
          We may disclose your information if required to do so by law, court order, or governmental
          authority, or if we believe disclosure is necessary to protect the rights, property, or
          safety of Therma, our users, or the public.
        </p>

        <h3>3.3 Business Transfers</h3>
        <p>
          If Therma is involved in a merger, acquisition, or sale of assets, your information may be
          transferred as part of that transaction. We will notify you of any such change and your
          choices regarding your data.
        </p>

        <hr />

        <h2>4. Data Retention</h2>
        <p>
          We retain your personal information for as long as your account is active or as necessary
          to provide the Service. You may request deletion of your account and associated data at any
          time by contacting{' '}
          <a href="mailto:support@gettherma.ai">support@gettherma.ai</a>. Upon deletion, we will
          remove or anonymise your personal data within a reasonable timeframe, unless we are
          required to retain it by law.
        </p>

        <hr />

        <h2>5. Data Security</h2>
        <p>We implement industry-standard security measures to protect your information:</p>
        <ul>
          <li>Encryption of data in transit (TLS/HTTPS)</li>
          <li>Encryption of data at rest (AES-256 or equivalent)</li>
          <li>Access controls limiting internal access to your data</li>
          <li>HIPAA-eligible cloud services for storage</li>
        </ul>
        <p>
          No method of transmission over the internet is 100% secure. While we use commercially
          acceptable means to protect your personal information, we cannot guarantee absolute
          security.
        </p>

        <hr />

        <h2>6. Your Rights and Choices</h2>
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you</li>
          <li>Correct inaccurate or incomplete information</li>
          <li>Request deletion of your personal information</li>
          <li>Object to or restrict certain processing of your data</li>
          <li>Export your data in a portable format</li>
        </ul>
        <p>
          To exercise any of these rights, contact{' '}
          <a href="mailto:support@gettherma.ai">support@gettherma.ai</a>. We will respond within a
          reasonable timeframe.
        </p>
        <p>
          You can also manage your data and consent preferences directly within the app. From your
          in-app privacy and account settings you can:
        </p>
        <ul>
          <li>Review and manage companion feature processing consent</li>
          <li>Export your data</li>
          <li>Request deletion of your account and all associated data</li>
        </ul>
        <p>
          We collect only the minimum data necessary for each feature you use. If you do not use a
          particular feature, we do not collect data associated with it.
        </p>

        <h3>6.1 California Residents (CCPA)</h3>
        <p>
          If you are a California resident, you have specific rights under the California Consumer
          Privacy Act (CCPA), including the right to know what personal information we collect, the
          right to delete your personal information, and the right to opt out of the sale of your
          personal information. We do not sell personal information. To submit a CCPA request,
          contact <a href="mailto:support@gettherma.ai">support@gettherma.ai</a>.
        </p>

        <h3>6.2 Canadian Residents (PIPEDA and Quebec Law 25)</h3>
        <p>
          <strong>Automated Decision-Making (Quebec Law 25):</strong> Therma uses automated
          processing to generate personalised mood insights, pattern recognition, and wellness
          suggestions. These outputs are informational only and do not constitute decisions with
          legal or significant effects. No solely automated decisions are made about you that produce
          legal effects or similarly significant impacts. If you are a Quebec resident and wish to
          know more about how our automated processing works, request human review of any output, or
          object to automated processing, contact{' '}
          <a href="mailto:support@gettherma.ai">support@gettherma.ai</a>.
        </p>
        <p>
          <strong>Electronic Messages (CASL):</strong> If you are a Canadian resident and receive
          marketing emails or promotional push notifications from Therma, we will only send these
          with your express consent. You may withdraw consent to marketing communications at any time
          through your in-app notification settings or by contacting{' '}
          <a href="mailto:support@gettherma.ai">support@gettherma.ai</a>. Transactional messages
          (such as account confirmations and billing notices) are not subject to this opt-out.
        </p>
        <p>
          <strong>Language:</strong> We are working to make this Privacy Policy available in French
          for our Quebec users. If you require a French version, please contact{' '}
          <a href="mailto:support@gettherma.ai">support@gettherma.ai</a>.
        </p>
        <p>
          If you are a resident of Canada, your personal information is also governed by
          Canada&rsquo;s <em>Personal Information Protection and Electronic Documents Act</em>{' '}
          (PIPEDA) and, if you reside in Quebec, by{' '}
          <em>
            Quebec&rsquo;s Act Respecting the Protection of Personal Information in the Private
            Sector
          </em>{' '}
          (Law 25), which sets the highest provincial standard in Canada.
        </p>
        <p>As a Canadian resident, you have the right to:</p>
        <ul>
          <li>
            <strong>Access</strong> the personal information we hold about you
          </li>
          <li>
            <strong>Correct</strong> inaccurate or incomplete information
          </li>
          <li>
            <strong>Withdraw consent</strong> to our collection or use of your personal information
            at any time, subject to legal or contractual restrictions — note that withdrawing consent
            may affect your ability to use some or all of the Service
          </li>
          <li>
            <strong>Request deletion</strong> of your personal information (subject to legal
            retention obligations)
          </li>
          <li>
            <strong>File a complaint</strong> with the Office of the Privacy Commissioner of Canada
            (OPC) at{' '}
            <a href="https://priv.gc.ca" target="_blank" rel="noopener noreferrer">
              priv.gc.ca
            </a>
            , or with the Commission d&rsquo;acc&egrave;s &agrave; l&rsquo;information (CAI) if you are in
            Quebec
          </li>
        </ul>
        <p>
          We collect, use, and disclose your personal information only with your knowledge and
          consent, except where otherwise permitted or required by law. We designate{' '}
          <strong>Omar Rantisi</strong> (
          <a href="mailto:support@gettherma.ai">support@gettherma.ai</a>) as our accountable
          privacy officer for Canadian privacy matters.
        </p>
        <p>
          To exercise any of these rights or to withdraw consent, contact{' '}
          <a href="mailto:support@gettherma.ai">support@gettherma.ai</a>. We will respond within{' '}
          <strong>30 days</strong> as required under PIPEDA.
        </p>

        <hr />

        <h2>7. Children&rsquo;s Privacy</h2>
        <p>
          The Service is not directed to individuals under the age of 13. We do not knowingly
          collect personal information from children under 13. If you believe we have inadvertently
          collected information from a child under 13, please contact{' '}
          <a href="mailto:support@gettherma.ai">support@gettherma.ai</a> immediately and we will
          take steps to delete that information.
        </p>

        <hr />

        <h2>8. Third-Party Links and Services</h2>
        <p>
          The Service may contain links to third-party websites or services. We are not responsible
          for the privacy practices of those third parties. We encourage you to review their privacy
          policies before providing any personal information.
        </p>

        <hr />

        <h2>9. International Data Transfers</h2>
        <p>
          Get Therma Inc. is based in the United States. If you access the Service from outside the
          United States — including from Canada — your information may be transferred to and
          processed in the United States, where data protection laws may differ from those in your
          country or province.
        </p>
        <p>
          Canadian users should be aware that their personal information may be subject to access by
          US courts, law enforcement, and national security authorities under US law. By using the
          Service, you consent to this transfer. Where required by applicable law, we take steps to
          ensure that your information receives a comparable level of protection wherever it is
          processed.
        </p>

        <hr />

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of material
          changes by posting the new Policy in the app and, where required by law, obtaining your
          consent. The effective date at the top of this Policy indicates when it was last revised.
          Your continued use of the Service after any changes constitutes your acceptance of the
          updated Policy.
        </p>

        <hr />

        <h2>11. Contact Us</h2>
        <p>
          <strong>Get Therma Inc.</strong>
          <br />
          <a href="mailto:support@gettherma.ai">support@gettherma.ai</a> &middot;{' '}
          <a href="https://gettherma.ai">gettherma.ai</a>
        </p>

        <hr />

        <p className={styles.versionNote}>
          Get Therma Inc. &middot; Privacy Policy v1.1 &middot; March 2026
        </p>
      </div>

      <footer className={styles.footer}>
        <div>
          <p>
            <strong>Get Therma Inc.</strong>
            <br />
            <a href="mailto:support@gettherma.ai">support@gettherma.ai</a> &middot;{' '}
            <a href="https://gettherma.ai">gettherma.ai</a>
            <br />
            <br />
            <Link href="/privacy-policy">Privacy Policy</Link> &middot;{' '}
            <Link href="/terms-of-service">Terms of Service</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
