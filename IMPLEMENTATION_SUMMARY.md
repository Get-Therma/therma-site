# Implementation Summary: Canonical Domain & Structured Data

## ✅ Complete

---

## 1. Canonical Domain Redirects

### Redirect Rules (Vercel/Next.js)

**File**: `next.config.js`

```javascript
// Redirect gettherma.ai → therma.one (preserves path & query params)
{
  source: '/:path*',
  has: [{ type: 'host', value: 'gettherma.ai' }],
  destination: 'https://www.therma.one/:path*',
  permanent: true // 301
}

// Redirect www.gettherma.ai → therma.one
{
  source: '/:path*',
  has: [{ type: 'host', value: 'www.gettherma.ai' }],
  destination: 'https://www.therma.one/:path*',
  permanent: true // 301
}
```

### Redirect Examples

| From | To | Preserves |
|------|-----|-----------|
| `https://gettherma.ai/` | `https://www.therma.one/` | ✅ |
| `https://gettherma.ai/faq` | `https://www.therma.one/faq` | ✅ |
| `https://gettherma.ai/contact?ref=test` | `https://www.therma.one/contact?ref=test` | ✅ Query params |
| `https://gettherma.ai/weekly?utm_source=email` | `https://www.therma.one/weekly?utm_source=email` | ✅ Query params |

---

## 2. Validation Commands

### Test Redirects

```bash
# Basic redirect test
curl -I https://gettherma.ai/
# Expected: HTTP/1.1 301 Moved Permanently
# Expected: Location: https://www.therma.one/

# Test with path
curl -I https://gettherma.ai/faq
# Expected: Location: https://www.therma.one/faq

# Test with query parameters
curl -I "https://gettherma.ai/contact?ref=test&utm_source=email"
# Expected: Location: https://www.therma.one/contact?ref=test&utm_source=email

# Test www.gettherma.ai
curl -I https://www.gettherma.ai/
# Expected: Location: https://www.therma.one/
```

### Verify Canonical URLs

```bash
# Check homepage canonical
curl -s https://www.therma.one/ | grep -i "rel=\"canonical\""
# Expected: <link rel="canonical" href="https://www.therma.one/">

# Check FAQ canonical
curl -s https://www.therma.one/faq | grep -i "rel=\"canonical\""
# Expected: <link rel="canonical" href="https://www.therma.one/faq"
```

### Verify Sitemap & Robots

```bash
# Check sitemap uses therma.one
curl -s https://www.therma.one/sitemap.xml | head -20
# Should show: <loc>https://www.therma.one/</loc>

# Check robots.txt
curl -s https://www.therma.one/robots.txt
# Expected: Sitemap: https://www.therma.one/sitemap.xml
```

---

## 3. JSON-LD Structured Data

### Organization Schema

**Location**: `app/layout.tsx`

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
    "https://www.linkedin.com/company/gettherma/",
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

### FAQPage Schema

**Location**: `app/faq/page.tsx`

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
    // ... 5 more questions
  ]
}
```

**Questions Included**: 6 questions (eligible for rich results)

### SoftwareApplication Schema

**Location**: `app/layout.tsx`

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Therma",
  "applicationCategory": "HealthApplication",
  "operatingSystem": ["iOS", "Android"],
  "description": "AI habit tracker and guided reflection app...",
  "url": "https://www.therma.one",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/PreOrder"
  }
}
```

**Note**: Only includes properties that appear on-page (not misleading).

---

## 4. How to Validate Structured Data

### Google Rich Results Test

1. **Organization Schema**:
   - Go to: https://search.google.com/test/rich-results
   - Enter: `https://www.therma.one/`
   - Expected: ✅ Organization schema detected

2. **FAQPage Schema**:
   - Go to: https://search.google.com/test/rich-results
   - Enter: `https://www.therma.one/faq`
   - Expected: ✅ FAQPage schema detected, eligible for rich results

3. **SoftwareApplication Schema**:
   - Same as Organization (on homepage)
   - Expected: ✅ SoftwareApplication schema detected

### Schema.org Validator

1. Go to: https://validator.schema.org/
2. Enter: `https://www.therma.one/`
3. Expected: ✅ All schemas valid, no errors

### Manual Validation

```bash
# Extract and validate JSON-LD
curl -s https://www.therma.one/ | grep -o 'application/ld+json.*</script>' | sed 's/.*>\(.*\)<\/script>/\1/' | python3 -m json.tool

# Check FAQ schema
curl -s https://www.therma.one/faq | grep -A 50 'application/ld+json' | head -60
```

---

## 5. Files Changed

### Domain Redirects
1. ✅ `next.config.js` - Added gettherma.ai → therma.one redirects

### Structured Data
2. ✅ `app/layout.tsx` - Enhanced Organization schema, prepared SoftwareApplication schema
3. ✅ `app/faq/page.tsx` - Updated FAQPage schema to use dynamic FAQ array

### Documentation
4. ✅ `CANONICAL_DOMAIN_AND_STRUCTURED_DATA.md` - Complete documentation
5. ✅ `IMPLEMENTATION_SUMMARY.md` - This file

---

## 6. Quick Test Checklist

```bash
# 1. Test redirects
curl -I https://gettherma.ai/
curl -I https://gettherma.ai/faq?test=1

# 2. Verify canonical URLs
curl -s https://www.therma.one/ | grep canonical

# 3. Check sitemap
curl -s https://www.therma.one/sitemap.xml | grep therma.one

# 4. Validate structured data
# Use Google Rich Results Test: https://search.google.com/test/rich-results
```

---

**Status**: ✅ Complete
**Canonical Domain**: therma.one
**Structured Data**: Organization, FAQPage, SoftwareApplication
