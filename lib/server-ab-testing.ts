// Advanced A/B Testing with Server-Side Support
import { cookies } from 'next/headers';

export interface ServerABTestVariant {
  id: string;
  text: string;
  weight: number;
}

export interface ServerABTest {
  id: string;
  name: string;
  variants: ServerABTestVariant[];
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
}

// Server-side A/B test configuration
export const SERVER_HEADLINE_TESTS: ServerABTest[] = [
  {
    id: 'main-headline-v2',
    name: 'Main Headline Test v2',
    isActive: true,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-03-01'),
    variants: [
      {
        id: 'original',
        text: 'See your patterns. Keep what works. Steady your days.',
        weight: 50
      },
      {
        id: 'benefit-focused',
        text: 'Turn daily check-ins into weekly insights for steadier days.',
        weight: 30
      },
      {
        id: 'action-oriented',
        text: 'Discover patterns. Reinforce wins. Steady your weeks.',
        weight: 20
      }
    ]
  }
];

/**
 * Get A/B test variant on the server side
 * Uses cookies to maintain consistency
 */
export function getServerABTestVariant(testId: string, variants: ServerABTestVariant[]): ServerABTestVariant {
  const cookieStore = cookies();
  const cookieName = `ab-test-${testId}`;
  const existingVariant = cookieStore.get(cookieName)?.value;

  if (existingVariant) {
    const variant = variants.find(v => v.id === existingVariant);
    if (variant) return variant;
  }

  // Assign new variant based on weights
  const totalWeight = variants.reduce((sum, variant) => sum + variant.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const variant of variants) {
    random -= variant.weight;
    if (random <= 0) {
      return variant;
    }
  }

  return variants[0];
}

/**
 * Set A/B test variant cookie (for server components)
 */
export function setABTestVariantCookie(testId: string, variantId: string) {
  const cookieStore = cookies();
  cookieStore.set(`ab-test-${testId}`, variantId, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: false, // Allow client-side access
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
}

/**
 * Get active A/B tests
 */
export function getActiveABTests(): ServerABTest[] {
  const now = new Date();
  return SERVER_HEADLINE_TESTS.filter(test => 
    test.isActive && 
    (!test.startDate || test.startDate <= now) &&
    (!test.endDate || test.endDate >= now)
  );
}

/**
 * Analytics tracking for server-side A/B tests
 */
export async function trackServerABTestEvent(
  testId: string, 
  variantId: string, 
  event: string, 
  data?: any
) {
  // You can integrate with analytics services here
  // For example, send to Google Analytics, Mixpanel, etc.
  
  console.log('Server AB Test Event:', {
    testId,
    variantId,
    event,
    data,
    timestamp: new Date().toISOString(),
    userAgent: 'server-side'
  });

  // Example: Send to external analytics service
  try {
    await fetch('https://your-analytics-endpoint.com/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        testId,
        variantId,
        event,
        data,
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('Failed to send analytics event:', error);
  }
}
