import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://avelonmotion.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${BASE}/en`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          hu: `${BASE}/hu`,
          'x-default': `${BASE}/en`,
        },
      },
    },
    {
      url: `${BASE}/hu`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          en: `${BASE}/en`,
          'x-default': `${BASE}/en`,
        },
      },
    },
    {
      url: `${BASE}/en/privacy-policy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          hu: `${BASE}/hu/privacy-policy`,
          'x-default': `${BASE}/en/privacy-policy`,
        },
      },
    },
    {
      url: `${BASE}/hu/privacy-policy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          en: `${BASE}/en/privacy-policy`,
          'x-default': `${BASE}/en/privacy-policy`,
        },
      },
    },
  ];
}
