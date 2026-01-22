import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

/**
 * Platform-specific OG Image Generator
 * 
 * Generates optimized images for different social platforms:
 * - Default (1200x630): Twitter, Facebook, LinkedIn, Discord, Slack
 * - Square (1200x1200): Instagram, Threads
 * - Vertical (1000x1500): Pinterest
 */

type Platform = 'default' | 'square' | 'pinterest';

const DIMENSIONS: Record<Platform, { width: number; height: number }> = {
  default: { width: 1200, height: 630 },
  square: { width: 1200, height: 1200 },
  pinterest: { width: 1000, height: 1500 },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const title = searchParams.get('title') || 'Therma Weekly';
  const subtitle = searchParams.get('subtitle') || 'A quieter way to check in.';
  const platform = (searchParams.get('platform') || 'default') as Platform;
  const issueNumber = searchParams.get('issue');
  
  const { width, height } = DIMENSIONS[platform] || DIMENSIONS.default;
  const isVertical = platform === 'pinterest';
  const isSquare = platform === 'square';

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
          background: 'linear-gradient(135deg, #F8F4ED 0%, #E8E4DD 50%, #D8D4CD 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: isVertical ? '80px 60px' : '60px 80px',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: isVertical ? -100 : -50,
            right: isVertical ? -100 : -50,
            width: isVertical ? 400 : 300,
            height: isVertical ? 400 : 300,
            borderRadius: '50%',
            background: 'rgba(143, 188, 143, 0.15)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: isVertical ? -150 : -100,
            left: isVertical ? -150 : -100,
            width: isVertical ? 500 : 400,
            height: isVertical ? 500 : 400,
            borderRadius: '50%',
            background: 'rgba(143, 188, 143, 0.1)',
          }}
        />
        
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: isVertical ? '60px' : '40px',
          }}
        >
          <div
            style={{
              width: isVertical ? 80 : 60,
              height: isVertical ? 80 : 60,
              borderRadius: '50%',
              background: '#8fbc8f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: isVertical ? 40 : 30, color: 'white' }}>🌿</span>
          </div>
          <span
            style={{
              fontSize: isVertical ? 48 : 36,
              fontWeight: 600,
              color: '#2D5016',
              letterSpacing: '-0.02em',
            }}
          >
            Therma
          </span>
        </div>
        
        {/* Issue badge */}
        {issueNumber && (
          <div
            style={{
              display: 'flex',
              padding: '8px 20px',
              background: 'rgba(143, 188, 143, 0.2)',
              borderRadius: '20px',
              marginBottom: isVertical ? '40px' : '24px',
            }}
          >
            <span
              style={{
                fontSize: isVertical ? 20 : 16,
                color: '#2D5016',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Issue #{issueNumber.padStart(2, '0')}
            </span>
          </div>
        )}
        
        {/* Title */}
        <h1
          style={{
            fontSize: isVertical ? 72 : isSquare ? 64 : 56,
            fontWeight: 700,
            color: '#1a1a1a',
            textAlign: 'center',
            margin: 0,
            marginBottom: isVertical ? '32px' : '20px',
            lineHeight: 1.1,
            maxWidth: '90%',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>
        
        {/* Subtitle */}
        <p
          style={{
            fontSize: isVertical ? 32 : isSquare ? 28 : 24,
            color: '#5C5C5C',
            textAlign: 'center',
            margin: 0,
            maxWidth: '80%',
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </p>
        
        {/* Footer for Pinterest */}
        {isVertical && (
          <div
            style={{
              position: 'absolute',
              bottom: '60px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '4px',
                background: '#8fbc8f',
                borderRadius: '2px',
              }}
            />
            <span
              style={{
                fontSize: 20,
                color: '#8fbc8f',
                fontWeight: 500,
              }}
            >
              therma.one/weekly
            </span>
          </div>
        )}
        
        {/* Footer for default/square */}
        {!isVertical && (
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontSize: 18,
                color: '#8fbc8f',
                fontWeight: 500,
              }}
            >
              therma.one
            </span>
          </div>
        )}
      </div>
    ),
    {
      width,
      height,
    }
  );
}
