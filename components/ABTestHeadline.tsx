'use client';

import { useState, useEffect } from 'react';
import { getABTestVariant, trackABTestEvent, recordABTestResult, HEADLINE_AB_TEST } from '../lib/ab-testing';

interface ABTestHeadlineProps {
  className?: string;
  onVariantChange?: (variantId: string) => void;
}

export default function ABTestHeadline({ className, onVariantChange }: ABTestHeadlineProps) {
  const [variant, setVariant] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the A/B test variant
    const selectedVariant = getABTestVariant(HEADLINE_AB_TEST.id, HEADLINE_AB_TEST.variants);
    setVariant(selectedVariant.text);
    setIsLoading(false);

    // Track the impression
    trackABTestEvent(HEADLINE_AB_TEST.id, selectedVariant.id, 'impression');
    
    // Notify parent component
    if (onVariantChange) {
      onVariantChange(selectedVariant.id);
    }
  }, [onVariantChange]);

  const handleClick = () => {
    // Track clicks on the headline
    const selectedVariant = getABTestVariant(HEADLINE_AB_TEST.id, HEADLINE_AB_TEST.variants);
    trackABTestEvent(HEADLINE_AB_TEST.id, selectedVariant.id, 'click');
    recordABTestResult(HEADLINE_AB_TEST.id, selectedVariant.id, 'clicks');
  };

  if (isLoading) {
    return (
      <h1 className={className}>
        See your patterns. Keep what works. Steady your days.
      </h1>
    );
  }

  return (
    <h1 className={className} onClick={handleClick}>
      {variant}
    </h1>
  );
}

// Alternative: Simple hook-based approach
export function useABTest(testId: string, variants: any[]) {
  const [variant, setVariant] = useState(variants[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const selectedVariant = getABTestVariant(testId, variants);
    setVariant(selectedVariant);
    setIsLoading(false);
    
    trackABTestEvent(testId, selectedVariant.id, 'impression');
  }, [testId, variants]);

  const trackEvent = (event: string, data?: any) => {
    trackABTestEvent(testId, variant.id, event, data);
  };

  return { variant, isLoading, trackEvent };
}
