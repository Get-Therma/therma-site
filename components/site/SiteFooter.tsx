import Link from 'next/link';
import React from 'react';

const SiteFooter: React.FC = () => {
  return (
    <footer>
      <div className="footerWrap">
        <div className="footerBrand">Therma</div>
        <p className="caption">Therma helps you make space for yourself</p>
        <div className="sp-16" />
        <p className="footerLinks caption">
          <Link href="/contact">Contact Us</Link> · <Link href="/faq">FAQ</Link> ·{' '}
          <Link href="/privacy">Privacy</Link> · <Link href="/beta-terms">Terms of Use</Link> ·{' '}
          <Link href="/weekly">Therma Weekly</Link>
        </p>
        <div className="sp-16" />
        <p className="caption">2025. All rights reserved</p>
      </div>
    </footer>
  );
};

export default SiteFooter;

