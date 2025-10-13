// Simple A/B Testing Utility for Headlines
export interface HeadlineVariant {
  id: string;
  text: string;
  weight?: number; // Optional weight for weighted distribution
}

export interface ABTest {
  id: string;
  name: string;
  variants: HeadlineVariant[];
  isActive: boolean;
}

// Predefined headline variants for testing
export const HEADLINE_VARIANTS: HeadlineVariant[] = [
  {
    id: 'original',
    text: 'See your patterns. Keep what works. Steady your days.',
    weight: 1
  },
  {
    id: 'pattern-focused',
    text: 'Turn your days into patterns you can use.',
    weight: 1
  },
  {
    id: 'benefit-focused',
    text: 'Turn daily check-ins into weekly insights for steadier days.',
    weight: 1
  },
  {
    id: 'action-oriented',
    text: 'Discover patterns. Reinforce wins. Steady your weeks.',
    weight: 1
  },
  {
    id: 'emotional',
    text: 'Your private space to reflect, understand, and grow.',
    weight: 1
  },
  {
    id: 'data-driven',
    text: 'AI-guided journaling that reveals patterns in your habits and mood.',
    weight: 1
  }
];

// Subheadline variants for testing
export const SUBHEADLINE_VARIANTS: HeadlineVariant[] = [
  {
    id: 'original',
    text: 'Therma is a private, AI‑guided journaling app that turns your check‑ins, habits, and notes into pattern maps—highlighting bright spots to keep and frictions to tweak—so small changes add up to steadier weeks.',
    weight: 1
  },
  {
    id: 'action-focused',
    text: 'Spot the bright spots, fix the frictions, and feel steadier week by week.',
    weight: 1
  },
  {
    id: 'benefit-focused',
    text: 'Your private journal—with a gentle, research‑informed guide.',
    weight: 1
  },
  {
    id: 'process-focused',
    text: 'Check in daily, journal mindfully, see patterns weekly.',
    weight: 1
  }
];

// Simple A/B test configuration
export const HEADLINE_AB_TEST: ABTest = {
  id: 'main-headline',
  name: 'Main Headline A/B Test',
  variants: HEADLINE_VARIANTS,
  isActive: true
};

export const SUBHEADLINE_AB_TEST: ABTest = {
  id: 'subheadline',
  name: 'Subheadline A/B Test',
  variants: SUBHEADLINE_VARIANTS,
  isActive: true
};

/**
 * Get a random variant for A/B testing
 * Uses localStorage to maintain consistency across page loads
 */
export function getABTestVariant(testId: string, variants: HeadlineVariant[]): HeadlineVariant {
  if (typeof window === 'undefined') {
    // Server-side: return first variant
    return variants[0];
  }

  const storageKey = `ab-test-${testId}`;
  const storedVariant = localStorage.getItem(storageKey);
  
  if (storedVariant) {
    // Return previously assigned variant
    const variant = variants.find(v => v.id === storedVariant);
    if (variant) return variant;
  }

  // Assign new variant based on weights
  const totalWeight = variants.reduce((sum, variant) => sum + (variant.weight || 1), 0);
  let random = Math.random() * totalWeight;
  
  for (const variant of variants) {
    random -= (variant.weight || 1);
    if (random <= 0) {
      // Store the assignment
      localStorage.setItem(storageKey, variant.id);
      return variant;
    }
  }

  // Fallback to first variant
  return variants[0];
}

/**
 * Track A/B test events for analytics
 */
export function trackABTestEvent(testId: string, variantId: string, event: string, data?: any) {
  if (typeof window === 'undefined') return;

  // Send to analytics (you can integrate with Google Analytics, Mixpanel, etc.)
  console.log('AB Test Event:', {
    testId,
    variantId,
    event,
    data,
    timestamp: new Date().toISOString()
  });

  // Example: Send to Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'ab_test', {
      test_id: testId,
      variant_id: variantId,
      event_name: event,
      ...data
    });
  }
}

/**
 * Get test results from localStorage (for simple analytics)
 */
export function getABTestResults(testId: string) {
  if (typeof window === 'undefined') return null;

  const results = localStorage.getItem(`ab-test-results-${testId}`);
  return results ? JSON.parse(results) : null;
}

/**
 * Record test results
 */
export function recordABTestResult(testId: string, variantId: string, action: string) {
  if (typeof window === 'undefined') return;

  const resultsKey = `ab-test-results-${testId}`;
  const existingResults = getABTestResults(testId) || {};
  
  if (!existingResults[variantId]) {
    existingResults[variantId] = {};
  }
  
  if (!existingResults[variantId][action]) {
    existingResults[variantId][action] = 0;
  }
  
  existingResults[variantId][action]++;
  localStorage.setItem(resultsKey, JSON.stringify(existingResults));
}
