import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CookieConsent from '@/components/CookieConsent';

vi.mock('@/lib/storage', () => ({
  AppStorage: {
    getCookieConsent: vi.fn(() => null),
    setCookieConsent: vi.fn(),
  },
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      'title': 'Cookie Settings',
      'description': 'We use cookies.',
      'learnMore': 'Learn more',
      'acceptAll': 'Accept All',
      'rejectOptional': 'Reject Optional',
      'settings': 'Settings',
      'saveSettings': 'Save Settings',
      'back': 'Back',
      'essential': 'Essential Cookies',
      'essentialDesc': 'Required for the website.',
      'analytics': 'Analytics Cookies',
      'analyticsDesc': 'Help us understand visitors.',
      'marketing': 'Marketing Cookies',
      'marketingDesc': 'Used for ads.',
      'required': 'Required',
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

import { AppStorage } from '@/lib/storage';

const mockedGetConsent = vi.mocked(AppStorage.getCookieConsent);

describe('CookieConsent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockedGetConsent.mockReturnValue(null);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not render initially (waits 1500ms)', () => {
    render(<CookieConsent />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders banner after 1500ms when no consent', () => {
    render(<CookieConsent />);
    vi.advanceTimersByTime(1600);
    expect(screen.getAllByRole('dialog').length).toBeGreaterThan(0);
  });

  it('does not render when consent already given', () => {
    mockedGetConsent.mockReturnValue('all');
    render(<CookieConsent />);
    vi.advanceTimersByTime(1600);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('hides banner when "Accept All" is clicked', () => {
    render(<CookieConsent />);
    vi.advanceTimersByTime(1600);
    fireEvent.click(screen.getByText('Accept All'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(AppStorage.setCookieConsent).toHaveBeenCalledWith({
      essential: true,
      analytics: true,
      marketing: true,
    });
  });

  it('hides banner when "Reject Optional" is clicked', () => {
    render(<CookieConsent />);
    vi.advanceTimersByTime(1600);
    fireEvent.click(screen.getByText('Reject Optional'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(AppStorage.setCookieConsent).toHaveBeenCalledWith({
      essential: true,
      analytics: false,
      marketing: false,
    });
  });

  it('opens settings when "Settings" is clicked', () => {
    render(<CookieConsent />);
    vi.advanceTimersByTime(1600);
    fireEvent.click(screen.getByText('Settings'));
    expect(screen.getByText('Cookie Settings')).toBeInTheDocument();
  });
});
