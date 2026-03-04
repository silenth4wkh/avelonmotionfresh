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
        className="sticky top-0 left-0 right-0 z-50 h-14 border-b border-white/10 bg-black/80 backdrop-blur-md"
        role="banner"
      >
        <div className="h-full w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand */}
          <div className="flex-shrink-0 flex items-center gap-2 sm:gap-3">
            <Link
              href={`/${lang}`}
              aria-label={t('nav.home')}
              onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}
            >
              <span className="text-2xl sm:text-3xl tracking-tight text-white hover:text-white/70 transition-colors font-black leading-none block">
                AVELON MOTION
              </span>
            </Link>
            <span className="hidden sm:inline-block text-xs text-white/60 tracking-wider uppercase">
              | {t('brand.tagline')}
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            <nav aria-label="Main navigation">
              <ul className="flex items-center gap-8 list-none m-0 p-0">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`text-sm font-medium transition-all duration-200 relative group ${
                        currentSection === item.id ? 'text-white' : 'text-white/80 hover:text-white'
                      }`}
                      aria-current={currentSection === item.id ? 'page' : undefined}
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-200 group-hover:w-full" />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <button
              onClick={toggleLanguage}
              className="text-white/80 hover:text-white text-sm font-medium px-4 py-2.5 min-h-[44px] border border-white/20 hover:border-white/40 rounded transition-colors"
              aria-label={`Switch language to ${altLang}`}
            >
              {langLabel}
            </button>
          </div>

          {/* Mobile */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="text-white/80 hover:text-white text-sm font-medium px-3 py-2 min-h-[44px] border border-white/20 hover:border-white/40 rounded transition-colors"
              aria-label={`Switch to ${altLang}`}
            >
              {langLabel}
            </button>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="text-white/80 hover:text-white p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
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
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute top-14 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/10">
            <nav className="px-4 py-6" aria-label="Mobile navigation">
              <ul className="flex flex-col space-y-1 list-none m-0 p-0">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left text-base font-medium py-4 px-2 min-h-[48px] flex items-center border-b border-white/5 last:border-0 transition-colors ${
                        currentSection === item.id ? 'text-white' : 'text-white/80 hover:text-white'
                      }`}
                      aria-current={currentSection === item.id ? 'page' : undefined}
                    >
                      {item.label}
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
