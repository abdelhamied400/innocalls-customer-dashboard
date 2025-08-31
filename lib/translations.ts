import { LocaleSlug, defaultLocale } from "@/i18n/config";

// Store for translation messages
const translationStore: Record<LocaleSlug, Record<string, any>> = {
  en: {},
  ar: {},
};

// Load translation messages
export const loadTranslations = async (locale: LocaleSlug) => {
  if (Object.keys(translationStore[locale]).length === 0) {
    try {
      const translations = await import(`@/i18n/translations/${locale}.json`);
      translationStore[locale] = translations.default;
    } catch (error) {
      console.error(`Failed to load translations for locale: ${locale}`, error);
      // Fallback to default locale if loading fails
      if (locale !== defaultLocale) {
        const fallbackTranslations = await import(
          `@/i18n/translations/${defaultLocale}.json`
        );
        translationStore[locale] = fallbackTranslations.default;
      }
    }
  }
  return translationStore[locale];
};

// Get nested property from object using dot notation
export const getNestedProperty = (obj: any, path: string): any => {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

// Replace placeholders in translation strings
export const replacePlaceholders = (
  text: string,
  params: Record<string, any> = {}
): string => {
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match;
  });
};

// Get translation for a specific key
export const getTranslation = (
  locale: LocaleSlug,
  key: string,
  params?: Record<string, any>
): string => {
  const messages = translationStore[locale];
  if (!messages) {
    console.warn(`Translations not loaded for locale: ${locale}`);
    return key;
  }

  const translation = getNestedProperty(messages, key);

  if (translation === undefined) {
    console.warn(`Translation key not found: ${key} for locale: ${locale}`);
    // Fallback to default locale
    if (locale !== defaultLocale) {
      const fallbackMessages = translationStore[defaultLocale];
      const fallbackTranslation = getNestedProperty(fallbackMessages, key);
      if (fallbackTranslation !== undefined) {
        return typeof fallbackTranslation === "string"
          ? replacePlaceholders(fallbackTranslation, params)
          : fallbackTranslation;
      }
    }
    return key;
  }

  return typeof translation === "string"
    ? replacePlaceholders(translation, params)
    : translation;
};
