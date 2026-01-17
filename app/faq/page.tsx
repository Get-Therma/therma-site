'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FAQPage() {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const router = useRouter();

  // Update page metadata
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'FAQ - Frequently Asked Questions | Therma';
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Get answers to common questions about Therma, the AI habit tracker and guided reflection app. Learn about features, privacy, pricing, and more.');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = 'Get answers to common questions about Therma, the AI habit tracker and guided reflection app. Learn about features, privacy, pricing, and more.';
        document.head.appendChild(meta);
      }
    }
  }, []);

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "Is this therapy?",
      answer: "No. Therma is a self-reflection tool and isn't medical advice."
    },
    {
      question: "Will it be free?",
      answer: "We'll offer a free tier; early waitlisters get first beta access and perks."
    },
    {
      question: "iOS or Android?",
      answer: "iOS first, Android next."
    },
    {
      question: "Privacy?",
      answer: "We don't sell data. Therma is built on a HIPAA compliant basis."
    },
    {
      question: "How is Therma different from journaling apps?",
      answer: "Unlike traditional journaling apps, Therma combines daily reflections with an AI companion that listens and responds thoughtfully. It's designed to help you actually hear yourself through gentle prompts and meaningful conversations."
    },
    {
      question: "When will Therma launch?",
      answer: "We're working hard to bring Therma to you soon! Join our waitlist to be among the first to experience it when we launch. We'll keep you updated on our progress."
    }
  ];

  // Generate FAQ structured data
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      {/* Static background (avoid scroll jank from per-frame React updates) */}
      <div className="heroBg" aria-hidden="true" style={{ animation: 'none' }}></div>

      <header>
        <div className="brand" onClick={() => router.push('/')}>Therma</div>
      </header>

      <main>
        {/* FAQ Structured Data - FAQPage Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData)
          }}
        />
        
        <a href="/" className="back-link">Back to Home</a>
        
        <section className="faq-section">
          <div className="container center">
            <div className="stack">
              <h1 className="faq-title">Frequently Asked Questions</h1>
              <div className="sp-8"></div>
              <h2 className="muted">Everything you need to know about Therma</h2>
              <div className="sp-24"></div>
              
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <div key={index} className={`faq-item ${activeFAQ === index ? 'active' : ''}`}>
                    <button 
                      className="faq-question" 
                      onClick={() => toggleFAQ(index)}
                    >
                      <span>{faq.question}</span>
                      <span className="faq-icon">+</span>
                    </button>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footerWrap">
          <div className="footerBrand">Therma</div>
          <p className="caption">Therma helps you make space for yourself</p>
          <div className="sp-16"></div>
          <p className="footerLinks caption">
            <a href="/contact">Contact Us</a> · 
            <a href="/">Home</a> · 
            <a href="/privacy">Privacy</a> · 
            <a href="/beta-terms">Terms of Use</a>
          </p>
          <div className="sp-16"></div>
          <p className="caption">© 2025 Get Therma Inc. All rights reserved</p>
        </div>
      </footer>
    </>
  );
}
