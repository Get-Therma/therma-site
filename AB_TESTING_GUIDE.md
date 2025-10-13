# A/B Testing Implementation Guide for Therma

## 🎯 Overview

This guide shows you how to implement A/B testing for headlines on your Therma website. We've created several approaches from simple client-side testing to advanced server-side solutions.

## 📁 Files Created

- `lib/ab-testing.ts` - Client-side A/B testing utilities
- `lib/server-ab-testing.ts` - Server-side A/B testing utilities  
- `components/ABTestHeadline.tsx` - React component for A/B tested headlines
- `components/ABTestAdmin.tsx` - Admin interface for managing tests
- `app/admin/page.tsx` - Admin page for test management
- `examples/ab-testing-example.tsx` - Example implementation

## 🚀 Quick Start (Client-Side)

### 1. Replace Static Headline

In your `app/page.tsx`, replace this:
```tsx
<h1>See your patterns. Keep what works. Steady your days.</h1>
```

With this:
```tsx
import ABTestHeadline from '../components/ABTestHeadline';

<ABTestHeadline className="hero-title" />
```

### 2. Track Conversions

Add conversion tracking to your form submission:
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  // ... your existing form logic
  
  if (data.ok) {
    setStatus('success');
    // Track conversion
    trackABTestEvent('main-headline', currentVariant, 'conversion');
  }
};
```

## 🔧 Advanced Setup (Server-Side)

### 1. Server Component Approach

Create a server component that assigns variants:
```tsx
import { getServerABTestVariant, SERVER_HEADLINE_TESTS } from '../lib/server-ab-testing';

export default function ServerABTestPage() {
  const test = SERVER_HEADLINE_TESTS[0];
  const variant = getServerABTestVariant(test.id, test.variants);
  
  return (
    <h1>{variant.text}</h1>
  );
}
```

### 2. Middleware Approach

Use Next.js middleware to assign variants:
```tsx
// middleware.ts
import { NextResponse } from 'next/server';
import { getServerABTestVariant, SERVER_HEADLINE_TESTS } from './lib/server-ab-testing';

export function middleware(request: NextRequest) {
  const test = SERVER_HEADLINE_TESTS[0];
  const variant = getServerABTestVariant(test.id, test.variants);
  
  const response = NextResponse.next();
  response.cookies.set(`ab-test-${test.id}`, variant.id);
  
  return response;
}
```

## 📊 Analytics Integration

### Google Analytics 4

Add to your `lib/ab-testing.ts`:
```tsx
// Track A/B test events
if (typeof gtag !== 'undefined') {
  gtag('event', 'ab_test', {
    test_id: testId,
    variant_id: variantId,
    event_name: event,
    ...data
  });
}
```

### Custom Analytics

Send events to your own analytics service:
```tsx
await fetch('/api/analytics', {
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
```

## 🎛️ Admin Interface

Access the admin panel at `/admin` to:
- View test results
- Activate/deactivate tests
- Clear test data
- Export results

## 📈 Measuring Success

### Key Metrics to Track

1. **Impressions** - How many users see each variant
2. **Clicks** - Engagement with the headline
3. **Conversions** - Email signups per variant
4. **Time on Page** - User engagement
5. **Bounce Rate** - How quickly users leave

### Statistical Significance

Use tools like:
- Google Optimize
- Optimizely
- VWO
- Or calculate manually with chi-square tests

## 🔄 Test Management

### Creating New Tests

1. Add variants to `HEADLINE_VARIANTS` in `lib/ab-testing.ts`
2. Update the test configuration
3. Deploy and monitor results

### Example New Test

```tsx
export const NEW_HEADLINE_TEST: HeadlineVariant[] = [
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
```

## 🛡️ Best Practices

### Test Design
- Test one element at a time
- Run tests for at least 2 weeks
- Ensure statistical significance (95%+ confidence)
- Test during normal traffic periods

### Technical Considerations
- Maintain user consistency across sessions
- Handle edge cases (no JavaScript, server errors)
- Don't test too many variants simultaneously
- Monitor for performance impact

### Legal & Ethical
- Respect user privacy
- Don't mislead users
- Follow data protection regulations
- Be transparent about testing

## 🚨 Troubleshooting

### Common Issues

1. **Variants not showing**: Check if test is active
2. **Inconsistent assignments**: Clear localStorage and refresh
3. **No analytics data**: Verify tracking code is working
4. **Performance issues**: Reduce number of variants

### Debug Mode

Add debug logging:
```tsx
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('AB Test Assignment:', { testId, variantId, variant });
}
```

## 📚 Additional Resources

- [Google Optimize Documentation](https://support.google.com/optimize/)
- [Next.js Middleware](https://nextjs.org/docs/middleware)
- [Statistical Significance Calculator](https://www.surveymonkey.com/mp/ab-testing-significance-calculator/)
- [A/B Testing Best Practices](https://blog.hubspot.com/marketing/ab-testing-best-practices)

## 🎉 Next Steps

1. **Start Simple**: Implement client-side testing first
2. **Measure Baseline**: Track current headline performance
3. **Create Variants**: Test 2-3 headline variations
4. **Analyze Results**: Use statistical significance testing
5. **Scale Up**: Add more sophisticated testing as needed

Remember: A/B testing is an iterative process. Start small, learn, and improve!
