import Link from 'next/link';
import React from 'react';

import { ThermaWeeklyIssue } from '../../content/weekly/issues';
import styles from './weekly.module.css';

interface IssueCTAProps {
  issue: ThermaWeeklyIssue;
}

const IssueCTA: React.FC<IssueCTAProps> = ({ issue }) => {
  if (!issue.cta) {
    return null;
  }

  return (
    <section className={styles.ctaBlock}>
      <h3 className={styles.ctaTitle}>Put this ritual into practice</h3>
      <p>Capture the signals, track the data, and translate it into your own micro-climate with Therma.</p>
      <Link href={issue.cta.href} className={styles.ctaButton}>
        {issue.cta.label}
      </Link>
    </section>
  );
};

export default IssueCTA;

