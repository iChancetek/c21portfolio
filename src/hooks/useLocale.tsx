'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import en from '@/locales/en.json';
import es from '@/locales/es.json';
import fr from '@/locales/fr.json';
import zh from '@/locales/zh.json';
import hi from '@/locales/hi.json';
import ar from '@/locales/ar.json';
import de from '@/locales/de.json';
import pt from '@/locales/pt.json';
import ko from '@/locales/ko.json';
import ja from '@/locales/ja.json';

type Locale = 'en' | 'es' | 'fr' | 'zh' | 'hi' | 'ar' | 'de' | 'pt' | 'ko' | 'ja';

const locales: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  zh: '中文 (简体)',
  hi: 'हिन्दी',
  ar: 'العربية',
  de: 'Deutsch',
  pt: 'Português (Brasil)',
  ko: '한국어',
  ja: '日本語',
};

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
  locales: Record<Locale, string>;
}

const translations: Record<Locale, Record<string, string>> = { en, es, fr, zh, hi, ar, de, pt, ko, ja };

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && Object.keys(locales).includes(savedLocale)) {
      setLocaleState(savedLocale);
    } else {
        const browserLang = navigator.language.split('-')[0] as Locale;
        if (Object.keys(locales).includes(browserLang)) {
            setLocaleState(browserLang);
        }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    localStorage.setItem('locale', newLocale);
    setLocaleState(newLocale);
    document.documentElement.lang = newLocale;
  };

  const t = useCallback((key: string, values?: Record<string, string | number>): string => {
    let translation = translations[locale]?.[key] || translations['en'][key] || key;

    if (values) {
      Object.keys(values).forEach(valueKey => {
        const regex = new RegExp(`{${valueKey}}`, 'g');
        translation = translation.replace(regex, String(values[valueKey]));
      });
    }

    return translation;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, locales }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
