'use client';

import { useTranslations } from 'next-intl';
import type { BaseProps } from '@/types/sections';

/* Waveform bar heights (0–1) — music-player style pattern */
const WAVE_BARS = [
  0.35, 0.6, 0.85, 0.5, 0.7, 0.4, 0.9, 0.55, 0.75, 0.45,
  0.65, 0.95, 0.4, 0.8, 0.5, 0.7, 0.55, 0.85, 0.6, 0.45,
  0.75, 0.5, 0.9, 0.4, 0.65, 0.8, 0.55, 0.7, 0.45, 0.85,
  0.6, 0.5, 0.75, 0.4, 0.9, 0.65, 0.55, 0.8, 0.45, 0.7,
  0.85, 0.5, 0.6, 0.75, 0.4, 0.9, 0.65, 0.55, 0.8, 0.45,
];

const BAR_COUNT = WAVE_BARS.length;

export default function VoiceStrip({ visibleSections }: BaseProps) {
  const t = useTranslations('voiceStrip');
  const isVisible = visibleSections.has('work'); // reveal when work is in view

  return (
    <section
      id="voice-strip"
      aria-label="Voice & audio"
      className="relative border-t border-b border-white/10 bg-[#0a0a0a] overflow-hidden"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.8s ease 0.2s',
      }}
    >
      {/* Inner padding — same feel as SHOWROOM */}
      <div className="py-6 md:py-8 px-4 md:px-8 lg:px-12">
        {/* Waveform — almost full width */}
        <div className="max-w-[98%] w-full mx-auto mb-5">
          <div
            className="flex items-end justify-between gap-[2px] md:gap-[3px] h-12 md:h-14"
            aria-hidden
          >
            {WAVE_BARS.map((h, i) => (
              <div
                key={i}
                className="flex-1 min-w-[3px] md:min-w-[4px] rounded-sm bg-[#ff7300]/70 voice-bar"
                style={{
                  height: `${h * 100}%`,
                  animationDelay: `${i * 0.02}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Labels — SYNC · PODCAST · VOICE CHANGER */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-center">
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.35em] text-white/50 uppercase">
            {t('sync')}
          </span>
          <span className="text-white/20 select-none" aria-hidden>·</span>
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.35em] text-white/50 uppercase">
            {t('podcast')}
          </span>
          <span className="text-white/20 select-none" aria-hidden>·</span>
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.35em] text-white/50 uppercase">
            {t('voiceChanger')}
          </span>
        </div>
      </div>
    </section>
  );
}
