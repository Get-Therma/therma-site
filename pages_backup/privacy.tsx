import Head from 'next/head';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy · Therma</title>
        <meta name="description" content="Privacy Policy for Therma - Your space to slow down, check in, and feel supported." />
        <meta name="color-scheme" content="light dark" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="heroBg" aria-hidden="true"></div>

      <header>
        <div className="brand">Therma</div>
      </header>

      <main>
        <section className="container center">
          <div className="stack">
            <h1>Privacy Policy</h1>
            <div className="sp-8"></div>
            <p className="muted">Last updated: January 27, 2025</p>
            <div className="sp-24"></div>
            
            <div className="legal-content">
              <h2>Information We Collect</h2>
              <p>We collect information you provide directly to us, such as when you join our waitlist or contact us through our website.</p>
              
              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our services, communicate with you, and send you updates about Therma.</p>
              
              <h2>Information Sharing</h2>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
              
              <h2>Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              
              <h2>Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@gettherma.ai">support@gettherma.ai</a>.</p>
            </div>
            
            <div className="sp-24"></div>
            <a href="/" className="btn">Back to Home</a>
          </div>
        </section>
      </main>

      <footer>
        <div className="footerWrap">
          <h2 className="footerBrand">Therma</h2>
          <p className="caption">Therma helps you make space for yourself</p>
          <div className="sp-16"></div>
          <p className="footerLinks caption">
            <a href="/contact.html">Contact Us</a> · <a href="/faq.html">FAQ</a> · <a href="/privacy">Privacy</a> · <a href="/terms">Terms of Use</a>
          </p>
          <div className="sp-16"></div>
          <p className="caption">2025. All rights reserved</p>
        </div>
      </footer>
    </>
  );
}
