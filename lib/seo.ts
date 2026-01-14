/**
 * SEO utility functions
 * Handles canonical URLs, UTM parameter stripping, and metadata generation
 */

/**
 * Get canonical URL without UTM parameters and query strings
 * Ensures clean canonical URLs for SEO
 */
export function getCanonicalUrl(path: string, baseUrl: string = 'https://www.therma.one'): string {
  // Remove trailing slash (except for root)
  const cleanPath = path === '/' ? '/' : path.replace(/\/$/, '');
  
  // Remove UTM parameters and other tracking params from URL if present
  const url = new URL(cleanPath, baseUrl);
  
  // Remove common tracking parameters
  const trackingParams = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'fbclid',
    'gclid',
    'ref',
    'source',
  ];
  
  trackingParams.forEach((param) => {
    url.searchParams.delete(param);
  });
  
  // Return clean canonical URL
  return url.toString();
}

/**
 * Generate page metadata with clean canonical URL
 */
export function generatePageMetadata(
  title: string,
  description: string,
  path: string,
  options?: {
    image?: string;
    noindex?: boolean;
    ogType?: 'website' | 'article';
  }
) {
  const canonicalUrl = getCanonicalUrl(path);
  const baseUrl = 'https://www.therma.one';
  
  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl.replace(baseUrl, ''),
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Therma',
      images: options?.image ? [{ url: options.image }] : undefined,
      type: options?.ogType || 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: options?.image ? [options.image] : undefined,
    },
    robots: options?.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/**
 * Strip UTM parameters from a URL string
 */
export function stripUtmParams(url: string): string {
  try {
    const urlObj = new URL(url);
    const trackingParams = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'fbclid',
      'gclid',
    ];
    
    trackingParams.forEach((param) => {
      urlObj.searchParams.delete(param);
    });
    
    return urlObj.toString();
  } catch {
    return url;
  }
}
