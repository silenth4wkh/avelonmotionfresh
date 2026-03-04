'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ServicesProps } from '@/types/sections';
import RevealText from '@/components/RevealText';

const TICKER_TEXT = '◆ SHOWROOM ◆ ';
const TICKER_REPEAT = 20;

/* ─── Hook: intersection-based reveal per element ─── */
function useInView(threshold = 0.25) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── Video overlay label with parallax ─── */
function VideoLabel({ text, index }: { text: string; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    /* Reveal on enter */
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) setRevealed(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);

    /* Scroll parallax */
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const progress = (window.innerHeight / 2 - center) / (window.innerHeight / 2);
      setOffset(progress * 28);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      obs.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  /* Split into words for stagger */
  const words = text.trim().split(/\s+/);
  const baseDelay = 80 + index * 30;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ mixBlendMode: 'overlay' }}
      aria-hidden="true"
    >
      <p
        className="font-black text-white text-center leading-none tracking-tighter uppercase"
        style={{
          fontSize: 'clamp(3rem, 7vw, 9rem)',
          transform: `translateY(${offset}px)`,
          transition: 'transform 0.1s linear',
          letterSpacing: '-0.03em',
        }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden align-bottom"
            style={{ marginRight: i < words.length - 1 ? '0.2em' : 0 }}
          >
            <span
              className="inline-block"
              style={{
                transform: revealed ? 'translateY(0)' : 'translateY(105%)',
                opacity: revealed ? 1 : 0,
                transition: `transform 0.75s cubic-bezier(0.22,1,0.36,1) ${baseDelay + i * 90}ms, opacity 0.5s ease ${baseDelay + i * 90}ms`,
              }}
            >
              {word}
            </span>
          </span>
        ))}
      </p>
    </div>
  );
}

export default function Services({ visibleSections }: ServicesProps) {
  const t = useTranslations('services');
  const isVisible = visibleSections.has('services');

  const { ref: mod1Ref, inView: mod1 } = useInView();
  const { ref: mod2Ref, inView: mod2 } = useInView();
  const { ref: mod3Ref, inView: mod3 } = useInView();
  const modRefs = [
    { ref: mod1Ref, inView: mod1 },
    { ref: mod2Ref, inView: mod2 },
    { ref: mod3Ref, inView: mod3 },
  ];

  return (
    <section
      id="services"
      data-section
      className={`relative py-0 bg-[#0a0a0a] transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* SHOWROOM ticker */}
      <div
        className="overflow-hidden border-t border-b border-white/10 py-4"
        style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.9s 300ms' }}
      >
        <div className="flex whitespace-nowrap" style={{ animation: 'showroomTicker 25s linear infinite' }}>
          {[0, 1].map((n) => (
            <span key={n} className="inline-block text-sm md:text-base font-medium tracking-[0.3em] text-white/60 px-4">
              {Array(TICKER_REPEAT).fill(TICKER_TEXT).join('')}
            </span>
          ))}
        </div>
      </div>

      {/* Service blocks */}
      {([1, 2, 3] as const).map((i, idx) => {
        const { ref, inView } = modRefs[idx]!;
        return (
          <div key={i} className="border-b border-white/10 last:border-b-0">

            {/* Video */}
            <div className="relative w-full aspect-video max-h-[75vh] bg-black overflow-hidden">
              <video
                src={`/media/services-video${i === 1 ? '' : i}.mp4`}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay muted loop playsInline
              />
              {/* Gradient */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Short animated label — max 1-2 words */}
              <VideoLabel text={t(`statement${i}`)} index={idx} />

              {/* Meta bottom-left */}
              <div className="absolute bottom-4 left-4 text-[10px] md:text-xs text-white/50 tracking-widest uppercase">
                {t(`meta${i}`)}
              </div>
              {/* Tags bottom-right */}
              <div className="absolute bottom-4 right-4 text-[10px] md:text-xs text-[#ff7300] tracking-widest">
                {t(`tags${i}`)}
              </div>
            </div>

            {/* Module text block */}
            <div
              ref={ref}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 px-6 md:px-12 py-12 md:py-20 max-w-[1600px] mx-auto"
            >
              {/* Left col */}
              <div className="md:col-span-4">
                {/* Module label — clip reveal */}
                <div className="overflow-hidden mb-1">
                  <span
                    className="block text-[10px] md:text-xs text-[#ff7300] tracking-[0.2em] uppercase font-semibold"
                    style={{
                      transform: inView ? 'translateY(0)' : 'translateY(100%)',
                      opacity: inView ? 1 : 0,
                      transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1) 0ms, opacity 0.4s ease 0ms',
                    }}
                  >
                    {t('moduleLabel')} — B.0{i}
                  </span>
                </div>

                {/* Title — word stagger */}
                <RevealText
                  as="h3"
                  mode="words"
                  delay={60}
                  stagger={50}
                  duration={680}
                  className="text-xl md:text-2xl font-bold text-white mt-2 mb-6"
                >
                  {t(`service${i}.title`).toUpperCase()}
                </RevealText>

                {/* Tags — fade in */}
                <div
                  className="flex flex-wrap gap-2"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'none' : 'translateY(8px)',
                    transition: 'opacity 0.6s ease 280ms, transform 0.6s ease 280ms',
                  }}
                >
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

              {/* Right col — description reveal */}
              <div className="md:col-span-8 lg:col-span-7 lg:col-start-6 flex items-center">
                <RevealText
                  as="p"
                  mode="words"
                  delay={120}
                  stagger={18}
                  duration={640}
                  className="text-white/75 text-lg md:text-xl lg:text-2xl font-light leading-relaxed"
                >
                  {t(`service${i}.description`)}
                </RevealText>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
