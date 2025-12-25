import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import IssueBody from '../../../components/weekly/IssueBody';
import IssueCTA from '../../../components/weekly/IssueCTA';
import IssueHero from '../../../components/weekly/IssueHero';
import WeeklyLayout from '../../../components/weekly/WeeklyLayout';
import styles from '../../../components/weekly/weekly.module.css';
import {
  ThermaWeeklyIssue,
  getIssueBySlug,
  getIssueSiblings,
  getSortedIssues,
} from '../../../content/weekly/issues';

interface IssuePageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return getSortedIssues().map((issue) => ({ slug: issue.slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: IssuePageProps): Metadata {
  const issue = getIssueBySlug(params.slug);
  if (!issue) {
    return {
      title: 'Therma Weekly',
    };
  }

  return {
    title: `${issue.title} · Therma Weekly`,
    description: issue.subtitle,
    alternates: {
      canonical: `/weekly/${issue.slug}`,
    },
    openGraph: {
      title: `${issue.title} · Therma Weekly`,
      description: issue.subtitle,
      url: `https://www.therma.one/weekly/${issue.slug}`,
      images: issue.coverImageUrl ? [issue.coverImageUrl] : ['/images/weekly/issue-default.svg'],
    },
  };
}

const IssuePage = ({ params }: IssuePageProps) => {
  const issue = getIssueBySlug(params.slug);
  if (!issue) {
    notFound();
  }
  const siblings = getIssueSiblings(issue.slug);

  const description = `Issue #${issue.issueNumber.toString().padStart(2, '0')} of Therma Weekly.`;

  return (
    <WeeklyLayout hero={<IssueHero issue={issue} />} description={description}>
      <IssueBody issue={issue} />
      <IssueCTA issue={issue} />
      <div className={styles.siblings}>
        <div>
          {siblings.previous && (
            <Link href={`/weekly/${siblings.previous.slug}`} className={styles.siblingLink}>
              ← Previous: {siblings.previous.title}
            </Link>
          )}
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          {siblings.next && (
            <Link href={`/weekly/${siblings.next.slug}`} className={styles.siblingLink}>
              Next: {siblings.next.title} →
            </Link>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Link href="/weekly" className={styles.siblingLink}>
          Back to Weekly archive
        </Link>
      </div>
    </WeeklyLayout>
  );
};

export default IssuePage;

