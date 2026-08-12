import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageCode, LANGUAGE_OPTIONS, LanguageOption, translations } from '../i18n/translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
  currentLanguageOption: LanguageOption;
  languageOptions: LanguageOption[];
}

const STORAGE_KEY = '@pdd_app_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        let savedLang: string | null = null;
        if (typeof window !== 'undefined' && window.localStorage) {
          savedLang = window.localStorage.getItem(STORAGE_KEY);
        }
        if (!savedLang) {
          savedLang = await AsyncStorage.getItem(STORAGE_KEY);
        }
        if (savedLang && translations[savedLang as LanguageCode]) {
          setLanguageState(savedLang as LanguageCode);
        }
      } catch (e) {
        console.warn('Could not load saved language preference:', e);
      }
    };
    loadSavedLanguage();
  }, []);

  const setLanguage = async (lang: LanguageCode) => {
    if (!translations[lang]) return;
    setLanguageState(lang);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, lang);
      }
      await AsyncStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Could not save language preference:', e);
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const dict = translations[language] || translations.en;
    let text = dict[key] || translations.en[key] || key;

    if (params) {
      Object.keys(params).forEach((paramKey) => {
        text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(params[paramKey]));
      });
    }

    return text;
  };

  const currentLanguageOption =
    LANGUAGE_OPTIONS.find((opt) => opt.code === language) || LANGUAGE_OPTIONS[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentLanguageOption,
        languageOptions: LANGUAGE_OPTIONS,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
