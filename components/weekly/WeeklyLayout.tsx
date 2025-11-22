import React from 'react';

import SiteFooter from '../site/SiteFooter';
import SiteHeader from '../site/SiteHeader';
import styles from './weekly.module.css';

interface WeeklyLayoutProps {
  children: React.ReactNode;
  hero?: React.ReactNode;
  description?: string;
}

const WeeklyLayout: React.FC<WeeklyLayoutProps> = ({
  children,
  hero,
  description = 'Research-backed routines and real-world experiments from the Therma community.',
}) => {
  return (
    <>
      <SiteHeader />
      <main className={styles.weeklyMain}>
        <section className={styles.identity}>
          <p className={styles.identityTitle}>Therma Weekly</p>
          <p className={styles.identityCopy}>{description}</p>
        </section>
        {hero && <div className={styles.heroSlot}>{hero}</div>}
        <div className={styles.contentStack}>{children}</div>
      </main>
      <SiteFooter />
    </>
  );
};

export default WeeklyLayout;

