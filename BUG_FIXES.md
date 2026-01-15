# Bug Fixes - Build and Security Issues

## Bug 1: Spread operator with `typeof window` (ALREADY FIXED)

**Status**: ✅ Already fixed in uncommitted changes

**Issue**: The spread operator was applied to `typeof window !== 'undefined' && (...)`, which evaluates to `false` when `window` is undefined. This would throw a `TypeError` at runtime in SSR contexts.

**Original problematic code**:
```typescript
body: JSON.stringify({
  email: email,
  source: 'Website',
  ...(typeof window !== 'undefined' && (() => {
    // Returns object or undefined
  })())
})
```

**Fixed**: The uncommitted changes removed this pattern entirely. The current code uses simple UTM parameter extraction without the spread operator issue:

```typescript
body: JSON.stringify({
  email: email,
  source: 'Website',
  utm_source: new URL(window.location.href).searchParams.get('utm_source') || document.referrer,
  utm_medium: new URL(window.location.href).searchParams.get('utm_medium') || 'website',
  utm_campaign: new URL(window.location.href).searchParams.get('utm_campaign') || 'waitlist'
})
```

---

## Bug 2: Hardcoded Pinterest verification token (FIXED)

**Status**: ✅ Fixed

**Issue**: Pinterest domain verification code was hardcoded in `app/layout.tsx` line 77.

**Before**:
```typescript
<meta name="p:domain_verify" content="2a46ef06897517c2e71581d857c2d3b6" />
```

**After**:
```typescript
{/* Pinterest Domain Verification */}
{process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION && (
  <meta
    name="p:domain_verify"
    content={process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION}
  />
)}
```

**Files changed**:
- `app/layout.tsx` - Moved Pinterest verification to environment variable
- `env.example` - Added `NEXT_PUBLIC_PINTEREST_VERIFICATION`

**Action required**:
Add to `.env.local`:
```bash
NEXT_PUBLIC_PINTEREST_VERIFICATION="2a46ef06897517c2e71581d857c2d3b6"
```

---

## Summary

| Bug | Status | Fix Applied |
|-----|--------|-------------|
| Spread operator with `typeof window` | ✅ Already fixed | Removed in uncommitted changes |
| Hardcoded Pinterest verification | ✅ Fixed | Moved to environment variable |

---

## Deployment Notes

### Environment variables to set in Vercel

```bash
# Pinterest Verification (from hardcoded value)
NEXT_PUBLIC_PINTEREST_VERIFICATION="2a46ef06897517c2e71581d857c2d3b6"

# Google Search Console (if you have it)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="your-code"

# Bing Webmaster Tools (if you have it)
NEXT_PUBLIC_BING_SITE_VERIFICATION="your-code"

# Beacons.ai (if you have it)
NEXT_PUBLIC_BEACONS_ID="your-id"
```

### Verification

After deployment, verify Pinterest verification works:
1. Go to https://www.therma.one/
2. View source
3. Search for `p:domain_verify`
4. Should see: `<meta name="p:domain_verify" content="2a46ef06897517c2e71581d857c2d3b6">`
5. Verify in Pinterest Business account

---

**All bugs verified and fixed.**
