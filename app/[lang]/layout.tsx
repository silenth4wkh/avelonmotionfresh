import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LOCALES, type Language } from '@/types/language';
import CookieConsent from '@/components/CookieConsent';
import {
  buildOrganizationSchema,
  buildServiceSchema,
  buildFaqSchema,
  buildWebSiteSchema,
} from '@/lib/jsonld';

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

  // title: string only → root layout template wraps it: "AI Video Production | Avelon Motion"
  // Avoids the duplicate "Avelon Motion – AI Video Production | Avelon Motion"
  const pageTitle = t('tagline');
  const ogTitle   = `Avelon Motion – ${t('tagline')}`;

  return {
    title: pageTitle,
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
      title: ogTitle,
      description: t('description'),
      images: [
        {
          url: `${baseUrl}/${lang}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: t('description'),
      images: [`${baseUrl}/${lang}/opengraph-image`],
    },
  };
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;

  if (!LOCALES.includes(lang as Language)) {
    notFound();
  }

  const [messages, faqT] = await Promise.all([
    getMessages({ locale: lang }),
    getTranslations({ locale: lang, namespace: 'faq' }),
  ]);

  // Build FAQ items from translations for JSON-LD
  const FAQ_COUNT = 8;
  const faqItems = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    question: faqT(`q${i + 1}.question`),
    answer:   faqT(`q${i + 1}.answer`),
  }));

  const orgSchema     = buildOrganizationSchema(lang);
  const serviceSchema = buildServiceSchema(lang);
  const faqSchema     = buildFaqSchema(faqItems);
  const siteSchema    = buildWebSiteSchema();

  return (
    <>
      {/* ── JSON-LD Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <NextIntlClientProvider locale={lang} messages={messages}>
        {children}
        <CookieConsent />
      </NextIntlClientProvider>
    </>
  );
}
