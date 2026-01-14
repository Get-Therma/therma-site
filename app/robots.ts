import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === 'production';
  const isStaging = process.env.VERCEL_ENV === 'preview' || process.env.NEXT_PUBLIC_STAGING === 'true';
  
  // Block indexing on staging/preview environments
  if (isStaging || !isProduction) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }
  
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://www.therma.one/sitemap.xml',
  };
}
