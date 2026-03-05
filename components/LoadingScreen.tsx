'use client';

import { useState, useEffect } from 'react';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

/* ─── Noise-dissolve hook — L→R reveal from scramble ────────────────────── */
function useNoiseResolve(target: string, started: boolean, delayMs = 0): string {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!started) return;

    const chars = target.split('');
    const revealable = chars
      .map((ch, i) => (ch !== ' ' ? i : -1))
      .filter((i): i is number => i >= 0);

    const revealedSet = new Set<number>();
    let ptr = 0;
    const BATCH = Math.max(1, Math.ceil(revealable.length / 16));
    let timer: ReturnType<typeof setTimeout>;

    // Start with full noise
    setDisplayed(
      chars.map((ch) =>
        ch === ' ' ? ' ' : (SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] ?? ch)
      ).join('')
    );

    const tick = () => {
      if (ptr >= revealable.length) { setDisplayed(target); return; }

      for (let b = 0; b < BATCH && ptr < revealable.length; b++, ptr++) {
        revealedSet.add(revealable[ptr]!);
      }

      setDisplayed(
        chars.map((ch, i) =>
          ch === ' ' ? ' ' : revealedSet.has(i)
            ? ch
            : (SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] ?? ch)
        ).join('')
      );

      timer = setTimeout(tick, 38);
    };

    const init = setTimeout(tick, delayMs);
    return () => { clearTimeout(init); clearTimeout(timer); };
  }, [started, target, delayMs]);

  return displayed;
}

/* ─── LoadingScreen ──────────────────────────────────────────────────────── */
interface LoadingScreenProps {
  duration?: number;
}

export default function LoadingScreen({ duration = 1800 }: LoadingScreenProps) {
  const [visible, setVisible]        = useState(true);
  const [fadeOut, setFadeOut]        = useState(false);
  const [started, setStarted]        = useState(false);
  const [counterDisplay, setCounter] = useState('$$$');

  // AM monogram and subtitle dissolve from noise
  const amDisplay       = useNoiseResolve('AM', started, 0);
  const subtitleDisplay = useNoiseResolve('AVELON MOTION', started, 450);

  /* ── Counter: 000 → 100 with scramble on unsettled digits ── */
  useEffect(() => {
    if (!started) return;

    const counterDuration = duration - 480;
    const msPerStep = counterDuration / 100;
    let count = 0;
    let last = Date.now();
    let timerId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const now = Date.now();
      if (now - last >= msPerStep && count < 100) {
        count++;
        last = now;
      }

      if (count >= 100) {
        setCounter('100');
        return;
      }

      const str = count.toString().padStart(3, '0');
      const chs = str.split('');
      // Units digit always scrambles; tens occasionally
      chs[2] = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] ?? str[2]!;
      if (Math.random() < 0.35) {
        chs[1] = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] ?? str[1]!;
      }
      setCounter(chs.join(''));

      timerId = setTimeout(tick, 42);
    };

    timerId = setTimeout(tick, 42);
    return () => clearTimeout(timerId);
  }, [started, duration]);

  /* ── Lifecycle ── */
  useEffect(() => {
    setStarted(true);
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setVisible(false), 600);
    }, duration);
    return () => clearTimeout(fadeTimer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9998] bg-[#0a0a0a] flex flex-col items-center justify-center select-none"
      style={{
        opacity: fadeOut ? 0 : 1,
        transform: fadeOut ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)',
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      {/* ── AM monogram ── */}
      <div
        className="font-black text-white font-mono leading-none"
        style={{
          fontSize: 'clamp(5rem, 14vw, 9rem)',
          letterSpacing: '-0.04em',
          minWidth: '2ch',
          textAlign: 'center',
        }}
      >
        {amDisplay || '\u00a0\u00a0'}
      </div>

      {/* ── Counter ── */}
      <div
        className="font-mono font-bold text-[#ff7300] mt-5 tabular-nums"
        style={{
          fontSize: 'clamp(0.85rem, 2.2vw, 1.15rem)',
          letterSpacing: '0.18em',
        }}
      >
        {counterDisplay}
      </div>

      {/* ── Studio name — delayed dissolve ── */}
      <p
        className="font-mono text-white/30 text-[10px] tracking-[0.32em] uppercase mt-4 m-0"
        style={{ minHeight: '1em' }}
      >
        {subtitleDisplay || '\u00a0'.repeat(13)}
      </p>
    </div>
  );
}
