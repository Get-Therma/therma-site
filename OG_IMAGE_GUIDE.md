# How to Update the Website Thumbnail/Preview Image

The thumbnail that appears when you open Therma's website in a new tab or share it on social media is controlled by the **Open Graph (OG) image**.

## Current Setup

- **OG Image**: `/public/og-image.png` (1200x630px recommended)
- **Favicon**: `/public/favicon.svg` (32x32px, appears in browser tab)
- **Configuration**: Already set in `app/layout.tsx`

## How to Update

### Option 1: Replace the Image File (Easiest)

1. Create or design your new OG image:
   - **Size**: 1200x630 pixels (recommended)
   - **Format**: PNG or JPG
   - **Content**: Should represent Therma's brand

2. Replace the file:
   ```bash
   # Replace /public/og-image.png with your new image
   # Make sure it's named exactly "og-image.png"
   ```

3. Clear cache and test:
   - Clear your browser cache
   - Test with: https://www.opengraph.xyz/url/https://therma.one
   - Or use: https://cards-dev.twitter.com/validator

### Option 2: Use the HTML Generator

You have an `og-image-generator.html` file that creates the OG image. To use it:

1. Open `og-image-generator.html` in a browser
2. Take a screenshot or use a tool to convert it to PNG
3. Save as `/public/og-image.png` at 1200x630px

### Option 3: Use Next.js Dynamic OG Images (Advanced)

You can generate OG images dynamically using Next.js ImageResponse API.

## Updating the Favicon (Tab Icon)

The favicon appears in the browser tab. To update:

1. Create a new SVG or PNG icon (32x32px minimum)
2. Replace `/public/favicon.svg`
3. For better compatibility, also update:
   - `/public/therma-logo-16.svg`
   - `/public/therma-logo-24.svg`
   - `/public/therma-logo-32.svg`

## Testing Your Changes

After updating:

1. **Clear browser cache** (important!)
2. **Test locally**: Open `http://localhost:3000` in a new tab
3. **Test on production**: After deploying, test at:
   - https://www.opengraph.xyz/url/https://therma.one
   - https://cards-dev.twitter.com/validator
   - https://developers.facebook.com/tools/debug/

## Current Metadata Configuration

The metadata is already configured in `app/layout.tsx`:

```typescript
openGraph: {
  images: [{ url: '/og-image.png', width: 1200, height: 630 }]
},
twitter: {
  images: ['/og-image.png']
}
```

Just replace the image file and it will update automatically!

