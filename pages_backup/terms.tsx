import Head from 'next/head';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Use · Therma</title>
        <meta name="description" content="Terms of Use for Therma - Your space to slow down, check in, and feel supported." />
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
            <h1>Terms of Use</h1>
            <div className="sp-8"></div>
            <p className="muted">Last updated: January 27, 2025</p>
            <div className="sp-24"></div>
            
            <div className="legal-content">
              <h2>Acceptance of Terms</h2>
              <p>By accessing and using Therma's website and services, you accept and agree to be bound by the terms and provision of this agreement.</p>
              
              <h2>Use License</h2>
              <p>Permission is granted to temporarily access Therma's website for personal, non-commercial transitory viewing only.</p>
              
              <h2>Disclaimer</h2>
              <p>The materials on Therma's website are provided on an 'as is' basis. Therma makes no warranties, expressed or implied.</p>
              
              <h2>Limitations</h2>
              <p>In no event shall Therma or its suppliers be liable for any damages arising out of the use or inability to use the materials on Therma's website.</p>
              
              <h2>Contact Information</h2>
              <p>If you have any questions about these Terms of Use, please contact us at <a href="mailto:support@gettherma.ai">support@gettherma.ai</a>.</p>
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
