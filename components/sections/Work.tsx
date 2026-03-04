'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import LazyImage from '@/components/LazyImage';
import { MEDIA } from '@/lib/media';
import type { WorkProps } from '@/types/sections';

const NEON_BG = '#ff7300';

/* ─── Per-category image sets (5 each) ─────────────────────────────
   Swap out with real per-category images when ready.               */
const CATEGORY_IMAGES = {
  social: [
    MEDIA.workImages.card1,
    MEDIA.workImages.card2,
    MEDIA.workImages.card3,
    MEDIA.workImages.card4,
    MEDIA.workImages.card5,
  ],
  video: [
    MEDIA.workImages.card2,
    MEDIA.workImages.card3,
    MEDIA.workImages.card6,
    MEDIA.workImages.card1,
    MEDIA.workImages.card4,
  ],
  marketing: [
    MEDIA.workImages.card3,
    MEDIA.workImages.card4,
    MEDIA.workImages.card5,
    MEDIA.workImages.card6,
    MEDIA.workImages.card2,
  ],
  animation: [
    MEDIA.workImages.card4,
    MEDIA.workImages.card5,
    MEDIA.workImages.card6,
    MEDIA.workImages.card1,
    MEDIA.workImages.card3,
  ],
  photography: [
    MEDIA.workImages.card5,
    MEDIA.workImages.card6,
    MEDIA.workImages.card1,
    MEDIA.workImages.card2,
    MEDIA.workImages.card4,
  ],
} as const;

type CategoryKey = keyof typeof CATEGORY_IMAGES;

const CATEGORIES: {
  key: CategoryKey;
  label: string;
  sublabel: string;
  mod: string;
  bracket: string;
  roman: string;
}[] = [
  { key: 'social',      label: 'Social — UGC',        sublabel: 'Creator-style content at scale', mod: 'AM/01', bracket: '[UGC]',   roman: 'I'   },
  { key: 'video',       label: 'AI Video — Films',    sublabel: 'Narrative-driven short films',   mod: 'AM/02', bracket: '[FILM]',  roman: 'II'  },
  { key: 'marketing',   label: 'Marketing',           sublabel: 'Performance & brand campaigns',  mod: 'AM/03', bracket: '[BRAND]', roman: 'III' },
  { key: 'animation',   label: 'AI Animation — 3D',   sublabel: 'Product viz & motion assets',    mod: 'AM/04', bracket: '[3D]',    roman: 'IV'  },
  { key: 'photography', label: 'Photography — Brand', sublabel: 'AI-generated brand imagery',     mod: 'AM/05', bracket: '[PHOTO]', roman: 'V'   },
];

export default function Work({ visibleSections }: WorkProps) {
  const t = useTranslations('work');
  const isVisible = visibleSections.has('work');

  /* ── Category state ── */
  const [activeCategory, setActiveCategory]   = useState<CategoryKey>('social');
  const [displayCategory, setDisplayCategory] = useState<CategoryKey>('social');
  const [catTransitioning, setCatTransitioning] = useState(false);

  /* ── Slide state (within active category) ── */
  const [slideIdx, setSlideIdx]       = useState(0);
  const [displaySlideIdx, setDisplaySlideIdx] = useState(0);
  const [slideRevealed, setSlideRevealed]     = useState(true);
  const [direction, setDirection]             = useState<'next' | 'prev'>('next');

  const catTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Category crossfade */
  useEffect(() => {
    if (activeCategory === displayCategory) return;
    setCatTransitioning(true);
    setSlideRevealed(false);
    catTimer.current = setTimeout(() => {
      setDisplayCategory(activeCategory);
      setDisplaySlideIdx(0);
      setSlideIdx(0);
      setSlideRevealed(true);
      setCatTransitioning(false);
    }, 380);
    return () => { if (catTimer.current) clearTimeout(catTimer.current); };
  }, [activeCategory, displayCategory]);

  /* Slide crossfade */
  useEffect(() => {
    if (slideIdx === displaySlideIdx) return;
    setSlideRevealed(false);
    slideTimer.current = setTimeout(() => {
      setDisplaySlideIdx(slideIdx);
      setSlideRevealed(true);
    }, 300);
    return () => { if (slideTimer.current) clearTimeout(slideTimer.current); };
  }, [slideIdx, displaySlideIdx]);

  const images   = CATEGORY_IMAGES[displayCategory];
  const totalImg = CATEGORY_IMAGES[activeCategory].length;
  const currentImg = images[displaySlideIdx]!;
  const activeCat  = CATEGORIES.find(c => c.key === activeCategory)!;
  const displayCat = CATEGORIES.find(c => c.key === displayCategory)!;

  const goNext = () => {
    setDirection('next');
    setSlideIdx(prev => (prev + 1) % totalImg);
  };
  const goPrev = () => {
    setDirection('prev');
    setSlideIdx(prev => (prev - 1 + totalImg) % totalImg);
  };
  const goTo = (i: number) => {
    setDirection(i > slideIdx ? 'next' : 'prev');
    setSlideIdx(i);
  };

  return (
    <section
      id="work"
      data-section
      className="relative py-0 bg-[#0a0a0a]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">

        {/* ── LEFT PANEL ───────────────────────────────────────────── */}
        <div
          className="relative flex flex-col justify-between px-8 py-10 lg:py-14 overflow-hidden"
          style={{ backgroundColor: NEON_BG }}
        >
          {/* Scan-line texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg,#000 0px,#000 1px,transparent 1px,transparent 7px)',
            }}
          />

          {/* ── TOP: meta + headline ── */}
          <div className="relative z-10">
            <span
              className={`text-[10px] md:text-xs text-black/55 tracking-[0.3em] uppercase mb-4 block transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              STUDY — 04.13 / SELECTED WORK
            </span>

            <h2 className="leading-[0.85] tracking-[-0.02em] overflow-hidden">
              <span
                className={`block text-[clamp(3.5rem,9vw,7.5rem)] font-black text-black uppercase transition-all duration-700 delay-[60ms] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {t('headline')}
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

          {/* ── MIDDLE: left-border statement + body ── */}
          <div
            className={`relative z-10 border-l-[3px] border-black/50 pl-5 my-8 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <p className="text-lg md:text-xl font-black text-black uppercase leading-[1.1] tracking-tight mb-3">
              {t('statementLine1')}
              <br />
              {t('statementLine2')}
            </p>
            <p className="text-[11px] md:text-xs text-black/65 uppercase leading-relaxed tracking-wide">
              {t('bodyText')}&nbsp;&nbsp;{t('bodyTextBold')}
            </p>
          </div>

          {/* ── BOTTOM: text-only category selector ── */}
          <div
            className={`relative z-10 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <div className="w-full h-px bg-black/25 mb-5" />

            <div className="flex flex-col gap-0">
              {CATEGORIES.map((cat, idx) => {
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setActiveCategory(cat.key)}
                    className="group w-full text-left py-3 border-b border-black/15 last:border-b-0 focus:outline-none"
                    style={{ transitionDelay: `${300 + idx * 40}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-3">
                        {/* Mod label */}
                        <span
                          className={`text-[9px] font-mono tracking-widest transition-colors duration-200 ${
                            isActive ? 'text-black' : 'text-black/35'
                          }`}
                        >
                          {cat.mod}
                        </span>

                        {/* Category name */}
                        <span
                          className={`font-black text-sm md:text-base uppercase tracking-tight leading-none transition-all duration-200 ${
                            isActive
                              ? 'text-black'
                              : 'text-black/55 group-hover:text-black/80'
                          }`}
                        >
                          {cat.label}
                        </span>
                      </div>

                      {/* Right side: sublabel + arrow */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`text-[9px] text-black/40 uppercase tracking-wide hidden md:block transition-opacity duration-200 ${
                            isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                          }`}
                        >
                          {cat.sublabel}
                        </span>
                        <span
                          className={`font-black text-black text-sm transition-all duration-300 ${
                            isActive
                              ? 'opacity-100 translate-x-0'
                              : 'opacity-0 -translate-x-1 group-hover:opacity-40 group-hover:translate-x-0'
                          }`}
                        >
                          →
                        </span>
                      </div>
                    </div>

                    {/* Active underline */}
                    <div
                      className={`mt-2 h-[1.5px] bg-black origin-left transition-all duration-400 ${
                        isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: slideshow ────────────────────────────────── */}
        <div className="relative bg-[#080808] min-h-[65vh] lg:min-h-full overflow-hidden group/panel">

          {/* Image — crossfade */}
          <div
            className="absolute inset-0 transition-opacity duration-[320ms]"
            style={{ opacity: slideRevealed ? 1 : 0 }}
          >
            <div
              className="absolute inset-0 transition-transform duration-[1200ms] ease-out"
              style={{ transform: slideRevealed ? 'scale(1)' : 'scale(1.04)' }}
            >
              <LazyImage
                src={currentImg.src}
                alt={currentImg.alt}
                fill
                className="object-cover grayscale"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Bracket label — centered */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <span
              className="font-black uppercase text-white text-[clamp(2.5rem,7vw,6rem)] tracking-[-0.01em] leading-none"
              style={{
                opacity: slideRevealed && !catTransitioning ? 1 : 0,
                transform:
                  slideRevealed && !catTransitioning
                    ? 'translateY(0) skewX(0deg)'
                    : 'translateY(14px) skewX(-2deg)',
                transition:
                  'opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)',
                textShadow: '0 2px 40px rgba(0,0,0,0.5)',
              }}
            >
              {displayCat.bracket}
            </span>
          </div>

          {/* ── SLIDER CONTROLS ── */}
          {/* Prev / Next buttons — appear on panel hover */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center border border-white/30 text-white bg-black/30 backdrop-blur-sm hover:bg-[#ff7300] hover:border-[#ff7300] hover:text-black transition-all duration-250 opacity-0 group-hover/panel:opacity-100"
          >
            ←
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center border border-white/30 text-white bg-black/30 backdrop-blur-sm hover:bg-[#ff7300] hover:border-[#ff7300] hover:text-black transition-all duration-250 opacity-0 group-hover/panel:opacity-100"
          >
            →
          </button>

          {/* Dot / dash indicator — bottom center */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {Array.from({ length: totalImg }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Image ${i + 1}`}
                className="focus:outline-none group/dot"
              >
                <div
                  className="transition-all duration-350"
                  style={{
                    height: '2px',
                    width: (activeCategory === displayCategory ? slideIdx : displaySlideIdx) === i ? '28px' : '8px',
                    backgroundColor:
                      (activeCategory === displayCategory ? slideIdx : displaySlideIdx) === i
                        ? '#ff7300'
                        : 'rgba(255,255,255,0.35)',
                    borderRadius: '1px',
                  }}
                />
              </button>
            ))}
          </div>

          {/* Image counter + category — top right */}
          <div className="absolute top-5 right-5 z-20 pointer-events-none text-right">
            <span className="text-[9px] font-mono text-white/50 tracking-widest uppercase block">
              {String(displaySlideIdx + 1).padStart(2, '0')} / {String(totalImg).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-mono text-[#ff7300] tracking-widest uppercase block mt-0.5">
              {displayCat.mod}
            </span>
          </div>

          {/* Bottom-left: category label */}
          <div className="absolute bottom-6 left-5 z-30 pointer-events-none">
            <span
              className="text-[9px] font-mono text-white/45 tracking-widest uppercase"
              style={{
                opacity: slideRevealed ? 1 : 0,
                transition: 'opacity 0.4s ease 0.1s',
              }}
            >
              {displayCat.mod} — {displayCat.label}
            </span>
          </div>

          {/* Category-switch overlay */}
          <div
            className="absolute inset-0 bg-[#080808] z-40 pointer-events-none transition-opacity duration-320"
            style={{ opacity: catTransitioning ? 1 : 0 }}
          />

          {/* Section-enter overlay */}
          <div
            className={`absolute inset-0 bg-[#080808] z-50 pointer-events-none transition-opacity duration-700 delay-500 ${
              isVisible ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </div>
      </div>
    </section>
  );
}
