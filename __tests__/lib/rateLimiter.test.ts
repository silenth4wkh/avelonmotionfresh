import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RateLimiter } from '@/lib/rateLimiter';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('RateLimiter', () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    limiter = new RateLimiter(3, 900_000, 'test_rate_limit');
  });

  describe('canSubmit', () => {
    it('allows submission when no attempts recorded', () => {
      expect(limiter.canSubmit()).toBe(true);
    });

    it('allows submission under the limit', () => {
      limiter.recordAttempt();
      limiter.recordAttempt();
      expect(limiter.canSubmit()).toBe(true);
    });

    it('blocks submission at the limit', () => {
      limiter.recordAttempt();
      limiter.recordAttempt();
      limiter.recordAttempt();
      expect(limiter.canSubmit()).toBe(false);
    });
  });

  describe('recordAttempt', () => {
    it('records attempts correctly', () => {
      limiter.recordAttempt();
      expect(limiter.getRemainingAttempts()).toBe(2);

      limiter.recordAttempt();
      expect(limiter.getRemainingAttempts()).toBe(1);
    });

    it('returns 0 remaining when limit is reached', () => {
      limiter.recordAttempt();
      limiter.recordAttempt();
      limiter.recordAttempt();
      expect(limiter.getRemainingAttempts()).toBe(0);
    });
  });

  describe('getTimeUntilNextAttempt', () => {
    it('returns 0 when can still submit', () => {
      expect(limiter.getTimeUntilNextAttempt()).toBe(0);
    });

    it('returns positive time when rate limited', () => {
      limiter.recordAttempt();
      limiter.recordAttempt();
      limiter.recordAttempt();
      expect(limiter.getTimeUntilNextAttempt()).toBeGreaterThan(0);
    });
  });

  describe('getTimeUntilNextAttemptFormatted', () => {
    it('returns "now" when no waiting needed', () => {
      expect(limiter.getTimeUntilNextAttemptFormatted()).toBe('now');
    });

    it('returns formatted time string when rate limited', () => {
      limiter.recordAttempt();
      limiter.recordAttempt();
      limiter.recordAttempt();
      const formatted = limiter.getTimeUntilNextAttemptFormatted();
      expect(formatted).toMatch(/minute/);
    });
  });

  describe('reset', () => {
    it('clears recorded attempts', () => {
      limiter.recordAttempt();
      limiter.recordAttempt();
      limiter.recordAttempt();
      expect(limiter.canSubmit()).toBe(false);

      limiter.reset();
      expect(limiter.canSubmit()).toBe(true);
    });
  });

  describe('isLocalStorageAvailable', () => {
    it('returns true in test environment', () => {
      expect(RateLimiter.isLocalStorageAvailable()).toBe(true);
    });
  });
});
