'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import LazyImage from '@/components/LazyImage';
import { MEDIA } from '@/lib/media';
import type { WorkProps } from '@/types/sections';

const NEON_BG = '#ff7300';

const WORK_ITEMS = [
  { id: 1, img: MEDIA.workImages.card1 },
  { id: 2, img: MEDIA.workImages.card2 },
  { id: 3, img: MEDIA.workImages.card3 },
  { id: 4, img: MEDIA.workImages.card4 },
  { id: 5, img: MEDIA.workImages.card5 },
] as const;

export default function Work({ visibleSections }: WorkProps) {
  const t = useTranslations('work');
  const isVisible = visibleSections.has('work');
  const [activeIndex, setActiveIndex] = useState(0);

  const activeItem = WORK_ITEMS[activeIndex]!;

  return (
    <section
      id="work"
      data-section
      className={`relative py-0 bg-[#0a0a0a] transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Meta row */}
      <div
        className={`text-center py-6 px-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <span className="text-[10px] md:text-xs text-white/50 tracking-[0.25em] uppercase">
          IDX / AM — CAT — 3.01 — SELECTED WORK
        </span>
      </div>

      {/* Split: neon panel left + featured image right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
        {/* Neon panel - left */}
        <div
          className="relative flex flex-col justify-center px-8 py-12 lg:py-16 lg:pr-10"
          style={{ backgroundColor: NEON_BG }}
        >
          <span
            className={`text-[10px] md:text-xs text-black/70 tracking-[0.25em] uppercase mb-2 transition-all duration-700 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            STUDY — 04.01 / SELECTED WORK
          </span>
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-black text-black uppercase tracking-tight mb-4 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {t('headline')}
          </h2>
          <div
            className={`w-1 h-12 bg-black mb-4 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
            }`}
          />
          <p
            className={`text-base text-black/85 max-w-md mb-8 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {t('bodyText')}
          </p>

          {/* Category list - clickable pills */}
          <div className="flex flex-col gap-2">
            {WORK_ITEMS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`text-left px-4 py-3 rounded-none border transition-all duration-300 ${
                  activeIndex === idx
                    ? 'bg-black text-[#ff7300] border-black'
                    : 'bg-transparent text-black border-black/30 hover:border-black/60'
                } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${350 + idx * 50}ms` }}
              >
                <span className="text-[10px] tracking-widest uppercase opacity-80">
                  0{idx + 1}
                </span>
                <span className="block font-bold text-sm md:text-base mt-0.5">
                  {t(`project${item.id}.title`)}
                </span>
                <span className="block text-xs opacity-80 mt-0.5">
                  {t(`project${item.id}.category`)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured image - right */}
        <div
          className={`relative min-h-[50vh] lg:min-h-full transition-all duration-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <LazyImage
            src={activeItem.img.src}
            alt={activeItem.img.alt}
            fill
            className="object-cover transition-opacity duration-550"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-1">
            <span className="text-[10px] text-white/60 tracking-widest uppercase">
              AM — 04.0{activeIndex + 1}
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-white">
              {t(`project${activeItem.id}.title`)}
            </h3>
            <p className="text-sm text-white/80 line-clamp-2">
              {t(`project${activeItem.id}.result`)}
            </p>
          </div>
        </div>
      </div>

      {/* Editorial list - full width rows */}
      <div className="border-t border-white/10">
        {WORK_ITEMS.map((item, idx) => (
          <div
            key={item.id}
            className={`grid grid-cols-1 md:grid-cols-3 gap-4 px-6 py-6 border-b border-white/10 last:border-b-0 transition-colors duration-200 cursor-pointer hover:bg-white/5 ${
              activeIndex === idx ? 'bg-white/5' : ''
            }`}
            onClick={() => setActiveIndex(idx)}
            onKeyDown={(e) => e.key === 'Enter' && setActiveIndex(idx)}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center gap-4">
              <span
                className={`text-2xl md:text-3xl font-black ${
                  activeIndex === idx ? 'text-[#ff7300]' : 'text-white/20'
                }`}
              >
                0{idx + 1}
              </span>
              <div>
                <span className="text-[10px] text-[#ff7300] tracking-widest uppercase">
                  {t(`project${item.id}.category`)}
                </span>
                <h4 className="text-white font-bold text-lg">
                  {t(`project${item.id}.title`)}
                </h4>
              </div>
            </div>
            <p className="text-white/70 text-sm md:col-span-2 self-center">
              {t(`project${item.id}.result`)}
            </p>
            <span className="hidden md:inline text-white/30 self-center justify-self-end">→</span>
          </div>
        ))}
      </div>
    </section>
  );
}
