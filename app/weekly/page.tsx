import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

import IssueCard from '../../components/weekly/IssueCard';
import IssueMetaBar from '../../components/weekly/IssueMetaBar';
import WeeklyLayout from '../../components/weekly/WeeklyLayout';
import layoutStyles from '../../components/weekly/weekly.module.css';
import { getAllTags, getSortedIssues } from '../../content/weekly/issues';
import styles from './page.module.css';

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
  const volumes = issues.slice(0, 6);
  const leftVolumes = volumes.slice(0, 3);
  const rightVolumes = volumes.slice(3);

  const hero = (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroBrandRow}>
          <h1 className={styles.heroTitle}>Therma Weekly</h1>
          <p className={styles.heroTagline}>Slow magazine vibes, science-backed rituals.</p>
        </div>

        <div className={styles.heroShell}>
          <div className={styles.heroVolumeColumn}>
            {leftVolumes.map((issue) => (
              <Link key={issue.slug} href={`/weekly/${issue.slug}`} className={styles.volumePill}>
                <span className={styles.volumePillLabel}>VOL. {String(issue.issueNumber).padStart(2, '0')}</span>
              </Link>
            ))}
          </div>

          <div className={styles.heroCover}>
            <div className={styles.heroCoverInner}>
              <div className={styles.heroCoverHeader}>
                <span className={styles.heroCoverLogo}>Therma Weekly</span>
                <span className={styles.heroCoverSub}>
                  The Ritual Lab · Issue {featured ? String(featured.issueNumber).padStart(2, '0') : '—'}
                </span>
              </div>

              <div className={styles.heroCoverImageWrapper}>
                {featured?.coverImageUrl ? (
                  <>
                    <Image
                      src={featured.coverImageUrl}
                      alt={featured.title}
                      fill
                      className={styles.heroCoverImage}
                      sizes="(min-width: 1024px) 640px, 100vw"
                    />
                    <div className={styles.heroCoverOverlay}>
                      <div className={styles.heroCoverOverlayText}>
                        {featured.title}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={styles.heroCoverImagePlaceholder} />
                )}
              </div>

              <p className={styles.heroCoverCaption}>{featured?.subtitle}</p>
            </div>
          </div>

          <div className={styles.heroVolumeColumn}>
            {rightVolumes.map((issue) => (
              <Link key={issue.slug} href={`/weekly/${issue.slug}`} className={styles.volumePill}>
                <span className={styles.volumePillLabel}>VOL. {String(issue.issueNumber).padStart(2, '0')}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <WeeklyLayout hero={hero}>
      <section>
        <div className={layoutStyles.sectionHeader}>
          <h2 className={layoutStyles.sectionTitle}>Featured Issue</h2>
          <p className={layoutStyles.sectionSubtitle}>
            One part research briefing, one part lived experience. Updated weekly with experiments worth running.
          </p>
        </div>
        <div className={layoutStyles.featuredCard}>
          <div>
            <div className={layoutStyles.issueKicker}>Issue {featured.issueNumber.toString().padStart(2, '0')}</div>
            <h3 className={layoutStyles.issueTitle}>{featured.title}</h3>
            <p className={layoutStyles.issueSubtitle}>{featured.subtitle}</p>
            <IssueMetaBar issue={featured} />
            <Link href={`/weekly/${featured.slug}`} className={layoutStyles.ctaButton} style={{ marginTop: '16px' }}>
              Dive into the issue
            </Link>
          </div>
          <div className={layoutStyles.issueImage}>
            {featured.coverImageUrl && (
              <Image src={featured.coverImageUrl} alt={featured.title} fill sizes="(max-width: 768px) 100vw, 540px" />
            )}
          </div>
        </div>
      </section>

      <section>
        <div className={layoutStyles.sectionHeader}>
          <h2 className={layoutStyles.sectionTitle}>Recent Experiments</h2>
          <p className={layoutStyles.sectionSubtitle}>Short, actionable riffs you can try this week.</p>
        </div>
        <div className={layoutStyles.archiveGrid}>
          {secondaryIssues.map((issue) => (
            <IssueCard key={issue.slug} issue={issue} />
          ))}
        </div>
      </section>

      <section id="archive">
        <div className={layoutStyles.sectionHeader}>
          <h2 className={layoutStyles.sectionTitle}>Archive</h2>
          <p className={layoutStyles.sectionSubtitle}>Filter by theme and revisit past issues.</p>
        </div>
        <div className={layoutStyles.tagFilter}>
          <Link
            href="/weekly"
            className={`${layoutStyles.tagLink} ${activeTag === 'all' ? layoutStyles.tagLinkActive : ''}`}
          >
            All
          </Link>
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/weekly?tag=${encodeURIComponent(tag)}`}
              className={`${layoutStyles.tagLink} ${activeTag === tag ? layoutStyles.tagLinkActive : ''}`}
            >
              {tag}
            </Link>
          ))}
        </div>
        <div className={layoutStyles.archiveGrid}>
          {archiveIssues.map((issue) => (
            <IssueCard key={`archive-${issue.slug}`} issue={issue} />
          ))}
        </div>
      </section>
    </WeeklyLayout>
  );
};

export default WeeklyPage;

