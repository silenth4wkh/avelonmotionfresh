'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
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

      {/* Video 1 - Main showcase with statement overlay */}
      <div className="relative w-full aspect-video max-h-[75vh] bg-black overflow-hidden">
        <video
          src="/media/services-video.mp4"
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
            {t('statement1')}
          </p>
        </div>
        <div className="absolute bottom-4 left-4 text-[10px] md:text-xs text-white/50 tracking-widest uppercase">
          {t('meta1')}
        </div>
        <div className="absolute bottom-4 right-4 text-[10px] md:text-xs text-[#ff7300] tracking-widest">
          {t('tags1')}
        </div>
      </div>

      {/* Video 2 - Fantasy/Scifi */}
      <div className="relative w-full aspect-video max-h-[75vh] bg-black overflow-hidden">
        <video
          src="/media/services-video2.mp4"
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
            {t('statement2')}
          </p>
        </div>
        <div className="absolute bottom-4 left-4 text-[10px] md:text-xs text-white/50 tracking-widest uppercase">
          {t('meta2')}
        </div>
        <div className="absolute bottom-4 right-4 text-[10px] md:text-xs text-[#ff7300] tracking-widest">
          {t('tags2')}
        </div>
      </div>

      {/* Video 3 - Forest / Brand Personas */}
      <div className="relative w-full aspect-video max-h-[75vh] bg-black overflow-hidden">
        <video
          src="/media/services-video3.mp4"
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
            {t('statement3')}
          </p>
        </div>
        <div className="absolute bottom-4 left-4 text-[10px] md:text-xs text-white/50 tracking-widest uppercase">
          {t('meta3')}
        </div>
        <div className="absolute bottom-4 right-4 text-[10px] md:text-xs text-[#ff7300] tracking-widest">
          {t('tags3')}
        </div>
      </div>

      {/* Image + MODULE list row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-0">
        <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px] bg-neutral-900">
          <Image
            src="/media/services-img.png"
            alt="Services showcase"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col justify-center px-8 py-12 lg:py-16 border-t lg:border-t-0 lg:border-l border-white/10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`py-6 border-b border-white/10 last:border-b-0 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${200 + i * 150}ms` }}
            >
              <span className="text-[10px] md:text-xs text-[#ff7300] tracking-[0.2em] uppercase font-semibold">
                {t('moduleLabel')} — B.0{i} / {t(`service${i}.title`).toUpperCase()}
              </span>
              <p className="text-white/90 mt-2 text-sm md:text-base leading-relaxed max-w-xl">
                {t(`service${i}.description`)}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {t(`service${i}.tags`).split(' · ').map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-3 py-1 border border-white/30 text-white/70 uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
