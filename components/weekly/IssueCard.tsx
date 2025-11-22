import Link from 'next/link';
import React from 'react';

import { ThermaWeeklyIssue } from '../../content/weekly/issues';
import IssueMetaBar from './IssueMetaBar';
import styles from './weekly.module.css';

interface IssueCardProps {
  issue: ThermaWeeklyIssue;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  return (
    <Link href={`/weekly/${issue.slug}`} className={styles.issueCard}>
      <span className={styles.issueKicker}>Issue {issue.issueNumber.toString().padStart(2, '0')}</span>
      <h3 className={styles.issueTitle}>{issue.title}</h3>
      <p className={styles.issueSubtitle}>{issue.subtitle}</p>
      <IssueMetaBar issue={issue} />
    </Link>
  );
};

export default IssueCard;

