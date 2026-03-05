'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import type { Language } from '@/types/language';
import { AppStorage } from '@/lib/storage';

interface HeaderProps {
  lang: string;
}

export default function Header({ lang }: HeaderProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero');

  useEffect(() => {
    const sections = ['hero', 'about', 'services', 'work', 'process', 'faq', 'contact'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i] ?? '');
        if (el && el.offsetTop <= scrollPosition) {
          setCurrentSection(sections[i] ?? 'hero');
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLang: Language = locale === 'en' ? 'hu' : 'en';
    AppStorage.setLanguage(newLang);
    const newPath = pathname.replace(`/${locale}`, `/${newLang}`);
    router.push(newPath);
  }, [locale, pathname, router]);

  const navItems = [
    { id: 'about', label: t('nav.about') },
    { id: 'services', label: t('nav.services') },
    { id: 'work', label: t('nav.work') },
    { id: 'process', label: t('nav.process') },
    { id: 'faq', label: t('nav.faq') },
    { id: 'contact', label: t('nav.contact') },
  ];

  const langLabel = locale === 'en' ? 'EN' : 'HU';
  const altLang = locale === 'en' ? 'Hungarian' : 'English';

  return (
    <>
      <header
        className="sticky top-0 left-0 right-0 z-50 h-16"
        role="banner"
        style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #ff7300 30%, #ff7300 70%, transparent)' }} aria-hidden="true" />

        <div className="h-full w-full px-5 sm:px-8 lg:px-10 flex items-center justify-between">

          {/* Brand */}
          <Link
            href={`/${lang}`}
            aria-label={t('nav.home')}
            onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}
            className="flex-shrink-0 flex items-center gap-3 group"
          >
            <span
              className="font-black text-white leading-none tracking-tighter transition-colors duration-200 group-hover:text-white/80"
              style={{ fontSize: '1.6rem', letterSpacing: '-0.05em' }}
            >
              AM
            </span>
            <span
              className="hidden sm:block text-[10px] tracking-[0.22em] uppercase font-medium"
              style={{ color: 'rgba(255,255,255,0.35)', paddingLeft: '0.5rem', borderLeft: '1px solid rgba(255,255,255,0.12)', lineHeight: 1 }}
            >
              {t('brand.tagline')}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            <nav aria-label="Main navigation">
              <ul className="flex items-center list-none m-0 p-0">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="relative px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 group"
                      style={{ color: currentSection === item.id ? '#fff' : 'rgba(255,255,255,0.5)' }}
                      aria-current={currentSection === item.id ? 'page' : undefined}
                    >
                      {item.label}
                      {/* Orange dot for active */}
                      {currentSection === item.id && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ backgroundColor: '#ff7300' }} aria-hidden="true" />
                      )}
                      {/* Hover underline */}
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-px w-0 group-hover:w-4/5 transition-all duration-300" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="w-px h-5 mx-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} aria-hidden="true" />

            <button
              onClick={toggleLanguage}
              className="text-[10px] font-bold tracking-[0.18em] uppercase transition-all duration-200 px-3 py-1.5"
              style={{ color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '2px' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#fff'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.35)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
              aria-label={`Switch language to ${altLang}`}
            >
              {langLabel}
            </button>
          </div>

          {/* Mobile */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1.5 min-h-[44px] transition-colors duration-200"
              style={{ color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '2px' }}
              aria-label={`Switch to ${altLang}`}
            >
              {langLabel}
            </button>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="flex flex-col justify-center items-center gap-1.5 p-3 min-w-[44px] min-h-[44px] group"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <>
                  <span className="block w-5 h-px transition-colors duration-200" style={{ backgroundColor: 'rgba(255,255,255,0.7)' }} />
                  <span className="block w-3 h-px transition-colors duration-200" style={{ backgroundColor: 'rgba(255,255,255,0.4)' }} />
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute top-16 left-0 right-0 border-b"
            style={{ background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <nav className="px-5 py-4" aria-label="Mobile navigation">
              <ul className="flex flex-col list-none m-0 p-0">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="w-full text-left py-4 px-0 min-h-[48px] flex items-center justify-between border-b transition-colors duration-150"
                      style={{
                        color: currentSection === item.id ? '#fff' : 'rgba(255,255,255,0.5)',
                        borderColor: 'rgba(255,255,255,0.05)',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                      }}
                      aria-current={currentSection === item.id ? 'page' : undefined}
                    >
                      {item.label}
                      {currentSection === item.id && (
                        <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: '#ff7300' }} aria-hidden="true" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
