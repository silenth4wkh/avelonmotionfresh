'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import type { AboutProps } from '@/types/sections';
import RevealText from '@/components/RevealText';

const NEON_BG = '#ff7300';

export default function About({ visibleSections }: AboutProps) {
  const t = useTranslations('about');
  const isVisible = visibleSections.has('about');

  const features = [1, 2, 3] as const;

  return (
    <section
      id="about"
      data-section
      className={`relative py-0 bg-[#0a0a0a] transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] lg:min-h-[90vh]">
        {/* Neon panel - left */}
        <div
          className="relative flex flex-col justify-center px-8 py-16 lg:py-24 lg:pr-12"
          style={{ backgroundColor: NEON_BG }}
        >
          <span
            className={`text-[10px] md:text-xs text-black/70 tracking-[0.25em] uppercase mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {t('meta')}
          </span>
          <RevealText
            as="h2"
            mode="words"
            delay={80}
            stagger={60}
            duration={750}
            className="font-black text-black uppercase tracking-tight mb-6 leading-none"
            wordClass="text-[clamp(2.5rem,5vw,4.5rem)]"
          >
            {t('headline')}
          </RevealText>
          <div
            className={`w-1 h-16 bg-black mb-6 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
            }`}
          />
          <p
            className={`text-lg font-bold text-black/90 max-w-md mb-8 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            &ldquo;{t('quote')}&rdquo;
          </p>
          <p
            className={`text-base text-black/80 leading-relaxed max-w-xl mb-10 transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {t('description')}
          </p>
          <div className="space-y-4">
            {features.map((i) => (
              <div
                key={i}
                className={`py-4 border-t border-black/20 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${450 + i * 80}ms` }}
              >
                <span className="text-[10px] text-black/60 tracking-widest uppercase">
                  MODULE — A.0{i}
                </span>
                <h3 className="text-lg font-bold text-black mt-1">
                  {t(`feature${i}.title`)}
                </h3>
                <p className="text-sm text-black/75 mt-1 leading-relaxed">
                  {t(`feature${i}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Image panel - right */}
        <div
          className={`relative min-h-[50vh] lg:min-h-full transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}
        >
          <Image
            src="/media/about-bg.png"
            alt="Avelon Motion — creative studio in motion, fashion and tunnel atmosphere"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff7300]/10 to-transparent pointer-events-none" />
          <span className="absolute bottom-6 left-6 text-white/60 text-sm tracking-widest">
            01 / ABOUT
          </span>
        </div>
      </div>
    </section>
  );
}
