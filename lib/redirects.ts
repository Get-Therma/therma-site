/**
 * Redirect Map
 * 
 * Add future URL redirects here as needed.
 * Format: { from: '/old-path', to: '/new-path', permanent: true }
 * 
 * These redirects are handled by Next.js redirects() in next.config.js
 * For immediate redirects, add them directly to next.config.js
 * 
 * This file serves as documentation and can be used to generate redirects
 * programmatically if needed.
 */

export interface RedirectRule {
  from: string;
  to: string;
  permanent: boolean; // true = 301, false = 302
  reason?: string; // Optional: why this redirect exists
}

/**
 * Redirect map for future URL changes
 * Add entries here when URLs change
 */
export const redirectMap: RedirectRule[] = [
  // Example (commented out):
  // {
  //   from: '/old-page',
  //   to: '/new-page',
  //   permanent: true,
  //   reason: 'Page renamed during site restructure'
  // },
];

/**
 * Get redirect rules formatted for Next.js config
 */
export function getRedirectRules(): Array<{
  source: string;
  destination: string;
  permanent: boolean;
}> {
  return redirectMap.map((rule) => ({
    source: rule.from,
    destination: rule.to,
    permanent: rule.permanent,
  }));
}
