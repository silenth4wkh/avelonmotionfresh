'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { MEDIA } from '@/lib/media';

interface NavigatorWithConnection extends Navigator {
  connection?: { effectiveType?: string; saveData?: boolean };
}

const PHASE_DELAY_STAGGER = 90;

/* ── Reusable noise-dissolve hook ───────────────────────────────────────── */
const NOISE_SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

function useNoiseScramble(word: string, active: boolean, triggerKey: number): string {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!active) { setDisplayed(''); return; }

    const len = word.length;
    const revealed = new Set<number>();
    let ptr = 0;
    let timer: ReturnType<typeof setTimeout>;

    // Start fully scrambled
    setDisplayed(
      Array.from({ length: len }, () =>
        NOISE_SCRAMBLE_CHARS[Math.floor(Math.random() * NOISE_SCRAMBLE_CHARS.length)] ?? 'X'
      ).join('')
    );

    const tick = () => {
      if (ptr >= len) { setDisplayed(word); return; }
      revealed.add(ptr);
      ptr++;
      setDisplayed(
        word.split('').map((ch, i) =>
          revealed.has(i)
            ? ch
            : (NOISE_SCRAMBLE_CHARS[Math.floor(Math.random() * NOISE_SCRAMBLE_CHARS.length)] ?? ch)
        ).join('')
      );
      timer = setTimeout(tick, 85);
    };

    const init = setTimeout(tick, 160);
    return () => { clearTimeout(init); clearTimeout(timer); };
  }, [active, word, triggerKey]);

  return displayed;
}

export default function Hero() {
  const t = useTranslations('hero');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [shouldAutoplay, setShouldAutoplay] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering]   = useState(false);
  const [motionActive, setMotionActive]   = useState(false);
  const [motionKey, setMotionKey]         = useState(0);
  const [avelonActive, setAvelonActive]   = useState(false);
  const [avelonKey, setAvelonKey]         = useState(0);
  const [heroMotionKey, setHeroMotionKey] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    const connection = (navigator as NavigatorWithConnection).connection;
    const isSlow =
      connection &&
      (connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g' ||
        connection.saveData === true);
    if (isDesktop && !isSlow) setShouldAutoplay(true);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = sectionRef.current;
    if (!el) return;
    // Throttle to ~60fps: skip frames faster than 16ms to prevent INP spikes
    let lastMove = 0;
    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMove < 16) return;
      lastMove = now;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMouse({ x: x * 30, y: y * 20 });
    };
    const onEnter = () => setIsHovering(true);
    const onLeave = () => setIsHovering(false);
    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [prefersReducedMotion]);

  // Right sidebar MOTION: start after sidebar entrance (~1200ms)
  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setTimeout(() => setMotionActive(true), 1200);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  // Left sidebar AVELON: start after sidebar entrance (~800ms)
  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setTimeout(() => setAvelonActive(true), 800);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  const motionDisplay     = useNoiseScramble('MOTION', motionActive, motionKey);
  const avelonDisplay     = useNoiseScramble('AVELON', avelonActive, avelonKey);
  const heroMotionDisplay = useNoiseScramble('MOTION', motionActive, heroMotionKey);

  const handleCta  = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  const handleWork = () => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });

  /* Entrance animation helper */
  const anim = (delay = 0, duration = 800) =>
    mounted && !prefersReducedMotion
      ? { opacity: 1, transform: 'translateY(0)', transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms` }
      : {};
  const hidden = mounted && !prefersReducedMotion ? { opacity: 0, transform: 'translateY(16px)' } : {};

  const parallaxY = prefersReducedMotion ? 0 : scrollY * 0.28;

  // Spotlight position derived from existing mouse state (no extra state needed)
  // mouse.x ∈ [-15, +15] → spotX: 0–100%
  // mouse.y ∈ [-10, +10] → spotY: 0–100%
  const spotX = (mouse.x / 30 + 0.5) * 100;
  const spotY = (mouse.y / 20 + 0.5) * 100;

  // Pre-split title so we can animate wordM independently (avoids IIFE in JSX)
  const titleParts = t('title').split(' ');
  const titleWordA = titleParts[0] ?? '';
  const titleWordM = titleParts[1] ?? '';

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-section
      className="relative h-screen overflow-hidden pt-16"
      style={{ background: '#080808' }}
    >
      {/* ── Background (parallax) ── */}
      <div className="absolute inset-0 z-0" style={{ transform: `translateY(${parallaxY}px)` }}>
        {MEDIA.heroVideo.src ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={MEDIA.heroVideo.src}
            poster={MEDIA.heroVideo.poster}
            autoPlay={shouldAutoplay}
            muted loop playsInline preload="metadata"
            aria-hidden="true"
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${MEDIA.heroImage}')`, filter: 'brightness(0.42)' }}
            aria-hidden="true"
          />
        )}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0.06) 100%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.38) 0%, transparent 60%)' }}
          aria-hidden="true"
        />
        {/* ── Cursor spotlight — brightens area under cursor ── */}
        {!prefersReducedMotion && (
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              opacity: isHovering ? 1 : 0,
              transition: 'opacity 0.45s ease',
              background: `radial-gradient(ellipse 55% 45% at ${spotX}% ${spotY}%, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 45%, transparent 72%)`,
            }}
          />
        )}
      </div>

      {/* ── "AM" — background watermark, right side, mouse parallax ── */}
      <div
        className="absolute top-1/2 right-0 z-[1] pointer-events-none select-none will-change-transform"
        style={{
          transform: prefersReducedMotion
            ? 'translateY(-50%)'
            : `translate(${mouse.x * 0.6}px, calc(-50% + ${mouse.y * 0.6}px))`,
          transition: prefersReducedMotion ? undefined : 'transform 0.3s ease-out',
        }}
        aria-hidden="true"
      >
        <span
          className={`font-black text-white leading-none tracking-tighter ${
            mounted && !prefersReducedMotion ? 'animate-[heroDisplayReveal_0.7s_ease_0.15s_forwards]' : ''
          }`}
          style={{
            fontSize: 'clamp(10rem, 28vw, 32rem)',
            color: 'rgba(255,255,255,0.07)',
            ...(!mounted ? { opacity: 0 } : prefersReducedMotion ? { opacity: 0.07 } : {}),
            /* Clip right edge so it intentionally bleeds off-screen */
            display: 'block',
            marginRight: '-4vw',
          }}
        >
          {t('brandAbbrev')}
        </span>
      </div>

      {/* ── Content layout ── */}
      <div className="relative z-10 h-full flex">

        {/* Left sidebar */}
        <div
          className="hidden lg:flex flex-col items-center justify-between py-8 pl-6 pr-4 w-14 flex-shrink-0"
          style={{ ...hidden, ...anim(200) }}
        >
          {/* AVELON — noise-dissolve, hover restarts, settled = orange */}
          {prefersReducedMotion ? (
            <div
              className="text-white/20 tracking-[0.4em] text-[10px] font-semibold uppercase select-none"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              aria-hidden="true"
            >
              {t('verticalLabel')}
            </div>
          ) : (
            <div
              className="tracking-[0.4em] text-[10px] font-semibold uppercase select-none"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', cursor: 'default' }}
              aria-hidden="true"
              onMouseEnter={() => setAvelonKey((k) => k + 1)}
            >
              {(avelonDisplay || '\u00a0'.repeat(6)).split('').map((ch, i) => (
                <span
                  key={i}
                  style={{
                    color: ch === 'AVELON'[i] ? '#ff7300' : 'rgba(255,255,255,0.20)',
                    transition: 'color 0.08s ease',
                  }}
                >
                  {ch}
                </span>
              ))}
            </div>
          )}
          <div className="flex-1 w-px bg-white/10 mx-auto my-4" aria-hidden="true" />
          <span
            className="text-white/30 text-[10px] tracking-widest"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            aria-hidden="true"
          >
            {t('year')}
          </span>
        </div>

        {/* ── Main content ── */}
        <div className="flex-1 flex flex-col justify-between px-4 sm:px-6 md:px-8 py-5 md:py-7 min-w-0">

          {/* Top bar */}
          <div className="flex items-center justify-between">
            <span
              className={`hero-explore text-[10px] md:text-xs tracking-[0.35em] uppercase text-white/50 ${mounted && !prefersReducedMotion ? 'hero-explore-animated' : ''}`}
              style={{ ...hidden, ...anim(0) }}
            >
              {t('explore')}
            </span>
            <span
              className="text-[10px] tracking-[0.25em] text-white/30 uppercase hidden md:block"
              style={{ ...hidden, ...anim(50) }}
            >
              {t('idxLabel')} · {t('year')}
            </span>
          </div>

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-end pb-6 gap-0">

            {/* Tagline — above AVELON MOTION */}
            <div
              className="mb-3 md:mb-4"
              style={{ ...hidden, ...anim(120) }}
            >
              <p
                className="text-white/55 font-light leading-tight tracking-tight"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2rem)' }}
              >
                {t('line1')}{' '}
                <span className="font-semibold text-white/80">{t('line2')}</span>
              </p>
              <p
                className="font-bold text-white leading-tight mt-0.5 tracking-tight"
                style={{ fontSize: 'clamp(1.15rem, 2.6vw, 2.4rem)' }}
              >
                {t('line3')}
              </p>
            </div>

            {/* AVELON MOTION — dominant H1 */}
            <div style={{ ...hidden, ...anim(260) }}>
              <h1
                className="font-black text-white leading-[0.88] tracking-tighter uppercase"
                style={{
                  fontSize: 'clamp(4.5rem, 13vw, 16rem)',
                  letterSpacing: '-0.03em',
                  /* Intentional clip on the right for editorial edge */
                  overflow: 'hidden',
                  maxWidth: '90vw',
                }}
              >
                <>
                  <span>{titleWordA} </span>
                  {prefersReducedMotion ? (
                    <span>{titleWordM}</span>
                  ) : (
                    <span
                      style={{ cursor: 'default' }}
                      onMouseEnter={() => setHeroMotionKey((k) => k + 1)}
                    >
                      {(heroMotionDisplay || '\u00a0'.repeat(titleWordM.length)).split('').map((ch, i) => (
                        <span
                          key={i}
                          style={{
                            color: ch === titleWordM[i] ? '#ff7300' : 'inherit',
                            transition: 'color 0.08s ease',
                          }}
                        >
                          {ch}
                        </span>
                      ))}
                    </span>
                  )}
                </>
              </h1>

              {/* Info bar below AVELON MOTION */}
              <div
                className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 md:mt-4"
                style={{ ...hidden, ...anim(360) }}
              >
                <span className="text-[9px] md:text-[10px] tracking-[0.3em] text-white/40 uppercase">
                  {t('subtitle')}
                </span>
                <span className="w-4 h-px bg-white/15 hidden sm:block" aria-hidden />
                <span className="text-[9px] md:text-[10px] tracking-[0.3em] text-white/30 uppercase hidden sm:block">
                  Budapest · Global
                </span>
                <span className="w-4 h-px bg-white/15 hidden md:block" aria-hidden />
                <span className="text-[9px] md:text-[10px] tracking-[0.3em] text-white/25 uppercase hidden md:block">
                  Est. 2024
                </span>
                {/* Orange accent dot */}
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 hidden sm:block"
                  style={{ backgroundColor: '#ff7300' }}
                  aria-hidden
                />
              </div>
            </div>

            {/* Phase grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 mt-4 md:mt-6">
              {(['phase1', 'phase2', 'phase3', 'phase4'] as const).map((key, i) => (
                <div
                  key={key}
                  className="flex flex-col gap-0.5"
                  style={{ ...hidden, ...anim(420 + i * PHASE_DELAY_STAGGER) }}
                >
                  <span className="text-[10px] text-white/30 tabular-nums font-mono">
                    {String(i + 1).padStart(3, '0')}
                  </span>
                  <span className="text-[10px] md:text-[11px] font-medium text-white/70 tracking-wide uppercase">
                    {t(key)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row: CTAs + stats */}
          <div
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-4 border-t border-white/[0.08]"
            style={{ ...hidden, ...anim(660) }}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={handleCta}
                className="text-sm font-bold text-black uppercase tracking-widest px-6 py-3 hover:brightness-90 active:scale-[0.98] transition-all duration-200"
                style={{ backgroundColor: '#ff7300' }}
              >
                {t('primaryCta')} →
              </button>
              <button
                onClick={handleWork}
                className="text-sm font-medium text-white/55 hover:text-white uppercase tracking-widest transition-colors duration-200"
              >
                {t('viewWork')}
              </button>
            </div>
            <div className="flex gap-8">
              {(
                [
                  [t('stat1Value'), t('stat1Label')],
                  [t('stat2Value'), t('stat2Label')],
                  [t('stat3Value'), t('stat3Label')],
                ] as [string, string][]
              ).map(([val, label]) => (
                <div key={label} className="text-right">
                  <p className="text-xl md:text-2xl font-bold text-white leading-none">{val}</p>
                  <p className="text-[9px] md:text-[10px] text-white/45 tracking-wider uppercase mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div
          className="hidden xl:flex flex-col justify-between py-8 pl-4 pr-6 w-44 flex-shrink-0 border-l border-white/[0.06]"
          style={{ ...hidden, ...anim(320) }}
        >
          {/* MOTION — noise-dissolve, hover restarts, settled = orange */}
          {prefersReducedMotion ? (
            <div
              className="text-white/10 text-[10px] font-semibold uppercase select-none"
              style={{ writingMode: 'vertical-rl', letterSpacing: '0.45em' }}
              aria-hidden="true"
            >
              MOTION
            </div>
          ) : (
            <div
              className="text-[10px] font-semibold uppercase select-none"
              style={{ writingMode: 'vertical-rl', letterSpacing: '0.45em', cursor: 'default' }}
              aria-hidden="true"
              onMouseEnter={() => setMotionKey((k) => k + 1)}
            >
              {(motionDisplay || '\u00a0'.repeat(6)).split('').map((ch, i) => (
                <span
                  key={i}
                  style={{
                    color: ch === 'MOTION'[i] ? '#ff7300' : 'rgba(255,255,255,0.42)',
                    transition: 'color 0.08s ease',
                  }}
                >
                  {ch}
                </span>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-3">
            <span className="text-[9px] tracking-[0.3em] text-white/30 uppercase mb-1">{t('idxLabel')}</span>
            {(['cat1', 'cat2', 'cat3', 'cat4'] as const).map((key) => (
              <span key={key} className="text-[10px] text-white/50 tracking-wider leading-relaxed uppercase">
                {t(key)}
              </span>
            ))}
          </div>
          <div className="space-y-1">
            <div className="w-full h-px bg-white/10" />
            <span className="text-[9px] text-white/20 tracking-widest uppercase">VERTICAL</span>
          </div>
        </div>
      </div>
    </section>
  );
}
