import createMiddleware from 'next-intl/middleware';
import { LOCALES, DEFAULT_LOCALE } from '@/types/language';

export default createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  // Don't redirect / → /en automatically (app/page.tsx handles it)
  localePrefix: 'always',
});

export const config = {
  // Match all paths except: _next/static, _next/image, api routes, files with extensions
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
