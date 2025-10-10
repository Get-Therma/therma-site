import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function ThankYou() {
  const [email, setEmail] = useState('')

  useEffect(() => {
    // Get the submitted email from localStorage if available
    const submittedEmail = localStorage.getItem('therma_submitted_email')
    if (submittedEmail) {
      setEmail(submittedEmail)
    }
  }, [])

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
            <div className="confirmation-icon">✅</div>
            <h1>You're In.</h1>
            <div className="sp-8"></div>
            <p className="muted thank-you-text">Thanks for joining the Therma waitlist.<br/>We'll be in touch soon with your invite to experience a smarter way to control your climate.</p>
            <div className="sp-16"></div>
            <p className="muted thank-you-text">In the meantime, follow us for sneak peeks and launch updates:</p>
            <div className="sp-8"></div>
            <div className="social-links">
              <a href="#" className="social-link">
                <span className="social-icon">📷</span>
                Follow on Instagram
              </a>
              <a href="#" className="social-link">
                <span className="social-icon">🐦</span>
                Join us on X
              </a>
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
            <a href="/contact.html">Contact Us</a> · <a href="/faq.html">FAQ</a> · <a href="#">Privacy</a> · <a href="#">Terms of Use</a>
          </p>
          <div className="sp-16"></div>
          <p className="caption">2025. All rights reserved</p>
        </div>
      </footer>
    </>
  )
}
