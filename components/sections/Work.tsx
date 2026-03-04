'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import LazyImage from '@/components/LazyImage';
import { MEDIA } from '@/lib/media';
import type { WorkProps } from '@/types/sections';

const NEON_BG = '#ff7300';

/* ─── Per-category image sets (5 each) ─────────────────────────────
   Replace with your own per-category images when ready.            */
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
  mod: string;
  bracket: string;
  roman: string;
}[] = [
  { key: 'social',      label: 'Social — UGC',        mod: 'AM/01', bracket: '[UGC]',   roman: 'I'   },
  { key: 'video',       label: 'AI Video — Films',    mod: 'AM/02', bracket: '[FILM]',  roman: 'II'  },
  { key: 'marketing',   label: 'Marketing',           mod: 'AM/03', bracket: '[BRAND]', roman: 'III' },
  { key: 'animation',   label: 'AI Animation — 3D',   mod: 'AM/04', bracket: '[3D]',    roman: 'IV'  },
  { key: 'photography', label: 'Photography — Brand', mod: 'AM/05', bracket: '[PHOTO]', roman: 'V'   },
];

export default function Work({ visibleSections }: WorkProps) {
  const t = useTranslations('work');
  const isVisible = visibleSections.has('work');

  const [activeCategory, setActiveCategory]   = useState<CategoryKey>('social');
  const [displayCategory, setDisplayCategory] = useState<CategoryKey>('social');
  const [imgRevealed, setImgRevealed]         = useState(true);
  const [bracketIn, setBracketIn]             = useState(true);

  const switchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Crossfade on category change */
  useEffect(() => {
    if (activeCategory === displayCategory) return;
    setImgRevealed(false);
    setBracketIn(false);
    switchTimer.current = setTimeout(() => {
      setDisplayCategory(activeCategory);
      setImgRevealed(true);
      switchTimer.current = setTimeout(() => setBracketIn(true), 80);
    }, 380);
    return () => {
      if (switchTimer.current) clearTimeout(switchTimer.current);
    };
  }, [activeCategory, displayCategory]);

  const images      = CATEGORY_IMAGES[displayCategory];
  const featuredImg = images[0]!;
  const activeCat   = CATEGORIES.find(c => c.key === activeCategory)!;
  const displayCat  = CATEGORIES.find(c => c.key === displayCategory)!;

  return (
    <section
      id="work"
      data-section
      className="relative py-0 bg-[#0a0a0a]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">

        {/* ── LEFT PANEL (neon orange) ──────────────────────────────── */}
        <div
          className="relative flex flex-col justify-between px-8 py-10 lg:py-14 overflow-hidden"
          style={{ backgroundColor: NEON_BG }}
        >
          {/* Subtle scan-line texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg,#000 0px,#000 1px,transparent 1px,transparent 7px)',
            }}
          />

          {/* ── TOP BLOCK: meta + giant headline ── */}
          <div className="relative z-10">
            <span
              className={`text-[10px] md:text-xs text-black/55 tracking-[0.3em] uppercase mb-4 block transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              STUDY — 04.13 / SELECTED WORK
            </span>

            {/* Massive 2-line headline */}
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

          {/* ── MIDDLE BLOCK: left-border statement + body ── */}
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

          {/* ── BOTTOM BLOCK: thumbnail strip ── */}
          <div
            className={`relative z-10 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <div className="w-full h-px bg-black/25 mb-5" />
            <div className="flex gap-3">
              {CATEGORIES.map((cat) => {
                const thumb = CATEGORY_IMAGES[cat.key][0]!;
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setActiveCategory(cat.key)}
                    className="group flex-1 flex flex-col gap-1.5 focus:outline-none"
                  >
                    {/* Thumbnail */}
                    <div
                      className={`relative w-full overflow-hidden transition-all duration-300 ${
                        isActive ? 'ring-2 ring-black' : 'ring-0 opacity-60 group-hover:opacity-100'
                      }`}
                      style={{ aspectRatio: '3/4' }}
                    >
                      <LazyImage
                        src={thumb.src}
                        alt={cat.label}
                        fill
                        className={`object-cover transition-transform duration-500 ${
                          isActive ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'
                        } group-hover:scale-[1.06]`}
                        sizes="10vw"
                      />
                      {/* Active tint */}
                      {isActive && (
                        <div className="absolute inset-0 bg-[#ff7300]/25 mix-blend-multiply" />
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={`text-[8px] md:text-[9px] font-mono tracking-widest uppercase transition-colors duration-200 ${
                        isActive ? 'text-black' : 'text-black/45 group-hover:text-black/70'
                      }`}
                    >
                      ARTIFACT-{cat.roman}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: full-bleed image + bracket overlay ───────── */}
        <div className="relative bg-[#080808] min-h-[65vh] lg:min-h-full overflow-hidden">

          {/* Image — grayscale, crossfade on switch */}
          <div
            className="absolute inset-0 transition-opacity duration-[380ms]"
            style={{ opacity: imgRevealed ? 1 : 0 }}
          >
            {/* Scale wrapper for ken-burns reveal */}
            <div
              className="absolute inset-0 transition-transform duration-[1400ms] ease-out"
              style={{ transform: imgRevealed ? 'scale(1)' : 'scale(1.05)' }}
            >
              <LazyImage
                src={featuredImg.src}
                alt={featuredImg.alt}
                fill
                className="object-cover grayscale"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Bracket text — centered */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <span
              className="font-black uppercase text-white text-[clamp(2.5rem,7vw,6rem)] tracking-[-0.01em] leading-none"
              style={{
                opacity: bracketIn ? 1 : 0,
                transform: bracketIn ? 'translateY(0) skewX(0deg)' : 'translateY(14px) skewX(-2deg)',
                transition: 'opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)',
                textShadow: '0 2px 40px rgba(0,0,0,0.5)',
              }}
            >
              {displayCat.bracket}
            </span>
          </div>

          {/* Bottom-left meta */}
          <div className="absolute bottom-0 left-0 z-20 pointer-events-none">
            <div
              className="px-5 py-4"
              style={{
                opacity: bracketIn ? 1 : 0,
                transform: bracketIn ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s',
              }}
            >
              <span className="text-[9px] font-mono text-white/50 tracking-widest uppercase block">
                {displayCat.mod} — {displayCat.label}
              </span>
            </div>
          </div>

          {/* Category counter — top-right */}
          <div className="absolute top-5 right-5 z-20 pointer-events-none flex items-center gap-2">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.key}
                className="transition-all duration-300"
                style={{
                  width: activeCategory === cat.key ? '24px' : '6px',
                  height: '2px',
                  backgroundColor:
                    activeCategory === cat.key ? '#ff7300' : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>

          {/* Section-enter reveal overlay */}
          <div
            className={`absolute inset-0 bg-[#080808] z-30 pointer-events-none transition-opacity duration-700 delay-500 ${
              isVisible ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </div>
      </div>
    </section>
  );
}
