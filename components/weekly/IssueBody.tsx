import React from 'react';

import { ThermaWeeklyIssue } from '../../content/weekly/issues';
import styles from './weekly.module.css';

interface IssueBodyProps {
  issue: ThermaWeeklyIssue;
}

const IssueBody: React.FC<IssueBodyProps> = ({ issue }) => {
  return (
    <div className={styles.issueBody}>
      <section className={styles.bodySection}>
        <p className={styles.sectionLabel}>Scientific Notes</p>
        <h2 className={styles.bodyHeading}>{issue.scientificSection.heading}</h2>
        <p className={styles.bodyCopy}>{issue.scientificSection.body}</p>
      </section>
      <section className={styles.bodySection}>
        <p className={styles.sectionLabel}>Personal Log</p>
        <h2 className={styles.bodyHeading}>{issue.personalSection.heading}</h2>
        <p className={styles.bodyCopy}>{issue.personalSection.body}</p>
      </section>
    </div>
  );
};

export default IssueBody;

