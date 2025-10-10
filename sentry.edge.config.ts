import { init } from '@sentry/nextjs';

init({
  dsn: process.env.SENTRY_DSN,
  
  // Set tracesSampleRate to 1.0 to capture 100% of the transactions for performance monitoring.
  tracesSampleRate: 1.0,
  
  // Set profilesSampleRate to 1.0 to profile 100% of the transactions.
  profilesSampleRate: 1.0,
  
  // Set environment
  environment: process.env.NODE_ENV || 'development',
  
  // Set release version
  release: process.env.VERCEL_GIT_COMMIT_SHA || '1.0.0',
  
  // Filter out certain errors
  beforeSend(event) {
    // Filter out non-critical errors
    if (event.exception) {
      const error = event.exception.values?.[0];
      if (error?.type === 'ChunkLoadError') {
        return null; // Don't send chunk load errors
      }
    }
    return event;
  },
});
