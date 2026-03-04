'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import type { FaqProps } from '@/types/sections';

const FAQ_COUNT = 8;
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
const SCRAMBLE_STEPS = 8;
const SCRAMBLE_MS = 40;

/* ─── Number scramble hook ──────────────────────────────────────── */
function useScramble(target: string) {
  const [display, setDisplay] = useState(target);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scramble = useCallback(() => {
    let step = 0;
    const run = () => {
      if (step >= SCRAMBLE_STEPS) { setDisplay(target); return; }
      setDisplay(
        target
          .split('')
          .map((ch) =>
            /\d/.test(ch)
              ? SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]!
              : ch
          )
          .join('')
      );
      step++;
      timerRef.current = setTimeout(run, SCRAMBLE_MS);
    };
    run();
  }, [target]);

  const cancel = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDisplay(target);
  }, [target]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return { display, scramble, cancel };
}

/* ─── Single FAQ row ────────────────────────────────────────────── */
interface RowProps {
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  revealed: boolean;
  revealDelay: number;
  onToggle: () => void;
}

function FaqRow({ index, question, answer, isOpen, revealed, revealDelay, onToggle }: RowProps) {
  const num = String(index + 1).padStart(2, '0');
  const { display, scramble, cancel } = useScramble(num);

  return (
    <div
      className={`faq-row-enter ${revealed ? 'revealed' : ''}`}
      style={{ transitionDelay: `${revealDelay}ms` }}
    >
      <div className="relative">
        {/* Active orange left bar — draws scaleY from top */}
        <div
          className="absolute left-0 top-0 w-[2px] bg-[#ff7300] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-top"
          style={{ height: '100%', transform: isOpen ? 'scaleY(1)' : 'scaleY(0)' }}
          aria-hidden
        />

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`faq-a-${index}`}
          onMouseEnter={scramble}
          onMouseLeave={cancel}
          className="group w-full text-left flex items-start gap-5 md:gap-8 px-5 md:px-8 py-7 md:py-9 focus:outline-none"
        >
          {/* Scramble number */}
          <span
            className="flex-shrink-0 font-mono text-xs md:text-sm tracking-widest tabular-nums transition-colors duration-300"
            style={{ color: isOpen ? '#ff7300' : 'rgba(255,255,255,0.22)', minWidth: '2.2ch' }}
            aria-hidden
          >
            {display}
          </span>

          {/* Question text */}
          <span
            className="flex-1 font-semibold text-lg md:text-xl lg:text-2xl leading-[1.2] transition-all duration-300"
            style={{
              color: isOpen ? '#ffffff' : 'rgba(255,255,255,0.75)',
              transform: isOpen ? 'translateX(4px)' : 'translateX(0)',
            }}
          >
            {question}
          </span>

          {/* [+] / [×] icon */}
          <span
            className="flex-shrink-0 flex items-center justify-center border border-white/20 text-white/50 font-black text-base leading-none transition-all duration-400 mt-1"
            style={{
              width: 28,
              height: 28,
              borderColor: isOpen ? '#ff7300' : undefined,
              color: isOpen ? '#ff7300' : undefined,
              transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            }}
            aria-hidden
          >
            +
          </span>
        </button>

        {/* Accordion: grid-template-rows technique */}
        <div
          id={`faq-a-${index}`}
          role="region"
          className={`faq-answer-grid ${isOpen ? 'open' : ''}`}
        >
          <div className="faq-answer-inner">
            <div className="faq-answer-text pl-[calc(2.2ch+1.25rem+2rem)] md:pl-[calc(2.2ch+2rem+2.5rem)] pr-8 pb-8">
              {/* Orange accent line */}
              <div
                className="h-px mb-5 bg-[#ff7300]/40 transition-all duration-700"
                style={{
                  transformOrigin: 'left',
                  transform: isOpen ? 'scaleX(1)' : 'scaleX(0)',
                  transitionDelay: isOpen ? '0.15s' : '0s',
                  width: '4rem',
                }}
              />
              <p className="text-white/60 text-base md:text-lg leading-relaxed">
                {answer}
              </p>
            </div>
          </div>
        </div>

        {/* Separator line — orange on active */}
        <div
          className="h-px w-full transition-colors duration-400"
          style={{ backgroundColor: isOpen ? 'rgba(255,115,0,0.25)' : 'rgba(255,255,255,0.07)' }}
        />
      </div>
    </div>
  );
}

/* ─── Main FAQ section ──────────────────────────────────────────── */
export default function FAQ({ visibleSections }: FaqProps) {
  const t = useTranslations('faq');
  const isVisible = visibleSections.has('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<boolean[]>(Array(FAQ_COUNT).fill(false));

  /* Stagger reveal rows after section becomes visible */
  useEffect(() => {
    if (!isVisible) return;
    Array.from({ length: FAQ_COUNT }).forEach((_, i) => {
      setTimeout(() => {
        setRevealed((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 80 + i * 80);
    });
  }, [isVisible]);

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section
      id="faq"
      data-section
      className="relative bg-[#0a0a0a] w-full overflow-hidden"
    >
      {/* ── Header ── */}
      <div
        className="px-5 md:px-8 py-5 border-b border-white/[0.07] flex items-center justify-between"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        <span className="text-[10px] tracking-[0.3em] text-white/35 uppercase">
          IDX / AM — CAT — 4.01 — FAQ
        </span>
        <span className="text-[10px] tracking-[0.25em] text-white/20 uppercase font-mono">
          {String(FAQ_COUNT).padStart(2, '0')} QUESTIONS
        </span>
      </div>

      {/* ── Large headline block ── */}
      <div
        className="px-5 md:px-8 py-10 md:py-14 border-b border-white/[0.07] overflow-hidden"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'none' : 'translateY(20px)',
          transition: 'opacity 0.8s ease 0.05s, transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.05s',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h2
            className="font-black text-white uppercase leading-[0.88] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(3rem, 9vw, 9.5rem)' }}
          >
            {t('headline').toUpperCase().split(/\s+/).map((word, i, arr) => (
              <span key={i} className={i < arr.length - 1 ? 'block' : 'inline-block text-[#ff7300]'}>
                {word}{i < arr.length - 1 ? '' : '?'}
              </span>
            ))}
          </h2>

          {/* Right meta */}
          <div
            className="flex-shrink-0 md:pb-3"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'none' : 'translateY(12px)',
              transition: 'opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s',
            }}
          >
            <p className="text-white/45 text-sm max-w-[22rem] leading-relaxed">
              {t('subheadline') ?? 'Everything you need to know about our process, pricing, and deliverables.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Accordion rows ── */}
      <div>
        {Array.from({ length: FAQ_COUNT }).map((_, i) => (
          <FaqRow
            key={i}
            index={i}
            question={t(`q${i + 1}.question`)}
            answer={t(`q${i + 1}.answer`)}
            isOpen={openIndex === i}
            revealed={revealed[i] ?? false}
            revealDelay={0}
            onToggle={() => toggle(i)}
          />
        ))}
      </div>
    </section>
  );
}
