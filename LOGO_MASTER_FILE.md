# Logo Master File - Source of Truth

## Overview

The Therma logo master file is located at:
- **Master Source**: `/public/therma-logo-master.png` (1024x1024px)
- **Mark Only**: `/public/therma-logo-mark-only.png` (1024x1024px, transparent)

These files are the **single source of truth** for all Therma logo assets used throughout the codebase.

## Master File Location

The master logo files are copied from:
```
/Users/omar/Downloads/T Logo Master File/
├── Source/Therma_V1_Icon_1024.png → public/therma-logo-master.png
└── Extras/Therma_V1_MarkOnly_T_Transparent_1024.png → public/therma-logo-mark-only.png
```

## Generating Logo Sizes

All logo sizes are generated from the master file using the script:

```bash
npm run generate:logos
```

This script generates:
- **PNG logos**: 16, 24, 32, 180, 192, 512px sizes
- **SVG logos**: 16, 24, 32px sizes (embedded PNG for compatibility)

### Required Dependencies

The script requires `sharp` for image processing:

```bash
npm install --save-dev sharp
```

## Generated Logo Files

The following files are automatically generated from the master:

### Favicons
- `therma-logo-16.svg` / `therma-logo-16.png`
- `therma-logo-24.svg` / `therma-logo-24.png`
- `therma-logo-32.svg` / `therma-logo-32.png`
- `therma-logo.svg` (default, 32x32)

### App Icons
- `apple-touch-icon.png` (180x180)
- `android-chrome-192x192.png` (192x192)
- `android-chrome-512x512.png` (512x512)
- `therma-logo-192x192.png` (192x192)
- `therma-logo.png` (512x512)

## Usage in Codebase

### Email Templates
Logo URL in email templates (`lib/email-templates.tsx`):
```typescript
logoUrl: 'https://gettherma.ai/therma-logo.svg'
```

### Layout & Metadata
Logo references in `app/layout.tsx`:
- Favicon icons (16, 24, 32px)
- Mask icon for Safari

### Components
Logo used in:
- `components/ThermaAssistant.tsx` - Chat launcher and header
- Other components as needed

## Updating the Logo

**Important**: When updating the logo:

1. **Replace the master file**: Update `/public/therma-logo-master.png` with the new master logo
2. **Regenerate all sizes**: Run `npm run generate:logos`
3. **Commit both**: Commit both the master file and all generated sizes

**Never edit the generated files directly** - they will be overwritten when regenerating from the master.

## Master File Specifications

- **Format**: PNG
- **Size**: 1024x1024px
- **Color Space**: RGB
- **Background**: Opaque (for main logo) or Transparent (for mark-only)
- **Source**: `/Users/omar/Downloads/T Logo Master File/`

## Notes

- The master file directory contains additional assets (iOS icons, social media templates, etc.) that can be used for other purposes
- The mark-only version (`therma-logo-mark-only.png`) is useful for overlays and transparent backgrounds
- SVG versions are created by embedding the PNG as base64 for compatibility; true vector SVGs would require manual conversion
