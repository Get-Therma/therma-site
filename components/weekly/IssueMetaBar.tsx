import React from 'react';

import { ThermaWeeklyIssue } from '../../content/weekly/issues';
import styles from './weekly.module.css';

interface IssueMetaBarProps {
  issue: ThermaWeeklyIssue;
  variant?: 'light' | 'dark';
}

const formatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

const IssueMetaBar: React.FC<IssueMetaBarProps> = ({ issue, variant = 'light' }) => {
  return (
    <div className={`${styles.metaBar} ${variant === 'dark' ? styles.metaBarDark : ''}`}>
      <span>{formatter.format(new Date(issue.publishedAt))}</span>
      <span>• {issue.readTimeMinutes} min read</span>
      {issue.tags.map((tag) => (
        <span key={tag} className={styles.tagChip}>
          {tag}
        </span>
      ))}
    </div>
  );
};

export default IssueMetaBar;

