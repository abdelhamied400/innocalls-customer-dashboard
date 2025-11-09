// Import translations statically for build-time availability
import enTranslations from "@/i18n/translations/en.json";
import arTranslations from "@/i18n/translations/ar.json";

// Pre-load translations at module level for build-time availability
const preloadTranslations = () => {
  // Translations are already loaded via static imports above
  // This function is kept for compatibility but no longer needed
  if (typeof window === "undefined") {
    // Access translations to ensure they're bundled
    void { en: enTranslations, ar: arTranslations };
  }
};

// Execute preloading
preloadTranslations();

export { preloadTranslations };
