"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { LocaleSlug, defaultLocale } from "@/i18n/config";
import { loadTranslations, getTranslation } from "@/lib/translations";
import { getStoredLocale, setStoredLocale } from "@/lib/locale-storage";
import "@/lib/preload-translations"; // Pre-load translations

interface TranslationContextType {
  locale: LocaleSlug;
  setLocale: (locale: LocaleSlug) => void;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined,
);

interface TranslationProviderProps {
  children: ReactNode;
  initialLocale?: LocaleSlug;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  children,
  initialLocale,
}) => {
  const [locale, setLocaleState] = useState<LocaleSlug>(
    initialLocale || defaultLocale,
  );
  const [isLoading, setIsLoading] = useState(true);

  // Initialize locale from storage or initial value
  useEffect(() => {
    const initializeLocale = async () => {
      setIsLoading(true);

      const storedLocale = getStoredLocale();
      const targetLocale = initialLocale || storedLocale;

      // Pre-load both locales to avoid runtime loading issues
      try {
        await Promise.all([loadTranslations("en"), loadTranslations("ar")]);
      } catch (error) {
        console.error("Failed to pre-load translations:", error);
      }

      setLocaleState(targetLocale);
      setStoredLocale(targetLocale);
      setIsLoading(false);
    };

    initializeLocale();
  }, [initialLocale]);

  const setLocale = async (newLocale: LocaleSlug) => {
    if (newLocale === locale) return;

    setIsLoading(true);

    // Load translations for the new locale
    await loadTranslations(newLocale);

    setLocaleState(newLocale);
    setStoredLocale(newLocale);
    setIsLoading(false);
  };

  return (
    <TranslationContext.Provider value={{ locale, setLocale, isLoading }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Hook to use translation context
export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error(
      "useTranslationContext must be used within a TranslationProvider",
    );
  }
  return context;
};

// Main translation hook - compatible with next-intl's useTranslations
export const useTranslations = (namespace?: string) => {
  const { locale } = useTranslationContext();

  return (key: string, params?: Record<string, unknown>) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return getTranslation(locale, fullKey, params);
  };
};

// Hook to get current locale - compatible with next-intl's useLocale
export const useLocale = () => {
  const { locale } = useTranslationContext();
  return locale;
};
