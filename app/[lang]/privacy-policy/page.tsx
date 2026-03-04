import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Language } from '@/types/language';
import { LOCALES } from '@/types/language';
import { notFound } from 'next/navigation';

interface PrivacyPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!LOCALES.includes(lang as Language)) return {};

  const isHu = lang === 'hu';
  return {
    title: isHu ? 'Adatvédelmi Szabályzat' : 'Privacy Policy',
    description: isHu
      ? 'Az Avelon Motion adatvédelmi szabályzata'
      : 'Avelon Motion Privacy Policy',
  };
}

export default async function PrivacyPolicyPage({ params }: PrivacyPageProps) {
  const { lang } = await params;

  if (!LOCALES.includes(lang as Language)) {
    notFound();
  }

  const t = await getTranslations({ locale: lang, namespace: 'privacy' });
  const isHu = lang === 'hu';

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5]">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors mb-12"
        >
          ← {t('backHome')}
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-white">
          {t('title')}
        </h1>

        <p className="text-neutral-400 mb-8">
          {t('lastUpdated')}: 2025. január 1.
        </p>

        <div className="space-y-8 text-neutral-300">
          {isHu ? (
            <>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  1. Adatkezelő adatai
                </h2>
                <div className="space-y-2">
                  <p><strong className="text-white">Cégnév:</strong> Avelon Motion</p>
                  <p><strong className="text-white">Email:</strong>{' '}
                    <a href="mailto:info@avelonmotion.com" className="text-orange-400 hover:text-orange-300">
                      info@avelonmotion.com
                    </a>
                  </p>
                </div>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  2. Kezelt adatok köre
                </h2>
                <p>Kapcsolatfelvételi adatok (név, email, üzenet), technikai adatok.</p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  1. Data Controller
                </h2>
                <div className="space-y-2">
                  <p><strong className="text-white">Company:</strong> Avelon Motion</p>
                  <p><strong className="text-white">Email:</strong>{' '}
                    <a href="mailto:info@avelonmotion.com" className="text-orange-400 hover:text-orange-300">
                      info@avelonmotion.com
                    </a>
                  </p>
                </div>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  2. Data We Collect
                </h2>
                <p>Contact information (name, email, message), technical data.</p>
              </section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
