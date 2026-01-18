/**
 * Redirect Map for URL Changes
 * 
 * Add entries here when URLs change to ensure old links still work.
 * These are applied in next.config.js via the redirects() function.
 * 
 * Format: { source: '/old-path', destination: '/new-path', permanent: true }
 * 
 * Examples:
 * - Page rename: { source: '/about-us', destination: '/about', permanent: true }
 * - Slug change: { source: '/blog/old-slug', destination: '/blog/new-slug', permanent: true }
 * - Section move: { source: '/help/:path*', destination: '/support/:path*', permanent: true }
 */

/**
 * Custom redirects for URL changes
 * Add new entries here when pages are moved or renamed
 * @type {Array<{source: string, destination: string, permanent: boolean}>}
 */
const customRedirects = [
  // Example redirects (uncomment and modify as needed):
  // { source: '/terms', destination: '/beta-terms', permanent: true },
  // { source: '/tos', destination: '/beta-terms', permanent: true },
  // { source: '/help', destination: '/faq', permanent: true },
  
  // Beacons.ai link shortener support (if you use custom paths)
  // { source: '/b/:id', destination: '/?ref=beacons&id=:id', permanent: false },
];

/**
 * Get all custom redirects for next.config.js
 * @returns {Array<{source: string, destination: string, permanent: boolean}>}
 */
function getCustomRedirects() {
  return customRedirects.filter((redirect) => {
    // Validate redirect entries
    return redirect.source && redirect.destination;
  });
}

module.exports = {
  customRedirects,
  getCustomRedirects,
};
