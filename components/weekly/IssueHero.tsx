import Image from 'next/image';
import React from 'react';

import { ThermaWeeklyIssue } from '../../content/weekly/issues';
import IssueMetaBar from './IssueMetaBar';
import styles from './weekly.module.css';

interface IssueHeroProps {
  issue: ThermaWeeklyIssue;
}

const IssueHero: React.FC<IssueHeroProps> = ({ issue }) => {
  return (
    <article className={styles.issueHero}>
      <div>
        {issue.heroKicker && <div className={styles.heroKicker}>{issue.heroKicker}</div>}
        <h1 className={styles.heroTitle}>{issue.title}</h1>
        <p className={styles.heroSubtitle}>{issue.subtitle}</p>
        <IssueMetaBar issue={issue} />
      </div>
      {issue.coverImageUrl && (
        <div className={styles.issueImage}>
          <Image src={issue.coverImageUrl} alt={issue.title} fill sizes="(max-width: 768px) 100vw, 540px" />
        </div>
      )}
    </article>
  );
};

export default IssueHero;

