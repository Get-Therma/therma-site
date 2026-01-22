import type { MetadataRoute } from 'next';
import { weeklyIssues } from '../content/weekly/issues';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.therma.one';
  const now = new Date();
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/weekly`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/beta-terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];
  
  // Dynamic weekly newsletter pages
  const weeklyPages: MetadataRoute.Sitemap = weeklyIssues.map((issue) => ({
    url: `${base}/weekly/${issue.slug}`,
    lastModified: new Date(issue.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  
  return [...staticPages, ...weeklyPages];
}
