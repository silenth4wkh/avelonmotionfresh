import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/components/sections/Header';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/en',
}));

vi.mock('next/link', () => ({
  default: ({ children, href, onClick }: { children: React.ReactNode; href: string; onClick?: () => void }) => (
    <a href={href} onClick={onClick}>{children}</a>
  ),
}));

vi.mock('@/lib/storage', () => ({
  AppStorage: {
    setLanguage: vi.fn(),
  },
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(document, 'getElementById').mockReturnValue(null);
  });

  it('renders the brand name', () => {
    render(<Header lang="en" />);
    expect(screen.getByText('AVELON MOTION')).toBeInTheDocument();
  });

  it('renders navigation items', () => {
    render(<Header lang="en" />);
    expect(screen.getAllByText('nav.about').length).toBeGreaterThan(0);
    expect(screen.getAllByText('nav.services').length).toBeGreaterThan(0);
    expect(screen.getAllByText('nav.faq').length).toBeGreaterThan(0);
  });

  it('shows language toggle button', () => {
    render(<Header lang="en" />);
    const langButtons = screen.getAllByText('EN');
    expect(langButtons.length).toBeGreaterThan(0);
  });

  it('toggles mobile menu when hamburger is clicked', () => {
    render(<Header lang="en" />);
    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);
    expect(screen.getByRole('dialog', { name: 'Mobile navigation' })).toBeInTheDocument();
  });

  it('closes mobile menu when backdrop is clicked', () => {
    render(<Header lang="en" />);
    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);
    const dialog = screen.getByRole('dialog', { name: 'Mobile navigation' });
    const backdrop = dialog.querySelector('[aria-hidden="true"]');
    if (backdrop) fireEvent.click(backdrop as Element);
    expect(screen.queryByRole('dialog', { name: 'Mobile navigation' })).not.toBeInTheDocument();
  });
});
