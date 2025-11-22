import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

import IssueCard from '../../components/weekly/IssueCard';
import IssueMetaBar from '../../components/weekly/IssueMetaBar';
import WeeklyLayout from '../../components/weekly/WeeklyLayout';
import styles from '../../components/weekly/weekly.module.css';
import { getAllTags, getSortedIssues } from '../../content/weekly/issues';

export const metadata: Metadata = {
  title: 'Therma Weekly – Research-backed routines & real-world experiments by Therma',
  description:
    'Explore Therma Weekly: a living archive of science-backed routines, sensory experiments, and first-person logs from the Therma community.',
  alternates: {
    canonical: '/weekly',
  },
  openGraph: {
    title: 'Therma Weekly – Research-backed routines & real-world experiments by Therma',
    description:
      'Browse featured issues, archives, and personal logs from Therma Weekly, the ritual lab for emotional weather.',
    url: 'https://www.therma.one/weekly',
    images: ['/images/weekly/issue-default.svg'],
  },
};

interface WeeklyPageProps {
  searchParams?: {
    tag?: string;
  };
}

const WeeklyPage = ({ searchParams }: WeeklyPageProps) => {
  const issues = getSortedIssues();
  const featured = issues[0];
  const secondaryIssues = issues.slice(1, 3);
  const tags = getAllTags();
  const activeTag = searchParams?.tag && tags.includes(searchParams.tag) ? searchParams.tag : 'all';
  const archiveIssues = activeTag === 'all' ? issues : issues.filter((issue) => issue.tags.includes(activeTag));

  const hero = (
    <div className={styles.featuredCard}>
      <div>
        <div className={styles.issueKicker}>The Ritual Lab</div>
        <h2 className={styles.issueTitle}>Slow magazine vibes, science-backed rituals.</h2>
        <p className={styles.issueSubtitle}>
          Therma Weekly is our rotating set of experiments: sleep debt resets, contrast showers, micro-climates, and
          everything in between.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href={`/weekly/${featured.slug}`} className={styles.ctaButton}>
            Read the latest issue
          </Link>
          <Link
            href="#archive"
            style={{
              color: '#0a1b15',
              textDecoration: 'underline',
              fontWeight: 600,
              alignSelf: 'center',
            }}
          >
            Browse archive ↓
          </Link>
        </div>
      </div>
      <div className={styles.issueImage}>
        <Image
          src="/images/weekly/issue-default.svg"
          alt="Therma Weekly collage"
          fill
          sizes="(max-width: 768px) 100vw, 500px"
        />
      </div>
    </div>
  );

  return (
    <WeeklyLayout hero={hero}>
      <section>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Issue</h2>
          <p className={styles.sectionSubtitle}>
            One part research briefing, one part lived experience. Updated weekly with experiments worth running.
          </p>
        </div>
        <div className={styles.featuredCard}>
          <div>
            <div className={styles.issueKicker}>Issue {featured.issueNumber.toString().padStart(2, '0')}</div>
            <h3 className={styles.issueTitle}>{featured.title}</h3>
            <p className={styles.issueSubtitle}>{featured.subtitle}</p>
            <IssueMetaBar issue={featured} />
            <Link href={`/weekly/${featured.slug}`} className={styles.ctaButton} style={{ marginTop: '16px' }}>
              Dive into the issue
            </Link>
          </div>
          <div className={styles.issueImage}>
            {featured.coverImageUrl && (
              <Image src={featured.coverImageUrl} alt={featured.title} fill sizes="(max-width: 768px) 100vw, 540px" />
            )}
          </div>
        </div>
      </section>

      <section>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Experiments</h2>
          <p className={styles.sectionSubtitle}>Short, actionable riffs you can try this week.</p>
        </div>
        <div className={styles.archiveGrid}>
          {secondaryIssues.map((issue) => (
            <IssueCard key={issue.slug} issue={issue} />
          ))}
        </div>
      </section>

      <section id="archive">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Archive</h2>
          <p className={styles.sectionSubtitle}>Filter by theme and revisit past issues.</p>
        </div>
        <div className={styles.tagFilter}>
          <Link href="/weekly" className={`${styles.tagLink} ${activeTag === 'all' ? styles.tagLinkActive : ''}`}>
            All
          </Link>
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/weekly?tag=${encodeURIComponent(tag)}`}
              className={`${styles.tagLink} ${activeTag === tag ? styles.tagLinkActive : ''}`}
            >
              {tag}
            </Link>
          ))}
        </div>
        <div className={styles.archiveGrid}>
          {archiveIssues.map((issue) => (
            <IssueCard key={`archive-${issue.slug}`} issue={issue} />
          ))}
        </div>
      </section>
    </WeeklyLayout>
  );
};

export default WeeklyPage;

