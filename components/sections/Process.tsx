'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ProcessProps } from '@/types/sections';
import RevealText from '@/components/RevealText';

const STEPS = [1, 2, 3, 4] as const;
const MOD_LABELS = ['AM/01', 'AM/02', 'AM/03', 'AM/04'] as const;
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

/* ─── Number scramble for counters ─────────────────────────────── */
function useRevealScramble(target: string, revealed: boolean) {
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    if (!revealed) return;
    let step = 0;
    const TOTAL = 12;
    let timer: ReturnType<typeof setTimeout>;

    const run = () => {
      if (step >= TOTAL) { setDisplay(target); return; }
      setDisplay(
        target.split('').map((ch) =>
          /\d/.test(ch)
            ? (SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] ?? ch)
            : ch
        ).join('')
      );
      step++;
      timer = setTimeout(run, 42);
    };

    const init = setTimeout(run, 220);
    return () => { clearTimeout(init); clearTimeout(timer); };
  }, [revealed, target]);

  return display;
}

/* ══════════════════════════════════════════════════════════════════
   UNIFIED NOISE-DISSOLVE HOOK
   All 4 cards start as full scramble noise and resolve to real text.
   Mode controls the ORDER in which positions are revealed:
     0 — L→R         (left to right)
     1 — R→L         (right to left)
     2 — Center→Out  (from center, spreading both directions)
     3 — Random      (deterministic pseudo-random order)
   ══════════════════════════════════════════════════════════════════ */

function useNoiseResolve(full: string, revealed: boolean, mode: 0 | 1 | 2 | 3): string {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!revealed) { setDisplayed(''); return; }

    const chars = full.split('');

    // Collect revealable (non-space) indices
    const revealable = chars
      .map((ch, i) => (ch !== ' ' ? i : -1))
      .filter((i): i is number => i >= 0);

    // Build reveal order based on mode
    let order: number[];

    if (mode === 0) {
      // L→R: natural order
      order = [...revealable];

    } else if (mode === 1) {
      // R→L: reverse
      order = [...revealable].reverse();

    } else if (mode === 2) {
      // Center→Out: start from middle, expand outward simultaneously
      const mid = Math.floor(revealable.length / 2);
      order = [];
      let l = mid;
      let r = mid;
      while (l >= 0 || r < revealable.length) {
        if (l >= 0 && revealable[l] !== undefined) order.push(revealable[l]!);
        if (r < revealable.length && r !== l && revealable[r] !== undefined) order.push(revealable[r]!);
        l--;
        r++;
      }

    } else {
      // Random: deterministic pseudo-random (stable between renders)
      order = [...revealable].sort(
        (a, b) => ((a * 7919 + 13) % 97) - ((b * 7919 + 13) % 97)
      );
    }

    const revealedSet = new Set<number>();
    let ptr = 0;
    const BATCH = Math.max(1, Math.ceil(order.length / 25));
    let timer: ReturnType<typeof setTimeout>;

    // Start with full noise
    setDisplayed(
      chars.map((ch) =>
        ch === ' ' ? ' ' : (SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] ?? ch)
      ).join('')
    );

    const tick = () => {
      if (ptr >= order.length) { setDisplayed(full); return; }

      for (let b = 0; b < BATCH && ptr < order.length; b++, ptr++) {
        revealedSet.add(order[ptr]!);
      }

      // Unresolved positions keep cycling random chars each tick
      setDisplayed(
        chars.map((ch, i) =>
          ch === ' '
            ? ' '
            : revealedSet.has(i)
              ? ch
              : (SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] ?? ch)
        ).join('')
      );

      timer = setTimeout(tick, 22);
    };

    // Slight delay offset per mode so they feel distinct even if cards appear simultaneously
    const init = setTimeout(tick, 240 + mode * 40);
    return () => { clearTimeout(init); clearTimeout(timer); };
  }, [revealed, full, mode]);

  return displayed;
}

/* ─── Unified noise-dissolve text component ─────────────────────── */
interface TextProps { highlight: string; rest: string; revealed: boolean; }

function NoiseText({ highlight, rest, revealed, mode }: TextProps & { mode: 0 | 1 | 2 | 3 }) {
  const full = highlight + ' ' + rest;
  const displayed = useNoiseResolve(full, revealed, mode);

  if (!displayed) return null;

  const hlLen = highlight.length;
  const hlPart = displayed.slice(0, hlLen);
  const restPart = displayed.slice(hlLen + 1);

  return (
    <span className="font-mono">
      <span className="text-[#ff7300] font-bold uppercase tracking-wide">{hlPart}</span>
      <span className="text-white/80 uppercase tracking-wide"> {restPart}</span>
    </span>
  );
}

/* ─── Per-card component ────────────────────────────────────────── */
interface CardProps { step: typeof STEPS[number]; idx: number }

function ProcessCard({ step, idx }: CardProps) {
  const t = useTranslations('process');
  const cardRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  const counterTarget = `// ${String(step).padStart(3, '0')}`;
  const counterDisplay = useRevealScramble(counterTarget, revealed);

  const highlight = t(`step${step}.highlight`);
  const rest = t(`step${step}.rest`);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { setRevealed(entry?.isIntersecting ?? false); },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isLeft = idx % 2 === 0;

  const show = (delay: number, extra = '') =>
    `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms${extra ? `, ${extra}` : ''}`;

  return (
    <div
      ref={cardRef}
      className={`border-t border-white/10 ${isLeft ? 'md:border-r border-white/10' : ''}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] min-h-[280px] md:min-h-[320px]">

        {/* ── LEFT: label + title + accents + counter ── */}
        <div className="flex flex-col justify-between px-6 md:px-8 py-8 md:py-10">
          <div>
            <span
              className="block text-[10px] text-white/40 tracking-[0.25em] uppercase mb-5"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'none' : 'translateY(6px)',
                transition: show(50),
              }}
            >
              MOD — {MOD_LABELS[idx]}
            </span>

            <RevealText
              as="h3"
              mode="words"
              delay={120}
              stagger={48}
              duration={640}
              className="text-2xl md:text-3xl font-black text-white uppercase leading-tight tracking-tight"
            >
              {t(`step${step}.title`)}
            </RevealText>

            <div className="flex flex-col gap-1 mt-4">
              <div
                className="h-[2px] bg-[#ff7300]"
                style={{
                  width: revealed ? '1.5rem' : '0',
                  transition: 'width 0.42s cubic-bezier(0.22,1,0.36,1) 360ms',
                }}
              />
              <div
                className="h-[2px] bg-[#ff7300] opacity-50"
                style={{
                  width: revealed ? '1rem' : '0',
                  transition: 'width 0.42s cubic-bezier(0.22,1,0.36,1) 460ms',
                }}
              />
            </div>
          </div>

          <span
            className="text-[11px] text-white/30 tracking-[0.2em] font-mono mt-6"
            style={{
              opacity: revealed ? 1 : 0,
              transition: 'opacity 0.4s ease 100ms',
            }}
          >
            {counterDisplay}
          </span>
        </div>

        {/* ── CENTER: arrow slide-in ── */}
        <div
          className="hidden lg:flex items-center justify-center px-2 border-l border-white/10"
          style={{
            opacity: revealed ? 0.2 : 0,
            transform: revealed ? 'translateX(0)' : 'translateX(-10px)',
            transition: show(420),
          }}
        >
          <span className="text-white text-lg">→</span>
        </div>

        {/* ── RIGHT: noise-dissolve text (direction per card) ── */}
        <div className="flex items-center px-6 md:px-8 py-8 md:py-10 border-t lg:border-t-0 lg:border-l border-white/10">
          <p
            className="text-sm md:text-base font-bold leading-relaxed"
            style={{ lineHeight: '1.65' }}
          >
            <NoiseText
              highlight={highlight}
              rest={rest}
              revealed={revealed}
              mode={idx as 0 | 1 | 2 | 3}
            />
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Section ───────────────────────────────────────────────────── */
export default function Process({ visibleSections }: ProcessProps) {
  const t = useTranslations('process');
  const isVisible = visibleSections.has('process');

  return (
    <section
      id="process"
      data-section
      className="relative py-0 bg-[#080808]"
    >
      {/* Header */}
      <div className="border-t border-white/10 px-6 md:px-12 py-12 md:py-16">
        <span
          className="block text-[10px] text-white/40 tracking-[0.3em] uppercase mb-4"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'none' : 'translateY(8px)',
            transition: 'opacity 0.6s ease 0.05s, transform 0.6s ease 0.05s',
          }}
        >
          {t('meta')}
        </span>
        <RevealText
          as="h2"
          mode="words"
          delay={60}
          stagger={55}
          duration={720}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none"
        >
          {t('headline')}
        </RevealText>
      </div>

      {/* 2×2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {STEPS.map((step, idx) => (
          <ProcessCard key={step} step={step} idx={idx} />
        ))}
      </div>

      {/* CTA */}
      <div
        className="border-t border-white/10 px-6 md:px-12 py-10 md:py-14"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.7s ease 0.5s',
        }}
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
