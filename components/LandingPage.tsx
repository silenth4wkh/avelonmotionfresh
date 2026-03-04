'use client';

import { useState, useEffect } from 'react';
import SkipLink from '@/components/SkipLink';
import LoadingScreen from '@/components/LoadingScreen';
import Header from '@/components/sections/Header';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import Work from '@/components/sections/Work';
import Process from '@/components/sections/Process';
import FAQ from '@/components/sections/FAQ';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/sections/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface LandingPageProps {
  lang: string;
}

export default function LandingPage({ lang }: LandingPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const visibleSections = useScrollAnimation();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SkipLink />
      {isLoading && <LoadingScreen duration={1800} />}

      <main
        id="main-content"
        className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      >
        <Header lang={lang} />

        <Hero />
        <About visibleSections={visibleSections} />
        <Services visibleSections={visibleSections} />
        <Work visibleSections={visibleSections} />
        <Process visibleSections={visibleSections} />
        <FAQ visibleSections={visibleSections} />
        <CTA visibleSections={visibleSections} />

        <Footer lang={lang} />
      </main>
    </>
  );
}
