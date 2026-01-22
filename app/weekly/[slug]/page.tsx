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

  const imageUrl = issue.coverImageUrl 
    ? `https://www.therma.one${issue.coverImageUrl}` 
    : 'https://www.therma.one/og-image.png?v=4';
  
  const articleUrl = `https://www.therma.one/weekly/${issue.slug}`;

  return {
    title: `${issue.title} · Therma Weekly`,
    description: issue.subtitle,
    keywords: issue.tags,
    alternates: {
      canonical: articleUrl,
    },
    // Open Graph - Facebook, LinkedIn, Discord, Slack, WhatsApp, Telegram
    openGraph: {
      type: 'article',
      title: `${issue.title} · Therma Weekly`,
      description: issue.subtitle,
      url: articleUrl,
      siteName: 'Therma',
      publishedTime: issue.publishedAt,
      modifiedTime: issue.publishedAt,
      authors: ['https://www.therma.one'],
      section: 'Wellness',
      tags: issue.tags,
      locale: 'en_US',
      images: [{
        url: imageUrl,
        secureUrl: imageUrl,
        width: 1200,
        height: 630,
        alt: `${issue.title} - Therma Weekly Issue #${issue.issueNumber}`,
        type: 'image/png'
      }],
    },
    // Twitter/X Cards
    twitter: {
      card: 'summary_large_image',
      site: '@gettherma',
      creator: '@gettherma',
      title: `${issue.title} · Therma Weekly`,
      description: issue.subtitle,
      images: [{
        url: imageUrl,
        alt: `${issue.title} - Therma Weekly`
      }],
    },
    // Additional social metadata
    other: {
      // Pinterest Rich Pin - Article
      'article:publisher': 'https://www.facebook.com/gettherma',
      'article:author': 'Therma',
      'article:section': 'Wellness',
      'article:tag': issue.tags.join(','),
      // LinkedIn specific
      'linkedin:owner': 'get-therma',
      // Reading time estimate (200 words per minute, ~6 chars per word = 1200 chars/min)
      'twitter:label1': 'Reading time',
      'twitter:data1': `${Math.max(1, Math.ceil((issue.scientificSection.body.length + issue.personalSection.body.length) / 1200))} min read`,
      'twitter:label2': 'Category',
      'twitter:data2': 'Wellness & Mindfulness'
    },
    robots: { index: true, follow: true },
    creator: 'Therma',
    publisher: 'Therma'
  };
}

const IssuePage = ({ params }: IssuePageProps) => {
  const issue = getIssueBySlug(params.slug);
  if (!issue) {
    notFound();
  }
  const siblings = getIssueSiblings(issue.slug);

  const description = `Issue #${issue.issueNumber.toString().padStart(2, '0')} of Therma Weekly.`;

  // Article structured data for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": issue.title,
    "description": issue.subtitle,
    "image": issue.coverImageUrl ? `https://www.therma.one${issue.coverImageUrl}` : "https://www.therma.one/og-image.png",
    "datePublished": issue.publishedAt,
    "dateModified": issue.publishedAt,
    "author": {
      "@type": "Organization",
      "name": "Therma",
      "url": "https://www.therma.one"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Therma",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.therma.one/therma-logo.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.therma.one/weekly/${issue.slug}`
    },
    "keywords": issue.tags.join(", "),
    "articleSection": "Therma Weekly",
    "wordCount": Math.round((issue.scientificSection.body.length + issue.personalSection.body.length) / 5)
  };

  // Breadcrumb structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.therma.one/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Therma Weekly",
        "item": "https://www.therma.one/weekly"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": issue.title,
        "item": `https://www.therma.one/weekly/${issue.slug}`
      }
    ]
  };

  return (
    <WeeklyLayout hero={<IssueHero issue={issue} />} description={description}>
      {/* Article Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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

