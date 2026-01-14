# SEO Implementation Guide

## Overview

This document outlines the SEO implementation for therma.one, including all optimizations, configuration, and validation steps.

## Framework & Hosting

- **Framework**: Next.js 14 (App Router)
- **Hosting**: Vercel
- **Domain**: www.therma.one (canonical)

## Implemented SEO Features

### 1. URL Normalization & Redirects

**Location**: `next.config.js`

- ✅ **www/non-www normalization**: All non-www requests redirect to www (301)
- ✅ **Trailing slash removal**: All URLs with trailing slashes redirect to non-trailing (301)
- ✅ **HTTPS enforcement**: Handled by Vercel automatically

**How it works**:
```javascript
// Redirects non-www to www
{
  source: '/:path*',
  has: [{ type: 'host', value: 'therma.one' }],
  destination: 'https://www.therma.one/:path*',
  permanent: true
}

// Remove trailing slashes
{
  source: '/:path+/',
  destination: '/:path+',
  permanent: true
}
```

### 2. Robots.txt

**Location**: `app/robots.ts`

- ✅ Automatically blocks indexing on staging/preview environments
- ✅ Allows indexing in production
- ✅ References sitemap.xml

**Environment Detection**:
- Production: `NODE_ENV=production` → Indexing allowed
- Staging: `VERCEL_ENV=preview` or `NEXT_PUBLIC_STAGING=true` → Indexing blocked

### 3. Sitemap

**Location**: `app/sitemap.ts`

- ✅ Dynamic sitemap generation
- ✅ All public pages included with correct priorities
- ✅ Absolute URLs with canonical domain
- ✅ Automatically generated at `/sitemap.xml`

**Included Pages**:
- `/` (priority: 1.0)
- `/faq` (priority: 0.8)
- `/contact` (priority: 0.7)
- `/weekly` (priority: 0.7)
- `/privacy` (priority: 0.5)
- `/beta-terms` (priority: 0.4)
- `/thank-you` (priority: 0.4, noindex)

### 4. Canonical URLs

**Implementation**: All pages include canonical URLs

- ✅ Canonical URLs use absolute URLs (https://www.therma.one/...)
- ✅ UTM parameters automatically stripped from canonical URLs
- ✅ Utility function in `lib/seo.ts` for consistent handling

**Pages with Canonical URLs**:
- Homepage: `https://www.therma.one/`
- FAQ: `https://www.therma.one/faq`
- Contact: `https://www.therma.one/contact`
- Weekly: `https://www.therma.one/weekly`
- Privacy: `https://www.therma.one/privacy`
- Beta Terms: `https://www.therma.one/beta-terms`
- Thank You: `https://www.therma.one/thank-you` (noindex)

### 5. Page Metadata

**Every page includes**:
- ✅ Unique `<title>` tag
- ✅ Unique meta description
- ✅ Open Graph tags (og:title, og:description, og:url, og:image)
- ✅ Twitter Card metadata
- ✅ Canonical URL

**Page-Specific Metadata**:

| Page | Title | Description |
|------|-------|-------------|
| Home | Therma – AI Habit Tracker & Guided Reflections | Unlock daily clarity with AI-guided reflections... |
| FAQ | FAQ - Frequently Asked Questions \| Therma | Get answers to common questions about Therma... |
| Contact | Contact Us \| Therma | Get in touch with Therma. Have questions... |
| Weekly | Therma Weekly - Coming Soon \| Therma | Therma Weekly is coming soon... |
| Privacy | Privacy Policy · Therma | How Therma collects, uses, and protects your data... |
| Beta Terms | Beta Program Terms · Therma | Terms for participating in the Therma beta... |
| Thank You | Thank You · Therma | Thanks for joining the Therma waitlist... (noindex) |

### 6. Search Console Verification

**Location**: `app/layout.tsx`

**Environment Variables Required**:
```bash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="your-google-verification-code"
NEXT_PUBLIC_BING_SITE_VERIFICATION="your-bing-verification-code"
```

**How to Get Verification Codes**:
1. **Google Search Console**: 
   - Go to https://search.google.com/search-console
   - Add property: `www.therma.one`
   - Choose "HTML tag" verification method
   - Copy the `content` value from the meta tag
   - Set as `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`

2. **Bing Webmaster Tools**:
   - Go to https://www.bing.com/webmasters
   - Add site: `www.therma.one`
   - Choose "Meta tag" verification
   - Copy the `content` value
   - Set as `NEXT_PUBLIC_BING_SITE_VERIFICATION`

### 7. Beacons.ai Integration

**Location**: `app/layout.tsx`

**Environment Variable**:
```bash
NEXT_PUBLIC_BEACONS_ID="your-beacons-id"
```

**How to Get Beacons ID**:
1. Log into your Beacons.ai dashboard
2. Go to Settings → Tracking
3. Copy your Beacons ID
4. Set as `NEXT_PUBLIC_BEACONS_ID`

**What it does**:
- Tracks page views and user interactions
- Provides analytics dashboard in Beacons.ai
- Automatically loads on all pages when configured

### 8. 404 Page

**Location**: `app/not-found.tsx`

- ✅ Custom 404 page with proper styling
- ✅ Includes `noindex` meta tag
- ✅ User-friendly error message
- ✅ Link back to homepage

### 9. Semantic HTML & Headings

**Implementation**:
- ✅ One H1 per page
- ✅ Logical H2/H3 hierarchy
- ✅ Proper semantic HTML5 elements
- ✅ ARIA labels on sections for accessibility

**Heading Structure Example** (Homepage):
```
H1: "Discover Your Patterns. Optimize Your Routine."
H2: "Why Therma?"
H3: "Daily Reflections"
H3: "AI Companion"
H3: "Mindful Space"
```

### 10. Performance Optimizations

**Already Implemented**:
- ✅ Image optimization (AVIF/WebP formats)
- ✅ Font optimization with proper caching
- ✅ Code splitting and lazy loading
- ✅ Compression enabled
- ✅ Static asset caching (1 year)
- ✅ Next.js automatic optimizations

**Core Web Vitals**:
- Images are optimized and lazy-loaded
- No render-blocking resources
- Minimal layout shift
- Fast Time to First Byte (TTFB)

### 11. Structured Data (JSON-LD)

**Already Implemented** (from previous SEO work):
- ✅ Organization schema
- ✅ SoftwareApplication schema
- ✅ WebSite schema
- ✅ FAQPage schema (FAQ page)
- ✅ BreadcrumbList schema

## Environment Variables Setup

### Required for Production

Add these to your Vercel environment variables:

```bash
# Search Console Verification (optional but recommended)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="your-code-here"
NEXT_PUBLIC_BING_SITE_VERIFICATION="your-code-here"

# Beacons.ai (optional)
NEXT_PUBLIC_BEACONS_ID="your-beacons-id"
```

### Staging/Development

For staging environments, set:
```bash
NEXT_PUBLIC_STAGING=true
```

This will automatically block search engine indexing.

## Validation & Testing

### 1. Check Redirects

```bash
# Test www redirect (should redirect to www)
curl -I http://therma.one/
curl -I https://therma.one/

# Test trailing slash removal
curl -I https://www.therma.one/faq/

# Should return 301 redirects
```

### 2. Check Robots.txt

```bash
# Production
curl https://www.therma.one/robots.txt

# Should return:
# User-agent: *
# Allow: /
# Sitemap: https://www.therma.one/sitemap.xml
```

### 3. Check Sitemap

```bash
curl https://www.therma.one/sitemap.xml

# Should return XML with all pages
```

### 4. Check Canonical URLs

**Using Browser DevTools**:
1. Open any page
2. View page source (Cmd+Option+U / Ctrl+U)
3. Search for `rel="canonical"`
4. Verify URL is absolute and doesn't include UTM parameters

**Using curl**:
```bash
curl https://www.therma.one/ | grep -i canonical
```

### 5. Check Meta Tags

**Using Browser DevTools**:
1. Open DevTools (F12)
2. Go to Elements/Inspector
3. Check `<head>` section for:
   - `<title>` tag
   - `<meta name="description">`
   - `<meta property="og:title">`
   - `<meta property="og:url">`
   - `<link rel="canonical">`

**Using curl**:
```bash
curl https://www.therma.one/ | grep -E '<title>|<meta name="description"|<link rel="canonical"'
```

### 6. Check 404 Page

```bash
curl https://www.therma.one/nonexistent-page

# Should return 404 status and custom 404 page
```

### 7. Validate Structured Data

**Google Rich Results Test**:
1. Go to https://search.google.com/test/rich-results
2. Enter: `https://www.therma.one/`
3. Click "Test URL"
4. Should show no errors

**Schema.org Validator**:
1. Go to https://validator.schema.org/
2. Enter: `https://www.therma.one/`
3. Should validate Organization, SoftwareApplication, WebSite schemas

### 8. Check Search Console Verification

**After setting environment variables**:
1. View page source
2. Search for `google-site-verification`
3. Should see meta tag with your verification code

### 9. Check Beacons Integration

**After setting environment variable**:
1. Open browser DevTools → Network tab
2. Reload page
3. Look for request to `beacons.ai/embed.js`
4. Should see script loading

### 10. Performance Testing

**Lighthouse** (Chrome DevTools):
1. Open DevTools → Lighthouse
2. Run audit for:
   - Performance
   - SEO
   - Accessibility
3. SEO score should be 100
4. Performance should be 90+

**PageSpeed Insights**:
1. Go to https://pagespeed.web.dev/
2. Enter: `https://www.therma.one/`
3. Check Core Web Vitals scores

## Files Changed

### Core SEO Files
- `next.config.js` - Added redirects for www/non-www and trailing slashes
- `app/robots.ts` - Enhanced with staging environment detection
- `app/sitemap.ts` - Already optimized (no changes needed)
- `app/not-found.tsx` - Created custom 404 page
- `app/layout.tsx` - Added search console verification and Beacons integration
- `lib/seo.ts` - Created SEO utility functions

### Page Metadata Updates
- `app/(legal)/privacy/layout.tsx` - Added canonical and OpenGraph
- `app/thank-you/layout.tsx` - Added canonical and noindex
- `app/(legal)/beta-terms/page.tsx` - Added canonical and OpenGraph
- `app/weekly/layout.tsx` - Updated canonical URL
- `app/weekly/[slug]/page.tsx` - Updated canonical URL
- `app/already-registered/page.tsx` - Added metadata via useEffect
- `app/faq/page.tsx` - Already has metadata (from previous work)
- `app/contact/page.tsx` - Already has metadata (from previous work)
- `app/weekly/page.tsx` - Already has metadata (from previous work)

### Configuration Files
- `env.example` - Added SEO-related environment variables
- `SEO.md` - This documentation file

## Next Steps

### Immediate Actions
1. ✅ Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel
2. ✅ Set `NEXT_PUBLIC_BING_SITE_VERIFICATION` in Vercel (optional)
3. ✅ Set `NEXT_PUBLIC_BEACONS_ID` in Vercel (if using Beacons)
4. ✅ Submit sitemap to Google Search Console
5. ✅ Submit sitemap to Bing Webmaster Tools

### Ongoing Monitoring
1. Monitor Google Search Console for:
   - Indexing status
   - Search performance
   - Coverage issues
   - Mobile usability

2. Monitor Beacons.ai dashboard for:
   - Page views
   - User interactions
   - Traffic sources

3. Regular checks:
   - Run Lighthouse audits monthly
   - Check for broken links
   - Monitor Core Web Vitals
   - Review search rankings

## Troubleshooting

### Redirects Not Working
- Check Vercel deployment logs
- Verify `next.config.js` syntax
- Test redirects in production (not localhost)

### Robots.txt Blocking Production
- Check `NODE_ENV` is set to `production`
- Verify `VERCEL_ENV` is not `preview`
- Check `NEXT_PUBLIC_STAGING` is not set to `true`

### Canonical URLs Include UTM Parameters
- Verify canonical URLs are set in metadata
- Check that `lib/seo.ts` utility is being used
- Ensure URLs are absolute (starting with https://)

### Search Console Not Verifying
- Check environment variable is set correctly
- Verify variable name starts with `NEXT_PUBLIC_`
- Rebuild and redeploy after setting variables
- Check meta tag appears in page source

### Beacons Not Tracking
- Verify `NEXT_PUBLIC_BEACONS_ID` is set
- Check browser console for errors
- Verify script loads in Network tab
- Check Beacons dashboard for data

## Support

For questions or issues:
1. Check this documentation
2. Review Next.js SEO documentation: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
3. Check Vercel deployment logs
4. Review Google Search Console help center

---

**Last Updated**: January 2025
**Status**: ✅ Production Ready
