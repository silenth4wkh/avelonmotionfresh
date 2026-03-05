'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import type { AboutProps } from '@/types/sections';

const NEON_BG = '#ff7300';

const FEATURES = [1, 2, 3] as const;
const MOD_LABELS = ['A.01', 'A.02', 'A.03'] as const;

export default function About({ visibleSections }: AboutProps) {
  const t = useTranslations('about');
  const isVisible = visibleSections.has('about');

  return (
    <section
      id="about"
      data-section
      className={`relative py-0 bg-[#0a0a0a] transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] lg:min-h-[90vh]">

        {/* ── LEFT PANEL (same structure as Selected Work) ───────────── */}
        <div
          className="relative flex flex-col justify-between px-8 py-10 lg:py-14 overflow-hidden"
          style={{ backgroundColor: NEON_BG }}
        >
          {/* Scan-line texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.035] z-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg,#000 0px,#000 1px,transparent 1px,transparent 7px)',
            }}
          />

          {/* ── TOP: meta + 2-line headline ── */}
          <div className="relative z-10">
            <span
              className={`text-[10px] md:text-xs text-black/55 tracking-[0.3em] uppercase mb-4 block transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              STUDY — 01.01 / OUR STORY
            </span>

            <h2 className="leading-[0.85] tracking-[-0.02em] overflow-hidden">
              <span
                className={`block text-[clamp(3.5rem,9vw,7.5rem)] font-black text-black uppercase transition-all duration-700 delay-[60ms] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {t('headlineLine1')}
              </span>
              <span
                className={`block text-[clamp(3.5rem,9vw,7.5rem)] font-black text-black uppercase transition-all duration-700 delay-[120ms] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {t('headlineLine2')}
              </span>
            </h2>
          </div>

          {/* ── MIDDLE: left-border statement + body (like Work) ── */}
          <div
            className={`relative z-10 border-l-[3px] border-black/50 pl-5 my-8 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <p className="text-lg md:text-xl font-black text-black uppercase leading-[1.1] tracking-tight mb-3">
              &ldquo;{t('quote')}&rdquo;
            </p>
            <p className="text-[11px] md:text-xs text-black/65 uppercase leading-relaxed tracking-wide">
              {t('description')}
            </p>
          </div>

          {/* ── BOTTOM: module list (Work-style) ── */}
          <div
            className={`relative z-10 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <div className="w-full h-px bg-black/25 mb-5" />

            <div className="flex flex-col gap-0">
              {FEATURES.map((i, idx) => (
                <div
                  key={i}
                  className="group w-full text-left py-3 border-b border-black/15 last:border-b-0"
                  style={{ transitionDelay: `${300 + idx * 40}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-3">
                      <span className="text-[9px] font-mono tracking-widest text-black/35">
                        MODULE — {MOD_LABELS[idx]}
                      </span>
                      <span className="font-black text-sm md:text-base uppercase tracking-tight leading-none text-black/90">
                        {t(`feature${i}.title`)}
                      </span>
                    </div>
                    <span className="text-black/30 text-sm font-black opacity-0 group-hover:opacity-50 transition-opacity duration-200">
                      →
                    </span>
                  </div>
                  <p className="text-[9px] text-black/45 uppercase tracking-wide mt-2 leading-relaxed max-w-sm">
                    {t(`feature${i}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Image panel - right ────────────────────────────────────── */}
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
            sizes="(max-width: 1024px) 100vw, 2560px"
            quality={95}
            priority={false}
            unoptimized={process.env.NEXT_PUBLIC_ABOUT_IMAGE_UNOPTIMIZED === 'true'}
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
