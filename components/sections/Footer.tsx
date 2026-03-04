'use client';

import Link from 'next/link';
import { Mail, Instagram, Linkedin, Youtube, Twitter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { FooterProps } from '@/types/sections';

const SECTION_LINKS: Record<string, string> = {
  'AI Video Production': '#services',
  'Visual Design': '#services',
  'Digital Experience': '#services',
  'Brand Identity': '#services',
  'MI Videó Produkció': '#services',
  'Vizuális Tervezés': '#services',
  'Digitális Élmény': '#services',
  'Márka Identitás': '#services',
  'About Us': '#about',
  'Our Process': '#process',
  'Portfolio': '#work',
  'Contact': '#contact',
  'Rólunk': '#about',
  'Folyamatunk': '#process',
  'Portfólió': '#work',
  'Kapcsolat': '#contact',
};

const SOCIAL_LINKS = [
  { Icon: Instagram, href: 'https://instagram.com/avelonmotion', label: 'Instagram' },
  { Icon: Linkedin, href: 'https://www.linkedin.com/company/avelonmotion', label: 'LinkedIn' },
  { Icon: Youtube, href: 'https://youtube.com/avelonmotion', label: 'YouTube' },
  { Icon: Twitter, href: 'https://twitter.com/avelonmotion', label: 'Twitter / X' },
] as const;

export default function Footer({ lang }: FooterProps) {
  const t = useTranslations('footer');

  const serviceList = [
    t('links.service1'),
    t('links.service2'),
    t('links.service3'),
    t('links.service4'),
  ];
  const companyList = [
    t('links.about'),
    t('links.process'),
    t('links.work'),
    t('links.contact'),
  ];

  return (
    <footer className="relative py-16 bg-black border-t border-white/5 w-full">
      {/* Film grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay z-0"
        style={{ backgroundImage: 'url(/noise.svg)', backgroundRepeat: 'repeat', backgroundSize: '300px 300px' }}
        aria-hidden="true"
      />
      
      <div className="w-full max-w-none px-6 md:px-10 lg:px-16 xl:px-24 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-black text-white mb-4 tracking-tight">
              AVELON MOTION
            </h3>
            <p className="text-base text-white/70 leading-relaxed mb-6">
              {t('tagline')}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary-400 flex-shrink-0" aria-hidden="true" />
                <a
                  href="mailto:info@avelonmotion.com"
                  className="text-white hover:text-secondary-400 transition-colors"
                >
                  info@avelonmotion.com
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{t('servicesLabel')}</h4>
            <ul className="space-y-2">
              {serviceList.map((service, i) => (
                <li key={i}>
                  <Link
                    href={`/${lang}#services`}
                    className="text-neutral-400 hover:text-secondary-400 transition-colors duration-200"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Nav */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{t('companyLabel')}</h4>
            <ul className="space-y-2">
              {companyList.map((item, i) => (
                <li key={i}>
                  <Link
                    href={`/${lang}${SECTION_LINKS[item] ?? '#contact'}`}
                    className="text-neutral-400 hover:text-secondary-400 transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={`/${lang}/privacy-policy`}
                  className="text-neutral-400 hover:text-secondary-400 transition-colors duration-200"
                >
                  {t('links.privacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-400">{t('copyright', { year: new Date().getFullYear() })}</p>

            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-400 mr-2">{t('followUs')}:</span>
              {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-secondary-400 transition-all duration-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-110 hover:-translate-y-1"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
