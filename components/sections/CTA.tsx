'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { contactFormRateLimiter } from '@/lib/rateLimiter';
import { sanitizeContactForm, getFieldError, type ContactFormData } from '@/lib/sanitizer';
import type { CtaProps } from '@/types/sections';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error' | 'rateLimit';
type FieldErrors = Partial<Record<keyof ContactFormData | 'gdpr' | 'general', string>>;

const INITIAL_FORM: ContactFormData = { name: '', email: '', message: '' };

const NEON = '#ff7300';

export default function CTA({ visibleSections }: CtaProps) {
  const t = useTranslations('cta');
  const locale = useLocale();
  const isVisible = visibleSections.has('contact') ?? true;

  const [formData, setFormData]     = useState<ContactFormData>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [gdprConsent, setGdprConsent] = useState(false);
  const [status, setStatus]           = useState<FormStatus>('idle');

  const isDisabled = status === 'submitting' || status === 'success';

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof ContactFormData];
        return next;
      });
      if (status === 'error' || status === 'rateLimit') setStatus('idle');
    },
    [status]
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = getFieldError(name as keyof ContactFormData, value);
    if (error) setFieldErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!gdprConsent) {
        setStatus('error');
        setFieldErrors({ gdpr: t('form.privacyRequired') });
        return;
      }

      if (!contactFormRateLimiter.canSubmit()) {
        setStatus('rateLimit');
        setFieldErrors({
          general: `${t('form.rateLimited')} ${contactFormRateLimiter.getTimeUntilNextAttemptFormatted()}.`,
        });
        return;
      }

      const { sanitized, errors, isValid } = sanitizeContactForm(formData);
      if (!isValid) {
        setStatus('error');
        setFieldErrors(errors as FieldErrors);
        return;
      }

      setStatus('submitting');
      contactFormRateLimiter.recordAttempt();

      try {
        await new Promise<void>((resolve, reject) =>
          setTimeout(() => (Math.random() > 0.05 ? resolve() : reject(new Error('Network error'))), 1500)
        );
        setStatus('success');
        setTimeout(() => {
          setFormData(INITIAL_FORM);
          setGdprConsent(false);
          setStatus('idle');
        }, 3000);
        if (process.env.NODE_ENV === 'development') console.log('[CTA] submitted:', sanitized);
      } catch {
        setStatus('error');
      }
    },
    [gdprConsent, formData, t]
  );

  return (
    <section
      id="contact"
      data-section
      className="relative bg-[#0a0a0a] w-full overflow-hidden"
    >
      {/* Top meta bar */}
      <div
        className={`border-b border-white/[0.07] px-6 md:px-12 lg:px-16 py-5 transition-all duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="text-[10px] tracking-[0.3em] text-white/35 uppercase">
          IDX / AM — CAT — 5.01 — CONTACT
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[85vh]">

        {/* ── LEFT: editorial headline + contact info ─────────────── */}
        <div
          className="relative flex flex-col justify-between px-6 md:px-12 lg:px-16 py-14 lg:py-20 border-r-0 lg:border-r border-white/[0.07]"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'none' : 'translateY(24px)',
            transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s',
          }}
        >
          {/* Big headline */}
          <div>
            <span className="text-[10px] tracking-[0.25em] text-[#ff7300] uppercase block mb-6">
              STUDY — 05.01 / GET IN TOUCH
            </span>
            <h2
              className="font-black text-white uppercase leading-[0.88] tracking-[-0.03em] mb-10"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 9rem)' }}
            >
              {locale === 'hu' ? (
                <>LÉPJÜNK<br />KAPCSOLATBA</>
              ) : (
                <>LET&apos;S<br />TALK.</>
              )}
            </h2>

            {/* Vertical accent line + statement */}
            <div className="flex gap-5 mb-12">
              <div className="w-[2px] flex-shrink-0 bg-[#ff7300]" />
              <p className="text-white/60 text-base md:text-lg leading-relaxed">
                {t('rightDescription')}
              </p>
            </div>
          </div>

          {/* Contact info block */}
          <div className="space-y-6">
            <div className="w-full h-px bg-white/[0.07] mb-8" />

            <div>
              <span className="text-[9px] tracking-[0.3em] text-white/30 uppercase block mb-2">EMAIL</span>
              <a
                href="mailto:info@avelonmotion.com"
                className="text-white font-semibold text-lg hover:text-[#ff7300] transition-colors duration-300"
              >
                info@avelonmotion.com
              </a>
            </div>

            <div>
              <span className="text-[9px] tracking-[0.3em] text-white/30 uppercase block mb-2">LOCATION</span>
              <p className="text-white/70 text-base">Budapest, Hungary</p>
            </div>

            <div className="flex gap-5 pt-2">
              {([
                { label: 'IG', href: 'https://instagram.com/avelonmotion' },
                { label: 'YT', href: 'https://youtube.com/avelonmotion' },
                { label: 'LI', href: 'https://www.linkedin.com/company/avelonmotion' },
              ] as const).map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold tracking-widest text-white/40 hover:text-white transition-colors duration-200"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: form ──────────────────────────────────────────── */}
        <div
          className="flex flex-col justify-center px-6 md:px-12 lg:px-16 py-14 lg:py-20"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'none' : 'translateY(24px)',
            transition: 'opacity 0.8s ease 0.25s, transform 0.8s ease 0.25s',
          }}
        >
          <form onSubmit={handleSubmit} noValidate className="w-full">

            {/* Name */}
            <UnderlineField
              id="name"
              name="name"
              type="text"
              label={locale === 'hu' ? 'Neved *' : 'Your name *'}
              placeholder={t('namePlaceholder')}
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={fieldErrors.name}
              disabled={isDisabled}
            />

            {/* Email */}
            <UnderlineField
              id="email"
              name="email"
              type="email"
              label="E-mail *"
              placeholder={t('emailPlaceholder')}
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={fieldErrors.email}
              disabled={isDisabled}
            />

            {/* Message */}
            <UnderlineField
              id="message"
              name="message"
              type="textarea"
              label={locale === 'hu' ? 'Üzenet' : 'Message'}
              placeholder={t('messagePlaceholder')}
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              error={fieldErrors.message}
              disabled={isDisabled}
              rows={5}
            />

            {/* GDPR */}
            <label className={`flex items-start gap-3 mb-8 cursor-pointer group ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {/* Custom checkbox */}
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={gdprConsent}
                  onChange={(e) => {
                    setGdprConsent(e.target.checked);
                    if (fieldErrors.gdpr) setFieldErrors((p) => { const n = { ...p }; delete n.gdpr; return n; });
                  }}
                  disabled={isDisabled}
                  className="sr-only"
                  aria-invalid={!!fieldErrors.gdpr}
                />
                <div
                  className="w-4 h-4 border border-white/30 flex items-center justify-center transition-colors duration-200 group-hover:border-white/60"
                  style={{ backgroundColor: gdprConsent ? NEON : 'transparent', borderColor: gdprConsent ? NEON : undefined }}
                >
                  {gdprConsent && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
                      <path d="M1 4l3 3 5-6" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-[11px] text-white/40 leading-relaxed">
                {locale === 'hu'
                  ? 'Elfogadom az Adatvédelmi Szabályzatot és hozzájárulok, hogy az Avelon Motion kapcsolatba lépjen velem.'
                  : 'I agree to the '}
                {locale !== 'hu' && (
                  <Link href={`/${locale}/privacy-policy`} className="text-white/60 underline hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                )}
                {locale !== 'hu' && ' and consent to Avelon Motion contacting me.'}
              </span>
            </label>

            {/* Feedback alerts */}
            {status === 'success' && (
              <div className="mb-6 border border-green-500/30 bg-green-500/5 px-4 py-3" role="alert">
                <p className="text-green-400 text-sm">{t('successMessage')}</p>
              </div>
            )}
            {(status === 'error' || status === 'rateLimit') && (fieldErrors.general ?? fieldErrors.gdpr) && (
              <div className="mb-6 border border-red-500/30 bg-red-500/5 px-4 py-3" role="alert">
                <p className="text-red-400 text-sm">{fieldErrors.gdpr ?? fieldErrors.general}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isDisabled}
              className="group relative w-full flex items-center justify-between px-7 py-5 font-black text-sm tracking-[0.2em] uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              style={{ backgroundColor: NEON, color: '#000' }}
            >
              {/* Hover fill */}
              <div
                className="absolute inset-0 bg-white transition-transform duration-400 origin-left"
                style={{ transform: 'scaleX(0)', transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scaleX(1)')}
              />
              <span className="relative z-10">
                {status === 'submitting'
                  ? t('buttonLoading')
                  : status === 'success'
                  ? t('buttonSuccess')
                  : t('buttonText')}
              </span>
              <span className="relative z-10 text-base">
                {status === 'submitting' ? '…' : status === 'success' ? '✓' : '→'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ─── Underline input / textarea ──────────────────────────────────── */
interface UnderlineFieldProps {
  id: string;
  name: string;
  type: 'text' | 'email' | 'textarea';
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  disabled?: boolean;
  rows?: number;
}

function UnderlineField({
  id, name, type, label, placeholder, value, onChange, onBlur, error, disabled, rows = 4,
}: UnderlineFieldProps) {
  const [focused, setFocused] = useState(false);

  const baseClass =
    'w-full bg-transparent text-white text-base md:text-lg placeholder-white/20 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed py-3 transition-colors duration-200';

  const lineColor = error
    ? 'bg-red-500'
    : focused
    ? 'bg-[#ff7300]'
    : 'bg-white/15';

  return (
    <div className="mb-8">
      <label htmlFor={id} className="block text-[9px] tracking-[0.3em] text-white/35 uppercase mb-3">
        {label}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={(e) => { setFocused(false); onBlur(e); }}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={`${baseClass} resize-none`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={(e) => { setFocused(false); onBlur(e); }}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={baseClass}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}

      {/* Underline */}
      <div className="relative h-px w-full bg-white/10">
        <div
          className={`absolute left-0 top-0 h-full transition-all duration-400 ${lineColor}`}
          style={{ width: focused ? '100%' : error ? '100%' : '0%' }}
        />
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-2 text-red-400 text-xs tracking-wide">
          {error}
        </p>
      )}
    </div>
  );
}
