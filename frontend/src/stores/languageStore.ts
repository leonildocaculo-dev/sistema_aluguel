import { create } from 'zustand';
import type { Locale } from '../i18n/translations';

const LUSOPHONE_COUNTRIES = ['AO', 'BR', 'PT', 'MZ', 'CV', 'GW', 'ST', 'TL'];

interface LanguageState {
  locale: Locale;
  detected: boolean;
  setLocale: (locale: Locale) => void;
  autoDetect: () => Promise<void>;
}

function getStoredLocale(): Locale {
  // Always return 'pt' for initial SSR render to prevent hydration mismatch
  return 'pt';
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  locale: getStoredLocale(),
  detected: false,
  setLocale: (locale: Locale) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('angolastay_locale', locale);
      document.documentElement.lang = locale;
    }
    set({ locale });
  },
  autoDetect: async () => {
    if (get().detected) return;
    // Don't override if user already chose manually
    if (typeof window !== 'undefined' && localStorage.getItem('angolastay_locale')) {
      set({ detected: true });
      return;
    }
    try {
      const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
      const data = await res.json();
      const country = data.country_code || 'AO';
      const isLusophone = LUSOPHONE_COUNTRIES.includes(country);
      const locale: Locale = isLusophone ? 'pt' : 'en';
      if (typeof window !== 'undefined') {
        localStorage.setItem('angolastay_locale', locale);
        document.documentElement.lang = locale;
      }
      set({ locale, detected: true });
    } catch {
      set({ detected: true }); // fallback to default 'pt'
    }
  }
}));
