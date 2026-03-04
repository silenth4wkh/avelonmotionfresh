export interface ErrorReport {
  message: string;
  stack?: string;
  componentStack?: string;
  context?: Record<string, unknown>;
  timestamp: string;
  userAgent?: string;
  url?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const createErrorReport = (
  error: Error,
  context?: Record<string, unknown>,
  severity: ErrorReport['severity'] = 'medium'
): ErrorReport => ({
  message: error.message,
  stack: error.stack,
  context,
  timestamp: new Date().toISOString(),
  userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
  url: typeof window !== 'undefined' ? window.location.href : undefined,
  severity,
});

export const reportError = (
  error: Error,
  context?: Record<string, unknown>,
  severity: ErrorReport['severity'] = 'medium'
): void => {
  const report = createErrorReport(error, context, severity);

  if (process.env.NODE_ENV === 'development') {
    console.group('[ErrorReporter]');
    console.error('Error:', error);
    console.info('Report:', report);
    console.groupEnd();
  }

  // Production: send to monitoring service (e.g., Sentry, Datadog)
};

export const withErrorReporting = <T>(
  fn: () => T,
  context?: Record<string, unknown>
): T | null => {
  try {
    return fn();
  } catch (e) {
    if (e instanceof Error) {
      reportError(e, context);
    }
    return null;
  }
};
