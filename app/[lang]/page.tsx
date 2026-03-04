import { notFound } from 'next/navigation';
import { LOCALES, type Language } from '@/types/language';
import LandingPage from '@/components/LandingPage';

interface LandingPageRouteProps {
  params: Promise<{ lang: string }>;
}

export default async function LandingPageRoute({ params }: LandingPageRouteProps) {
  const { lang } = await params;

  if (!LOCALES.includes(lang as Language)) {
    notFound();
  }

  return <LandingPage lang={lang} />;
}
