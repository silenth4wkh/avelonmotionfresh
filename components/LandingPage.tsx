'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LoadingScreen from '@/components/LoadingScreen';

// ── Above-fold: static imports (LCP-critical, must not be lazy) ──────────────
import Header from '@/components/sections/Header';
import Hero   from '@/components/sections/Hero';

// ── Below-fold: dynamic imports (code-split, loaded on demand) ───────────────
// Each section gets its own JS chunk → smaller initial bundle, faster FCP/LCP
const About      = dynamic(() => import('@/components/sections/About'));
const Services   = dynamic(() => import('@/components/sections/Services'));
const Work       = dynamic(() => import('@/components/sections/Work'));
const VoiceStrip = dynamic(() => import('@/components/sections/VoiceStrip'));
const Process    = dynamic(() => import('@/components/sections/Process'));
const FAQ        = dynamic(() => import('@/components/sections/FAQ'));
const CTA        = dynamic(() => import('@/components/sections/CTA'));
const Footer     = dynamic(() => import('@/components/sections/Footer'));

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
      {isLoading && <LoadingScreen duration={1800} />}

      {/* Header is outside <main> — screen readers treat <main> as the primary
          content landmark; navigation belongs outside it (WCAG 2.1 landmark rules) */}
      <Header lang={lang} />

      <main
        id="main-content"
        className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      >
        <Hero />
        <About visibleSections={visibleSections} />
        <Services visibleSections={visibleSections} />
        <Work visibleSections={visibleSections} />
        <VoiceStrip visibleSections={visibleSections} />
        <Process visibleSections={visibleSections} />
        <FAQ visibleSections={visibleSections} />
        <CTA visibleSections={visibleSections} />

        <Footer lang={lang} />
      </main>
    </>
  );
}
