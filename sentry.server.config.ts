import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Set tracesSampleRate to 1.0 to capture 100% of the transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Environment configuration
  environment: process.env.NODE_ENV || 'development',
  
  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
  
  // Server-specific configuration
  beforeSend(event) {
    // Don't send events for health checks
    if (event.request?.url?.includes('/healthz')) {
      return null;
    }
    
    // Filter out certain database connection errors in development
    if (process.env.NODE_ENV === 'development' && event.exception) {
      const error = event.exception.values?.[0];
      if (error?.value?.includes('ECONNREFUSED') || error?.value?.includes('database')) {
        return null;
      }
    }
    
    return event;
  },
  
  // Server-side integrations
  integrations: [
    // HTTP integration for tracing
    new Sentry.Integrations.Http({ tracing: true }),
  ],
  
  // Configure which errors to ignore
  ignoreErrors: [
    // Database connection errors in development
    'connect ECONNREFUSED',
    'getaddrinfo ENOTFOUND',
    // Common server errors that aren't actionable
    'ENOENT: no such file or directory',
    'Request aborted',
    'socket hang up',
  ],
});