"use client";

import { useEffect, useState } from 'react';
import { useLanguageStore } from '../../stores/languageStore';
import { Locale } from '../../i18n/translations';

export function LanguageInitializer() {
  const autoDetect = useLanguageStore((s) => s.autoDetect);
  const locale = useLanguageStore((s) => s.locale);
  const setLocale = useLanguageStore((s) => s.setLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('angolastay_locale') as Locale;
    if (stored) {
      setLocale(stored);
    } else {
      autoDetect();
    }
  }, [autoDetect, setLocale]);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale;
    }
  }, [locale, mounted]);

  return null;
}
