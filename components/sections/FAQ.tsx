'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { FaqProps } from '@/types/sections';

const FAQ_INDICES = [0, 1, 2, 3, 4, 5, 6, 7] as const;
type FaqIndex = typeof FAQ_INDICES[number];

export default function FAQ({ visibleSections }: FaqProps) {
  const t = useTranslations('faq');
  const isVisible = visibleSections.has('faq');
  const [openIndex, setOpenIndex] = useState<FaqIndex | null>(null);

  const toggle = (i: FaqIndex) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section
      id="faq"
      data-section
      className={`relative py-20 bg-primary-900 transition-all duration-1000 w-full max-w-none ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Film grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-0"
        style={{
          backgroundImage: 'url(/noise.svg)',
          backgroundRepeat: 'repeat',
          backgroundSize: '300px 300px',
        }}
        aria-hidden="true"
      />

      {/* Rama-style 2x1 grid: left = brutal title, right = accordion */}
      <div className="relative w-full grid grid-cols-1 lg:grid-cols-2 min-h-[min(80vh,800px)] z-10">
        {/* Left: FREQUENTLY ASKED QUESTIONS — brutal large type */}
        <div
          className={`flex items-center justify-center lg:justify-start px-6 md:px-10 lg:px-16 xl:px-24 py-16 lg:py-24 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2
            className="font-black text-white uppercase leading-[0.9] tracking-tighter select-none"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 7rem)',
              lineHeight: '0.95',
            }}
          >
            {t('headline').toUpperCase()}
          </h2>
        </div>

        {/* Right: accordion questions */}
        <div className="flex flex-col justify-center px-6 md:px-10 lg:px-16 xl:px-24 py-12 lg:py-24">
          <div className="space-y-0">
            {FAQ_INDICES.map((i) => (
              <div
                key={i}
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${400 + i * 60}ms` }}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full text-left py-6 md:py-8 border-b border-white/10 group transition-all duration-300 hover:bg-secondary-500/15"
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-medium text-white group-hover:text-secondary-400 transition-colors duration-300 pr-4">
                      {t(`q${i + 1}.question`)}
                    </h3>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className={`flex-shrink-0 text-secondary-400 transition-transform duration-300 ${
                        openIndex === i ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div
                    id={`faq-answer-${i}`}
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openIndex === i ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
                    }`}
                    role="region"
                  >
                    <p className="text-white/70 text-base md:text-lg leading-relaxed">
                      {t(`q${i + 1}.answer`)}
                    </p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
