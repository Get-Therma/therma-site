
import Head from 'next/head'
import WaitlistForm from '../components/WaitlistForm'
import WhyTherma from '../components/WhyTherma'
import BreathingDivider from '../components/BreathingDivider'

export default function Home() {
  return (
    <>
      <Head>
        <title>Therma · Coming Soon</title>
        <meta name="color-scheme" content="light dark" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="heroBg" aria-hidden="true"></div>

      <header>
        <div className="mobile-menu-btn" id="mobileMenuBtn">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="brand">Therma</div>
      </header>

      <main>
        <section id="hero" className="container center">
          <div className="stack">
            <h1>Your space to slow<br/>down, check in, and<br/>feel supported.</h1>
            <div className="sp-8"></div>
            <h2 className="muted">Daily reflections, gentle prompts, and an AI companion that<br/>listens — so you can actually hear yourself.</h2>
            <div className="sp-16"></div>
            <WaitlistForm />
            <div className="sp-8"></div>
            <p className="social-proof">Join the first 1,000 beta invites</p>
          </div>
        </section>
        
        <BreathingDivider />
        <WhyTherma />
      </main>

      <footer>
        <div className="footerWrap">
          <h2 className="footerBrand">Therma</h2>
          <p className="caption">Therma helps you make space for yourself</p>
          <div className="sp-16"></div>
          <p className="footerLinks caption">
            <a href="#">Privacy</a> · <a href="#">Terms of Use</a>
          </p>
          <div className="sp-16"></div>
          <p className="caption">2025. All rights reserved</p>
        </div>
      </footer>
    </>
  )
}
