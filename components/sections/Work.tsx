'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import LazyImage from '@/components/LazyImage';
import { MEDIA } from '@/lib/media';
import type { WorkProps } from '@/types/sections';

const NEON_BG = '#ff7300';

/* ─── Per-category image sets (5 each) ───────────────────────────── */
// Replace placeholder entries with your actual images per category.
// Each entry: { src: string, alt: string }
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

const CATEGORIES: { key: CategoryKey; label: string; mod: string }[] = [
  { key: 'social',       label: 'Social — UGC',       mod: 'AM/01' },
  { key: 'video',        label: 'AI Video — Films',   mod: 'AM/02' },
  { key: 'marketing',    label: 'Marketing',          mod: 'AM/03' },
  { key: 'animation',    label: 'AI Animation — 3D',  mod: 'AM/04' },
  { key: 'photography',  label: 'Photography — Brand', mod: 'AM/05' },
];

/* ─── 5-image editorial grid layout ──────────────────────────────── */
// Layout: [img1 spans top-left large] [img2 top-right] [img3 mid-right] [img4 bottom-left] [img5 bottom-right]
const GRID_CLASSES = [
  'col-span-2 row-span-2',  // img 1 — large hero
  'col-span-1 row-span-1',  // img 2
  'col-span-1 row-span-1',  // img 3
  'col-span-1 row-span-1',  // img 4
  'col-span-1 row-span-1',  // img 5
] as const;

export default function Work({ visibleSections }: WorkProps) {
  const t = useTranslations('work');
  const isVisible = visibleSections.has('work');
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('social');
  const [displayCategory, setDisplayCategory] = useState<CategoryKey>('social');
  const [transitioning, setTransitioning] = useState(false);
  const [imgReveal, setImgReveal] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Crossfade when category changes */
  useEffect(() => {
    if (activeCategory === displayCategory) return;
    setTransitioning(true);
    setImgReveal(false);
    timeoutRef.current = setTimeout(() => {
      setDisplayCategory(activeCategory);
      setImgReveal(true);
      setTransitioning(false);
    }, 320);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [activeCategory, displayCategory]);

  const images = CATEGORY_IMAGES[displayCategory];
  const activeCat = CATEGORIES.find(c => c.key === activeCategory)!;

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
        className={`text-center py-6 px-6 border-b border-white/[0.06] transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <span className="text-[10px] md:text-xs text-white/40 tracking-[0.25em] uppercase">
          IDX / AM — CAT — 3.01 — SELECTED WORK
        </span>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">

        {/* ── LEFT PANEL (orange) ──────────────────────────────────── */}
        <div
          className="relative flex flex-col justify-between px-8 py-12 lg:py-16 lg:pr-10 overflow-hidden"
          style={{ backgroundColor: NEON_BG }}
        >
          {/* Subtle texture overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 8px),
                                repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 8px)`,
            }}
          />

          {/* Top block: label + headline + text */}
          <div className="relative z-10">
            <span
              className={`text-[10px] md:text-xs text-black/60 tracking-[0.3em] uppercase mb-3 block transition-all duration-700 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              STUDY — 04.01 / SELECTED WORK
            </span>

            <h2
              className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-black uppercase leading-[0.88] tracking-tight mb-6 transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {t('headline')}
            </h2>

            {/* Vertical accent line */}
            <div
              className={`w-[2px] h-10 bg-black/40 mb-6 transition-all duration-700 delay-200 origin-top ${
                isVisible ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
              }`}
            />

            {/* Body text — editorial style */}
            <p
              className={`text-base md:text-lg text-black/70 leading-relaxed mb-2 transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {t('bodyText')}
            </p>
            <p
              className={`text-base md:text-lg font-bold text-black leading-relaxed transition-all duration-700 delay-[350ms] ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {t('bodyTextBold')}
            </p>
          </div>

          {/* Bottom block: category selector */}
          <div className="relative z-10 mt-10">
            {/* Separator */}
            <div className="w-full h-[1px] bg-black/20 mb-6" />

            <span className="text-[10px] text-black/50 tracking-widest uppercase mb-4 block">
              BROWSE BY CATEGORY
            </span>

            <div className="flex flex-col gap-0">
              {CATEGORIES.map((cat, idx) => {
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setActiveCategory(cat.key)}
                    className={`group flex items-center justify-between py-3 border-b transition-all duration-300 ${
                      isActive
                        ? 'border-black/30'
                        : 'border-black/10 hover:border-black/25'
                    } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                    style={{ transitionDelay: `${400 + idx * 55}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[9px] tracking-widest font-mono transition-colors duration-200 ${
                          isActive ? 'text-black' : 'text-black/40'
                        }`}
                      >
                        {cat.mod}
                      </span>
                      <span
                        className={`font-bold text-sm md:text-[15px] tracking-wide uppercase transition-colors duration-200 ${
                          isActive ? 'text-black' : 'text-black/60 group-hover:text-black/80'
                        }`}
                      >
                        {cat.label}
                      </span>
                    </div>

                    {/* Active indicator arrow */}
                    <span
                      className={`font-black text-black transition-all duration-300 ${
                        isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                      }`}
                    >
                      →
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active mod counter */}
            <div className="mt-5 flex items-center gap-2">
              <div className="w-4 h-[2px] bg-black/40" />
              <span className="text-[10px] font-mono text-black/50 tracking-widest uppercase">
                {activeCat.mod} — {activeCat.label}
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL (image grid) ─────────────────────────────── */}
        <div
          className={`relative bg-[#080808] min-h-[60vh] lg:min-h-full overflow-hidden transition-all duration-700 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Grid container */}
          <div
            className={`absolute inset-0 grid grid-cols-3 grid-rows-3 gap-[2px] transition-opacity duration-300 ${
              imgReveal ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {images.map((img, idx) => (
              <ImageCell
                key={`${displayCategory}-${idx}`}
                src={img.src}
                alt={img.alt}
                gridClass={GRID_CLASSES[idx]!}
                delay={idx * 70}
                reveal={imgReveal && isVisible}
                index={idx}
                catMod={activeCat.mod}
              />
            ))}
          </div>

          {/* Category label overlay (top-left corner) */}
          <div className="absolute top-0 left-0 z-20 pointer-events-none">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#ff7300]/90 backdrop-blur-sm">
              <span className="text-[9px] font-mono tracking-widest text-black uppercase">
                {activeCat.mod}
              </span>
              <span className="w-px h-3 bg-black/30" />
              <span className="text-[9px] font-bold tracking-[0.2em] text-black uppercase">
                {activeCat.label}
              </span>
            </div>
          </div>

          {/* Transition overlay */}
          <div
            className={`absolute inset-0 bg-[#080808] z-10 pointer-events-none transition-opacity duration-300 ${
              transitioning ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </div>
    </section>
  );
}

/* ─── Individual image cell ─────────────────────────────────────── */
interface ImageCellProps {
  src: string;
  alt: string;
  gridClass: string;
  delay: number;
  reveal: boolean;
  index: number;
  catMod: string;
}

function ImageCell({ src, alt, gridClass, delay, reveal, index, catMod }: ImageCellProps) {
  const [hovered, setHovered] = useState(false);
  const isHero = index === 0;

  return (
    <div
      className={`relative overflow-hidden ${gridClass} group cursor-pointer`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Image */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          opacity: reveal ? 1 : 0,
          transform: reveal ? 'scale(1)' : 'scale(1.06)',
          transitionDelay: `${delay}ms`,
        }}
      >
        <LazyImage
          src={src}
          alt={alt}
          fill
          className={`object-cover transition-transform duration-700 ease-out ${
            hovered ? 'scale-[1.05]' : 'scale-100'
          }`}
          sizes="(max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Hover overlay */}
      <div
        className={`absolute inset-0 transition-all duration-400 z-10 ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
        }}
      />

      {/* Hover meta tag */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 p-3 flex items-end justify-between transition-all duration-400 ${
          hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        <div>
          <span className="text-[8px] font-mono text-white/50 tracking-widest uppercase block mb-0.5">
            {catMod} — {String(index + 1).padStart(2, '0')}
          </span>
          {isHero && (
            <span className="text-[11px] font-bold text-white uppercase tracking-wide line-clamp-1">
              {alt}
            </span>
          )}
        </div>
        <div className="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-[10px]">↗</span>
        </div>
      </div>

      {/* Corner accent (always visible on hero image) */}
      {isHero && (
        <div className="absolute top-3 right-3 z-20">
          <div
            className={`w-5 h-[2px] bg-[#ff7300] transition-all duration-500 ${
              reveal ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}
            style={{ transformOrigin: 'right', transitionDelay: `${delay + 300}ms` }}
          />
          <div
            className={`w-[2px] h-5 bg-[#ff7300] ml-auto transition-all duration-500 ${
              reveal ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
            }`}
            style={{ transformOrigin: 'top', transitionDelay: `${delay + 350}ms` }}
          />
        </div>
      )}
    </div>
  );
}
