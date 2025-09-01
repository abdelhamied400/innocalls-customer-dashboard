import { LocaleSlug, defaultLocale } from "@/i18n/config";

const LOCALE_STORAGE_KEY = "app-locale";

// Get locale from localStorage or default
export const getStoredLocale = (): LocaleSlug => {
  if (typeof window === "undefined") return defaultLocale;

  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  return (stored as LocaleSlug) || defaultLocale;
};

// Set locale in localStorage
export const setStoredLocale = (locale: LocaleSlug): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem(LOCALE_STORAGE_KEY, locale);

  // Update document direction for RTL languages
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = locale;
};
