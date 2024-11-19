import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { LocaleSlug } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = (await requestLocale) as LocaleSlug;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale as LocaleSlug;
  }

  return {
    locale,
    messages: (await import(`./translations/${locale}.json`)).default,
  };
});
