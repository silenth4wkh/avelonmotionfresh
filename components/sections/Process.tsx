'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { MEDIA } from '@/lib/media';
import type { ProcessProps } from '@/types/sections';

const STEP_BACKGROUNDS = [
  MEDIA.process.concept.src,
  MEDIA.process.aiGeneration.src,
  MEDIA.process.production.src,
  MEDIA.process.delivery.src,
] as const;

const STEPS = [0, 1, 2, 3] as const;
type StepIndex = typeof STEPS[number];

export default function Process({ visibleSections }: ProcessProps) {
  const t = useTranslations('process');
  const isVisible = visibleSections.has('process');
  const [hoverBg, setHoverBg] = useState<string | null>(null);

  const handleMouseEnter = useCallback((index: StepIndex) => {
    setHoverBg(STEP_BACKGROUNDS[index]);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoverBg(null);
  }, []);

  return (
    <section
      id="process"
      data-section
      className={`relative py-20 bg-primary-800 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Film grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-[1]"
        style={{ backgroundImage: 'url(/noise.svg)', backgroundRepeat: 'repeat', backgroundSize: '300px 300px' }}
        aria-hidden="true"
      />

      {/* Background */}
      <div
        className="absolute inset-0 transition-opacity duration-500 bg-cover bg-center brightness-[0.4] pointer-events-none z-0"
        style={{
          backgroundImage: hoverBg ? `url('${hoverBg}')` : undefined,
          opacity: hoverBg ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="relative mb-16 px-6 z-10">
        <div
          className={`text-sm text-white/70 mb-8 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          ({t('label')})
        </div>
        <h2
          className={`text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-white max-w-4xl transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {t('headline')}
        </h2>
        <p
          className={`text-white/60 text-lg mt-4 max-w-3xl transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {t('subheadline')}
        </p>
      </div>

      <div
        className={`w-full h-px bg-white/20 mb-16 relative z-10 transition-all duration-700 delay-600 ${
          isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
        }`}
        aria-hidden="true"
      />

      {/* Steps */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 z-10">
        {STEPS.map((i) => (
          <div
            key={i}
            className={`relative p-8 group cursor-pointer transition-all duration-700 z-10 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${600 + i * 150}ms` }}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative z-20">
              <div className="text-6xl font-black text-white/10 group-hover:text-white/20 transition-colors duration-300 mb-4 leading-none select-none">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                {t(`step${i + 1}.title`)}
              </h3>
              <p className="text-white/60 text-base leading-relaxed">
                {t(`step${i + 1}.description`)}
              </p>
            </div>

            {/* Right border separator */}
            {i < STEPS.length - 1 && (
              <div
                className="absolute right-0 top-0 bottom-0 w-px bg-white/20 hidden lg:block"
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="relative z-10 px-6 mt-12">
        <button
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="text-secondary-400 hover:text-secondary-300 font-semibold text-lg transition-colors underline underline-offset-4"
        >
          {t('ctaLabel')} →
        </button>
      </div>
    </section>
  );
}
