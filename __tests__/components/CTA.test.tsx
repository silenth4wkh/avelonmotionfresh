import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CTA from '@/components/sections/CTA';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      'brandName': 'AVELON MOTION',
      'headingBold': 'project',
      'headingLight': 'in mind?',
      'namePlaceholder': 'John Doe',
      'emailPlaceholder': 'info@avelonmotion.com',
      'messagePlaceholder': 'Your message',
      'buttonText': 'Send Message',
      'legal': 'By submitting, you agree to our',
      'privacyPolicy': 'Privacy Policy',
      'rightHeading': "Let's talk.",
      'rightDescription': 'Tell us about your project',
      'quickResponse.title': 'Quick response',
      'quickResponse.description': 'Fast reply',
      'clearSteps.title': 'Clear next steps',
      'clearSteps.description': 'Detailed plan',
      'form.privacyRequired': 'Please accept the privacy policy to continue.',
      'form.rateLimited': 'Too many attempts. Please try again in',
    };
    return map[key] ?? key;
  },
  useLocale: () => 'en',
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/lib/rateLimiter', () => ({
  contactFormRateLimiter: {
    canSubmit: vi.fn(() => true),
    recordAttempt: vi.fn(),
    getTimeUntilNextAttemptFormatted: vi.fn(() => '15 minutes'),
  },
}));

import { contactFormRateLimiter } from '@/lib/rateLimiter';

const VISIBLE = new Set(['contact']);

describe('CTA', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(contactFormRateLimiter.canSubmit).mockReturnValue(true);
  });

  it('renders form fields', () => {
    render(<CTA visibleSections={VISIBLE} />);
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<CTA visibleSections={VISIBLE} />);
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('blocks submission without GDPR consent', async () => {
    render(<CTA visibleSections={VISIBLE} />);

    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'This is a valid message for testing.' } });

    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(contactFormRateLimiter.recordAttempt).not.toHaveBeenCalled();
  });

  it('blocks submission when rate limited', async () => {
    vi.mocked(contactFormRateLimiter.canSubmit).mockReturnValue(false);

    render(<CTA visibleSections={VISIBLE} />);

    const gdprCheckbox = screen.getByRole('checkbox');
    fireEvent.click(gdprCheckbox);

    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<CTA visibleSections={VISIBLE} />);

    const emailInput = screen.getByLabelText(/e-mail/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });
});
