import { getRequestConfig } from 'next-intl/server';
import { LOCALES, type Language } from '@/types/language';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = (await requestLocale) ?? undefined;
  const locale: Language =
    requested && LOCALES.includes(requested as Language)
      ? (requested as Language)
      : 'en';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
