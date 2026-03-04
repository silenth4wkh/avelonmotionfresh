'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { AppStorage } from '@/lib/storage';

type ConsentPrefs = { analytics: boolean; marketing: boolean };

export default function CookieConsent() {
  const t = useTranslations('cookies');
  const locale = useLocale();
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [prefs, setPrefs] = useState<ConsentPrefs>({ analytics: false, marketing: false });

  useEffect(() => {
    const stored = AppStorage.getCookieConsent();
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    AppStorage.setCookieConsent({ essential: true, analytics: true, marketing: true });
    setVisible(false);
  };

  const reject = () => {
    AppStorage.setCookieConsent({ essential: true, analytics: false, marketing: false });
    setVisible(false);
  };

  const save = () => {
    AppStorage.setCookieConsent({ essential: true, ...prefs });
    setVisible(false);
    setShowSettings(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 left-6 right-6 z-[9999] max-w-[480px] bg-neutral-800 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-title"
    >
      <div className="flex justify-between items-start mb-3">
        <h2 id="cookie-title" className="text-white font-bold text-base m-0">
          🍪 {t('title')}
        </h2>
        <button
          onClick={reject}
          className="bg-transparent border-none text-white/50 cursor-pointer text-xl leading-none p-1 hover:text-white/80"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {!showSettings ? (
        <>
          <p className="text-white/65 text-sm leading-relaxed mb-4">
            {t('description')}{' '}
            <Link href={`/${locale}/privacy-policy`} className="text-orange-500 underline text-inherit">
              {t('learnMore')}
            </Link>
          </p>
          <div className="flex gap-3 flex-wrap">
            <button
              className="flex-1 px-4 py-2.5 bg-orange-600 text-white border-none rounded-lg text-sm font-bold min-h-[40px] hover:bg-orange-500 transition-colors"
              onClick={accept}
            >
              {t('acceptAll')}
            </button>
            <button
              className="flex-1 px-4 py-2.5 bg-white/5 text-white/80 border border-white/10 rounded-lg text-sm font-medium min-h-[40px] hover:bg-white/10 transition-colors"
              onClick={reject}
            >
              {t('rejectOptional')}
            </button>
            <button
              className="px-4 py-2.5 bg-white/5 text-white/80 border border-white/10 rounded-lg text-sm font-medium min-h-[40px] hover:bg-white/10 transition-colors"
              onClick={() => setShowSettings(true)}
            >
              {t('settings')}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-semibold text-sm m-0 mb-0.5">{t('essential')}</p>
                <p className="text-white/50 text-xs m-0">{t('essentialDesc')}</p>
              </div>
              <span className="text-emerald-500 text-xs font-semibold">{t('required')}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-semibold text-sm m-0 mb-0.5">{t('analytics')}</p>
                <p className="text-white/50 text-xs m-0">{t('analyticsDesc')}</p>
              </div>
              <button
                onClick={() => setPrefs((p) => ({ ...p, analytics: !p.analytics }))}
                className="relative inline-block w-9 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0"
                style={{ backgroundColor: prefs.analytics ? '#ea580c' : 'rgba(255,255,255,0.15)' }}
                role="switch"
                aria-checked={prefs.analytics}
                aria-label={t('analytics')}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-left"
                  style={{ left: prefs.analytics ? '18px' : '2px' }}
                />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-semibold text-sm m-0 mb-0.5">{t('marketing')}</p>
                <p className="text-white/50 text-xs m-0">{t('marketingDesc')}</p>
              </div>
              <button
                onClick={() => setPrefs((p) => ({ ...p, marketing: !p.marketing }))}
                className="relative inline-block w-9 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0"
                style={{ backgroundColor: prefs.marketing ? '#ea580c' : 'rgba(255,255,255,0.15)' }}
                role="switch"
                aria-checked={prefs.marketing}
                aria-label={t('marketing')}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-left"
                  style={{ left: prefs.marketing ? '18px' : '2px' }}
                />
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 px-4 py-2.5 bg-orange-600 text-white border-none rounded-lg text-sm font-bold min-h-[40px] hover:bg-orange-500" onClick={save}>
              {t('saveSettings')}
            </button>
            <button className="flex-1 px-4 py-2.5 bg-white/5 text-white/80 border border-white/10 rounded-lg text-sm font-medium min-h-[40px] hover:bg-white/10" onClick={() => setShowSettings(false)}>
              {t('back')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
