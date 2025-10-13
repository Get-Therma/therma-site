'use client';

import { useState, useEffect } from 'react';
import { getABTestVariant, trackABTestEvent, recordABTestResult, HEADLINE_AB_TEST, SUBHEADLINE_AB_TEST } from '../lib/ab-testing';

interface ABTestTextProps {
  testType: 'headline' | 'subheadline';
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  onVariantChange?: (variantId: string) => void;
}

export default function ABTestText({ 
  testType, 
  className, 
  tag = 'h1',
  onVariantChange 
}: ABTestTextProps) {
  const [variant, setVariant] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the appropriate A/B test
    const test = testType === 'headline' ? HEADLINE_AB_TEST : SUBHEADLINE_AB_TEST;
    const selectedVariant = getABTestVariant(test.id, test.variants);
    setVariant(selectedVariant.text);
    setIsLoading(false);

    // Track the impression
    trackABTestEvent(test.id, selectedVariant.id, 'impression');
    
    // Notify parent component
    if (onVariantChange) {
      onVariantChange(selectedVariant.id);
    }
  }, [testType, onVariantChange]);

  const handleClick = () => {
    // Track clicks on the text
    const test = testType === 'headline' ? HEADLINE_AB_TEST : SUBHEADLINE_AB_TEST;
    const selectedVariant = getABTestVariant(test.id, test.variants);
    trackABTestEvent(test.id, selectedVariant.id, 'click');
    recordABTestResult(test.id, selectedVariant.id, 'clicks');
  };

  // Default fallback text
  const fallbackText = testType === 'headline' 
    ? 'Discover Your Patterns. Optimize Your Routine.'
    : 'Therma is a private, AI‑guided journaling app that turns your check‑ins, habits, and notes into pattern maps—highlighting bright spots to keep and frictions to tweak—so small changes add up to steadier weeks.';

  if (isLoading) {
    const Tag = tag as keyof JSX.IntrinsicElements;
    return (
      <Tag className={className}>
        {fallbackText}
      </Tag>
    );
  }

  const Tag = tag as keyof JSX.IntrinsicElements;
  return (
    <Tag className={className} onClick={handleClick}>
      {variant}
    </Tag>
  );
}

// Convenience components
export function ABTestHeadline(props: Omit<ABTestTextProps, 'testType'>) {
  return <ABTestText {...props} testType="headline" tag="h1" />;
}

export function ABTestSubheadline(props: Omit<ABTestTextProps, 'testType'>) {
  return <ABTestText {...props} testType="subheadline" tag="h2" />;
}
