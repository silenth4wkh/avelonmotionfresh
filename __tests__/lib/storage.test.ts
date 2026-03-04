import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  isStorageAvailable,
  setStorageItem,
  getStorageItem,
  removeStorageItem,
  AppStorage,
} from '@/lib/storage';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string): string | null => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
    [Symbol.iterator]: vi.fn(function* () { yield* Object.keys(store); }),
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('isStorageAvailable', () => {
  it('returns true when localStorage is working', () => {
    expect(isStorageAvailable()).toBe(true);
  });
});

describe('setStorageItem / getStorageItem', () => {
  beforeEach(() => localStorageMock.clear());

  it('stores and retrieves a string', () => {
    setStorageItem('testKey', 'hello');
    const result = getStorageItem<string>('testKey', 'default');
    expect(result).toBe('hello');
  });

  it('stores and retrieves an object', () => {
    const obj = { a: 1, b: true };
    setStorageItem('objKey', obj);
    const result = getStorageItem<typeof obj>('objKey', { a: 0, b: false });
    expect(result).toEqual(obj);
  });

  it('returns defaultValue when key does not exist', () => {
    const result = getStorageItem<string>('nonexistent', 'fallback');
    expect(result).toBe('fallback');
  });

  it('returns defaultValue when validator fails', () => {
    setStorageItem('langKey', 'invalid');
    const isLang = (v: unknown): v is 'en' | 'hu' => v === 'en' || v === 'hu';
    const result = getStorageItem<'en' | 'hu'>('langKey', 'en', isLang);
    expect(result).toBe('en');
  });
});

describe('removeStorageItem', () => {
  beforeEach(() => localStorageMock.clear());

  it('removes an existing item', () => {
    setStorageItem('toRemove', 'value');
    removeStorageItem('toRemove');
    const result = getStorageItem<string>('toRemove', 'gone');
    expect(result).toBe('gone');
  });
});

describe('AppStorage', () => {
  beforeEach(() => localStorageMock.clear());

  describe('language', () => {
    it('returns default "en" when no preference saved', () => {
      expect(AppStorage.getLanguage()).toBe('en');
    });

    it('saves and retrieves "hu" language', () => {
      AppStorage.setLanguage('hu');
      expect(AppStorage.getLanguage()).toBe('hu');
    });

    it('saves and retrieves "en" language', () => {
      AppStorage.setLanguage('en');
      expect(AppStorage.getLanguage()).toBe('en');
    });
  });

  describe('cookieConsent', () => {
    it('returns null when no consent saved', () => {
      expect(AppStorage.getCookieConsent()).toBeNull();
    });

    it('saves and retrieves cookie consent string', () => {
      AppStorage.setCookieConsent('all');
      expect(AppStorage.getCookieConsent()).toBe('all');
    });

    it('saves and retrieves consent date', () => {
      const date = new Date().toISOString();
      AppStorage.setCookieConsentDate(date);
      expect(AppStorage.getCookieConsentDate()).toBe(date);
    });
  });

  describe('cookiePreferences', () => {
    it('returns default preferences when none saved', () => {
      const prefs = AppStorage.getCookiePreferences();
      expect(prefs).toEqual({
        analytics: false,
        marketing: false,
        personalization: false,
      });
    });

    it('saves and retrieves cookie preferences', () => {
      const newPrefs = { analytics: true, marketing: false, personalization: true };
      AppStorage.setCookiePreferences(newPrefs);
      expect(AppStorage.getCookiePreferences()).toEqual(newPrefs);
    });
  });
});
