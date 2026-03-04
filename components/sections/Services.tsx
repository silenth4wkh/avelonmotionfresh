'use client';

import { useTranslations } from 'next-intl';
import type { ServicesProps } from '@/types/sections';

const TICKER_TEXT = '◆ SHOWROOM ◆ ';
const TICKER_REPEAT = 20;

export default function Services({ visibleSections }: ServicesProps) {
  const t = useTranslations('services');
  const isVisible = visibleSections.has('services');

  return (
    <section
      id="services"
      data-section
      className={`relative py-0 bg-[#0a0a0a] transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* SHOWROOM Ticker - seamless infinite loop (content x2, animate -50%) */}
      <div
        className="overflow-hidden border-t border-b border-white/10 py-4"
        style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.9s 300ms' }}
      >
        <div className="flex whitespace-nowrap" style={{ animation: 'showroomTicker 25s linear infinite' }}>
          <span className="inline-block text-sm md:text-base font-medium tracking-[0.3em] text-white/60 px-4">
            {Array(TICKER_REPEAT).fill(TICKER_TEXT).join('')}
          </span>
          <span className="inline-block text-sm md:text-base font-medium tracking-[0.3em] text-white/60 px-4">
            {Array(TICKER_REPEAT).fill(TICKER_TEXT).join('')}
          </span>
        </div>
      </div>

      {/* Shows / Modules mapped together */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="border-b border-white/10 last:border-b-0">
          {/* Video */}
          <div className="relative w-full aspect-video max-h-[75vh] bg-black overflow-hidden">
            <video
              src={`/media/services-video${i === 1 ? '' : i}.mp4`}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none"
              style={{ mixBlendMode: 'overlay' as React.CSSProperties['mixBlendMode'] }}
            >
              <p
                className="text-white font-black text-center leading-tight"
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 6.5rem)',
                  textShadow: '0 0 40px rgba(0,0,0,0.5)',
                }}
              >
                {t(`statement${i}`)}
              </p>
            </div>
            <div className="absolute bottom-4 left-4 text-[10px] md:text-xs text-white/50 tracking-widest uppercase">
              {t(`meta${i}`)}
            </div>
            <div className="absolute bottom-4 right-4 text-[10px] md:text-xs text-[#ff7300] tracking-widest">
              {t(`tags${i}`)}
            </div>
          </div>

          {/* Module Text (Vertical Editorial Style) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-6 md:px-12 py-12 md:py-20 max-w-[1600px] mx-auto">
            <div className="md:col-span-4 lg:col-span-4">
              <span className="text-[10px] md:text-xs text-[#ff7300] tracking-[0.2em] uppercase font-semibold">
                {t('moduleLabel')} — B.0{i}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white mt-2 mb-6">
                {t(`service${i}.title`).toUpperCase()}
              </h3>
              <div className="flex flex-wrap gap-2">
                {t(`service${i}.tags`).split(' · ').map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] px-3 py-1 border border-white/20 text-white/50 uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="md:col-span-8 lg:col-span-7 lg:col-start-6 flex items-center">
              <p className="text-white/80 text-lg md:text-xl lg:text-2xl font-light leading-relaxed">
                {t(`service${i}.description`)}
              </p>
            </div>
          </div>
        </div>
      ))}

    </section>
  );
}
