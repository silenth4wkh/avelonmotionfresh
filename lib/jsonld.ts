/**
 * JSON-LD structured data builders for schema.org
 * Used by app/[lang]/layout.tsx for SEO & GEO signals
 */

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://avelonmotion.com';

/* ─── Organization ──────────────────────────────────────────────────────── */
export function buildOrganizationSchema(lang: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE}/#organization`,
    name: 'Avelon Motion',
    url: `${BASE}/${lang}`,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE}/logo.png`,
      width: 400,
      height: 400,
    },
    description:
      lang === 'hu'
        ? 'Az Avelon Motion egy budapesti AI videógyártó stúdió, amely filmes brand videókat, motion designt és AI-generált vizuális rendszereket alkot modern márkák számára.'
        : 'Avelon Motion is a Budapest-based AI video production studio creating cinematic brand films, motion design, and AI-generated visual systems for modern brands worldwide.',
    foundingDate: '2024',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Budapest',
      addressCountry: 'HU',
    },
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@avelonmotion.com',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hungarian'],
    },
    sameAs: [
      'https://instagram.com/avelonmotion',
      'https://youtube.com/avelonmotion',
      'https://www.linkedin.com/company/avelonmotion',
      'https://twitter.com/avelonmotion',
      'https://vimeo.com/avelonmotion',
    ],
  };
}

/* ─── Professional Service (VideoGame → ProfessionalService) ────────────── */
export function buildServiceSchema(lang: string) {
  const isHu = lang === 'hu';
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${BASE}/#service`,
    name: 'Avelon Motion',
    provider: { '@id': `${BASE}/#organization` },
    serviceType: isHu ? 'AI Videógyártás' : 'AI Video Production',
    description: isHu
      ? 'Filmes AI brand videók, motion design és AI-generált vizuális rendszerek'
      : 'Cinematic AI brand films, motion design, and AI-generated visual systems',
    url: `${BASE}/${lang}`,
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: isHu ? 'Szolgáltatások' : 'Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: isHu ? 'Filmes AI Alkotások' : 'Cinematic AI Films',
            description: isHu
              ? 'Brand ötleteket alakítunk nagy hatású videótartalmakká'
              : 'We turn brand ideas into high-impact video content',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: isHu ? 'Dinamikus Vizuális Rendszerek' : 'Dynamic Visual Systems',
            description: isHu
              ? 'AI-alapú design eszközök skálázható vizuális tartalmakhoz'
              : 'AI-powered design tools generating scalable visual assets',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: isHu ? 'AI-Generált Brand Personák' : 'AI-Generated Brand Personas',
            description: isHu
              ? 'Egyedi digitális személyiségek a brand életre keltéséhez'
              : 'Custom digital personalities that bring your brand to life',
          },
        },
      ],
    },
  };
}

/* ─── FAQPage ────────────────────────────────────────────────────────────── */
interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}

/* ─── WebSite (sitelinks searchbox potential) ───────────────────────────── */
export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE}/#website`,
    url: BASE,
    name: 'Avelon Motion',
    publisher: { '@id': `${BASE}/#organization` },
    inLanguage: ['en', 'hu'],
  };
}
