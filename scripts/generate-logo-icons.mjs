import React from 'react';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');

async function writePng(filename, width, height, fontData) {
  const h = React.createElement;
  const { ImageResponse } = await import('next/dist/compiled/@vercel/og/index.node.js');

  const res = new ImageResponse(
    h(
      'div',
      {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fbf7f0',
          backgroundImage:
            'radial-gradient(circle at 8% 10%, rgba(255, 120, 40, 0.55) 0%, rgba(255, 120, 40, 0) 60%), radial-gradient(circle at 92% 8%, rgba(120, 210, 230, 0.45) 0%, rgba(120, 210, 230, 0) 60%), radial-gradient(circle at 92% 92%, rgba(180, 225, 130, 0.6) 0%, rgba(180, 225, 130, 0) 65%), radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%)',
        },
      },
      h(
        'div',
        {
          style: {
            fontFamily: 'PPPangaia',
            fontSize: Math.round(Math.min(width, height) * 0.78),
            lineHeight: 1,
            color: '#2D5016',
            transform: `translateY(${Math.round(Math.min(width, height) * 0.02)}px)`,
          },
        },
        'T'
      )
    ),
    {
      width,
      height,
      fonts: [
        {
          name: 'PPPangaia',
          data: fontData,
          weight: 400,
          style: 'normal',
        },
      ],
    }
  );

  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(path.join(publicDir, filename), buf);
  console.log(`wrote public/${filename} (${width}x${height})`);
}

async function main() {
  const fontPath = path.join(publicDir, 'fonts/PPPangaia-Medium-BF654c530cc86d5.woff');
  const fontData = await fs.readFile(fontPath);

  // Core PWA / browser icons
  await writePng('android-chrome-192x192.png', 192, 192, fontData);
  await writePng('android-chrome-512x512.png', 512, 512, fontData);

  // Apple touch icon (iOS home screen)
  await writePng('apple-touch-icon.png', 180, 180, fontData);

  // Existing references in metadata/manifest
  await writePng('therma-logo-192x192.png', 192, 192, fontData);
  await writePng('therma-logo.png', 512, 512, fontData);

  // Optional: keep legacy og-image.png updated (some scrapers cache filenames)
  await writePng('og-image.png', 1200, 630, fontData);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

