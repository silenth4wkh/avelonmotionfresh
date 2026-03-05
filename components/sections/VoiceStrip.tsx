'use client';

import { useTranslations } from 'next-intl';
import type { BaseProps } from '@/types/sections';

/* Bar heights — more contrast between low/high for visual drama */
const WAVE_BARS = [
  0.12, 0.28, 0.18, 0.45, 0.22, 0.6,  0.18, 0.75, 0.35, 0.85,
  0.28, 0.92, 0.4,  0.78, 0.5,  0.88, 0.55, 0.95, 0.62, 0.82,
  0.7,  0.88, 0.95, 0.82, 1.0,  1.0,  0.82, 0.95, 0.88, 0.7,
  0.82, 0.95, 0.62, 0.88, 0.55, 0.78, 0.4,  0.92, 0.28, 0.85,
  0.35, 0.75, 0.18, 0.6,  0.22, 0.45, 0.18, 0.28, 0.12, 0.08,
];

const BAR_COUNT = WAVE_BARS.length;

/* Deterministic per-bar durations — faster at center, pseudo-random jitter */
const BAR_DURATIONS = WAVE_BARS.map((_, i) => {
  const center = (BAR_COUNT - 1) / 2;
  const dist = Math.abs(i - center) / center;        // 0 = center, 1 = edge
  const base = 0.28 + (1 - dist) * 0.18;             // center: 0.46s, edges: 0.28s
  const jitter = ((i * 6271 + 3) % 13) / 13 * 0.22; // deterministic 0–0.22s
  return +(base + jitter).toFixed(3);
});

export default function VoiceStrip({ visibleSections }: BaseProps) {
  const t = useTranslations('voiceStrip');
  const isVisible = visibleSections.has('work');

  return (
    <section
      id="voice-strip"
      aria-label="Voice & audio"
      className="relative bg-[#0a0a0a] overflow-hidden"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : 'translateY(10px)',
        transition: 'opacity 0.9s ease 0.1s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s',
      }}
    >
      {/* ── Three-zone layout ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_160px] items-stretch h-auto lg:h-[196px]">

        {/* LEFT: meta */}
        <div
          className="hidden lg:flex flex-col justify-center gap-3 px-10 h-full"
          style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span
            className="text-[9px] tracking-[0.3em] uppercase"
            style={{ color: 'rgba(255,255,255,0.22)' }}
          >
            IDX/AM · AUDIO
          </span>
          <div className="w-5 h-px" style={{ backgroundColor: '#ff7300', opacity: 0.55 }} />
          <span
            className="text-[11px] font-black tracking-[0.1em] uppercase leading-snug"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            VOICE<br />SYSTEMS
          </span>
        </div>

        {/* CENTER: waveform */}
        <div className="flex items-end px-4 lg:px-8 py-8 lg:py-0 h-full">
          <div
            className="w-full flex items-end justify-between gap-[2px] h-24 md:h-28 lg:h-32"
            aria-hidden
          >
            {WAVE_BARS.map((h, i) => {
              const center = (BAR_COUNT - 1) / 2;
              const dist = Math.abs(i - center) / center;
              // Two-tone: orange at center (dist < 0.35), white towards edges
              const isOrange = dist < 0.38;
              const orangeOpacity = Math.pow(1 - dist, 1.4) * 0.9 + 0.06;
              const whiteOpacity = Math.max(0.04, (1 - dist) * 0.18);

              return (
                <div
                  key={i}
                  className="flex-1 min-w-[2px] voice-bar"
                  style={{
                    height: `${h * 100}%`,
                    animationDelay: `${i * 0.011}s`,
                    animationDuration: `${BAR_DURATIONS[i]}s`,
                    backgroundColor: isOrange
                      ? `rgba(255,115,0,${orangeOpacity.toFixed(2)})`
                      : `rgba(255,255,255,${whiteOpacity.toFixed(2)})`,
                    borderRadius: '1px 1px 0 0',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* RIGHT: service labels */}
        <div
          className="hidden lg:flex flex-col justify-center items-end gap-3 px-10 h-full"
          style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span
            className="text-[9px] tracking-[0.28em] uppercase"
            style={{ color: 'rgba(255,255,255,0.32)' }}
          >
            {t('sync')}
          </span>
          <span
            className="text-[9px] tracking-[0.28em] uppercase"
            style={{ color: 'rgba(255,255,255,0.32)' }}
          >
            {t('podcast')}
          </span>
          <span
            className="text-[9px] tracking-[0.28em] uppercase font-semibold"
            style={{ color: 'rgba(255,115,0,0.65)' }}
          >
            {t('voiceChanger')}
          </span>
        </div>
      </div>

      {/* ── Bottom ticker ──────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 md:px-10 py-2.5"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span
          className="text-[8px] tracking-[0.28em] uppercase"
          style={{ color: 'rgba(255,255,255,0.18)' }}
        >
          MODULE — SVC.AUDIO
        </span>

        {/* Desktop: keyword row */}
        <div className="hidden sm:flex items-center gap-6">
          {(['AI AUDIO PRODUCTION', 'REAL-TIME SYNTHESIS', 'VOICE SYSTEMS'] as const).map((label, i) => (
            <span
              key={label}
              className="text-[8px] tracking-[0.22em] uppercase"
              style={{ color: i === 2 ? 'rgba(255,115,0,0.5)' : 'rgba(255,255,255,0.16)' }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Mobile: compact labels */}
        <span
          className="sm:hidden text-[8px] tracking-[0.2em] uppercase"
          style={{ color: 'rgba(255,255,255,0.18)' }}
        >
          {t('sync')} · {t('podcast')} · {t('voiceChanger')}
        </span>
      </div>
    </section>
  );
}
