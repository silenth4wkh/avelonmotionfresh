import type { Language } from '@/types/language';

const QUOTA_WARNING_THRESHOLD = 5 * 1024 * 1024;

export const isStorageAvailable = (): boolean => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

export const checkStorageQuota = (): { used: number; percentage: number; nearLimit: boolean } => {
  try {
    let total = 0;
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        total += (localStorage[key]?.length ?? 0) + key.length;
      }
    }
    const estimatedLimit = 10 * 1024 * 1024;
    return {
      used: total,
      percentage: Math.round((total / estimatedLimit) * 100),
      nearLimit: total > QUOTA_WARNING_THRESHOLD,
    };
  } catch {
    return { used: 0, percentage: 0, nearLimit: false };
  }
};

export const setStorageItem = <T>(key: string, value: T): boolean => {
  if (!key || typeof key !== 'string') return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Storage] Failed to set item:', key, error);
    }
    return false;
  }
};

export const getStorageItem = <T>(
  key: string,
  defaultValue: T,
  validator?: (v: unknown) => v is T
): T => {
  if (!key || typeof key !== 'string') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    const parsed: unknown = JSON.parse(item);
    if (validator && !validator(parsed)) return defaultValue;
    return parsed as T;
  } catch {
    return defaultValue;
  }
};

export const removeStorageItem = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

const isLanguage = (v: unknown): v is Language =>
  v === 'en' || v === 'hu';

export interface CookiePreferences {
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

const DEFAULT_COOKIE_PREFS: CookiePreferences = {
  analytics: false,
  marketing: false,
  personalization: false,
};

const isCookiePreferences = (v: unknown): v is CookiePreferences =>
  typeof v === 'object' &&
  v !== null &&
  'analytics' in v &&
  'marketing' in v &&
  'personalization' in v;

export const AppStorage = {
  getLanguage: (): Language =>
    getStorageItem<Language>('preferredLanguage', 'en', isLanguage),

  setLanguage: (language: Language): boolean =>
    setStorageItem('preferredLanguage', language),

  getCookieConsent: (): string | null =>
    getStorageItem<string | null>('cookieConsent', null),

  setCookieConsent: (consent: string | Record<string, unknown>): boolean =>
    setStorageItem('cookieConsent', typeof consent === 'string' ? consent : JSON.stringify(consent)),

  getCookiePreferences: (): CookiePreferences =>
    getStorageItem<CookiePreferences>('cookiePreferences', DEFAULT_COOKIE_PREFS, isCookiePreferences),

  setCookiePreferences: (preferences: CookiePreferences): boolean =>
    setStorageItem('cookiePreferences', preferences),

  getCookieConsentDate: (): string | null =>
    getStorageItem<string | null>('cookieConsentDate', null),

  setCookieConsentDate: (date: string): boolean =>
    setStorageItem('cookieConsentDate', date),
};
