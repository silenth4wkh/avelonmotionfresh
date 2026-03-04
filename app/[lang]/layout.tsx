import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LOCALES, type Language } from '@/types/language';
import CookieConsent from '@/components/CookieConsent';

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!LOCALES.includes(lang as Language)) return {};

  const t = await getTranslations({ locale: lang, namespace: 'brand' });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://avelonmotion.com';

  const hreflang: { hrefLang: string; url: string }[] = [
    ...LOCALES.map((l) => ({ hrefLang: l, url: `${baseUrl}/${l}` })),
    { hrefLang: 'x-default', url: `${baseUrl}/en` },
  ];

  return {
    title: `Avelon Motion – ${t('tagline')}`,
    description: t('description'),
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: Object.fromEntries(hreflang.map(({ hrefLang, url }) => [hrefLang, url])),
    },
    openGraph: {
      type: 'website',
      locale: lang === 'hu' ? 'hu_HU' : 'en_US',
      url: `${baseUrl}/${lang}`,
      siteName: 'Avelon Motion',
      title: `Avelon Motion – ${t('tagline')}`,
      description: t('description'),
    },
    twitter: {
      card: 'summary_large_image',
      title: `Avelon Motion – ${t('tagline')}`,
      description: t('description'),
    },
  };
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;

  if (!LOCALES.includes(lang as Language)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={lang} messages={messages}>
      {children}
      <CookieConsent />
    </NextIntlClientProvider>
  );
}
