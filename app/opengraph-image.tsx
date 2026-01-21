import { ImageResponse } from 'next/og';
import fs from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const pppangaia = await fs.readFile(
    path.join(process.cwd(), 'public/fonts/PPPangaia-Medium-BF654c530cc86d5.woff')
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to right, #FFE5D9 0%, #F5E6D3 30%, #E8F5E9 70%, #B2DFDB 100%)',
          position: 'relative',
        }}
      >
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            position: 'relative',
          }}
        >
          {/* Therma title */}
          <div
            style={{
              fontFamily: 'PPPangaia',
              fontSize: '180px',
              lineHeight: 1,
              color: '#000000',
              letterSpacing: '-0.02em',
            }}
          >
            Therma
          </div>
          
          {/* Tagline */}
          <div
            style={{
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
              fontSize: '36px',
              lineHeight: 1.2,
              color: '#000000',
              fontWeight: 400,
              letterSpacing: '0.01em',
            }}
          >
            A quieter way to check in.
          </div>
        </div>
        
        {/* Subtle texture overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.02) 100%)',
            opacity: '0.3',
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'PPPangaia',
          data: pppangaia,
          weight: 400,
          style: 'normal',
        },
      ],
    }
  );
}

