import { loadTranslations } from "./translations";
import { LocaleSlug } from "@/i18n/config";

// Pre-load translations at module level for build-time availability
const preloadTranslations = () => {
  const locales: LocaleSlug[] = ["en", "ar"];

  locales.forEach((locale) => {
    try {
      // Force synchronous loading for build-time
      if (typeof window === "undefined") {
        require(`@/i18n/translations/${locale}.json`);
      }
    } catch (error) {
      console.warn(`Could not preload translations for ${locale}:`, error);
    }
  });
};

// Execute preloading
preloadTranslations();

export { preloadTranslations };
