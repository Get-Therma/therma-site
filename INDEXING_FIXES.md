# Google Indexing Issues - Fixed

**Date**: January 26, 2026  
**Status**: ✅ Fixed - Awaiting Deployment

## Problem Summary

Your Google Search Console showed 11 pages not indexed with these errors:
- **3 pages**: "Page with redirect"
- **1 page**: "Alternate page with proper canonical tag"
- **5 pages**: "Discovered - currently not indexed"
- **2 pages**: "Crawled - currently not indexed"

## Root Causes Identified

### 1. **Outdated Static Files Overriding Dynamic Configuration**

Your Next.js app has dynamic SEO files that generate correct URLs with `www.therma.one`, but old static files were taking priority:

- ❌ `public/sitemap.xml` - Referenced old domain `gettherma.ai`
- ❌ `public/robots.txt` - Referenced old domain `gettherma.ai/sitemap.xml`

### 2. **Duplicate HTML Files Creating Indexing Confusion**

Old static HTML files were competing with your Next.js pages:

**In root directory:**
- ❌ `contact.html`
- ❌ `faq.html`
- ❌ `thank-you.html`

**In public/ directory:**
- ❌ `public/therma-landing.html`
- ❌ `public/faq.html`
- ❌ `public/contact.html`
- ❌ `public/contact-general.html`

### 3. **Domain Redirect Chain**

Google was finding URLs in the old sitemap (`gettherma.ai`) → redirecting to `www.therma.one` → causing "Page with redirect" errors.

## Fixes Applied

### ✅ 1. Removed Outdated Static SEO Files

**Deleted:**
- `public/sitemap.xml` (old domain)
- `public/robots.txt` (old domain)

**Now Active (Dynamic Next.js files):**
- `app/sitemap.ts` → Generates sitemap at `/sitemap.xml` with correct domain
- `app/robots.ts` → Generates robots.txt at `/robots.txt` with correct domain

### ✅ 2. Removed Duplicate HTML Files

**Deleted all static HTML files** that were competing with Next.js pages:
- Root: `contact.html`, `faq.html`, `thank-you.html`
- Public: `therma-landing.html`, `faq.html`, `contact.html`, `contact-general.html`

### ✅ 3. Verified SEO Configuration

**Confirmed working:**
- ✅ Dynamic sitemap uses `https://www.therma.one` (correct canonical domain)
- ✅ Dynamic robots.txt references `https://www.therma.one/sitemap.xml`
- ✅ All pages have proper canonical URLs
- ✅ Redirects configured: `gettherma.ai` → `www.therma.one`
- ✅ Redirects configured: `therma.one` → `www.therma.one`
- ✅ Admin and test pages have `noindex` set
- ✅ Thank you page has `noindex` set

## Current Site Structure

### Pages That SHOULD Be Indexed (7 pages)

1. **/** - Homepage (priority: 1.0)
2. **/faq** - FAQ page (priority: 0.8)
3. **/contact** - Contact page (priority: 0.7)
4. **/weekly** - Newsletter hub (priority: 0.7)
5. **/privacy** - Privacy policy (priority: 0.5)
6. **/beta-terms** - Terms of use (priority: 0.4)
7. **/weekly/[slug]** - Individual newsletter issues (priority: 0.6)

### Pages That Should NOT Be Indexed (noindex set)

- **/admin** - Admin dashboard
- **/test-duplicate** - Internal testing
- **/already-registered** - Duplicate email page
- **/thank-you** - Confirmation page

### Redirect Pages

- **/terms** → redirects to `/beta-terms` (301)

## What Happens Next

### Immediate (After Deployment)

1. **New sitemap will be served** at `https://www.therma.one/sitemap.xml` with correct URLs
2. **New robots.txt will be served** with correct sitemap reference
3. **Old HTML files will 404** (which is good - Google will remove them)

### Within 1-7 Days (Google's Timeline)

Google will:
1. Discover the new sitemap with correct URLs
2. Recrawl your site and find pages at the correct domain
3. Remove old redirect chains
4. Index pages properly
5. Remove the old HTML files from the index

### Expected Result After Google Recrawl

- **Indexed pages**: Should increase from 4 to ~6-7 pages
- **Redirect errors**: Should drop to 0
- **"Alternate page" errors**: Should drop to 0
- **"Discovered/Crawled not indexed"**: May persist for low-priority pages (this is normal)

## Action Items

### 1. Deploy These Changes ✅ Required

```bash
git add .
git commit -m "Fix: Remove outdated static sitemap/robots.txt and duplicate HTML files for proper indexing"
git push
```

### 2. Submit Sitemap to Google Search Console ✅ Required

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property (`www.therma.one`)
3. Go to **Sitemaps** in left sidebar
4. Add sitemap URL: `https://www.therma.one/sitemap.xml`
5. Click **Submit**

### 3. Request URL Inspection for Key Pages ✅ Recommended

Speed up the indexing process by requesting Google to recrawl:

1. In Google Search Console, go to **URL Inspection**
2. Enter each of these URLs and click "Request Indexing":
   - `https://www.therma.one/`
   - `https://www.therma.one/faq`
   - `https://www.therma.one/contact`
   - `https://www.therma.one/weekly`
   - `https://www.therma.one/privacy`
   - `https://www.therma.one/beta-terms`

### 4. Remove Old URLs (Optional but Recommended)

If Google has indexed the old HTML files, you can request their removal:

1. Go to **Removals** in Google Search Console
2. Click **New Request**
3. Enter each old URL:
   - `https://www.therma.one/contact.html`
   - `https://www.therma.one/faq.html`
   - `https://www.therma.one/thank-you.html`
4. Select **Remove this URL only**
5. Submit request

### 5. Monitor Progress 📊 Ongoing

Check Google Search Console weekly:
- **Pages** → See indexed vs not indexed count
- **Sitemaps** → Verify new sitemap is discovered and processed
- **Coverage** → Monitor for new issues

## Verification Checklist

After deployment, verify these are working:

```bash
# 1. Check dynamic sitemap (should show www.therma.one URLs)
curl https://www.therma.one/sitemap.xml

# 2. Check dynamic robots.txt (should reference www.therma.one/sitemap.xml)
curl https://www.therma.one/robots.txt

# 3. Verify old HTML files return 404
curl -I https://www.therma.one/contact.html  # Should be 404
curl -I https://www.therma.one/faq.html      # Should be 404

# 4. Verify redirects still work
curl -I https://gettherma.ai/               # Should 301 to www.therma.one
curl -I https://therma.one/                 # Should 301 to www.therma.one
```

## Expected Timeline

| Timeframe | Expected Progress |
|-----------|-------------------|
| **Day 0** (Today) | Deploy fixes, submit sitemap |
| **Day 1-2** | Google discovers new sitemap |
| **Day 3-5** | Google recrawls pages with correct URLs |
| **Day 7** | Most pages should be indexed properly |
| **Day 14-30** | Full stabilization, old errors cleared |

## Technical Details

### Current SEO Configuration

**Canonical Domain**: `https://www.therma.one`

**Redirects** (in `next.config.js`):
```javascript
// gettherma.ai → www.therma.one
{
  source: '/:path*',
  has: [{ type: 'host', value: 'gettherma.ai' }],
  destination: 'https://www.therma.one/:path*',
  permanent: true
}

// therma.one → www.therma.one
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

// /terms → /beta-terms
{
  source: '/terms',
  destination: '/beta-terms',
  permanent: true
}
```

**Dynamic Sitemap** (`app/sitemap.ts`):
- Generated at build time
- Uses Next.js MetadataRoute
- Includes all public pages with priorities
- Includes dynamic weekly newsletter pages

**Dynamic Robots.txt** (`app/robots.ts`):
- Blocks indexing on staging/preview
- Allows indexing in production
- References correct sitemap URL

## Why This Will Fix Your Issues

### Before (The Problem)

```
Google Search Console
  ↓
Finds static sitemap.xml with gettherma.ai URLs
  ↓
Crawls https://gettherma.ai/faq
  ↓
Sees 301 redirect to https://www.therma.one/faq
  ↓
Marks as "Page with redirect" ❌
  ↓
Doesn't index it
```

### After (The Fix)

```
Google Search Console
  ↓
Finds dynamic sitemap.xml with www.therma.one URLs
  ↓
Crawls https://www.therma.one/faq
  ↓
Finds page directly (no redirect) ✅
  ↓
Indexes it properly ✅
```

## Support

If you see new issues after 7 days:

1. Check Google Search Console → Coverage report
2. Check which specific URLs have issues
3. Verify those URLs are in the sitemap: `https://www.therma.one/sitemap.xml`
4. Use URL Inspection tool to see what Google sees

## Related Documentation

- `SEO.md` - Full SEO implementation guide
- `next.config.js` - Redirects and SEO configuration
- `app/sitemap.ts` - Dynamic sitemap generator
- `app/robots.ts` - Dynamic robots.txt generator
- `lib/seo.ts` - SEO utility functions

---

**Last Updated**: January 26, 2026  
**Status**: ✅ Ready for deployment
