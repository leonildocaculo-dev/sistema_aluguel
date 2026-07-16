import translations, { type Locale } from './translations';
import { useLanguageStore } from '../stores/languageStore';

export function useTranslation() {
  const locale = useLanguageStore((s) => s.locale);

  function t(key: string): string {
    return translations[locale]?.[key] || translations['pt']?.[key] || key;
  }

  return { t, locale };
}
