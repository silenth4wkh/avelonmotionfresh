'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { contactFormRateLimiter } from '@/lib/rateLimiter';
import { sanitizeContactForm, getFieldError, type ContactFormData } from '@/lib/sanitizer';
import type { CtaProps } from '@/types/sections';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error' | 'rateLimit';
type FieldErrors = Partial<Record<keyof ContactFormData | 'gdpr' | 'general', string>>;

const INITIAL_FORM: ContactFormData = { name: '', email: '', message: '' };

export default function CTA({ visibleSections }: CtaProps) {
  const t = useTranslations('cta');
  const locale = useLocale();
  const isVisible = visibleSections.has('contact') ?? true;

  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [gdprConsent, setGdprConsent] = useState(false);
  const [status, setStatus] = useState<FormStatus>('idle');

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

        if (process.env.NODE_ENV === 'development') {
          console.log('[CTA] Form submitted:', sanitized);
        }
      } catch {
        setStatus('error');
      }
    },
    [gdprConsent, formData]
  );

  const inputClass = (field: keyof ContactFormData) =>
    `w-full p-4 rounded-lg border-2 bg-black/20 text-white placeholder-white/40 focus:outline-none focus:border-secondary-400 focus:bg-black/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)] focus:translate-y-[-2px] ${
      fieldErrors[field] ? 'border-red-500' : 'border-white/20'
    }`;

  return (
    <section
      id="contact"
      data-section
      className={`relative py-20 bg-primary-800 transition-all duration-1000 w-full ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Film grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-0"
        style={{ backgroundImage: 'url(/noise.svg)', backgroundRepeat: 'repeat', backgroundSize: '300px 300px' }}
        aria-hidden="true"
      />
      
      <div className="w-full max-w-none grid lg:grid-cols-2 gap-12 items-start px-6 md:px-10 lg:px-16 xl:px-24 relative z-10">
        {/* Left – Form */}
        <div
          className={`transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}
        >
          <p className="text-2xl font-light text-white mb-4">{t('brandName')}</p>
          <h2
            className="text-5xl md:text-6xl font-light text-white leading-tight mb-8"
            style={{ fontSize: 'clamp(2.25rem, 4.8vw, 4.8rem)' }}
          >
            <span className="font-light">{t('headingBold')} </span>
            <span className="font-bold">{t('headingLight')}</span>
          </h2>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">
                {locale === 'hu' ? 'Neved' : 'Your name'} *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t('namePlaceholder')}
                required
                disabled={isDisabled}
                className={inputClass('name')}
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? 'name-error' : undefined}
              />
              {fieldErrors.name && (
                <p id="name-error" className="mt-1 text-red-400 text-xs">{fieldErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                E-mail *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t('emailPlaceholder')}
                required
                disabled={isDisabled}
                className={inputClass('email')}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              />
              {fieldErrors.email && (
                <p id="email-error" className="mt-1 text-red-400 text-xs">{fieldErrors.email}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-2">
                {locale === 'hu' ? 'Üzenet' : 'Message'}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t('messagePlaceholder')}
                rows={6}
                disabled={isDisabled}
                className={`${inputClass('message')} resize-none`}
                aria-invalid={!!fieldErrors.message}
                aria-describedby={fieldErrors.message ? 'message-error' : undefined}
              />
              {fieldErrors.message && (
                <p id="message-error" className="mt-1 text-red-400 text-xs">{fieldErrors.message}</p>
              )}
            </div>

            {/* Feedback */}
            {status === 'success' && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30" role="alert">
                <p className="text-green-400 text-sm font-medium">{t('successMessage')}</p>
              </div>
            )}
            {(status === 'error' || status === 'rateLimit') && (fieldErrors.general || fieldErrors.gdpr) && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30" role="alert">
                <p className="text-red-400 text-sm font-medium">
                  {fieldErrors.gdpr ?? fieldErrors.general ?? t('errorMessage')}
                </p>
              </div>
            )}

            {/* Submit */}
            <PrimaryButton
              type="submit"
              disabled={isDisabled}
              isLoading={status === 'submitting'}
              loadingText={t('buttonLoading')}
              size="lg"
              className="w-full"
            >
              {status === 'success' ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('buttonSuccess')}
                </>
              ) : (
                t('buttonText')
              )}
            </PrimaryButton>

            {/* Legal */}
            <p className="text-xs text-white/50 text-center">
              {t('legal')}{' '}
              <Link href={`/${locale}/privacy-policy`} className="text-white/70 underline hover:text-white transition-colors">
                {t('privacyPolicy')}
              </Link>
              .
            </p>

            {/* GDPR */}
            <label className={`flex items-start gap-3 text-sm text-white/70 cursor-pointer ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <input
                type="checkbox"
                checked={gdprConsent}
                onChange={(e) => {
                  setGdprConsent(e.target.checked);
                  if (fieldErrors.gdpr) setFieldErrors((p) => { const n = { ...p }; delete n.gdpr; return n; });
                }}
                disabled={isDisabled}
                className="mt-1 w-4 h-4 accent-secondary-400 cursor-pointer disabled:cursor-not-allowed"
                aria-invalid={!!fieldErrors.gdpr}
              />
              <span>
                {locale === 'hu'
                  ? 'Elfogadom az Adatvédelmi Szabályzatot és hozzájárulok, hogy az Avelon Motion kapcsolatba lépjen velem.'
                  : 'I agree to the Privacy Policy and consent to Avelon Motion contacting me about my inquiry.'}
              </span>
            </label>
          </form>
        </div>

        {/* Right – Info */}
        <div
          className={`text-white space-y-12 transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}
        >
          <div>
            <h2
              className="text-5xl md:text-6xl font-light mb-6 leading-tight"
              style={{ fontSize: 'clamp(2.25rem, 4.8vw, 4.8rem)' }}
            >
              {t('rightHeading')}
            </h2>
            <p className="text-lg text-white/80 leading-relaxed">{t('rightDescription')}</p>
          </div>

          <div className="space-y-8">
            {(['quickResponse', 'clearSteps'] as const).map((key) => (
              <div key={key} className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-secondary-500 mt-2 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{t(`${key}.title`)}</h3>
                  <p className="text-white/70 leading-relaxed">{t(`${key}.description`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
