'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { FooterProps } from '@/types/sections';

const NEON = '#ff7300';

const TOP_NAV = [
  { label: 'WORK',     href: '#work'     },
  { label: 'ABOUT',    href: '#about'    },
  { label: 'SERVICES', href: '#services' },
  { label: 'PROCESS',  href: '#process'  },
  { label: 'CONTACT',  href: '#contact'  },
];

const PAGE_LINKS = [
  { label: 'HOME',           href: '#'              },
  { label: 'WORK',           href: '#work'          },
  { label: 'ABOUT',          href: '#about'         },
  { label: 'HOW WE WORK',    href: '#process'       },
  { label: 'CONTACT',        href: '#contact'       },
  { label: 'PRIVACY POLICY', href: '/privacy-policy'},
];

const SOCIAL_LINKS = [
  { label: 'INSTAGRAM', href: 'https://instagram.com/avelonmotion'                   },
  { label: 'YOUTUBE',   href: 'https://youtube.com/avelonmotion'                     },
  { label: 'LINKEDIN',  href: 'https://www.linkedin.com/company/avelonmotion'        },
  { label: 'X (TWITTER)', href: 'https://twitter.com/avelonmotion'                   },
  { label: 'VIMEO',     href: 'https://vimeo.com/avelonmotion'                       },
];

export default function Footer({ lang }: FooterProps) {
  const t = useTranslations('footer');
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden"
      style={{ backgroundColor: NEON }}
    >
      {/* ── Subtle scan-line texture ─────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03] z-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,#000 0px,#000 1px,transparent 1px,transparent 7px)',
        }}
      />

      {/* ── BLOCK 1: Top bar + massive headline ─────────────────── */}
      <div className="relative z-10 px-6 md:px-10 lg:px-14 pt-8 pb-0">

        {/* Top row */}
        <div
          className="flex items-center justify-between mb-8 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(-8px)' }}
        >
          <span className="text-xs font-black text-black tracking-[0.3em] uppercase select-none">
            AVELON MOTION
          </span>
          <nav className="hidden md:flex items-center gap-7">
            {TOP_NAV.map((link) => (
              <Link
                key={link.label}
                href={`/${lang}${link.href}`}
                className="text-[10px] font-bold text-black/60 tracking-[0.22em] uppercase hover:text-black transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Massive brand name — staggered reveal */}
        <div className="overflow-hidden">
          <p
            className="font-black text-black uppercase leading-[0.82] tracking-[-0.035em] whitespace-nowrap"
            style={{
              fontSize: 'clamp(3.2rem, 12.5vw, 12rem)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(48px)',
              transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s',
            }}
          >
            AVELON MOTION
          </p>
        </div>
      </div>

      {/* ── DIVIDER ─────────────────────────────────────────────── */}
      <div className="relative z-10 border-t border-black/20 mx-6 md:mx-10 lg:mx-14 mt-6" />

      {/* ── BLOCK 2: 4-column info grid ─────────────────────────── */}
      <div className="relative z-10 px-6 md:px-10 lg:px-14 py-10 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">

        {/* Col 1: Contact */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s',
          }}
        >
          <a
            href="tel:+3620000000"
            className="block text-sm font-bold text-black mb-1.5 hover:opacity-60 transition-opacity duration-200"
          >
            +36 20 000 0000
          </a>
          <a
            href="mailto:info@avelonmotion.com"
            className="block text-sm font-bold text-black hover:opacity-60 transition-opacity duration-200 break-all"
          >
            info@avelonmotion.com
          </a>
        </div>

        {/* Col 2: Address */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s',
          }}
        >
          <p className="text-[11px] font-black text-black uppercase tracking-[0.18em] mb-2">
            STUDIO AM
          </p>
          <p className="text-[11px] text-black/65 uppercase tracking-wide leading-[1.7]">
            BUDAPEST<br />HUNGARY<br />EU
          </p>
        </div>

        {/* Col 3: Nav */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease 0.45s, transform 0.7s ease 0.45s',
          }}
        >
          <ul className="flex flex-col gap-[5px]">
            {PAGE_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href.startsWith('#') ? `/${lang}${link.href}` : `/${lang}${link.href}`}
                  className="text-[11px] font-bold text-black/75 uppercase tracking-[0.18em] hover:text-black transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Social */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease 0.55s, transform 0.7s ease 0.55s',
          }}
        >
          <ul className="flex flex-col gap-[5px]">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-black/75 uppercase tracking-[0.18em] hover:text-black transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── DIVIDER ─────────────────────────────────────────────── */}
      <div className="relative z-10 border-t border-black/20 mx-6 md:mx-10 lg:mx-14" />

      {/* ── BLOCK 3: Marquee strips ──────────────────────────────
          Strip A: left → right  |  Strip B: right → left         */}
      <div className="relative z-10 overflow-hidden py-3 flex flex-col gap-2">

        {/* Strip A — left to right */}
        <div className="overflow-hidden whitespace-nowrap">
          <span
            className="marquee-left inline-block font-black text-black uppercase leading-none select-none"
            style={{ fontSize: 'clamp(3.5rem, 14vw, 11rem)', letterSpacing: '-0.03em' }}
            aria-hidden
          >
            {/* Duplicate text for seamless loop */}
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i}>
                AI VIDEO PRODUCTION&nbsp;&nbsp;·&nbsp;&nbsp;CINEMATIC CONTENT&nbsp;&nbsp;·&nbsp;&nbsp;MOTION DESIGN&nbsp;&nbsp;·&nbsp;&nbsp;BRAND FILMS&nbsp;&nbsp;·&nbsp;&nbsp;
              </span>
            ))}
          </span>
        </div>

        {/* Strip B — right to left */}
        <div className="overflow-hidden whitespace-nowrap">
          <span
            className="marquee-right inline-block font-black text-black uppercase leading-none select-none"
            style={{ fontSize: 'clamp(3.5rem, 14vw, 11rem)', letterSpacing: '-0.03em', opacity: 0.35 }}
            aria-hidden
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i}>
                3D ANIMATION&nbsp;&nbsp;·&nbsp;&nbsp;AI PHOTOGRAPHY&nbsp;&nbsp;·&nbsp;&nbsp;SOCIAL UGC&nbsp;&nbsp;·&nbsp;&nbsp;SHORT FILMS&nbsp;&nbsp;·&nbsp;&nbsp;MARKETING&nbsp;&nbsp;·&nbsp;&nbsp;
              </span>
            ))}
          </span>
        </div>
      </div>

      {/* ── BOTTOM BAR ──────────────────────────────────────────── */}
      <div
        className="relative z-10 border-t border-black/20 px-6 md:px-10 lg:px-14 py-4 flex items-center justify-between gap-4"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.6s ease 0.7s',
        }}
      >
        <p className="text-[9px] font-mono text-black/55 uppercase tracking-widest">
          © {new Date().getFullYear()} AVELON MOTION. ALL RIGHTS RESERVED.
        </p>

        {/* Scroll to top */}
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="group flex items-center gap-2 hover:opacity-70 transition-opacity duration-200"
        >
          <span className="text-black text-base leading-none block transition-transform duration-300 group-hover:-translate-y-1">
            ↑
          </span>
        </button>

        <p className="text-[9px] font-mono text-black/55 uppercase tracking-widest text-right">
          AI-POWERED PRODUCTION STUDIO
        </p>
      </div>
    </footer>
  );
}
