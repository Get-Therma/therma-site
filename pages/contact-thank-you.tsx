import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function ContactThankYou() {
  const [contactData, setContactData] = useState<{
    name: string;
    email: string;
    subject: string;
  } | null>(null);

  useEffect(() => {
    // Get the submitted contact data from localStorage if available
    const submittedData = localStorage.getItem('therma_contact_data');
    if (submittedData) {
      try {
        const data = JSON.parse(submittedData);
        setContactData(data);
        // Clean up localStorage
        localStorage.removeItem('therma_contact_data');
      } catch (error) {
        console.error('Error parsing contact data:', error);
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>Thank You · Therma</title>
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
            <div className="confirmation-icon">📧</div>
            <h1>Message Sent.</h1>
            <div className="sp-8"></div>
            <p className="muted thank-you-text">
              Thank you for reaching out to us, {contactData?.name || 'there'}.
              <br/>
              We've received your {contactData?.subject?.toLowerCase() || 'message'} and will get back to you within 24 hours.
            </p>
            {contactData?.email && (
              <p className="muted thank-you-text">
                We'll respond to: <strong>{contactData.email}</strong>
              </p>
            )}
            <div className="sp-16"></div>
            <p className="muted thank-you-text">In the meantime, follow us for updates and insights:</p>
            <div className="sp-8"></div>
            <div className="social-links">
              <a href="https://www.instagram.com/gettherma/" target="_blank" rel="noopener noreferrer" className="social-link">
                <span className="social-icon">📷</span>
                Follow on Instagram
              </a>
              <a href="https://x.com/gettherma" target="_blank" rel="noopener noreferrer" className="social-link">
                <span className="social-icon">🐦</span>
                Join us on X
              </a>
            </div>
            <div className="sp-24"></div>
            <div className="action-buttons">
              <a href="/" className="btn">Back to Home</a>
              <a href="/contact.html" className="btn secondary">Send Another Message</a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footerWrap">
          <h2 className="footerBrand">Therma</h2>
          <p className="caption">Therma helps you make space for yourself</p>
          <div className="sp-16"></div>
          <p className="footerLinks caption">
            <a href="/contact.html">Contact Us</a> · <a href="/faq.html">FAQ</a> · <a href="#">Privacy</a> · <a href="#">Terms of Use</a>
          </p>
          <div className="sp-16"></div>
          <p className="caption">2025. All rights reserved</p>
        </div>
      </footer>
    </>
  );
}
