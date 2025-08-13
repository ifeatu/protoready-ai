import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Set tracesSampleRate to 1.0 to capture 100% of the transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Capture 100% of the sessions in development, 10% in production
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Capture 100% of the sessions with an error
  replaysOnErrorSampleRate: 1.0,
  
  // Session replay for debugging
  integrations: [
    new Sentry.Replay({
      // Mask all text content, but not inputs
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Environment configuration
  environment: process.env.NODE_ENV || 'development',
  
  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
  
  // Filter out transactions we don't want to track
  beforeSend(event) {
    // Don't send events for health checks
    if (event.request?.url?.includes('/healthz')) {
      return null;
    }
    
    // Don't send events for certain user agents (bots, etc.)
    const userAgent = event.request?.headers?.['user-agent'];
    if (userAgent && /bot|crawler|spider|crawling/i.test(userAgent)) {
      return null;
    }
    
    return event;
  },
  
  // Configure which errors to ignore
  ignoreErrors: [
    // Random plugins/extensions
    'top.GLOBALS',
    // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    'http://tt.epicplay.com',
    "Can't find variable: ZiteReader",
    'jigsaw is not defined',
    'ComboSearch is not defined',
    'atomicFindClose',
    // Facebook borked
    'fb_xd_fragment',
    // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to reduce this. (thanks @acdha)
    // See http://stackoverflow.com/questions/4113268/how-to-stop-javascript-injection-from-vodafone-proxy
    'bmi_SafeAddOnload',
    'EBCallBackMessageReceived',
    // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
    'conduitPage',
    // Network/loading errors
    'Network request failed',
    'NetworkError',
    'Load failed',
    // Script loading errors
    'Script error',
    'Non-Error promise rejection captured',
  ],
});