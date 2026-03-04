'use client';

import { useTranslations } from 'next-intl';
import type { ProcessProps } from '@/types/sections';

const STEPS = [1, 2, 3, 4] as const;
const MOD_LABELS = ['AM/01', 'AM/02', 'AM/03', 'AM/04'] as const;

export default function Process({ visibleSections }: ProcessProps) {
  const t = useTranslations('process');
  const isVisible = visibleSections.has('process');

  return (
    <section
      id="process"
      data-section
      className={`relative py-0 bg-[#080808] transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Header */}
      <div className="border-t border-white/10 px-6 md:px-12 py-12 md:py-16">
        <span
          className={`block text-[10px] text-white/40 tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {t('meta')}
        </span>
        <h2
          className={`text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' }}
        >
          {t('headline')}
        </h2>
      </div>

      {/* 2×2 Grid — Vertical MOD style */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {STEPS.map((step, idx) => (
          <div
            key={step}
            className={`border-t border-white/10 ${
              idx % 2 === 0 ? 'md:border-r border-white/10' : ''
            } transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${200 + idx * 120}ms` }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] min-h-[280px] md:min-h-[320px]">
              {/* Left — module label + title */}
              <div className="flex flex-col justify-between px-6 md:px-8 py-8 md:py-10">
                <div>
                  <span className="block text-[10px] text-white/40 tracking-[0.25em] uppercase mb-5">
                    MOD — {MOD_LABELS[idx]}
                  </span>
                  <h3
                    className="text-2xl md:text-3xl font-black text-white uppercase leading-tight tracking-tight"
                    style={{ fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' }}
                  >
                    {t(`step${step}.title`)}
                  </h3>
                  {/* Two accent lines — like Vertical green lines */}
                  <div className="flex flex-col gap-1 mt-4">
                    <div className="w-6 h-[2px] bg-[#ff7300]" />
                    <div className="w-4 h-[2px] bg-[#ff7300] opacity-50" />
                  </div>
                </div>
                <span className="text-[11px] text-white/30 tracking-[0.2em] font-mono mt-6">
                  // {String(step).padStart(3, '0')}
                </span>
              </div>

              {/* Center — arrow divider */}
              <div className="hidden lg:flex items-center justify-center px-2 border-l border-white/10">
                <span className="text-white/20 text-lg">→</span>
              </div>

              {/* Right — bold uppercase text with highlight */}
              <div className="flex items-center px-6 md:px-8 py-8 md:py-10 border-t lg:border-t-0 lg:border-l border-white/10">
                <p
                  className="text-sm md:text-base font-bold uppercase leading-relaxed tracking-wide"
                  style={{ lineHeight: '1.6' }}
                >
                  <span className="text-[#ff7300]">{t(`step${step}.highlight`)} </span>
                  <span className="text-white/80">{t(`step${step}.rest`)}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        className={`border-t border-white/10 px-6 md:px-12 py-10 md:py-14 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: '680ms' }}
      >
        <button
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="text-sm font-semibold text-white uppercase tracking-widest border border-white/30 px-6 py-3 hover:bg-white hover:text-black transition-all duration-300"
        >
          {t('ctaLabel')} →
        </button>
      </div>
    </section>
  );
}
