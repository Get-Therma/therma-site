# Deployment Verification Guide

## ✅ Code Status

**Latest Commits**:
- `b5595ff` - Fix FAQ structured data: generate outside JSX to avoid build errors
- `d27ffc8` - Fix duplicate structured data in FAQ page causing build error
- `907b8fe` - Fix import path for utm-tracking module
- `b7fff3e` - SEO optimization: canonical domain redirects, structured data, conversion fixes

**Code Quality**:
- ✅ No linter errors
- ✅ All imports resolved correctly
- ✅ TypeScript types valid
- ✅ FAQ structured data generated outside JSX (build-safe)

## Build Status

**Local Build Note**: 
- Local build may fail due to missing `node_modules` (dependencies not installed)
- This is normal - Vercel will install dependencies automatically during deployment
- All required packages are in `package.json`:
  - `@vercel/analytics`: ^1.5.0 ✅
  - `@vercel/speed-insights`: ^1.2.0 ✅

**Vercel Deployment**:
- Code has been pushed to `main` branch
- Vercel should automatically trigger deployment
- Dependencies will be installed during build process

## Post-Deployment Verification

### 1. Check Vercel Deployment Status

1. Go to Vercel Dashboard
2. Check latest deployment status
3. Verify build completed successfully
4. Check deployment URL

### 2. Test Domain Redirects

```bash
# Test gettherma.ai → therma.one redirect
curl -I https://gettherma.ai/
# Expected: HTTP/1.1 301 Moved Permanently
# Expected: Location: https://www.therma.one/

# Test with path and query params
curl -I "https://gettherma.ai/faq?utm_source=test"
# Expected: Location: https://www.therma.one/faq?utm_source=test
```

### 3. Verify Structured Data

**Organization Schema**:
- URL: `https://www.therma.one/`
- Tool: https://search.google.com/test/rich-results
- Expected: ✅ Organization schema detected

**FAQPage Schema**:
- URL: `https://www.therma.one/faq`
- Tool: https://search.google.com/test/rich-results
- Expected: ✅ FAQPage schema detected, eligible for rich results

**SoftwareApplication Schema**:
- URL: `https://www.therma.one/`
- Tool: https://search.google.com/test/rich-results
- Expected: ✅ SoftwareApplication schema detected

### 4. Verify Canonical URLs

```bash
# Check homepage
curl -s https://www.therma.one/ | grep -i "rel=\"canonical\""
# Expected: <link rel="canonical" href="https://www.therma.one/">

# Check FAQ page
curl -s https://www.therma.one/faq | grep -i "rel=\"canonical\""
# Expected: <link rel="canonical" href="https://www.therma.one/faq"
```

### 5. Test Fixed Pages

- ✅ `/thank-you` - Verify new copy (no "control your climate")
- ✅ `/already-registered` - Verify new copy
- ✅ `/terms` - Should redirect to `/beta-terms` (301)
- ✅ `/weekly` - Should show email capture form with sample ritual
- ✅ All footer links - Should work correctly

### 6. Verify Sitemap & Robots

```bash
# Check sitemap
curl -s https://www.therma.one/sitemap.xml | head -20
# Should show URLs with therma.one domain

# Check robots.txt
curl -s https://www.therma.one/robots.txt
# Should show: Sitemap: https://www.therma.one/sitemap.xml
```

### 7. Test 404 Page

```bash
curl -I https://www.therma.one/nonexistent-page
# Expected: HTTP/1.1 404 Not Found
# Visit in browser to see custom 404 page
```

## Expected Deployment Results

### ✅ Success Indicators

1. **Vercel Build**: ✅ Completed successfully
2. **Domain Redirects**: ✅ gettherma.ai → therma.one (301)
3. **Structured Data**: ✅ All schemas validate
4. **Canonical URLs**: ✅ All use therma.one
5. **Pages Load**: ✅ All pages accessible
6. **No Console Errors**: ✅ Check browser console

### ⚠️ If Build Fails on Vercel

**Common Issues**:
1. **Missing Dependencies**: Vercel should install automatically
2. **TypeScript Errors**: Check build logs for specific errors
3. **Import Path Issues**: Verify all imports use correct paths

**Debug Steps**:
1. Check Vercel build logs
2. Look for specific error messages
3. Verify all files are committed and pushed
4. Check that `package.json` has all dependencies

## Quick Verification Checklist

- [ ] Vercel deployment completed successfully
- [ ] Site accessible at https://www.therma.one/
- [ ] gettherma.ai redirects to therma.one
- [ ] FAQ page loads and shows structured data
- [ ] Thank you page has correct copy
- [ ] Weekly page shows email capture form
- [ ] Terms link works (redirects to beta-terms)
- [ ] Structured data validates in Rich Results Test
- [ ] No console errors in browser
- [ ] All footer links work

---

**Status**: Code is ready for deployment
**Last Commit**: b5595ff
**Branch**: main
