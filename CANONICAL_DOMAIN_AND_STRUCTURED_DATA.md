# Canonical Domain & Structured Data Implementation

## ✅ Implementation Complete

### Canonical Domain: therma.one

All traffic from `gettherma.ai` now redirects to `therma.one` (canonical domain) with paths and query parameters preserved.

---

## 1. Domain Redirects Implementation

### Redirect Rules (Next.js/Vercel)

**Location**: `next.config.js`

**Rules Implemented**:
```javascript
// Redirect gettherma.ai to therma.one (preserves path and query params)
{
  source: '/:path*',
  has: [{ type: 'host', value: 'gettherma.ai' }],
  destination: 'https://www.therma.one/:path*',
  permanent: true // 301 redirect
}

// Redirect www.gettherma.ai to therma.one
{
  source: '/:path*',
  has: [{ type: 'host', value: 'www.gettherma.ai' }],
  destination: 'https://www.therma.one/:path*',
  permanent: true // 301 redirect
}
```

### Redirect Examples

| From | To | Status |
|------|-----|--------|
| `http://gettherma.ai/` | `https://www.therma.one/` | 301 |
| `https://gettherma.ai/` | `https://www.therma.one/` | 301 |
| `https://www.gettherma.ai/` | `https://www.therma.one/` | 301 |
| `https://gettherma.ai/faq` | `https://www.therma.one/faq` | 301 |
| `https://gettherma.ai/contact?ref=test` | `https://www.therma.one/contact?ref=test` | 301 |
| `https://gettherma.ai/weekly?utm_source=email` | `https://www.therma.one/weekly?utm_source=email` | 301 |

**Key Features**:
- ✅ Preserves path (`/:path*`)
- ✅ Preserves query parameters automatically
- ✅ 301 permanent redirects (SEO-friendly)
- ✅ Works for both `gettherma.ai` and `www.gettherma.ai`

---

## 2. Canonical URLs Updated

All canonical URLs now use `therma.one`:

**Files Updated**:
- ✅ `app/layout.tsx` - metadataBase and canonical
- ✅ `app/sitemap.ts` - All URLs use `https://www.therma.one`
- ✅ `app/robots.ts` - Sitemap URL uses `https://www.therma.one`
- ✅ All page metadata files - Canonical URLs updated

**Canonical URLs**:
- Homepage: `https://www.therma.one/`
- FAQ: `https://www.therma.one/faq`
- Contact: `https://www.therma.one/contact`
- Weekly: `https://www.therma.one/weekly`
- Privacy: `https://www.therma.one/privacy`
- Beta Terms: `https://www.therma.one/beta-terms`

---

## 3. Validation Commands

### Test Redirects

```bash
# Test gettherma.ai redirect (should redirect to therma.one)
curl -I http://gettherma.ai/
curl -I https://gettherma.ai/
curl -I https://www.gettherma.ai/

# Test with paths
curl -I https://gettherma.ai/faq
curl -I https://gettherma.ai/contact?ref=test

# Test with query parameters
curl -I "https://gettherma.ai/?utm_source=email&utm_campaign=test"

# Expected response headers:
# HTTP/1.1 301 Moved Permanently
# Location: https://www.therma.one/...
```

### Verify Canonical URLs

```bash
# Check homepage canonical
curl https://www.therma.one/ | grep -i "rel=\"canonical\""

# Check FAQ canonical
curl https://www.therma.one/faq | grep -i "rel=\"canonical\""

# Should show: <link rel="canonical" href="https://www.therma.one/...">
```

### Verify Sitemap

```bash
# Check sitemap uses therma.one
curl https://www.therma.one/sitemap.xml | grep -i "therma.one"

# Should show all URLs with therma.one domain
```

### Verify Robots.txt

```bash
# Check robots.txt references correct sitemap
curl https://www.therma.one/robots.txt

# Should show: Sitemap: https://www.therma.one/sitemap.xml
```

### Test from gettherma.ai Domain

```bash
# Test redirect preserves query params
curl -I "https://gettherma.ai/faq?utm_source=test&ref=email"

# Location header should be: https://www.therma.one/faq?utm_source=test&ref=email
```

---

## 4. JSON-LD Structured Data

### Organization Schema

**Location**: `app/layout.tsx`

**JSON-LD Block**:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Therma",
  "url": "https://www.therma.one",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.therma.one/therma-logo.svg",
    "width": 512,
    "height": 512
  },
  "description": "AI habit tracker and guided reflection app that helps you discover patterns and optimize your routine",
  "sameAs": [
    "https://x.com/gettherma",
    "https://www.instagram.com/gettherma/",
    "https://www.pinterest.com/gettherma/",
    "https://www.linkedin.com/company/get-therma/",
    "https://www.youtube.com/@gettherma"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "support@gettherma.ai",
    "contactType": "Customer Support",
    "availableLanguage": "English"
  }
}
```

**Properties Included**:
- ✅ `name` - Organization name
- ✅ `url` - Canonical website URL
- ✅ `logo` - Logo as ImageObject with dimensions
- ✅ `description` - Clear description
- ✅ `sameAs` - All official social profiles
- ✅ `contactPoint` - Support email and contact type

**Compliance**: Follows Google Search Central guidelines for Organization schema.

---

### FAQPage Schema

**Location**: `app/faq/page.tsx`

**JSON-LD Block**:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is this therapy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Therma is a self-reflection tool and isn't medical advice."
      }
    },
    {
      "@type": "Question",
      "name": "Will it be free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We'll offer a free tier; early waitlisters get first beta access and perks."
      }
    },
    {
      "@type": "Question",
      "name": "iOS or Android?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "iOS first, Android next."
      }
    },
    {
      "@type": "Question",
      "name": "Privacy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We don't sell data. Therma is built on a HIPAA compliant basis."
      }
    },
    {
      "@type": "Question",
      "name": "How is Therma different from journaling apps?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike traditional journaling apps, Therma combines daily reflections with an AI companion that listens and responds thoughtfully. It's designed to help you actually hear yourself through gentle prompts and meaningful conversations."
      }
    },
    {
      "@type": "Question",
      "name": "When will Therma launch?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We're working hard to bring Therma to you soon! Join our waitlist to be among the first to experience it when we launch. We'll keep you updated on our progress."
      }
    }
  ]
}
```

**Properties Included**:
- ✅ `@type`: "FAQPage"
- ✅ `mainEntity`: Array of Question/Answer pairs
- ✅ Each Question has `name` and `acceptedAnswer`
- ✅ Each Answer has `text` property

**Eligibility**: ✅ Eligible for FAQ rich results (6+ questions, clear Q&A format)

**Compliance**: Follows Google Search Central FAQPage guidelines.

---

### SoftwareApplication Schema

**Location**: `app/layout.tsx`

**JSON-LD Block**:
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Therma",
  "applicationCategory": "HealthApplication",
  "operatingSystem": ["iOS", "Android"],
  "description": "AI habit tracker and guided reflection app that helps you discover patterns in your daily life and optimize your routine for peak energy, clarity, and confidence.",
  "url": "https://www.therma.one",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/PreOrder"
  }
}
```

**Properties Included** (only what appears on-page):
- ✅ `name` - App name
- ✅ `applicationCategory` - HealthApplication
- ✅ `operatingSystem` - iOS, Android
- ✅ `description` - Clear description
- ✅ `url` - Website URL
- ✅ `offers` - Free tier, PreOrder status

**Note**: This schema is prepared for future expansion. When app details are published (app store links, screenshots, ratings), add:
- `applicationSubCategory`
- `screenshot` (ImageObject)
- `aggregateRating` (when reviews available)
- `offers.url` (app store links)

**Compliance**: Only includes properties that appear on-page (not misleading).

---

## 5. How to Validate Structured Data

### Google Rich Results Test

1. **Go to**: https://search.google.com/test/rich-results
2. **Enter URL**: `https://www.therma.one/`
3. **Click**: "Test URL"
4. **Expected Results**:
   - ✅ Organization schema detected
   - ✅ SoftwareApplication schema detected
   - ✅ No errors or warnings

### Validate FAQPage Schema

1. **Go to**: https://search.google.com/test/rich-results
2. **Enter URL**: `https://www.therma.one/faq`
3. **Click**: "Test URL"
4. **Expected Results**:
   - ✅ FAQPage schema detected
   - ✅ All 6 questions detected
   - ✅ Eligible for FAQ rich results
   - ✅ No errors or warnings

### Schema.org Validator

1. **Go to**: https://validator.schema.org/
2. **Enter URL**: `https://www.therma.one/`
3. **Click**: "Run Test"
4. **Expected Results**:
   - ✅ Organization schema valid
   - ✅ SoftwareApplication schema valid
   - ✅ No validation errors

### Manual Validation (curl)

```bash
# Extract Organization schema
curl -s https://www.therma.one/ | grep -A 20 'application/ld+json' | head -25

# Extract FAQPage schema
curl -s https://www.therma.one/faq | grep -A 30 'application/ld+json' | head -35

# Validate JSON syntax
curl -s https://www.therma.one/ | grep -o 'application/ld+json.*</script>' | sed 's/.*>\(.*\)<\/script>/\1/' | python3 -m json.tool
```

### Browser DevTools Validation

1. **Open**: `https://www.therma.one/` in Chrome
2. **Open DevTools** (F12)
3. **Go to**: Console tab
4. **Run**: 
   ```javascript
   // Check for structured data
   document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
     try {
       const data = JSON.parse(script.textContent);
       console.log('Valid JSON-LD:', data['@type'], data);
     } catch(e) {
       console.error('Invalid JSON:', e);
     }
   });
   ```

---

## 6. Files Changed

### Domain Redirects
1. `next.config.js` - Added gettherma.ai redirects

### Canonical URLs (Already using therma.one)
2. `app/layout.tsx` - metadataBase and canonical URLs
3. `app/sitemap.ts` - All URLs use therma.one
4. `app/robots.ts` - Sitemap URL uses therma.one
5. All page metadata files - Already using therma.one

### Structured Data
6. `app/layout.tsx` - Enhanced Organization schema, prepared SoftwareApplication schema
7. `app/faq/page.tsx` - Updated FAQPage schema to use dynamic FAQ array

---

## 7. Validation Checklist

### Domain Redirects
- [ ] Test `http://gettherma.ai/` redirects to `https://www.therma.one/`
- [ ] Test `https://gettherma.ai/faq` redirects to `https://www.therma.one/faq`
- [ ] Test query params preserved: `https://gettherma.ai/?utm_source=test`
- [ ] Verify 301 status code (not 302)
- [ ] Test both `gettherma.ai` and `www.gettherma.ai`

### Canonical URLs
- [ ] All pages have canonical URLs with `therma.one`
- [ ] Sitemap uses `therma.one` domain
- [ ] Robots.txt references `therma.one` sitemap
- [ ] No references to `gettherma.ai` in canonical tags

### Structured Data
- [ ] Organization schema validates (Rich Results Test)
- [ ] FAQPage schema validates (Rich Results Test)
- [ ] SoftwareApplication schema validates (Rich Results Test)
- [ ] No misleading information in schemas
- [ ] All required properties present
- [ ] JSON syntax valid

---

## 8. SEO Impact

### Benefits
- ✅ **Consolidated Domain Authority**: All traffic consolidates to therma.one
- ✅ **No Duplicate Content**: gettherma.ai redirects prevent duplicate indexing
- ✅ **Rich Results**: FAQPage schema enables FAQ rich snippets
- ✅ **Knowledge Graph**: Organization schema helps Google understand brand
- ✅ **App Discovery**: SoftwareApplication schema helps with app store integration

### Monitoring
- Monitor redirect performance in Google Search Console
- Track FAQ rich result impressions
- Monitor Organization schema in Knowledge Graph
- Check for any crawl errors related to redirects

---

## 9. Troubleshooting

### Redirects Not Working
- **Check**: Vercel deployment logs
- **Verify**: Both domains are configured in Vercel
- **Test**: Redirects work in production (not localhost)
- **Note**: Next.js redirects only work in production builds

### Structured Data Not Detected
- **Check**: JSON syntax is valid (no trailing commas)
- **Verify**: Script tags are in `<head>` section
- **Test**: Use Rich Results Test tool
- **Ensure**: No JavaScript errors blocking script execution

### FAQ Rich Results Not Showing
- **Wait**: Can take days/weeks for Google to show rich results
- **Verify**: FAQPage schema validates correctly
- **Ensure**: At least 2 questions present (we have 6)
- **Check**: Questions/answers match visible content on page

---

**Status**: ✅ Implementation Complete
**Date**: January 2025
**Canonical Domain**: therma.one
**Structured Data**: Organization, FAQPage, SoftwareApplication
