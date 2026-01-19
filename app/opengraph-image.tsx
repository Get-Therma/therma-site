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
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fbf7f0',
          backgroundImage:
            'radial-gradient(circle at 8% 10%, rgba(255, 120, 40, 0.55) 0%, rgba(255, 120, 40, 0) 60%), radial-gradient(circle at 92% 8%, rgba(120, 210, 230, 0.45) 0%, rgba(120, 210, 230, 0) 60%), radial-gradient(circle at 92% 92%, rgba(180, 225, 130, 0.6) 0%, rgba(180, 225, 130, 0) 65%), radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%)',
        }}
      >
        <div
          style={{
            fontFamily: 'PPPangaia',
            fontSize: 520,
            lineHeight: 1,
            color: '#2D5016',
            transform: 'translateY(10px)',
          }}
        >
          T
        </div>
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

